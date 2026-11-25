import { CONFIG } from './config.js';

/**
 * Triggers a subtle sparkle burst around interactive inquiry/copy buttons.
 */
export function triggerSparkleBurst(x, y) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = document.createElement('div');
  container.className = 'sparkle-burst-container';
  container.style.left = `${x != null ? x : window.innerWidth / 2}px`;
  container.style.top = `${y != null ? y : window.innerHeight / 2}px`;
  document.body.appendChild(container);

  const colors = ['#B87333', '#DABDA0', '#F5ECE3', '#6E4E37', '#E8D4BF', '#FFA726'];
  const symbols = ['✦', '✧', '•', '★'];

  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span');
    p.className = 'sparkle-burst-particle';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.color = colors[Math.floor(Math.random() * colors.length)];

    const angle = Math.random() * 2 * Math.PI;
    const distance = 35 + Math.random() * 55;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 20;
    const duration = 0.65 + Math.random() * 0.35;
    const scale = 0.8 + Math.random() * 0.5;

    p.style.setProperty('--dx', `${dx}px`);
    p.style.setProperty('--dy', `${dy}px`);
    p.style.setProperty('--scale', scale);
    p.style.animationDuration = `${duration}s`;

    container.appendChild(p);
  }

  setTimeout(() => {
    container.remove();
  }, 1100);
}

let toastTimer = null;

/**
 * Shows the floating toast banner with countdown progress bar.
 */
export function showToast(elements, message) {
  if (!elements.toast || !elements.toastMessage) return;
  elements.toastMessage.textContent = message;

  elements.toast.classList.remove('show');
  if (elements.toastProgressBar) {
    elements.toastProgressBar.style.animation = 'none';
    void elements.toastProgressBar.offsetWidth;
    elements.toastProgressBar.style.animation = '';
  }

  clearTimeout(toastTimer);
  void elements.toast.offsetWidth;
  elements.toast.classList.add('show');

  toastTimer = setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2600);
}

/**
 * Copies an inquiry prompt for the active cake and opens Facebook Messenger.
 */
export function handleInquiry(e, elements, product) {
  if (!product) return;
  if (e && e.clientX) {
    triggerSparkleBurst(e.clientX, e.clientY);
  }
  const orderMessage = `Hello Frostoria! I would like to inquire about ordering "${product.name}" (${product.flavor}, ${product.size}, ${product.price}).`;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(orderMessage)
      .then(() => {
        showToast(elements, 'Copied cake details! Opening Messenger...');
      })
      .catch(() => {
        showToast(elements, 'Opening Facebook Messenger...');
      });
  } else {
    showToast(elements, 'Opening Facebook Messenger...');
  }

  window.open(CONFIG.socialLinks.messenger, '_blank');
}

/**
 * Copies formatted cake specifications to the user's clipboard.
 */
export function copyProductDetails(e, elements, product) {
  if (!product) return;
  if (e && e.clientX) {
    triggerSparkleBurst(e.clientX, e.clientY);
  }
  const text = `Frostoria ("Freshly baked memories.") - ${product.name} | Flavour: ${product.flavor} | Size: ${product.size} | Price: ${product.price}`;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast(elements, 'Copied cake details to clipboard!');
      })
      .catch(() => {
        showToast(elements, `Selected: ${product.name} (${product.price})`);
      });
  } else {
    showToast(elements, `Selected: ${product.name} (${product.price})`);
  }
}
