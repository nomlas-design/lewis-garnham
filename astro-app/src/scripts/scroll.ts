import { gsap } from 'gsap';

const navbar = document.querySelector('.nav-wrapper') as HTMLElement;
let ticking = false;
let lastScroll = 0;
let isNavbarHidden = false;
let isNavigating = false;
const HIDE_THRESHOLD = 300;
const SCROLL_DELTA_THRESHOLD = 5; // Minimum scroll distance to trigger hide/show
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function updateNavbar() {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
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
      // On mobile, require a larger scroll delta to prevent jittery behavior
      const deltaThreshold = isMobileDevice ? SCROLL_DELTA_THRESHOLD : 1;

      if (scrollY > HIDE_THRESHOLD && !isNavigating) {
        if (scrollDelta > deltaThreshold && !isNavbarHidden) {
          gsap.to(navbar, {
            y: '-100%',
            duration: isMobileDevice ? 0.3 : 0.5,
            ease: 'power2.inOut',
          });
          isNavbarHidden = true;
        } else if (scrollDelta < -deltaThreshold && isNavbarHidden) {
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

window.addEventListener('scroll', updateNavbar, { passive: true });

updateNavbar();

window.addEventListener('resize', () => {
  updateNavbar();
});

// Smooth scroll to anchor links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href')?.slice(1);
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Prevent navbar from hiding during navigation
        isNavigating = true;

        // Disable pointer events during scroll to prevent hover effects
        document.body.style.pointerEvents = 'none';

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
        const navbarOffset = isMobile ? 120 : 160;

        // Calculate target position
        const targetPosition = targetElement.offsetTop - navbarOffset;

        // Smooth scroll with native browser API
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Wait for scroll to complete (approximate duration)
        setTimeout(() => {
          // Re-enable pointer events
          document.body.style.pointerEvents = '';
          isNavigating = false;
        }, 1500);
      }
    });
  });
});
