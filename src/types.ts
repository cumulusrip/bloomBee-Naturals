export interface ProductVariant {
  id: string;
  weight: string; // e.g., '250g', '500g', '1kg'
  price: number;
  originalPrice: number;
  stock: number;
  sku: string;
}

export interface PurityReport {
  nmrTested: boolean;
  c4SugarFree: boolean;
  pollenRich: boolean;
  moisturePercent: number;
  batchNo: string;
  labName: string;
  reportDate: string;
  fssaiLicense: string;
  certificateUrl?: string;
}

export interface MarketplaceLinks {
  amazonUrl?: string;
  flipkartUrl?: string;
  meeshoUrl?: string;
  jiomartUrl?: string;
}

export interface NutritionalFact {
  nutrient: string;
  per100g: string;
}

export type ProductCategory =
  | 'sweeteners_honey'
  | 'dairy_products'
  | 'fats_oils'
  | 'nuts_seeds_produce'
  | 'cereals_pulses'
  | 'spices_salts'
  | 'salts_spices'
  | 'snacks_sweets'
  | 'indian_sweets_snacks'
  | 'beverages'
  | 'beverages_non_dairy'
  | 'all'
  // Backward compatible aliases
  | 'honey'
  | 'ghee'
  | 'oils'
  | 'teas'
  | 'spices'
  | 'millets';

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: ProductCategory;
  categoryLabel: string;
  fssaiCategoryCode?: string; // e.g. "Cat 11 - Sweeteners", "Cat 04 - Nuts & Produce"
  shortDescription: string;
  fullDescription: string;
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  origin: string;
  floraSource: string;
  harvestingMethod: string;
  purityReport: PurityReport;
  marketplaceLinks: MarketplaceLinks;
  nutritionalFacts: NutritionalFact[];
  benefits: string[];
  tasteNotes: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export type NavigationView = 
  | 'home'
  | 'shop'
  | 'catalog' // alias for shop
  | 'categories'
  | 'about'
  | 'lab-reports'
  | 'wholesale'
  | 'contact'
  | 'account'
  | 'tracking'
  | 'admin'
  | 'pdp'
  | 'privacy-policy'
  | 'terms-conditions'
  | 'returns-refunds'
  | 'shipping-delivery';

export interface UserAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'customer' | 'wholesale_buyer' | 'admin';
  companyName?: string;
  gstNumber?: string;
  addresses: UserAddress[];
  wishlist: string[]; // product IDs
  rewardPoints: number;
  memberTier: 'Himalayan Seed' | 'Himalayan Blossom' | 'Royal Mountain Club';
  createdAt: string;
}

export interface CustomerGuestInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export type OrderStatus = 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderTrackingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
  dispatchedAt?: string;
}

export interface OrderPricing {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
}

export interface PaymentDetails {
  method: 'razorpay' | 'cod' | 'upi';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: 'paid' | 'pending' | 'failed';
  paidAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerGuestInfo;
  items: CartItem[];
  pricing: OrderPricing;
  payment: PaymentDetails;
  status: OrderStatus;
  tracking?: OrderTrackingInfo;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface RazorpaySettings {
  keyId: string;
  keySecret: string;
  isLive: boolean;
  autoCapture: boolean;
}

export interface SMTPSettings {
  host: string;
  port: number;
  encryption: 'SSL' | 'TLS' | 'None';
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  enabled: boolean;
}

export interface StoreSettings {
  name: string;
  tagline: string;
  domain: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  address: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  standardDeliveryNote: string;
}

export interface AdminSettings {
  razorpay: RazorpaySettings;
  smtp: SMTPSettings;
  store: StoreSettings;
}

export interface EmailLog {
  id: string;
  orderId: string;
  orderNumber: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  templateType: 'order_confirmation' | 'status_update' | 'custom_test';
  orderStatus?: OrderStatus;
  status: 'sent' | 'queued' | 'simulated';
  sentAt: string;
  htmlContent: string;
}

export interface WholesaleInquiry {
  id: string;
  createdAt: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  estimatedMonthlyKg: string;
  productsInterested: string[];
  businessType: 'Retailer' | 'Ayurvedic Brand' | 'Bakery & Food Service' | 'Exporter' | 'Other';
  message: string;
  status: 'new' | 'contacted' | 'sample_dispatched' | 'closed';
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  variantBought: string;
}
