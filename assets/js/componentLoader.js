document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const siteBase = (document.documentElement.dataset.siteBase || '/').trim();

    const normalizeBase = (base) => {
        if (!base) return '/';
        if (!base.endsWith('/')) return `${base}/`;
        return base;
    };

    const buildPath = (path) => {
        const normalizedBase = normalizeBase(siteBase);
        if (path === '' || path === './') return normalizedBase;
        return `${normalizedBase}${path}`;
    };

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

    // Load Header
    if (headerPlaceholder) {
        loadComponent(headerPlaceholder, buildPath('assets/components/_header.html')).then(() => {
            const navLinks = headerPlaceholder.querySelectorAll('[data-nav]');
            const currentPath = window.location.pathname.replace(/index\\.html$/, '');

            navLinks.forEach((link) => {
                const target = link.dataset.nav || '';
                const href = buildPath(target);
                link.setAttribute('href', href);

                const targetPath = new URL(href, window.location.origin).pathname.replace(/index\\.html$/, '');
                if (currentPath === targetPath || (currentPath === '/' && targetPath === normalizeBase(siteBase))) {
                    link.classList.add('active');
                }
            });

            // Re-initialize main.js functions that depend on header presence
            if (typeof setupMobileMenu === 'function') {
                setupMobileMenu();
            }
        });
    }

    // Load Footer
    if (footerPlaceholder) {
        loadComponent(footerPlaceholder, buildPath('assets/components/_footer.html'));
    }
});
