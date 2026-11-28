/**
 * Frostoria brand settings and category display metadata.
 */
export const CONFIG = {
  currencySymbol: '৳',
  brandName: 'Frostoria',
  tagline: 'Freshly baked memories.',
  dataUrl: 'products.json',
  favoritesStorageKey: 'frostoria_saved_favorites_v1',
  socialLinks: {
    facebook: 'https://www.facebook.com/share/1HkyGvf5Se/',
    messenger: 'https://m.me/delightsbysuraiya',
    instagram: 'https://www.instagram.com/frostoria_cakes?obrf=MXB4eWhvaWpqaGlhdg=='
  }
};

export const CATEGORY_META = {
  birthday: { label: 'Birthday Cakes', shortLabel: 'Birthday' },
  floral: { label: 'Floral Cakes', shortLabel: 'Floral' },
  aesthetic: { label: 'Minimal & Aesthetic', shortLabel: 'Aesthetic' },
  theme: { label: 'Theme Cakes', shortLabel: 'Theme' },
  'special-occasion': { label: 'Special Occasion', shortLabel: 'Occasion' },
  funny: { label: 'Funny Cakes', shortLabel: 'Funny' },
  cookies: { label: 'Cookies & Treats', shortLabel: 'Cookies' },
  cheesecake: { label: 'Cheesecake', shortLabel: 'Cheesecake' }
};

export const FLAVOUR_LABELS = {
  chocolate: 'Chocolate',
  vanilla: 'Vanilla',
  'black forest': 'Black Forest',
  butterscotch: 'Butterscotch',
  strawberry: 'Strawberry',
  lemon: 'Lemon',
  orange: 'Orange',
  'red velvet': 'Red Velvet',
  blueberry: 'Blueberry',
  rashmalai: 'Rashmalai',
  pistachio: 'Pistachio',
  espresso: 'Espresso',
  mocha: 'Mocha'
};

export const PRICE_RANGE_LABELS = {
  'under-1000': 'Under ৳1,000',
  '1000-1999': '৳1,000 – ৳1,999',
  '2000-plus': 'Grand Tiers ৳2,000+',
  tba: 'Custom Quote (TBA)'
};

export const SIZE_RANGE_LABELS = {
  '1-pound': '1 Pound',
  '1.5-pound': '1.5 Pound',
  '2-pound': '2 Pound',
  '2.5-plus': '2.5+ lb / Tiered',
  'mini-treats': 'Mini & Treat Boxes'
};

export const CUSTOM_CAKE_SPECS = {
  sizeOrder: ['1 Pound', '1.5 Pound', '2 Pound', '2.5+ Pound / Tiered'],
  sizes: {
    '1 Pound': {
      shortWeight: '1 lb',
      tierLabel: 'Single Tier',
      shortTierLabel: '1 Tier',
      tierVariant: 'compact',
      servings: 'Serves 6–8 people',
      shortServings: 'Serves 6–8',
      dimensions: '6" round · Intimate gatherings',
      baseMin: 800,
      baseMax: 1000,
      isOpenEnded: false
    },
    '1.5 Pound': {
      shortWeight: '1.5 lb',
      tierLabel: 'Tall Single Tier',
      shortTierLabel: 'Tall Tier',
      tierVariant: 'tall',
      servings: 'Serves 10–12 people',
      shortServings: 'Serves 10–12',
      dimensions: '7" round · Family celebrations',
      baseMin: 1200,
      baseMax: 1500,
      isOpenEnded: false
    },
    '2 Pound': {
      shortWeight: '2 lb',
      tierLabel: 'Celebration Tier',
      shortTierLabel: 'Party Tier',
      tierVariant: 'wide',
      servings: 'Serves 14–16 people',
      shortServings: 'Serves 14–16',
      dimensions: '8" round or 2-tier petite',
      baseMin: 1700,
      baseMax: 2100,
      isOpenEnded: false
    },
    '2.5+ Pound / Tiered': {
      shortWeight: '2.5+ lb',
      tierLabel: 'Multi-Tier',
      shortTierLabel: 'Multi-Tier',
      tierVariant: 'tiered',
      servings: 'Serves 18–25+ people',
      shortServings: 'Serves 18–25+',
      dimensions: '2–3 tiers · Milestone events',
      baseMin: 2200,
      baseMax: null,
      isOpenEnded: true
    }
  },
  styles: {
    Birthday: {
      addMin: 0,
      addMax: 0,
      leadTime: '2–3 days notice',
      badge: 'Classic Celebration',
      motif: 'birthday'
    },
    Floral: {
      addMin: 100,
      addMax: 200,
      leadTime: '2–3 days notice',
      badge: 'Hand-Piped Florals',
      motif: 'floral'
    },
    'Minimal & Vintage': {
      addMin: 100,
      addMax: 200,
      leadTime: '2–3 days notice',
      badge: 'Lambeth & Aesthetic',
      motif: 'vintage'
    },
    'Theme / Character': {
      addMin: 200,
      addMax: 400,
      leadTime: '4–7 days notice',
      badge: 'Bespoke Toppers',
      motif: 'theme'
    },
    'Special Occasion': {
      addMin: 100,
      addMax: 250,
      leadTime: '3–5 days notice',
      badge: 'Milestone Finish',
      motif: 'occasion'
    }
  },
  flavors: {
    Chocolate: {
      addPrice: 0,
      body: '#5C3826',
      shade: '#432618',
      icing: '#8A573C',
      accent: '#E8C5A0'
    },
    Vanilla: {
      addPrice: 0,
      body: '#F8EEDB',
      shade: '#E6D3B3',
      icing: '#FFFDF8',
      accent: '#D99B52'
    },
    'Black Forest': {
      addPrice: 100,
      body: '#46261E',
      shade: '#2F1711',
      icing: '#FDF7F2',
      accent: '#B83244'
    },
    Butterscotch: {
      addPrice: 0,
      body: '#E5B97C',
      shade: '#C99049',
      icing: '#B87333',
      accent: '#F8E5C8'
    },
    Strawberry: {
      addPrice: 100,
      body: '#F4BAC4',
      shade: '#DE8E9D',
      icing: '#FFEBEF',
      accent: '#C84B5A'
    },
    'Red Velvet': {
      addPrice: 200,
      body: '#9E2A36',
      shade: '#741A24',
      icing: '#FBF5EC',
      accent: '#C64855'
    },
    Lemon: {
      addPrice: 100,
      body: '#F5DF85',
      shade: '#DEC053',
      icing: '#FFFBEB',
      accent: '#C79B1D'
    },
    Rashmalai: {
      addPrice: 100,
      body: '#F3DFAC',
      shade: '#D9BA74',
      icing: '#FFF9EA',
      accent: '#D88B2E'
    },
    Pistachio: {
      addPrice: 200,
      body: '#B8CE9C',
      shade: '#92AE72',
      icing: '#F2F8EA',
      accent: '#6C8A4E'
    }
  }
};
