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

// Admin credentials — set these via environment variables in production
// (see .env.example). Falls back to a single dev-only account so local
// setup still works without extra config, but every deployed environment
// should override ADMIN_EMAIL / ADMIN_PASSWORD with real secrets.
const ADMIN_CREDENTIALS = [
  {
    email: process.env.ADMIN_EMAIL || 'admin@bloombeenaturals.com',
    password: process.env.ADMIN_PASSWORD || 'change-this-password',
    name: process.env.ADMIN_NAME || 'BloomBee Head Admin',
  },
];

// ==========================================
// SEED DATA — runs once, only if the corresponding collection is empty.
// On a brand-new MongoDB database, the first server boot populates it
// from src/data/initialData.ts. After that, everything lives in
// MongoDB and this is a no-op.
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
}

// ==========================================
// RAZORPAY INTEGRATION
// Talks to the real Razorpay REST API using Basic Auth (Key ID + Key
// Secret) — no SDK dependency needed. Credentials come from the
// AdminSettings document (set via Admin > Razorpay Gateway), so admins
// don't need to touch environment variables to go live.
// ==========================================
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

/**
 * Builds the Express app containing every /api/* route, with no
 * app.listen() and no static/Vite serving attached. This is the piece
 * shared between:
 *  - server.ts        (traditional always-on hosting: Render, Railway, a VPS, local dev)
 *  - api/index.ts      (Vercel serverless function entrypoint)
 *
 * Connects to MongoDB and seeds initial data on first call, then
 * reuses the same Express app on every subsequent call (important for
 * serverless warm starts).
 */
let cachedApp: express.Express | null = null;

export async function createApiApp(): Promise<express.Express> {
  if (cachedApp) return cachedApp;

  await connectDB();
  await seedIfEmpty();

  const app = express();

  // ==========================================
  // ASYNC ERROR SAFETY NET
  // Express 4 does NOT automatically catch a rejected promise thrown
  // inside an `async (req, res) => {...}` route handler — that only
  // happens in Express 5. Left unhandled, a dropped MongoDB connection
  // or any other async error becomes an unhandled rejection, which
  // crashes the whole Vercel serverless function invocation (returning
  // a generic opaque 500 with no JSON body, which the frontend can't
  // parse). This patches the route-registration methods once, up front,
  // so every `async` handler below automatically forwards its errors to
  // the error-handling middleware at the bottom of this file — no need
  // to add try/catch to each individual route.
  // ==========================================
  (['get', 'post', 'put', 'patch', 'delete'] as const).forEach((method) => {
    const original = (app as any)[method].bind(app);
    (app as any)[method] = (path: string, ...handlers: express.RequestHandler[]) => {
      const wrapped = handlers.map((handler) => {
        if (handler.length >= 4) return handler; // leave error-handling middleware (err, req, res, next) alone
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
          Promise.resolve(handler(req, res, next)).catch(next);
        };
      });
      return original(path, ...wrapped);
    };
  });

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

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
      (a) => a.email.toLowerCase() === cleanEmail && a.password === password
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
      error: 'Invalid admin credentials.',
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
  // Razorpay Checkout requires a genuine order_id issued by Razorpay's
  // API — you cannot fabricate one client-side and expect a real charge.
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
          amount: Math.round(amount * 100), // Razorpay expects paise
          currency: 'INR',
          receipt: `bbn_rcpt_${Date.now()}`,
          payment_capture: rp.autoCapture === false ? 0 : 1,
        }),
      });

      res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: rp.keyId,
      });
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

    // ==========================================
    // PAYMENT VERIFICATION
    // Orders are ONLY ever marked "paid" once the payment has actually
    // been confirmed:
    //  - razorpay: the payment signature Razorpay returned is verified
    //    server-side against the Key Secret (HMAC-SHA256 of
    //    order_id|payment_id). A missing or mismatched signature means
    //    no real payment happened — the order is rejected outright
    //    rather than silently marked paid.
    //  - cod: nothing to verify yet — payment is collected on delivery.
    //  - upi (manual/offline UPI): treated the same as COD — pending
    //    until an admin confirms the transfer.
    // ==========================================
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
        return res.status(400).json({
          success: false,
          error: 'Razorpay is not configured on the server (missing Key Secret).',
        });
      }

      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({
          success: false,
          error: 'Payment verification failed (signature mismatch). This order was not placed.',
        });
      }

      paymentStatus = 'paid';
      paidAt = new Date().toISOString();
    }
    // cod / upi: left as 'pending' — collected/confirmed later.

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
        trackingUrl: '',
        estimatedDelivery: '5–7 Business Days',
      },
      timeline:
        paymentStatus === 'paid'
          ? [
              {
                status: 'pending_payment',
                timestamp: nowIso,
                note: `Order initiated by ${customer.fullName}.`,
              },
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
    try {
      await connectDB(); // re-check/re-establish connection in case a warm serverless instance went stale
      let settings: any = await AdminSettingsModel.findOne();
      if (!settings) {
        settings = await AdminSettingsModel.create({ ...DEFAULT_ADMIN_SETTINGS, ...req.body });
      } else {
        settings.set({ ...settings.toObject(), ...req.body });
        await settings.save();
      }
      res.json({ success: true, settings: settings.toObject() });
    } catch (err: any) {
      console.error('Settings save failed:', err);
      res.status(500).json({
        success: false,
        error: err?.message || 'Failed to save settings.',
      });
    }
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

  // ==========================================
  // GLOBAL ERROR HANDLER — must be registered last.
  // None of the routes above have individual try/catch (other than
  // settings/razorpay), so without this, any unexpected error (e.g. a
  // dropped MongoDB connection on a Vercel serverless function) becomes
  // an unhandled rejection that crashes the whole function invocation.
  // That crash returns Vercel's generic HTML/plain-text 500 page instead
  // of JSON, which the frontend can't parse — so real error messages get
  // silently lost. This ensures every route always returns JSON.
  // ==========================================
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(`Unhandled error on ${req.method} ${req.path}:`, err);
    if (res.headersSent) return;
    res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error',
    });
  });

  cachedApp = app;
  return app;
}