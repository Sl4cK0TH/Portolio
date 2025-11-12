document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // Function to load HTML components
    async function loadComponent(placeholder, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            placeholder.innerHTML = html;
        } catch (error) {
            console.error(`Error loading component from ${componentPath}:`, error);
            placeholder.innerHTML = `<p>Error loading component.</p>`;
        }
    }

    // Determine the base path for fetching components
    // This handles cases where the current page is in a subdirectory (e.g., /about/index.html)
    const getBasePath = () => {
        const pathParts = window.location.pathname.split('/').filter(part => part.length > 0);
        // If the current page is in a subdirectory, we need to go up one level to reach assets/components
        if (pathParts.length > 1 && pathParts[pathParts.length - 1].endsWith('.html')) {
            return '../';
        }
        return '';
    };

    const basePath = getBasePath();

    // Load Header
    if (headerPlaceholder) {
        loadComponent(headerPlaceholder, `${basePath}assets/components/_header.html`).then(() => {
            // After header is loaded, re-initialize main.js functions that depend on it
            // These functions are expected to be globally available from main.js
            if (typeof initGlitchEffect === 'function') {
                initGlitchEffect();
            }
            if (typeof setupMobileMenu === 'function') {
                setupMobileMenu();
            }
        });
    }

    // Load Footer
    if (footerPlaceholder) {
        loadComponent(footerPlaceholder, `${basePath}assets/components/_footer.html`);
    }
});