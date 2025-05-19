document.addEventListener('DOMContentLoaded', () => {
    // Select all links with hash (#) in href
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            // Skip if the href is just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Add highlight effect to the target section
                targetElement.classList.add('highlight');
                setTimeout(() => targetElement.classList.remove('highlight'), 2000);
                
                // Calculate header height for offset
                const headerHeight = document.querySelector('nav').offsetHeight;
                
                // Calculate the target position with offset
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle initial hash in URL
    if (window.location.hash) {
        const initialTarget = document.querySelector(window.location.hash);
        if (initialTarget) {
            setTimeout(() => {
                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = initialTarget.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
}); 