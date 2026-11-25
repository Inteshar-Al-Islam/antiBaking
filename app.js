/**
 * Frostoria - Artisan Bakery & Cake Showcase
 * Catalog Loader, Filtering, Lightbox & Interactive Showcase
 */

// 1. Bakery Brand Configuration & Category Metadata
const CONFIG = {
  currencySymbol: '৳',
  brandName: 'Frostoria',
  tagline: 'Freshly baked memories.',
  dataUrl: 'products.json',
  socialLinks: {
    facebook: 'https://www.facebook.com/share/1HkyGvf5Se/',
    messenger: 'https://m.me/delightsbysuraiya',
    instagram: 'https://www.instagram.com/frostoria_cakes?obrf=MXB4eWhvaWpqaGlhdg=='
  }
};

const CATEGORY_META = {
  birthday: { label: 'Birthday Cakes', shortLabel: 'Birthday' },
  floral: { label: 'Floral Cakes', shortLabel: 'Floral' },
  aesthetic: { label: 'Minimal & Aesthetic', shortLabel: 'Aesthetic' },
  theme: { label: 'Theme Cakes', shortLabel: 'Theme' },
  'special-occasion': { label: 'Special Occasion', shortLabel: 'Occasion' },
  funny: { label: 'Funny Cakes', shortLabel: 'Funny' },
  cookies: { label: 'Cookies & Treats', shortLabel: 'Cookies' },
  cheesecake: { label: 'Cheesecake', shortLabel: 'Cheesecake' }
};

function formatPrice(price) {
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    return 'TBA';
  }
  return `${CONFIG.currencySymbol}${price.toLocaleString('en-US')}`;
}

