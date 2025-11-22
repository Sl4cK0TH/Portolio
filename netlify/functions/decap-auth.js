exports.handler = async (event) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const host = event.headers.host || '';
  const protocol = event.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${protocol}://${host}/.netlify/functions/decap-auth`;

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      body: 'Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET env vars.'
    };
  }

  const params = event.queryStringParameters || {};
  const code = params.code;

  if (!code) {
    const authorizeURL = new URL('https://github.com/login/oauth/authorize');
    authorizeURL.searchParams.set('client_id', clientId);
    authorizeURL.searchParams.set('redirect_uri', redirectUri);
    authorizeURL.searchParams.set('scope', 'repo,user');
    return {
      statusCode: 302,
      headers: { Location: authorizeURL.toString() }
    };
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri
      })
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok || tokenJson.error) {
      return {
        statusCode: 400,
        body: tokenJson.error_description || 'OAuth error'
      };
    }

    const script = `
      <script>
        (function() {
          function receiveMessage() {
            window.opener.postMessage('authorization:github:success:${tokenJson.access_token}', '*');
            window.close();
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })();
      </script>
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: script
    };
  } catch (err) {
    return { statusCode: 500, body: 'OAuth exchange failed.' };
  }
};
