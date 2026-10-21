/**
 * Frostoria - Artisan Bakery & Cake Showcase
 * Dynamic Local Image Scanning, Category Filtering & Lightbox System
 */

// 1. Scanned local image files directly from the project directory.
// When you add your real cake photos here (e.g., 'Chocolate Truffle Cake(1200).jpg'),
// simply add their filenames to this array and the site will automatically parse them!
const LOCAL_IMAGE_FILES = [
  // Example future filenames:
  // 'Blush berry velvet cake(1400).jpg',
  // 'Botanical wedding tier(4500).jpg',
  // 'Rose & berry cupcake box(650).jpg'
];

// Configuration
const CONFIG = {
  currencySymbol: '৳', // Default currency symbol (Tk / BDT)
  brandName: 'Frostoria',
  tagline: 'Freshly baked memories.',
  phone: '+8801310316869',
  socialLinks: {
    instagram: 'https://instagram.com',
    whatsapp: 'https://wa.me/8801310316869?text='
  }
};

/**
 * 12 Curated Dummy Cake Products across all categories.
 * Displayed while you are preparing your own product photos!
 */
const DUMMY_PRODUCTS = [
  {
    id: 'cake-1',
    name: 'Blush Berry Velvet Cake',
    rawPrice: '1400',
    numericPrice: 1400,
    price: '৳1,400',
    category: 'celebration',
    categoryLabel: 'Celebration & Birthdays',
    imageSrc: 'https://images.unsplash.com/photo-1565788049436-bc97046eff42?auto=format&fit=crop&w=800&q=80',
    details: 'Triple-layer fluffy vanilla sponge layered with house-made wild raspberry coulis and French strawberry Swiss meringue buttercream.'
  },
  {
    id: 'cake-2',
    name: 'Salted Caramel Macaron Drip',
    rawPrice: '1600',
    numericPrice: 1600,
    price: '৳1,600',
    category: 'celebration',
    categoryLabel: 'Celebration & Birthdays',
    imageSrc: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    details: 'Decadent Belgian dark chocolate sponge infused with espresso syrup, finished with golden salted caramel drizzle and French macarons.'
  },
  {
    id: 'cake-3',
    name: 'Confetti Funfetti Royale',
    rawPrice: '1200',
    numericPrice: 1200,
    price: '৳1,200',
    category: 'celebration',
    categoryLabel: 'Celebration & Birthdays',
    imageSrc: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
    details: 'Classic festive celebration cake with colorful carnival sprinkles baked right into Madagascar vanilla sponge, topped with pastel swirls.'
  },
  {
    id: 'cake-4',
    name: 'Botanical Whisper 3-Tier',
    rawPrice: '4500',
    numericPrice: 4500,
    price: '৳4,500',
    category: 'wedding',
    categoryLabel: 'Weddings & Tiers',
    imageSrc: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    details: 'Grand three-tiered wedding centerpiece featuring Earl Grey tea sponge, lavender infusion, and pressed edible wildflowers on smooth white buttercream.'
  },
  {
    id: 'cake-5',
    name: 'Pure White Floral Velvet',
    rawPrice: '3800',
    numericPrice: 3800,
    price: '৳3,800',
    category: 'wedding',
    categoryLabel: 'Weddings & Tiers',
    imageSrc: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80',
    details: 'Romantic tiered anniversary and wedding cake with Sicilian pistachio sponge, Persian rose cream, and fresh organic ivory floral accents.'
  },
  {
    id: 'cake-6',
    name: 'Gilded Golden Elegance Tier',
    rawPrice: '5200',
    numericPrice: 5200,
    price: '৳5,200',
    category: 'wedding',
    categoryLabel: 'Weddings & Tiers',
    imageSrc: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
    details: 'Luxurious multi-tier celebration cake adorned with handcrafted sugar florals and genuine edible 24k gold leaf foil accents.'
  },
  {
    id: 'cake-7',
    name: 'Rose & Berry Cupcake Box',
    rawPrice: '650',
    numericPrice: 650,
    price: '৳650 (Box of 6)',
    category: 'cupcakes',
    categoryLabel: 'Cupcakes & Pastries',
    imageSrc: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80',
    details: 'Set of 6 delicate almond cupcakes filled with raspberry compote and hand-piped Swiss buttercream rose blossoms.'
  },
  {
    id: 'cake-8',
    name: 'Dark Truffle Ganache Cupcakes',
    rawPrice: '700',
    numericPrice: 700,
    price: '৳700 (Box of 6)',
    category: 'cupcakes',
    categoryLabel: 'Cupcakes & Pastries',
    imageSrc: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80',
    details: 'Rich 70% dark chocolate cupcakes crowned with whipped Valrhona ganache swirls, roasted hazelnut crunch, and cocoa nibs.'
  },
  {
    id: 'cake-9',
    name: 'Meyer Lemon Meringue Cups',
    rawPrice: '600',
    numericPrice: 600,
    price: '৳600 (Box of 6)',
    category: 'cupcakes',
    categoryLabel: 'Cupcakes & Pastries',
    imageSrc: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
    details: 'Zesty tart lemon curd core encased in light chiffon sponge with flame-torched fluffy Italian meringue peaks.'
  },
  {
    id: 'cake-10',
    name: 'Valrhona Chocolate Mirror Gâteau',
    rawPrice: '1850',
    numericPrice: 1850,
    price: '৳1,850',
    category: 'signature',
    categoryLabel: 'Signature Gâteaux',
    imageSrc: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
    details: 'Five layers of dark chocolate mousse, hazelnut praline crunch, moist flourless sponge, and glossy mirror chocolate glaze.'
  },
  {
    id: 'cake-11',
    name: 'Pistachio Raspberry Tart-Cake',
    rawPrice: '1750',
    numericPrice: 1750,
    price: '৳1,750',
    category: 'signature',
    categoryLabel: 'Signature Gâteaux',
    imageSrc: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80',
    details: 'Roasted Bronte pistachio frangipane sponge layered with ruby raspberry gelée and white velvet cream rosettes.'
  },
  {
    id: 'cake-12',
    name: 'Vintage Ribbon Bento Cake',
    rawPrice: '550',
    numericPrice: 550,
    price: '৳550',
    category: 'bento',
    categoryLabel: 'Bento & Mini Cakes',
    imageSrc: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    details: 'Adorable 4-inch Korean-style bento box cake with vintage piped ribbons, custom inscription option, and creamy vanilla-strawberry layers.'
  }
];

