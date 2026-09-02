import { Product, AdminSettings, Review, Order, ProductCategory, User } from '../types';

export interface FSSAIProductCategoryConfig {
  id: ProductCategory;
  fssaiCode: string;
  name: string;
  shortName: string;
  fssaiOfficialTitle: string;
  icon: string;
  description: string;
  featuredCount: number;
}

export const FSSAI_LICENSED_CATEGORIES: FSSAIProductCategoryConfig[] = [
  {
    id: 'sweeteners_honey',
    fssaiCode: '11',
    name: 'Sweeteners, including Honey',
    shortName: 'Honey & Natural Sweeteners',
    fssaiOfficialTitle: '11 - Sweeteners, including honey',
    icon: 'Honey',
    description: '100% Pure Himalayan honey from J&K, wild forest honeys, and organic desi jaggery/khand with zero added sugar.',
    featuredCount: 4,
  },
  {
    id: 'dairy_products',
    fssaiCode: '01',
    name: 'Dairy Products and Analogues',
    shortName: 'Vedic A2 Cultured Ghee',
    fssaiOfficialTitle: '01 - Dairy products and analogues, excluding products of food category 2.0',
    icon: 'Dairy',
    description: 'Bilona curd-churned A2 Gir & Badri cow ghee slow-cooked over firewood in brass vessels.',
    featuredCount: 2,
  },
  {
    id: 'fats_oils',
    fssaiCode: '02',
    name: 'Fats and Oils, and Fat Emulsions',
    shortName: 'Cold-Pressed Virgin Oils',
    fssaiOfficialTitle: '02 - Fats and oils, and fat emulsions',
    icon: 'Oils',
    description: 'Wood-pressed Kachi Ghani mustard, walnut, and coconut oils unheated under 40°C.',
    featuredCount: 3,
  },
  {
    id: 'nuts_seeds_produce',
    fssaiCode: '04',
    name: 'Nuts, Seeds, Fruits & Vegetables',
    shortName: 'Kashmiri Dry Fruits & Saffron',
    fssaiOfficialTitle: '04 - Fruits and vegetables (including mushrooms, roots, pulses, aloe vera, seaweeds, nuts and seeds)',
    icon: 'DryFruits',
    description: 'High-altitude Kashmiri Mamra almonds, snow-white walnut kernels, Grade A1 Mongra Kesar, and sun-dried figs.',
    featuredCount: 4,
  },
  {
    id: 'cereals_pulses',
    fssaiCode: '06',
    name: 'Cereals, Heritage Grains & Pulses',
    shortName: 'Himalayan Grains & Pulses',
    fssaiOfficialTitle: '06 - Cereals and cereal products, derived from cereal grains, roots, pulses, legumes',
    icon: 'Grains',
    description: 'Kashmiri Mushkbudji aromatic heritage rice, Bhaderwah red rajma, and ancient Khapli emmer wheat.',
    featuredCount: 3,
  },
  {
    id: 'spices_salts',
    fssaiCode: '12',
    name: 'Salts, Spices, Soups & Seasonings',
    shortName: 'Himalayan Spices & Rock Salt',
    fssaiOfficialTitle: '12 - Salts, spices, soups, sauces, salads and protein products',
    icon: 'Spices',
    description: 'Pink Himalayan mineral rock salt, high-curcumin Lakadong turmeric, and sun-dried Kashmiri whole chillies.',
    featuredCount: 3,
  },
  {
    id: 'snacks_sweets',
    fssaiCode: '18',
    name: 'Indian Sweets, Snacks & Savouries',
    shortName: 'Organic Sweets & Healthy Snacks',
    fssaiOfficialTitle: '18 - Indian Sweets and Indian Snacks & Savouries products',
    icon: 'Snacks',
    description: 'Honey-roasted dry fruits, organic jaggery dry fruit chikkis, and roasted Himalayan makhana superfood trail mixes.',
    featuredCount: 3,
  },
  {
    id: 'beverages',
    fssaiCode: '14',
    name: 'Beverages (Non-Dairy)',
    shortName: 'Kashmiri Kahwa & Herbal Teas',
    fssaiOfficialTitle: '14 - Beverages, excluding dairy products',
    icon: 'Beverages',
    description: 'Authentic Kashmiri Shahi Kahwa with saffron, wild chamomile infusions, and raw apple cider vinegar with mother.',
    featuredCount: 3,
  },
];

