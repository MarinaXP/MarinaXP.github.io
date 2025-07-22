function addPulseEffect() {
            const nodes = document.querySelectorAll('.circuit-node');
            nodes.forEach((node, index) => {
                setTimeout(() => {
                    node.style.animation += ', pulse 2s ease-in-out infinite';
                }, 12000 + (index * 200));
            });
        }

        // Ajouter les styles pour l'animation de pulsation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { 
                    filter: drop-shadow(0 0 5px #fff);
                    transform: scale(1);
                }
                50% { 
                    filter: drop-shadow(0 0 15px #fff) drop-shadow(0 0 25px #fff);
                    transform: scale(1.2);
                }
            }
        `;
        document.head.appendChild(style);

        // Démarrer l'effet de pulsation après l'animation initiale
        setTimeout(addPulseEffect, 5000);

        // Redémarrer l'animation toutes les 10 secondes
        setInterval(() => {
            const paths = document.querySelectorAll('.circuit-path');
            const nodes = document.querySelectorAll('.circuit-node');
            const chips = document.querySelectorAll('.chip, .chip-pins');
            
            [...paths, ...nodes, ...chips].forEach(element => {
                element.style.animation = 'none';
                element.offsetHeight; // Force reflow
                element.style.animation = null;
            });
        }, 10000);