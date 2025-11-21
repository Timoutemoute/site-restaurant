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
    
    if (nav && nav.classList.contains('active') && 
        mobileMenuBtn && 
        !nav.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Gestion du menu mobile et du défilement
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        const nav = document.querySelector('nav');
        if (nav) {
            const isActive = nav.classList.contains('active');
            
            if (isActive) {
                document.body.style.overflow = '';
            } else {
                document.body.style.overflow = 'hidden';
            }
        }
    });
}

// Réinitialiser le défilement quand on clique sur un lien
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('nav')?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// EmailJS Configuration
(function() {
    emailjs.init("chtGD9p-YRLMyN_mm");
})();

// Gestion du formulaire de réservation
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservation-form');
    
    function showMessage(text, type) {
        const messageDiv = document.getElementById('form-message');
        if (messageDiv) {
            messageDiv.textContent = text;
            messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                date: document.getElementById('date')?.value || '',
                time: document.getElementById('time')?.value || '',
                guests: document.getElementById('guests')?.value || ''
            };

            // Validation basique
            if (!formData.name || !formData.email || !formData.date || !formData.time) {
                showMessage('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }

            // URL Google Script
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/a/macros/shc57.fr/s/AKfycbxwAKRvAX7RfaEEaZITFeisakYGkEwMGDZRxKJrNAtKTd7TgdwPBu4t_MSr5vCbukA4ng/exec'; 

            // Envoi vers Google Agenda
            const calendarPromise = fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify(formData)
            });

            // Envoi au client
            const clientEmailPromise = emailjs.send('service_q7x43y5', 'template_confirmation_client', {
                ...formData,
                to_name: formData.name,
                to_email: formData.email,
                reply_to: 'contact@shc57.fr'
            });

            // Envoi au restaurant
            const restaurantEmailPromise = emailjs.send('service_q7x43y5', 'template_zh0v0bf', {
                ...formData,
                to_email: 'restaurant@shc57.fr',
                subject: 'Nouvelle réservation - ' + formData.name
            });

            // Gestion des promesses
            Promise.allSettled([clientEmailPromise, restaurantEmailPromise, calendarPromise])
                .then(function(results) {
                    const clientEmailSuccess = results[0].status === 'fulfilled';
                    const restaurantEmailSuccess = results[1].status === 'fulfilled';
                    const calendarSuccess = results[2].status === 'fulfilled';

                    if (clientEmailSuccess && restaurantEmailSuccess) {
                        if (calendarSuccess) {
                            showMessage('✅ Réservation enregistrée et ajoutée à l\'agenda !', 'success');
                        } else {
                            showMessage('✅ Réservation confirmée par email ! (Problème de synchronisation agenda)', 'success');
                        }
                        reservationForm.reset();
                    } else {
                        showMessage('❌ Erreur lors de l\'envoi de la réservation. Veuillez réessayer.', 'error');
                    }
                })
                .catch(function(error) {
                    console.error('Erreur globale:', error);
                    showMessage('❌ Une erreur est survenue. Veuillez nous contacter directement.', 'error');
                })
                .finally(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});