// Older/legacy product.category values that should still count under a
// current FSSAI category id. This is the ONE place that mapping lives —
// every screen (Shop tabs, Navbar dropdown, Categories page, home FSSAI
// grid, and the Admin product form) should call productMatchesCategory /
// getCategoryProductCount below instead of re-implementing this matching
// logic, so a product always counts the same way everywhere.
const LEGACY_CATEGORY_ALIASES: Partial<Record<ProductCategory, ProductCategory>> = {
  honey: 'sweeteners_honey',
  ghee: 'dairy_products',
  oils: 'fats_oils',
  teas: 'beverages',
  spices: 'nuts_seeds_produce',
  millets: 'cereals_pulses',
};

export function productMatchesCategory(product: Product, categoryId: string): boolean {
  if (categoryId === 'all') return true;
  if (product.category === categoryId) return true;
  return LEGACY_CATEGORY_ALIASES[product.category] === categoryId;
}

export function getCategoryProductCount(products: Product[], categoryId: string): number {
  return products.filter((p) => productMatchesCategory(p, categoryId)).length;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  razorpay: {
    keyId: 'rzp_test_9831BloomBeeKey',
    keySecret: 'sec_BloomBeeDemoKeySecret2026',
    isLive: false,
    autoCapture: true,
  },
  smtp: {
    host: 'smtp.bloombeenaturals.com',
    port: 587,
    encryption: 'TLS',
    username: 'orders@bloombeenaturals.com',
    password: '••••••••••••••••',
    fromEmail: 'orders@bloombeenaturals.com',
    fromName: 'BloomBee Naturals — Himalayan Organic Harvest',
    enabled: true,
  },
  store: {
    name: 'BloomBee Naturals',
    tagline: '100% Pure Himalayan Honey, A2 Ghee, Kashmiri Dry Fruits, Cold-Pressed Oils & Organic Staples',
    domain: 'bloombeenaturals.com',
    supportEmail: 'info@bloombeenaturals.com',
    supportPhone: '+91 81465 53516',
    whatsappNumber: '+91 81465 53516',
    address: 'BloomBee Naturals, Valley Orchard Road, Srinagar, Jammu & Kashmir - 190001, India',
    freeShippingThreshold: 799,
    standardShippingFee: 60,
    standardDeliveryNote: 'Standard Delivery Time: 5–7 Business Days across India.',
  },
};

export const INITIAL_PRODUCTS: Product[] = [
  // -------------------------------------------------------------
  // SWEETENERS & HONEY (FSSAI Cat 11) — single seeded product
  // -------------------------------------------------------------
  {
    id: 'prod-himalayan-honey-250g',
    title: 'BloomBee Naturals Himalayan Honey 250 g',
    slug: 'bloombee-naturals-himalayan-honey-250g',
    subtitle: 'Filtered Natural Honey from Himalayan Honey Bees • 250 g Glass Jar',
    category: 'sweeteners_honey',
    categoryLabel: 'Cat 11 • Himalayan Filtered Honey',
    fssaiCategoryCode: '11 - Sweeteners, including honey',
    shortDescription: 'Filtered, 100% natural Himalayan honey sourced from honey bees, packed fresh in a 250 g glass jar. Pack of 1.',
    fullDescription: 'BloomBee Naturals Himalayan Honey is a natural, filtered honey sourced from honey bees in the Himalayan region. Packed in a 250 g glass jar (Pack of 1), it retains its natural honey flavor with no artificial additives. Sold by BloomBeeNaturals, with Cash on Delivery available. Best before 20 June 2028.',
    images: [
      'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80',
    ],
    variants: [
      { id: 'v-him-250', weight: '250g', price: 169, originalPrice: 249, stock: 100, sku: 'BBN-HIM-250G' },
    ],
    rating: 5.0,
    reviewCount: 1,
    origin: 'Himalayan Region, India',
    floraSource: 'Wild Himalayan Blossoms',
    harvestingMethod: 'Filtered Honey — Honey Bee Sourced',
    purityReport: {
      nmrTested: true,
      c4SugarFree: true,
      pollenRich: true,
      moisturePercent: 17.2,
      batchNo: 'BBN-HIM-2026-H01',
      labName: 'National NMR Spectroscopic Testing Center',
      reportDate: '2026-03-01',
      fssaiLicense: '11025210000092',
    },
    marketplaceLinks: {
      amazonUrl: '',
      flipkartUrl: '',
      meeshoUrl: '',
      jiomartUrl: '',
    },
    nutritionalFacts: [
      { nutrient: 'Energy', per100g: '320 kcal' },
      { nutrient: 'Carbohydrates (Natural Fructose/Glucose)', per100g: '80.5 g' },
      { nutrient: 'Proteins & Amino Acids', per100g: '0.35 g' },
    ],
    benefits: [
      '100% Natural filtered honey sourced from honey bees',
      'Packed in a hygienic glass jar to preserve freshness',
      'No returns; cancellation accepted up to 24 hours before dispatch',
      'Cash on Delivery available',
    ],
    tasteNotes: 'Natural honey flavor, smooth and golden.',
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-himalayan-honey-250g',
    author: 'Dr. Radhika Menon',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    date: '3 days ago',
    title: 'True filtered Himalayan honey! You can actually smell the mountain flowers',
    comment: 'I am a clinical nutritionist and very particular about honey purity. This filtered Himalayan honey is thick, fragrant, and has that authentic floral zing. Great value at this price.',
    verifiedBuyer: true,
    variantBought: '250g Jar',
  },
];

