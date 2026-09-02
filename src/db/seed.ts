import {
  ProductModel,
  OrderModel,
  ReviewModel,
  B2BInquiryModel,
  ContactMessageModel,
  AdminSettingsModel,
} from './models';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, DEFAULT_ADMIN_SETTINGS, INITIAL_REVIEWS } from '../data/initialData';

// ==========================================
// SEED DATA — runs once, only if the corresponding collection is empty.
// On a brand-new MongoDB database, the first request populates it from
// src/data/initialData.ts. After that, everything lives in MongoDB and
// this is a no-op on every subsequent call.
// ==========================================
export async function seedIfEmpty(): Promise<void> {
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