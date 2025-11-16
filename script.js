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

// EmailJS Configuration
(function() {
    emailjs.init("chtGD9p-YRLMyN_mm"); // Remplacez par votre clé publique EmailJS
})();

// Gestion du formulaire de réservation
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservation-form');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            // Récupérer les données du formulaire
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email', 'restaurant@shc57.fr').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                guests: document.getElementById('guests').value,
                message: document.getElementById('message').value,
                reservation_date: new Date().toLocaleString('fr-FR')
            };
            
            // Envoyer l'email via EmailJS
            emailjs.send('service_q7x43y5', 'template_zh0v0bf', formData)
                .then(function(response) {
                    showMessage('✅ Réservation envoyée avec succès ! Nous vous contacterons rapidement pour confirmation.', 'success');
                    reservationForm.reset();
                }, function(error) {
                    showMessage('❌ Erreur lors de l\'envoi. Veuillez nous appeler directement au 09 72 65 22 61', 'error');
                    console.error('EmailJS error:', error);
                })
                .finally(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    function showMessage(text, type) {
        const messageDiv = document.getElementById('form-message');
        messageDiv.textContent = text;
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

});
