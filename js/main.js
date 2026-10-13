const root = document.documentElement;
root.classList.add('js');
const themeButton = document.querySelector('.theme-toggle');
const themeWord = document.querySelector('.theme-word');
const themeColor = document.querySelector('meta[name="theme-color"]');

function savedTheme() {
  try { return localStorage.getItem('vaibhav-theme-v2'); } catch { return null; }
}
function applyTheme(theme, persist = false) {
  root.dataset.theme = theme;
  const light = theme === 'light';
  themeButton.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
  themeButton.setAttribute('aria-pressed', String(light));
  themeWord.textContent = light ? 'Dark' : 'Light';
  themeColor.content = light ? '#eef1e7' : '#101917';
  if (persist) { try { localStorage.setItem('vaibhav-theme-v2', theme); } catch {} }
}
applyTheme(savedTheme() === 'dark' ? 'dark' : 'light');
themeButton.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}
closeMenu();
menuButton.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !mobileNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

document.getElementById('year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.desktop-nav a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  ['services', 'work', 'approach', 'about'].forEach(id => observer.observe(document.getElementById(id)));
}

// Motion adds depth to the work, while every image and link remains usable without it.
const scene = document.getElementById('scene');
const hero = document.querySelector('.hero');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
const motionAllowed = () => !reducedMotion.matches && finePointer.matches;
let pointerFrame = 0;
scene.addEventListener('pointermove', event => {
  if (!motionAllowed()) return;
  const box = scene.getBoundingClientRect();
  const x = ((event.clientX - box.left) / box.width - .5) * 2;
  const y = ((event.clientY - box.top) / box.height - .5) * 2;
  cancelAnimationFrame(pointerFrame);
  pointerFrame = requestAnimationFrame(() => {
    scene.style.setProperty('--ry', `${(-10 + x * 13).toFixed(2)}deg`);
    scene.style.setProperty('--rx', `${(-4 - y * 8).toFixed(2)}deg`);
  });
});
scene.addEventListener('pointerleave', () => {
  cancelAnimationFrame(pointerFrame);
  scene.style.removeProperty('--ry');
  scene.style.removeProperty('--rx');
});

if ('IntersectionObserver' in window) {
  const sceneObserver = new IntersectionObserver(entries => {
    scene.classList.toggle('is-in-view', entries[0].isIntersecting);
  }, { threshold: 0.05 });
  sceneObserver.observe(scene);

  if (!reducedMotion.matches) {
    const revealTargets = document.querySelectorAll('.services-intro, .service-grid article, .section-heading, .feature-case, .story-head, .story-item, .gallery-heading, .gallery-card, .film-heading, .film-frame, .breadth-grid, .approach-grid, .about-grid, .contact-inner');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    revealTargets.forEach((target, index) => {
      target.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
      revealObserver.observe(target);
    });
  }
} else {
  scene.classList.add('is-in-view');
}

let scrollFrame = 0;
function updateScrollMotion() {
  scrollFrame = 0;
  const travel = document.documentElement.scrollHeight - innerHeight;
  root.style.setProperty('--page-progress', travel > 0 ? (scrollY / travel).toFixed(4) : '0');
  if (reducedMotion.matches) {
    scene.style.removeProperty('--scroll-y');
    scene.style.removeProperty('--scroll-r');
    return;
  }
  const rect = hero.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
  scene.style.setProperty('--scroll-y', `${(-progress * 18).toFixed(1)}px`);
  scene.style.setProperty('--scroll-r', `${(progress * 2.5).toFixed(2)}deg`);
}
function queueScrollMotion() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollMotion);
}
window.addEventListener('scroll', queueScrollMotion, { passive: true });
window.addEventListener('resize', queueScrollMotion);
reducedMotion.addEventListener('change', () => {
  scene.style.removeProperty('--rx');
  scene.style.removeProperty('--ry');
  queueScrollMotion();
});
queueScrollMotion();

function addPointerDepth(element, apply, clear) {
  let frame = 0;
  element.addEventListener('pointermove', event => {
    if (!motionAllowed()) return;
    const box = element.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width - .5) * 2;
    const y = ((event.clientY - box.top) / box.height - .5) * 2;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => apply(x, y));
  });
  element.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    clear();
  });
}

const featureImage = document.querySelector('.feature-image');
addPointerDepth(featureImage, (x, y) => {
  featureImage.style.setProperty('--image-x', `${(x * 9).toFixed(1)}px`);
  featureImage.style.setProperty('--image-y', `${(y * 7).toFixed(1)}px`);
  featureImage.style.setProperty('--label-x', `${(-x * 5).toFixed(1)}px`);
  featureImage.style.setProperty('--label-y', `${(-y * 4).toFixed(1)}px`);
}, () => {
  ['--image-x', '--image-y', '--label-x', '--label-y'].forEach(name => featureImage.style.removeProperty(name));
});

document.querySelectorAll('.gallery-card').forEach(card => {
  addPointerDepth(card, (x, y) => {
    card.style.setProperty('--tilt-x', `${(-y * 3).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${(x * 3).toFixed(2)}deg`);
  }, () => {
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
  });
});

const items = [...document.querySelectorAll('[data-gallery-item]')];
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxNote = document.getElementById('lightbox-note');
const lightboxCount = document.getElementById('lightbox-count');
const closeButton = lightbox.querySelector('.lightbox-close');
const prevButton = lightbox.querySelector('.lightbox-prev');
const nextButton = lightbox.querySelector('.lightbox-next');
let current = 0;
let previousFocus = null;

function showItem(index) {
  current = (index + items.length) % items.length;
  const item = items[current];
  const image = item.querySelector('img');
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxTitle.textContent = item.dataset.title;
  lightboxNote.textContent = item.dataset.note;
  lightboxCount.textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
}
function openLightbox(index) {
  previousFocus = document.activeElement;
  showItem(index);
  lightbox.hidden = false;
  document.body.classList.add('lightbox-open');
  document.querySelector('main').inert = true;
  document.querySelector('.site-header').inert = true;
  closeButton.focus();
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove('lightbox-open');
  document.querySelector('main').inert = false;
  document.querySelector('.site-header').inert = false;
  if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
}
items.forEach((item, index) => item.addEventListener('click', event => { event.preventDefault(); openLightbox(index); }));
closeButton.addEventListener('click', closeLightbox);
lightbox.querySelector('[data-close]').addEventListener('click', closeLightbox);
prevButton.addEventListener('click', () => showItem(current - 1));
nextButton.addEventListener('click', () => showItem(current + 1));
document.addEventListener('keydown', event => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closeLightbox();
  else if (event.key === 'ArrowLeft') showItem(current - 1);
  else if (event.key === 'ArrowRight') showItem(current + 1);
  else if (event.key === 'Tab') {
    const buttons = [closeButton, prevButton, nextButton];
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
