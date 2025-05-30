document.addEventListener('DOMContentLoaded', () => {
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  const mobileMenu = document.getElementById('mobileMenu');
  const body = document.body;
  const menuLinks = document.querySelectorAll('.menu-link');
  const pageIframe = document.getElementById('pageIframe');
  const iframeErrorMessage = document.getElementById('iframeErrorMessage');
  const mobileMenuUl = mobileMenu.querySelector('ul'); // Get the ul element
  
  // --- Function to close mobile menu ---
  const closeMobileMenu = () => {
    // Only close on mobile (when hamburger is conceptually active)
    if (window.innerWidth < 768) {
      hamburgerIcon.classList.remove('open');
      mobileMenu.classList.remove('open');
      body.classList.remove('no-scroll');
      // Reset scroll position of the menu list when closing
      mobileMenuUl.scrollTop = 0;
    }
  };
  
  // --- Hamburger Menu Toggle & Animation ---
  hamburgerIcon.addEventListener('click', () => {
    hamburgerIcon.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    body.classList.toggle('no-scroll');
    // If the menu is being opened, ensure it's scrolled to the top
    if (mobileMenu.classList.contains('open')) {
      mobileMenuUl.scrollTop = 0;
    }
  });
  
  // --- Function to show/hide iframe and error message ---
  const showIframe = () => {
    pageIframe.style.display = 'block';
    iframeErrorMessage.style.display = 'none';
  };
  
  const showErrorMessage = () => {
    pageIframe.style.display = 'none';
    iframeErrorMessage.style.display = 'block';
  };
  
  // --- Close Menu on Link Click & Iframe Loading ---
  menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link behavior
      
      closeMobileMenu(); // Close menu when a link is clicked
      
      // Active Link Highlighting
      menuLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
      
      // Load page into iframe
      const url = link.getAttribute('data-src');
      
      // Attempt to load the URL
      pageIframe.src = url;
      
      // Add an event listener to detect iframe loading errors
      pageIframe.onload = () => {
        setTimeout(() => {
          try {
            if (pageIframe.contentWindow && pageIframe.contentWindow.location.href === 'about:blank' && url !== 'about:blank') {
              showErrorMessage();
            } else {
              showIframe();
            }
          } catch (e) {
            // This catch block will typically execute if X-Frame-Options is present
            showErrorMessage();
          }
        }, 50); // Small delay to allow potential X-Frame-Options blocking
      };
      
      // Handle initial 'about:blank' state
      if (url === 'about:blank') {
        showErrorMessage();
      }
    });
  });
  
  // --- Close Menu on Click Outside (Mobile Only) ---
  document.addEventListener('click', (event) => {
    // Check if menu is open AND if click is outside hamburger AND menu
    if (window.innerWidth < 768 && mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(event.target) && !hamburgerIcon.contains(event.target)) {
      
      closeMobileMenu();
    }
  });
  
  // --- Initial Load ---
  const initialActiveLink = document.querySelector('.menu-link.active');
  if (initialActiveLink) {
    const initialSrc = initialActiveLink.getAttribute('data-src');
    if (initialSrc) {
      pageIframe.src = initialSrc;
      pageIframe.onload = () => {
        setTimeout(() => {
          try {
            if (pageIframe.contentWindow && pageIframe.contentWindow.location.href === 'about:blank' && initialSrc !== 'about:blank') {
              showErrorMessage();
            } else {
              showIframe();
            }
          } catch (e) {
            showErrorMessage();
          }
        }, 50);
      };
    } else {
      showErrorMessage(); // If data-src is empty for active link
    }
  } else if (menuLinks.length > 0) {
    // If no active link is pre-set, make the first one active and load it
    menuLinks[0].classList.add('active');
    const firstLinkSrc = menuLinks[0].getAttribute('data-src');
    pageIframe.src = firstLinkSrc;
    pageIframe.onload = () => {
      setTimeout(() => {
        try {
          if (pageIframe.contentWindow && pageIframe.contentWindow.location.href === 'about:blank' && firstLinkSrc !== 'about:blank') {
            showErrorMessage();
          } else {
            showIframe();
          }
        } catch (e) {
          showErrorMessage();
        }
      }, 50);
    };
  } else {
    showErrorMessage(); // No links available
  }
});

