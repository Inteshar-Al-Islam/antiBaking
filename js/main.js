import { filterAndSortProducts, loadProducts } from './catalog.js';
import {
  closeLightbox,
  openLightbox,
  renderProductGrid,
  showCatalogLoadError,
  trapLightboxFocus
} from './render.js';
import { copyProductDetails, handleInquiry } from './actions.js';

const state = {
  products: [],
  filteredProducts: [],
  lightboxIndex: -1,
  isCatalogLoaded: false,
  activeCategory: 'all',
  activeFlavour: 'all',
  searchQuery: '',
  activeSort: 'featured'
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
    searchFilterContainer: document.getElementById('searchFilterContainer'),
    categoryPills: document.querySelectorAll('.category-btn'),
    flavourPills: document.querySelectorAll('.flavour-btn'),
    sortSelect: document.getElementById('sortSelect'),
    emptyState: document.getElementById('emptyState'),

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

function showLightboxAt(elements, index, triggerElement = null) {
  if (openLightbox(elements, state.filteredProducts, index, triggerElement)) {
    state.lightboxIndex = index;
  }
}

function hideLightbox(elements) {
  closeLightbox(elements);
  state.lightboxIndex = -1;
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
      elements.searchFilterContainer.classList.toggle('open', !isExpanded);
      elements.filterToggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      elements.filterToggleBtn.classList.toggle('bg-caramel-100', !isExpanded);
      elements.filterToggleBtn.classList.toggle('border-caramel-400', !isExpanded);
      if (!isExpanded) elements.searchInput?.focus();
    });
  }

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
        showLightboxAt(elements, idx, card);
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

        const dialog = document.querySelector('.modal-dialog');
        const sidebar = document.querySelector('.modal-sidebar-scroll');
        const scrollTarget = window.innerWidth < 768 ? dialog : sidebar;
        if (scrollTarget) scrollTarget.scrollTop += deltaY;

        if (e.cancelable) e.preventDefault();
      },
      { passive: false }
    );
  }

  elements.lightboxBackdrop?.addEventListener(
    'touchmove',
    e => {
      if (e.cancelable) e.preventDefault();
    },
    { passive: false }
  );

  elements.lightboxClose?.addEventListener('click', () => hideLightbox(elements));
  elements.lightboxBackdrop?.addEventListener('click', () => hideLightbox(elements));
  elements.lightboxPrev?.addEventListener('click', () => {
    if (state.lightboxIndex > 0) showLightboxAt(elements, state.lightboxIndex - 1);
  });
  elements.lightboxNext?.addEventListener('click', () => {
    if (state.lightboxIndex < state.filteredProducts.length - 1) {
      showLightboxAt(elements, state.lightboxIndex + 1);
    }
  });

  elements.lightboxInquireBtn?.addEventListener('click', e => {
    handleInquiry(e, elements, state.filteredProducts[state.lightboxIndex]);
  });
  elements.lightboxCopyBtn?.addEventListener('click', e => {
    copyProductDetails(e, elements, state.filteredProducts[state.lightboxIndex]);
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
    if (!elements.lightbox?.classList.contains('active')) return;
    if (e.key === 'Tab') {
      trapLightboxFocus(elements, e);
    } else if (e.key === 'Escape') {
      hideLightbox(elements);
    } else if (e.key === 'ArrowRight' && state.lightboxIndex < state.filteredProducts.length - 1) {
      showLightboxAt(elements, state.lightboxIndex + 1);
    } else if (e.key === 'ArrowLeft' && state.lightboxIndex > 0) {
      showLightboxAt(elements, state.lightboxIndex - 1);
    }
  });
}

async function bootstrap() {
  const elements = getElements();
  initEventListeners(elements);

  try {
    state.products = await loadProducts();
    state.isCatalogLoaded = true;
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
