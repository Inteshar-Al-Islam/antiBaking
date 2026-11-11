/**
 * Frostoria - Artisan Bakery & Cake Showcase
 * Handcrafted Cakes, Real Products Catalog & Interactive Showcase
 */

// 1. Handcrafted Product Catalog (Curated with premier visual showpieces at the top)
const PRODUCTS = [
  {
    id: "prod-27",
    name: "Enchanted Floral Storybook Cake",
    featured: true,
    category: "floral",
    categoryLabel: "Floral Cakes",
    flavour: "Chocolate",
    size: "2.5 Pound",
    rawPrice: "2000",
    numericPrice: 2000,
    price: "\u09f32,000",
    imageSrc: encodeURI("resources/Floral cake/Floral book cake flavour_ chocolate size_ 2.5 pound price_ 2k.JPG"),
    details: "Meticulously carved to resemble an antique open book adorned with cascading wildflowers and gilded page trims. A majestic 2.5-pound chocolate masterpiece created for weddings, convocations, and milestone chapters."
  },
  {
    id: "prod-61",
    name: "Emerald Moon & Golden Butterfly Cake",
    featured: true,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "1000",
    numericPrice: 1000,
    price: "\u09f31,000",
    imageSrc: encodeURI("resources/Theme cake/Green half moon and butterfly cake flavour_ chocolate size_ 1 pound price_ 1k.JPG"),
    details: "A sculptural 3D crescent moon in delicate pistachio green, graced by an oversized hand-textured emerald butterfly, soft garden roses, and wild florets. Layered with rich chocolate truffle sponge and bathed in natural sunlight elegance."
  },
  {
    id: "prod-43",
    name: "Soft Pink & White Lambeth Vintage Cake",
    featured: true,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Soft pink and white vintage cake_flavour_ chocolate size_1 pound price_800 tk.JPG"),
    details: "Ornate Victorian Lambeth piping with intricate shell garlands, ruffles, and soft blush buttercream accents. Inside, moist chocolate truffle sponge layers ensure deep chocolate decadence."
  },
  {
    id: "prod-40",
    name: "Pink Drip 'Pookie' Vintage Cake",
    featured: true,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Pink dripping pookie cake_ flavour_ chocolate size_ 1 pound price_ 800 tk .JPG"),
    details: "Trending aesthetic Korean-style cake featuring luscious pink chocolate drip, vintage shell borders, and playful retro lettering. Rich cocoa sponge layers inside make it as delicious to eat as it is to photograph."
  },
  {
    id: "prod-28",
    name: "Wildflower Meadow Blossom Cake",
    featured: true,
    category: "floral",
    categoryLabel: "Floral Cakes",
    flavour: "Butterscotch",
    size: "1.5 Pound",
    rawPrice: "1500",
    numericPrice: 1500,
    price: "\u09f31,500",
    imageSrc: encodeURI("resources/Floral cake/Lots of flowers flavour_ butterscotch size_ 1.5 pound price_ 1500tk.JPG"),
    details: "An abundant tapestry of multicolored butter blossoms densely piped across the top in breathtaking harmony. Paired with aromatic butterscotch crunch sponge and golden brown sugar buttercream."
  },
  {
    id: "prod-44",
    name: "Two-Tier Cherry Vintage Cake",
    featured: true,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Black Forest",
    size: "1 Pound (Two Tier)",
    rawPrice: "1000",
    numericPrice: 1000,
    price: "\u09f31,000",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Two tier cherry cake_flavour_ Black Forest size_ 1 pound price_1k .JPG"),
    details: "Two-tier vintage piped cake crowned with bright ruby maraschino cherries, scalloped borders, and delicate frills. Authentic Black Forest sponge soaked in cherry syrup with whipped cream layers."
  },
  {
    id: "prod-2",
    name: "Black Bow Coquette Ribbon Cake",
    featured: true,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Birthday cake/Black bow ribbon cake_Flavour_chocolate size_1 pound Price_800Tk.JPG"),
    details: "A chic minimalist celebration cake featuring hand-tied noir ribbon bows gracefully draped across silky ivory frosting. Inside, moist chocolate sponge layers are generously filled with smooth chocolate buttercream."
  },
  {
    id: "prod-66",
    name: "Raiden Shogun Anime Buttercream Portrait Cake",
    featured: true,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "2 Pound",
    rawPrice: "2200",
    numericPrice: 2200,
    price: "\u09f32,200",
    imageSrc: encodeURI("resources/Theme cake/Raiden shogun buttercream art flavour_ chocolate size_ 2 pound price_ 2200tk.JPG"),
    details: "A masterwork of freehand buttercream portraiture depicting Genshin's Raiden Shogun with her electro blade and braided hair. Sized at 2 pounds with double chocolate truffle layers, an unforgettable centerpiece for anime lovers."
  },
  {
    id: "prod-57",
    name: "Bookworm Doll & Library Cake",
    featured: true,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "1000",
    numericPrice: 1000,
    price: "\u09f31,000",
    imageSrc: encodeURI("resources/Theme cake/Doll with books flavour_ chocolate size_ 1 pound price_ 1k.JPG"),
    details: "Delightful illustration of an avid reader doll surrounded by miniature stacked books and a warm tea mug. Layered with tender chocolate sponge and silky cocoa frosting for passionate readers."
  },
  {
    id: "prod-48",
    name: "Watermelon Cat Kawaii Cake",
    featured: true,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Strawberry",
    size: "1 Pound",
    rawPrice: "900",
    numericPrice: 900,
    price: "\u09f3900",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Watermelon cat_flavour_strawberry size_ 1 pound price_900tk.JPG"),
    details: "An adorable pastel illustration of a sleepy kitten cuddled up with a juicy slice of ripe watermelon. Fluffy strawberry sponge layered with strawberry fruit compote and light vanilla cream."
  },
  {
    id: "prod-69",
    name: "Starry Night Celestial Moon & Sun Cake",
    featured: true,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1.5 Pound",
    rawPrice: "1500",
    numericPrice: 1500,
    price: "\u09f31,500",
    imageSrc: encodeURI("resources/Theme cake/Starry night moonsun cake flavour_ chocolate size_ 1.5 pound price_ 1500tk.JPG"),
    details: "Swirling blues and yellows inspired by Van Gogh's masterpiece, uniting celestial sun and crescent moon motifs. Moist chocolate sponge layers filled with whipped chocolate cream for lovers of cosmic art."
  },
  {
    id: "prod-50",
    name: "Kath Golap & Morning Cha Cake",
    featured: true,
    category: "special-occasion",
    categoryLabel: "Special Occasion",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "1000",
    numericPrice: 1000,
    price: "\u09f31,000",
    imageSrc: encodeURI("resources/Special occasion cake/Kath golap with a cup of tea flavour_ chocolate size_ 1 pound price_1k.JPG"),
    details: "A poetic Bengali homage featuring hand-painted fragrant Kath Golap (Plumeria) blossoms beside a steaming cup of tea. Moist chocolate sponge with silky chocolate cream, evoking cozy rainy day addas."
  },
  {
    id: "prod-36",
    name: "Dainty Ribbon Bow Strawberry Cake",
    featured: true,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Strawberry",
    size: "1 Pound",
    rawPrice: "900",
    numericPrice: 900,
    price: "\u09f3900",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Cute bow on top flavour_ strawberry size_ 1 pound price_ 900tk .JPG"),
    details: "A pristine minimalist cake crowned with a single handcrafted pink ribbon bow and delicate pearl shell border. Soft strawberry chiffon sponge layered with strawberry compote and whipped cream."
  },
  {
    id: "prod-25",
    name: "Architectural Top-Forward Arch Cake",
    featured: true,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "900",
    numericPrice: 900,
    price: "\u09f3900",
    imageSrc: encodeURI("resources/Birthday cake/Top forward cake flavour_ chocolate size_ 1 pound price_ 900 tk.JPG"),
    details: "Modern sculptural cake standing vertically on its edge with a stunning floral archway showcased front and center. Packed with moist chocolate sponge and ganache, offering a striking profile from every angle."
  },
  {
    id: "prod-53",
    name: "Bengali Pitha Utshob Celebration Cake",
    featured: true,
    category: "special-occasion",
    categoryLabel: "Special Occasion",
    flavour: "Chocolate",
    size: "2 Pound",
    rawPrice: "1800",
    numericPrice: 1800,
    price: "\u09f31,800",
    imageSrc: encodeURI("resources/Special occasion cake/Pitha festival cake flavour_chocolate size_ 2 pound price_1800tk .JPG"),
    details: "A unique cultural centerpiece celebrating winter Pitha festivals with sculpted edible sweets atop an artisan tier. Grand 2-pound size baked with dark chocolate sponge and rich cocoa filling for family feasts."
  },
  {
    id: "prod-24",
    name: "Cuddly Teddy Bear Birthday Cake",
    featured: true,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1.5 Pound",
    rawPrice: "1200",
    numericPrice: 1200,
    price: "\u09f31,200",
    imageSrc: encodeURI("resources/Birthday cake/Teddy cake flavour_ chocolate size_ 1.5 pound price_1200Tk.JPG"),
    details: "Heartwarming three-dimensional teddy bear piped in textured buttercream with tiny celebration party hat accents. Built on 1.5 pounds of moist chocolate fudge sponge, guaranteed to be adored by toddlers."
  },
  {
    id: "prod-29",
    name: "Royal Orchid & Salted Caramel Cake",
    featured: true,
    category: "floral",
    categoryLabel: "Floral Cakes",
    flavour: "Chocolate",
    size: "1.5 Pound",
    rawPrice: "1500",
    numericPrice: 1500,
    price: "\u09f31,500",
    imageSrc: encodeURI("resources/Floral cake/Orchid flower cake flavour_ chocolate caramel size_ 1.5 pound price_ 1500tk.JPG"),
    details: "Featuring graceful hand-sculpted orchid petals resting against a softly textured ivory tier. Infused with rich cocoa sponge and house-made salted caramel filling for an exquisite harmony of flavors."
  },
  {
    id: "prod-64",
    name: "Traditional Mukhe Bhaat Ceremony Cake",
    featured: true,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "1500",
    numericPrice: 1500,
    price: "\u09f31,500",
    imageSrc: encodeURI("resources/Theme cake/Mukhe vhaat flavour_ chocolate cake size_ 1 pound price_1500tk.JPG"),
    details: "Special cultural celebration cake commemorating baby's first rice ceremony, decorated with sacred alpana motifs. Moist chocolate sponge with rich chocolate buttercream to mark this auspicious milestone."
  },
  {
    id: "prod-23",
    name: "Bright Sunflower Sunshine Cake",
    featured: true,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Lemon",
    size: "1 Pound",
    rawPrice: "900",
    numericPrice: 900,
    price: "\u09f3900",
    imageSrc: encodeURI("resources/Birthday cake/Sunflower cake.JPG flavour_ lemon size_ 1 pound price_ 900 tk.jpg"),
    details: "Radiant golden sunflower petals piped with dark chocolate seed centers, bringing vibrant warmth to the table. Baked with fresh lemon zest infused sponge layered with silky citrus buttercream."
  },
  {
    id: "prod-51",
    name: "Heartbeat Scarlet Romance Cake",
    featured: true,
    category: "special-occasion",
    categoryLabel: "Special Occasion",
    flavour: "Chocolate",
    size: "2 Pound",
    rawPrice: "1600",
    numericPrice: 1600,
    price: "\u09f31,600",
    imageSrc: encodeURI("resources/Special occasion cake/Middle red love flavour_ chocolate size_ 2 pound price_1600 tk.JPG"),
    details: "A vibrant crimson heart framed by elegant pearl borders and passionate anniversary accents. Substantial 2-pound capacity with dark chocolate ganache and cocoa sponge, ideal for proposals and anniversaries."
  },
  {
    id: "prod-26",
    name: "Biyebari Grand Floral Celebration Cake",
    featured: true,
    category: "floral",
    categoryLabel: "Floral Cakes",
    flavour: "Chocolate",
    size: "2 Pound",
    rawPrice: "1800",
    numericPrice: 1800,
    price: "\u09f31,800",
    imageSrc: encodeURI("resources/Floral cake/Biyebari floral cakes flavour _ chocolate size_2 pound price_1800tk.JPG"),
    details: "Inspired by the exuberant floral splendor of traditional Bengali wedding stages, crowned with cascading sugar blossoms. A magnificent 2-pound centerpiece with double chocolate sponge and rich cocoa ganache."
  },
  {
    id: "prod-1",
    name: "Brown Button Chocolate Chip Cookies",
    featured: false,
    category: "cookies",
    categoryLabel: "Cookies & Treats",
    flavour: "Chocolate",
    size: "Freshly Baked",
    rawPrice: "80",
    numericPrice: 80,
    price: "\u09f380",
    imageSrc: encodeURI("resources/Brown button chocolate chips cookies price 80 taka .JPG"),
    details: "Freshly baked to golden perfection using browned French dairy butter and overflowing with decadent Belgian chocolate buttons. Crisp caramelized edges give way to a chewy, melt-in-your-mouth center."
  },
  {
    id: "prod-3",
    name: "Artisan Oil Painting Canvas Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Birthday cake/Canvas cake flavour_chocolate size_ 1 pound Price_ 800Tk.JPG"),
    details: "Designed like an impressionist fine art canvas with textured palette knife strokes in serene pastel shades. Decadent cocoa sponge layered with whipped chocolate cream makes this as delightful to eat as it is to admire."
  },
  {
    id: "prod-4",
    name: "Cars & Fluffy Clouds Birthday Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1.5 Pound",
    rawPrice: "1200",
    numericPrice: 1200,
    price: "\u09f31,200",
    imageSrc: encodeURI("resources/Birthday cake/Cars and cloud .JPG Flavour_ chocolate size_ 1.5 pound price_ 1200Tk.JPG"),
    details: "Fluffy hand-piped buttercream clouds drifting against gentle blue skies with vibrant sports cars cruising along the base. Generously sized at 1.5 pounds with moist chocolate cake layers that kids and parents will love."
  },
  {
    id: "prod-5",
    name: "Cool Guy in Sunglasses Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Birthday cake/Cool guy with sunglasses Flavour_ chocolate size_ 1 pound price_ 800Tk.JPG"),
    details: "Radiates effortless swagger with an expressive illustrated cartoon dude rocking dark shades. Layered with soft chocolate sponge and luscious chocolate buttercream, perfect for best friends and brothers."
  },
  {
    id: "prod-6",
    name: "Colourful Floral Moon Cake (Azure Blue)",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Vanilla",
    size: "1.5 Pound",
    rawPrice: "1100",
    numericPrice: 1100,
    price: "\u09f31,100",
    imageSrc: encodeURI("resources/Birthday cake/Flower like a colourful moon cake (blue) Flavour_ vanila  size_ 1.5 pound price_1100Tk.JPG"),
    details: "A celestial crescent garland of delicate baby blue, lilac, and buttercup blossoms encircling half the cake. Baked with fragrant vanilla bean sponge and velvety vanilla cream frosting for a light, dreamy bite."
  },
  {
    id: "prod-7",
    name: "Colourful Floral Moon Cake (Blush Pink)",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1.5 Pound",
    rawPrice: "1300",
    numericPrice: 1300,
    price: "\u09f31,300",
    imageSrc: encodeURI("resources/Birthday cake/Flowers like colourful moon cake (pink) flavour_ chocolate  size_ 1.5 pound price_1300Tk.JPG"),
    details: "Romantic crescent arrangement of hand-piped pink rosettes, buds, and delicate foliage curving across the surface. Underneath is a rich chocolate sponge brushed with cocoa syrup and layered with chocolate ganache."
  },
  {
    id: "prod-8",
    name: "Freehand Vintage Car Sketch Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "900",
    numericPrice: 900,
    price: "\u09f3900",
    imageSrc: encodeURI("resources/Birthday cake/Free hand car art Flavour_ chocolate size_ 1 pound Price_900 tk.JPG"),
    details: "Showcasing bespoke freehand automobile line art sketched directly in chocolate buttercream over a silky cream canvas. Tender chocolate sponge layers make it an unforgettable tribute for car enthusiasts."
  },
  {
    id: "prod-9",
    name: "Friendly Green Dragon Birthday Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Birthday cake/Green dragon flavour_ chocolate. Size_ 1 Pound Price 800Tk.JPG"),
    details: "An adorable piped green dragon complete with cute scales, playful horns, and friendly cartoon eyes. Soft chocolate cake crumb layered with light cocoa frosting makes this a fantasy treat for birthday boys and girls."
  },
  {
    id: "prod-10",
    name: "Warm Embrace Holding Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Birthday cake/Holding cake Flavour_ chocolate size_ 1 pound price_800tk.JPG"),
    details: "Artistic minimalist line drawing of hands gently cradling a birthday cake with an emotional warmth that speaks for itself. Layered with moist chocolate sponge and silky smooth buttercream."
  },
  {
    id: "prod-11",
    name: "Citrus Zest & Botanical Green Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Birthday cake/Lemon and green flavour_ chocolate size_ 1 pound price_ 800tk.JPG"),
    details: "Earthy sage greens meet bright lemon-yellow palette strokes for a breezy, contemporary garden vibe. Filled with luscious chocolate sponge and smooth buttercream for rich cocoa satisfaction."
  },
  {
    id: "prod-12",
    name: "Flying With Balloons Storybook Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "2 Pound",
    rawPrice: "1700",
    numericPrice: 1700,
    price: "\u09f31,700",
    imageSrc: encodeURI("resources/Birthday cake/Little girls fly with ballon Flavour_ chocolate size_ 2 pound price_1700tk.JPG"),
    details: "A dreamy storybook illustration of young girls lifted high by a colorful cluster of floating balloons. Sized at a grand 2 pounds with double chocolate sponge layers, crafted for memorable family gatherings."
  },
  {
    id: "prod-13",
    name: "Petite Red Beetle Birthday Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Vanilla",
    size: "1 Pound",
    rawPrice: "700",
    numericPrice: 700,
    price: "\u09f3700",
    imageSrc: encodeURI("resources/Birthday cake/Mini car cake flavour_ vanilla size_ 1 pound price_700tk.JPG"),
    details: "Cute cartoon red car merrily cruising across sweet snowy vanilla frosting with tiny piped road accents. Fluffy, melt-in-your-mouth vanilla chiffon sponge layered with whipped dairy cream."
  },
  {
    id: "prod-14",
    name: "Mini White Daisy Meadow Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Birthday cake/Mini white flowers flavour_ chocolate size_ 1 pound price_ 800 Tk.JPG"),
    details: "Sprinkled with delicate white daisy florets and golden pistil centers over smooth bakery frosting. The moist chocolate sponge core is paired with cocoa filling for an effortless, charming birthday cake."
  },
  {
    id: "prod-15",
    name: "Midnight Skies & Dream Clouds Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1.5 Pound",
    rawPrice: "1200",
    numericPrice: 1200,
    price: "\u09f31,200",
    imageSrc: encodeURI("resources/Birthday cake/Night and cloudy Flavour_ chocolate size_ 1.5 pound price_ 1200Tk.JPG"),
    details: "Atmospheric midnight navy shades blended with sculpted white cumulus clouds and starlight gold flecks. Built with 1.5 pounds of dark chocolate sponge and rich cocoa ganache for late-night celebrations."
  },
  {
    id: "prod-16",
    name: "Olive Wreath Botanical Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1.5 Pound",
    rawPrice: "1200",
    numericPrice: 1200,
    price: "\u09f31,200",
    imageSrc: encodeURI("resources/Birthday cake/Olive floral cake flavour_ chocolate size_ 1.5 pound price_ 1200Tk.JPG"),
    details: "Subtle olive and eucalyptus greens arranged in textured palette-knife florals with delicate cream highlights. Beneath its organic aesthetic lies deep chocolate sponge layered with smooth chocolate frosting."
  },
  {
    id: "prod-17",
    name: "Pink Ribbon Coquette Birthday Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Birthday cake/Pink bow ribbon cake flavour_ chocolate size_ 1 pound price_800tk.JPG"),
    details: "Delicate pastel pink sugar ribbons draped gracefully across the top with vintage beaded shell borders. Tender chocolate sponge filled with velvety chocolate cream makes this a birthday favorite."
  },
  {
    id: "prod-18",
    name: "Pink Butterfly Whimsy Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "900",
    numericPrice: 900,
    price: "\u09f3900",
    imageSrc: encodeURI("resources/Birthday cake/Pink butterfly cake flavour_ chocolate size_ 1 pound price_ 900 tk.JPG"),
    details: "Lifelike sugarcraft pink butterflies resting upon creamy rosettes and shimmering candy pearls. Rich chocolate sponge and smooth buttercream provide a heavenly melt-in-the-mouth texture."
  },
  {
    id: "prod-19",
    name: "Crimson & Ivory Palette Knife Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Birthday cake/Red and white palate knife cake flavour_ chocolate size_ 1 pound price_ 800tk.JPG"),
    details: "Bold crimson red and pure white painterly strokes swept across a silky smooth backdrop like modern gallery art. Filled with moist chocolate sponge and rich cocoa cream for refined birthday indulgence."
  },
  {
    id: "prod-20",
    name: "Vintage Red Bicycle Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Birthday cake/Red bike flavour_ chocolate size_ 1 pound price_800tk.JPG"),
    details: "A nostalgic retro red cruiser bicycle hand-piped with charming basket details over smooth ivory frosting. Moist chocolate cake inside offers comforting cocoa richness for bike lovers of all ages."
  },
  {
    id: "prod-21",
    name: "Scarlet Ribbon Bow Celebration Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Birthday cake/Red bow ribbon cake flavour_ chocolate size_ 1 pound price_ 800tk.JPG"),
    details: "Striking scarlet red ribbons hand-tied over snowy ruffled buttercream borders for high-contrast drama. Delicious chocolate sponge layered with cocoa ganache ensures every slice is rich and memorable."
  },
  {
    id: "prod-22",
    name: "English Rose Garden Birthday Cake",
    featured: false,
    category: "birthday",
    categoryLabel: "Birthday Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "900",
    numericPrice: 900,
    price: "\u09f3900",
    imageSrc: encodeURI("resources/Birthday cake/Rose cake flavour_ chocolate size_ 1 pound price_ 900tk.JPG"),
    details: "Blooming hand-piped pink and crimson English roses nestled atop delicately textured buttercream swirls. Features decadent chocolate sponge with chocolate cream that melts luxuriously on the palate."
  },
  {
    id: "prod-30",
    name: "Pink Floral & Butterfly Dream Cake",
    featured: false,
    category: "floral",
    categoryLabel: "Floral Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Floral cake/Pink floral cake with butterfly flavour_ chocolate  size_ 1 pound price_800tk.JPG"),
    details: "Lush blush-pink piped florals paired with a shimmering sugar butterfly alighting on a pristine cream tier. Light chocolate sponge layered with smooth chocolate frosting creates an irresistible slice."
  },
  {
    id: "prod-31",
    name: "Tiny Pink Blossom Garland Cake",
    featured: false,
    category: "floral",
    categoryLabel: "Floral Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Floral cake/Tiny Pink flowers cake flavour_ chocolate size_ 1 pound price_ 800 Tk.JPG"),
    details: "A tender wreath of miniature pink florets and soft green sprigs encircling the rim of a silky frosted cake. Fluffy chocolate sponge inside keeps each forkful moist, light, and wonderfully satisfying."
  },
  {
    id: "prod-32",
    name: "Two-Tier Petite Butterscotch Floral Cake",
    featured: false,
    category: "floral",
    categoryLabel: "Floral Cakes",
    flavour: "Butterscotch",
    size: "1 Pound (Two Tier)",
    rawPrice: "900",
    numericPrice: 900,
    price: "\u09f3900",
    imageSrc: encodeURI("resources/Floral cake/Two tier floral cake flavour_ butterscotch size_ 1 pound price_900Tk.JPG"),
    details: "An exquisite stacked two-tier miniature cake embellished with delicate floral piping and golden sugar beads. Layered with butterscotch praline sponge, bringing grand tiered elegance to smaller celebrations."
  },
  {
    id: "prod-33",
    name: "Playful Emoji Meme Bento Cake",
    featured: false,
    category: "funny",
    categoryLabel: "Funny Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Funny cake/Funny cake flavour_ chocolate size_ 1 pound price_ 800Tk.JPG"),
    details: "A witty, lighthearted cake featuring a hilarious meme expression that breaks the ice at any birthday party. Underneath the comedy is moist chocolate sponge with cocoa frosting, delivering top-tier laughter and taste."
  },
  {
    id: "prod-34",
    name: "Derpy Smile Celebration Meme Cake",
    featured: false,
    category: "funny",
    categoryLabel: "Funny Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Funny cake/Funny cake flavour_chocolate size_1 pound price_800 tk.JPG"),
    details: "Hilariously goofy smiling character drawn in expressive black buttercream on a bright pastel background. Baked with rich dark chocolate sponge and smooth buttercream filling for guaranteed laughs."
  },
  {
    id: "prod-35",
    name: "Silly Face Expression Bento Cake",
    featured: false,
    category: "funny",
    categoryLabel: "Funny Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Funny cake/Funny face flavour_ chocolate size_ 1 pound price_ 800 tk.JPG"),
    details: "An unforgettable hand-piped silly cartoon face designed to have everyone laughing and snapping photos instantly. Delicious chocolate sponge layered with smooth chocolate ganache ensures the cake tastes as great as it looks."
  },
  {
    id: "prod-37",
    name: "Sculpted Floral Bouquet Gift Cake",
    featured: false,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Chocolate",
    size: "1.5 Pound",
    rawPrice: "1200",
    numericPrice: 1200,
    price: "\u09f31,200",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Flower bouquet cake flavour_ chocolate size_ 1.5 pound price_ 1200Tk .JPG"),
    details: "Artfully sculpted to look like a fresh posy of hand-tied flowers wrapped in bakery parchment with blooming buds. Filled with luscious chocolate sponge and chocolate buttercream, doubling as flowers and dessert."
  },
  {
    id: "prod-38",
    name: "Melting Ice Cream Cone Bento Mini",
    featured: false,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Chocolate",
    size: "Mini Cake",
    rawPrice: "150",
    numericPrice: 150,
    price: "\u09f3150",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Ice cream cone cake flavour_ chocolate size_ mini cake price_150 tk .JPG"),
    details: "An adorable mini bento treat topped with an inverted waffle cone and dripping chocolate ice cream illusion. Perfect for single servings or cute party favors, packed with rich chocolate sponge."
  },
  {
    id: "prod-39",
    name: "Oval Rose Wreath Aesthetic Cake",
    featured: false,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Oval rose bouquet flavour_ chocolate size_ 1 pound price_ 800tk .JPG"),
    details: "An elegant oval silhouette framed with a delicate wreath of hand-piped blush and ivory rose blossoms. Soft chocolate velvet sponge with whipped cocoa cream provides a sophisticated dessert experience."
  },
  {
    id: "prod-41",
    name: "Ruby Velvet Bow Aesthetic Cake",
    featured: false,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "900",
    numericPrice: 900,
    price: "\u09f3900",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Red bow_flavour_ chocolate size_1 pound price_900 tk.JPG"),
    details: "Pure minimalist elegance featuring an understated snowy white tier accented by a single sculpted scarlet ribbon bow. Rich dark chocolate sponge inside gives an intense, luxurious cocoa note."
  },
  {
    id: "prod-42",
    name: "Petite Posy Wildflower Cake",
    featured: false,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Simple tiny bouquet cakes_flavour_ chocolate size_ 1 pound price_ 800 tk.JPG"),
    details: "A sweet, gentle design showcasing a tiny hand-piped bundle of pastel meadow flowers bound by sugar twine. Moist chocolate sponge with whipped chocolate buttercream provides quiet, refined luxury."
  },
  {
    id: "prod-45",
    name: "Vintage Orange Blossom Cake",
    featured: false,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Orange",
    size: "1 Pound",
    rawPrice: "1000",
    numericPrice: 1000,
    price: "\u09f31,000",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Vintage floral cake_flavour_ orange size_ 1 pound price_ 1000tk .JPG"),
    details: "Detailed retro piping in warm apricot and cream tones with botanical scrollwork reminiscent of antique teaware. Aromatic orange sponge infused with citrus syrup and layered with orange cream."
  },
  {
    id: "prod-46",
    name: "Periwinkle Blue Vintage Cake",
    featured: false,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Vintage in shade of blue_flavour_ chocolate size_ 1 pound price_ 800tk .JPG"),
    details: "Finished in dreamy powder blue with intricate French piping swags, shell frills, and delicate pearl drops. Rich chocolate sponge layered with cocoa ganache gives a delicious contrast to the cool exterior."
  },
  {
    id: "prod-47",
    name: "Grand Victorian Ruffled Vintage Cake",
    featured: false,
    category: "aesthetic",
    categoryLabel: "Minimal & Aesthetic",
    flavour: "Chocolate",
    size: "1.5 Pound",
    rawPrice: "1400",
    numericPrice: 1400,
    price: "\u09f31,400",
    imageSrc: encodeURI("resources/Minimal & Aesthetic cakes/Vintage_flavour_ chocolate size_1.5 pound price_1400tk .JPG"),
    details: "Heavily draped in elaborate Victorian piping swags, shell cornices, and elegant scrolled garlands. Sized at 1.5 pounds with dense chocolate cake layers, embodying timeless vintage romance."
  },
  {
    id: "prod-49",
    name: "Regal Black & White Tiara Crown Cake",
    featured: false,
    category: "special-occasion",
    categoryLabel: "Special Occasion",
    flavour: "Chocolate",
    size: "1.5 Pound",
    rawPrice: "1200",
    numericPrice: 1200,
    price: "\u09f31,200",
    imageSrc: encodeURI("resources/Special occasion cake/Black and white crown cake_flavour_ chocolate size_ 1.5 pound price_1200tk.JPG"),
    details: "Crowned with a sparkling tiara against a monochromatic backdrop of dramatic black and ivory piping. Built with 1.5 pounds of moist chocolate fudge cake, fitting for kings, queens, and milestone birthdays."
  },
  {
    id: "prod-54",
    name: "Dhaka to Kuala Lumpur Farewell Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Theme cake/Bangladesh to Malaysia flavour_ chocolate size_ 1 pound price_ 800 tk.JPG"),
    details: "An emotional long-distance departure cake mapping a scenic flight trail from Bangladesh to Malaysia. Filled with rich chocolate sponge and cocoa cream to sweeten bittersweet farewells."
  },
  {
    id: "prod-55",
    name: "Blackpink 'Born Pink' K-Pop Theme Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "1100",
    numericPrice: 1100,
    price: "\u09f31,100",
    imageSrc: encodeURI("resources/Theme cake/Black pink cake flavour_ chocolate size_ 1 pound price_ 1100 tk.JPG"),
    details: "Bold dark chocolate frosting paired with vibrant pink drip and signature K-Pop styling for true BLINKs. Layers of dark chocolate sponge with berry-infused chocolate filling."
  },
  {
    id: "prod-56",
    name: "Midnight Witch & Potion Bottle Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "1200",
    numericPrice: 1200,
    price: "\u09f31,200",
    imageSrc: encodeURI("resources/Theme cake/Black witch with bottle flavour_ chocolate size_ 1 pound price_ 1200tk.JPG"),
    details: "Gothic fantasy artwork depicting a stylish witch brewing starry magical potions under moonlight. Moist cocoa sponge layered with rich dark chocolate ganache for bewitching celebrations."
  },
  {
    id: "prod-58",
    name: "Football Championship Match Day Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "2 Pound",
    rawPrice: "1800",
    numericPrice: 1800,
    price: "\u09f31,800",
    imageSrc: encodeURI("resources/Theme cake/Football theme flavour_ chocolate size_ 2 pound price 1800tk .JPG"),
    details: "Vibrant emerald grass turf piping complete with goal lines, football details, and victory crests. Substantial 2-pound double chocolate mud cake to fuel the entire squad on match day."
  },
  {
    id: "prod-59",
    name: "Pastel Balloon Dreams Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "1000",
    numericPrice: 1000,
    price: "\u09f31,000",
    imageSrc: encodeURI("resources/Theme cake/Girls with balloons flavour_ chocolate size_ 1 pound price_ 1k.JPG"),
    details: "Gentle illustration of young girls carried away by a giant bunch of shimmering pastel balloons. Soft chocolate sponge layers with whipped chocolate buttercream to celebrate youthful dreams."
  },
  {
    id: "prod-60",
    name: "Convocation Honors Graduation Mud Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "2000",
    numericPrice: 2000,
    price: "\u09f32,000",
    imageSrc: encodeURI("resources/Theme cake/Graduation cake flavour_ chocolate mud cake size_ 1 pound price_2k.JPG"),
    details: "Topped with an elegant handcrafted graduation cap, golden tassel, and rolled certificate scroll. Rich, dense chocolate mud cake with fudgy ganache, crafted for convocation triumphs."
  },
  {
    id: "prod-62",
    name: "Baby Girl's Pink Shoes Keepsake Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "900",
    numericPrice: 900,
    price: "\u09f3900",
    imageSrc: encodeURI("resources/Theme cake/Little girls pair of shoes flavour_ chocolate size_1pound price_ 900tk.JPG"),
    details: "Sweetly piped pair of tiny pink baby shoes with delicate ribbon bows and floral borders. Soft chocolate sponge layered with smooth chocolate frosting, perfect for first birthdays and baby showers."
  },
  {
    id: "prod-63",
    name: "Five Little Yellow Ducklings Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Theme cake/Mini five ducks flavour_ chocolate size_ 1 pound price_ 800 tk.JPG"),
    details: "Five cheerful sunny-yellow ducklings swimming peacefully along a bright blue ripple-textured pond. Moist chocolate sponge with milk chocolate buttercream, guaranteed to delight little toddlers."
  },
  {
    id: "prod-65",
    name: "PUBG Battleground Gaming Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "1500",
    numericPrice: 1500,
    price: "\u09f31,500",
    imageSrc: encodeURI("resources/Theme cake/Pubg theme cake flavour_ chocolate size_ 1 pound price_1500tk JPG.jpg"),
    details: "Action-packed gaming cake featuring iconic PUBG airdrop crate, helmet details, and battleground motifs. Packed with dense chocolate truffle cake and rich ganache to celebrate game night victories."
  },
  {
    id: "prod-67",
    name: "Tropical Sea Beach & Sandy Shores Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Vanilla",
    size: "1 Pound",
    rawPrice: "800",
    numericPrice: 800,
    price: "\u09f3800",
    imageSrc: encodeURI("resources/Theme cake/Sea beach cake. Flavour_ vanilla size_ 1 pound price _ 800tkJPG.jpg"),
    details: "Piped turquoise ocean waves crashing onto realistic biscuit 'sand' with tiny seashells and beach parasols. Fluffy vanilla sponge soaked in light vanilla syrup and filled with whipped fresh cream."
  },
  {
    id: "prod-68",
    name: "Vintage Sewing Machine Artisan Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "2 Pound",
    rawPrice: "1700",
    numericPrice: 1700,
    price: "\u09f31,700",
    imageSrc: encodeURI("resources/Theme cake/Sewing machine  flavour_ chocolate size_ 2 pound protein 1700 tk.JPG"),
    details: "Handcrafted tribute featuring a vintage Singer-style sewing machine with spool, needle, and stitched measuring tape details. Substantial 2-pound chocolate sponge with velvety ganache, honoring gifted creators."
  },
  {
    id: "prod-70",
    name: "Fresh Strawberry & Black Forest Gateau",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Black Forest",
    size: "1 Pound",
    rawPrice: "1000",
    numericPrice: 1000,
    price: "\u09f31,000",
    imageSrc: encodeURI("resources/Theme cake/Strawberry cake flavour_ Black Forest size_ 1 pound price_ 10tkJPG.jpg"),
    details: "Dark cocoa sponge infused with sour cherry syrup, crowned with fresh crimson strawberries and dark chocolate curls. Light whipped cream frosting provides the classic balance to deep chocolate sponge."
  },
  {
    id: "prod-71",
    name: "The Holy & The Hole Custom Concept Cake",
    featured: false,
    category: "theme",
    categoryLabel: "Theme Cakes",
    flavour: "Chocolate",
    size: "1 Pound",
    rawPrice: "1200",
    numericPrice: 1200,
    price: "\u09f31,200",
    imageSrc: encodeURI("resources/Theme cake/The holy and the hole flavour_ chocolate size _ 1 pound price_ 1200 tk.JPG"),
    details: "A bold conceptual centerpiece designed with sculptural hollowed geometry and mystical golden halo accents. Rich Belgian chocolate sponge layered with smooth chocolate ganache, crafted for truly bespoke themed celebrations."
  }
];

