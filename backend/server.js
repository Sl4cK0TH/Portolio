const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const { Octokit } = require('octokit');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (required for Render and other PaaS platforms)
app.set('trust proxy', 1);

// Environment variables (set in Render dashboard)
const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_ALLOWED_USER,
  SESSION_SECRET,
  GITHUB_REPO,
  FRONTEND_URL
} = process.env;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_URL || 'http://localhost:5500',
  credentials: true
}));

// JWT helper functions
function createToken(data) {
  return jwt.sign(data, SESSION_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SESSION_SECRET);
  } catch {
    return null;
  }
}

// Auth middleware
function requireAuth(req, res, next) {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = payload;
  next();
}

// ===== AUTH ROUTES =====

// Start GitHub OAuth flow
app.get('/auth/github', (req, res) => {
  const redirectUri = `${req.protocol}://${req.get('host')}/auth/callback`;
  const scope = 'repo';
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  res.redirect(authUrl);
});

// GitHub OAuth callback
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/adm-mgmt/?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.redirect(`${FRONTEND_URL}/adm-mgmt/?error=token_error`);
    }

    const accessToken = tokenData.access_token;

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const userData = await userResponse.json();

    // Check if user is allowed
    if (userData.login !== GITHUB_ALLOWED_USER) {
      return res.redirect(`${FRONTEND_URL}/adm-mgmt/?error=unauthorized`);
    }

    // Create JWT token
    const token = createToken({
      username: userData.login,
      avatar: userData.avatar_url,
      accessToken: accessToken
    });

    // Set cookie and redirect
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.redirect(`${FRONTEND_URL}/adm-mgmt/?success=true`);

  } catch (error) {
    console.error('Auth error:', error);
    res.redirect(`${FRONTEND_URL}/adm-mgmt/?error=server_error`);
  }
});

// Get current user
app.get('/auth/user', requireAuth, (req, res) => {
  res.json({
    username: req.user.username,
    avatar: req.user.avatar
  });
});

// Logout
app.post('/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

// ===== CONTENT API ROUTES =====

// Get content file from repo
app.get('/api/content/:file', requireAuth, async (req, res) => {
  const { file } = req.params;
  const allowedFiles = ['achievements.json', 'site.json', 'about.json'];

  if (!allowedFiles.includes(file)) {
    return res.status(400).json({ error: 'File not allowed' });
  }

  try {
    const octokit = new Octokit({ auth: req.user.accessToken });
    const [owner, repo] = GITHUB_REPO.split('/');

    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: `data/${file}`
    });

    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');

    res.json({
      content: JSON.parse(content),
      sha: response.data.sha
    });

  } catch (error) {
    console.error('Get content error:', error);
    if (error.status === 404) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Update content file in repo
app.put('/api/content/:file', requireAuth, async (req, res) => {
  const { file } = req.params;
  const { content, sha, message } = req.body;
  const allowedFiles = ['achievements.json', 'site.json', 'about.json'];

  if (!allowedFiles.includes(file)) {
    return res.status(400).json({ error: 'File not allowed' });
  }

  try {
    const octokit = new Octokit({ auth: req.user.accessToken });
    const [owner, repo] = GITHUB_REPO.split('/');

    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `data/${file}`,
      message: message || `Update ${file} via admin panel`,
      content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
      sha: sha
    });

    res.json({
      success: true,
      sha: response.data.content.sha,
      commit: response.data.commit.sha
    });

  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Upload image to repo
app.post('/api/upload', requireAuth, async (req, res) => {
  const { path, content, message } = req.body;

  // Validate path (must be in achievements assets)
  if (!path.startsWith('achievements/assets/achievements/')) {
    return res.status(400).json({ error: 'Invalid upload path' });
  }

  try {
    const octokit = new Octokit({ auth: req.user.accessToken });
    const [owner, repo] = GITHUB_REPO.split('/');

    // Check if file exists (to get SHA for update)
    let sha;
    try {
      const existing = await octokit.rest.repos.getContent({
        owner,
        repo,
        path
      });
      sha = existing.data.sha;
    } catch (e) {
      // File doesn't exist, that's fine
    }

    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: message || `Upload image via admin panel`,
      content: content, // Already base64 encoded
      sha: sha
    });

    res.json({
      success: true,
      path: path,
      sha: response.data.content.sha
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
