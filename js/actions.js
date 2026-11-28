import { CONFIG, CUSTOM_CAKE_SPECS } from './config.js';

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

  window.open(CONFIG.socialLinks.messenger, '_blank', 'noopener,noreferrer');
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
 * Builds a single Messenger-ready inquiry message listing all saved cakes.
 */
export function formatSavedCakesMessage(savedProducts) {
  if (!Array.isArray(savedProducts) || savedProducts.length === 0) return '';
  if (savedProducts.length === 1) {
    const cake = savedProducts[0];
    return `Hello Frostoria! I saved "${cake.name}" (${cake.flavor}, ${cake.size}, ${cake.price}) from your collection and would love to inquire about ordering it.`;
  }

  const lines = savedProducts.map(
    (cake, idx) => `${idx + 1}. ${cake.name} (${cake.flavor}, ${cake.size}, ${cake.price})`
  );
  return `Hello Frostoria! Here are my ${savedProducts.length} saved cake picks I'd like to inquire about:\n${lines.join('\n')}\nCould you share availability and details?`;
}

/**
 * Copies all saved cake names in one combined message and opens Messenger.
 */
export function handleSavedCakesInquiry(e, elements, savedProducts) {
  if (!Array.isArray(savedProducts) || savedProducts.length === 0) return;
  const message = formatSavedCakesMessage(savedProducts);
  const countLabel = savedProducts.length === 1 ? '1 saved cake' : `${savedProducts.length} saved cakes`;
  openMessengerWithText(
    e,
    elements,
    message,
    `Copied ${countLabel}! Paste in Messenger to send.`,
    'Opening Facebook Messenger...'
  );
}

/**
 * Copies the combined saved cakes inquiry message to clipboard.
 */
export function copySavedCakesList(e, elements, savedProducts) {
  if (!Array.isArray(savedProducts) || savedProducts.length === 0) return;
  const message = formatSavedCakesMessage(savedProducts);
  const countLabel = savedProducts.length === 1 ? '1 saved cake' : `${savedProducts.length} saved cakes`;
  copyTextWithFeedback(
    e,
    elements,
    message,
    `Copied ${countLabel} to clipboard!`,
    `Saved: ${savedProducts.map(p => p.name).join(', ')}`
  );
}

/**
 * Calculates live serving metadata and an estimated price range for a custom cake spec.
 */
export function getCustomCakeSummary({ style, flavor, size }) {
  const sizeMeta = CUSTOM_CAKE_SPECS.sizes[size] || CUSTOM_CAKE_SPECS.sizes['1 Pound'];
  const styleMeta = CUSTOM_CAKE_SPECS.styles[style] || CUSTOM_CAKE_SPECS.styles.Birthday;
  const flavorMeta = CUSTOM_CAKE_SPECS.flavors[flavor] || CUSTOM_CAKE_SPECS.flavors.Chocolate;

  const min = sizeMeta.baseMin + styleMeta.addMin + flavorMeta.addPrice;
  const max = sizeMeta.isOpenEnded
    ? null
    : sizeMeta.baseMax + styleMeta.addMax + flavorMeta.addPrice;

  const fmt = val => `${CONFIG.currencySymbol}${val.toLocaleString('en-US')}`;
  const priceLabel = sizeMeta.isOpenEnded
    ? `From ${fmt(min)}+`
    : `Est. ${fmt(min)} – ${fmt(max)}`;
  const compactPriceLabel = sizeMeta.isOpenEnded
    ? `${fmt(min)}+`
    : `${fmt(min)}–${fmt(max)}`;

  const leadTime =
    size === '2.5+ Pound / Tiered' || style === 'Theme / Character'
      ? '4–7 days notice'
      : styleMeta.leadTime;

  return {
    sizeMeta,
    styleMeta,
    flavorMeta,
    min,
    max,
    isOpenEnded: sizeMeta.isOpenEnded,
    priceLabel,
    compactPriceLabel,
    leadTime
  };
}

/**
 * Builds a clean summary string for a custom cake inquiry.
 */
export function formatCustomCakeBrief({ style, flavor, size, notes }) {
  const cleanNotes = (notes || '').trim();
  const { sizeMeta, priceLabel } = getCustomCakeSummary({ style, flavor, size });
  const base = `Custom ${style} Cake | Flavour: ${flavor} | Size: ${size} (${sizeMeta.shortServings}) | ${priceLabel}`;
  return cleanNotes ? `${base} | Theme/Notes: ${cleanNotes}` : base;
}

/**
 * Copies a custom cake brief and opens Facebook Messenger.
 */
export function handleCustomOrderInquiry(e, elements, customSpec) {
  const brief = formatCustomCakeBrief(customSpec);
  const message = `Hello Frostoria! I'd love to build a custom cake: ${brief}. Could you share availability and final pricing?`;
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
