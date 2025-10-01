import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const navbar = document.querySelector('.nav-wrapper');
let ticking = false;
let lastScroll = 0;
let isNavbarHidden = false;
let isNavigating = false;
const HIDE_THRESHOLD = 300;

function updateNavbar() {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = lenis.scroll;
      const scrollDelta = scrollY - lastScroll;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = Math.min(scrollY / maxScroll, 1);

      const yPosition = progress * 100;

      if (scrollY <= HIDE_THRESHOLD) {
        navbar.classList.add('is-at-top');
      } else {
        navbar.classList.remove('is-at-top');
      }

      // Don't hide navbar during navigation
      if (scrollY > HIDE_THRESHOLD && !isNavigating) {
        if (scrollDelta > 0 && !isNavbarHidden) {
          gsap.to(navbar, {
            y: '-100%',
            duration: 0.5,
            ease: 'power2.inOut',
          });
          isNavbarHidden = true;
        } else if (scrollDelta < 0 && isNavbarHidden) {
          gsap.to(navbar, {
            y: '0%',
            duration: 0.3,
            ease: 'power2.inOut',
          });
          isNavbarHidden = false;
        }
      } else {
        if (isNavbarHidden) {
          gsap.to(navbar, {
            y: '0%',
            duration: 0.3,
            ease: 'power2.inOut',
          });
          isNavbarHidden = false;
        }
      }

      gsap.to(navbar, {
        backgroundPositionY: `${yPosition}%`,
        duration: 0.3,
        ease: 'power2.out',
      });

      lastScroll = scrollY;
      ticking = false;
    });

    ticking = true;
  }
}
lenis.on('scroll', updateNavbar);

updateNavbar();

window.addEventListener('resize', () => {
  updateNavbar();
});

// Smooth scroll to anchor links with Lenis
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Prevent navbar from hiding during navigation
        isNavigating = true;

        // Ensure navbar is visible
        if (isNavbarHidden) {
          gsap.to(navbar, {
            y: '0%',
            duration: 0.3,
            ease: 'power2.inOut',
          });
          isNavbarHidden = false;
        }

        // Determine navbar offset based on screen size
        const isMobile = window.innerWidth < 576;
        const navbarOffset = isMobile ? -120 : -160;

        // Smooth scroll with Lenis
        lenis.scrollTo(targetElement, {
          offset: navbarOffset,
          duration: 1.5,
          onComplete: () => {
            // Re-enable navbar hiding after a short delay
            setTimeout(() => {
              isNavigating = false;
            }, 500);
          },
        });
      }
    });
  });
});
