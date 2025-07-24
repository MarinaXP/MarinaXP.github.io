const titleImg = document.getElementById("title");

// Frames
const frames = {
    coucou_transition: "assets/sprites/coucou_transition.png",
    coucou_frame1: "assets/sprites/coucou_frame1.png",
    coucou_frame2: "assets/sprites/coucou_frame2.png",
    waiting_frame3: "assets/sprites/waiting_frame3.png",
    show_down_transition: "assets/sprites/show_down_transition.png",
    show_down_frame1: "assets/sprites/show_down_frame1.png",
    show_down_frame2: "assets/sprites/show_down_frame2.png",
    idle_frame1: "assets/sprites/idle_frame1.png",
    idle_frame2: "assets/sprites/idle_frame2.png",
    idle_frame3: "assets/sprites/idle_frame3.png",
    waiting_frame1: "assets/sprites/waiting_frame1.png",
    waiting_frame2: "assets/sprites/waiting_frame2.png"
};

// Contrôle de l'animation
let animationTimeout = null;
let idleInterval = null;
let waitingTimeout = null;
let visible = true;
let startupComplete = false;

// Change une frame
function changeFrame(src) {
    titleImg.src = src;
}

// Animation de démarrage
function playStartupAnimation() {
    let step = 0;
    
    const runStep = () => {
        switch(step) {
            case 0:
                // coucou_transition.png - 500ms
                changeFrame(frames.coucou_transition);
                animationTimeout = setTimeout(runStep, 500);
                break;
            case 1:
                // Alternance coucou_frame1/coucou_frame2 3 fois (100ms chaque)
                let coucouCount = 0;
                const alternateCoucou = () => {
                    if (coucouCount >= 6) { // 3 cycles complets
                        step = 2;
                        runStep();
                        return;
                    }
                    const frameKey = coucouCount % 2 === 0 ? 'coucou_frame1' : 'coucou_frame2';
                    changeFrame(frames[frameKey]);
                    coucouCount++;
                    animationTimeout = setTimeout(alternateCoucou, 200);
                };
                alternateCoucou();
                break;
            case 2:
                // Retour à coucou_transition.png - 500ms
                changeFrame(frames.coucou_transition);
                animationTimeout = setTimeout(runStep, 800);
                break;
            case 3:
                // waiting_frame3.png - 500ms
                changeFrame(frames.waiting_frame3);
                animationTimeout = setTimeout(runStep, 600);
                break;
            case 4:
                // show_down_transition.png
                changeFrame(frames.show_down_transition);
                animationTimeout = setTimeout(runStep, 0);
                break;
            case 5:
                // Alternance show_down_frame1/show_down_frame2 3 fois (200ms chaque)
                let showDownCount = 0;
                const alternateShowDown = () => {
                    if (showDownCount >= 6) { // 3 cycles complets
                        step = 6;
                        runStep();
                        return;
                    }
                    const frameKey = showDownCount % 2 === 0 ? 'show_down_frame1' : 'show_down_frame2';
                    changeFrame(frames[frameKey]);
                    showDownCount++;
                    animationTimeout = setTimeout(alternateShowDown, 200);
                };
                alternateShowDown();
                break;
            case 6:
                // show_down_transition.png - 100ms
                changeFrame(frames.show_down_transition);
                animationTimeout = setTimeout(runStep, 300);
                break;
            case 7:
                // idle_frame1.png et début du cycle idle
                changeFrame(frames.idle_frame1);
                startupComplete = true;
                startIdleAnimation();
                startWaitingTimer();
                break;
        }
        step++;
    };
    
    runStep();
}

// Animation idle (alternance idle_frame1, idle_frame2, idle_frame3)
function startIdleAnimation() {
    let idleIndex = 0;
    const idleFrames = ['idle_frame1', 'idle_frame2', 'idle_frame3'];
    
    idleInterval = setInterval(() => {
        if (visible && startupComplete) {
            changeFrame(frames[idleFrames[idleIndex]]);
            idleIndex = (idleIndex + 1) % idleFrames.length;
        }
    }, 300);
}

// Animation waiting (toutes les 20 secondes)
function playWaitingAnimation() {
    // Arrête temporairement l'animation idle
    if (idleInterval) {
        clearInterval(idleInterval);
        idleInterval = null;
    }
    
    // Séquence waiting
    changeFrame(frames.waiting_frame1);
    setTimeout(() => {
        changeFrame(frames.waiting_frame2);
        setTimeout(() => {
            changeFrame(frames.waiting_frame3);
            setTimeout(() => {
                // Reprend l'animation idle
                startIdleAnimation();
                startWaitingTimer(); // Reprogram le prochain waiting
            }, 200);
        }, 30000);
    }, 1000);
}

