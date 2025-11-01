// Menu mobile
document.querySelector('.mobile-menu')?.addEventListener('click', function() {
    document.querySelector('nav').classList.toggle('active');
});

// Animation au défilement
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.service-card, .partner-card, .team-member');
    
    elements.forEach(element => {
        const position = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if(position < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Initialisation des animations
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.service-card, .partner-card, .team-member');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Déclenchement initial des animations
    window.dispatchEvent(new Event('scroll'));
});
    // Fermer le menu mobile en cliquant en dehors
    document.addEventListener('click', function(e) {
        const nav = document.querySelector('nav');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            nav.classList.remove('active');
        }
    });
    
    // Empêcher le défilement quand le menu mobile est ouvert
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const nav = document.querySelector('nav');
            const isActive = nav.classList.contains('active');
            
            if (isActive) {
                document.body.style.overflow = '';
            } else {
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Réinitialiser le défilement quand on clique sur un lien
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            document.body.style.overflow = '';
        });
    });