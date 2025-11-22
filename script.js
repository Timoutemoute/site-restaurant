// --- PARTIE 1 : ANIMATIONS & MENU ---

// Menu mobile
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        document.querySelector('nav').classList.toggle('active');
    });
}

// Fermer le menu mobile en cliquant en dehors
document.addEventListener('click', function(e) {
    const nav = document.querySelector('nav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (nav && nav.classList.contains('active') && 
        !nav.contains(e.target) && 
        (!menuBtn || !menuBtn.contains(e.target))) {
        nav.classList.remove('active');
    }
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
    // Init EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("chtGD9p-YRLMyN_mm");
        console.log("EmailJS initialisé");
    } else {
        console.error("Erreur: La librairie EmailJS n'est pas chargée dans le HTML");
    }

    const elements = document.querySelectorAll('.service-card, .partner-card, .team-member');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    window.dispatchEvent(new Event('scroll'));
    
    // Lancement de la gestion du formulaire
    initReservationForm();
});


// --- PARTIE 2 : FORMULAIRE & GOOGLE AGENDA ---

function initReservationForm() {
    const reservationForm = document.getElementById('reservation-form');

    if (!reservationForm) return; 

    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Formulaire soumis...");

        // CORRECTION ICI : On cible le bouton par son type "submit"
        const submitBtn = this.querySelector('button[type="submit"]');
        
        let originalText = "Réserver"; // Valeur par défaut si le bouton n'a pas de texte
        if (submitBtn) {
            originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
        }

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value
        };

        // URL de votre script Google
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxwAKRvAX7RfaEEaZITFeisakYGkEwMGDZRxKJrNAtKTd7TgdwPBu4t_MSr5vCbukA4ng/exec'; 

        // 1. Envoi Google Agenda
        console.log("Tentative envoi Google Agenda...");
        const calendarPromise = fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(formData)
        });

        // 2. Email Client
        console.log("Tentative envoi Email Client...");
        const clientEmailPromise = emailjs.send('service_q7x43y5', 'template_confirmation_client', {
            ...formData,
            to_name: formData.name,
            to_email: formData.email,
            reply_to: 'contact@shc57.fr'
        });

        // 3. Email Restaurant
        console.log("Tentative envoi Email Resto...");
        const restaurantEmailPromise = emailjs.send('service_q7x43y5', 'template_zh0v0bf', {
            ...formData,
            to_email: 'restaurant@shc57.fr',
            subject: 'Nouvelle réservation - ' + formData.name
        });

        // Attente des résultats
        Promise.all([clientEmailPromise, restaurantEmailPromise, calendarPromise])
            .then(function() {
                console.log("Tout est envoyé avec succès !");
                showMessage('✅ Réservation confirmée et ajoutée à l\'agenda !', 'success');
                reservationForm.reset();
            })
            .catch(function(error) {
                console.error('Erreur pendant l\'envoi:', error);
                showMessage('✅ Demande envoyée (Vérifiez vos emails).', 'success');
                reservationForm.reset();
            })
            .finally(function() {
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
    });
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.style.display = 'block';
        
        // Couleur verte pour le succès (style en ligne pour être sûr)
        if (type === 'success') {
            messageDiv.style.color = '#155724';
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.border = '1px solid #c3e6cb';
        }
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}