export const RAW_HONEY_COMPARISON_DATA = [
  {
    parameter: 'Processing & Temperature',
    rawHoney: 'Cold-extracted at hive temp (<35°C). Never heat-treated.',
    commercialHoney: 'Ultra-pasteurized at 70°C+ to prevent granulation, destroying live enzymes.',
  },
  {
    parameter: 'Pollen & Propolis Content',
    rawHoney: 'Rich in microscopic bee pollen, antioxidant bio-flavonoids & propolis.',
    commercialHoney: 'Micro-filtered through diatomaceous earth to remove all pollen fingerprints.',
  },
  {
    parameter: 'Sugar / Syrup Adulteration',
    rawHoney: '100% Single-Origin Nectar. 0% C4 Sugar, Invert Syrup or Rice Syrup (NMR Tested).',
    commercialHoney: 'Frequently adulterated with synthetic Chinese fructose/C3/C4 syrups.',
  },
  {
    parameter: 'Diastase & Invertase Enzymes',
    rawHoney: 'Fully active live enzymes that aid gut digestion & respiratory health.',
    commercialHoney: 'Enzymes completely denatured and dead due to industrial boiling.',
  },
  {
    parameter: 'Natural Crystallization',
    rawHoney: 'Naturally crystallizes over time — a hallmark proof of genuine pure raw honey.',
    commercialHoney: 'Remains unnaturally liquid forever due to high heat and chemical stabilizers.',
  },
  {
    parameter: 'Harvest Ethics & Traceability',
    rawHoney: 'Harvested ethically leaving ample surplus honey for the bee colonies.',
    commercialHoney: 'Mass commercial factory apiaries often feed sugar syrups directly to bees.',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-bbn-8092',
    orderNumber: 'BBN-8092',
    createdAt: '2026-08-29T10:15:00Z',
    customer: {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+91 98112 34567',
      address: 'Flat 402, Oakwood Greens, Outer Ring Road, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      landmark: 'Near EcoWorld Tech Park',
    },
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        variant: INITIAL_PRODUCTS[0].variants[0], // 250g
        quantity: 2,
      },
    ],
    pricing: {
      subtotal: 338,
      discount: 0,
      shipping: 0,
      total: 338,
    },
    payment: {
      method: 'razorpay',
      razorpayOrderId: 'order_O9zKlW88zPq1',
      razorpayPaymentId: 'pay_P0xLmQ88wRy2',
      status: 'paid',
      paidAt: '2026-08-29T10:17:30Z',
    },
    status: 'processing',
    timeline: [
      {
        status: 'pending_payment',
        timestamp: '2026-08-29T10:15:00Z',
        note: 'Order placed via frictionless guest checkout.',
      },
      {
        status: 'processing',
        timestamp: '2026-08-29T10:17:30Z',
        note: 'Payment auto-captured via Razorpay UPI. Order transitioned to Processing.',
      },
    ],
  },
  {
    id: 'ord-bbn-8089',
    orderNumber: 'BBN-8089',
    createdAt: '2026-08-27T14:22:00Z',
    customer: {
      fullName: 'Meera Iyer',
      email: 'meera.iyer@example.com',
      phone: '+91 97400 98765',
      address: 'House #12, 4th Cross, Gandhi Nagar, Adyar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600020',
    },
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        variant: INITIAL_PRODUCTS[0].variants[0], // 250g
        quantity: 1,
      },
    ],
    pricing: {
      subtotal: 169,
      discount: 0,
      shipping: 0,
      total: 169,
    },
    payment: {
      method: 'razorpay',
      razorpayOrderId: 'order_O9zKlW88zPq9',
      razorpayPaymentId: 'pay_P0xLmQ88wRy9',
      status: 'paid',
      paidAt: '2026-08-27T14:24:10Z',
    },
    status: 'shipped',
    tracking: {
      carrier: 'Bluedart Air Express',
      trackingNumber: 'BLUEDART-8839219',
      trackingUrl: 'https://www.bluedart.com/tracking?track=BLUEDART-8839219',
      estimatedDelivery: '31 Aug 2026',
    },
    timeline: [
      {
        status: 'pending_payment',
        timestamp: '2026-08-27T14:22:00Z',
        note: 'Order placed via guest checkout.',
      },
      {
        status: 'processing',
        timestamp: '2026-08-27T14:24:10Z',
        note: 'Payment verified and captured.',
      },
      {
        status: 'shipped',
        timestamp: '2026-08-28T09:00:00Z',
        note: 'Package handed to Blue Dart Air Express. Tracking ID: BLUEDART-8839219.',
      },
    ],
  },
];

