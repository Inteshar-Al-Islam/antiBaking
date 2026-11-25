/**
 * Escapes HTML special characters for safe template interpolation.
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildFallbackSvg(name) {
  const safeName = escapeHtml(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="100%" height="100%" fill="#F5ECE3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6E4E37" font-family="sans-serif" font-size="18">🎂 ${safeName}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Updates live creation count badges with optional pop animation.
 */
export function updateCountBadges(elements, text, animate = true) {
  const countBadges = [elements.itemCount, elements.drawerItemCount].filter(Boolean);
  countBadges.forEach(badge => {
    badge.textContent = text;
    if (!animate) return;
    badge.classList.remove('badge-pop');
    void badge.offsetWidth;
    badge.classList.add('badge-pop');
  });
}

/**
 * Displays a user-friendly error state when products.json fails to load.
 */
export function showCatalogLoadError(elements) {
  updateCountBadges(elements, 'Catalog unavailable', false);
  if (!elements.productGrid) return;

  const isFileProtocol = window.location.protocol === 'file:';
  const hint = isFileProtocol
    ? 'Open this site via a local web server (e.g. npx serve or VS Code Live Server) so products.json can load.'
    : 'Please refresh the page to try loading the catalog again.';

  elements.emptyState?.classList.add('hidden');
  elements.productGrid.innerHTML = `
    <div class="col-span-full text-center py-16 px-4 bg-white/80 rounded-2xl border border-[#EFE8E1]">
      <h3 class="font-serif text-xl font-medium text-warm-800">Unable to load cake catalog</h3>
      <p class="text-sm text-warm-600 mt-2 max-w-md mx-auto">${escapeHtml(hint)}</p>
    </div>
  `;
}

/**
 * Renders filtered product cards into the showcase grid and toggles empty state.
 */
