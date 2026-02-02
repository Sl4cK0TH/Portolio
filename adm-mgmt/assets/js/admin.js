// ===== Configuration =====
// IMPORTANT: Update this URL after deploying your backend to Render
const API_BASE_URL = 'https://portolio-admin-backend.onrender.com';

// ===== State =====
let state = {
    user: null,
    achievements: { content: [], sha: null },
    site: { content: {}, sha: null },
    about: { content: {}, sha: null }
};

// ===== DOM Elements =====
const elements = {
    loginScreen: document.getElementById('login-screen'),
    adminPanel: document.getElementById('admin-panel'),
    githubLoginBtn: document.getElementById('github-login-btn'),
    loginError: document.getElementById('login-error'),
    logoutBtn: document.getElementById('logout-btn'),
    userAvatar: document.getElementById('user-avatar'),
    userName: document.getElementById('user-name'),
    navItems: document.querySelectorAll('.nav-item'),
    sections: document.querySelectorAll('.content-section'),
    toast: document.getElementById('toast'),
    loadingOverlay: document.getElementById('loading-overlay'),
    // Achievement elements
    achievementsList: document.getElementById('achievements-list'),
    addAchievementBtn: document.getElementById('add-achievement-btn'),
    achievementModal: document.getElementById('achievement-modal'),
    achievementForm: document.getElementById('achievement-form'),
    imageUploadArea: document.getElementById('image-upload-area'),
    imagePreview: document.getElementById('image-preview'),
    achievementImage: document.getElementById('achievement-image'),
    // Site form
    siteForm: document.getElementById('site-form'),
    socialLinksContainer: document.getElementById('social-links-container'),
    addSocialBtn: document.getElementById('add-social-btn'),
    quotesContainer: document.getElementById('quotes-container'),
    addQuoteBtn: document.getElementById('add-quote-btn'),
    // About form
    aboutForm: document.getElementById('about-form'),
    skillsContainer: document.getElementById('skills-container'),
    addSkillBtn: document.getElementById('add-skill-btn')
};

// ===== Utility Functions =====
function showLoading() {
    elements.loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    elements.loadingOverlay.style.display = 'none';
}

function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type} show`;
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// ===== Authentication =====
let authPopup = null;

async function checkAuth() {
    try {
        const user = await apiRequest('/auth/user');
        state.user = user;
        showAdminPanel();
        loadAllData();
    } catch {
        showLoginScreen();
    }
}

function openAuthPopup() {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    authPopup = window.open(
        `${API_BASE_URL}/auth/github`,
        'GitHub Login',
        `width=${width},height=${height},left=${left},top=${top}`
    );

    // Check if popup was closed or auth completed
    const checkPopup = setInterval(() => {
        if (authPopup && authPopup.closed) {
            clearInterval(checkPopup);
            // Check if we're now authenticated
            checkAuth();
        }
    }, 500);
}

function showLoginScreen() {
    elements.loginScreen.style.display = 'flex';
    elements.adminPanel.style.display = 'none';

    // Check for error in URL
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
        const messages = {
            'unauthorized': 'You are not authorized to access this panel.',
            'token_error': 'Authentication failed. Please try again.',
            'server_error': 'Server error. Please try again later.',
            'no_code': 'Authentication was cancelled.'
        };
        elements.loginError.textContent = messages[error] || 'Authentication failed.';
        window.history.replaceState({}, '', window.location.pathname);
    }
}

function showAdminPanel() {
    elements.loginScreen.style.display = 'none';
    elements.adminPanel.style.display = 'flex';

    // Update user info
    elements.userAvatar.src = state.user.avatar;
    elements.userName.textContent = state.user.username;

    // Clear success param from URL
    window.history.replaceState({}, '', window.location.pathname);
}

async function logout() {
    try {
        await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
        // Ignore errors
    }
    state.user = null;
    showLoginScreen();
}

// ===== Navigation =====
function switchSection(sectionId) {
    elements.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionId);
    });

    elements.sections.forEach(section => {
        section.classList.toggle('active', section.id === `section-${sectionId}`);
    });
}

// ===== Data Loading =====
async function loadAllData() {
    showLoading();
    try {
        const [achievements, site, about] = await Promise.all([
            apiRequest('/api/content/achievements.json'),
            apiRequest('/api/content/site.json'),
            apiRequest('/api/content/about.json')
        ]);

        state.achievements = achievements;
        state.site = site;
        state.about = about;

        renderDashboard();
        renderAchievements();
        renderSiteForm();
        renderAboutForm();

    } catch (error) {
        showToast('Failed to load data: ' + error.message, 'error');
    }
    hideLoading();
}

// ===== Dashboard =====
function renderDashboard() {
    document.getElementById('stat-achievements').textContent = state.achievements.content.length || 0;
    document.getElementById('stat-quotes').textContent = state.site.content.quotes?.length || 0;
    document.getElementById('stat-skills').textContent = state.about.content.skills?.length || 0;
}

// ===== Achievements =====
function renderAchievements() {
    const achievements = state.achievements.content;

    if (!achievements.length) {
        elements.achievementsList.innerHTML = `
      <div class="empty-state">
        <p>No achievements yet. Add your first certificate!</p>
      </div>
    `;
        return;
    }

    elements.achievementsList.innerHTML = achievements.map((a, index) => `
    <div class="achievement-card" data-index="${index}">
      <img src="../${a.image}" alt="${a.title}" class="achievement-card-image" 
           onerror="this.src='https://placehold.co/300x160?text=No+Image'">
      <div class="achievement-card-body">
        <h3 class="achievement-card-title">${a.title}</h3>
        <div class="achievement-card-meta">
          <span><i class="fas fa-calendar"></i> ${a.date || 'N/A'}</span>
          <span><i class="fas fa-building"></i> ${a.issuedBy || 'N/A'}</span>
        </div>
      </div>
      <div class="achievement-card-actions">
        <button class="icon-btn edit-achievement" data-index="${index}">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="icon-btn delete delete-achievement" data-index="${index}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `).join('');

    // Add event listeners
    document.querySelectorAll('.edit-achievement').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openAchievementModal(parseInt(btn.dataset.index));
        });
    });

    document.querySelectorAll('.delete-achievement').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteAchievement(parseInt(btn.dataset.index));
        });
    });
}