// 2. Bakery Brand Configuration
const CONFIG = {
  currencySymbol: '৳',
  brandName: 'Frostoria',
  tagline: 'Freshly baked memories.',
  socialLinks: {
    facebook: 'https://www.facebook.com/share/1HkyGvf5Se/',
    messenger: 'https://m.me/delightsbysuraiya',
    instagram: 'https://www.instagram.com/frostoria_cakes?obrf=MXB4eWhvaWpqaGlhdg=='
  }
};

// 3. Application State Management
let products = [...PRODUCTS];
let currentFilteredProducts = [...products];
let currentLightboxIndex = -1;
let activeCategory = 'all';
let activeFlavour = 'all';
let searchQuery = '';
let activeSort = 'featured';

// 4. Cached DOM Elements
const elements = {
  productGrid: document.getElementById('productGrid'),
  itemCount: document.getElementById('itemCount'),
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

  // Toast
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toastMessage')
};

// Helper for short category names on compact mobile cards
function getShortCategoryLabel(category, label) {
  const map = {
    'birthday': 'Birthday',
    'floral': 'Floral',
    'aesthetic': 'Aesthetic',
    'theme': 'Theme',
    'special-occasion': 'Occasion',
    'funny': 'Funny',
    'cookies': 'Cookies'
  };
  return map[category] || label.replace(/\s*Cakes?|\s*&\s*Treats?/gi, '').trim() || label;
}

