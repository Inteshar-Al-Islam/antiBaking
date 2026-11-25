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
 * Filters and sorts normalized products according to active UI state.
 */
export function filterAndSortProducts(
  products,
  { activeCategory = 'all', activeFlavour = 'all', searchQuery = '', activeSort = 'featured' }
) {
  const query = searchQuery.toLowerCase().trim();

  const filtered = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;

    let matchesFlavour = true;
    if (activeFlavour !== 'all') {
      const pFlavour = product.flavor.toLowerCase();
      if (activeFlavour === 'butterscotch') {
        matchesFlavour = pFlavour.includes('butterscotch') || pFlavour.includes('caramel');
      } else {
        matchesFlavour = pFlavour.includes(activeFlavour.toLowerCase());
      }
    }

    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.categoryLabel.toLowerCase().includes(query) ||
      product.flavor.toLowerCase().includes(query) ||
      product.size.toLowerCase().includes(query) ||
      product.details.toLowerCase().includes(query) ||
      product.price.toLowerCase().includes(query);

    return matchesCategory && matchesFlavour && matchesSearch;
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
