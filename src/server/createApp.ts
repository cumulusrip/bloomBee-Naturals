// NOTE: This file is NOT used by the running app. server.ts and
// api/index.ts both import createApiApp() from src/api/createApiApp.ts,
// not createApp() from here. Kept in sync with createApiApp.ts to avoid
// confusion, but if you're debugging a live issue, edit createApiApp.ts.
import express from 'express';
import crypto from 'crypto';
import { connectDB } from '../db/connect';
import {
  ProductModel,
  OrderModel,
  ReviewModel,
  B2BInquiryModel,
  ContactMessageModel,
  AdminSettingsModel,
} from '../db/models';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, DEFAULT_ADMIN_SETTINGS, INITIAL_REVIEWS } from '../data/initialData';
import { OrderStatus } from '../types';

// Valid Admin Credentials
const ADMIN_CREDENTIALS = [
  {
    email: 'admin@bloombeenaturals.com',
    password: 'bloombee@admin2025',
    name: 'BloomBee Head Admin',
  },
  {
    email: 'admin@bloombee.com',
    password: 'admin123',
    name: 'Store Manager Admin',
  },
];

// ==========================================
// SEED DATA — runs once, only if the corresponding collection is empty.
// This replaces the old in-memory/db.json seeding: on a brand-new
// MongoDB database, the first server boot populates it from
// src/data/initialData.ts. After that, everything lives in MongoDB
// and this is a no-op.
// ==========================================
async function seedIfEmpty() {
  if ((await ProductModel.countDocuments()) === 0) {
    await ProductModel.insertMany(INITIAL_PRODUCTS);
    console.log(`🌱 Seeded ${INITIAL_PRODUCTS.length} product(s)`);
  }

  if ((await OrderModel.countDocuments()) === 0) {
    await OrderModel.insertMany(INITIAL_ORDERS);
    console.log(`🌱 Seeded ${INITIAL_ORDERS.length} order(s)`);
  }

  if ((await ReviewModel.countDocuments()) === 0) {
    await ReviewModel.insertMany(INITIAL_REVIEWS);
    console.log(`🌱 Seeded ${INITIAL_REVIEWS.length} review(s)`);
  }

  if ((await AdminSettingsModel.countDocuments()) === 0) {
    await AdminSettingsModel.create(DEFAULT_ADMIN_SETTINGS);
    console.log('🌱 Seeded default admin settings');
  }

  if ((await B2BInquiryModel.countDocuments()) === 0) {
    await B2BInquiryModel.insertMany([
      {
        id: 'b2b-001',
        name: 'Suresh Singhania',
        email: 'suresh@singhaniafoods.in',
        phone: '+91 98200 11223',
        companyName: 'Singhania Organic Marts Mumbai',
        gstNumber: '27AABCS1429B1Z8',
        category: 'sweeteners_honey',
        estimatedVolumeKg: 500,
        message:
          'Looking for 500kg monthly raw Himalayan wildflower honey and Kashmir acacia in 25kg bulk food-grade buckets.',
        status: 'new',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'b2b-002',
        name: 'Dr. Meenakshi Sundaram',
        email: 'dr.meenakshi@ayushwellness.org',
        phone: '+91 98450 44556',
        companyName: 'Ayush Ayurvedic Clinics Bengaluru',
        gstNumber: '29AAACA7788C1Z2',
        category: 'dairy_products',
        estimatedVolumeKg: 200,
        message: 'Requirement for Vedic A2 Gir Cow Bilona Ghee with batch test certificates for clinical formulations.',
        status: 'contacted',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ]);
    console.log('🌱 Seeded B2B inquiries');
  }

  if ((await ContactMessageModel.countDocuments()) === 0) {
    await ContactMessageModel.create({
      id: 'msg-001',
      name: 'Kavita Sharma',
      email: 'kavita.sharma@gmail.com',
      phone: '+91 98112 33445',
      subject: 'Batch NMR Lab Report Query',
      message: 'Hello, I loved the Wildflower Honey! How often are fresh batch NMR reports updated on the website?',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'unread',
    });
    console.log('🌱 Seeded contact messages');
  }
}


async function razorpayApiRequest(path: string, keyId: string, keySecret: string, init: RequestInit = {}) {
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
      ...(init.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data as any)?.error?.description || `Razorpay API returned HTTP ${res.status}`;
    throw new Error(message);
  }
  return data as any;
}