export function renderProductGrid(elements, filteredProducts) {
  if (!elements.productGrid) return;

  const count = filteredProducts.length;
  updateCountBadges(elements, `${count} ${count === 1 ? 'Creation' : 'Creations'} Available`);

  if (count === 0) {
    elements.productGrid.innerHTML = '';
    elements.emptyState?.classList.remove('hidden');
    return;
  }

  elements.emptyState?.classList.add('hidden');

  elements.productGrid.innerHTML = filteredProducts
    .map((product, index) => {
      const safeName = escapeHtml(product.name);
      const safeImagePath = escapeHtml(product.imagePath);
      const fallbackSrc = escapeHtml(buildFallbackSvg(product.name));
      const animDelay = Math.min(index * 35, 420);

      return `
        <article 
          class="product-card group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#EFE8E1] cursor-pointer flex flex-col select-none"
          data-index="${index}"
          style="--card-delay: ${animDelay}ms;"
          role="button"
          tabindex="0"
          aria-label="View details for ${safeName}"
        >
          <div class="product-image-wrap aspect-square w-full relative overflow-hidden bg-[#FAF7F2]">
            <img 
              src="${safeImagePath}" 
              alt="${safeName}" 
              loading="lazy"
              decoding="async"
              data-fallback="${fallbackSrc}"
              class="product-image w-full h-full object-cover object-center pointer-events-none"
              onerror="this.onerror=null; this.src=this.dataset.fallback;"
            />
            
            <div class="absolute top-1.5 inset-x-1.5 sm:top-3 sm:inset-x-3 flex items-center justify-between gap-1 pointer-events-none z-10">
              <span class="pointer-events-none px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-xs font-medium tracking-wide bg-white/95 backdrop-blur-xs text-[#6E4E37] rounded-full border border-[#EFE8E1] shadow-xs truncate shrink">
                <span class="sm:hidden">${escapeHtml(product.shortCategoryLabel)}</span>
                <span class="hidden sm:inline">${escapeHtml(product.categoryLabel)}</span>
              </span>

              ${
                product.featured
                  ? `
                <span class="pointer-events-none shrink-0 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-xs font-semibold tracking-wide bg-[#B87333] text-white rounded-full shadow-xs flex items-center gap-0.5 sm:gap-1">
                  <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-200 fill-current shrink-0" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <span>Featured</span>
                </span>
              `
                  : ''
              }
            </div>

            <div class="pointer-events-none absolute inset-0 bg-[#26180F]/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span class="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/95 text-[#26180F] rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-[#B87333]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </span>
            </div>
          </div>

          <div class="p-3 sm:p-5 flex-1 flex flex-col justify-between bg-white">
            <div>
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2.5">
                <h3 class="font-serif text-xs sm:text-lg font-medium text-[#26180F] line-clamp-2 sm:line-clamp-1 group-hover:text-[#B87333] transition-colors leading-snug sm:leading-normal" title="${safeName}">
                  ${safeName}
                </h3>
                <span class="shrink-0 self-start sm:self-auto inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#FAF7F2] text-[#6E4E37] font-bold sm:font-semibold text-xs sm:text-sm rounded-md sm:rounded-lg border border-[#EFE8E1]">
                  ${escapeHtml(product.price)}
                </span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-2 sm:mt-2.5 text-xs text-[#73655A]">
              <span class="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EFE8E1] text-[10px] sm:text-[11px] font-medium text-[#6E4E37] whitespace-nowrap">
                ${escapeHtml(product.flavor)}
              </span>
              <span class="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EFE8E1] text-[10px] sm:text-[11px] text-[#73655A] whitespace-nowrap">
                ${escapeHtml(product.size)}
              </span>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

const THUMB_BASE_CLASSES =
  'lightbox-thumb-btn w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer';
const THUMB_ACTIVE_CLASSES = `${THUMB_BASE_CLASSES} border-[#B87333] ring-2 ring-[#B87333]/30 scale-105 shadow-xs`;
const THUMB_INACTIVE_CLASSES = `${THUMB_BASE_CLASSES} border-[#E5DCD3] hover:border-caramel-400 opacity-70 hover:opacity-100`;

let savedBodyScrollY = 0;
let lastTriggerElement = null;

function getFocusableModalElements(modal) {
  const dialog = modal?.querySelector('.modal-dialog');
  if (!dialog) return [];
  const selector =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])';
  return Array.from(dialog.querySelectorAll(selector)).filter(
    el => !el.closest('.hidden') && el.getClientRects().length > 0
  );
}

/**
 * Traps Tab / Shift+Tab keyboard focus inside the open lightbox modal dialog.
 */
export function trapLightboxFocus(elements, event) {
  if (event.key !== 'Tab') return;
  const modal = elements.lightbox || document.getElementById('lightboxModal');
  if (!modal?.classList.contains('active')) return;

  const dialog = modal.querySelector('.modal-dialog');
  const focusables = getFocusableModalElements(modal);
  if (focusables.length === 0) {
    event.preventDefault();
    dialog?.focus({ preventScroll: true });
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (!dialog?.contains(active)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus({ preventScroll: true });
    return;
  }

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus({ preventScroll: true });
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  }
}

/**
 * Opens the lightbox modal for the given index in filteredProducts.
 */
export function openLightbox(elements, filteredProducts, index, triggerElement = null) {
  if (index < 0 || index >= filteredProducts.length) return false;
  const product = filteredProducts[index];
  if (!product) return false;

  const modal = elements.lightbox || document.getElementById('lightboxModal');
  if (!modal) return false;

  const wasOpen = modal.classList.contains('active');
  if (!wasOpen) {
    lastTriggerElement = triggerElement || document.activeElement;
  }

  const img = elements.lightboxImg || document.getElementById('lightboxImg');
  if (img) {
    img.src = product.imagePath;
    img.alt = product.name;
    img.classList.remove('lightbox-img-enter');
    void img.offsetWidth;
    img.classList.add('lightbox-img-enter');
  }

  if (elements.lightboxTitle) elements.lightboxTitle.textContent = product.name;
  if (elements.lightboxPrice) elements.lightboxPrice.textContent = product.price;
  if (elements.lightboxCategory) elements.lightboxCategory.textContent = product.categoryLabel;
  if (elements.lightboxFlavour) elements.lightboxFlavour.textContent = product.flavor;
  if (elements.lightboxSize) elements.lightboxSize.textContent = product.size;
  if (elements.lightboxDetails) elements.lightboxDetails.textContent = product.details;

  const productImages = product.images.length > 0 ? product.images : [product.imagePath];
  const thumbsContainer = elements.lightboxThumbnailsContainer;
  const thumbs = elements.lightboxThumbnails;

  if (thumbsContainer && thumbs) {
    if (productImages.length > 1) {
      thumbsContainer.classList.remove('hidden');
      const safeName = escapeHtml(product.name);
      thumbs.innerHTML = productImages
        .map(
          (imgPath, imgIdx) => `
          <button
            type="button"
            class="${imgIdx === 0 ? THUMB_ACTIVE_CLASSES : THUMB_INACTIVE_CLASSES}"
            data-img-index="${imgIdx}"
            title="View photo ${imgIdx + 1}"
            aria-label="View photo ${imgIdx + 1}"
          >
            <img src="${escapeHtml(imgPath)}" alt="${safeName} view ${imgIdx + 1}" loading="lazy" decoding="async" class="w-full h-full object-cover object-center" />
          </button>
        `
        )
        .join('');

      thumbs.querySelectorAll('.lightbox-thumb-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const targetIdx = parseInt(btn.getAttribute('data-img-index'), 10);
          if (img) {
            img.src = productImages[targetIdx];
            img.classList.remove('lightbox-img-enter');
            void img.offsetWidth;
            img.classList.add('lightbox-img-enter');
          }

          thumbs.querySelectorAll('.lightbox-thumb-btn').forEach((b, idx) => {
            b.className = idx === targetIdx ? THUMB_ACTIVE_CLASSES : THUMB_INACTIVE_CLASSES;
          });
        });
      });
    } else {
      thumbsContainer.classList.add('hidden');
      thumbs.innerHTML = '';
    }
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  // Flush CSS visibility: visible synchronously so focus() inside the modal succeeds immediately.
  void modal.offsetWidth;

  // Lock background scroll on mobile & desktop without losing scroll position.
  if (!wasOpen) {
    savedBodyScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add('modal-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedBodyScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  const dialog = modal.querySelector('.modal-dialog');
  if (dialog) dialog.scrollTop = 0;
  const sidebarScroll = modal.querySelector('.modal-sidebar-scroll');
  if (sidebarScroll) sidebarScroll.scrollTop = 0;

  if (elements.lightboxPrev) {
    elements.lightboxPrev.disabled = index === 0;
    elements.lightboxPrev.classList.toggle('opacity-30', index === 0);
  }
  if (elements.lightboxNext) {
    elements.lightboxNext.disabled = index === filteredProducts.length - 1;
    elements.lightboxNext.classList.toggle('opacity-30', index === filteredProducts.length - 1);
  }

  // Keep focus inside the modal on initial open or if an active nav button becomes disabled.
  if (!wasOpen) {
    const initialFocusTarget =
      elements.lightboxClose || getFocusableModalElements(modal)[0] || dialog;
    initialFocusTarget?.focus({ preventScroll: true });
    if (typeof window.requestAnimationFrame === 'function' && !dialog?.contains(document.activeElement)) {
      window.requestAnimationFrame(() => {
        if (modal.classList.contains('active') && !dialog?.contains(document.activeElement)) {
          initialFocusTarget?.focus({ preventScroll: true });
        }
      });
    }
  } else if (document.activeElement?.disabled) {
    const fallbackTarget =
      (!elements.lightboxNext?.disabled && elements.lightboxNext) ||
      (!elements.lightboxPrev?.disabled && elements.lightboxPrev) ||
      elements.lightboxClose ||
      dialog;
    fallbackTarget?.focus({ preventScroll: true });
  }

  return true;
}

/**
 * Closes the lightbox modal, restores scroll position, and returns focus to trigger.
 */
export function closeLightbox(elements) {
  const modal = elements.lightbox || document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.body.classList.remove('modal-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, savedBodyScrollY);

  if (lastTriggerElement && lastTriggerElement.isConnected && typeof lastTriggerElement.focus === 'function') {
    lastTriggerElement.focus({ preventScroll: true });
  }
  lastTriggerElement = null;
}
