import { CONFIG, CATEGORY_META } from './config.js';

/**
 * Formats a numeric price in BDT or returns 'TBA' when unavailable.
 */
export function formatPrice(price) {
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    return 'TBA';
  }
  return `${CONFIG.currencySymbol}${price.toLocaleString('en-US')}`;
}

/**
 * Normalizes a raw product record from products.json into UI-ready shape.
 */
export function normalizeProduct(raw) {
  const category = raw.category || 'birthday';
  const meta = CATEGORY_META[category];
  const categoryLabel = meta ? meta.label : category;
  const shortCategoryLabel = meta
    ? meta.shortLabel
    : categoryLabel.replace(/\s*Cakes?|\s*&\s*Treats?/gi, '').trim() || categoryLabel;

  const numericPrice =
    typeof raw.price === 'number' && Number.isFinite(raw.price) && raw.price > 0
      ? raw.price
      : 0;

  const imagePath = raw.imagePath || raw.imageSrc || '';
  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : imagePath
        ? [imagePath]
        : [];

  return {
    id: raw.id,
    name: raw.name || '',
    featured: Boolean(raw.featured),
    category,
    categoryLabel,
    shortCategoryLabel,
    flavor: raw.flavor ?? raw.flavour ?? '',
    size: raw.size || '',
    numericPrice,
    price: formatPrice(numericPrice),
    imagePath,
    images,
    details: raw.details || ''
  };
}

/**
 * Unbiased Fisher-Yates array shuffle returning a new copy.
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Randomizes featured items at top and non-featured items below per page visit.
 */
export function createVisitRandomizedProducts(masterProducts) {
  const featured = masterProducts.filter(p => p.featured === true);
  const normal = masterProducts.filter(p => p.featured !== true);
  return [...shuffleArray(featured), ...shuffleArray(normal)];
}

/**
 * Selects up to `count` featured products for the hero collage, preferring
 * priced items across distinct categories for visual variety.
 */
export function selectHeroShowcaseProducts(products, count = 3, randomize = false) {
  const source = randomize ? shuffleArray(products) : products;
  const pricedFeatured = source.filter(p => p.featured === true && p.imagePath && p.numericPrice > 0);
  const anyFeatured = source.filter(p => p.featured === true && p.imagePath);
  const fallbackPool = pricedFeatured.length >= count ? pricedFeatured : anyFeatured.length >= count ? anyFeatured : source.filter(p => p.imagePath);

  const selected = [];
  const usedIds = new Set();
  const usedCategories = new Set();

  for (const item of pricedFeatured) {
    if (selected.length >= count) break;
    if (!usedCategories.has(item.category)) {
      selected.push(item);
      usedIds.add(item.id);
      usedCategories.add(item.category);
    }
  }

  for (const item of fallbackPool) {
    if (selected.length >= count) break;
    if (!usedIds.has(item.id)) {
      selected.push(item);
      usedIds.add(item.id);
    }
  }

  return selected;
}

const PRICE_RANGE_MATCHERS = {
  'under-1000': price => price > 0 && price < 1000,
  '1000-1999': price => price >= 1000 && price < 2000,
  '2000-plus': price => price >= 2000,
  tba: price => !price || price <= 0
};

const POUND_TWO_FIVE_PLUS_RE = /^(2\.5|[3-9]|\d{2,})\s*pound\b/i;
const ANY_STANDARD_POUND_RE = /^(1|1\.5|2|2\.5|[3-9]|\d{2,})\s*pound\b/i;

const SIZE_RANGE_MATCHERS = {
  '1-pound': size => /^1\s*pound\b/i.test(size),
  '1.5-pound': size => /^1\.5\s*pound\b/i.test(size),
  '2-pound': size => /^2\s*pound\b/i.test(size),
  '2.5-plus': size => POUND_TWO_FIVE_PLUS_RE.test(size),
  'mini-treats': size => !ANY_STANDARD_POUND_RE.test(size)
};

function normalizeSelectionList(list, legacySingle) {
  if (Array.isArray(list) && list.length > 0) {
    return list.filter(val => val && val !== 'all');
  }
  if (legacySingle && legacySingle !== 'all') {
    return [legacySingle];
  }
  return [];
}

function matchesFlavourValue(productFlavor, targetFlavour) {
  const pFlavour = productFlavor.toLowerCase();
  const target = targetFlavour.toLowerCase();
  if (target === 'butterscotch') {
    return pFlavour.includes('butterscotch') || pFlavour.includes('caramel');
  }
  return pFlavour.includes(target);
}

/**
 * Filters and sorts normalized products according to active UI state.
 */
export function filterAndSortProducts(
  products,
  {
    activeCategories,
    activeCategory = 'all',
    activeFlavours,
    activeFlavour = 'all',
    activePriceRanges,
    activePriceRange = 'all',
    activeSizes,
    featuredOnly = false,
    searchQuery = '',
    activeSort = 'featured'
  }
) {
  const query = searchQuery.toLowerCase().trim();
  const categories = normalizeSelectionList(activeCategories, activeCategory);
  const flavours = normalizeSelectionList(activeFlavours, activeFlavour);
  const priceRanges = normalizeSelectionList(activePriceRanges, activePriceRange);
  const sizes = normalizeSelectionList(activeSizes, null);

  const filtered = products.filter(product => {
    const matchesCategory = categories.length === 0 || categories.includes(product.category);

    const matchesFlavour =
      flavours.length === 0 || flavours.some(flav => matchesFlavourValue(product.flavor, flav));

    const matchesPriceRange =
      priceRanges.length === 0 ||
      priceRanges.some(range => PRICE_RANGE_MATCHERS[range]?.(product.numericPrice));

    const matchesSize =
      sizes.length === 0 ||
      sizes.some(sizeKey => SIZE_RANGE_MATCHERS[sizeKey]?.(product.size || ''));

    const matchesFeatured = !featuredOnly || product.featured === true;

    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.categoryLabel.toLowerCase().includes(query) ||
      product.flavor.toLowerCase().includes(query) ||
      product.size.toLowerCase().includes(query) ||
      product.details.toLowerCase().includes(query) ||
      product.price.toLowerCase().includes(query);

    return (
      matchesCategory &&
      matchesFlavour &&
      matchesPriceRange &&
      matchesSize &&
      matchesFeatured &&
      matchesSearch
    );
  });

  if (activeSort === 'price-low' || activeSort === 'price-high') {
    const dir = activeSort === 'price-low' ? 1 : -1;
    filtered.sort((a, b) => {
      const aVal = a.numericPrice || 0;
      const bVal = b.numericPrice || 0;
      if (aVal === 0 && bVal === 0) return 0;
      if (aVal === 0) return 1;
      if (bVal === 0) return -1;
      return (aVal - bVal) * dir;
    });
  } else if (activeSort === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (activeSort === 'featured') {
    filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return filtered;
}

/**
 * Fetches and normalizes the product catalog from products.json.
 */
export async function loadProducts(dataUrl = CONFIG.dataUrl) {
  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Expected an array of products');
  }
  return createVisitRandomizedProducts(data.map(normalizeProduct));
}