function escapeHtml(value) {
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

function normalizeProduct(raw) {
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

// Helper for unbiased random array shuffling (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate randomized product list per page visit/refresh:
// All featured products shuffled randomly at top, followed by all normal products shuffled randomly below.
function createVisitRandomizedProducts(masterProducts) {
  const featured = masterProducts.filter(p => p.featured === true);
  const normal = masterProducts.filter(p => p.featured !== true);

  return [...shuffleArray(featured), ...shuffleArray(normal)];
}

// 2. Application State Management
let products = [];
let currentFilteredProducts = [];
let currentLightboxIndex = -1;
let isCatalogLoaded = false;
let activeCategory = 'all';
let activeFlavour = 'all';
let searchQuery = '';
let activeSort = 'featured';

// 3. Cached DOM Elements
const elements = {
  productGrid: document.getElementById('productGrid'),
  itemCount: document.getElementById('itemCount'),
  drawerItemCount: document.getElementById('drawerItemCount'),
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  filterToggleBtn: document.getElementById('filterToggleBtn'),
  searchFilterContainer: document.getElementById('searchFilterContainer'),
  categoryPills: document.querySelectorAll('.category-btn'),
  flavourPills: document.querySelectorAll('.flavour-btn'),
  sortSelect: document.getElementById('sortSelect'),
  emptyState: document.getElementById('emptyState'),

  // Lightbox Modal
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

  // Toast & Utilities
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toastMessage'),
  toastProgressBar: document.getElementById('toastProgressBar'),
  backToTopBtn: document.getElementById('backToTopBtn')
};

function updateCountBadges(text, animate = true) {
  const countBadges = [elements.itemCount, elements.drawerItemCount].filter(Boolean);
  countBadges.forEach(badge => {
    badge.textContent = text;
    if (!animate) return;
    badge.classList.remove('badge-pop');
    void badge.offsetWidth;
    badge.classList.add('badge-pop');
  });
}

function showCatalogLoadError() {
  updateCountBadges('Catalog unavailable', false);
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

// 4. Fetch & Initialize Product Catalog
async function loadProducts() {
  try {
    const response = await fetch(CONFIG.dataUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Expected an array of products');
    }

    products = createVisitRandomizedProducts(data.map(normalizeProduct));
    isCatalogLoaded = true;
    renderProductGrid();
  } catch (error) {
    console.error('Failed to load products catalog:', error);
    showCatalogLoadError();
  }
}

// 5. Render Product Showcase Cards
function renderProductGrid() {
  if (!elements.productGrid || !isCatalogLoaded) return;

  const query = searchQuery.toLowerCase().trim();

  // Filter products by active category, flavour, and search terms
  currentFilteredProducts = products.filter(product => {
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

    const matchesSearch = !query ||
      product.name.toLowerCase().includes(query) ||
      product.categoryLabel.toLowerCase().includes(query) ||
      product.flavor.toLowerCase().includes(query) ||
      product.size.toLowerCase().includes(query) ||
      product.details.toLowerCase().includes(query) ||
      product.price.toLowerCase().includes(query);

    return matchesCategory && matchesFlavour && matchesSearch;
  });

  // Sort products based on user selection
  if (activeSort === 'price-low') {
    currentFilteredProducts.sort((a, b) => {
      const aVal = a.numericPrice || 0;
      const bVal = b.numericPrice || 0;
      if (aVal === 0 && bVal === 0) return 0;
      if (aVal === 0) return 1;
      if (bVal === 0) return -1;
      return aVal - bVal;
    });
  } else if (activeSort === 'price-high') {
    currentFilteredProducts.sort((a, b) => {
      const aVal = a.numericPrice || 0;
      const bVal = b.numericPrice || 0;
      if (aVal === 0 && bVal === 0) return 0;
      if (aVal === 0) return 1;
      if (bVal === 0) return -1;
      return bVal - aVal;
    });
  } else if (activeSort === 'name-asc') {
    currentFilteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (activeSort === 'featured') {
    // Keep featured showpieces prioritized at the top
    currentFilteredProducts.sort((a, b) => {
      const aScore = a.featured ? 1 : 0;
      const bScore = b.featured ? 1 : 0;
      return bScore - aScore;
    });
  }

  // Update live item counter badges with pop animation
  const count = currentFilteredProducts.length;
  updateCountBadges(`${count} ${count === 1 ? 'Creation' : 'Creations'} Available`);

  // Toggle Empty State view
  if (currentFilteredProducts.length === 0) {
    elements.productGrid.innerHTML = '';
    elements.emptyState?.classList.remove('hidden');
    return;
  } else {
    elements.emptyState?.classList.add('hidden');
  }

  // Render responsive product cards with staggered entrance
  elements.productGrid.innerHTML = currentFilteredProducts.map((product, index) => {
    const safeName = escapeHtml(product.name);
    const safeImagePath = escapeHtml(product.imagePath);
    const fallbackSrc = escapeHtml(buildFallbackSvg(product.name));
    const animDelay = Math.min(index * 35, 420);

    return `
      <article 
        class="product-card group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#EFE8E1] cursor-pointer flex flex-col select-none"
        data-index="${index}"
        style="--card-delay: ${animDelay}ms;"
        onclick="openLightbox(${index})"
        role="button"
        tabindex="0"
        aria-label="View details for ${safeName}"
        onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(${index}); }"
      >
        <!-- Product Photo Container -->
        <div class="product-image-wrap aspect-square w-full relative overflow-hidden bg-[#FAF7F2]">
          <img 
            src="${safeImagePath}" 
            alt="${safeName}" 
            loading="lazy"
            data-fallback="${fallbackSrc}"
            class="product-image w-full h-full object-cover object-center pointer-events-none"
            onerror="this.onerror=null; this.src=this.dataset.fallback;"
          />
          
          <!-- Top Badges Flex Bar: Prevents Collisions on Mobile -->
          <div class="absolute top-1.5 inset-x-1.5 sm:top-3 sm:inset-x-3 flex items-center justify-between gap-1 pointer-events-none z-10">
            <!-- Category Badge (Short on mobile, Full on desktop) -->
            <span class="pointer-events-none px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-xs font-medium tracking-wide bg-white/95 backdrop-blur-xs text-[#6E4E37] rounded-full border border-[#EFE8E1] shadow-xs truncate shrink">
              <span class="sm:hidden">${escapeHtml(product.shortCategoryLabel)}</span>
              <span class="hidden sm:inline">${escapeHtml(product.categoryLabel)}</span>
            </span>

            <!-- Featured Best-Seller Badge (Compact on mobile) -->
            ${product.featured ? `
              <span class="pointer-events-none shrink-0 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-xs font-semibold tracking-wide bg-[#B87333] text-white rounded-full shadow-xs flex items-center gap-0.5 sm:gap-1">
                <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-200 fill-current shrink-0" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span>Featured</span>
              </span>
            ` : ''}
          </div>

          <!-- Hover View Indicator -->
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

        <!-- Product Summary Details -->
        <div class="p-3 sm:p-5 flex-1 flex flex-col justify-between bg-white">
          <!-- Top Area: Cake Name & Price -->
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

          <!-- Bottom Row: Flavour & Size Pills -->
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
  }).join('');
}

// 6. Lightbox Modal Controls
let savedBodyScrollY = 0;

function openLightbox(index) {
  if (index < 0 || index >= currentFilteredProducts.length) return;
  currentLightboxIndex = index;
  const product = currentFilteredProducts[currentLightboxIndex];
  if (!product) return;

  const modal = elements.lightbox || document.getElementById('lightboxModal');
  if (!modal) return;

  const img = elements.lightboxImg || document.getElementById('lightboxImg');
  const title = elements.lightboxTitle || document.getElementById('lightboxTitle');
  const price = elements.lightboxPrice || document.getElementById('lightboxPrice');
  const category = elements.lightboxCategory || document.getElementById('lightboxCategory');
  const flavour = elements.lightboxFlavour || document.getElementById('lightboxFlavour');
  const size = elements.lightboxSize || document.getElementById('lightboxSize');
  const details = elements.lightboxDetails || document.getElementById('lightboxDetails');

  if (img) {
    img.src = product.imagePath;
    img.alt = product.name;
    img.classList.remove('lightbox-img-enter');
    void img.offsetWidth;
    img.classList.add('lightbox-img-enter');
  }

  if (title) title.textContent = product.name;
  if (price) price.textContent = product.price;
  if (category) category.textContent = product.categoryLabel;
  if (flavour) flavour.textContent = product.flavor;
  if (size) size.textContent = product.size;
  if (details) details.textContent = product.details;

  // Handle Multiple Product Images / Thumbnails
  const productImages = product.images.length > 0 ? product.images : [product.imagePath];
  const thumbsContainer = elements.lightboxThumbnailsContainer || document.getElementById('lightboxThumbnailsContainer');
  const thumbs = elements.lightboxThumbnails || document.getElementById('lightboxThumbnails');

  if (thumbsContainer && thumbs) {
    if (productImages.length > 1) {
      thumbsContainer.classList.remove('hidden');
      const safeName = escapeHtml(product.name);
      thumbs.innerHTML = productImages.map((imgPath, imgIdx) => `
        <button
          type="button"
          class="lightbox-thumb-btn w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${imgIdx === 0 ? 'border-[#B87333] ring-2 ring-[#B87333]/30 scale-105 shadow-xs' : 'border-[#E5DCD3] hover:border-caramel-400 opacity-70 hover:opacity-100'}"
          data-img-index="${imgIdx}"
          title="View photo ${imgIdx + 1}"
          aria-label="View photo ${imgIdx + 1}"
        >
          <img src="${escapeHtml(imgPath)}" alt="${safeName} view ${imgIdx + 1}" class="w-full h-full object-cover object-center" />
        </button>
      `).join('');

      thumbs.querySelectorAll('.lightbox-thumb-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetIdx = parseInt(btn.getAttribute('data-img-index'), 10);
          if (img) {
            img.src = productImages[targetIdx];
            img.classList.remove('lightbox-img-enter');
            void img.offsetWidth;
            img.classList.add('lightbox-img-enter');
          }

          thumbs.querySelectorAll('.lightbox-thumb-btn').forEach((b, idx) => {
            if (idx === targetIdx) {
              b.className = 'lightbox-thumb-btn w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer border-[#B87333] ring-2 ring-[#B87333]/30 scale-105 shadow-xs';
            } else {
              b.className = 'lightbox-thumb-btn w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer border-[#E5DCD3] hover:border-caramel-400 opacity-70 hover:opacity-100';
            }
          });
        });
      });
    } else {
      thumbsContainer.classList.add('hidden');
      thumbs.innerHTML = '';
    }
  }

  // Open modal window
  modal.classList.add('active');

  // Freeze background webpage scroll position (prevents background scrolling on mobile)
  savedBodyScrollY = window.scrollY || window.pageYOffset || 0;
  document.body.classList.add('modal-open');
  document.body.style.position = 'fixed';
  document.body.style.top = `-${savedBodyScrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';

  // Reset modal scroll position to top
  const dialog = modal.querySelector('.modal-dialog');
  if (dialog) dialog.scrollTop = 0;
  const sidebarScroll = modal.querySelector('.modal-sidebar-scroll');
  if (sidebarScroll) sidebarScroll.scrollTop = 0;

  // Update navigation button states
  const prevBtn = elements.lightboxPrev || document.getElementById('lightboxPrev');
  const nextBtn = elements.lightboxNext || document.getElementById('lightboxNext');
  if (prevBtn) {
    prevBtn.disabled = currentLightboxIndex === 0;
    prevBtn.classList.toggle('opacity-30', currentLightboxIndex === 0);
  }
  if (nextBtn) {
    nextBtn.disabled = currentLightboxIndex === currentFilteredProducts.length - 1;
    nextBtn.classList.toggle('opacity-30', currentLightboxIndex === currentFilteredProducts.length - 1);
  }
}

function closeLightbox() {
  const modal = elements.lightbox || document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');

  // Restore background webpage scroll position
  document.body.classList.remove('modal-open');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, savedBodyScrollY);

  currentLightboxIndex = -1;
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

function nextLightboxImage() {
  if (currentLightboxIndex < currentFilteredProducts.length - 1) {
    openLightbox(currentLightboxIndex + 1);
  }
}

function prevLightboxImage() {
  if (currentLightboxIndex > 0) {
    openLightbox(currentLightboxIndex - 1);
  }
}

// Delightful Sparkle Particle Burst for Interactive Buttons
function triggerSparkleBurst(x, y) {
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

// Toast helper with countdown progress bar
let toastTimer = null;
function showToast(message) {
  if (!elements.toast || !elements.toastMessage) return;
  elements.toastMessage.textContent = message;

  // Reset toast and progress animation
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

// Inquire / Order via Facebook Messenger
function handleInquiry(e) {
  if (currentLightboxIndex < 0) return;
  if (e && e.clientX) {
    triggerSparkleBurst(e.clientX, e.clientY);
  }
  const product = currentFilteredProducts[currentLightboxIndex];
  const orderMessage = `Hello Frostoria! I would like to inquire about ordering "${product.name}" (${product.flavor}, ${product.size}, ${product.price}).`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(orderMessage).then(() => {
      showToast('Copied cake details! Opening Messenger...');
    }).catch(() => {
      showToast('Opening Facebook Messenger...');
    });
  } else {
    showToast('Opening Facebook Messenger...');
  }

  // Open Facebook Messenger to chat directly with the Facebook page
  window.open(CONFIG.socialLinks.messenger, '_blank');
}

// Copy Product Details to Clipboard
function copyProductDetails(e) {
  if (currentLightboxIndex < 0) return;
  if (e && e.clientX) {
    triggerSparkleBurst(e.clientX, e.clientY);
  }
  const product = currentFilteredProducts[currentLightboxIndex];
  const text = `Frostoria ("Freshly baked memories.") - ${product.name} | Flavour: ${product.flavor} | Size: ${product.size} | Price: ${product.price}`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied cake details to clipboard!');
    }).catch(() => {
      showToast(`Selected: ${product.name} (${product.price})`);
    });
  } else {
    showToast(`Selected: ${product.name} (${product.price})`);
  }
}

// 7. Event Listeners Setup
function initEventListeners() {
  // Search Input live filtering
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (elements.clearSearchBtn) {
        elements.clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
      }
      renderProductGrid();
    });
  }

  // Clear Search Field & Reset Filters
  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      searchQuery = '';
      elements.clearSearchBtn.classList.add('hidden');

      // Reset category and flavour active states
      activeCategory = 'all';
      activeFlavour = 'all';
      elements.categoryPills?.forEach(b => b.classList.toggle('active', b.getAttribute('data-category') === 'all'));
      elements.flavourPills?.forEach(b => b.classList.toggle('active', b.getAttribute('data-flavour') === 'all'));

      renderProductGrid();
      elements.searchInput.focus();
    });
  }

  // Header Filter Bar Toggle with Smooth Sliding Drawer
  if (elements.filterToggleBtn && elements.searchFilterContainer) {
    elements.filterToggleBtn.addEventListener('click', () => {
      const isExpanded = elements.searchFilterContainer.classList.contains('open');
      if (isExpanded) {
        elements.searchFilterContainer.classList.remove('open');
        elements.filterToggleBtn.setAttribute('aria-expanded', 'false');
        elements.filterToggleBtn.classList.remove('bg-caramel-100', 'border-caramel-400');
      } else {
        elements.searchFilterContainer.classList.add('open');
        elements.filterToggleBtn.setAttribute('aria-expanded', 'true');
        elements.filterToggleBtn.classList.add('bg-caramel-100', 'border-caramel-400');
        elements.searchInput?.focus();
      }
    });
  }

  // Category Filter Pills
  elements.categoryPills.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.categoryPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderProductGrid();
    });
  });

  // Flavour Filter Pills
  elements.flavourPills.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.flavourPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFlavour = btn.getAttribute('data-flavour') || 'all';
      renderProductGrid();
    });
  });

  // Sort Selection change
  if (elements.sortSelect) {
    elements.sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderProductGrid();
    });
  }

  // Delegated click listener on product grid for reliable mobile touch & click support
  const grid = elements.productGrid || document.getElementById('productGrid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (card) {
        const idx = card.getAttribute('data-index');
        if (idx !== null && !isNaN(parseInt(idx, 10))) {
          openLightbox(parseInt(idx, 10));
        }
      }
    });
  }

  // Touch-drag on lightbox image area scrolls the modal content instead of background webpage
  const imageArea = document.querySelector('.lightbox-image-area') || elements.lightboxImg?.parentElement;
  if (imageArea) {
    let touchStartY = 0;
    imageArea.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    imageArea.addEventListener('touchmove', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;

      // Scroll the modal dialog or sidebar
      const dialog = document.querySelector('.modal-dialog');
      const sidebar = document.querySelector('.modal-sidebar-scroll');
      const scrollTarget = window.innerWidth < 768 ? dialog : sidebar;

      if (scrollTarget) {
        scrollTarget.scrollTop += deltaY;
      }

      // Stop the touch from bubbling to the background webpage
      if (e.cancelable) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Prevent touchmove on backdrop from leaking to page
  if (elements.lightboxBackdrop) {
    elements.lightboxBackdrop.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
  }

  // Lightbox Modal Controls
  if (elements.lightboxClose) {
    elements.lightboxClose.addEventListener('click', closeLightbox);
  }

  if (elements.lightboxBackdrop) {
    elements.lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  if (elements.lightboxPrev) {
    elements.lightboxPrev.addEventListener('click', prevLightboxImage);
  }

  if (elements.lightboxNext) {
    elements.lightboxNext.addEventListener('click', nextLightboxImage);
  }

  if (elements.lightboxInquireBtn) {
    elements.lightboxInquireBtn.addEventListener('click', (e) => handleInquiry(e));
  }

  if (elements.lightboxCopyBtn) {
    elements.lightboxCopyBtn.addEventListener('click', (e) => copyProductDetails(e));
  }

  // Header Scroll Elevation & Back to Top Visibility
  const header = document.getElementById('mainHeader') || document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }

    if (elements.backToTopBtn) {
      if (window.scrollY > 350) {
        elements.backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-3');
        elements.backToTopBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      } else {
        elements.backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-3');
        elements.backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      }
    }
  }, { passive: true });

  // Back to Top Click
  if (elements.backToTopBtn) {
    elements.backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!elements.lightbox?.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextLightboxImage();
    } else if (e.key === 'ArrowLeft') {
      prevLightboxImage();
    }
  });
}

// 8. Application Mount
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  loadProducts();
});