// Timer pour l'animation waiting (toutes les 20 secondes)
function startWaitingTimer() {
    waitingTimeout = setTimeout(() => {
        if (visible && startupComplete) {
            playWaitingAnimation();
        } else {
            startWaitingTimer(); // Reprogram si pas visible
        }
    }, 6000);
}

// Stoppe toutes les animations
function stopAllAnimations() {
    if (animationTimeout) {
        clearTimeout(animationTimeout);
        animationTimeout = null;
    }
    if (idleInterval) {
        clearInterval(idleInterval);
        idleInterval = null;
    }
    if (waitingTimeout) {
        clearTimeout(waitingTimeout);
        waitingTimeout = null;
    }
}

// Démarre les animations
function startAnimations() {
    // MODIFICATION PRINCIPALE : Toujours redémarrer l'animation de démarrage
    // quand l'élément revient dans le viewport
    startupComplete = false; // Reset le flag
    playStartupAnimation(); // Rejoue l'animation complète
}

// Vérifie si le titre est visible
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
}

// Gère la visibilité
function handleVisibilityChange() {
    if (isInViewport(titleImg)) {
        if (!visible) {
            visible = true;
            startAnimations(); // Redémarre toujours l'animation complète
        }
    } else {
        if (visible) {
            visible = false;
            stopAllAnimations();
        }
    }
}

// Initialisation
window.addEventListener("load", () => {
    titleImg.src = frames.coucou_transition;
    setTimeout(() => {
        if (isInViewport(titleImg)) {
            startAnimations();
        }
    }, 1000);
});



// Surveillance du scroll/resize
window.addEventListener("scroll", handleVisibilityChange);
window.addEventListener("resize", handleVisibilityChange);

document.addEventListener('DOMContentLoaded', () => {
    const animScrollDiv = document.getElementById('anim_scroll');
    if (!animScrollDiv) return; // Exit if the element isn't found

    // Store the initial offsetTop (distance from the top of the document)
    // This value tells us where the top of the div is when it's in its initial position.
    const initialOffsetTop = animScrollDiv.offsetTop;

    // We'll use this variable to track if the element is currently fixed or not.
    let isFixed = false;

    // Function to handle the scroll logic
    function handleScroll() {
        // Get the current scroll position from the top of the viewport
        const scrollY = window.scrollY || window.pageYOffset;

        // Check if the user has scrolled past the initial position of the div
        if (scrollY > initialOffsetTop) {
            // If we've scrolled past it AND it's not already fixed, make it fixed
            if (!isFixed) {
                animScrollDiv.classList.add('fixed-scroll');
                isFixed = true;
            }
        } else {
            // If we've scrolled back up and it IS fixed, revert it
            if (isFixed) {
                animScrollDiv.classList.remove('fixed-scroll');
                isFixed = false;
            }
        }
    }

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Call handleScroll once on load to ensure correct state if page is loaded
    // with some initial scroll (e.g., refreshing after scrolling down)
    handleScroll();
});

function isMobile() {
    return window.innerWidth <= 768;
}

window.addEventListener("scroll", handleVisibilityChange);
window.addEventListener("resize", handleVisibilityChange);

document.addEventListener('DOMContentLoaded', () => {
    const animScrollDiv = document.getElementById('anim_scroll');
    if (!animScrollDiv) return;

    const initialOffsetTop = animScrollDiv.offsetTop;
    let isFixed = false;

    function handleScroll() {
        if (isMobile()) {
            // Sur mobile, assurez-vous que la classe 'fixed-scroll' est retirée
            // Le display: none du titre sera géré par le CSS.
            if (animScrollDiv.classList.contains('fixed-scroll')) {
                animScrollDiv.classList.remove('fixed-scroll');
            }
            return;
        }

        // Logique d'animation pour les écrans non mobiles (plus grands)
        const scrollY = window.scrollY || window.pageYOffset;

        if (scrollY > initialOffsetTop) {
            if (!isFixed) {
                animScrollDiv.classList.add('fixed-scroll');
                isFixed = true;
            }
        } else {
            if (isFixed) {
                animScrollDiv.classList.remove('fixed-scroll');
                isFixed = false;
            }
        }
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
});