function openAchievementModal(index = null) {
    const modal = elements.achievementModal;
    const form = elements.achievementForm;

    // Reset form
    form.reset();
    elements.imagePreview.style.display = 'none';
    document.querySelector('.upload-placeholder').style.display = 'flex';

    if (index !== null) {
        // Edit mode
        document.getElementById('modal-title').textContent = 'Edit Achievement';
        const achievement = state.achievements.content[index];

        document.getElementById('achievement-id').value = achievement.id;
        document.getElementById('achievement-title').value = achievement.title || '';
        document.getElementById('achievement-date').value = achievement.date || '';
        document.getElementById('achievement-issuedBy').value = achievement.issuedBy || '';
        document.getElementById('achievement-description').value = achievement.description || '';
        document.getElementById('achievement-credentialId').value = achievement.credentialId || '';
        document.getElementById('achievement-credentialLink').value = achievement.credentialLink || '';

        // Show existing image
        if (achievement.image) {
            elements.imagePreview.src = '../' + achievement.image;
            elements.imagePreview.style.display = 'block';
            document.querySelector('.upload-placeholder').style.display = 'none';
        }

        form.dataset.editIndex = index;
    } else {
        // Add mode
        document.getElementById('modal-title').textContent = 'Add Achievement';
        delete form.dataset.editIndex;
    }

    modal.style.display = 'flex';
}

function closeAchievementModal() {
    elements.achievementModal.style.display = 'none';
}

async function saveAchievement(e) {
    e.preventDefault();

    const form = elements.achievementForm;
    const isEdit = form.dataset.editIndex !== undefined;
    const index = isEdit ? parseInt(form.dataset.editIndex) : -1;

    // Generate ID for new achievement
    const id = isEdit
        ? state.achievements.content[index].id
        : `${String(state.achievements.content.length + 1).padStart(3, '0')}-${document.getElementById('achievement-title').value.replace(/\s+/g, '')}`;

    const achievement = {
        id: id,
        title: document.getElementById('achievement-title').value,
        date: document.getElementById('achievement-date').value,
        issuedBy: document.getElementById('achievement-issuedBy').value,
        description: document.getElementById('achievement-description').value,
        credentialId: document.getElementById('achievement-credentialId').value,
        credentialLink: document.getElementById('achievement-credentialLink').value,
        image: isEdit ? state.achievements.content[index].image : ''
    };

    showLoading();

    try {
        // Handle image upload if new image selected
        const imageFile = elements.achievementImage.files[0];
        if (imageFile) {
            const base64 = await fileToBase64(imageFile);
            const imagePath = `achievements/assets/achievements/${id}/image.jpg`;

            await apiRequest('/api/upload', {
                method: 'POST',
                body: JSON.stringify({
                    path: imagePath,
                    content: base64.split(',')[1], // Remove data:image... prefix
                    message: `Upload image for ${achievement.title}`
                })
            });

            achievement.image = imagePath;
        }

        // Update achievements array
        const updatedAchievements = [...state.achievements.content];
        if (isEdit) {
            updatedAchievements[index] = achievement;
        } else {
            updatedAchievements.push(achievement);
        }

        // Save to GitHub
        const response = await apiRequest('/api/content/achievements.json', {
            method: 'PUT',
            body: JSON.stringify({
                content: updatedAchievements,
                sha: state.achievements.sha,
                message: isEdit ? `Update achievement: ${achievement.title}` : `Add achievement: ${achievement.title}`
            })
        });

        state.achievements.content = updatedAchievements;
        state.achievements.sha = response.sha;

        renderAchievements();
        renderDashboard();
        closeAchievementModal();
        showToast(isEdit ? 'Achievement updated!' : 'Achievement added!');

    } catch (error) {
        showToast('Failed to save: ' + error.message, 'error');
    }

    hideLoading();
}

