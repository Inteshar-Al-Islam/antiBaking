import {
  CATEGORY_META,
  CUSTOM_CAKE_SPECS,
  FLAVOUR_LABELS,
  PRICE_RANGE_LABELS,
  SIZE_RANGE_LABELS
} from './config.js';
import { formatSavedCakesMessage, formatCustomCakeBrief, getCustomCakeSummary } from './actions.js';

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
  const countBadges = [
    elements.itemCount,
    elements.drawerItemCount,
    elements.menuDrawerItemCount
  ].filter(Boolean);
  countBadges.forEach(badge => {
    badge.textContent = text;
    if (!animate) return;
    badge.classList.remove('badge-pop');
    void badge.offsetWidth;
    badge.classList.add('badge-pop');
  });
}

/**
 * Renders removable active filter summary chips above the product gallery.
 */
export function renderActiveFilterChips(elements, filterState) {
  const container = elements.activeFilterChips;
  if (!container) return;

  const chips = [];

  if (filterState.searchQuery) {
    chips.push({
      type: 'search',
      value: 'search',
      label: `Search: "${filterState.searchQuery}"`
    });
  }

  filterState.activeCategories?.forEach(cat => {
    chips.push({
      type: 'category',
      value: cat,
      label: CATEGORY_META[cat]?.label || cat
    });
  });

  filterState.activeFlavours?.forEach(flav => {
    chips.push({
      type: 'flavour',
      value: flav,
      label: FLAVOUR_LABELS[flav] || flav
    });
  });

  filterState.activePriceRanges?.forEach(range => {
    chips.push({
      type: 'price',
      value: range,
      label: PRICE_RANGE_LABELS[range] || range
    });
  });

  filterState.activeSizes?.forEach(size => {
    chips.push({
      type: 'size',
      value: size,
      label: SIZE_RANGE_LABELS[size] || size
    });
  });

  if (filterState.featuredOnly) {
    chips.push({
      type: 'featured',
      value: 'featured',
      label: 'Featured Only ★'
    });
  }

  if (chips.length === 0) {
    container.classList.add('hidden');
    container.classList.remove('flex');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');
  container.classList.add('flex');

  const chipsHtml = chips
    .map(
      chip => `
      <button
        type="button"
        data-remove-filter-type="${escapeHtml(chip.type)}"
        data-remove-filter-value="${escapeHtml(chip.value)}"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-caramel-50 text-xs font-medium text-mocha-800 border border-[#DFD4C7] hover:border-caramel-400 shadow-2xs transition-colors cursor-pointer"
        aria-label="Remove filter ${escapeHtml(chip.label)}"
      >
        <span>${escapeHtml(chip.label)}</span>
        <span class="text-warm-600 hover:text-mocha-900 font-bold leading-none" aria-hidden="true">×</span>
      </button>
    `
    )
    .join('');

  container.innerHTML = `
    <span class="text-[11px] font-bold uppercase tracking-wider text-mocha-700 mr-0.5">Active:</span>
    ${chipsHtml}
    <button
      type="button"
      data-clear-all-filters="true"
      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-caramel-700 hover:text-mocha-900 hover:bg-white/80 transition-colors cursor-pointer"
    >
      Clear all
    </button>
  `;
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
export function renderProductGrid(elements, filteredProducts, savedIds = []) {
  if (!elements.productGrid) return;

  const count = filteredProducts.length;
  updateCountBadges(elements, `${count} ${count === 1 ? 'Creation' : 'Creations'} Available`);

  if (count === 0) {
    elements.productGrid.innerHTML = '';
    elements.emptyState?.classList.remove('hidden');
    return;
  }

  elements.emptyState?.classList.add('hidden');
  const savedSet = new Set(savedIds);

  elements.productGrid.innerHTML = filteredProducts
    .map((product, index) => {
      const safeId = escapeHtml(product.id);
      const safeName = escapeHtml(product.name);
      const safeImagePath = escapeHtml(product.imagePath);
      const fallbackSrc = escapeHtml(buildFallbackSvg(product.name));
      const animDelay = Math.min(index * 35, 420);
      const isSaved = savedSet.has(product.id);

      return `
        <article 
          class="product-card group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E5D8CA] cursor-pointer flex flex-col select-none"
          data-index="${index}"
          data-product-id="${safeId}"
          style="--card-delay: ${animDelay}ms;"
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

            <button
              type="button"
              class="card-save-btn${isSaved ? ' is-saved' : ''} absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-caramel-500"
              data-product-id="${safeId}"
              data-product-name="${safeName}"
              aria-pressed="${isSaved ? 'true' : 'false'}"
              aria-label="${isSaved ? `Remove ${safeName} from saved` : `Save ${safeName} to favorites`}"
              title="${isSaved ? 'Saved in wishlist' : 'Save to wishlist'}"
            >
              <svg class="w-4 h-4 pointer-events-none" fill="${isSaved ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

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
                <h3 class="font-serif text-xs sm:text-lg font-medium text-[#26180F] group-hover:text-[#B87333] transition-colors leading-snug sm:leading-normal min-w-0" title="${safeName}">
                  <button
                    type="button"
                    class="card-open-btn block w-full text-left cursor-pointer focus:outline-hidden"
                    aria-label="View details for ${safeName}"
                  >
                    <span class="line-clamp-2 sm:line-clamp-1">${safeName}</span>
                  </button>
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

function applyFavoriteButtonState(btn, productName, isSaved, animate = false) {
  if (!btn) return;
  btn.classList.toggle('is-saved', isSaved);
  btn.setAttribute('aria-pressed', String(isSaved));
  btn.setAttribute(
    'aria-label',
    isSaved ? `Remove ${productName} from saved` : `Save ${productName} to favorites`
  );
  btn.setAttribute('title', isSaved ? 'Saved in wishlist' : 'Save to wishlist');

  const svg = btn.querySelector('svg');
  if (svg) {
    svg.setAttribute('fill', isSaved ? 'currentColor' : 'none');
  }

  if (animate) {
    btn.classList.remove('heart-pop');
    void btn.offsetWidth;
    btn.classList.add('heart-pop');
  }
}

/**
 * Updates the heart button state on matching rendered product cards in-place.
 */
export function syncCardFavoriteButtons(elements, savedIds, targetProductId = null, animate = false) {
  if (!elements.productGrid) return;
  const savedSet = new Set(savedIds);
  const buttons = elements.productGrid.querySelectorAll('.card-save-btn');
  buttons.forEach(btn => {
    const id = btn.dataset.productId;
    if (!id) return;
    if (targetProductId && id !== targetProductId) return;
    const isSaved = savedSet.has(id);
    const name = btn.dataset.productName || 'this cake';
    applyFavoriteButtonState(btn, name, isSaved, animate && targetProductId === id);
  });
}

/**
 * Syncs the Lightbox modal's Save/Saved button with the active product's wishlist state.
 */
export function syncLightboxFavoriteButton(elements, product, savedIds, animate = false) {
  const btn = elements.lightboxSaveBtn;
  if (!btn || !product) return;
  const isSaved = Array.isArray(savedIds) && savedIds.includes(product.id);

  btn.setAttribute('aria-pressed', String(isSaved));
  btn.setAttribute(
    'aria-label',
    isSaved ? `Remove ${product.name} from saved` : `Save ${product.name} to favorites`
  );
  btn.classList.toggle('bg-[#FFF4F5]', isSaved);
  btn.classList.toggle('border-[#F0BDC4]', isSaved);
  btn.classList.toggle('text-[#B83B4B]', isSaved);
  btn.classList.toggle('bg-cream-50', !isSaved);
  btn.classList.toggle('border-[#E5DCD3]', !isSaved);
  btn.classList.toggle('text-warm-700', !isSaved);

  if (elements.lightboxSaveHeartIcon) {
    elements.lightboxSaveHeartIcon.setAttribute('fill', isSaved ? 'currentColor' : 'none');
    elements.lightboxSaveHeartIcon.classList.toggle('text-[#C84B5A]', isSaved);
    if (animate) {
      elements.lightboxSaveHeartIcon.classList.remove('heart-pop');
      void elements.lightboxSaveHeartIcon.offsetWidth;
      elements.lightboxSaveHeartIcon.classList.add('heart-pop');
    }
  }

  if (elements.lightboxSaveBtnText) {
    elements.lightboxSaveBtnText.textContent = isSaved ? 'Saved' : 'Save Pick';
  }
}

/**
 * Updates the floating "Saved (N)" pill visibility, count text, and pop feedback.
 */
export function updateSavedFloatingPill(elements, savedCount, animate = false) {
  const pill = elements.savedFloatingBtn;
  if (!pill) return;

  const visible = savedCount > 0;
  if (elements.savedFloatingLabel) {
    elements.savedFloatingLabel.textContent = `Saved (${savedCount})`;
  }
  pill.setAttribute(
    'aria-label',
    `Open saved cakes comparison drawer (${savedCount} ${savedCount === 1 ? 'cake' : 'cakes'} saved)`
  );

  pill.classList.toggle('opacity-100', visible);
  pill.classList.toggle('pointer-events-auto', visible);
  pill.classList.toggle('translate-y-0', visible);
  pill.classList.toggle('opacity-0', !visible);
  pill.classList.toggle('pointer-events-none', !visible);
  pill.classList.toggle('translate-y-3', !visible);

  if (animate && visible) {
    pill.classList.remove('pill-pop');
    void pill.offsetWidth;
    pill.classList.add('pill-pop');
  }
}

/**
 * Renders the Saved Favorites / Wishlist side-by-side comparison drawer contents.
 */
export function renderSavedDrawer(elements, savedProducts) {
  const count = Array.isArray(savedProducts) ? savedProducts.length : 0;

  if (elements.savedDrawerCountBadge) {
    elements.savedDrawerCountBadge.textContent = `${count} ${count === 1 ? 'pick' : 'picks'}`;
  }

  elements.savedClearAllBtn?.classList.toggle('hidden', count === 0);

  if (count === 0) {
    elements.savedEmptyState?.classList.remove('hidden');
    elements.savedComparisonSummary?.classList.add('hidden');
    elements.savedComparisonSummary?.classList.remove('flex');
    elements.savedDrawerFooter?.classList.add('hidden');
    if (elements.savedComparisonList) {
      elements.savedComparisonList.className = 'saved-comparison-track';
      elements.savedComparisonList.innerHTML = '';
    }
    return;
  }

  elements.savedEmptyState?.classList.add('hidden');
  elements.savedDrawerFooter?.classList.remove('hidden');

  const pricedValues = savedProducts
    .map(p => p.numericPrice)
    .filter(price => typeof price === 'number' && price > 0);
  const minPrice = pricedValues.length > 0 ? Math.min(...pricedValues) : 0;
  const maxPrice = pricedValues.length > 0 ? Math.max(...pricedValues) : 0;
  const showBestValueTag = pricedValues.length >= 2 && minPrice !== maxPrice;
  const uniqueFlavours = new Set(
    savedProducts.map(p => p.flavor.trim().toLowerCase()).filter(Boolean)
  ).size;

  if (elements.savedComparisonSummary) {
    elements.savedComparisonSummary.classList.remove('hidden');
    elements.savedComparisonSummary.classList.add('flex');

    let priceSummary = '';
    if (minPrice > 0) {
      priceSummary =
        minPrice === maxPrice
          ? `৳${minPrice.toLocaleString('en-US')}`
          : `৳${minPrice.toLocaleString('en-US')} – ৳${maxPrice.toLocaleString('en-US')}`;
    }

    const summaryLead =
      count === 1
        ? '1 cake saved — tap ♥ on another cake to compare side-by-side'
        : `Comparing ${count} saved picks side-by-side`;

    const summaryPills = [
      priceSummary ? `<span class="px-2 py-0.5 rounded-full bg-caramel-50 text-mocha-800 border border-caramel-200 font-semibold">${escapeHtml(priceSummary)}</span>` : '',
      uniqueFlavours > 0 ? `<span class="px-2 py-0.5 rounded-full bg-cream-100 text-warm-700 border border-[#E5DCD3]">${uniqueFlavours} ${uniqueFlavours === 1 ? 'flavour' : 'flavours'}</span>` : '',
      count >= 2 ? '<span class="md:hidden text-[11px] font-medium text-caramel-700">Swipe ↔</span>' : ''
    ]
      .filter(Boolean)
      .join('');

    elements.savedComparisonSummary.innerHTML = `
      <span class="font-medium text-warm-800">${escapeHtml(summaryLead)}</span>
      <div class="flex flex-wrap items-center gap-1.5">${summaryPills}</div>
    `;
  }

  if (elements.savedComparisonList) {
    const layoutMod = count === 1 ? 'is-single' : count === 2 ? 'is-two' : '';
    elements.savedComparisonList.className = `saved-comparison-track${layoutMod ? ` ${layoutMod}` : ''}`;

    const cardsHtml = savedProducts
      .map(product => {
        const safeId = escapeHtml(product.id);
        const safeName = escapeHtml(product.name);
        const safeImagePath = escapeHtml(product.imagePath);
        const fallbackSrc = escapeHtml(buildFallbackSvg(product.name));
        const isLowestPrice = showBestValueTag && product.numericPrice === minPrice;

        return `
          <article class="saved-comparison-card bg-white rounded-2xl border border-[#E5D8CA] overflow-hidden shadow-xs flex flex-col">
            <div class="relative aspect-square bg-[#FAF7F2] overflow-hidden">
              <button
                type="button"
                data-inspect-saved-id="${safeId}"
                class="block w-full h-full cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-caramel-500"
                aria-label="Inspect ${safeName}"
              >
                <img
                  src="${safeImagePath}"
                  alt="${safeName}"
                  loading="lazy"
                  decoding="async"
                  data-fallback="${fallbackSrc}"
                  class="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300 pointer-events-none"
                  onerror="this.onerror=null; this.src=this.dataset.fallback;"
                />
              </button>

              <span class="pointer-events-none absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium bg-white/95 text-mocha-700 rounded-full border border-[#EFE8E1] shadow-2xs">
                ${escapeHtml(product.shortCategoryLabel)}
              </span>

              <button
                type="button"
                data-remove-saved-id="${safeId}"
                class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 hover:bg-[#FFF4F5] text-warm-600 hover:text-[#C84B5A] border border-[#E5DCD3] hover:border-[#F0BDC4] shadow-xs flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Remove ${safeName} from saved"
                title="Remove from saved"
              >
                <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between gap-2 sm:gap-2.5">
              <div>
                <h4 class="font-serif text-xs sm:text-[15px] font-semibold text-warm-900 leading-snug min-h-[2.15rem] sm:min-h-[2.45rem] line-clamp-2" title="${safeName}">
                  <button
                    type="button"
                    data-inspect-saved-id="${safeId}"
                    class="text-left hover:text-caramel-600 transition-colors cursor-pointer"
                  >
                    ${safeName}
                  </button>
                </h4>

                <dl class="mt-2 divide-y divide-[#EFE8E1] text-[11px] sm:text-xs">
                  <div class="py-1.5 flex items-center justify-between gap-2">
                    <dt class="text-warm-600 shrink-0">Price</dt>
                    <dd class="font-bold text-mocha-800 flex items-center gap-1 text-right">
                      <span>${escapeHtml(product.price)}</span>
                      ${
                        isLowestPrice
                          ? '<span class="px-1.5 py-0.2 rounded-full bg-caramel-100 text-caramel-700 text-[9px] font-bold uppercase tracking-wide">Value</span>'
                          : ''
                      }
                    </dd>
                  </div>
                  <div class="py-1.5 flex items-center justify-between gap-2">
                    <dt class="text-warm-600 shrink-0">Flavour</dt>
                    <dd class="font-medium text-warm-900 truncate text-right" title="${escapeHtml(product.flavor)}">${escapeHtml(product.flavor)}</dd>
                  </div>
                  <div class="py-1.5 flex items-center justify-between gap-2">
                    <dt class="text-warm-600 shrink-0">Size</dt>
                    <dd class="font-medium text-warm-900 truncate text-right" title="${escapeHtml(product.size)}">${escapeHtml(product.size)}</dd>
                  </div>
                  <div class="py-1.5 flex items-center justify-between gap-2">
                    <dt class="text-warm-600 shrink-0">Style</dt>
                    <dd class="font-medium text-warm-800 truncate text-right">${escapeHtml(product.categoryLabel)}</dd>
                  </div>
                </dl>
              </div>

              <button
                type="button"
                data-inspect-saved-id="${safeId}"
                class="w-full py-1.5 px-2.5 rounded-lg bg-cream-50 hover:bg-caramel-50 text-mocha-800 text-[11px] font-semibold border border-[#E5DCD3] hover:border-caramel-300 transition-colors cursor-pointer"
              >
                View Full Details
              </button>
            </div>
          </article>
        `;
      })
      .join('');

    const singleTipHtml =
      count === 1
        ? `
          <div class="rounded-2xl border border-dashed border-[#DFD2C4] bg-white/75 p-4 flex flex-col justify-center items-start gap-2 text-left">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-caramel-50 text-caramel-700 text-[10px] font-bold uppercase tracking-wider border border-caramel-200">
              Side-by-Side Tip
            </span>
            <p class="font-serif text-base font-medium text-warm-900">Compare your top picks</p>
            <p class="text-xs text-warm-600 leading-relaxed">
              Tap the <span class="text-[#C84B5A] font-semibold">♥</span> heart icon on any other cake card to compare prices, flavours, and sizes side-by-side — or send this cake straight to Messenger now.
            </p>
          </div>
        `
        : '';

    elements.savedComparisonList.innerHTML = `${cardsHtml}${singleTipHtml}`;
  }

  if (elements.savedMessagePreview) {
    elements.savedMessagePreview.textContent = formatSavedCakesMessage(savedProducts);
  }
  if (elements.savedSendMessengerLabel) {
    elements.savedSendMessengerLabel.textContent =
      count === 1
        ? 'Send Pick to Messenger'
        : `Send All (${count}) to Messenger`;
  }
}

const THUMB_BASE_CLASSES =
  'lightbox-thumb-btn w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer';
const THUMB_ACTIVE_CLASSES = `${THUMB_BASE_CLASSES} border-[#B87333] ring-2 ring-[#B87333]/30 scale-105 shadow-xs`;
const THUMB_INACTIVE_CLASSES = `${THUMB_BASE_CLASSES} border-[#E5DCD3] hover:border-caramel-400 opacity-70 hover:opacity-100`;

let savedBodyScrollY = 0;
const overlayFocusStack = [];

function buildStyleDecorSvg(motif, accent, isTiered) {
  const topY = isTiered ? 26 : motif === 'tall' ? 36 : 38;
  switch (motif) {
    case 'floral':
      return `
        <g transform="translate(0, ${topY - 38})">
          <circle cx="48" cy="37" r="4.5" fill="#F4BAC4" stroke="#FFFDF8" stroke-width="1" />
          <circle cx="48" cy="37" r="1.5" fill="#F5DF85" />
          <circle cx="60" cy="35" r="5.2" fill="#E88B9D" stroke="#FFFDF8" stroke-width="1" />
          <circle cx="60" cy="35" r="1.7" fill="#FFF3B0" />
          <circle cx="72" cy="37" r="4.3" fill="#F4BAC4" stroke="#FFFDF8" stroke-width="1" />
          <circle cx="72" cy="37" r="1.4" fill="#F5DF85" />
          <path d="M41 39 Q44 35 46 39 M74 39 Q77 35 79 39" fill="none" stroke="#7A9A65" stroke-width="1.6" stroke-linecap="round" />
        </g>
      `;
    case 'vintage':
      return `
        <g>
          <path d="M36 ${topY + 9} Q44 ${topY + 16} 52 ${topY + 9} Q60 ${topY + 16} 68 ${topY + 9} Q76 ${topY + 16} 84 ${topY + 9}" fill="none" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="44" cy="${topY + 3}" r="1.7" fill="#FFFDF9" />
          <circle cx="52" cy="${topY + 3}" r="1.7" fill="#FFFDF9" />
          <circle cx="60" cy="${topY + 3}" r="1.9" fill="#FFFDF9" />
          <circle cx="68" cy="${topY + 3}" r="1.7" fill="#FFFDF9" />
          <circle cx="76" cy="${topY + 3}" r="1.7" fill="#FFFDF9" />
        </g>
      `;
    case 'theme':
      return `
        <g transform="translate(0, ${topY - 38})">
          <line x1="60" y1="38" x2="60" y2="23" stroke="#8C674B" stroke-width="1.6" stroke-linecap="round" />
          <polygon points="60,13 62.6,18.4 68.5,19.2 64.2,23.3 65.3,29.1 60,26.3 54.7,29.1 55.8,23.3 51.5,19.2 57.4,18.4" fill="#E6A94D" stroke="#FFFDF8" stroke-width="1" />
          <circle cx="43" cy="24" r="1.6" fill="#C9986A" />
          <circle cx="77" cy="22" r="1.8" fill="#E6A94D" />
        </g>
      `;
    case 'occasion':
      return `
        <g transform="translate(0, ${topY - 38})">
          <path d="M60 35 C56 30, 49 27, 52 22 C54 19, 58 20, 60 23 C62 20, 66 19, 68 22 C71 27, 64 30, 60 35 Z" fill="#C98A5B" stroke="#FFFDF8" stroke-width="1.1" />
          <circle cx="47" cy="37" r="1.6" fill="${accent}" />
          <circle cx="73" cy="37" r="1.6" fill="${accent}" />
        </g>
      `;
    default:
      return `
        <g transform="translate(0, ${topY - 38})">
          <rect x="58.2" y="24" width="3.6" height="14" rx="1.6" fill="#F4EADF" stroke="#B87333" stroke-width="0.9" />
          <path d="M60 15.5 C62.5 18.8, 62.5 22, 60 23.4 C57.5 22, 57.5 18.8, 60 15.5 Z" fill="#F59E0B" />
          <circle cx="46" cy="37" r="1.6" fill="#E88B9D" />
          <circle cx="53" cy="36" r="1.5" fill="#F59E0B" />
          <circle cx="67" cy="36" r="1.5" fill="#82B366" />
          <circle cx="74" cy="37" r="1.6" fill="#C9986A" />
        </g>
      `;
  }
}

function buildCustomCakeSvg(sizeMeta, styleMeta, flavorMeta) {
  const variant = sizeMeta.tierVariant;
  const { body, shade, icing, accent } = flavorMeta;

  let cakeLayersSvg = '';
  if (variant === 'tiered') {
    cakeLayersSvg = `
      <rect x="20" y="48" width="80" height="25" rx="4" fill="${body}" stroke="${shade}" stroke-width="1.2" />
      <path d="M20 51 Q28 57 36 51 Q44 57 52 51 Q60 57 68 51 Q76 57 84 51 Q92 57 100 51 L100 48 L20 48 Z" fill="${icing}" opacity="0.94" />
      <rect x="35" y="26" width="50" height="22" rx="4" fill="${body}" stroke="${shade}" stroke-width="1.2" />
      <path d="M35 29 Q41 35 47 29 Q53 35 60 29 Q67 35 73 29 Q79 35 85 29 L85 26 L35 26 Z" fill="${icing}" />
      <line x1="21" y1="62" x2="99" y2="62" stroke="${accent}" stroke-width="1.4" stroke-dasharray="2.5 2.5" opacity="0.8" />
    `;
  } else {
    const dims =
      variant === 'wide'
        ? { x: 20, y: 38, w: 80, h: 35 }
        : variant === 'tall'
          ? { x: 29, y: 36, w: 62, h: 37 }
          : { x: 33, y: 42, w: 54, h: 31 };

    const step = dims.w / 5;
    const dripPath = [
      `M${dims.x} ${dims.y + 4}`,
      ...Array.from({ length: 5 }, (_, idx) => {
        const xMid = (dims.x + step * (idx + 0.5)).toFixed(1);
        const xEnd = (dims.x + step * (idx + 1)).toFixed(1);
        const sag = idx % 2 === 0 ? dims.y + 11 : dims.y + 8;
        return `Q${xMid} ${sag} ${xEnd} ${dims.y + 4}`;
      }),
      `L${dims.x + dims.w} ${dims.y} L${dims.x} ${dims.y} Z`
    ].join(' ');

    const middleSeamY = (dims.y + dims.h * 0.56).toFixed(1);

    cakeLayersSvg = `
      <rect x="${dims.x}" y="${dims.y}" width="${dims.w}" height="${dims.h}" rx="5" fill="${body}" stroke="${shade}" stroke-width="1.2" />
      <line x1="${dims.x + 2}" y1="${middleSeamY}" x2="${dims.x + dims.w - 2}" y2="${middleSeamY}" stroke="${accent}" stroke-width="1.5" opacity="0.72" />
      <path d="${dripPath}" fill="${icing}" />
    `;
  }

  const decorSvg = buildStyleDecorSvg(
    styleMeta.motif,
    accent,
    variant === 'tiered'
  );

  return `
    <svg class="w-24 h-20 sm:w-28 sm:h-24 mx-auto drop-shadow-xs" viewBox="0 0 120 94" fill="none" aria-hidden="true">
      <ellipse cx="60" cy="83" rx="34" ry="4.5" fill="#E8D4BF" opacity="0.7" />
      <path d="M54 76 L66 76 L69 83 L51 83 Z" fill="#DFC7AE" />
      <rect x="14" y="73" width="92" height="4.5" rx="2.25" fill="#FAF5EF" stroke="#D9C3AC" stroke-width="1.1" />
      ${cakeLayersSvg}
      ${decorSvg}
    </svg>
  `;
}

/**
 * Updates the live Custom Cake Builder visual preview card, serving guide, price estimate, and brief strip.
 */
export function renderCustomCakePreview(elements, customSpec) {
  const {
    sizeMeta,
    styleMeta,
    flavorMeta,
    priceLabel,
    leadTime
  } = getCustomCakeSummary(customSpec);

  if (elements.customCakePreview) {
    elements.customCakePreview.textContent = formatCustomCakeBrief(customSpec);
  }

  const card = elements.customCakeSummaryCard;
  if (!card) return;

  const cleanNotes = (customSpec.notes || '').trim();
  const safeStyle = escapeHtml(customSpec.style);
  const safeFlavor = escapeHtml(customSpec.flavor);
  const safeBadge = escapeHtml(styleMeta.badge);
  const safePriceLabel = escapeHtml(priceLabel);
  const safeLeadTime = escapeHtml(leadTime);
  const safeServings = escapeHtml(sizeMeta.servings);
  const safeDimensions = escapeHtml(sizeMeta.dimensions);
  const safeWeightBadge = escapeHtml(`${sizeMeta.shortWeight} · ${sizeMeta.tierLabel}`);

  const noteMarkup = cleanNotes
    ? `<p class="mt-1.5 text-[11px] text-mocha-700 bg-white/80 border border-[#EAE0D5] rounded-lg px-2.5 py-1 truncate" title="${escapeHtml(cleanNotes)}">
         <span class="font-semibold text-caramel-700">Note:</span> "${escapeHtml(cleanNotes)}"
       </p>`
    : '';

  const comparisonButtonsHtml = CUSTOM_CAKE_SPECS.sizeOrder
    .map(sizeKey => {
      const meta = CUSTOM_CAKE_SPECS.sizes[sizeKey];
      const isSelected = customSpec.size === sizeKey;
      return `
        <button
          type="button"
          data-compare-size="${escapeHtml(sizeKey)}"
          aria-pressed="${isSelected ? 'true' : 'false'}"
          class="custom-size-compare-card text-left rounded-xl px-2.5 py-2 border transition cursor-pointer ${
            isSelected
              ? 'active bg-mocha-600 text-white border-mocha-700 shadow-xs'
              : 'bg-white/90 hover:bg-white text-warm-800 border-[#E5D8CA] hover:border-caramel-400'
          }"
        >
          <div class="flex items-center justify-between gap-1.5">
            <span class="text-xs font-bold leading-tight whitespace-nowrap shrink-0">${escapeHtml(meta.shortWeight)}</span>
            <span class="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
              isSelected ? 'bg-white/25 text-white' : 'bg-cream-100 text-mocha-600'
            }">${escapeHtml(meta.shortTierLabel || meta.tierLabel)}</span>
          </div>
          <span class="block text-[10px] mt-1 font-medium ${
            isSelected ? 'text-caramel-100' : 'text-warm-600'
          }">${escapeHtml(meta.servings)}</span>
        </button>
      `;
    })
    .join('');

  card.innerHTML = `
    <div class="p-3.5 sm:p-4 space-y-3">
      <div class="flex flex-col sm:flex-row gap-3.5 items-stretch">
        <!-- Dynamic Visual Cake Preview Badge -->
        <div class="custom-cake-stage sm:w-36 shrink-0 rounded-2xl p-2.5 flex flex-col items-center justify-between text-center">
          <div class="w-full flex items-center justify-between gap-1 text-[9px] font-bold uppercase tracking-wider text-mocha-700">
            <span class="inline-flex items-center gap-1 truncate">
              <span class="w-2 h-2 rounded-full border border-black/15 shrink-0" style="background-color: ${escapeHtml(flavorMeta.body)};"></span>
              <span class="truncate">${safeFlavor}</span>
            </span>
          </div>
          <div class="my-1 w-full flex items-center justify-center">
            ${buildCustomCakeSvg(sizeMeta, styleMeta, flavorMeta)}
          </div>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-mocha-800 border border-[#E5D8CA] shadow-2xs">
            ${safeWeightBadge}
          </span>
        </div>

        <!-- Price Estimate & Serving Summary -->
        <div class="flex-1 min-w-0 flex flex-col justify-between gap-2">
          <div>
            <div class="flex flex-wrap items-center justify-between gap-1.5">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-caramel-700 border border-caramel-200">
                ${safeBadge}
              </span>
              <span class="inline-flex items-center gap-1 text-[10px] font-medium text-warm-600">
                <svg class="w-3 h-3 text-caramel-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${safeLeadTime}
              </span>
            </div>

            <div class="mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <div>
                <span class="block text-[10px] font-semibold uppercase tracking-wider text-warm-600">Estimated Quote</span>
                <p class="font-serif text-xl sm:text-2xl font-bold text-mocha-900 leading-tight">${safePriceLabel}</p>
              </div>
              <span class="text-[10px] font-medium text-warm-600">Final quote via Messenger</span>
            </div>
          </div>

          <div class="rounded-xl bg-white/90 border border-[#E5D8CA] px-3 py-2">
            <div class="flex flex-wrap items-center justify-between gap-1.5">
              <span class="inline-flex items-center gap-1.5 text-xs font-bold text-mocha-800">
                <svg class="w-3.5 h-3.5 text-caramel-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ${safeServings}
              </span>
              <span class="text-[11px] text-warm-600">${safeDimensions}</span>
            </div>
            <p class="text-[11px] text-warm-600 mt-1">
              Style: <span class="font-semibold text-warm-800">${safeStyle}</span> · Flavour: <span class="font-semibold text-warm-800">${safeFlavor}</span>
            </p>
            ${noteMarkup}
          </div>
        </div>
      </div>

      <!-- Interactive Size & Tier Comparison Guide -->
      <div class="pt-2.5 border-t border-caramel-200/70">
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <span class="text-[10px] font-bold uppercase tracking-wider text-mocha-700 whitespace-nowrap">Size &amp; Serving Guide</span>
          <span class="text-[10px] text-warm-600 whitespace-nowrap">Tap to switch</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          ${comparisonButtonsHtml}
        </div>
      </div>
    </div>
  `;
}

/**
 * Updates the hero showcase spotlight caption and floating price tag badge.
 */
export function updateHeroSpotlight(elements, product, activeIndex = 0) {
  if (!product) return;

  if (elements.heroBadgePrice) {
    elements.heroBadgePrice.textContent = product.price;
  }
  if (elements.heroBadgeCategory) {
    elements.heroBadgeCategory.textContent = product.shortCategoryLabel || 'Featured';
  }
  if (elements.heroSpotlightTitle) {
    elements.heroSpotlightTitle.textContent = product.name;
    elements.heroSpotlightTitle.title = product.name;
  }
  if (elements.heroSpotlightMeta) {
    const metaParts = [product.flavor, product.size].filter(Boolean);
    elements.heroSpotlightMeta.textContent = metaParts.join(' • ') || product.categoryLabel;
  }
  if (elements.heroInspectBtn) {
    elements.heroInspectBtn.dataset.activeIndex = String(activeIndex);
    elements.heroInspectBtn.setAttribute('aria-label', `Inspect ${product.name}`);
  }

  elements.heroShowcaseStage?.querySelectorAll('.collage-photo-card').forEach((card, idx) => {
    card.classList.toggle('is-active', idx === activeIndex);
  });
}

/**
 * Renders 3 overlapping featured cake cards into the hero Signature Creations collage.
 */
export function renderHeroShowcase(elements, showcaseProducts) {
  const stage = elements.heroShowcaseStage;
  if (!stage || !Array.isArray(showcaseProducts) || showcaseProducts.length === 0) return;

  const slotClasses = ['collage-slot-primary', 'collage-slot-top', 'collage-slot-bottom'];

  stage.innerHTML = showcaseProducts
    .slice(0, 3)
    .map((product, index) => {
      const safeName = escapeHtml(product.name);
      const safeImagePath = escapeHtml(product.imagePath);
      const fallbackSrc = escapeHtml(buildFallbackSvg(product.name));
      const slotClass = slotClasses[index] || slotClasses[0];
      const activeClass = index === 0 ? ' is-active' : '';

      return `
        <button
          type="button"
          class="collage-photo-card ${slotClass}${activeClass} group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-caramel-500"
          data-hero-index="${index}"
          aria-label="Preview ${safeName} (${escapeHtml(product.price)})"
        >
          <span class="block w-full h-full rounded-xl overflow-hidden bg-cream-200 relative">
            <img
              src="${safeImagePath}"
              alt="${safeName}"
              decoding="async"
              data-fallback="${fallbackSrc}"
              class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              onerror="this.onerror=null; this.src=this.dataset.fallback;"
            />
            <span class="collage-card-scrim pointer-events-none absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-[#26180F]/75 via-[#26180F]/25 to-transparent flex items-end justify-between gap-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
              <span class="text-[10px] font-medium text-cream-50 truncate">${escapeHtml(product.shortCategoryLabel)}</span>
              <span class="text-[10px] font-bold text-caramel-200 shrink-0">${escapeHtml(product.price)}</span>
            </span>
          </span>
        </button>
      `;
    })
    .join('');

  updateHeroSpotlight(elements, showcaseProducts[0], 0);
}

function getDialogContainer(overlay) {
  return overlay?.querySelector('.modal-dialog, .drawer-panel');
}

function getFocusableModalElements(modal) {
  const dialog = getDialogContainer(modal);
  if (!dialog) return [];
  const selector =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])';
  return Array.from(dialog.querySelectorAll(selector)).filter(
    el => !el.closest('.hidden') && el.getClientRects().length > 0
  );
}

function hasActiveOverlay() {
  return Boolean(document.querySelector('.modal-backdrop.active, .drawer-backdrop.active'));
}

function lockBodyScroll() {
  if (document.body.classList.contains('modal-open')) return;
  savedBodyScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.classList.add('modal-open');
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedBodyScrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
}

function unlockBodyScrollIfNoneOpen() {
  if (hasActiveOverlay()) return;
  document.body.classList.remove('modal-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, savedBodyScrollY);
}

function pushOverlayTrigger(overlay, triggerElement) {
  const existingIdx = overlayFocusStack.findIndex(entry => entry.overlay === overlay);
  const entry = { overlay, trigger: triggerElement || document.activeElement };
  if (existingIdx !== -1) {
    overlayFocusStack[existingIdx] = entry;
  } else {
    overlayFocusStack.push(entry);
  }
}

function popOverlayTriggerAndRestoreFocus(overlay) {
  const idx = overlayFocusStack.findIndex(entry => entry.overlay === overlay);
  if (idx === -1) return;
  const [removed] = overlayFocusStack.splice(idx, 1);
  const trigger = removed?.trigger;
  if (
    trigger &&
    trigger.isConnected &&
    trigger.getClientRects().length > 0 &&
    typeof trigger.focus === 'function'
  ) {
    trigger.focus({ preventScroll: true });
  }
}

/**
 * Traps Tab / Shift+Tab keyboard focus inside an active modal or drawer dialog.
 */
export function trapModalFocus(modal, event) {
  if (event.key !== 'Tab' || !modal?.classList.contains('active')) return;

  const dialog = getDialogContainer(modal);
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
 * Traps Tab / Shift+Tab keyboard focus inside the open lightbox modal dialog.
 */
export function trapLightboxFocus(elements, event) {
  const modal = elements.lightbox || document.getElementById('lightboxModal');
  trapModalFocus(modal, event);
}

/**
 * Opens the lightbox modal for the given index in products.
 */
export function openLightbox(elements, products, index, triggerElement = null, savedIds = []) {
  if (index < 0 || index >= products.length) return false;
  const product = products[index];
  if (!product) return false;

  const modal = elements.lightbox || document.getElementById('lightboxModal');
  if (!modal) return false;

  const wasOpen = modal.classList.contains('active');
  if (!wasOpen) {
    pushOverlayTrigger(modal, triggerElement);
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
  syncLightboxFavoriteButton(elements, product, savedIds);

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
  void modal.offsetWidth;

  if (!wasOpen) {
    lockBodyScroll();
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
    elements.lightboxNext.disabled = index === products.length - 1;
    elements.lightboxNext.classList.toggle('opacity-30', index === products.length - 1);
  }

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
 * Tracks a single browser history entry while the lightbox is open so mobile
 * hardware Back closes the cake preview instead of navigating away.
 */
export function createLightboxHistoryController(
  historyApi = typeof window !== 'undefined' ? window.history : null
) {
  let nextId = 1;
  let activeId = null;

  return {
    onOpen() {
      if (activeId !== null || typeof historyApi?.pushState !== 'function') return;
      const baseState =
        historyApi.state && typeof historyApi.state === 'object' ? historyApi.state : {};
      const entryId = nextId++;
      activeId = entryId;
      try {
        historyApi.pushState({ ...baseState, frostoriaLightboxId: entryId }, '');
      } catch {
        activeId = null;
      }
    },

    onClose({ fromPopState = false } = {}) {
      const hadId = activeId;
      activeId = null;
      if (
        !fromPopState &&
        hadId !== null &&
        historyApi?.state?.frostoriaLightboxId === hadId &&
        typeof historyApi.back === 'function'
      ) {
        historyApi.back();
      }
    },

    shouldCloseOnPopState(eventState, isLightboxOpen) {
      if (!isLightboxOpen || activeId === null) return false;
      return eventState?.frostoriaLightboxId !== activeId;
    },

    getActiveId() {
      return activeId;
    }
  };
}

/**
 * Closes the lightbox modal, restores scroll position if no other overlay is open, and returns focus.
 */
export function closeLightbox(elements) {
  const modal = elements.lightbox || document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  unlockBodyScrollIfNoneOpen();
  popOverlayTriggerAndRestoreFocus(modal);
}

/**
 * Opens the Custom Cake Builder modal with focus management and scroll lock.
 */
export function openCustomCakeModal(elements, triggerElement = null) {
  const modal = elements.customCakeModal || document.getElementById('customCakeModal');
  if (!modal) return false;

  pushOverlayTrigger(modal, triggerElement);
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  void modal.offsetWidth;
  lockBodyScroll();

  const dialog = getDialogContainer(modal);
  if (dialog) dialog.scrollTop = 0;
  const target = elements.customCakeClose || getFocusableModalElements(modal)[0] || dialog;
  target?.focus({ preventScroll: true });
  return true;
}

/**
 * Closes the Custom Cake Builder modal and restores scroll/focus.
 */
export function closeCustomCakeModal(elements) {
  const modal = elements.customCakeModal || document.getElementById('customCakeModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  unlockBodyScrollIfNoneOpen();
  popOverlayTriggerAndRestoreFocus(modal);
}

/**
 * Opens the Saved Favorites Comparison Drawer with focus management and scroll lock.
 */
export function openSavedDrawer(elements, savedProducts, triggerElement = null) {
  const drawer = elements.savedDrawer || document.getElementById('savedDrawer');
  if (!drawer) return false;

  renderSavedDrawer(elements, savedProducts);
  pushOverlayTrigger(drawer, triggerElement);
  drawer.classList.add('active');
  drawer.setAttribute('aria-hidden', 'false');
  elements.savedFloatingBtn?.setAttribute('aria-expanded', 'true');
  void drawer.offsetWidth;
  lockBodyScroll();

  const panel = getDialogContainer(drawer);
  const body = drawer.querySelector('.drawer-body');
  if (body) body.scrollTop = 0;
  const target = elements.savedDrawerClose || getFocusableModalElements(drawer)[0] || panel;
  target?.focus({ preventScroll: true });
  return true;
}

/**
 * Closes the Saved Favorites Comparison Drawer and restores scroll/focus.
 */
export function closeSavedDrawer(elements) {
  const drawer = elements.savedDrawer || document.getElementById('savedDrawer');
  if (drawer) {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
  }
  elements.savedFloatingBtn?.setAttribute('aria-expanded', 'false');
  unlockBodyScrollIfNoneOpen();
  popOverlayTriggerAndRestoreFocus(drawer);
}

/**
 * Opens the left Menu & Multi-Select Filter Drawer with focus management and scroll lock.
 */
export function openMenuDrawer(elements, triggerElement = null) {
  const drawer = elements.menuFilterDrawer || document.getElementById('menuFilterDrawer');
  if (!drawer) return false;

  pushOverlayTrigger(drawer, triggerElement);
  drawer.classList.add('active');
  drawer.setAttribute('aria-hidden', 'false');
  elements.menuDrawerBtn?.setAttribute('aria-expanded', 'true');
  void drawer.offsetWidth;
  lockBodyScroll();

  const panel = getDialogContainer(drawer);
  const body = drawer.querySelector('.drawer-body');
  if (body) body.scrollTop = 0;
  const target = elements.menuDrawerClose || getFocusableModalElements(drawer)[0] || panel;
  target?.focus({ preventScroll: true });
  return true;
}

/**
 * Closes the left Menu & Multi-Select Filter Drawer and restores scroll/focus.
 */
export function closeMenuDrawer(elements) {
  const drawer = elements.menuFilterDrawer || document.getElementById('menuFilterDrawer');
  if (drawer) {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
  }
  elements.menuDrawerBtn?.setAttribute('aria-expanded', 'false');
  unlockBodyScrollIfNoneOpen();
  popOverlayTriggerAndRestoreFocus(drawer);
}