// 5. Render Product Showcase Cards
function renderProductGrid() {
  if (!elements.productGrid) return;

  const query = searchQuery.toLowerCase().trim();

  // Filter products by active category, flavour, and search terms
  currentFilteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;

    let matchesFlavour = true;
    if (activeFlavour !== 'all') {
      const pFlavour = (product.flavour || '').toLowerCase();
      if (activeFlavour === 'butterscotch') {
        matchesFlavour = pFlavour.includes('butterscotch') || pFlavour.includes('caramel');
      } else {
        matchesFlavour = pFlavour.includes(activeFlavour.toLowerCase());
      }
    }

    const matchesSearch = !query ||
      product.name.toLowerCase().includes(query) ||
      product.categoryLabel.toLowerCase().includes(query) ||
      product.flavour.toLowerCase().includes(query) ||
      product.size.toLowerCase().includes(query) ||
      product.details.toLowerCase().includes(query) ||
      product.price.toLowerCase().includes(query);

    return matchesCategory && matchesFlavour && matchesSearch;
  });

  // Sort products based on user selection
  if (activeSort === 'price-low') {
    currentFilteredProducts.sort((a, b) => a.numericPrice - b.numericPrice);
  } else if (activeSort === 'price-high') {
    currentFilteredProducts.sort((a, b) => b.numericPrice - a.numericPrice);
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

  // Update live item counter
  if (elements.itemCount) {
    const count = currentFilteredProducts.length;
    elements.itemCount.textContent = `${count} ${count === 1 ? 'Creation' : 'Creations'} Available`;
  }

  // Toggle Empty State view
  if (currentFilteredProducts.length === 0) {
    elements.productGrid.innerHTML = '';
    elements.emptyState?.classList.remove('hidden');
    return;
  } else {
    elements.emptyState?.classList.add('hidden');
  }

  // Render responsive product cards
  elements.productGrid.innerHTML = currentFilteredProducts.map((product, index) => {
    const shortCategory = getShortCategoryLabel(product.category, product.categoryLabel);
    return `
      <article 
        class="product-card group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#EFE8E1] cursor-pointer flex flex-col"
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
            onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\' viewBox=\'0 0 400 400\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23F5ECE3\'/ %3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%236E4E37\' font-family=\'sans-serif\' font-size=\'18\'%3E🎂 ${product.name}%3C/text%3E%3C/svg%3E';"
          />
          
          <!-- Top Badges Flex Bar: Prevents Collisions on Mobile -->
          <div class="absolute top-1.5 inset-x-1.5 sm:top-3 sm:inset-x-3 flex items-center justify-between gap-1 pointer-events-none z-10">
            <!-- Category Badge (Short on mobile, Full on desktop) -->
            <span class="pointer-events-auto px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-xs font-medium tracking-wide bg-white/95 backdrop-blur-xs text-[#6E4E37] rounded-full border border-[#EFE8E1] shadow-xs truncate shrink">
              <span class="sm:hidden">${shortCategory}</span>
              <span class="hidden sm:inline">${product.categoryLabel}</span>
            </span>

            <!-- Featured Best-Seller Badge (Compact on mobile) -->
            ${product.featured ? `
              <span class="pointer-events-auto shrink-0 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-xs font-semibold tracking-wide bg-[#B87333] text-white rounded-full shadow-xs flex items-center gap-0.5 sm:gap-1">
                <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-200 fill-current shrink-0" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span>Featured</span>
              </span>
            ` : ''}
          </div>

          <!-- Hover View Indicator -->
          <div class="absolute inset-0 bg-[#26180F]/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
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
              <h3 class="font-serif text-xs sm:text-lg font-medium text-[#26180F] line-clamp-2 sm:line-clamp-1 group-hover:text-[#B87333] transition-colors leading-snug sm:leading-normal" title="${product.name}">
                ${product.name}
              </h3>
              <span class="shrink-0 self-start sm:self-auto inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#FAF7F2] text-[#6E4E37] font-bold sm:font-semibold text-xs sm:text-sm rounded-md sm:rounded-lg border border-[#EFE8E1]">
                ${product.price}
              </span>
            </div>
          </div>

          <!-- Bottom Row: Flavour & Size Pills -->
          <div class="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-2 sm:mt-2.5 text-xs text-[#73655A]">
            <span class="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EFE8E1] text-[10px] sm:text-[11px] font-medium text-[#6E4E37] whitespace-nowrap">
              ${product.flavour}
            </span>
            <span class="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EFE8E1] text-[10px] sm:text-[11px] text-[#73655A] whitespace-nowrap">
              ${product.size}
            </span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// 6. Lightbox Modal Controls
function openLightbox(index) {
  if (index < 0 || index >= currentFilteredProducts.length) return;
  currentLightboxIndex = index;
  const product = currentFilteredProducts[currentLightboxIndex];

  elements.lightboxImg.src = product.imageSrc;
  elements.lightboxImg.alt = product.name;
  elements.lightboxTitle.textContent = product.name;
  elements.lightboxPrice.textContent = product.price;
  elements.lightboxCategory.textContent = product.categoryLabel;
  if (elements.lightboxFlavour) elements.lightboxFlavour.textContent = product.flavour;
  if (elements.lightboxSize) elements.lightboxSize.textContent = product.size;
  elements.lightboxDetails.textContent = product.details;

  // Open modal window
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

// Inquire / Order via Facebook Messenger
function handleInquiry() {
  if (currentLightboxIndex < 0) return;
  const product = currentFilteredProducts[currentLightboxIndex];
  const orderMessage = `Hello Frostoria! I would like to inquire about ordering "${product.name}" (${product.flavour}, ${product.size}, ${product.price}).`;

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
function copyProductDetails() {
  if (currentLightboxIndex < 0) return;
  const product = currentFilteredProducts[currentLightboxIndex];
  const text = `Frostoria ("Freshly baked memories.") - ${product.name} | Flavour: ${product.flavour} | Size: ${product.size} | Price: ${product.price}`;

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

  // Header Filter Bar Toggle
  if (elements.filterToggleBtn && elements.searchFilterContainer) {
    elements.filterToggleBtn.addEventListener('click', () => {
      const isExpanded = !elements.searchFilterContainer.classList.contains('hidden');
      if (isExpanded) {
        elements.searchFilterContainer.classList.add('hidden');
        elements.filterToggleBtn.setAttribute('aria-expanded', 'false');
        elements.filterToggleBtn.classList.remove('bg-caramel-100', 'border-caramel-400');
      } else {
        elements.searchFilterContainer.classList.remove('hidden');
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
  renderProductGrid();
});