async function deleteAchievement(index) {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    showLoading();

    try {
        const updatedAchievements = state.achievements.content.filter((_, i) => i !== index);

        const response = await apiRequest('/api/content/achievements.json', {
            method: 'PUT',
            body: JSON.stringify({
                content: updatedAchievements,
                sha: state.achievements.sha,
                message: `Delete achievement: ${state.achievements.content[index].title}`
            })
        });

        state.achievements.content = updatedAchievements;
        state.achievements.sha = response.sha;

        renderAchievements();
        renderDashboard();
        showToast('Achievement deleted!');

    } catch (error) {
        showToast('Failed to delete: ' + error.message, 'error');
    }

    hideLoading();
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
}

// ===== Site Form =====
function renderSiteForm() {
    const site = state.site.content;

    // Hero section
    document.getElementById('hero-title').value = site.hero?.title || '';
    document.getElementById('hero-name').value = site.hero?.name || '';
    document.getElementById('hero-description').value = site.hero?.description || '';

    // Social links
    elements.socialLinksContainer.innerHTML = '';
    (site.socialLinks || []).forEach((link, i) => addSocialLinkRow(link, i));

    // Quotes
    elements.quotesContainer.innerHTML = '';
    (site.quotes || []).forEach((quote, i) => addQuoteRow(quote, i));
}

function addSocialLinkRow(data = {}, index = null) {
    const row = document.createElement('div');
    row.className = 'dynamic-item';
    row.innerHTML = `
    <select name="social-platform-${index || Date.now()}" style="width: 120px;">
      <option value="facebook" ${data.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
      <option value="instagram" ${data.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
      <option value="linkedin" ${data.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
      <option value="twitter" ${data.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
      <option value="github" ${data.platform === 'github' ? 'selected' : ''}>GitHub</option>
      <option value="email" ${data.platform === 'email' ? 'selected' : ''}>Email</option>
    </select>
    <input type="text" name="social-url-${index || Date.now()}" placeholder="URL" value="${data.url || ''}">
    <button type="button" class="remove-btn"><i class="fas fa-times"></i></button>
  `;
    row.querySelector('.remove-btn').addEventListener('click', () => row.remove());
    elements.socialLinksContainer.appendChild(row);
}

function addQuoteRow(data = {}, index = null) {
    const row = document.createElement('div');
    row.className = 'dynamic-item';
    row.innerHTML = `
    <input type="text" name="quote-text-${index || Date.now()}" placeholder="Quote text" style="flex: 2;" value="${data.text || ''}">
    <input type="text" name="quote-author-${index || Date.now()}" placeholder="Author" value="${data.author || ''}">
    <button type="button" class="remove-btn"><i class="fas fa-times"></i></button>
  `;
    row.querySelector('.remove-btn').addEventListener('click', () => row.remove());
    elements.quotesContainer.appendChild(row);
}

async function saveSiteForm(e) {
    e.preventDefault();

    // Collect social links
    const socialLinks = [];
    const socialRows = elements.socialLinksContainer.querySelectorAll('.dynamic-item');
    socialRows.forEach(row => {
        const platform = row.querySelector('select').value;
        const url = row.querySelector('input[name^="social-url"]').value;
        if (url) {
            const iconMap = {
                facebook: 'fab fa-facebook-f',
                instagram: 'fab fa-instagram',
                linkedin: 'fab fa-linkedin-in',
                twitter: 'fab fa-twitter',
                github: 'fab fa-github',
                email: 'fas fa-envelope'
            };
            socialLinks.push({ platform, url, icon: iconMap[platform] });
        }
    });

    // Collect quotes
    const quotes = [];
    const quoteRows = elements.quotesContainer.querySelectorAll('.dynamic-item');
    quoteRows.forEach(row => {
        const text = row.querySelector('input[name^="quote-text"]').value;
        const author = row.querySelector('input[name^="quote-author"]').value;
        if (text) {
            quotes.push({ text, author });
        }
    });

    const updatedSite = {
        hero: {
            title: document.getElementById('hero-title').value,
            name: document.getElementById('hero-name').value,
            description: document.getElementById('hero-description').value,
            profileImage: state.site.content.hero?.profileImage || 'assets/images/profile.jpg'
        },
        socialLinks,
        quotes
    };

    showLoading();

    try {
        const response = await apiRequest('/api/content/site.json', {
            method: 'PUT',
            body: JSON.stringify({
                content: updatedSite,
                sha: state.site.sha,
                message: 'Update site settings via admin panel'
            })
        });

        state.site.content = updatedSite;
        state.site.sha = response.sha;

        renderDashboard();
        showToast('Site settings saved!');

    } catch (error) {
        showToast('Failed to save: ' + error.message, 'error');
    }

    hideLoading();
}

