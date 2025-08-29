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

      if (scrollY > HIDE_THRESHOLD) {
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