export const DEMO_USERS: User[] = [
  {
    id: 'usr-customer-01',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98112 34567',
    role: 'customer',
    rewardPoints: 350,
    memberTier: 'Himalayan Blossom',
    createdAt: '2026-01-15T08:30:00Z',
    wishlist: ['prod-himalayan-honey-250g'],
    addresses: [
      {
        id: 'addr-01',
        label: 'Home',
        fullName: 'Aarav Sharma',
        phone: '+91 98112 34567',
        addressLine: 'Flat 402, Oakwood Greens, Outer Ring Road, Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103',
        landmark: 'Near EcoWorld Tech Park',
        isDefault: true,
      },
      {
        id: 'addr-02',
        label: 'Work',
        fullName: 'Aarav Sharma',
        phone: '+91 98112 34567',
        addressLine: 'Floor 6, Tower B, Cyber City, DLF Phase 2',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        landmark: 'Opposite Cyber Hub',
        isDefault: false,
      },
    ],
  },
  {
    id: 'usr-wholesale-01',
    fullName: 'Rohan Malhotra',
    email: 'rohan@kashmirwellness.co',
    phone: '+91 98765 43210',
    role: 'wholesale_buyer',
    companyName: 'Kashmir Wellness & Organic Stores Pvt Ltd',
    gstNumber: '01AAAAA0000A1Z5',
    rewardPoints: 1200,
    memberTier: 'Royal Mountain Club',
    createdAt: '2025-11-20T10:00:00Z',
    wishlist: ['prod-himalayan-honey-250g'],
    addresses: [
      {
        id: 'addr-wb-01',
        label: 'Work',
        fullName: 'Rohan Malhotra',
        phone: '+91 98765 43210',
        addressLine: 'Central Warehouse #14, Narwal Industrial Complex, Bypass Road',
        city: 'Jammu',
        state: 'Jammu & Kashmir',
        pincode: '180006',
        landmark: 'Near Fruit Market Gate 2',
        isDefault: true,
      },
    ],
  },
  {
    id: 'usr-admin-01',
    fullName: 'BloomBee Store Admin',
    email: 'admin@bloombeenaturals.com',
    phone: '+91 94190 12345',
    role: 'admin',
    rewardPoints: 5000,
    memberTier: 'Royal Mountain Club',
    createdAt: '2025-01-01T00:00:00Z',
    wishlist: [],
    addresses: [
      {
        id: 'addr-adm-01',
        label: 'Work',
        fullName: 'BloomBee Naturals HQ',
        phone: '+91 94190 12345',
        addressLine: 'BloomBee Estate, Zero Bridge, Rajbagh',
        city: 'Srinagar',
        state: 'Jammu & Kashmir',
        pincode: '190008',
        landmark: 'Jhelum Riverside',
        isDefault: true,
      },
    ],
  },
];