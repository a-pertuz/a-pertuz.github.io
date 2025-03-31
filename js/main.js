// Function to load HTML components
function loadComponent(elementId, url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(error => {
            console.error(`Error loading component from ${url}:`, error);
            document.getElementById(elementId).innerHTML = `<p>Error loading content. Please refresh or try again later.</p>`;
        });
}

// Load all components when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load header component
    loadComponent('header-component', 'components/header.html');
    
    // Load navigation component
    loadComponent('nav-component', 'components/navigation.html');
    
    // Load table of contents if it exists
    if (document.getElementById('toc-component')) {
        loadComponent('toc-component', 'components/toc.html');
    }
    
    // Load tool components if they exist
    if (document.getElementById('segyrecover-component')) {
        loadComponent('segyrecover-component', 'tools/segyrecover.html');
    }
    
    if (document.getElementById('velrecover-component')) {
        loadComponent('velrecover-component', 'tools/velrecover.html');
    }
    
    if (document.getElementById('inseis-component')) {
        loadComponent('inseis-component', 'tools/inseis.html');
    }
    
    // Load additional section components
    if (document.getElementById('integration-component')) {
        loadComponent('integration-component', 'sections/integration.html');
    }
    
    if (document.getElementById('faq-component')) {
        loadComponent('faq-component', 'sections/faq.html');
    }
    
    if (document.getElementById('troubleshooting-component')) {
        loadComponent('troubleshooting-component', 'sections/troubleshooting.html');
    }
    
    if (document.getElementById('references-component')) {
        loadComponent('references-component', 'sections/references.html');
    }
    
    // Load footer component
    loadComponent('footer-component', 'components/footer.html');
    
    // Initialize TOC highlighting
    setTimeout(initTOC, 800);
});

// Handle dropdowns for sections
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for components to load before setting up event handlers
    setTimeout(function() {
        const sectionHeaders = document.querySelectorAll('.section-header');
        
        sectionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const toggle = this.querySelector('.section-toggle');
                
                // Toggle active class
                content.classList.toggle('active');
                toggle.classList.toggle('active');
            });
        });
        
        // Open the section if it's the target of a hash link when page loads
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const content = targetSection.querySelector('.section-content');
                const toggle = targetSection.querySelector('.section-toggle');
                
                if (content && toggle) {
                    content.classList.add('active');
                    toggle.classList.add('active');
                }
            }
        }
    }, 500);
});

// Copy text function for code blocks
function copyText(button) {
    const pre = button.parentElement;
    const code = pre.querySelector('code');
    
    if (code) {
        navigator.clipboard.writeText(code.textContent)
            .then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }
}

// Table of Contents highlighting
function initTOC() {
    const toc = document.getElementById('toc');
    if (!toc) return;
    
    // Get all TOC links
    const tocLinks = toc.querySelectorAll('a');
    
    // Add click event to TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            tocLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // If link has a parent li with a ul, expand it
            const parentLi = this.closest('li');
            if (parentLi && parentLi.querySelector('ul')) {
                parentLi.classList.add('active');
            }
        });
    });
    
    // Highlight active section based on scroll position
    window.addEventListener('scroll', debounce(function() {
        // Get all section headings
        const headings = document.querySelectorAll('h2[id], h3[id]');
        let current = '';
        
        headings.forEach(heading => {
            const sectionTop = heading.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = heading.getAttribute('id');
            }
        });
        
        // Remove active class from all links
        tocLinks.forEach(link => {
            link.classList.remove('active');
            const parentLi = link.closest('li');
            if (parentLi) {
                parentLi.classList.remove('active');
            }
        });
        
        // Add active class to current link
        if (current) {
            const activeLink = toc.querySelector(`a[href="#${current}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                
                // Expand parent if needed
                const parentLi = activeLink.closest('li');
                if (parentLi && parentLi.parentElement.tagName === 'UL' && 
                    parentLi.parentElement.parentElement.tagName === 'LI') {
                    parentLi.parentElement.parentElement.classList.add('active');
                }
            }
        }
    }, 100));
}

// Debounce function to limit scroll event firing
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Add detection for current page to highlight the right navigation item

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Highlight current page in navigation
    setTimeout(function() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('#')[0];
            if (linkPath === currentPath || 
                (currentPath === 'index.html' && linkPath.includes('index.html')) ||
                (currentPath === '' && linkPath.includes('index.html'))) {
                link.style.backgroundColor = 'rgba(255,255,255,0.2)';
                link.style.fontWeight = 'bold';
            }
        });
        
        // Add copy buttons to all code blocks that don't have them
        const preElements = document.querySelectorAll('pre');
        preElements.forEach(pre => {
            if (!pre.querySelector('.copy-btn')) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.textContent = 'Copy';
                copyBtn.onclick = function() { copyText(this); };
                pre.appendChild(copyBtn);
            }
        });
    }, 600);
});

// Add this new code to handle dropdowns

// Make dropdowns work for touch devices
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.parentElement;
                dropdown.classList.toggle('active');
                
                // Close other open dropdowns
                document.querySelectorAll('.dropdown.active').forEach(openDropdown => {
                    if (openDropdown !== dropdown) {
                        openDropdown.classList.remove('active');
                    }
                });
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }, 600);
});

// Simplify copy function
function copyToClipboard(button) {
    const code = button.previousElementSibling.textContent;
    navigator.clipboard.writeText(code.trim())
        .then(() => {
            button.textContent = 'Copied!';
            button.disabled = true;
            setTimeout(() => {
                button.textContent = 'Copy';
                button.disabled = false;
            }, 1500);
        });
}

// ...existing code...