/**
 * Convert string to clean Title Case while respecting common conjunctions & prepositions
 */
function toTitleCase(str) {
  const minorWords = new Set(['with', 'and', 'or', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'a', 'an']);
  return str
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index > 0 && minorWords.has(lower)) {
        return lower;
      }
      return word
        .split('-')
        .map(part => {
          const lPart = part.toLowerCase();
          return lPart.charAt(0).toUpperCase() + lPart.slice(1);
        })
        .join('-');
    })
    .join(' ');
}

/**
 * Automatically extracts Product Name, Price, and Category from image filenames.
 * Handles patterns:
 * - "Blush Berry Velvet(1400).jpg" -> Name: Blush Berry Velvet, Price: 1400
 * - "Botanical 3-Tier Wedding Cake(4500).jpg" -> Category: Weddings & Tiers
 * - "Rose & Berry Cupcake Box - 650.jpg" -> Category: Cupcakes & Pastries
 * - "Chocolate Bento Cake(550).png" -> Category: Bento & Mini Cakes
 */
function parseProductFromFilename(filename, index) {
  // Strip image file extension
  let raw = filename.replace(/\.(jpe?g|png|webp|gif|svg)$/i, '').trim();
  let priceStr = '';
  let rawName = raw;

  // Pattern 1: Parentheses at the end, e.g. "Name (1200)"
  const parenMatch = raw.match(/\(([^)]+)\)$/);
  if (parenMatch) {
    priceStr = parenMatch[1].trim();
    rawName = raw.slice(0, raw.lastIndexOf('(')).trim();
  } else {
    // Pattern 2: Hyphen or dash followed by price, e.g. "Name - 1200"
    const dashMatch = raw.match(/[-–—]\s*(\d+(?:\s*[a-zA-Z]+)?)$/);
    if (dashMatch) {
      priceStr = dashMatch[1].trim();
      rawName = raw.slice(0, raw.lastIndexOf(dashMatch[0])).trim();
    } else {
      // Pattern 3: Trailing space and number, e.g. "Product Name 1200"
      const spaceNumMatch = raw.match(/\s+(\d+(?:\s*[a-zA-Z]+)?)$/);
      if (spaceNumMatch) {
        priceStr = spaceNumMatch[1].trim();
        rawName = raw.slice(0, raw.lastIndexOf(spaceNumMatch[0])).trim();
      }
    }
  }

  // Convert kebab-case or snake_case to natural words
  if (rawName.includes('-') && !rawName.includes(' ')) {
    rawName = rawName.replace(/-/g, ' ');
  }
  if (rawName.includes('_')) {
    rawName = rawName.replace(/_/g, ' ');
  }

  const titleName = toTitleCase(rawName);

  // Extract numeric price value for sorting
  const numericMatch = priceStr.match(/\d+/);
  const numericPrice = numericMatch ? parseInt(numericMatch[0], 10) : 0;

  // Format display price
  const formattedPrice = priceStr
    ? `${CONFIG.currencySymbol}${priceStr}`
    : 'Inquire for Price';

  // Category classification based on keywords
  let category = 'celebration';
  let categoryLabel = 'Celebration & Birthdays';
  const lowerName = titleName.toLowerCase();

  if (lowerName.includes('wedding') || lowerName.includes('tier')) {
    category = 'wedding';
    categoryLabel = 'Weddings & Tiers';
  } else if (lowerName.includes('cupcake') || lowerName.includes('muffin') || lowerName.includes('pastry') || lowerName.includes('puff')) {
    category = 'cupcakes';
    categoryLabel = 'Cupcakes & Pastries';
  } else if (lowerName.includes('bento') || lowerName.includes('mini') || lowerName.includes('lunchbox')) {
    category = 'bento';
    categoryLabel = 'Bento & Mini Cakes';
  } else if (lowerName.includes('gateau') || lowerName.includes('gâteau') || lowerName.includes('truffle') || lowerName.includes('tart') || lowerName.includes('signature')) {
    category = 'signature';
    categoryLabel = 'Signature Gâteaux';
  }

  return {
    id: `cake-local-${index + 1}`,
    filename: filename,
    imageSrc: encodeURI(filename),
    name: titleName,
    rawPrice: priceStr,
    numericPrice: numericPrice,
    price: formattedPrice,
    category: category,
    categoryLabel: categoryLabel,
    details: 'Freshly baked to order with 100% natural butter, organic vanilla, rich Belgian chocolate, and artisan care.'
  };
}

