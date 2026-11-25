import { filterAndSortProducts, loadProducts, selectHeroShowcaseProducts } from './catalog.js';
import {
  closeCustomCakeModal,
  closeLightbox,
  openCustomCakeModal,
  openLightbox,
  renderHeroShowcase,
  renderProductGrid,
  showCatalogLoadError,
  trapModalFocus,
  updateHeroSpotlight
} from './render.js';
import {
  copyCustomOrderDetails,
  copyProductDetails,
  formatCustomCakeBrief,
  handleCustomOrderInquiry,
  handleInquiry
} from './actions.js';

const state = {
  products: [],
  filteredProducts: [],
  heroShowcase: [],
  heroSpotlightIndex: 0,
  lightboxProducts: [],
  lightboxIndex: -1,
  isCatalogLoaded: false,
  activeCategory: 'all',
  activeFlavour: 'all',
  searchQuery: '',
  activeSort: 'featured',
  customCake: {
    style: 'Birthday',
    flavor: 'Chocolate',
    size: '1 Pound',
    notes: ''
  }
};

function getElements() {
  return {
    productGrid: document.getElementById('productGrid'),
    itemCount: document.getElementById('itemCount'),
    drawerItemCount: document.getElementById('drawerItemCount'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    filterToggleBtn: document.getElementById('filterToggleBtn'),
    galleryFilterTriggerBtn: document.getElementById('galleryFilterTriggerBtn'),
    searchFilterContainer: document.getElementById('searchFilterContainer'),
    categoryPills: document.querySelectorAll('.category-btn'),
    flavourPills: document.querySelectorAll('.flavour-btn'),
    sortSelect: document.getElementById('sortSelect'),
    emptyState: document.getElementById('emptyState'),

    heroShowcaseStage: document.getElementById('heroShowcaseStage'),
    heroBadgePrice: document.getElementById('heroBadgePrice'),
    heroBadgeCategory: document.getElementById('heroBadgeCategory'),
    heroSpotlightTitle: document.getElementById('heroSpotlightTitle'),
    heroSpotlightMeta: document.getElementById('heroSpotlightMeta'),
    heroInspectBtn: document.getElementById('heroInspectBtn'),
    shuffleShowcaseBtn: document.getElementById('shuffleShowcaseBtn'),

    buildCustomCakeBtn: document.getElementById('buildCustomCakeBtn'),
    customCakeModal: document.getElementById('customCakeModal'),
    customCakeBackdrop: document.getElementById('customCakeBackdrop'),
    customCakeClose: document.getElementById('customCakeClose'),
    customStylePills: document.querySelectorAll('.custom-style-btn'),
    customFlavorPills: document.querySelectorAll('.custom-flavor-btn'),
    customSizePills: document.querySelectorAll('.custom-size-btn'),
    customCakeNotes: document.getElementById('customCakeNotes'),
    customCakePreview: document.getElementById('customCakePreview'),
    customCakeSendBtn: document.getElementById('customCakeSendBtn'),
    customCakeCopyBtn: document.getElementById('customCakeCopyBtn'),

    lightbox: document.getElementById('lightboxModal'),
    lightboxBackdrop: document.getElementById('lightboxBackdrop'),
    lightboxClose: document.getElementById('lightboxClose'),
    lightboxImg: document.getElementById('lightboxImg'),
    lightboxTitle: document.getElementById('lightboxTitle'),
    lightboxPrice: document.getElementById('lightboxPrice'),
    lightboxCategory: document.getElementById('lightboxCategory'),
    lightboxFlavour: document.getElementById('lightboxFlavour'),
    lightboxSize: document.getElementById('lightboxSize'),
    lightboxDetails: document.getElementById('lightboxDetails'),
    lightboxPrev: document.getElementById('lightboxPrev'),
    lightboxNext: document.getElementById('lightboxNext'),
    lightboxInquireBtn: document.getElementById('lightboxInquireBtn'),
    lightboxCopyBtn: document.getElementById('lightboxCopyBtn'),
    lightboxThumbnailsContainer: document.getElementById('lightboxThumbnailsContainer'),
    lightboxThumbnails: document.getElementById('lightboxThumbnails'),

    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    toastProgressBar: document.getElementById('toastProgressBar'),
    backToTopBtn: document.getElementById('backToTopBtn')
  };
}

function updateView(elements) {
  if (!state.isCatalogLoaded) return;
  state.filteredProducts = filterAndSortProducts(state.products, state);
  renderProductGrid(elements, state.filteredProducts);
}

function showLightboxAt(elements, index, triggerElement = null, sourceList = state.filteredProducts) {
  state.lightboxProducts = sourceList;
  if (openLightbox(elements, sourceList, index, triggerElement)) {
    state.lightboxIndex = index;
  }
}

function openProductInLightbox(elements, product, triggerElement = null) {
  if (!product) return;
  const filteredIndex = state.filteredProducts.findIndex(p => p.id === product.id);
  if (filteredIndex !== -1) {
    showLightboxAt(elements, filteredIndex, triggerElement, state.filteredProducts);
    return;
  }
  const showcaseIndex = state.heroShowcase.findIndex(p => p.id === product.id);
  if (showcaseIndex !== -1) {
    showLightboxAt(elements, showcaseIndex, triggerElement, state.heroShowcase);
  }
}

function hideLightbox(elements) {
  closeLightbox(elements);
  state.lightboxIndex = -1;
}

function setSearchDrawerOpen(elements, shouldOpen) {
  if (!elements.searchFilterContainer || !elements.filterToggleBtn) return;
  elements.searchFilterContainer.classList.toggle('open', shouldOpen);
  elements.filterToggleBtn.setAttribute('aria-expanded', String(shouldOpen));
  elements.filterToggleBtn.classList.toggle('bg-caramel-100', shouldOpen);
  elements.filterToggleBtn.classList.toggle('border-caramel-400', shouldOpen);
  if (shouldOpen) elements.searchInput?.focus();
}

function updateCustomCakePreview(elements) {
  if (elements.customCakePreview) {
    elements.customCakePreview.textContent = formatCustomCakeBrief(state.customCake);
  }
}

function bindOptionPills(pills, stateKey, elements) {
  pills?.forEach(btn => {
    btn.addEventListener('click', () => {
      pills.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      state.customCake[stateKey] = btn.getAttribute('data-value') || state.customCake[stateKey];
      updateCustomCakePreview(elements);
    });
  });
}

function resetAllFilters(elements) {
  if (elements.searchInput) elements.searchInput.value = '';
  state.searchQuery = '';
  elements.clearSearchBtn?.classList.add('hidden');

  state.activeCategory = 'all';
  state.activeFlavour = 'all';
  elements.categoryPills?.forEach(b =>
    b.classList.toggle('active', b.getAttribute('data-category') === 'all')
  );
  elements.flavourPills?.forEach(b =>
    b.classList.toggle('active', b.getAttribute('data-flavour') === 'all')
  );

  updateView(elements);
  elements.searchInput?.focus();
}

function initEventListeners(elements) {
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', e => {
      state.searchQuery = e.target.value.trim();
      elements.clearSearchBtn?.classList.toggle('hidden', state.searchQuery.length === 0);
      updateView(elements);
    });
  }

  elements.clearSearchBtn?.addEventListener('click', () => resetAllFilters(elements));
  elements.resetFiltersBtn?.addEventListener('click', () => resetAllFilters(elements));

  if (elements.filterToggleBtn && elements.searchFilterContainer) {
    elements.filterToggleBtn.addEventListener('click', () => {
      const isExpanded = elements.searchFilterContainer.classList.contains('open');
      setSearchDrawerOpen(elements, !isExpanded);
    });
  }

  elements.galleryFilterTriggerBtn?.addEventListener('click', () => {
    setSearchDrawerOpen(elements, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if (elements.heroShowcaseStage) {
    const activateSpotlight = target => {
      const card = target.closest('.collage-photo-card');
      if (!card) return;
      const idx = parseInt(card.getAttribute('data-hero-index'), 10);
      if (!Number.isNaN(idx) && state.heroShowcase[idx]) {
        state.heroSpotlightIndex = idx;
        updateHeroSpotlight(elements, state.heroShowcase[idx], idx);
      }
    };

    elements.heroShowcaseStage.addEventListener('mouseover', e => activateSpotlight(e.target));
    elements.heroShowcaseStage.addEventListener('focusin', e => activateSpotlight(e.target));
    elements.heroShowcaseStage.addEventListener('click', e => {
      const card = e.target.closest('.collage-photo-card');
      if (!card) return;
      const idx = parseInt(card.getAttribute('data-hero-index'), 10);
      if (!Number.isNaN(idx) && state.heroShowcase[idx]) {
        openProductInLightbox(elements, state.heroShowcase[idx], card);
      }
    });
  }

  elements.heroInspectBtn?.addEventListener('click', () => {
    const product = state.heroShowcase[state.heroSpotlightIndex] || state.heroShowcase[0];
    openProductInLightbox(elements, product, elements.heroInspectBtn);
  });

  elements.shuffleShowcaseBtn?.addEventListener('click', () => {
    if (!state.isCatalogLoaded) return;
    state.heroShowcase = selectHeroShowcaseProducts(state.products, 3, true);
    state.heroSpotlightIndex = 0;
    renderHeroShowcase(elements, state.heroShowcase);
  });

  elements.buildCustomCakeBtn?.addEventListener('click', () => {
    updateCustomCakePreview(elements);
    openCustomCakeModal(elements, elements.buildCustomCakeBtn);
  });
  elements.customCakeClose?.addEventListener('click', () => closeCustomCakeModal(elements));
  elements.customCakeBackdrop?.addEventListener('click', () => closeCustomCakeModal(elements));

  bindOptionPills(elements.customStylePills, 'style', elements);
  bindOptionPills(elements.customFlavorPills, 'flavor', elements);
  bindOptionPills(elements.customSizePills, 'size', elements);

  elements.customCakeNotes?.addEventListener('input', e => {
    state.customCake.notes = e.target.value;
    updateCustomCakePreview(elements);
  });

  elements.customCakeSendBtn?.addEventListener('click', e => {
    handleCustomOrderInquiry(e, elements, state.customCake);
  });
  elements.customCakeCopyBtn?.addEventListener('click', e => {
    copyCustomOrderDetails(e, elements, state.customCake);
  });

  elements.categoryPills.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.categoryPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.getAttribute('data-category');
      updateView(elements);
    });
  });

  elements.flavourPills.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.flavourPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFlavour = btn.getAttribute('data-flavour') || 'all';
      updateView(elements);
    });
  });

  elements.sortSelect?.addEventListener('change', e => {
    state.activeSort = e.target.value;
    updateView(elements);
  });

  if (elements.productGrid) {
    const openFromCard = target => {
      const card = target.closest('.product-card');
      if (!card) return;
      const idx = parseInt(card.getAttribute('data-index'), 10);
      if (!Number.isNaN(idx)) {
        showLightboxAt(elements, idx, card, state.filteredProducts);
      }
    };

    elements.productGrid.addEventListener('click', e => openFromCard(e.target));
    elements.productGrid.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.product-card');
        if (card) {
          e.preventDefault();
          openFromCard(card);
        }
      }
    });
  }

  // Forward touch-drag on lightbox image area so mobile modal scrolling never leaks to page.
  const imageArea = document.querySelector('.lightbox-image-area') || elements.lightboxImg?.parentElement;
  if (imageArea) {
    let touchStartY = 0;
    imageArea.addEventListener(
      'touchstart',
      e => {
        if (e.touches && e.touches.length > 0) {
          touchStartY = e.touches[0].clientY;
        }
      },
      { passive: true }
    );

    imageArea.addEventListener(
      'touchmove',
      e => {
        if (!e.touches || e.touches.length === 0) return;
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        touchStartY = currentY;

        const dialog = elements.lightbox?.querySelector('.modal-dialog');
        const sidebar = elements.lightbox?.querySelector('.modal-sidebar-scroll');
        const scrollTarget = window.innerWidth < 768 ? dialog : sidebar;
        if (scrollTarget) scrollTarget.scrollTop += deltaY;

        if (e.cancelable) e.preventDefault();
      },
      { passive: false }
    );
  }

  const preventBackdropTouch = e => {
    if (e.cancelable) e.preventDefault();
  };
  elements.lightboxBackdrop?.addEventListener('touchmove', preventBackdropTouch, { passive: false });
  elements.customCakeBackdrop?.addEventListener('touchmove', preventBackdropTouch, { passive: false });

  elements.lightboxClose?.addEventListener('click', () => hideLightbox(elements));
  elements.lightboxBackdrop?.addEventListener('click', () => hideLightbox(elements));
  elements.lightboxPrev?.addEventListener('click', () => {
    if (state.lightboxIndex > 0) showLightboxAt(elements, state.lightboxIndex - 1, null, state.lightboxProducts);
  });
  elements.lightboxNext?.addEventListener('click', () => {
    if (state.lightboxIndex < state.lightboxProducts.length - 1) {
      showLightboxAt(elements, state.lightboxIndex + 1, null, state.lightboxProducts);
    }
  });

  elements.lightboxInquireBtn?.addEventListener('click', e => {
    handleInquiry(e, elements, state.lightboxProducts[state.lightboxIndex]);
  });
  elements.lightboxCopyBtn?.addEventListener('click', e => {
    copyProductDetails(e, elements, state.lightboxProducts[state.lightboxIndex]);
  });

  const header = document.getElementById('mainHeader') || document.querySelector('header');
  window.addEventListener(
    'scroll',
    () => {
      header?.classList.toggle('header-scrolled', window.scrollY > 20);

      if (elements.backToTopBtn) {
        const visible = window.scrollY > 350;
        elements.backToTopBtn.classList.toggle('opacity-100', visible);
        elements.backToTopBtn.classList.toggle('pointer-events-auto', visible);
        elements.backToTopBtn.classList.toggle('translate-y-0', visible);
        elements.backToTopBtn.classList.toggle('opacity-0', !visible);
        elements.backToTopBtn.classList.toggle('pointer-events-none', !visible);
        elements.backToTopBtn.classList.toggle('translate-y-3', !visible);
      }
    },
    { passive: true }
  );

  elements.backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('keydown', e => {
    if (elements.customCakeModal?.classList.contains('active')) {
      if (e.key === 'Tab') {
        trapModalFocus(elements.customCakeModal, e);
      } else if (e.key === 'Escape') {
        closeCustomCakeModal(elements);
      }
      return;
    }

    if (!elements.lightbox?.classList.contains('active')) return;
    if (e.key === 'Tab') {
      trapModalFocus(elements.lightbox, e);
    } else if (e.key === 'Escape') {
      hideLightbox(elements);
    } else if (e.key === 'ArrowRight' && state.lightboxIndex < state.lightboxProducts.length - 1) {
      showLightboxAt(elements, state.lightboxIndex + 1, null, state.lightboxProducts);
    } else if (e.key === 'ArrowLeft' && state.lightboxIndex > 0) {
      showLightboxAt(elements, state.lightboxIndex - 1, null, state.lightboxProducts);
    }
  });
}

async function bootstrap() {
  const elements = getElements();
  initEventListeners(elements);
  updateCustomCakePreview(elements);

  try {
    state.products = await loadProducts();
    state.isCatalogLoaded = true;
    state.heroShowcase = selectHeroShowcaseProducts(state.products, 3, false);
    state.heroSpotlightIndex = 0;
    renderHeroShowcase(elements, state.heroShowcase);
    updateView(elements);
  } catch (error) {
    console.error('Failed to load products catalog:', error);
    showCatalogLoadError(elements);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
