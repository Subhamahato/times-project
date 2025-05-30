window.addEventListener('load', function() {
    const loaderWrapper = document.getElementById('loader-wrapper');
    const mainContent = document.querySelector('.main-content'); // Assuming you have this class

    setTimeout(function() {
        loaderWrapper.classList.add('fade-out');

        loaderWrapper.addEventListener('transitionend', function() {
            loaderWrapper.style.display = 'none';
            if (mainContent) { // Check if main content exists before trying to show it
                mainContent.style.display = 'block';
            }
        }, { once: true });
    }, 5000);
});
