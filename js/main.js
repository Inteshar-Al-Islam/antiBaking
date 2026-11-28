import { CATEGORY_META } from './config.js';
import { filterAndSortProducts, loadProducts, selectHeroShowcaseProducts } from './catalog.js';
import {
  getSavedProducts,
  loadSavedIds,
  pruneSavedIds,
  saveSavedIds,
  toggleSavedId
} from './favorites.js';
import {
  closeCustomCakeModal,
  closeLightbox,
  closeMenuDrawer,
  closeSavedDrawer,
  createLightboxHistoryController,
  openCustomCakeModal,
  openLightbox,
  openMenuDrawer,
  openSavedDrawer,
  renderActiveFilterChips,
  renderCustomCakePreview,
  renderHeroShowcase,
  renderProductGrid,
  renderSavedDrawer,
  showCatalogLoadError,
  syncCardFavoriteButtons,
  syncLightboxFavoriteButton,
  trapModalFocus,
  updateHeroSpotlight,
  updateSavedFloatingPill
} from './render.js';
import {
  copyCustomOrderDetails,
  copyProductDetails,
  copySavedCakesList,
  handleCustomOrderInquiry,
  handleInquiry,
  handleSavedCakesInquiry,
  showToast,
  triggerSparkleBurst
} from './actions.js';

const state = {
  products: [],
  filteredProducts: [],
  savedIds: [],
  heroShowcase: [],
  heroSpotlightIndex: 0,
  lightboxProducts: [],
  lightboxIndex: -1,
  isCatalogLoaded: false,
  activeCategories: [],
  activeFlavours: [],
  activePriceRanges: [],
  activeSizes: [],
  featuredOnly: false,
  searchQuery: '',
  activeSort: 'featured',
  customCake: {
    style: 'Birthday',
    flavor: 'Chocolate',
    size: '1 Pound',
    notes: ''
  }
};

const lightboxHistory = createLightboxHistoryController();