let cachedApp: express.Express | null = null;

/**
 * Builds (and caches) the Express app containing all /api/* routes.
 * Used both by server.ts (local dev / traditional node server) and
 * by api/index.ts (Vercel serverless function). The cache means a
 * warm serverless invocation reuses the same app + DB connection
 * instead of rebuilding it on every request.
 */
export async function createApp(): Promise<express.Express> {
  if (cachedApp) return cachedApp;

  await connectDB();
  await seedIfEmpty();

  const app = express();

  // Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ==========================================
  // BACKEND API ROUTES
  // ==========================================

  // 1. Health check
  app.get('/api/health', async (req, res) => {
    const [productsCount, ordersCount] = await Promise.all([
      ProductModel.countDocuments(),
      OrderModel.countDocuments(),
    ]);
    res.json({
      status: 'ok',
      service: 'BloomBee Naturals Backend API',
      timestamp: new Date().toISOString(),
      productsCount,
      ordersCount,
    });
  });

  // 2. Admin Authentication
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = ADMIN_CREDENTIALS.find(
      (a) =>
        (a.email.toLowerCase() === cleanEmail || cleanEmail === 'admin') &&
        (a.password === password || password === 'admin123' || password === 'bloombee@admin2025')
    );

    if (admin) {
      const token = `bbn_admin_${Buffer.from(`${admin.email}:${Date.now()}`).toString('base64')}`;
      return res.json({
        success: true,
        token,
        user: {
          id: 'admin-master-01',
          fullName: admin.name,
          email: admin.email,
          role: 'admin',
          createdAt: '2025-01-01T00:00:00Z',
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid admin credentials. Use admin@bloombeenaturals.com with password bloombee@admin2025',
    });
  });

  // 3. Products Endpoints
  app.get('/api/products', async (req, res) => {
    const products = await ProductModel.find().lean();
    res.json({ success: true, products });
  });

  app.get('/api/products/:id', async (req, res) => {
    const product = await ProductModel.findOne({ id: req.params.id }).lean();
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  });

  // Admin add product
  app.post('/api/products', async (req, res) => {
    const newProduct = {
      ...req.body,
      id: req.body.id || `prod-custom-${Date.now()}`,
    };
    const created = await ProductModel.create(newProduct);
    res.status(201).json({ success: true, product: created.toObject() });
  });

  // Admin update product
  app.put('/api/products/:id', async (req, res) => {
    const updated = await ProductModel.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product: updated });
  });

  // Admin delete product
  app.delete('/api/products/:id', async (req, res) => {
    await ProductModel.deleteOne({ id: req.params.id });
    res.json({ success: true, message: 'Product deleted' });
  });

  // Razorpay: create a real order server-side before checkout opens.
  app.post('/api/razorpay/create-order', async (req, res) => {
    try {
      const settings: any = await AdminSettingsModel.findOne().lean();
      const rp = settings?.razorpay;

      if (!rp?.keyId || !rp?.keySecret) {
        return res.status(400).json({
          success: false,
          error: 'Razorpay is not configured. Add your Key ID and Key Secret in Admin Dashboard → Razorpay Gateway.',
        });
      }

      const amount = Number(req.body?.amount);
      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid order amount.' });
      }

      const order = await razorpayApiRequest('/orders', rp.keyId, rp.keySecret, {
        method: 'POST',
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: 'INR',
          receipt: `bbn_rcpt_${Date.now()}`,
          payment_capture: rp.autoCapture === false ? 0 : 1,
        }),
      });

      res.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency, keyId: rp.keyId });
    } catch (err: any) {
      console.error('Razorpay create-order failed:', err.message);
      res.status(502).json({
        success: false,
        error: err.message || 'Could not reach Razorpay. Check your Key ID / Key Secret and try again.',
      });
    }
  });

  // 4. Orders Endpoints (Anyone / Guest can create orders)
  app.get('/api/orders', async (req, res) => {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, orders });
  });

  // Guest & Member Order Creation (No sign-in required)
  app.post('/api/orders', async (req, res) => {
    const { customer, items, pricing, payment } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.address) {
      return res.status(400).json({
        success: false,
        error: 'Missing required shipping details: fullName, phone, and address are mandatory',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    const method: string = payment?.method || 'razorpay';
    let paymentStatus: 'paid' | 'pending' | 'failed' = 'pending';
    let paidAt: string | undefined;
    let razorpayOrderId: string | undefined;
    let razorpayPaymentId: string | undefined;
    let razorpaySignature: string | undefined;

    if (method === 'razorpay') {
      razorpayOrderId = payment?.razorpayOrderId;
      razorpayPaymentId = payment?.razorpayPaymentId;
      razorpaySignature = payment?.razorpaySignature;

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({
          success: false,
          error: 'Payment was not confirmed by Razorpay. No charge was verified, so this order was not placed.',
        });
      }

      const settings: any = await AdminSettingsModel.findOne().lean();
      const keySecret = settings?.razorpay?.keySecret;
      if (!keySecret) {
        return res.status(400).json({ success: false, error: 'Razorpay is not configured on the server (missing Key Secret).' });
      }

      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ success: false, error: 'Payment verification failed (signature mismatch). This order was not placed.' });
      }

      paymentStatus = 'paid';
      paidAt = new Date().toISOString();
    }

    const orderNumber = `BBN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderId = `ord-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newOrder = {
      id: newOrderId,
      orderNumber,
      createdAt: nowIso,
      customer: {
        fullName: customer.fullName.trim(),
        email: (customer.email || 'guest@bloombeenaturals.com').trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: (customer.city || 'India').trim(),
        state: (customer.state || 'India').trim(),
        pincode: (customer.pincode || '110001').trim(),
        landmark: customer.landmark || '',
      },
      items,
      pricing: {
        subtotal: pricing?.subtotal || 0,
        discount: pricing?.discount || 0,
        shipping: pricing?.shipping || 0,
        total: pricing?.total || 0,
        couponCode: pricing?.couponCode,
      },
      payment: {
        method,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        status: paymentStatus,
        paidAt,
      },
      status: paymentStatus === 'paid' ? 'processing' : 'pending_payment',
      tracking: {
        carrier: 'BlueDart Express / Delhivery Air',
        trackingNumber: `AWB-BBN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        trackingUrl: 'https://www.delhivery.com/tracking',
        estimatedDelivery: '5–7 Business Days',
      },
      timeline:
        paymentStatus === 'paid'
          ? [
              { status: 'pending_payment', timestamp: nowIso, note: `Order initiated by ${customer.fullName}.` },
              {
                status: 'processing',
                timestamp: nowIso,
                note: `Payment ₹${pricing?.total?.toLocaleString('en-IN') || 0} verified via Razorpay (Payment ID: ${razorpayPaymentId}). Packaging in multi-layer insulated glass-safe box at Srinagar dispatch hub.`,
              },
            ]
          : [
              {
                status: 'pending_payment',
                timestamp: nowIso,
                note:
                  method === 'cod'
                    ? `Order placed by ${customer.fullName}. Payment of ₹${pricing?.total?.toLocaleString('en-IN') || 0} due on delivery.`
                    : `Order placed by ${customer.fullName}. Awaiting payment confirmation.`,
              },
            ],
    };

    // Reduce stock in the products collection
    for (const item of items as any[]) {
      const productId = item.product?.id || item.productId;
      const variantId = item.variant?.id;
      if (!productId || !variantId) continue;

      const prod = await ProductModel.findOne({ id: productId });
      if (prod && Array.isArray((prod as any).variants)) {
        (prod as any).variants = (prod as any).variants.map((v: any) => {
          if (v.id === variantId) {
            return { ...(v.toObject ? v.toObject() : v), stock: Math.max(0, v.stock - (item.quantity || 1)) };
          }
          return v;
        });
        (prod as any).inStock = (prod as any).variants.some((v: any) => v.stock > 0);
        await prod.save();
      }
    }

    const created = await OrderModel.create(newOrder);

    res.status(201).json({
      success: true,
      order: created.toObject(),
      orderNumber: created.orderNumber,
      orderId: created.id,
    });
  });

  // Track Order by Order Number, ID, phone, email, or AWB (Public / No login required)
  app.get('/api/orders/track/:query', async (req, res) => {
    const rawQuery = (req.params.query || '').trim().toLowerCase();
    if (!rawQuery) {
      return res.status(400).json({ success: false, error: 'Tracking query required' });
    }

    const digitsOnly = rawQuery.replace(/\D/g, '');

    // Try the indexed exact-match fields first (fast path)
    let order: any = await OrderModel.findOne({
      $or: [
        { orderNumber: new RegExp(`^${rawQuery}$`, 'i') },
        { id: new RegExp(`^${rawQuery}$`, 'i') },
      ],
    }).lean();

    // Fall back to scanning for phone / email / AWB matches
    if (!order) {
      const candidates = await OrderModel.find().lean();
      order =
        candidates.find((o: any) => {
          const matchesPhone = (o.customer?.phone || '').replace(/\D/g, '') === digitsOnly && digitsOnly.length > 0;
          const matchesEmail = (o.customer?.email || '').toLowerCase() === rawQuery;
          const matchesAwb = (o.tracking?.trackingNumber || '').toLowerCase() === rawQuery;
          return matchesPhone || matchesEmail || matchesAwb;
        }) || null;
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `No active order found matching "${req.params.query}". Please verify your 4-digit order number (e.g. BBN-1001) or 10-digit phone number.`,
      });
    }

    res.json({ success: true, order });
  });

  // Admin Update Order Status
  app.patch('/api/orders/:id/status', async (req, res) => {
    const { status, tracking } = req.body;
    const order: any = await OrderModel.findOne({ $or: [{ id: req.params.id }, { orderNumber: req.params.id }] });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const nowIso = new Date().toISOString();
    order.status = status as OrderStatus;

    if (tracking) {
      order.tracking = {
        ...(order.tracking?.toObject ? order.tracking.toObject() : order.tracking),
        ...tracking,
        dispatchedAt: nowIso,
      };
    }

    const statusNotes: Record<string, string> = {
      pending_payment: 'Order marked as pending payment.',
      processing: 'Order transitioned to processing in packaging hub.',
      shipped: `Dispatched via ${tracking?.carrier || 'Delhivery / BlueDart'} (AWB: ${tracking?.trackingNumber || 'Active'}). In transit across India.`,
      in_transit: 'Shipment has reached regional transit sorting facility.',
      out_for_delivery: 'Out for final doorstep delivery with local courier executive.',
      delivered: 'Delivered safely to recipient. Purity guarantee verified.',
      cancelled: 'Order cancelled.',
    };

    order.timeline.push({
      status: status as OrderStatus,
      timestamp: nowIso,
      note: statusNotes[status] || `Status updated to ${status}.`,
    });

    await order.save();
    res.json({ success: true, order: order.toObject() });
  });

  // 5. B2B Wholesale Inquiries
  app.get('/api/b2b-inquiries', async (req, res) => {
    const inquiries = await B2BInquiryModel.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, inquiries });
  });

  app.post('/api/b2b-inquiries', async (req, res) => {
    const { name, email, phone, companyName, gstNumber, category, estimatedVolumeKg, message } = req.body;

    if (!name || !email || !phone || !companyName) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, phone, and company name are required',
      });
    }

    const newInquiry = {
      id: `b2b-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      companyName: companyName.trim(),
      gstNumber: gstNumber ? gstNumber.trim() : undefined,
      category: category || 'sweeteners_honey',
      estimatedVolumeKg: Number(estimatedVolumeKg) || 100,
      message: message ? message.trim() : '',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    const created = await B2BInquiryModel.create(newInquiry);
    res.status(201).json({
      success: true,
      message: 'Wholesale inquiry received. Our trade desk will respond within 4 business hours.',
      inquiry: created.toObject(),
    });
  });

  app.patch('/api/b2b-inquiries/:id/status', async (req, res) => {
    const inquiry = await B2BInquiryModel.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status: req.body.status } },
      { new: true }
    ).lean();

    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    res.json({ success: true, inquiry });
  });

  // 6. Contact Desk Messages
  app.get('/api/contact', async (req, res) => {
    const messages = await ContactMessageModel.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, messages });
  });

  app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : undefined,
      subject: subject ? subject.trim() : 'Customer Inquiry',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    const created = await ContactMessageModel.create(newMsg);
    res.status(201).json({
      success: true,
      message: 'Message received. Valley Care Desk will contact you shortly.',
      contactMessage: created.toObject(),
    });
  });

  // 7. Store Settings (singleton document)
  app.get('/api/settings', async (req, res) => {
    let settings = await AdminSettingsModel.findOne().lean();
    if (!settings) {
      const created = await AdminSettingsModel.create(DEFAULT_ADMIN_SETTINGS);
      settings = created.toObject();
    }
    res.json({ success: true, settings });
  });

  app.put('/api/settings', async (req, res) => {
    let settings: any = await AdminSettingsModel.findOne();
    if (!settings) {
      settings = await AdminSettingsModel.create({ ...DEFAULT_ADMIN_SETTINGS, ...req.body });
    } else {
      settings.set({ ...settings.toObject(), ...req.body });
      await settings.save();
    }
    res.json({ success: true, settings: settings.toObject() });
  });

  // 8. Reviews Endpoints (Customer submission & Admin moderation)
  app.get('/api/reviews', async (req, res) => {
    const { productId } = req.query;
    const filter = productId ? { productId } : {};
    const reviews = await ReviewModel.find(filter as any).lean();
    res.json({ success: true, reviews });
  });

  app.post('/api/reviews', async (req, res) => {
    const { productId, author, location, rating, title, comment, verifiedBuyer, variantBought } = req.body;
    if (!productId || !author || !comment) {
      return res.status(400).json({ success: false, error: 'Product ID, author name, and review comment are required' });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      author: author.trim(),
      location: (location || 'India').trim(),
      rating: Number(rating) || 5,
      date: 'Just now',
      title: title ? title.trim() : 'Verified Buyer Review',
      comment: comment.trim(),
      verifiedBuyer: verifiedBuyer !== undefined ? Boolean(verifiedBuyer) : true,
      variantBought: variantBought || 'Standard Pack',
    };

    const created = await ReviewModel.create(newReview);

    // Update product rating and review count
    const prodReviews = await ReviewModel.find({ productId }).lean();
    if (prodReviews.length > 0) {
      const avg = prodReviews.reduce((s, r) => s + r.rating, 0) / prodReviews.length;
      await ProductModel.findOneAndUpdate(
        { id: productId },
        { $set: { rating: Number(avg.toFixed(1)), reviewCount: prodReviews.length } }
      );
    }

    res.status(201).json({ success: true, review: created.toObject() });
  });

  app.delete('/api/reviews/:id', async (req, res) => {
    await ReviewModel.deleteOne({ id: req.params.id });
    res.json({ success: true, message: 'Review removed' });
  });


  cachedApp = app;
  return app;
}
