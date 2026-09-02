import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  Settings,
  Mail,
  Layers,
  Key,
  Truck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Save,
  Send,
  Eye,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  X,
  FileText,
  Upload,
  Image as ImageIcon,
  Star,
  Check,
  Filter,
  MessageSquare,
  Sparkles,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FSSAIProductCategoryConfig } from '../data/initialData';
import {
  Product,
  Order,
  OrderStatus,
  AdminSettings,
  ProductVariant,
  NutritionalFact,
  Review,
  ProductCategory,
} from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    orders,
    adminSettings,
    emailLogs,
    wholesaleInquiries,
    reviews,
    updateProduct,
    addProduct,
    deleteProduct,
    addReview,
    deleteReview,
    updateOrderStatus,
    updateAdminSettings,
    updateWholesaleStatus,
    sendTestEmail,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'orders'
    | 'products'
    | 'categories'
    | 'stock'
    | 'reviews'
    | 'razorpay'
    | 'smtp'
    | 'shipping'
    | 'wholesale'
    | 'emailLogs'
  >('overview');

  // Order status update modal state
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<Order | null>(null);
  const [newStatusValue, setNewStatusValue] = useState<OrderStatus>('shipped');
  const [trackingCarrier, setTrackingCarrier] = useState('BlueDart Express / Delhivery');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('5–7 Business Days');

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<
    'basic' | 'images' | 'variants' | 'purity' | 'nutrition' | 'marketplaces'
  >('basic');

  // Category Edit Modal State
  const [editingCategory, setEditingCategory] = useState<FSSAIProductCategoryConfig | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [categoryDeleteConfirmId, setCategoryDeleteConfirmId] = useState<string | null>(null);

  // Reviews Tab Filter & Add Review Modal
  const [reviewFilterProduct, setReviewFilterProduct] = useState<string>('all');
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [newAdminReview, setNewAdminReview] = useState({
    productId: products[0]?.id || '',
    author: '',
    location: '',
    rating: 5,
    title: '',
    comment: '',
    variantBought: 'Standard Pack',
  });

  // Settings State
  const [razorpaySettingsForm, setRazorpaySettingsForm] = useState(adminSettings.razorpay);
  const [smtpSettingsForm, setSmtpSettingsForm] = useState(adminSettings.smtp);
  const [storeSettingsForm, setStoreSettingsForm] = useState(adminSettings.store);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [saveErrorMsg, setSaveErrorMsg] = useState('');
  const [testEmailAddress, setTestEmailAddress] = useState('customer@example.com');
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);

  // Inspect HTML Email Modal
  const [viewingEmailHtml, setViewingEmailHtml] = useState<string | null>(null);

  // Stats Calculations
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.status !== 'cancelled' ? o.pricing.total : 0),
    0
  );
  const totalOrdersCount = orders.length;
  const processingOrdersCount = orders.filter((o) => o.status === 'processing').length;
  const totalStockUnits = products.reduce(
    (acc, p) => acc + p.variants.reduce((vAcc, v) => vAcc + v.stock, 0),
    0
  );
  const lowStockCount = products.reduce(
    (acc, p) => acc + p.variants.filter((v) => v.stock < 15).length,
    0
  );

  const handleSaveRazorpay = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateAdminSettings({ ...adminSettings, razorpay: razorpaySettingsForm });
    if (result.success) {
      setSaveSuccessMsg('Razorpay settings saved securely!');
      setSaveErrorMsg('');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } else {
      setSaveErrorMsg(result.error || 'Could not save Razorpay settings — the change was NOT persisted.');
      setTimeout(() => setSaveErrorMsg(''), 6000);
    }
  };

  const handleSaveSMTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateAdminSettings({ ...adminSettings, smtp: smtpSettingsForm });
    if (result.success) {
      setSaveSuccessMsg('Custom SMTP credentials updated & active!');
      setSaveErrorMsg('');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } else {
      setSaveErrorMsg(result.error || 'Could not save SMTP settings — the change was NOT persisted.');
      setTimeout(() => setSaveErrorMsg(''), 6000);
    }
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateAdminSettings({ ...adminSettings, store: storeSettingsForm });
    if (result.success) {
      setSaveSuccessMsg('Store information & policies updated!');
      setSaveErrorMsg('');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } else {
      setSaveErrorMsg(result.error || 'Could not save store settings — the change was NOT persisted.');
      setTimeout(() => setSaveErrorMsg(''), 6000);
    }
  };

  const handleSendTestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress) return;
    const ok = sendTestEmail(testEmailAddress);
    if (ok) {
      setTestEmailStatus(
        `✓ Test Order Confirmation HTML email successfully dispatched to ${testEmailAddress}!`
      );
      setTimeout(() => setTestEmailStatus(null), 5000);
    }
  };

  const handleApplyOrderStatus = () => {
    if (!selectedOrderForStatus) return;
    updateOrderStatus(selectedOrderForStatus.id, newStatusValue, {
      carrier: trackingCarrier,
      trackingNumber: trackingNumber || `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
      trackingUrl: trackingUrl.trim(),
      estimatedDelivery,
    });
    setSelectedOrderForStatus(null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const result = isNewProduct
      ? await addProduct(editingProduct)
      : await updateProduct(editingProduct);

    if (result.success) {
      setSaveSuccessMsg(`Product "${editingProduct.title}" saved successfully!`);
      setSaveErrorMsg('');
      setEditingProduct(null);
      setIsNewProduct(false);
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } else {
      // Keep the edit modal open so nothing is lost — surface exactly why
      // it didn't save instead of silently pretending it worked.
      setSaveErrorMsg(result.error || `Could not save "${editingProduct.title}" — the change was NOT persisted.`);
      setTimeout(() => setSaveErrorMsg(''), 8000);
    }
  };

  const handleOpenAddProduct = () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: 'Himalayan High-Altitude Superfood',
      slug: `superfood-${Date.now()}`,
      subtitle: '100% natural, ethically harvested from pristine Himalayan valleys.',
      category: 'sweeteners_honey',
      categoryLabel: 'Raw Natural Honey',
      fssaiCategoryCode: 'FSSAI Cat 11 - Sweeteners (Honey)',
      shortDescription: 'Unprocessed natural harvest directly from certified mountain apiaries.',
      fullDescription:
        'Single-origin pure harvest with NMR spectroscopy laboratory verification and 0% C4 adulteration.',
      images: [
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80',
      ],
      variants: [
        {
          id: `v-${Date.now()}-250`,
          weight: '250g',
          price: 399,
          originalPrice: 499,
          stock: 50,
          sku: 'BBN-HNY-250G',
        },
        {
          id: `v-${Date.now()}-500`,
          weight: '500g',
          price: 699,
          originalPrice: 899,
          stock: 50,
          sku: 'BBN-HNY-500G',
        },
        {
          id: `v-${Date.now()}-1kg`,
          weight: '1kg',
          price: 1299,
          originalPrice: 1699,
          stock: 30,
          sku: 'BBN-HNY-1KG',
        },
      ],
      rating: 5.0,
      reviewCount: 1,
      origin: 'Pristine Valleys of Jammu & Kashmir, Himalayas, India',
      floraSource: 'Wild Himalayan Clover, Kashmir Apple Blossom, Robinia & Alpine Herbs',
      harvestingMethod: 'Traditional Gravity Cold-Filtration (<35°C, Zero Adulteration)',
      purityReport: {
        nmrTested: true,
        c4SugarFree: true,
        pollenRich: true,
        moisturePercent: 17.2,
        batchNo: `BBN-2026-N${Math.floor(10 + Math.random() * 90)}`,
        labName: 'Intertek Food Services India / National Dairy Dev Board',
        reportDate: new Date().toISOString().split('T')[0],
        fssaiLicense: '11025210000092',
        certificateUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
      },
      marketplaceLinks: {
        amazonUrl: '',
        flipkartUrl: '',
        meeshoUrl: '',
        jiomartUrl: '',
      },
      nutritionalFacts: [
        { nutrient: 'Energy', per100g: '320 kcal' },
        { nutrient: 'Carbohydrates', per100g: '80.0 g' },
        { nutrient: 'Natural Fruit Fructose', per100g: '38.2 g' },
        { nutrient: 'Natural Glucose', per100g: '31.3 g' },
        { nutrient: 'Added Sugars (C4/Invert)', per100g: '0.0 g' },
        { nutrient: 'Moisture', per100g: '17.2 g' },
        { nutrient: 'Live Pollen Count', per100g: '> 25,000 grains' },
      ],
      benefits: [
        'Boosts natural cellular immunity & metabolic energy',
        'Rich in living mountain pollen and active diastase enzymes',
        'Soothes throat irritation & aids smooth digestion',
      ],
      tasteNotes: 'Delicate floral aroma with lingering warm mountain clover finish.',
      isFeatured: true,
      isBestSeller: false,
      inStock: true,
    };
    setEditingProduct(newProd);
    setIsNewProduct(true);
    setActiveModalTab('basic');
  };

  // Image Upload helper for Admin (handles local file upload as Data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      if (isMain) {
        setEditingProduct({
          ...editingProduct,
          images: [dataUrl, ...editingProduct.images.slice(1)],
        });
      } else {
        setEditingProduct({
          ...editingProduct,
          images: [...editingProduct.images, dataUrl],
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddAdminReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminReview.author || !newAdminReview.comment || !newAdminReview.productId) return;

    addReview({
      productId: newAdminReview.productId,
      author: newAdminReview.author.trim(),
      location: newAdminReview.location.trim() || 'India',
      rating: newAdminReview.rating,
      title: newAdminReview.title.trim() || 'Verified Customer Review',
      comment: newAdminReview.comment.trim(),
      verifiedBuyer: true,
      variantBought: newAdminReview.variantBought,
    });

    setIsAddReviewModalOpen(false);
    setNewAdminReview({
      productId: products[0]?.id || '',
      author: '',
      location: '',
      rating: 5,
      title: '',
      comment: '',
      variantBought: 'Standard Pack',
    });
    setSaveSuccessMsg('Verified customer review added and published!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const filteredReviews =
    reviewFilterProduct === 'all'
      ? reviews
      : reviews.filter((r) => r.productId === reviewFilterProduct);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#EFE5D5] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1E3F20] text-white px-2.5 py-0.5 rounded-full">
                Admin Control Center
              </span>
              <span className="text-xs text-[#786C5E]">BloomBee Naturals D2C</span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#1E3F20] mt-1">
              Store Administration &amp; Product Management
            </h1>
          </div>

          {saveSuccessMsg && (
            <div className="bg-[#F0F7EE] text-[#2D5A27] border border-[#2D5A27]/30 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {saveErrorMsg && (
            <div className="bg-red-50 text-red-700 border border-red-300 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 animate-fade-in max-w-md">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{saveErrorMsg}</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EFE5D5]">
          {[
            { id: 'overview', label: '📊 Metrics & Sales' },
            { id: 'orders', label: `📦 Orders (${orders.length})` },
            { id: 'products', label: `🍯 Products Catalog (${products.length})` },
            { id: 'categories', label: `🗂️ Categories (${categories.length})` },
            { id: 'stock', label: `📈 Stock Levels (${totalStockUnits})` },
            { id: 'reviews', label: `⭐ Reviews (${reviews.length})` },
            { id: 'razorpay', label: '💳 Razorpay Gateway' },
            { id: 'smtp', label: '✉️ Custom SMTP' },
            { id: 'shipping', label: '🚚 Shipping Charges' },
            { id: 'wholesale', label: `🏢 Wholesale Leads (${wholesaleInquiries.length})` },
            { id: 'emailLogs', label: `📑 Email Logs (${emailLogs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1E3F20] text-white shadow-md'
                  : 'bg-white text-[#4B5563] border border-[#EFE5D5] hover:border-[#9A5B00]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & Metrics */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#EFE5D5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#786C5E] mb-2 font-semibold">
                  <span>Gross Sales</span>
                  <DollarSign className="w-4 h-4 text-[#9A5B00]" />
                </div>
                <div className="font-display text-2xl font-bold text-[#1E3F20]">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#2D5A27] font-semibold mt-1 block">
                  ✓ 100% via Instant Razorpay &amp; Guest Checkout
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#EFE5D5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#786C5E] mb-2 font-semibold">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#1E3F20]" />
                </div>
                <div className="font-display text-2xl font-bold text-[#1E3F20]">
                  {totalOrdersCount}
                </div>
                <span className="text-[11px] text-[#9A5B00] font-semibold mt-1 block">
                  {processingOrdersCount} pending dispatch packaging
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#EFE5D5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#786C5E] mb-2 font-semibold">
                  <span>Inventory Stock</span>
                  <Layers className="w-4 h-4 text-[#2D5A27]" />
                </div>
                <div className="font-display text-2xl font-bold text-[#1E3F20]">
                  {totalStockUnits} Units
                </div>
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Across {products.length} products &amp; variants
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#EFE5D5] shadow-xs">
                <div className="flex items-center justify-between text-xs text-[#786C5E] mb-2 font-semibold">
                  <span>Verified Reviews</span>
                  <Star className="w-4 h-4 text-[#E69500]" />
                </div>
                <div className="font-display text-2xl font-bold text-[#1E3F20]">
                  {reviews.length}
                </div>
                <span className="text-[11px] text-[#2D5A27] font-semibold mt-1 block">
                  Average Store Rating: 4.9 / 5.0
                </span>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-[#FEF7EB] rounded-3xl border border-[#E69500]/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1E3F20]">
                  Product Catalog &amp; Multi-Channel Control
                </h3>
                <p className="text-xs text-[#786C5E] mt-1 max-w-xl">
                  Manage product categories, prices, actual MRP, upload multiple high-res images, manage variants (sizes, stock, SKUs), edit NMR lab certificates, and moderate customer reviews.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-[#1E3F20] text-white px-4 py-2.5 rounded-2xl font-bold text-xs hover:bg-[#2D5A27] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product SKU</span>
                </button>
                <button
                  onClick={() => setActiveTab('stock')}
                  className="bg-white border border-[#D9CDBF] text-[#1E3F20] px-4 py-2.5 rounded-2xl font-bold text-xs hover:border-[#9A5B00] transition-colors cursor-pointer"
                >
                  Manage Stock Levels
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#EFE5D5] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1E3F20]">
                  Customer Orders &amp; Dispatch Dispatcher
                </h3>
                <p className="text-xs text-[#786C5E]">
                  Update order tracking to trigger automatic HTML notifications via custom SMTP.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#EFE5D5] text-[#786C5E] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE5D5]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3.5 px-3 font-mono font-bold text-[#1E3F20]">
                        #{ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-[#1E3F20]">{ord.customer.fullName}</div>
                        <div className="text-gray-400 text-[11px]">{ord.customer.phone}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        {ord.items.map((i, idx) => (
                          <div key={idx} className="truncate max-w-[200px] text-[11px]">
                            {i.quantity}x {i.product.title} ({i.variant.weight})
                          </div>
                        ))}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#9A5B00]">
                        ₹{ord.pricing.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            ord.status === 'processing'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrderForStatus(ord);
                            setNewStatusValue(ord.status === 'processing' ? 'shipped' : ord.status);
                            setTrackingCarrier(
                              ord.tracking?.carrier || 'BlueDart Express / Delhivery'
                            );
                            setTrackingNumber(
                              ord.tracking?.trackingNumber ||
                                `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`
                            );
                            setTrackingUrl(ord.tracking?.trackingUrl || '');
                            setEstimatedDelivery(
                              ord.tracking?.estimatedDelivery || '5–7 Business Days'
                            );
                          }}
                          className="bg-[#1E3F20] text-white px-3 py-1.5 rounded-xl font-bold hover:bg-[#2D5A27] transition-colors cursor-pointer text-[11px]"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Products Catalog Management */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-[#EFE5D5] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1E3F20]">
                  Product Catalog &amp; Multi-Image Gallery
                </h3>
                <p className="text-xs text-[#786C5E]">
                  Add/edit category, price, actual MRP, upload main &amp; extra images, manage variants, and connect marketplace URLs.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="bg-[#E69500] hover:bg-[#D48B00] text-white px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product SKU</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5] flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#EFE5D5] shrink-0 bg-white">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-full h-full object-cover"
                      />
                      {prod.images.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          +{prod.images.length - 1} photos
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] bg-[#1E3F20] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                          {prod.categoryLabel}
                        </span>
                        {prod.isBestSeller && (
                          <span className="text-[10px] bg-[#E69500] text-white px-2 py-0.5 rounded-full font-bold">
                            Best Seller
                          </span>
                        )}
                        <span className="text-[10px] text-[#2D5A27] bg-[#2D5A27]/10 px-1.5 py-0.5 rounded font-bold">
                          {prod.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <h4 className="font-display text-sm font-bold text-[#1E3F20] truncate mt-1">
                        {prod.title}
                      </h4>
                      <p className="text-[11px] text-[#9A5B00] font-bold">
                        {prod.variants.map((v) => `${v.weight}: ₹${v.price} (MRP: ₹${v.originalPrice})`).join(' • ')}
                      </p>
                    </div>
                  </div>

                  {/* Multi-Channel Marketplace Status */}
                  <div className="bg-white p-3 rounded-xl border border-[#EFE5D5] text-xs space-y-1">
                    <span className="font-bold text-[#786C5E] text-[10px] uppercase tracking-wider block mb-1">
                      Connected Marketplaces:
                    </span>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          prod.marketplaceLinks?.amazonUrl
                            ? 'bg-orange-100 text-orange-800 font-semibold'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        Amazon {prod.marketplaceLinks?.amazonUrl ? '✓' : '—'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded ${
                          prod.marketplaceLinks?.flipkartUrl
                            ? 'bg-blue-100 text-blue-800 font-semibold'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        Flipkart {prod.marketplaceLinks?.flipkartUrl ? '✓' : '—'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded ${
                          prod.marketplaceLinks?.meeshoUrl
                            ? 'bg-pink-100 text-pink-800 font-semibold'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        Meesho {prod.marketplaceLinks?.meeshoUrl ? '✓' : '—'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded ${
                          prod.marketplaceLinks?.jiomartUrl
                            ? 'bg-cyan-100 text-cyan-800 font-semibold'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        JioMart {prod.marketplaceLinks?.jiomartUrl ? '✓' : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EFE5D5]">
                    {/* <span className="text-[11px] font-semibold text-[#2D5A27]">
                      NMR Batch: {prod.purityReport?.batchNo || 'Verified'}
                    </span> */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct({ ...prod });
                          setIsNewProduct(false);
                          setActiveModalTab('basic');
                        }}
                        className="bg-white border border-[#D9CDBF] text-[#1E3F20] px-3 py-1.5 rounded-xl text-xs font-bold hover:border-[#9A5B00] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Product &amp; Images</span>
                      </button>
                      <button
                        onClick={async () => {
                          const result = await deleteProduct(prod.id);
                          if (!result.success) {
                            setSaveErrorMsg(result.error || `Could not delete "${prod.title}".`);
                            setTimeout(() => setSaveErrorMsg(''), 6000);
                          }
                        }}
                        className="text-red-400 hover:text-red-600 p-1.5"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Categories Management */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl border border-[#EFE5D5] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#1E3F20]">FSSAI Categories ({categories.length})</h3>
                <p className="text-xs text-[#786C5E] mt-0.5">
                  Add, edit, or delete categories. Changes reflect instantly on the Navbar, Shop filters,
                  Categories page, home page, and the product category picker.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCategory({
                    id: `custom_${Date.now()}`,
                    fssaiCode: '',
                    name: '',
                    shortName: '',
                    fssaiOfficialTitle: '',
                    icon: '',
                    description: '',
                    featuredCount: 4,
                  });
                  setIsNewCategory(true);
                }}
                className="flex items-center gap-2 bg-[#1E3F20] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#16301A] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Category</span>
              </button>
            </div>

            <div className="space-y-3">
              {categories.map((cat) => {
                const catProductCount = products.filter((p) => p.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-[#EFE5D5] bg-[#FAF8F5]"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-[#FEF3E2] border border-[#EFE5D5] flex items-center justify-center text-xs font-bold text-[#9A5B00]">
                        {cat.fssaiCode || '—'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#1E3F20] text-sm truncate">{cat.shortName || cat.name}</p>
                        <p className="text-xs text-[#786C5E] truncate">{cat.fssaiOfficialTitle || cat.name}</p>
                        <p className="text-[11px] text-[#9A5B00] font-semibold mt-0.5">
                          {catProductCount} {catProductCount === 1 ? 'product' : 'products'} · id: {cat.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsNewCategory(false);
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#1E3F20] bg-white border border-[#EFE5D5] px-3 py-2 rounded-xl hover:border-[#9A5B00] transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      {categoryDeleteConfirmId === cat.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              deleteCategory(cat.id);
                              setCategoryDeleteConfirmId(null);
                            }}
                            className="text-xs font-bold text-white bg-red-500 px-3 py-2 rounded-xl hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setCategoryDeleteConfirmId(null)}
                            className="text-xs font-semibold text-[#786C5E] px-3 py-2 rounded-xl hover:bg-white transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCategoryDeleteConfirmId(cat.id)}
                          className="text-red-400 hover:text-red-600 p-2"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-sm text-[#786C5E] text-center py-8">
                  No categories yet — add your first one above.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Stock Section */}
        {activeTab === 'stock' && (
          <div className="bg-white rounded-3xl border border-[#EFE5D5] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1E3F20]">
                  Stock Management &amp; Inventory Quantities
                </h3>
                <p className="text-xs text-[#786C5E]">
                  Update inventory levels, track low stock items, and toggle in-stock availability across all SKUs.
                </p>
              </div>

              {lowStockCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{lowStockCount} Variants Low in Stock (&lt; 15 units)</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#EFE5D5] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE5D5] pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-12 h-12 rounded-xl object-cover border border-[#EFE5D5]"
                      />
                      <div>
                        <h4 className="font-display text-sm font-bold text-[#1E3F20]">
                          {prod.title}
                        </h4>
                        <span className="text-[11px] text-[#786C5E]">{prod.categoryLabel}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1E3F20]">
                        <input
                          type="checkbox"
                          checked={prod.inStock}
                          onChange={async (e) => {
                            const result = await updateProduct({ ...prod, inStock: e.target.checked });
                            if (!result.success) {
                              setSaveErrorMsg(result.error || `Could not update stock status for "${prod.title}".`);
                              setTimeout(() => setSaveErrorMsg(''), 6000);
                            }
                          }}
                          className="w-4 h-4 text-[#2D5A27] rounded"
                        />
                        <span>{prod.inStock ? 'Available For Sale' : 'Marked Out of Stock'}</span>
                      </label>

                      <button
                        onClick={() => {
                          setEditingProduct({ ...prod });
                          setIsNewProduct(false);
                          setActiveModalTab('variants');
                        }}
                        className="text-xs text-[#9A5B00] font-bold hover:underline"
                      >
                        Edit Variants →
                      </button>
                    </div>
                  </div>

                  {/* Variants Stock Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {prod.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className={`p-3 bg-white rounded-xl border ${
                          variant.stock < 15 ? 'border-amber-300' : 'border-[#EFE5D5]'
                        } flex items-center justify-between gap-2`}
                      >
                        <div>
                          <span className="font-bold text-xs text-[#1E3F20] block">
                            {variant.weight} ({variant.sku || 'SKU'})
                          </span>
                          <span className="text-[11px] text-[#9A5B00] font-bold">
                            ₹{variant.price} <span className="text-gray-400 font-normal">/ ₹{variant.originalPrice}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={variant.stock}
                            onChange={async (e) => {
                              const newStock = parseInt(e.target.value) || 0;
                              const updatedVariants = prod.variants.map((v) =>
                                v.id === variant.id ? { ...v, stock: newStock } : v
                              );
                              const result = await updateProduct({ ...prod, variants: updatedVariants });
                              if (!result.success) {
                                setSaveErrorMsg(result.error || `Could not update stock for "${prod.title}".`);
                                setTimeout(() => setSaveErrorMsg(''), 6000);
                              }
                            }}
                            className="w-16 bg-[#FAF8F5] border border-[#D9CDBF] rounded-lg px-2 py-1 text-xs text-center font-bold text-[#1E3F20] outline-none focus:border-[#9A5B00]"
                          />
                          <span className="text-[11px] text-gray-500">units</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Reviews Management Section */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl border border-[#EFE5D5] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1E3F20]">
                  Customer Reviews &amp; Feedback Moderation
                </h3>
                <p className="text-xs text-[#786C5E]">
                  Moderate authentic reviews, filter by product, delete spam, or publish new verified reviews.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-1.5 text-xs">
                  <Filter className="w-3.5 h-3.5 text-[#786C5E]" />
                  <select
                    value={reviewFilterProduct}
                    onChange={(e) => setReviewFilterProduct(e.target.value)}
                    className="bg-transparent outline-none font-semibold text-[#1E3F20]"
                  >
                    <option value="all">All Products ({reviews.length})</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setIsAddReviewModalOpen(true)}
                  className="bg-[#1E3F20] hover:bg-[#2D5A27] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReviews.map((rev) => {
                const prod = products.find((p) => p.id === rev.productId);
                return (
                  <div
                    key={rev.id}
                    className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5] flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1 text-[#E69500]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#E69500]" />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>

                      <div className="text-[11px] font-bold text-[#9A5B00] truncate mb-1">
                        For: {prod ? prod.title : rev.productId}
                      </div>

                      <h4 className="text-xs font-bold text-[#1E3F20] mb-1">{rev.title}</h4>
                      <p className="text-xs text-[#4B5563] leading-relaxed">"{rev.comment}"</p>
                    </div>

                    <div className="pt-3 border-t border-[#EFE5D5] flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-[#1E3F20] block">{rev.author}</span>
                        <span className="text-gray-400">{rev.location}</span>
                      </div>

                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 6: Razorpay Payment Gateway Settings */}
        {activeTab === 'razorpay' && (
          <div className="bg-white rounded-3xl border border-[#EFE5D5] p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0C2340] text-[#528FF0] px-2.5 py-0.5 rounded-full">
                  Razorpay Native API
                </span>
                <span className="text-xs text-[#2D5A27] font-semibold">UPI • Cards • NetBanking</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1E3F20] mt-1">
                Payment Gateway Configuration
              </h3>
              <p className="text-xs text-[#786C5E] mt-0.5">
                Input your Razorpay Key ID and Secret. Payments automatically capture and instantly transition orders to "Processing".
              </p>
            </div>

            <form onSubmit={handleSaveRazorpay} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E3F20] mb-1">
                  Razorpay Key ID *
                </label>
                <input
                  type="text"
                  required
                  value={razorpaySettingsForm.keyId}
                  onChange={(e) =>
                    setRazorpaySettingsForm({ ...razorpaySettingsForm, keyId: e.target.value })
                  }
                  className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9A5B00]"
                  placeholder="rzp_test_xxxxxx or rzp_live_xxxxxx"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3F20] mb-1">
                  Razorpay Key Secret *
                </label>
                <input
                  type="password"
                  required
                  value={razorpaySettingsForm.keySecret}
                  onChange={(e) =>
                    setRazorpaySettingsForm({ ...razorpaySettingsForm, keySecret: e.target.value })
                  }
                  className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9A5B00]"
                  placeholder="Enter your secret key"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#EFE5D5] bg-[#FAF8F5] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={razorpaySettingsForm.isLive}
                    onChange={(e) =>
                      setRazorpaySettingsForm({ ...razorpaySettingsForm, isLive: e.target.checked })
                    }
                    className="w-4 h-4 text-[#2D5A27] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1E3F20] block">
                      Live Production Mode
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Uncheck for Sandbox Test Simulator
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#EFE5D5] bg-[#FAF8F5] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={razorpaySettingsForm.autoCapture}
                    onChange={(e) =>
                      setRazorpaySettingsForm({
                        ...razorpaySettingsForm,
                        autoCapture: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#2D5A27] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1E3F20] block">
                      Instant Auto-Capture
                    </span>
                    <span className="text-[11px] text-[#2D5A27] font-semibold">
                      Auto transitions to Processing
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="bg-[#1E3F20] hover:bg-[#2D5A27] text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Razorpay Credentials</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 7: Custom SMTP & Email Notifications */}
        {activeTab === 'smtp' && (
          <div className="bg-white rounded-3xl border border-[#EFE5D5] p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2D5A27] text-white px-2.5 py-0.5 rounded-full">
                  Transactional SMTP
                </span>
                <span className="text-xs text-[#786C5E]">Automated Order Confirmations &amp; Dispatch Alerts</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1E3F20] mt-1">
                Custom SMTP Server Credentials
              </h3>
              <p className="text-xs text-[#786C5E] mt-0.5">
                Every order triggers an automated HTML email with the mandatory note: <em>"Standard Delivery Time: 5–7 Business Days across India."</em>
              </p>
            </div>

            <form onSubmit={handleSaveSMTP} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E3F20] mb-1">
                    SMTP Host *
                  </label>
                  <input
                    type="text"
                    required
                    value={smtpSettingsForm.host}
                    onChange={(e) =>
                      setSmtpSettingsForm({ ...smtpSettingsForm, host: e.target.value })
                    }
                    className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9A5B00]"
                    placeholder="smtp.bloombeenaturals.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3F20] mb-1">
                    SMTP Port *
                  </label>
                  <input
                    type="number"
                    required
                    value={smtpSettingsForm.port}
                    onChange={(e) =>
                      setSmtpSettingsForm({
                        ...smtpSettingsForm,
                        port: parseInt(e.target.value) || 587,
                      })
                    }
                    className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9A5B00]"
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E3F20] mb-1">
                    Encryption
                  </label>
                  <select
                    value={smtpSettingsForm.encryption}
                    onChange={(e: any) =>
                      setSmtpSettingsForm({ ...smtpSettingsForm, encryption: e.target.value })
                    }
                    className="w-full text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 outline-none"
                  >
                    <option value="tls">STARTTLS (Port 587)</option>
                    <option value="ssl">SSL / TLS (Port 465)</option>
                    <option value="none">None (Port 25)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3F20] mb-1">
                    SMTP Username / Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={smtpSettingsForm.username}
                    onChange={(e) =>
                      setSmtpSettingsForm({ ...smtpSettingsForm, username: e.target.value })
                    }
                    className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9A5B00]"
                    placeholder="orders@bloombeenaturals.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3F20] mb-1">
                    SMTP Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={smtpSettingsForm.password}
                    onChange={(e) =>
                      setSmtpSettingsForm({ ...smtpSettingsForm, password: e.target.value })
                    }
                    className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9A5B00]"
                    placeholder="Password / App Password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#1E3F20] hover:bg-[#2D5A27] text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save SMTP Configuration</span>
              </button>
            </form>

            {/* Test Email Section */}
            <div className="pt-6 border-t border-[#EFE5D5] space-y-3">
              <h4 className="font-bold text-sm text-[#1E3F20]">
                Send Test Order Confirmation HTML Email
              </h4>
              <form onSubmit={handleSendTestEmail} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter recipient test email..."
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="flex-1 text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9A5B00]"
                />
                <button
                  type="submit"
                  className="bg-[#9A5B00] hover:bg-[#804B00] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Email</span>
                </button>
              </form>
              {testEmailStatus && (
                <p className="text-xs text-[#2D5A27] font-semibold">{testEmailStatus}</p>
              )}
            </div>
          </div>
        )}

        {/* Tab: Shipping Charges */}
        {activeTab === 'shipping' && (
          <div className="bg-white rounded-3xl border border-[#EFE5D5] p-6 sm:p-8 shadow-xs max-w-3xl space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2D5A27] text-white px-2.5 py-0.5 rounded-full">
                  Live on Storefront
                </span>
                <span className="text-xs text-[#786C5E]">Applied to cart, checkout &amp; order emails instantly</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1E3F20] mt-1 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#9A5B00]" />
                Shipping Charges
              </h3>
              <p className="text-xs text-[#786C5E] mt-0.5">
                Set the flat shipping fee and the free-shipping cart threshold. Changes save to the backend and apply to every new cart calculation right away.
              </p>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E3F20] mb-1">
                    Standard Shipping Fee (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={storeSettingsForm.standardShippingFee}
                    onChange={(e) =>
                      setStoreSettingsForm({
                        ...storeSettingsForm,
                        standardShippingFee: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9A5B00]"
                    placeholder="60"
                  />
                  <p className="text-[10px] text-[#9A8B79] mt-1">
                    Charged on orders below the free-shipping threshold.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3F20] mb-1">
                    Free Shipping Threshold (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={storeSettingsForm.freeShippingThreshold}
                    onChange={(e) =>
                      setStoreSettingsForm({
                        ...storeSettingsForm,
                        freeShippingThreshold: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-full text-xs font-mono bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9A5B00]"
                    placeholder="799"
                  />
                  <p className="text-[10px] text-[#9A8B79] mt-1">
                    Carts at or above this subtotal ship free. Set to 0 to always charge the flat fee.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3F20] mb-1">
                  Delivery Estimate Note
                </label>
                <input
                  type="text"
                  value={storeSettingsForm.standardDeliveryNote}
                  onChange={(e) =>
                    setStoreSettingsForm({
                      ...storeSettingsForm,
                      standardDeliveryNote: e.target.value,
                    })
                  }
                  className="w-full text-xs bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#9A5B00]"
                  placeholder="5–7 Business Days across India"
                />
                <p className="text-[10px] text-[#9A8B79] mt-1">
                  Shown at checkout and in order confirmation emails.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-[#9A5B00] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#786C5E]">
                  Preview: a cart of <strong>₹{Math.max(0, storeSettingsForm.freeShippingThreshold - 1)}</strong> would be charged{' '}
                  <strong>₹{storeSettingsForm.standardShippingFee}</strong> shipping, while a cart of{' '}
                  <strong>₹{storeSettingsForm.freeShippingThreshold}</strong> or more ships{' '}
                  <strong>FREE</strong>.
                </p>
              </div>

              <button
                type="submit"
                className="bg-[#1E3F20] hover:bg-[#2D5A27] text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Shipping Settings</span>
              </button>

              {saveSuccessMsg && (
                <p className="text-xs text-[#2D5A27] font-semibold">{saveSuccessMsg}</p>
              )}
              {saveErrorMsg && (
                <p className="text-xs text-red-600 font-semibold">{saveErrorMsg}</p>
              )}
            </form>
          </div>
        )}

        {/* Tab 8: Wholesale Inquiries */}
        {activeTab === 'wholesale' && (
          <div className="bg-white rounded-3xl border border-[#EFE5D5] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-display text-lg font-bold text-[#1E3F20]">
              B2B Wholesale &amp; Bulk Procurement Inquiries ({wholesaleInquiries.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#EFE5D5] text-[#786C5E] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Company &amp; Contact</th>
                    <th className="py-3 px-3">GST Number</th>
                    <th className="py-3 px-3">Estimated Volume</th>
                    <th className="py-3 px-3">Message</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE5D5]">
                  {wholesaleInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#1E3F20] block">{inq.companyName}</span>
                        <span className="text-gray-500 text-[11px] block">{inq.contactPerson} • {inq.email}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">{inq.gstNumber || '—'}</td>
                      <td className="py-3 px-3 font-bold text-[#9A5B00]">{inq.estimatedMonthlyKg} kg/month</td>
                      <td className="py-3 px-3 max-w-[200px] truncate text-gray-600">{inq.message}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            inq.status === 'new'
                              ? 'bg-blue-100 text-blue-800'
                              : inq.status === 'contacted'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={inq.status}
                          onChange={(e: any) => updateWholesaleStatus(inq.id, e.target.value)}
                          className="bg-white border border-[#D9CDBF] rounded-lg px-2 py-1 text-[11px] font-semibold text-[#1E3F20]"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="approved">Approved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 9: Email Logs */}
        {activeTab === 'emailLogs' && (
          <div className="bg-white rounded-3xl border border-[#EFE5D5] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-display text-lg font-bold text-[#1E3F20]">
              Transactional Email Dispatch Logs ({emailLogs.length})
            </h3>
            <div className="space-y-3">
              {emailLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5] flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1E3F20]">{log.recipientEmail}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {log.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium text-[11px] mt-0.5">{log.subject}</p>
                    <span className="text-gray-400 text-[10px]">{log.sentAt}</span>
                  </div>

                  <button
                    onClick={() => setViewingEmailHtml(log.htmlContent)}
                    className="bg-white border border-[#D9CDBF] text-[#1E3F20] px-3 py-1.5 rounded-xl font-bold text-xs hover:border-[#9A5B00] flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View HTML</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Order Status Updater Modal */}
      {selectedOrderForStatus && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#EFE5D5] overflow-hidden animate-scale p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#1E3F20]">
                Update Status for Order #{selectedOrderForStatus.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedOrderForStatus(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1E3F20] mb-1">Select Order Status:</label>
                <select
                  value={newStatusValue}
                  onChange={(e: any) => setNewStatusValue(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none font-semibold text-[#1E3F20]"
                >
                  <option value="pending_payment">Pending Payment</option>
                  <option value="processing">Processing (Being Packed)</option>
                  <option value="shipped">Shipped / Dispatched with Tracking</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {newStatusValue === 'shipped' && (
                <div className="space-y-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EFE5D5]">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Courier Partner:</label>
                    <input
                      type="text"
                      value={trackingCarrier}
                      onChange={(e) => setTrackingCarrier(e.target.value)}
                      className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">AWB Tracking Number:</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full bg-white font-mono border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Live Tracking URL:</label>
                    <input
                      type="text"
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                      className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                      placeholder="https://track.bloombeenaturals.com?awb=..."
                    />
                    <p className="text-[10px] text-[#9A8B79] mt-1">
                      Optional. The "Open Courier Live Tracker" button only appears on the customer's tracking page once a URL is added here.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-[#F0F7EE] p-3 rounded-xl text-[11px] text-[#2D5A27] font-semibold">
                ✓ Saving will immediately dispatch an automated HTML update email to {selectedOrderForStatus.customer.email}.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleApplyOrderStatus}
                  className="flex-1 bg-[#1E3F20] text-white py-2.5 rounded-xl font-bold hover:bg-[#2D5A27] transition-colors cursor-pointer"
                >
                  Save &amp; Trigger Email
                </button>
                <button
                  onClick={() => setSelectedOrderForStatus(null)}
                  className="px-4 py-2.5 border border-[#D9CDBF] rounded-xl font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product SKU Edit / Create Comprehensive Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#EFE5D5] overflow-hidden animate-scale my-auto max-h-[94vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#1E3F20] text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  {isNewProduct ? 'Add New Product SKU' : `Edit Product: ${editingProduct.title}`}
                </h3>
                <span className="text-xs text-white/80">{editingProduct.categoryLabel}</span>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 bg-[#FAF8F5] border-b border-[#EFE5D5] overflow-x-auto">
              {[
                { id: 'basic', label: 'General & Description' },
                { id: 'images', label: `Images (${editingProduct.images.length})` },
                { id: 'variants', label: `Variants & Prices (${editingProduct.variants.length})` },
                // { id: 'purity', label: 'NMR & Origin' },
                { id: 'nutrition', label: 'Nutrition & Benefits' },
                { id: 'marketplaces', label: 'Marketplaces' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-colors shrink-0 cursor-pointer ${
                    activeModalTab === tab.id
                      ? 'bg-white text-[#1E3F20] border-t-2 border-[#1E3F20] shadow-2xs'
                      : 'text-gray-500 hover:text-[#1E3F20]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              
              {/* SUBTAB 1: Basic Information & Descriptions */}
              {activeModalTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#1E3F20] mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.title}
                        onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1E3F20] mb-1">FSSAI Category *</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e: any) => {
                          const val = e.target.value as ProductCategory;
                          // Driven directly from categories — the
                          // same list every other screen (Shop, Navbar, Categories
                          // page, home FSSAI grid) reads from — so a product's
                          // category always lines up with the real category id
                          // and shows up correctly (and dynamically) everywhere.
                          const cat = categories.find((c) => c.id === val);
                          setEditingProduct({
                            ...editingProduct,
                            category: val,
                            categoryLabel: cat?.shortName || editingProduct.categoryLabel,
                            fssaiCategoryCode: cat ? `FSSAI Cat ${cat.fssaiCode} - ${cat.name}` : editingProduct.fssaiCategoryCode,
                          });
                        }}
                        className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00] font-semibold"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            Cat {cat.fssaiCode}: {cat.shortName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#1E3F20] mb-1">Display Category Label</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.categoryLabel}
                        onChange={(e) => setEditingProduct({ ...editingProduct, categoryLabel: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1E3F20] mb-1">FSSAI Category Code</label>
                      <input
                        type="text"
                        value={editingProduct.fssaiCategoryCode || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, fssaiCategoryCode: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1E3F20] mb-1">Subtitle / Short description *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.subtitle}
                      onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1E3F20] mb-1">Full Detailed Product Description *</label>
                    <textarea
                      rows={4}
                      required
                      value={editingProduct.fullDescription}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fullDescription: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl p-3 outline-none focus:border-[#9A5B00] resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1E3F20]">
                      <input
                        type="checkbox"
                        checked={editingProduct.inStock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                        className="w-4 h-4 text-[#2D5A27] rounded"
                      />
                      <span>Product In Stock &amp; Available</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1E3F20]">
                      <input
                        type="checkbox"
                        checked={editingProduct.isBestSeller || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                        className="w-4 h-4 text-[#E69500] rounded"
                      />
                      <span>Mark as Best Seller</span>
                    </label>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: Main Image & Other Images Upload */}
              {activeModalTab === 'images' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-[#1E3F20] mb-1">Main Product Image (Primary)</label>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#D9CDBF] bg-[#FAF8F5] shrink-0">
                        {editingProduct.images[0] ? (
                          <img src={editingProduct.images[0]} alt="Main" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          placeholder="Paste image URL..."
                          value={editingProduct.images[0] || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              images: [e.target.value, ...editingProduct.images.slice(1)],
                            })
                          }
                          className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00]"
                        />
                        <div className="flex items-center gap-2">
                          <label className="bg-white border border-[#D9CDBF] text-[#1E3F20] px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:border-[#9A5B00]">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Image from Device</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageFileUpload(e, true)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EFE5D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-[#1E3F20]">
                        Additional Product Images ({editingProduct.images.length - 1} Extra Photos)
                      </label>
                      <label className="bg-[#1E3F20] text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-[#2D5A27]">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload New Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, false)}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {editingProduct.images.slice(1).map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFE5D5] flex items-center gap-3"
                        >
                          <img
                            src={imgUrl}
                            alt={`Extra ${idx + 1}`}
                            className="w-14 h-14 rounded-lg object-cover border border-[#D9CDBF] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={imgUrl}
                              onChange={(e) => {
                                const newImgs = [...editingProduct.images];
                                newImgs[idx + 1] = e.target.value;
                                setEditingProduct({ ...editingProduct, images: newImgs });
                              }}
                              className="w-full bg-white border border-[#D9CDBF] rounded-lg px-2 py-1 text-[11px] outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newImgs = editingProduct.images.filter((_, i) => i !== idx + 1);
                              setEditingProduct({ ...editingProduct, images: newImgs });
                            }}
                            className="text-red-400 hover:text-red-600 p-1"
                            title="Remove image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="newExtraImageUrlInput"
                        placeholder="Or paste an extra image URL here..."
                        className="flex-1 bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('newExtraImageUrlInput') as HTMLInputElement;
                          if (input && input.value.trim()) {
                            setEditingProduct({
                              ...editingProduct,
                              images: [...editingProduct.images, input.value.trim()],
                            });
                            input.value = '';
                          }
                        }}
                        className="bg-[#9A5B00] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#804b00]"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: Variants, Prices, Actual MRP & Stock */}
              {activeModalTab === 'variants' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#1E3F20]">Product Variants &amp; Pricing</h4>
                      <p className="text-[11px] text-[#786C5E]">
                        Configure pack sizes/weights, selling price, actual price (MRP), stock levels, and SKUs.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newVariant: ProductVariant = {
                          id: `v-${Date.now()}`,
                          weight: '500g',
                          price: 599,
                          originalPrice: 799,
                          stock: 50,
                          sku: `BBN-VAR-${editingProduct.variants.length + 1}`,
                        };
                        setEditingProduct({
                          ...editingProduct,
                          variants: [...editingProduct.variants, newVariant],
                        });
                      }}
                      className="bg-[#1E3F20] text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 hover:bg-[#2D5A27]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Variant</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingProduct.variants.map((variant, vIdx) => {
                      const discount =
                        variant.originalPrice > variant.price
                          ? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
                          : 0;

                      return (
                        <div
                          key={variant.id || vIdx}
                          className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#EFE5D5] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#1E3F20]">
                              Variant #{vIdx + 1}: {variant.weight}
                            </span>
                            <div className="flex items-center gap-2">
                              {discount > 0 && (
                                <span className="bg-[#E69500] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                  {discount}% SAVINGS
                                </span>
                              )}
                              {editingProduct.variants.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = editingProduct.variants.filter((_, i) => i !== vIdx);
                                    setEditingProduct({ ...editingProduct, variants: updated });
                                  }}
                                  className="text-red-400 hover:text-red-600 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Weight / Size *</label>
                              <input
                                type="text"
                                required
                                value={variant.weight}
                                onChange={(e) => {
                                  const updated = [...editingProduct.variants];
                                  updated[vIdx].weight = e.target.value;
                                  setEditingProduct({ ...editingProduct, variants: updated });
                                }}
                                className="w-full bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 outline-none font-semibold"
                                placeholder="e.g. 500g"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Selling Price (₹) *</label>
                              <input
                                type="number"
                                required
                                min={1}
                                value={variant.price}
                                onChange={(e) => {
                                  const updated = [...editingProduct.variants];
                                  updated[vIdx].price = Number(e.target.value) || 0;
                                  setEditingProduct({ ...editingProduct, variants: updated });
                                }}
                                className="w-full bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 outline-none font-bold text-[#9A5B00]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Actual Price / MRP (₹) *</label>
                              <input
                                type="number"
                                required
                                min={1}
                                value={variant.originalPrice}
                                onChange={(e) => {
                                  const updated = [...editingProduct.variants];
                                  updated[vIdx].originalPrice = Number(e.target.value) || 0;
                                  setEditingProduct({ ...editingProduct, variants: updated });
                                }}
                                className="w-full bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Stock Quantity *</label>
                              <input
                                type="number"
                                required
                                min={0}
                                value={variant.stock}
                                onChange={(e) => {
                                  const updated = [...editingProduct.variants];
                                  updated[vIdx].stock = parseInt(e.target.value) || 0;
                                  setEditingProduct({ ...editingProduct, variants: updated });
                                }}
                                className="w-full bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-600 mb-0.5">SKU Code</label>
                              <input
                                type="text"
                                value={variant.sku}
                                onChange={(e) => {
                                  const updated = [...editingProduct.variants];
                                  updated[vIdx].sku = e.target.value;
                                  setEditingProduct({ ...editingProduct, variants: updated });
                                }}
                                className="w-full bg-white font-mono border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 outline-none text-[11px]"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUBTAB 4: NMR Spectroscopy & Origin Traceability */}
              {activeModalTab === 'purity' && (
                <div className="space-y-4">
                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5] space-y-3">
                    <h4 className="font-bold text-[#1E3F20] text-xs">Origin &amp; Harvesting Traceability</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">📍 Origin Location:</label>
                        <input
                          type="text"
                          value={editingProduct.origin}
                          onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value })}
                          className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none"
                          placeholder="e.g. Pristine Valleys of Jammu & Kashmir, Himalayas, India"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">🌸 Source / Variety:</label>
                        <input
                          type="text"
                          value={editingProduct.floraSource}
                          onChange={(e) => setEditingProduct({ ...editingProduct, floraSource: e.target.value })}
                          className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none"
                          placeholder="e.g. Wild Himalayan Clover, Kashmir Apple Blossom"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">⚙️ Process / Extraction Method:</label>
                      <input
                        type="text"
                        value={editingProduct.harvestingMethod}
                        onChange={(e) => setEditingProduct({ ...editingProduct, harvestingMethod: e.target.value })}
                        className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none"
                        placeholder="e.g. Traditional Gravity Cold-Filtration (<35°C, Zero Adulteration)"
                      />
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5] space-y-3">
                    <h4 className="font-bold text-[#1E3F20] text-xs">Purity Assurance &amp; NMR Spectroscopy</h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1E3F20]">
                        <input
                          type="checkbox"
                          checked={editingProduct.purityReport?.nmrTested}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              purityReport: { ...editingProduct.purityReport, nmrTested: e.target.checked },
                            })
                          }
                          className="w-4 h-4 text-[#2D5A27] rounded"
                        />
                        <span>NMR Tested (100% Passed)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1E3F20]">
                        <input
                          type="checkbox"
                          checked={editingProduct.purityReport?.c4SugarFree}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              purityReport: { ...editingProduct.purityReport, c4SugarFree: e.target.checked },
                            })
                          }
                          className="w-4 h-4 text-[#2D5A27] rounded"
                        />
                        <span>0% C4 Adulteration Free</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold text-[#1E3F20]">
                        <input
                          type="checkbox"
                          checked={editingProduct.purityReport?.pollenRich}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              purityReport: { ...editingProduct.purityReport, pollenRich: e.target.checked },
                            })
                          }
                          className="w-4 h-4 text-[#2D5A27] rounded"
                        />
                        <span>Pollen Rich Raw Harvest</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Batch Number:</label>
                        <input
                          type="text"
                          value={editingProduct.purityReport?.batchNo || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              purityReport: { ...editingProduct.purityReport, batchNo: e.target.value },
                            })
                          }
                          className="w-full bg-white font-mono border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Moisture Content (%):</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editingProduct.purityReport?.moisturePercent || 17.2}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              purityReport: {
                                ...editingProduct.purityReport,
                                moisturePercent: parseFloat(e.target.value) || 17.2,
                              },
                            })
                          }
                          className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Certified Testing Lab Name:</label>
                        <input
                          type="text"
                          value={editingProduct.purityReport?.labName || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              purityReport: { ...editingProduct.purityReport, labName: e.target.value },
                            })
                          }
                          className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">FSSAI License Number:</label>
                        <input
                          type="text"
                          value={editingProduct.purityReport?.fssaiLicense || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              purityReport: { ...editingProduct.purityReport, fssaiLicense: e.target.value },
                            })
                          }
                          className="w-full bg-white font-mono border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Lab Certificate Report URL / Image:</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={editingProduct.purityReport?.certificateUrl || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            purityReport: { ...editingProduct.purityReport, certificateUrl: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 5: Nutritional Information & Benefits */}
              {activeModalTab === 'nutrition' && (
                <div className="space-y-4">
                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#1E3F20]">Nutritional Information (Per 100g)</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newFacts = [
                            ...(editingProduct.nutritionalFacts || []),
                            { nutrient: 'New Nutrient', per100g: '0.0 g' },
                          ];
                          setEditingProduct({ ...editingProduct, nutritionalFacts: newFacts });
                        }}
                        className="bg-[#1E3F20] text-white px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-[#2D5A27]"
                      >
                        + Add Nutrient
                      </button>
                    </div>

                    <div className="space-y-2">
                      {editingProduct.nutritionalFacts &&
                        editingProduct.nutritionalFacts.map((fact, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={fact.nutrient}
                              onChange={(e) => {
                                const newFacts = [...editingProduct.nutritionalFacts];
                                newFacts[fIdx].nutrient = e.target.value;
                                setEditingProduct({ ...editingProduct, nutritionalFacts: newFacts });
                              }}
                              className="flex-1 bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 text-xs outline-none"
                              placeholder="Nutrient Name"
                            />
                            <input
                              type="text"
                              value={fact.per100g}
                              onChange={(e) => {
                                const newFacts = [...editingProduct.nutritionalFacts];
                                newFacts[fIdx].per100g = e.target.value;
                                setEditingProduct({ ...editingProduct, nutritionalFacts: newFacts });
                              }}
                              className="w-32 bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 text-xs outline-none font-bold text-[#9A5B00]"
                              placeholder="Value"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFacts = editingProduct.nutritionalFacts.filter((_, i) => i !== fIdx);
                                setEditingProduct({ ...editingProduct, nutritionalFacts: newFacts });
                              }}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5] space-y-3">
                    <h4 className="font-bold text-[#1E3F20]">Taste Notes &amp; Wellness Benefits</h4>
                    
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Taste Palette Description:</label>
                      <input
                        type="text"
                        value={editingProduct.tasteNotes}
                        onChange={(e) => setEditingProduct({ ...editingProduct, tasteNotes: e.target.value })}
                        className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-gray-700">Wellness Benefits (Bullet Points):</label>
                        <button
                          type="button"
                          onClick={() => {
                            const newBenefits = [...(editingProduct.benefits || []), 'New Health Benefit'];
                            setEditingProduct({ ...editingProduct, benefits: newBenefits });
                          }}
                          className="text-[#9A5B00] font-bold text-xs"
                        >
                          + Add Benefit
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {editingProduct.benefits &&
                          editingProduct.benefits.map((benefit, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={benefit}
                                onChange={(e) => {
                                  const newBenefits = [...editingProduct.benefits];
                                  newBenefits[bIdx] = e.target.value;
                                  setEditingProduct({ ...editingProduct, benefits: newBenefits });
                                }}
                                className="flex-1 bg-white border border-[#D9CDBF] rounded-lg px-2.5 py-1.5 text-xs outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newBenefits = editingProduct.benefits.filter((_, i) => i !== bIdx);
                                  setEditingProduct({ ...editingProduct, benefits: newBenefits });
                                }}
                                className="text-red-400 hover:text-red-600 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 6: Marketplace URLs */}
              {activeModalTab === 'marketplaces' && (
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EFE5D5] space-y-3">
                  <h4 className="font-bold text-[#1E3F20] uppercase tracking-wider text-[11px]">
                    Multi-Channel Marketplace URLs
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-0.5">Amazon URL:</label>
                      <input
                        type="url"
                        placeholder="https://amazon.in/dp/..."
                        value={editingProduct.marketplaceLinks?.amazonUrl || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            marketplaceLinks: {
                              ...editingProduct.marketplaceLinks,
                              amazonUrl: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-0.5">Flipkart URL:</label>
                      <input
                        type="url"
                        placeholder="https://flipkart.com/..."
                        value={editingProduct.marketplaceLinks?.flipkartUrl || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            marketplaceLinks: {
                              ...editingProduct.marketplaceLinks,
                              flipkartUrl: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-0.5">Meesho URL:</label>
                      <input
                        type="url"
                        placeholder="https://meesho.com/..."
                        value={editingProduct.marketplaceLinks?.meeshoUrl || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            marketplaceLinks: {
                              ...editingProduct.marketplaceLinks,
                              meeshoUrl: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-0.5">JioMart URL:</label>
                      <input
                        type="url"
                        placeholder="https://jiomart.com/..."
                        value={editingProduct.marketplaceLinks?.jiomartUrl || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            marketplaceLinks: {
                              ...editingProduct.marketplaceLinks,
                              jiomartUrl: e.target.value,
                            },
                          })
                        }
                        className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Save Footer */}
              {saveErrorMsg && (
                <div className="bg-red-50 text-red-700 border border-red-300 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{saveErrorMsg}</span>
                </div>
              )}
              <div className="flex gap-2 pt-3 border-t border-[#EFE5D5] sticky bottom-0 bg-white">
                <button
                  type="submit"
                  className="flex-1 bg-[#1E3F20] text-white py-3 rounded-xl font-bold hover:bg-[#2D5A27] transition-colors cursor-pointer text-xs"
                >
                  Save Product SKU, Images &amp; Details
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-3 border border-[#D9CDBF] rounded-xl font-semibold hover:bg-gray-50 cursor-pointer text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add/Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-60 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#EFE5D5] overflow-hidden animate-scale my-auto max-h-[94vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#1E3F20] text-white flex items-center justify-between shrink-0">
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {isNewCategory ? 'Add New Category' : `Edit Category: ${editingCategory.shortName || editingCategory.name}`}
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingCategory) return;
                if (isNewCategory) {
                  addCategory(editingCategory);
                } else {
                  updateCategory(editingCategory);
                }
                setEditingCategory(null);
                setIsNewCategory(false);
                setSaveSuccessMsg(`Category "${editingCategory.shortName || editingCategory.name}" saved!`);
                setTimeout(() => setSaveSuccessMsg(''), 3000);
              }}
              className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs"
            >
              <div>
                <label className="block font-bold text-[#1E3F20] mb-1">Category ID (used internally) *</label>
                <input
                  required
                  disabled={!isNewCategory}
                  value={editingCategory.id}
                  onChange={(e) => setEditingCategory({ ...editingCategory, id: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00] font-semibold disabled:opacity-60"
                  placeholder="e.g. spices_salts"
                />
                {!isNewCategory && (
                  <p className="text-[10px] text-[#786C5E] mt-1">
                    The id can't be changed after creation — existing products already reference it.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1E3F20] mb-1">FSSAI Code *</label>
                  <input
                    required
                    value={editingCategory.fssaiCode}
                    onChange={(e) => setEditingCategory({ ...editingCategory, fssaiCode: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00] font-semibold"
                    placeholder="e.g. 12"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1E3F20] mb-1">Icon Label</label>
                  <input
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00] font-semibold"
                    placeholder="e.g. Spices"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1E3F20] mb-1">Short Name (shown in tabs/menus) *</label>
                <input
                  required
                  value={editingCategory.shortName}
                  onChange={(e) => setEditingCategory({ ...editingCategory, shortName: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00] font-semibold"
                  placeholder="e.g. Salts & Pure Spices"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E3F20] mb-1">Full Category Name *</label>
                <input
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00] font-semibold"
                  placeholder="e.g. Salts, Spices, Soups & Seasonings"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E3F20] mb-1">Official FSSAI Title</label>
                <input
                  value={editingCategory.fssaiOfficialTitle}
                  onChange={(e) => setEditingCategory({ ...editingCategory, fssaiOfficialTitle: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00] font-semibold"
                  placeholder="e.g. 12 - Salts, Spices, Soups & Sauces"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E3F20] mb-1">Description</label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none focus:border-[#9A5B00] font-semibold resize-none"
                  placeholder="Short blurb shown on the home page category grid"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1E3F20] text-white py-3 rounded-xl font-bold hover:bg-[#16301A] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isNewCategory ? 'Add Category' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setIsNewCategory(false);
                  }}
                  className="px-5 py-3 border border-[#D9CDBF] rounded-xl font-semibold hover:bg-gray-50 cursor-pointer text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add Review Modal */}
      {isAddReviewModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#EFE5D5] overflow-hidden animate-scale p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#1E3F20]">
                Add Verified Customer Review
              </h3>
              <button
                onClick={() => setIsAddReviewModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdminReview} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1E3F20] mb-1">Select Product *</label>
                <select
                  required
                  value={newAdminReview.productId}
                  onChange={(e) => setNewAdminReview({ ...newAdminReview, productId: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none font-semibold text-[#1E3F20]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1E3F20] mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Priya Sharma"
                    value={newAdminReview.author}
                    onChange={(e) => setNewAdminReview({ ...newAdminReview, author: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1E3F20] mb-1">City, State</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={newAdminReview.location}
                    onChange={(e) => setNewAdminReview({ ...newAdminReview, location: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1E3F20] mb-1">Star Rating (1 to 5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewAdminReview({ ...newAdminReview, rating: star })}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newAdminReview.rating ? 'fill-[#E69500] text-[#E69500]' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#9A5B00] ml-2">
                    {newAdminReview.rating} Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1E3F20] mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Best authentic wild honey in India"
                  value={newAdminReview.title}
                  onChange={(e) => setNewAdminReview({ ...newAdminReview, title: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E3F20] mb-1">Review Comments *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Customer tasting notes and feedback..."
                  value={newAdminReview.comment}
                  onChange={(e) => setNewAdminReview({ ...newAdminReview, comment: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D9CDBF] rounded-xl p-3 outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1E3F20] hover:bg-[#2D5A27] text-white py-2.5 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Publish Verified Review
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddReviewModalOpen(false)}
                  className="px-4 py-2.5 border border-[#D9CDBF] rounded-xl font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HTML Email Viewer Drawer Modal */}
      {viewingEmailHtml && (
        <div className="fixed inset-0 z-60 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#EFE5D5] overflow-hidden animate-scale max-h-[90vh] flex flex-col">
            <div className="p-4 bg-[#1E3F20] text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">Transactional HTML Email Preview</h4>
              <button
                onClick={() => setViewingEmailHtml(null)}
                className="p-1 text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className="p-6 overflow-y-auto bg-[#FAF8F5]"
              dangerouslySetInnerHTML={{ __html: viewingEmailHtml }}
            />
          </div>
        </div>
      )}

    </div>
  );
};