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

    // Determine the base path for fetching components (relative to current document)
    // This is for fetching _header.html and _footer.html
    const getRelativePathToComponents = () => {
        const pathParts = window.location.pathname.split('/').filter(part => part.length > 0);
        // If the current page is in a subdirectory (e.g., /about/index.html), return '../'
        if (pathParts.length > 1 && pathParts[pathParts.length - 1].endsWith('.html')) {
            return '../';
        }
        return ''; // If at root (e.g., /index.html)
    };

    const relativePathToComponents = getRelativePathToComponents();

    // Function to adjust header links to be absolute from the site's base URL
    function adjustHeaderLinks(headerElement) {
        const links = headerElement.querySelectorAll('nav a, .logo a');
        
        // Determine the site's base URL (e.g., /Portolio/ for GitHub Pages)
        let siteBaseUrl = '/';
        const pathSegments = window.location.pathname.split('/').filter(segment => segment.length > 0);
        if (pathSegments.length > 0 && !pathSegments[0].endsWith('.html')) {
            // If the first segment is not an HTML file, assume it's the repository name
            siteBaseUrl = `/${pathSegments[0]}/`;
        }

        links.forEach(link => {
            let href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) { // Only adjust internal links
                // If the link is already absolute from the domain root, don't prepend siteBaseUrl
                if (href.startsWith('/')) {
                    link.setAttribute('href', `${siteBaseUrl}${href.substring(1)}`);
                } else {
                    // Prepend siteBaseUrl to relative links
                    link.setAttribute('href', `${siteBaseUrl}${href}`);
                }
            }
        });
    }

    // Load Header
    if (headerPlaceholder) {
        loadComponent(headerPlaceholder, `${relativePathToComponents}assets/components/_header.html`).then(() => {
            // After header is loaded, adjust its links
            adjustHeaderLinks(headerPlaceholder);

            // Re-initialize main.js functions that depend on it
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
        loadComponent(footerPlaceholder, `${relativePathToComponents}assets/components/_footer.html`);
    }
});