// 2. State Management
// If local files are present, parse them. Otherwise use the rich curated dummy cake collection.
let products = LOCAL_IMAGE_FILES.length > 0
  ? LOCAL_IMAGE_FILES.map((filename, idx) => parseProductFromFilename(filename, idx))
  : DUMMY_PRODUCTS;

let currentFilteredProducts = [...products];
let currentLightboxIndex = -1;
let activeCategory = 'all';
let searchQuery = '';
let activeSort = 'featured';

// 3. DOM Elements
const elements = {
  productGrid: document.getElementById('productGrid'),
  itemCount: document.getElementById('itemCount'),
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  filterToggleBtn: document.getElementById('filterToggleBtn'),
  searchFilterContainer: document.getElementById('searchFilterContainer'),
  categoryPills: document.querySelectorAll('.category-btn'),
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
  lightboxDetails: document.getElementById('lightboxDetails'),
  lightboxPrev: document.getElementById('lightboxPrev'),
  lightboxNext: document.getElementById('lightboxNext'),
  lightboxInquireBtn: document.getElementById('lightboxInquireBtn'),
  lightboxCopyBtn: document.getElementById('lightboxCopyBtn'),

  // Toast
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toastMessage')
};

// 4. Render Product Showcase Cards
function renderProductGrid() {
  if (!elements.productGrid) return;

  // Filter products by category and search
  currentFilteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.price.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort products
  if (activeSort === 'price-low') {
    currentFilteredProducts.sort((a, b) => a.numericPrice - b.numericPrice);
  } else if (activeSort === 'price-high') {
    currentFilteredProducts.sort((a, b) => b.numericPrice - a.numericPrice);
  } else if (activeSort === 'name-asc') {
    currentFilteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Update item counter
  if (elements.itemCount) {
    const count = currentFilteredProducts.length;
    elements.itemCount.textContent = `${count} ${count === 1 ? 'Cake' : 'Cakes'} Available`;
  }

  // Toggle Empty State
  if (currentFilteredProducts.length === 0) {
    elements.productGrid.innerHTML = '';
    elements.emptyState?.classList.remove('hidden');
    return;
  } else {
    elements.emptyState?.classList.add('hidden');
  }

  // Generate Cards
  elements.productGrid.innerHTML = currentFilteredProducts.map((product, index) => {
    return `
      <article 
        class="product-card group bg-white rounded-2xl overflow-hidden border border-[#EFE8E1] cursor-pointer flex flex-col justify-between"
        onclick="openLightbox(${index})"
        role="button"
        tabindex="0"
        aria-label="View details for ${product.name}"
        onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(${index}); }"
      >
        <!-- Product Photo Container -->
        <div class="product-image-wrap aspect-square w-full relative overflow-hidden bg-[#FAF7F2]">
          <img 
            src="${product.imageSrc}" 
            alt="${product.name}" 
            loading="lazy"
            class="product-image w-full h-full object-cover object-center"
            onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'400\\' viewBox=\\'0 0 400 400\\'%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' fill=\\'%23F5ECE3\\'/ %3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%236E4E37\\' font-family=\\'sans-serif\\' font-size=\\'18\\'%3E🎂 ${product.name}%3C/text%3E%3C/svg%3E';"
          />
          
          <!-- Subtle Category Badge -->
          <span class="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium tracking-wide bg-white/90 backdrop-blur-sm text-[#6E4E37] rounded-full border border-[#EFE8E1] shadow-xs">
            ${product.categoryLabel}
          </span>

          <!-- Hover View Indicator -->
          <div class="absolute inset-0 bg-[#26180F]/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span class="px-4 py-2 bg-white/95 text-[#26180F] rounded-full text-xs font-semibold tracking-wider uppercase shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-[#B87333]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Cake
            </span>
          </div>
        </div>

        <!-- Clean Product Info -->
        <div class="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white">
          <div class="min-w-0 flex-1">
            <h3 class="font-serif text-base sm:text-lg font-medium text-[#26180F] truncate group-hover:text-[#B87333] transition-colors">
              ${product.name}
            </h3>
            <p class="text-xs text-[#73655A] mt-0.5">Artisan handcrafted</p>
          </div>
          
          <div class="shrink-0 text-right">
            <span class="inline-block px-3 py-1 bg-[#FAF7F2] text-[#6E4E37] font-semibold text-sm sm:text-base rounded-lg border border-[#EFE8E1]">
              ${product.price}
            </span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// 5. Lightbox Modal Controls
function openLightbox(index) {
  if (index < 0 || index >= currentFilteredProducts.length) return;
  currentLightboxIndex = index;
  const product = currentFilteredProducts[currentLightboxIndex];

  elements.lightboxImg.src = product.imageSrc;
  elements.lightboxImg.alt = product.name;
  elements.lightboxTitle.textContent = product.name;
  elements.lightboxPrice.textContent = product.price;
  elements.lightboxCategory.textContent = product.categoryLabel;
  elements.lightboxDetails.textContent = product.details;

  // Open modal
  elements.lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Update navigation button states
  elements.lightboxPrev.disabled = currentLightboxIndex === 0;
  elements.lightboxNext.disabled = currentLightboxIndex === currentFilteredProducts.length - 1;
  elements.lightboxPrev.classList.toggle('opacity-30', currentLightboxIndex === 0);
  elements.lightboxNext.classList.toggle('opacity-30', currentLightboxIndex === currentFilteredProducts.length - 1);
}

function closeLightbox() {
  elements.lightbox.classList.remove('active');
  document.body.style.overflow = '';
  currentLightboxIndex = -1;
}

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

// Toast helper
function showToast(message) {
  if (!elements.toast || !elements.toastMessage) return;
  elements.toastMessage.textContent = message;
  elements.toast.classList.add('show');
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2600);
}

// Inquire or Copy Product Details
function handleInquiry() {
  if (currentLightboxIndex < 0) return;
  const product = currentFilteredProducts[currentLightboxIndex];
  const message = `Hello Frostoria! I am interested in inquiring/ordering the handcrafted cake "${product.name}" (${product.price}). Is it currently available for pre-order?`;

  // Open WhatsApp direct message redirect to +8801310316869
  const whatsappUrl = `${CONFIG.socialLinks.whatsapp}${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

function copyProductDetails() {
  if (currentLightboxIndex < 0) return;
  const product = currentFilteredProducts[currentLightboxIndex];
  const text = `Frostoria ("Freshly baked memories.") - ${product.name} (${product.price})`;

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

// 6. Event Listeners Initialization
function initEventListeners() {
  // Search Input
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (elements.clearSearchBtn) {
        elements.clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
      }
      renderProductGrid();
    });
  }

  // Clear Search
  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      searchQuery = '';
      elements.clearSearchBtn.classList.add('hidden');
      renderProductGrid();
      elements.searchInput.focus();
    });
  }

  // Header Filter Toggle (Minimalist low-clutter design)
  if (elements.filterToggleBtn && elements.searchFilterContainer) {
    elements.filterToggleBtn.addEventListener('click', () => {
      const isExpanded = !elements.searchFilterContainer.classList.contains('hidden');
      if (isExpanded) {
        elements.searchFilterContainer.classList.add('hidden');
        elements.filterToggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        elements.searchFilterContainer.classList.remove('hidden');
        elements.filterToggleBtn.setAttribute('aria-expanded', 'true');
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

  // Sort Selection
  if (elements.sortSelect) {
    elements.sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderProductGrid();
    });
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
    elements.lightboxInquireBtn.addEventListener('click', handleInquiry);
  }

  if (elements.lightboxCopyBtn) {
    elements.lightboxCopyBtn.addEventListener('click', copyProductDetails);
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!elements.lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextLightboxImage();
    } else if (e.key === 'ArrowLeft') {
      prevLightboxImage();
    }
  });
}

// 7. Initial Mount
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  renderProductGrid();
});
