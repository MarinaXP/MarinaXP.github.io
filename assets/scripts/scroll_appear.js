// Fonction pour détecter si un élément est visible dans le viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // L'élément est considéré comme visible s'il est au moins 20% visible
            return (
                rect.top <= windowHeight * 0.8 && 
                rect.bottom >= 0
            );
        }

        // Fonction pour animer les éléments
        function animateElements() {
            // Liste des IDs à surveiller
            const animatedIds = [
                'anim_top_appearance',
                'anim_left_appearance', 
                'anim_right_appearance',
                'anim_bottom_appearance' // Bonus
            ];

            animatedIds.forEach(id => {
                const element = document.getElementById(id);
                if (element && !element.classList.contains('animate')) {
                    if (isElementInViewport(element)) {
                        element.classList.add('animate');
                        
                        // Ajouter un petit délai pour un effet plus naturel
                        setTimeout(() => {
                            console.log(`Animation déclenchée pour: ${id}`);
                        }, 200);
                    }
                }
            });
        }

        // Fonction de throttling pour optimiser les performances
        function throttle(func, delay) {
            let timeoutId;
            let lastExecTime = 0;
            
            return function (...args) {
                const currentTime = Date.now();
                
                if (currentTime - lastExecTime > delay) {
                    func.apply(this, args);
                    lastExecTime = currentTime;
                } else {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        func.apply(this, args);
                        lastExecTime = Date.now();
                    }, delay - (currentTime - lastExecTime));
                }
            };
        }

        // Observer pour une détection plus efficace (si supporté)
        if (window.IntersectionObserver) {
            const observerOptions = {
                threshold: 0.2, // Se déclenche quand 20% de l'élément est visible
                rootMargin: '0px 0px -10% 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
                        entry.target.classList.add('animate');
                        console.log(`Animation déclenchée pour: ${entry.target.id}`);
                        
                        // Optionnel : arrêter d'observer cet élément après animation
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observer tous les éléments à animer
            const animatedIds = [
                'anim_top_appearance',
                'anim_left_appearance', 
                'anim_right_appearance',
                'anim_bottom_appearance'
            ];

            animatedIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    observer.observe(element);
                }
            });
        } else {
            // Fallback pour les navigateurs plus anciens
            const throttledAnimate = throttle(animateElements, 100);
            
            window.addEventListener('scroll', throttledAnimate);
            window.addEventListener('resize', throttledAnimate);
            
            // Vérifier au chargement de la page
            document.addEventListener('DOMContentLoaded', animateElements);
        }

        // Fonction pour réinitialiser les animations (utile pour le développement)
        function resetAnimations() {
            const animatedIds = [
                'anim_top_appearance',
                'anim_left_appearance', 
                'anim_right_appearance',
                'anim_bottom_appearance'
            ];

            animatedIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.classList.remove('animate');
                }
            });
        }

        // Commande pour réinitialiser (tapez dans la console)
        window.resetAnimations = resetAnimations;

        console.log('🎬 Script d\'animation au scroll chargé !');
        console.log('💡 Tapez resetAnimations() dans la console pour relancer les animations');