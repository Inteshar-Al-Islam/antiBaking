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
 * Copies an inquiry prompt to clipboard, shows toast feedback, and opens Messenger.
 */
function openMessengerWithText(e, elements, messageText, copiedToastMessage, fallbackToastMessage = 'Opening Facebook Messenger...') {
  if (e && e.clientX) {
    triggerSparkleBurst(e.clientX, e.clientY);
  }

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(messageText)
      .then(() => {
        showToast(elements, copiedToastMessage);
      })
      .catch(() => {
        showToast(elements, fallbackToastMessage);
      });
  } else {
    showToast(elements, fallbackToastMessage);
  }

  window.open(CONFIG.socialLinks.messenger, '_blank');
}

/**
 * Copies text to clipboard and displays toast confirmation.
 */
function copyTextWithFeedback(e, elements, text, successMessage, fallbackMessage) {
  if (e && e.clientX) {
    triggerSparkleBurst(e.clientX, e.clientY);
  }

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast(elements, successMessage);
      })
      .catch(() => {
        showToast(elements, fallbackMessage);
      });
  } else {
    showToast(elements, fallbackMessage);
  }
}

/**
 * Copies an inquiry prompt for the active cake and opens Facebook Messenger.
 */
export function handleInquiry(e, elements, product) {
  if (!product) return;
  const orderMessage = `Hello Frostoria! I would like to inquire about ordering "${product.name}" (${product.flavor}, ${product.size}, ${product.price}).`;
  openMessengerWithText(e, elements, orderMessage, 'Copied cake details! Opening Messenger...');
}

/**
 * Copies formatted cake specifications to the user's clipboard.
 */
export function copyProductDetails(e, elements, product) {
  if (!product) return;
  const text = `Frostoria ("Freshly baked memories.") - ${product.name} | Flavour: ${product.flavor} | Size: ${product.size} | Price: ${product.price}`;
  copyTextWithFeedback(
    e,
    elements,
    text,
    'Copied cake details to clipboard!',
    `Selected: ${product.name} (${product.price})`
  );
}

/**
 * Builds a clean summary string for a custom cake inquiry.
 */
export function formatCustomCakeBrief({ style, flavor, size, notes }) {
  const cleanNotes = (notes || '').trim();
  const base = `Custom ${style} Cake | Flavour: ${flavor} | Size: ${size}`;
  return cleanNotes ? `${base} | Theme/Notes: ${cleanNotes}` : base;
}

/**
 * Copies a custom cake brief and opens Facebook Messenger.
 */
export function handleCustomOrderInquiry(e, elements, customSpec) {
  const brief = formatCustomCakeBrief(customSpec);
  const message = `Hello Frostoria! I'd love to build a custom cake: ${brief}. Could you share availability and pricing?`;
  openMessengerWithText(e, elements, message, 'Copied custom brief! Opening Messenger...');
}

/**
 * Copies a custom cake brief to clipboard.
 */
export function copyCustomOrderDetails(e, elements, customSpec) {
  const brief = formatCustomCakeBrief(customSpec);
  const text = `Frostoria ("Freshly baked memories.") - ${brief}`;
  copyTextWithFeedback(
    e,
    elements,
    text,
    'Custom cake brief copied!',
    brief
  );
}
