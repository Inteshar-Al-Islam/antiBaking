# Frostoria — Artisan Bakery & Cake Showcase

> *"Freshly baked memories."*

A static showcase storefront for **Frostoria**, featuring custom birthday cakes, floral celebration cakes, minimal/aesthetic designs, theme centerpieces, and artisan treats with live search, category/flavour filtering, price sorting, a multi-photo lightbox modal, and one-click Facebook Messenger inquiries.

Live site: [https://frostoria.vercel.app](https://frostoria.vercel.app)

---

## Project Structure

```text
antiBaking/
├── index.html          # Page layout, filter drawer, gallery container, and lightbox modal
├── style.css           # Custom bakery styling, animations, and modal/grid layout
├── products.json       # Structured product catalog (all cakes & treats)
├── logo.jpg            # Brand logo and favicon
├── js/
│   ├── config.js       # Brand config, social links, and category display labels
│   ├── catalog.js      # JSON catalog loader, normalization, filtering, and sorting
│   ├── render.js       # Product grid rendering, error/empty states, and lightbox UI
│   ├── actions.js      # Sparkle effects, toast banner, clipboard copy, Messenger inquiry
│   └── main.js         # State management, DOM bindings, and event delegation
└── images/             # Optimized WebP photos grouped by category slug
    ├── aesthetic/
    ├── birthday/
    ├── cheesecake/
    ├── cookies/
    ├── floral/
    ├── funny/
    ├── special-occasion/
    └── theme/
```

---

## Running Locally

Because the site uses native ES Modules (`<script type="module">`) and fetches `products.json` over HTTP, it must be served through a local web server rather than opened directly via `file://`.

Using Python:

```bash
python -m http.server 8000
```

Or using Node.js:

```bash
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000) (or the port printed by `serve`) in your browser. You can also use the **Live Server** extension in VS Code.

---

## How to Add or Update a Cake

1. **Prepare the image**:
   - Resize the photo to a sensible web maximum (around `850px` on the longest side) and save it as `.webp`.
   - Use a lowercase, URL-safe kebab-case slug matching the cake name (no spaces or special characters) inside the matching category subfolder under `images/`, e.g.:
     `images/birthday/black-bow-coquette-ribbon-cake.webp`

2. **Add an entry to `products.json`**:
   Append a new object to the JSON array in `products.json`:

   ```json
   {
     "id": "prod-129",
     "name": "Example Berry Ribbon Cake",
     "featured": false,
     "category": "birthday",
     "flavor": "Chocolate",
     "size": "1 Pound",
     "price": 900,
     "imagePath": "images/birthday/example-berry-ribbon-cake.webp",
     "details": "Short handcrafted description shown in the detail lightbox."
   }
   ```

   **Field notes:**
   - `category`: Must be one of `birthday`, `floral`, `aesthetic`, `theme`, `special-occasion`, `funny`, `cookies`, or `cheesecake` (defined in `js/config.js` and `index.html`).
   - `price`: Integer amount in BDT (e.g. `900`, `1500`) or `null` to display `TBA`.
   - `images` *(optional)*: Array of WebP paths if the product has multiple gallery photos (the first item should match `imagePath`).

3. **Adding a new category or flavour filter** *(only if introducing a brand-new one)*:
   - Add the filter button in `index.html` (`data-category="..."` or `data-flavour="..."`).
   - For a new category, also add its `label` and `shortLabel` in `CATEGORY_META` inside `js/config.js` and create its folder under `images/<category>/`.

---

## Deployment

Changes are deployed as a static site to Vercel:

```bash
git add -A
git commit -m "Describe your update"
git push origin main
npx vercel --prod
```