function getElements() {
  return {
    productGrid: document.getElementById('productGrid'),
    itemCount: document.getElementById('itemCount'),
    drawerItemCount: document.getElementById('drawerItemCount'),
    menuDrawerItemCount: document.getElementById('menuDrawerItemCount'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    menuSearchInput: document.getElementById('menuSearchInput'),
    menuClearSearchBtn: document.getElementById('menuClearSearchBtn'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    filterToggleBtn: document.getElementById('filterToggleBtn'),
    galleryFilterTriggerBtn: document.getElementById('galleryFilterTriggerBtn'),
    collectionFilterTriggerBtn: document.getElementById('collectionFilterTriggerBtn'),
    gallerySection: document.getElementById('gallerySection'),
    galleryHeading: document.getElementById('galleryHeading'),
    activeFilterChips: document.getElementById('activeFilterChips'),
    searchFilterContainer: document.getElementById('searchFilterContainer'),
    categoryPills: document.querySelectorAll('.category-btn'),
    footerCategoryLinks: document.querySelectorAll('.footer-category-link'),
    flavourPills: document.querySelectorAll('.flavour-btn'),
    pricePills: document.querySelectorAll('.price-btn'),
    sortSelect: document.getElementById('sortSelect'),
    menuSortSelect: document.getElementById('menuSortSelect'),
    emptyState: document.getElementById('emptyState'),

    menuDrawerBtn: document.getElementById('menuDrawerBtn'),
    menuFilterActiveBadge: document.getElementById('menuFilterActiveBadge'),
    menuFilterDrawer: document.getElementById('menuFilterDrawer'),
    menuDrawerBackdrop: document.getElementById('menuDrawerBackdrop'),
    menuDrawerClose: document.getElementById('menuDrawerClose'),
    menuDrawerResetBtn: document.getElementById('menuDrawerResetBtn'),
    menuFooterResetBtn: document.getElementById('menuFooterResetBtn'),
    menuApplyCloseBtn: document.getElementById('menuApplyCloseBtn'),
    menuCategoryCheckboxes: document.querySelectorAll('.menu-category-checkbox'),
    menuFlavourCheckboxes: document.querySelectorAll('.menu-flavour-checkbox'),
    menuPriceCheckboxes: document.querySelectorAll('.menu-price-checkbox'),
    menuSizeCheckboxes: document.querySelectorAll('.menu-size-checkbox'),
    menuFeaturedCheckbox: document.getElementById('menuFeaturedCheckbox'),
    menuCategoryCountBadge: document.getElementById('menuCategoryCountBadge'),
    menuFlavourCountBadge: document.getElementById('menuFlavourCountBadge'),
    menuPriceCountBadge: document.getElementById('menuPriceCountBadge'),
    menuExtrasCountBadge: document.getElementById('menuExtrasCountBadge'),
    menuClearGroupBtns: document.querySelectorAll('[data-clear-group]'),

    heroShowcaseStage: document.getElementById('heroShowcaseStage'),
    heroBadgePrice: document.getElementById('heroBadgePrice'),
    heroBadgeCategory: document.getElementById('heroBadgeCategory'),
    heroSpotlightTitle: document.getElementById('heroSpotlightTitle'),
    heroSpotlightMeta: document.getElementById('heroSpotlightMeta'),
    heroInspectBtn: document.getElementById('heroInspectBtn'),
    shuffleShowcaseBtn: document.getElementById('shuffleShowcaseBtn'),

    buildCustomCakeBtn: document.getElementById('buildCustomCakeBtn'),
    sectionCustomCakeBtn: document.getElementById('sectionCustomCakeBtn'),
    footerCustomCakeBtn: document.getElementById('footerCustomCakeBtn'),
    customCakeModal: document.getElementById('customCakeModal'),
    customCakeBackdrop: document.getElementById('customCakeBackdrop'),
    customCakeClose: document.getElementById('customCakeClose'),
    customStylePills: document.querySelectorAll('.custom-style-btn'),
    customFlavorPills: document.querySelectorAll('.custom-flavor-btn'),
    customSizePills: document.querySelectorAll('.custom-size-btn'),
    customCakeNotes: document.getElementById('customCakeNotes'),
    customCakeSummaryCard: document.getElementById('customCakeSummaryCard'),
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
    lightboxSaveBtn: document.getElementById('lightboxSaveBtn'),
    lightboxSaveHeartIcon: document.getElementById('lightboxSaveHeartIcon'),
    lightboxSaveBtnText: document.getElementById('lightboxSaveBtnText'),
    lightboxCopyBtn: document.getElementById('lightboxCopyBtn'),
    lightboxThumbnailsContainer: document.getElementById('lightboxThumbnailsContainer'),
    lightboxThumbnails: document.getElementById('lightboxThumbnails'),

    savedFloatingBtn: document.getElementById('savedFloatingBtn'),
    savedFloatingLabel: document.getElementById('savedFloatingLabel'),
    savedDrawer: document.getElementById('savedDrawer'),
    savedDrawerBackdrop: document.getElementById('savedDrawerBackdrop'),
    savedDrawerClose: document.getElementById('savedDrawerClose'),
    savedDrawerCountBadge: document.getElementById('savedDrawerCountBadge'),
    savedClearAllBtn: document.getElementById('savedClearAllBtn'),
    savedComparisonSummary: document.getElementById('savedComparisonSummary'),
    savedComparisonList: document.getElementById('savedComparisonList'),
    savedEmptyState: document.getElementById('savedEmptyState'),
    savedBrowseBtn: document.getElementById('savedBrowseBtn'),
    savedDrawerFooter: document.getElementById('savedDrawerFooter'),
    savedMessagePreview: document.getElementById('savedMessagePreview'),
    savedSendMessengerBtn: document.getElementById('savedSendMessengerBtn'),
    savedSendMessengerLabel: document.getElementById('savedSendMessengerLabel'),
    savedCopyListBtn: document.getElementById('savedCopyListBtn'),

    faqAccordion: document.getElementById('faqAccordion'),

    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    toastProgressBar: document.getElementById('toastProgressBar'),
    backToTopBtn: document.getElementById('backToTopBtn'),
    goToBottomBtn: document.getElementById('goToBottomBtn')
  };
}

function setFloatingButtonVisible(button, visible) {
  if (!button) return;
  button.classList.toggle('opacity-100', visible);
  button.classList.toggle('pointer-events-auto', visible);
  button.classList.toggle('translate-y-0', visible);
  button.classList.toggle('opacity-0', !visible);
  button.classList.toggle('pointer-events-none', !visible);
  button.classList.toggle('translate-y-3', !visible);
}

function updateScrollButtons(elements) {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const scrolledEnough = scrollY > 350;
  const nearBottom = maxScrollY - scrollY <= 160;

  const showTop = scrolledEnough;
  const showBottom = scrolledEnough && !nearBottom;

  setFloatingButtonVisible(elements.backToTopBtn, showTop);
  setFloatingButtonVisible(elements.goToBottomBtn, showBottom);

  if (elements.backToTopBtn) {
    elements.backToTopBtn.classList.toggle('bottom-[4.875rem]', showBottom);
    elements.backToTopBtn.classList.toggle('bottom-6', !showBottom);
  }
}

function formatGalleryHeading(activeCategories) {
  if (!Array.isArray(activeCategories) || activeCategories.length === 0) {
    return 'All Cakes & Treats';
  }
  if (activeCategories.length === 1) {
    return CATEGORY_META[activeCategories[0]]?.label || 'All Cakes & Treats';
  }
  if (activeCategories.length === 2) {
    const first = CATEGORY_META[activeCategories[0]]?.label || activeCategories[0];
    const second = CATEGORY_META[activeCategories[1]]?.label || activeCategories[1];
    return `${first} & ${second}`;
  }
  return `${activeCategories.length} Selected Categories`;
}

function updateGroupBadge(badgeEl, clearBtn, count) {
  if (badgeEl) {
    badgeEl.textContent = count > 0 ? `${count} selected` : 'All';
    badgeEl.classList.toggle('bg-caramel-100', count > 0);
    badgeEl.classList.toggle('text-mocha-900', count > 0);
    badgeEl.classList.toggle('border-caramel-300', count > 0);
    badgeEl.classList.toggle('bg-cream-100', count === 0);
    badgeEl.classList.toggle('text-warm-600', count === 0);
    badgeEl.classList.toggle('border-[#E5DCD3]', count === 0);
  }
  clearBtn?.classList.toggle('hidden', count === 0);
}

function syncMenuFilterSummary(elements, filteredCount = state.filteredProducts.length) {
  const catCount = state.activeCategories.length;
  const flavCount = state.activeFlavours.length;
  const priceCount = state.activePriceRanges.length;
  const extrasCount = state.activeSizes.length + (state.featuredOnly ? 1 : 0);
  const totalCount =
    catCount + flavCount + priceCount + extrasCount + (state.searchQuery ? 1 : 0);

  const findClearBtn = group =>
    Array.from(elements.menuClearGroupBtns || []).find(
      btn => btn.getAttribute('data-clear-group') === group
    );

  updateGroupBadge(elements.menuCategoryCountBadge, findClearBtn('category'), catCount);
  updateGroupBadge(elements.menuFlavourCountBadge, findClearBtn('flavour'), flavCount);
  updateGroupBadge(elements.menuPriceCountBadge, findClearBtn('price'), priceCount);
  updateGroupBadge(elements.menuExtrasCountBadge, findClearBtn('extras'), extrasCount);

  if (elements.menuFilterActiveBadge) {
    elements.menuFilterActiveBadge.textContent = String(totalCount);
    elements.menuFilterActiveBadge.classList.toggle('hidden', totalCount === 0);
    elements.menuFilterActiveBadge.classList.toggle('inline-flex', totalCount > 0);
  }

  elements.menuDrawerResetBtn?.classList.toggle('hidden', totalCount === 0);
  elements.menuFooterResetBtn?.classList.toggle('hidden', totalCount === 0);

  const applyLabel = elements.menuApplyCloseBtn?.querySelector('span');
  if (applyLabel) {
    applyLabel.textContent =
      filteredCount === 0
        ? 'No Matching Cakes'
        : `View ${filteredCount} ${filteredCount === 1 ? 'Creation' : 'Creations'}`;
  }
}

function updateView(elements) {
  if (!state.isCatalogLoaded) return;
  if (elements.galleryHeading) {
    elements.galleryHeading.textContent = formatGalleryHeading(state.activeCategories);
  }
  state.filteredProducts = filterAndSortProducts(state.products, state);
  renderProductGrid(elements, state.filteredProducts, state.savedIds);
  renderActiveFilterChips(elements, state);
  syncMenuFilterSummary(elements, state.filteredProducts.length);
  updateScrollButtons(elements);
}

function syncWishlistUi(
  elements,
  { targetProductId = null, animateCard = false, animatePill = false, animateLightbox = false } = {}
) {
  syncCardFavoriteButtons(elements, state.savedIds, targetProductId, animateCard);

  const activeLightboxProduct =
    state.lightboxIndex >= 0 ? state.lightboxProducts[state.lightboxIndex] : null;
  if (activeLightboxProduct) {
    syncLightboxFavoriteButton(elements, activeLightboxProduct, state.savedIds, animateLightbox);
  }

  updateSavedFloatingPill(elements, state.savedIds.length, animatePill);

  if (elements.savedDrawer?.classList.contains('active')) {
    renderSavedDrawer(elements, getSavedProducts(state.savedIds, state.products));
  }
}

function toggleProductFavorite(elements, productId, event = null) {
  if (!productId || !state.isCatalogLoaded) return;
  const { savedIds, isSaved } = toggleSavedId(state.savedIds, productId);
  state.savedIds = savedIds;
  saveSavedIds(state.savedIds);

  const product = state.products.find(p => p.id === productId);
  syncWishlistUi(elements, {
    targetProductId: productId,
    animateCard: true,
    animatePill: true,
    animateLightbox: true
  });

  if (isSaved && event?.clientX) {
    triggerSparkleBurst(event.clientX, event.clientY);
  }

  if (product) {
    showToast(
      elements,
      isSaved
        ? `Saved "${product.name}" (${state.savedIds.length})`
        : `Removed "${product.name}"`
    );
  }
}

function clearAllFavorites(elements) {
  if (state.savedIds.length === 0) return;
  state.savedIds = [];
  saveSavedIds(state.savedIds);
  syncWishlistUi(elements);
  showToast(elements, 'Cleared all saved cakes');
}

function showLightboxAt(elements, index, triggerElement = null, sourceList = state.filteredProducts) {
  state.lightboxProducts = sourceList;
  if (openLightbox(elements, sourceList, index, triggerElement, state.savedIds)) {
    state.lightboxIndex = index;
    lightboxHistory.onOpen();
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

function hideLightbox(elements, { fromPopState = false } = {}) {
  closeLightbox(elements);
  state.lightboxIndex = -1;
  lightboxHistory.onClose({ fromPopState });
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
  renderCustomCakePreview(elements, state.customCake);
}

function setOptionPillsValue(pills, stateKey, value, elements) {
  if (!value) return;
  state.customCake[stateKey] = value;
  pills?.forEach(btn => {
    const isActive = btn.getAttribute('data-value') === value;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
  updateCustomCakePreview(elements);
}

function bindOptionPills(pills, stateKey, elements) {
  pills?.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextVal = btn.getAttribute('data-value') || state.customCake[stateKey];
      setOptionPillsValue(pills, stateKey, nextVal, elements);
    });
  });
}

function toggleArraySelection(list, value, shouldInclude) {
  if (!value || value === 'all') return [];
  const next = list.filter(item => item !== value);
  if (shouldInclude) next.push(value);
  return next;
}

function syncCheckboxGroup(checkboxes, selectedValues) {
  checkboxes?.forEach(cb => {
    cb.checked = selectedValues.includes(cb.value);
  });
}

function syncPillGroup(pills, attrName, selectedValues) {
  pills?.forEach(btn => {
    const val = btn.getAttribute(attrName);
    const isActive = val === 'all' ? selectedValues.length === 0 : selectedValues.includes(val);
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

function setActiveCategories(elements, categories) {
  const nextCategories = Array.isArray(categories)
    ? [...new Set(categories.filter(c => c && c !== 'all'))]
    : categories && categories !== 'all'
      ? [categories]
      : [];
  state.activeCategories = nextCategories;

  syncPillGroup(elements.categoryPills, 'data-category', nextCategories);
  syncCheckboxGroup(elements.menuCategoryCheckboxes, nextCategories);

  elements.footerCategoryLinks?.forEach(link => {
    const cat = link.getAttribute('data-category');
    const isActive =
      cat === 'all' ? nextCategories.length === 0 : nextCategories.includes(cat);
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function setActiveFlavours(elements, flavours) {
  const nextFlavours = Array.isArray(flavours)
    ? [...new Set(flavours.filter(f => f && f !== 'all'))]
    : flavours && flavours !== 'all'
      ? [flavours]
      : [];
  state.activeFlavours = nextFlavours;

  syncPillGroup(elements.flavourPills, 'data-flavour', nextFlavours);
  syncCheckboxGroup(elements.menuFlavourCheckboxes, nextFlavours);
}

function setActivePriceRanges(elements, priceRanges) {
  const nextRanges = Array.isArray(priceRanges)
    ? [...new Set(priceRanges.filter(r => r && r !== 'all'))]
    : priceRanges && priceRanges !== 'all'
      ? [priceRanges]
      : [];
  state.activePriceRanges = nextRanges;

  syncPillGroup(elements.pricePills, 'data-price-range', nextRanges);
  syncCheckboxGroup(elements.menuPriceCheckboxes, nextRanges);
}

function setActiveSizes(elements, sizes) {
  const nextSizes = Array.isArray(sizes)
    ? [...new Set(sizes.filter(Boolean))]
    : sizes
      ? [sizes]
      : [];
  state.activeSizes = nextSizes;
  syncCheckboxGroup(elements.menuSizeCheckboxes, nextSizes);
}

function setFeaturedOnly(elements, featuredOnly) {
  state.featuredOnly = Boolean(featuredOnly);
  if (elements.menuFeaturedCheckbox) {
    elements.menuFeaturedCheckbox.checked = state.featuredOnly;
  }
}

function setSearchQuery(elements, rawQuery, syncSource = null) {
  const value = typeof rawQuery === 'string' ? rawQuery : '';
  state.searchQuery = value.trim();
  const hasText = state.searchQuery.length > 0;

  if (syncSource !== elements.searchInput && elements.searchInput) {
    elements.searchInput.value = value;
  }
  if (syncSource !== elements.menuSearchInput && elements.menuSearchInput) {
    elements.menuSearchInput.value = value;
  }
  elements.clearSearchBtn?.classList.toggle('hidden', !hasText);
  elements.menuClearSearchBtn?.classList.toggle('hidden', !hasText);
}

function setActiveSort(elements, sortValue) {
  const nextSort = sortValue || 'featured';
  state.activeSort = nextSort;
  if (elements.sortSelect && elements.sortSelect.value !== nextSort) {
    elements.sortSelect.value = nextSort;
  }
  if (elements.menuSortSelect && elements.menuSortSelect.value !== nextSort) {
    elements.menuSortSelect.value = nextSort;
  }
}

function clearSearchInput(elements) {
  setSearchQuery(elements, '');
}

function populateCategoryCounts(elements, products) {
  const counts = { all: products.length };
  products.forEach(product => {
    counts[product.category] = (counts[product.category] || 0) + 1;
  });
  elements.footerCategoryLinks?.forEach(link => {
    const category = link.getAttribute('data-category');
    const countEl = link.querySelector('[data-category-count]');
    if (countEl && category && Object.prototype.hasOwnProperty.call(counts, category)) {
      countEl.textContent = String(counts[category]);
    }
  });
  document.querySelectorAll('[data-menu-cat-count]').forEach(countEl => {
    const category = countEl.getAttribute('data-menu-cat-count');
    if (category && Object.prototype.hasOwnProperty.call(counts, category)) {
      countEl.textContent = `(${counts[category]})`;
    }
  });
}

function openCustomCakeBuilder(elements, triggerElement) {
  updateCustomCakePreview(elements);
  openCustomCakeModal(elements, triggerElement);
}

function resetAllFilters(elements) {
  clearSearchInput(elements);
  setActiveCategories(elements, []);
  setActiveFlavours(elements, []);
  setActivePriceRanges(elements, []);
  setActiveSizes(elements, []);
  setFeaturedOnly(elements, false);

  updateView(elements);
  if (elements.menuFilterDrawer?.classList.contains('active')) {
    elements.menuSearchInput?.focus();
  } else if (elements.searchFilterContainer?.classList.contains('open')) {
    elements.searchInput?.focus();
  }
}

function initEventListeners(elements) {
  const getScrollBehavior = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';

  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', e => {
      setSearchQuery(elements, e.target.value, elements.searchInput);
      updateView(elements);
    });
  }

  if (elements.menuSearchInput) {
    elements.menuSearchInput.addEventListener('input', e => {
      setSearchQuery(elements, e.target.value, elements.menuSearchInput);
      updateView(elements);
    });
  }

  elements.clearSearchBtn?.addEventListener('click', () => {
    clearSearchInput(elements);
    updateView(elements);
    elements.searchInput?.focus();
  });

  elements.menuClearSearchBtn?.addEventListener('click', () => {
    clearSearchInput(elements);
    updateView(elements);
    elements.menuSearchInput?.focus();
  });

  elements.resetFiltersBtn?.addEventListener('click', () => resetAllFilters(elements));
  elements.menuDrawerResetBtn?.addEventListener('click', () => resetAllFilters(elements));
  elements.menuFooterResetBtn?.addEventListener('click', () => resetAllFilters(elements));

  elements.menuDrawerBtn?.addEventListener('click', () => {
    openMenuDrawer(elements, elements.menuDrawerBtn);
  });
  elements.menuDrawerClose?.addEventListener('click', () => closeMenuDrawer(elements));
  elements.menuDrawerBackdrop?.addEventListener('click', () => closeMenuDrawer(elements));
  elements.menuApplyCloseBtn?.addEventListener('click', () => {
    closeMenuDrawer(elements);
    elements.gallerySection?.scrollIntoView({
      behavior: getScrollBehavior(),
      block: 'start'
    });
  });

  elements.menuCategoryCheckboxes?.forEach(cb => {
    cb.addEventListener('change', () => {
      const next = toggleArraySelection(state.activeCategories, cb.value, cb.checked);
      setActiveCategories(elements, next);
      updateView(elements);
    });
  });

  elements.menuFlavourCheckboxes?.forEach(cb => {
    cb.addEventListener('change', () => {
      const next = toggleArraySelection(state.activeFlavours, cb.value, cb.checked);
      setActiveFlavours(elements, next);
      updateView(elements);
    });
  });

  elements.menuPriceCheckboxes?.forEach(cb => {
    cb.addEventListener('change', () => {
      const next = toggleArraySelection(state.activePriceRanges, cb.value, cb.checked);
      setActivePriceRanges(elements, next);
      updateView(elements);
    });
  });

  elements.menuSizeCheckboxes?.forEach(cb => {
    cb.addEventListener('change', () => {
      const next = toggleArraySelection(state.activeSizes, cb.value, cb.checked);
      setActiveSizes(elements, next);
      updateView(elements);
    });
  });

  elements.menuFeaturedCheckbox?.addEventListener('change', e => {
    setFeaturedOnly(elements, e.target.checked);
    updateView(elements);
  });

  elements.menuClearGroupBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-clear-group');
      if (group === 'category') {
        setActiveCategories(elements, []);
      } else if (group === 'flavour') {
        setActiveFlavours(elements, []);
      } else if (group === 'price') {
        setActivePriceRanges(elements, []);
      } else if (group === 'extras') {
        setActiveSizes(elements, []);
        setFeaturedOnly(elements, false);
      }
      updateView(elements);
    });
  });

  elements.activeFilterChips?.addEventListener('click', e => {
    const clearAll = e.target.closest('[data-clear-all-filters]');
    if (clearAll) {
      resetAllFilters(elements);
      return;
    }
    const chip = e.target.closest('[data-remove-filter-type]');
    if (!chip) return;
    const type = chip.getAttribute('data-remove-filter-type');
    const val = chip.getAttribute('data-remove-filter-value');
    if (type === 'category') {
      setActiveCategories(elements, state.activeCategories.filter(c => c !== val));
    } else if (type === 'flavour') {
      setActiveFlavours(elements, state.activeFlavours.filter(f => f !== val));
    } else if (type === 'price') {
      setActivePriceRanges(elements, state.activePriceRanges.filter(r => r !== val));
    } else if (type === 'size') {
      setActiveSizes(elements, state.activeSizes.filter(s => s !== val));
    } else if (type === 'featured') {
      setFeaturedOnly(elements, false);
    } else if (type === 'search') {
      clearSearchInput(elements);
    }
    updateView(elements);
  });

  if (elements.filterToggleBtn && elements.searchFilterContainer) {
    elements.filterToggleBtn.addEventListener('click', () => {
      const isExpanded = elements.searchFilterContainer.classList.contains('open');
      setSearchDrawerOpen(elements, !isExpanded);
    });
  }

  const openTopSearchDrawer = () => {
    setSearchDrawerOpen(elements, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  elements.galleryFilterTriggerBtn?.addEventListener('click', openTopSearchDrawer);
  elements.collectionFilterTriggerBtn?.addEventListener('click', openTopSearchDrawer);

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
    openCustomCakeBuilder(elements, elements.buildCustomCakeBtn);
  });
  elements.sectionCustomCakeBtn?.addEventListener('click', () => {
    openCustomCakeBuilder(elements, elements.sectionCustomCakeBtn);
  });
  elements.footerCustomCakeBtn?.addEventListener('click', () => {
    openCustomCakeBuilder(elements, elements.footerCustomCakeBtn);
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

  elements.customCakeSummaryCard?.addEventListener('click', e => {
    const sizeCard = e.target.closest('[data-compare-size]');
    if (!sizeCard) return;
    const nextSize = sizeCard.getAttribute('data-compare-size');
    if (nextSize) {
      setOptionPillsValue(elements.customSizePills, 'size', nextSize, elements);
    }
  });

  elements.customCakeSendBtn?.addEventListener('click', e => {
    handleCustomOrderInquiry(e, elements, state.customCake);
  });
  elements.customCakeCopyBtn?.addEventListener('click', e => {
    copyCustomOrderDetails(e, elements, state.customCake);
  });

  elements.categoryPills.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      setActiveCategories(elements, cat === 'all' ? [] : [cat]);
      updateView(elements);
    });
  });

  elements.footerCategoryLinks?.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      clearSearchInput(elements);
      setActiveFlavours(elements, []);
      setActivePriceRanges(elements, []);
      setActiveSizes(elements, []);
      setFeaturedOnly(elements, false);
      const cat = link.getAttribute('data-category');
      setActiveCategories(elements, cat === 'all' ? [] : [cat]);
      updateView(elements);

      elements.gallerySection?.scrollIntoView({
        behavior: getScrollBehavior(),
        block: 'start'
      });
    });
  });

  elements.flavourPills.forEach(btn => {
    btn.addEventListener('click', () => {
      const flav = btn.getAttribute('data-flavour');
      setActiveFlavours(elements, flav === 'all' ? [] : [flav]);
      updateView(elements);
    });
  });

  elements.pricePills?.forEach(btn => {
    btn.addEventListener('click', () => {
      const priceRange = btn.getAttribute('data-price-range');
      setActivePriceRanges(elements, priceRange === 'all' ? [] : [priceRange]);
      updateView(elements);
    });
  });

  elements.sortSelect?.addEventListener('change', e => {
    setActiveSort(elements, e.target.value);
    updateView(elements);
  });

  elements.menuSortSelect?.addEventListener('change', e => {
    setActiveSort(elements, e.target.value);
    updateView(elements);
  });

  if (elements.productGrid) {
    const openFromCard = target => {
      const card = target.closest('.product-card');
      if (!card) return;
      const idx = parseInt(card.getAttribute('data-index'), 10);
      if (!Number.isNaN(idx)) {
        showLightboxAt(elements, idx, card.querySelector('.card-open-btn') || card, state.filteredProducts);
      }
    };

    elements.productGrid.addEventListener('click', e => {
      const saveBtn = e.target.closest('.card-save-btn');
      if (saveBtn) {
        e.stopPropagation();
        toggleProductFavorite(elements, saveBtn.dataset.productId, e);
        return;
      }
      openFromCard(e.target);
    });
  }

  elements.savedFloatingBtn?.addEventListener('click', () => {
    if (!state.isCatalogLoaded) return;
    openSavedDrawer(
      elements,
      getSavedProducts(state.savedIds, state.products),
      elements.savedFloatingBtn
    );
  });

  elements.savedDrawerClose?.addEventListener('click', () => closeSavedDrawer(elements));
  elements.savedDrawerBackdrop?.addEventListener('click', () => closeSavedDrawer(elements));

  elements.savedClearAllBtn?.addEventListener('click', () => clearAllFavorites(elements));

  elements.savedBrowseBtn?.addEventListener('click', () => {
    closeSavedDrawer(elements);
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    elements.gallerySection?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  });

  elements.savedComparisonList?.addEventListener('click', e => {
    const removeBtn = e.target.closest('[data-remove-saved-id]');
    if (removeBtn) {
      e.stopPropagation();
      toggleProductFavorite(elements, removeBtn.getAttribute('data-remove-saved-id'));
      return;
    }

    const inspectBtn = e.target.closest('[data-inspect-saved-id]');
    if (inspectBtn) {
      const productId = inspectBtn.getAttribute('data-inspect-saved-id');
      const savedProducts = getSavedProducts(state.savedIds, state.products);
      const savedIdx = savedProducts.findIndex(p => p.id === productId);
      if (savedIdx !== -1) {
        showLightboxAt(elements, savedIdx, inspectBtn, savedProducts);
      }
    }
  });

  elements.savedSendMessengerBtn?.addEventListener('click', e => {
    handleSavedCakesInquiry(e, elements, getSavedProducts(state.savedIds, state.products));
  });

  elements.savedCopyListBtn?.addEventListener('click', e => {
    copySavedCakesList(e, elements, getSavedProducts(state.savedIds, state.products));
  });

  elements.faqAccordion?.addEventListener('click', e => {
    const trigger = e.target.closest('.faq-trigger');
    if (!trigger) return;
    const item = trigger.closest('.faq-item');
    if (!item) return;

    const nextOpen = !item.classList.contains('is-open');
    item.classList.toggle('is-open', nextOpen);
    trigger.setAttribute('aria-expanded', String(nextOpen));
  });

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
  elements.savedDrawerBackdrop?.addEventListener('touchmove', preventBackdropTouch, { passive: false });
  elements.menuDrawerBackdrop?.addEventListener('touchmove', preventBackdropTouch, { passive: false });

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
  elements.lightboxSaveBtn?.addEventListener('click', e => {
    const product = state.lightboxProducts[state.lightboxIndex];
    if (product) {
      toggleProductFavorite(elements, product.id, e);
    }
  });
  elements.lightboxCopyBtn?.addEventListener('click', e => {
    copyProductDetails(e, elements, state.lightboxProducts[state.lightboxIndex]);
  });

  const header = document.getElementById('mainHeader') || document.querySelector('header');
  const handleScrollState = () => {
    header?.classList.toggle('header-scrolled', window.scrollY > 20);
    updateScrollButtons(elements);
  };

  window.addEventListener('scroll', handleScrollState, { passive: true });
  window.addEventListener('resize', () => updateScrollButtons(elements), { passive: true });

  elements.backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: getScrollBehavior() });
  });

  elements.goToBottomBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: getScrollBehavior()
    });
  });

  window.addEventListener('popstate', e => {
    const isLightboxOpen = Boolean(elements.lightbox?.classList.contains('active'));
    if (lightboxHistory.shouldCloseOnPopState(e.state, isLightboxOpen)) {
      hideLightbox(elements, { fromPopState: true });
    }
  });

  window.addEventListener('keydown', e => {
    if (elements.lightbox?.classList.contains('active')) {
      if (e.key === 'Tab') {
        trapModalFocus(elements.lightbox, e);
      } else if (e.key === 'Escape') {
        hideLightbox(elements);
      } else if (e.key === 'ArrowRight' && state.lightboxIndex < state.lightboxProducts.length - 1) {
        showLightboxAt(elements, state.lightboxIndex + 1, null, state.lightboxProducts);
      } else if (e.key === 'ArrowLeft' && state.lightboxIndex > 0) {
        showLightboxAt(elements, state.lightboxIndex - 1, null, state.lightboxProducts);
      }
      return;
    }

    if (elements.customCakeModal?.classList.contains('active')) {
      if (e.key === 'Tab') {
        trapModalFocus(elements.customCakeModal, e);
      } else if (e.key === 'Escape') {
        closeCustomCakeModal(elements);
      }
      return;
    }

    if (elements.savedDrawer?.classList.contains('active')) {
      if (e.key === 'Tab') {
        trapModalFocus(elements.savedDrawer, e);
      } else if (e.key === 'Escape') {
        closeSavedDrawer(elements);
      }
      return;
    }

    if (elements.menuFilterDrawer?.classList.contains('active')) {
      if (e.key === 'Tab') {
        trapModalFocus(elements.menuFilterDrawer, e);
      } else if (e.key === 'Escape') {
        closeMenuDrawer(elements);
      }
    }
  });
}

async function bootstrap() {
  const elements = getElements();
  state.savedIds = loadSavedIds();
  initEventListeners(elements);
  updateCustomCakePreview(elements);

  try {
    state.products = await loadProducts();
    state.isCatalogLoaded = true;

    const prunedIds = pruneSavedIds(state.savedIds, state.products);
    if (prunedIds.length !== state.savedIds.length) {
      saveSavedIds(prunedIds);
    }
    state.savedIds = prunedIds;

    populateCategoryCounts(elements, state.products);
    state.heroShowcase = selectHeroShowcaseProducts(state.products, 3, false);
    state.heroSpotlightIndex = 0;
    renderHeroShowcase(elements, state.heroShowcase);
    updateSavedFloatingPill(elements, state.savedIds.length, false);
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
