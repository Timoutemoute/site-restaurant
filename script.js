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
    emailjs.init("chtGD9p-YRLMyN_mm");
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
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                guests: document.getElementById('guests').value,
                message: document.getElementById('message').value,
                reservation_date: new Date().toLocaleString('fr-FR'),
                restaurant_email: 'restaurant@shc57.fr' // Ajout de l'email du restaurant
            };
            
            // Envoyer l'email de confirmation au client
            const clientEmailPromise = emailjs.send('service_q7x43y5', 'template_zh0v0bf', {
                ...formData,
                to_email: formData.email, // Envoi au client
                subject: 'Confirmation de votre réservation - Au Gourmet Français'
            });
            
            // Envoyer l'email de notification au restaurant
            const restaurantEmailPromise = emailjs.send('service_q7x43y5', 'template_zh0v0bf', {
                ...formData,
                to_email: 'restaurant@shc57.fr', // Envoi au restaurant
                subject: 'Nouvelle réservation - ' + formData.name
            });
            
            // Gérer les deux envois d'emails
            Promise.all([clientEmailPromise, restaurantEmailPromise])
                .then(function(responses) {
                    showMessage('✅ Réservation envoyée avec succès ! Un email de confirmation vous a été envoyé.', 'success');
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
    // Dans script.js, remplacez la partie de l'écouteur d'événement par ceci :

if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // ... (votre code existant pour récupérer formData et le bouton) ...
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value
        };

        // --- AJOUT GOOGLE CALENDAR ---
        // Collez ici l'URL que vous avez copiée à l'étape 2
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/a/macros/shc57.fr/s/AKfycbxwAKRvAX7RfaEEaZITFeisakYGkEwMGDZRxKJrNAtKTd7TgdwPBu4t_MSr5vCbukA4ng/exec'; 
        
        // Création de la requête vers Google Agenda
        // On utilise mode: 'no-cors' car Google ne renvoie pas les en-têtes CORS standards, 
        // mais l'action sera bien exécutée.
        const calendarPromise = fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'text/plain' // Important pour éviter les erreurs CORS avec Google Scripts
            },
            body: JSON.stringify(formData)
        });
        // -----------------------------

        // Envoi au client (EmailJS)
        const clientEmailPromise = emailjs.send('service_q7x43y5', 'template_confirmation_client', {
            ...formData,
            to_name: formData.name,
            to_email: formData.email,
            reply_to: 'contact@shc57.fr'
        });

        // Envoi au restaurant (EmailJS)
        const restaurantEmailPromise = emailjs.send('service_q7x43y5', 'template_zh0v0bf', {
            ...formData,
            to_email: 'restaurant@shc57.fr',
            subject: 'Nouvelle réservation - ' + formData.name
        });
        
        // On attend que les 3 actions (Email Client + Email Resto + Google Agenda) soient finies
        Promise.all([clientEmailPromise, restaurantEmailPromise, calendarPromise])
            .then(function(responses) {
                showMessage('✅ Réservation enregistrée et ajoutée à l\'agenda !', 'success');
                reservationForm.reset();
            })
            .catch(function(error) {
                // Même si l'agenda échoue, les emails peuvent avoir fonctionné, ou l'inverse.
                // Ici on affiche une erreur générique si tout plante
                console.error('Erreur:', error);
                showMessage('⚠️ Réservation envoyée par email, mais erreur possible de synchro.', 'success'); 
                reservationForm.reset();
            })
            .finally(function() {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}
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
