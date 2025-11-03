/**
 * Hero Section Interactive Effects
 * Auto-rotation + Mouse tracking (Icons stay in circle)
 */

'use strict';

const HeroInteractions = {
    heroVisual: null,
    orbitItems: [],
    orbitContainer: null,
    centerCircle: null,
    mouse: { x: 0, y: 0 },
    isHovering: false,
    maxDistance: 40, // Maximum pixels icons can move from orbit

    init() {
        console.log('🎨 Hero Interactions - Initializing...');
        
        this.heroVisual = document.getElementById('heroVisual');
        if (!this.heroVisual) return;

        this.orbitItems = Array.from(document.querySelectorAll('.orbit-item'));
        this.orbitContainer = document.querySelector('.orbit-container');
        this.centerCircle = document.querySelector('.center-circle');
        
        this.setupMouseTracking();
        this.setupOrbitHoverEffects();
        this.setupFloatingCards();
        this.setupCounterRotation();

        console.log('✅ Hero Interactions initialized');
    },

    setupMouseTracking() {
        this.heroVisual.addEventListener('mousemove', (e) => {
            this.updateMousePosition(e);
            this.applySmartParallax();
        });

        this.heroVisual.addEventListener('mouseleave', () => {
            this.resetParallax();
        });
    },

    updateMousePosition(e) {
        const rect = this.heroVisual.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        this.mouse.x = (e.clientX - rect.left - centerX) / centerX;
        this.mouse.y = (e.clientY - rect.top - centerY) / centerY;
    },

    applySmartParallax() {
        // Center circle subtle movement
        if (this.centerCircle) {
            const moveX = this.mouse.x * 15;
            const moveY = this.mouse.y * 15;
            this.centerCircle.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        }

        // Orbit items - move towards mouse but stay in limited radius
        this.orbitItems.forEach((item, index) => {
            const icon = item.querySelector('.orbit-icon');
            if (!icon) return;

            // Calculate angle for this orbit item
            const orbitIndex = parseInt(item.getAttribute('data-orbit'));
            const baseAngle = (orbitIndex - 1) * 60;
            
            // Calculate attraction to mouse
            const attractX = this.mouse.x * this.maxDistance;
            const attractY = this.mouse.y * this.maxDistance;
            
            // Apply limited movement that doesn't break orbit
            const constrainedX = Math.max(-this.maxDistance, Math.min(this.maxDistance, attractX * 0.5));
            const constrainedY = Math.max(-this.maxDistance, Math.min(this.maxDistance, attractY * 0.5));
            
            // Counter-rotation angle
            const counterAngle = -baseAngle;
            
            // Apply transform
            icon.style.transform = `rotate(${counterAngle}deg) translate(${constrainedX}px, ${constrainedY}px)`;
        });
    },

    resetParallax() {
        if (this.centerCircle) {
            this.centerCircle.style.transform = 'translate(-50%, -50%)';
        }

        this.orbitItems.forEach(item => {
            const icon = item.querySelector('.orbit-icon');
            if (!icon) return;
            
            const orbitIndex = parseInt(item.getAttribute('data-orbit'));
            const baseAngle = (orbitIndex - 1) * 60;
            const counterAngle = -baseAngle;
            
            icon.style.transform = `rotate(${counterAngle}deg)`;
        });
    },

    setupCounterRotation() {
        // Keep icons upright as they orbit
        const updateRotation = () => {
            if (!this.orbitContainer) return;
            
            const containerTransform = window.getComputedStyle(this.orbitContainer).transform;
            
            this.orbitItems.forEach(item => {
                const orbitIndex = parseInt(item.getAttribute('data-orbit'));
                const baseAngle = (orbitIndex - 1) * 60;
                item.style.setProperty('--counter-rotation', `${-baseAngle}deg`);
            });
            
            requestAnimationFrame(updateRotation);
        };
        
        updateRotation();
    },

    setupOrbitHoverEffects() {
        this.orbitItems.forEach(item => {
            const icon = item.querySelector('.orbit-icon');
            const color = item.getAttribute('data-color');

            item.addEventListener('mouseenter', () => {
                this.isHovering = true;
                
                // Enhanced glow effect
                icon.style.boxShadow = `0 12px 40px ${this.hexToRgba(color, 0.6)}, 0 0 0 4px ${this.hexToRgba(color, 0.2)}`;
                icon.style.background = this.hexToRgba(color, 0.1);
                
                // Pause rotation on hover
                if (this.orbitContainer) {
                    this.orbitContainer.style.animationPlayState = 'paused';
                }
            });

            item.addEventListener('mouseleave', () => {
                this.isHovering = false;
                
                icon.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                icon.style.background = 'white';
                
                // Resume rotation
                if (this.orbitContainer) {
                    this.orbitContainer.style.animationPlayState = 'running';
                }
            });

            // Click ripple effect
            item.addEventListener('click', () => {
                this.createRipple(icon, color);
            });
        });
    },

    setupFloatingCards() {
        const cards = document.querySelectorAll('.floating-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.animationPlayState = 'paused';
            });

            card.addEventListener('mouseleave', () => {
                card.style.animationPlayState = 'running';
            });
        });
    },

    createRipple(element, color) {
        const ripple = document.createElement('span');
        ripple.className = 'click-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: ${this.hexToRgba(color, 0.5)};
            transform: translate(-50%, -50%);
            animation: rippleEffect 0.8s ease-out;
            pointer-events: none;
            z-index: 10;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
    },

    hexToRgba(hex, alpha = 1) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    destroy() {
        this.heroVisual = null;
        this.orbitItems = [];
        this.orbitContainer = null;
        this.centerCircle = null;
    }
};

// Add ripple animation CSS
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes rippleEffect {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    HeroInteractions.init();
});

// Cleanup
window.addEventListener('beforeunload', () => {
    HeroInteractions.destroy();
});

window.HeroInteractions = HeroInteractions;