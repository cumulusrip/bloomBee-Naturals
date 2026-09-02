import mongoose, { Schema } from 'mongoose';

// ==========================================
// All models use the app's own string `id` (or `orderNumber`) as the
// lookup key, not Mongo's internal `_id`, so the rest of the codebase
// (and the frontend) doesn't need to change how it references records.
// `{ _id: false }` on subdocuments keeps nested objects/arrays clean
// in the stored JSON (no extra _id per variant, fact, etc).
// ==========================================

const ProductVariantSchema = new Schema(
  {
    id: { type: String, required: true },
    weight: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    sku: { type: String, required: true },
  },
  { _id: false }
);

const PurityReportSchema = new Schema(
  {
    nmrTested: Boolean,
    c4SugarFree: Boolean,
    pollenRich: Boolean,
    moisturePercent: Number,
    batchNo: String,
    labName: String,
    reportDate: String,
    fssaiLicense: String,
    certificateUrl: String,
  },
  { _id: false }
);

const MarketplaceLinksSchema = new Schema(
  {
    amazonUrl: String,
    flipkartUrl: String,
    meeshoUrl: String,
    jiomartUrl: String,
  },
  { _id: false }
);

const NutritionalFactSchema = new Schema(
  {
    nutrient: { type: String, required: true },
    per100g: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    subtitle: String,
    category: { type: String, required: true },
    categoryLabel: String,
    fssaiCategoryCode: String,
    shortDescription: String,
    fullDescription: String,
    images: [String],
    variants: [ProductVariantSchema],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    origin: String,
    floraSource: String,
    harvestingMethod: String,
    purityReport: PurityReportSchema,
    marketplaceLinks: MarketplaceLinksSchema,
    nutritionalFacts: [NutritionalFactSchema],
    benefits: [String],
    tasteNotes: String,
    isFeatured: Boolean,
    isBestSeller: Boolean,
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CustomerGuestInfoSchema = new Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
  },
  { _id: false }
);

// Cart items embedded in an order snapshot the full product + variant
// at time of purchase (matches the original in-memory behavior).
const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.Mixed, required: true },
    variant: { type: Schema.Types.Mixed, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const OrderPricingSchema = new Schema(
  {
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    couponCode: String,
  },
  { _id: false }
);

const PaymentDetailsSchema = new Schema(
  {
    method: { type: String, enum: ['razorpay', 'cod', 'upi'], required: true },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: { type: String, enum: ['paid', 'pending', 'failed'], required: true },
    paidAt: String,
  },
  { _id: false }
);

const OrderTrackingInfoSchema = new Schema(
  {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: String,
    dispatchedAt: String,
  },
  { _id: false }
);

const TimelineEntrySchema = new Schema(
  {
    status: { type: String, required: true },
    timestamp: { type: String, required: true },
    note: String,
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    createdAt: { type: String, required: true },
    customer: CustomerGuestInfoSchema,
    items: [CartItemSchema],
    pricing: OrderPricingSchema,
    payment: PaymentDetailsSchema,
    status: { type: String, required: true },
    tracking: OrderTrackingInfoSchema,
    timeline: [TimelineEntrySchema],
  },
  { timestamps: true }
);

const ReviewSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    productId: { type: String, required: true, index: true },
    author: { type: String, required: true },
    location: String,
    rating: { type: Number, required: true },
    date: String,
    title: String,
    comment: { type: String, required: true },
    verifiedBuyer: Boolean,
    variantBought: String,
  },
  { timestamps: true }
);

const B2BInquirySchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: true },
    gstNumber: String,
    category: String,
    estimatedVolumeKg: Number,
    message: String,
    status: { type: String, enum: ['new', 'contacted', 'quoted', 'closed'], default: 'new' },
    createdAt: { type: String, required: true },
  },
  { timestamps: true }
);

const ContactMessageSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: String,
    message: { type: String, required: true },
    createdAt: { type: String, required: true },
    status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  },
  { timestamps: true }
);

// Settings is a singleton — always exactly one document in this collection.
const AdminSettingsSchema = new Schema(
  {
    razorpay: Schema.Types.Mixed,
    smtp: Schema.Types.Mixed,
    store: Schema.Types.Mixed,
  },
  { timestamps: true }
);

// `mongoose.models.X ||` guards against "OverwriteModelError" when this
// module gets re-evaluated (e.g. by Vite's dev-server middleware / HMR).
export const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export const B2BInquiryModel = mongoose.models.B2BInquiry || mongoose.model('B2BInquiry', B2BInquirySchema);
export const ContactMessageModel =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
export const AdminSettingsModel =
  mongoose.models.AdminSettings || mongoose.model('AdminSettings', AdminSettingsSchema);