// ===== About Form =====
function renderAboutForm() {
    const about = state.about.content;

    // Profile
    document.getElementById('profile-firstName').value = about.profile?.firstName || '';
    document.getElementById('profile-lastName').value = about.profile?.lastName || '';
    document.getElementById('profile-pseudonym').value = about.profile?.pseudonym || '';
    document.getElementById('profile-age').value = about.profile?.age || '';
    document.getElementById('profile-tagline').value = about.profile?.tagline || '';
    document.getElementById('profile-bio').value = about.profile?.bio || '';

    // Skills
    elements.skillsContainer.innerHTML = '';
    (about.skills || []).forEach((skill, i) => addSkillRow(skill, i));
}

function addSkillRow(data = {}, index = null) {
    const row = document.createElement('div');
    row.className = 'dynamic-item';
    row.innerHTML = `
    <input type="text" name="skill-name-${index || Date.now()}" placeholder="Skill name" value="${data.name || ''}">
    <input type="number" name="skill-value-${index || Date.now()}" placeholder="%" min="0" max="100" style="width: 80px;" value="${data.value || 50}">
    <button type="button" class="remove-btn"><i class="fas fa-times"></i></button>
  `;
    row.querySelector('.remove-btn').addEventListener('click', () => row.remove());
    elements.skillsContainer.appendChild(row);
}

async function saveAboutForm(e) {
    e.preventDefault();

    // Collect skills
    const skills = [];
    const skillRows = elements.skillsContainer.querySelectorAll('.dynamic-item');
    skillRows.forEach(row => {
        const name = row.querySelector('input[name^="skill-name"]').value;
        const value = parseInt(row.querySelector('input[name^="skill-value"]').value) || 50;
        if (name) {
            skills.push({ name, value });
        }
    });

    const updatedAbout = {
        profile: {
            ...state.about.content.profile,
            firstName: document.getElementById('profile-firstName').value,
            lastName: document.getElementById('profile-lastName').value,
            pseudonym: document.getElementById('profile-pseudonym').value,
            age: parseInt(document.getElementById('profile-age').value) || 0,
            tagline: document.getElementById('profile-tagline').value,
            bio: document.getElementById('profile-bio').value
        },
        skills,
        education: state.about.content.education || []
    };

    showLoading();

    try {
        const response = await apiRequest('/api/content/about.json', {
            method: 'PUT',
            body: JSON.stringify({
                content: updatedAbout,
                sha: state.about.sha,
                message: 'Update about page via admin panel'
            })
        });

        state.about.content = updatedAbout;
        state.about.sha = response.sha;

        renderDashboard();
        showToast('About page saved!');

    } catch (error) {
        showToast('Failed to save: ' + error.message, 'error');
    }

    hideLoading();
}

// ===== Event Listeners =====
function initEventListeners() {
    // Auth
    elements.githubLoginBtn.addEventListener('click', () => {
        openAuthPopup();
    });

    elements.logoutBtn.addEventListener('click', logout);

    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(item.dataset.section);
        });
    });

    // Quick actions
    document.querySelectorAll('.action-btn[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.goto));
    });

    // Achievements
    elements.addAchievementBtn.addEventListener('click', () => openAchievementModal());
    elements.achievementForm.addEventListener('submit', saveAchievement);

    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', closeAchievementModal);
    });

    elements.achievementModal.addEventListener('click', (e) => {
        if (e.target === elements.achievementModal) closeAchievementModal();
    });

    // Image upload
    elements.imageUploadArea.addEventListener('click', () => elements.achievementImage.click());
    elements.achievementImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                elements.imagePreview.src = e.target.result;
                elements.imagePreview.style.display = 'block';
                document.querySelector('.upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Site form
    elements.siteForm.addEventListener('submit', saveSiteForm);
    elements.addSocialBtn.addEventListener('click', () => addSocialLinkRow());
    elements.addQuoteBtn.addEventListener('click', () => addQuoteRow());

    // About form
    elements.aboutForm.addEventListener('submit', saveAboutForm);
    elements.addSkillBtn.addEventListener('click', () => addSkillRow());
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    checkAuth();
});
