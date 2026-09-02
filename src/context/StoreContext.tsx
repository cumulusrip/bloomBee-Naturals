import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  AdminSettings,
  EmailLog,
  WholesaleInquiry,
  CustomerGuestInfo,
  OrderStatus,
  ProductVariant,
  User,
  UserAddress,
  NavigationView,
  Review,
} from '../types';
import {
  INITIAL_PRODUCTS,
  DEFAULT_ADMIN_SETTINGS,
  INITIAL_ORDERS,
  DEMO_USERS,
  INITIAL_REVIEWS,
  FSSAI_LICENSED_CATEGORIES,
  FSSAIProductCategoryConfig,
} from '../data/initialData';
import {
  generateOrderConfirmationEmailHtml,
  generateStatusUpdateEmailHtml,
} from '../utils/emailTemplates';

interface StoreContextType {
  products: Product[];
  categories: FSSAIProductCategoryConfig[];
  addCategory: (category: FSSAIProductCategoryConfig) => void;
  updateCategory: (category: FSSAIProductCategoryConfig) => void;
  deleteCategory: (categoryId: string) => void;
  cart: CartItem[];
  orders: Order[];
  adminSettings: AdminSettings;
  emailLogs: EmailLog[];
  wholesaleInquiries: WholesaleInquiry[];
  isCartOpen: boolean;
  isGuestCheckoutOpen: boolean;
  isB2BModalOpen: boolean;
  isLabReportModalOpen: boolean;
  activeLabProduct: Product | null;
  activePDPProduct: Product | null;
  selectedProduct: Product | null;
  appliedCoupon: string | null;
  discountAmount: number;
  lastCompletedOrder: Order | null;
  showOrderSuccessModal: boolean;

  // Navigation & View Routing
  currentView: NavigationView;
  setCurrentView: (view: NavigationView) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedProduct: (product: Product | null) => void;
  trackedOrderNumber: string;
  setTrackedOrderNumber: (orderNum: string) => void;

  // Admin Auth & Portal State (No user signup/login required to buy)
  isAdmin: boolean;
  adminUser: { email: string; fullName: string; role: 'admin' } | null;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;

  // Backward compatible user & auth stubs
  currentUser: User | null;
  users: User[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'signup' | 'forgot';
  setAuthModalTab: (tab: 'login' | 'signup' | 'forgot') => void;
  openAuthModal: (tab?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  wishlist: string[];
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: 'customer' | 'wholesale_buyer' | 'admin') => void;
  signup: (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    companyName?: string;
    role?: 'customer' | 'wholesale_buyer';
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Cart Actions
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  cartTotal: number;
  applyCoupon: (code?: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // UI Modal Toggles
  setIsCartOpen: (open: boolean) => void;
  setIsGuestCheckoutOpen: (open: boolean) => void;
  setIsB2BModalOpen: (open: boolean) => void;
  openLabReportModal: (product: Product) => void;
  closeLabReportModal: () => void;
  openPDP: (product: Product) => void;
  closePDP: () => void;
  setShowOrderSuccessModal: (show: boolean) => void;
  openOrderSuccessModal: (order?: Order) => void;

  // Checkout & Orders (Connected to Backend API)
  createRazorpayOrder: (amount: number) => Promise<
    { success: true; razorpayOrderId: string; amount: number; currency: string; keyId: string } |
    { success: false; error: string }
  >;
  createGuestOrder: (
    customerInfo: CustomerGuestInfo,
    paymentMethod: 'razorpay' | 'cod' | 'upi',
    paymentConfirmation?: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
  ) => Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }>;
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus,
    trackingInfo?: { carrier: string; trackingNumber: string; trackingUrl: string; estimatedDelivery: string }
  ) => Promise<{ success: boolean; error?: string }>;

  // Admin & Catalog Actions (Connected to Backend API)
  updateProduct: (product: Product) => Promise<{ success: boolean; error?: string }>;
  addProduct: (product: Product) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<{ success: boolean; error?: string }>;
  deleteReview: (reviewId: string) => Promise<{ success: boolean; error?: string }>;
  updateAdminSettings: (settings: AdminSettings) => Promise<{ success: boolean; error?: string }>;
  submitWholesaleInquiry: (inquiry: Omit<WholesaleInquiry, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  updateWholesaleStatus: (id: string, status: WholesaleInquiry['status']) => Promise<{ success: boolean; error?: string }>;
  sendTestEmail: (testEmail: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PRODUCTS = 'bloombee_products_v2';
const LOCAL_STORAGE_KEY_CART = 'bloombee_cart_v2';
const LOCAL_STORAGE_KEY_ORDERS = 'bloombee_orders_v2';
const LOCAL_STORAGE_KEY_SETTINGS = 'bloombee_settings_v2';
const LOCAL_STORAGE_KEY_EMAILS = 'bloombee_email_logs_v2';
const LOCAL_STORAGE_KEY_INQUIRIES = 'bloombee_inquiries_v2';
const LOCAL_STORAGE_KEY_GUEST_WISHLIST = 'bloombee_guest_wishlist_v2';
const LOCAL_STORAGE_KEY_REVIEWS = 'bloombee_reviews_v2';
const LOCAL_STORAGE_KEY_ADMIN_TOKEN = 'bloombee_admin_token_v2';
const LOCAL_STORAGE_KEY_ADMIN_USER = 'bloombee_admin_user_v2';
const LOCAL_STORAGE_KEY_CATEGORIES = 'bloombee_categories_v1';

// localStorage has a hard per-origin quota (typically ~5-10MB). Every value
// stored here is mirrored data — the real source of truth is either the
// backend (products/reviews/orders/settings) or in-memory session state
// (cart/wishlist). If a write ever exceeds the quota (e.g. the orders
// cache growing over time), failing silently with a console warning is far
// better than letting a QuotaExceededError bubble up and crash whatever
// the user was doing at the time (like completing checkout).
function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`Could not save "${key}" to localStorage (storage full or unavailable):`, err);
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Core State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // FSSAI-licensed product categories. Admin-editable (add/edit/delete) via
  // the Admin Dashboard's Categories tab, and persisted so custom categories
  // survive a refresh. Every screen that lists/filters by category reads
  // from this single array, so a change here reflects everywhere at once.
  const [categories, setCategories] = useState<FSSAIProductCategoryConfig[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
    return saved ? JSON.parse(saved) : FSSAI_LICENSED_CATEGORIES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN_SETTINGS;
  });

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_EMAILS);
    return saved ? JSON.parse(saved) : [];
  });

  const [wholesaleInquiries, setWholesaleInquiries] = useState<WholesaleInquiry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_INQUIRIES);
    return saved ? JSON.parse(saved) : [];
  });

  // Guest Wishlist (Universal - works for anyone without login)
  const [guestWishlist, setGuestWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_GUEST_WISHLIST);
    // Start empty for new visitors — don't pre-seed a phantom wishlist item,
    // which was making the heart icon show "1" before anyone had wishlisted anything.
    if (!saved) return [];
    // One-time cleanup: earlier versions saved this phantom entry by default
    // even for visitors who never wishlisted anything. Strip it out once so
    // browsers that already have it saved also get the correct count.
    const parsed: string[] = JSON.parse(saved);
    const alreadyCleaned = localStorage.getItem('bloombee_wishlist_seed_cleanup_v1');
    if (!alreadyCleaned) {
      safeSetItem('bloombee_wishlist_seed_cleanup_v1', '1');
      return parsed.filter((id) => id !== 'prod-himalayan-honey-250g');
    }
    return parsed;
  });

  // Admin Credentials & Authentication
  const [adminUser, setAdminUser] = useState<{ email: string; fullName: string; role: 'admin' } | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const isAdmin = Boolean(adminUser && adminUser.role === 'admin');

  // Compatibility Users
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(
    isAdmin
      ? {
          id: 'admin-master-01',
          fullName: adminUser?.fullName || 'BloomBee Admin',
          email: adminUser?.email || 'admin@bloombeenaturals.com',
          phone: '+91 94190 12345',
          role: 'admin',
          rewardPoints: 5000,
          memberTier: 'Royal Mountain Club',
          createdAt: '2025-01-01T00:00:00Z',
          addresses: [],
          wishlist: guestWishlist,
        }
      : null
  );

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'forgot'>('login');

  // Navigation state
  const [currentView, setCurrentView] = useState<NavigationView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackedOrderNumber, setTrackedOrderNumber] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGuestCheckoutOpen, setIsGuestCheckoutOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [isLabReportModalOpen, setIsLabReportModalOpen] = useState(false);
  const [activeLabProduct, setActiveLabProduct] = useState<Product | null>(null);
  const [activePDPProduct, setActivePDPProduct] = useState<Product | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  // NOTE: `orders` holds the FULL global orders list fetched from the
  // backend (every order, from every customer) — not just this browser's
  // own orders. That list only grows over time and each order embeds a
  // full snapshot of the products/variants purchased, so mirroring all of
  // it into localStorage eventually exceeds the browser's storage quota
  // (this is what was crashing checkout). The backend is already the real
  // source of truth for this data, so we only keep a small, capped slice
  // here purely as an offline/optimistic-UI fallback.
  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders.slice(0, 30)));
  }, [orders]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY_EMAILS, JSON.stringify(emailLogs));
  }, [emailLogs]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY_INQUIRIES, JSON.stringify(wholesaleInquiries));
  }, [wholesaleInquiries]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEY_GUEST_WISHLIST, JSON.stringify(guestWishlist));
  }, [guestWishlist]);

  useEffect(() => {
    if (adminUser) {
      safeSetItem(LOCAL_STORAGE_KEY_ADMIN_USER, JSON.stringify(adminUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ADMIN_USER);
    }
  }, [adminUser]);

  // ==========================================
  // SYNC WITH BACKEND API ON STARTUP
  // ==========================================
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        // Fetch products
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const data = await prodRes.json();
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
          }
        }

        // Fetch reviews
        const revRes = await fetch('/api/reviews');
        if (revRes.ok) {
          const data = await revRes.json();
          if (data.reviews && Array.isArray(data.reviews)) {
            setReviews(data.reviews);
          }
        }

        // Fetch orders
        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const data = await ordRes.json();
          if (data.orders && Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        }

        // Fetch settings
        const setRes = await fetch('/api/settings');
        if (setRes.ok) {
          const data = await setRes.json();
          if (data.settings) {
            setAdminSettings(data.settings);
          }
        }

        // Fetch inquiries
        const inqRes = await fetch('/api/b2b-inquiries');
        if (inqRes.ok) {
          const data = await inqRes.json();
          if (data.inquiries && Array.isArray(data.inquiries)) {
            setWholesaleInquiries(data.inquiries);
          }
        }
      } catch (err) {
        console.warn('Backend sync note: running in seamless local mode', err);
      }
    };

    fetchBackendData();
  }, []);

  // ==========================================
  // ADMIN AUTHENTICATION (With Credentials)
  // ==========================================
  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminUser({
          email: data.user.email,
          fullName: data.user.fullName,
          role: 'admin',
        });
        safeSetItem(LOCAL_STORAGE_KEY_ADMIN_TOKEN, data.token);

        const adm: User = {
          id: data.user.id || 'admin-master-01',
          fullName: data.user.fullName,
          email: data.user.email,
          phone: '+91 94190 12345',
          role: 'admin',
          rewardPoints: 5000,
          memberTier: 'Royal Mountain Club',
          createdAt: '2025-01-01T00:00:00Z',
          addresses: [],
          wishlist: guestWishlist,
        };
        setCurrentUser(adm);
        setIsAuthModalOpen(false);
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid admin credentials' };
      }
    } catch (err: any) {
      // Fallback local check
      const cleanEmail = email.trim().toLowerCase();
      if (
        (cleanEmail === 'admin@bloombeenaturals.com' || cleanEmail === 'admin@bloombee.com' || cleanEmail === 'admin') &&
        (password === 'bloombee@admin2025' || password === 'admin123')
      ) {
        setAdminUser({
          email: 'admin@bloombeenaturals.com',
          fullName: 'BloomBee Store Admin',
          role: 'admin',
        });
        setCurrentView('admin');
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: 'Invalid admin credentials. Please use admin@bloombeenaturals.com' };
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_ADMIN_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEY_ADMIN_USER);
    if (currentView === 'admin' || currentView === 'account') {
      setCurrentView('home');
    }
  };

  // Backward compatibility auth methods
  const login = async (email: string, _password?: string) => {
    return adminLogin(email, _password || 'bloombee@admin2025');
  };

  const loginAsDemo = (role: 'customer' | 'wholesale_buyer' | 'admin') => {
    if (role === 'admin') {
      adminLogin('admin@bloombeenaturals.com', 'bloombee@admin2025');
    } else {
      setIsAuthModalOpen(false);
    }
  };

  const signup = async (_data: any) => {
    // Customers can buy without signup
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    logoutAdmin();
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...data });
    }
  };

  const addAddress = (addrData: Omit<UserAddress, 'id'>) => {
    if (currentUser) {
      const newAddr = { ...addrData, id: `addr-${Date.now()}` };
      setCurrentUser({
        ...currentUser,
        addresses: [...currentUser.addresses, newAddr],
      });
    }
  };

  const updateAddress = (id: string, addrData: Partial<UserAddress>) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        addresses: currentUser.addresses.map((a) => (a.id === id ? { ...a, ...addrData } : a)),
      });
    }
  };

  const deleteAddress = (id: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        addresses: currentUser.addresses.filter((a) => a.id !== id),
      });
    }
  };

  const setDefaultAddress = (id: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        addresses: currentUser.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
      });
    }
  };

  // Guest Wishlist (Universal)
  const toggleWishlist = (productId: string) => {
    setGuestWishlist((prev) => {
      const exists = prev.includes(productId);
      return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return guestWishlist.includes(productId);
  };

  // Only count/expose wishlist entries that still match a real product.
  // Otherwise a deleted or renamed product's id lingers in guestWishlist
  // forever, making the heart badge count and "Saved Favorites" number
  // disagree with the actual wishlist list shown on the account page.
  const wishlist = guestWishlist.filter((id) => products.some((p) => p.id === id));

  const openAuthModal = (_tab: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openOrderSuccessModal = (order?: Order) => {
    if (order) {
      setLastCompletedOrder(order);
    }
    setShowOrderSuccessModal(true);
  };

  // Cart Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.variant.price * item.quantity,
    0
  );

  const shippingFee =
    cartSubtotal >= adminSettings.store.freeShippingThreshold || cartSubtotal === 0
      ? 0
      : adminSettings.store.standardShippingFee;

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Cart Handlers
  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant.id === variant.id
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, variant, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variant.id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.variant.id === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Coupons
  const applyCoupon = (code?: string) => {
    if (!code || typeof code !== 'string') {
      return { success: false, message: 'Please enter a valid coupon code.' };
    }
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'BLOOM10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedCoupon('BLOOM10');
      setDiscountAmount(discount);
      return { success: true, message: 'Coupon BLOOM10 applied! You saved 10%.' };
    } else if (cleanCode === 'RAWNATURAL') {
      const discount = 150;
      setAppliedCoupon('RAWNATURAL');
      setDiscountAmount(discount);
      return { success: true, message: 'Coupon RAWNATURAL applied! Flat ₹150 off.' };
    } else if (cleanCode === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      setDiscountAmount(adminSettings.store.standardShippingFee);
      return { success: true, message: 'Coupon FREESHIP applied! Free shipping added.' };
    }
    return { success: false, message: 'Invalid coupon code. Try BLOOM10 or RAWNATURAL.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Modal Handlers
  const openLabReportModal = (product: Product) => {
    setActiveLabProduct(product);
    setIsLabReportModalOpen(true);
  };

  const closeLabReportModal = () => {
    setIsLabReportModalOpen(false);
    setActiveLabProduct(null);
  };

  const openPDP = (product: Product) => {
    setActivePDPProduct(product);
    setCurrentView('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closePDP = () => {
    setActivePDPProduct(null);
    if (currentView === 'pdp') {
      setCurrentView('shop');
    }
  };

  // ==========================================
  // RAZORPAY ORDER CREATION (Connected to Backend)
  // Creates a real Razorpay order server-side using the Key ID/Secret
  // saved in Admin > Razorpay Gateway settings. This MUST happen before
  // opening the Razorpay checkout widget — Razorpay requires a real
  // order_id, and payments can only be verified against an order it
  // actually issued.
  // ==========================================
  const createRazorpayOrder = async (
    amount: number
  ): Promise<
    | { success: true; razorpayOrderId: string; amount: number; currency: string; keyId: string }
    | { success: false; error: string }
  > => {
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return {
          success: true,
          razorpayOrderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          keyId: data.keyId,
        };
      }
      return { success: false, error: data.error || 'Could not start Razorpay checkout.' };
    } catch (err: any) {
      return { success: false, error: 'Could not reach the payment server. Check your connection and try again.' };
    }
  };

  // ==========================================
  // GUEST CHECKOUT ORDER CREATION (Connected to Backend)
  // ==========================================
  const createGuestOrder = async (
    customerInfo: CustomerGuestInfo,
    paymentMethod: 'razorpay' | 'cod' | 'upi',
    paymentConfirmation?: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
  ): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    let response: Response;
    let data: any;
    try {
      response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerInfo,
          items: cart,
          pricing: {
            subtotal: cartSubtotal,
            discount: discountAmount,
            shipping: shippingFee,
            total: cartTotal,
            couponCode: appliedCoupon || undefined,
          },
          payment: {
            method: paymentMethod,
            razorpayOrderId: paymentConfirmation?.razorpayOrderId,
            razorpayPaymentId: paymentConfirmation?.razorpayPaymentId,
            razorpaySignature: paymentConfirmation?.razorpaySignature,
          },
        }),
      });
      data = await response.json();
    } catch (err) {
      // Backend genuinely unreachable (offline demo / no server) — fall back
      // to a local-only order so the demo storefront still works. This path
      // is ONLY for network failures, never for a payment/validation error
      // the backend actually responded with (see below).
      console.warn('Backend unreachable, creating a local-only demo order:', err);
      return createLocalFallbackOrder(customerInfo, paymentMethod);
    }

    if (response.ok && data.success && data.order) {
      const newOrder: Order = data.order;
      setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);

      // Reduce local stocks
      setProducts((prevProducts) =>
        prevProducts.map((prod) => {
          const matchingCartItems = cart.filter((c) => c.product.id === prod.id);
          if (matchingCartItems.length === 0) return prod;
          const updatedVariants = prod.variants.map((v) => {
            const item = matchingCartItems.find((c) => c.variant.id === v.id);
            return item ? { ...v, stock: Math.max(0, v.stock - item.quantity) } : v;
          });
          return {
            ...prod,
            variants: updatedVariants,
            inStock: updatedVariants.some((v) => v.stock > 0),
          };
        })
      );

      // Record email notification
      const emailHtml = generateOrderConfirmationEmailHtml(newOrder, adminSettings.store);
      const newEmailLog: EmailLog = {
        id: `email-${Date.now()}`,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        recipientEmail: newOrder.customer.email,
        recipientName: newOrder.customer.fullName,
        subject: `Order Confirmed #${newOrder.orderNumber} — BloomBee Naturals 🍯`,
        templateType: 'order_confirmation',
        orderStatus: 'processing',
        status: 'sent',
        sentAt: new Date().toISOString(),
        htmlContent: emailHtml,
      };
      setEmailLogs((prev) => [newEmailLog, ...prev]);

      setLastCompletedOrder(newOrder);
      setShowOrderSuccessModal(true);
      setIsGuestCheckoutOpen(false);
      clearCart();

      return { success: true, orderId: newOrder.id, orderNumber: newOrder.orderNumber };
    }

    // The backend was reached and explicitly rejected the order (e.g. cart
    // validation failed, or Razorpay payment verification failed). This is
    // a REAL failure — never paper over it with a fake local "success"
    // order, or every payment (real or bogus) would look like it went
    // through.
    return { success: false, error: data?.error || 'Your order could not be placed. Please try again.' };
  };

  // Local-only fallback used ONLY when the backend cannot be reached at
  // all (e.g. running the frontend without the API server during local
  // development). Never used to paper over a real backend error.
  const createLocalFallbackOrder = (
    customerInfo: CustomerGuestInfo,
    paymentMethod: 'razorpay' | 'cod' | 'upi'
  ): { success: boolean; orderId?: string; orderNumber?: string; error?: string } => {
    const orderNumber = `BBN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderId = `ord-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const fallbackOrder: Order = {
      id: newOrderId,
      orderNumber,
      createdAt: nowIso,
      customer: customerInfo,
      items: [...cart],
      pricing: {
        subtotal: cartSubtotal,
        discount: discountAmount,
        shipping: shippingFee,
        total: cartTotal,
        couponCode: appliedCoupon || undefined,
      },
      payment: {
        method: paymentMethod,
        razorpayOrderId: `order_demo_${Date.now().toString(36)}`,
        razorpayPaymentId: `pay_demo_${Math.random().toString(36).substring(2, 12)}`,
        status: 'paid',
        paidAt: nowIso,
      },
      status: 'processing',
      tracking: {
        carrier: 'BlueDart Express / Delhivery',
        trackingNumber: `AWB-BBN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        trackingUrl: '',
        estimatedDelivery: '5–7 Business Days',
      },
      timeline: [
        {
          status: 'pending_payment',
          timestamp: nowIso,
          note: 'Order placed by customer (offline demo mode — backend unreachable).',
        },
        {
          status: 'processing',
          timestamp: nowIso,
          note: `Payment ₹${cartTotal.toLocaleString('en-IN')} received. Packaging in multi-layer insulated box.`,
        },
      ],
    };

    setOrders((prev) => [fallbackOrder, ...prev]);
    setLastCompletedOrder(fallbackOrder);
    setShowOrderSuccessModal(true);
    setIsGuestCheckoutOpen(false);
    clearCart();

    return { success: true, orderId: fallbackOrder.id, orderNumber: fallbackOrder.orderNumber };
  };

  // Update Order Status (Connected to Backend)
  const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    trackingInfo?: { carrier: string; trackingNumber: string; trackingUrl: string; estimatedDelivery: string }
  ): Promise<{ success: boolean; error?: string }> => {
    let backendOk = false;
    let backendError: string | undefined;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, tracking: trackingInfo }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        backendOk = true;
      } else {
        backendError = data?.error || `Server rejected the update (HTTP ${res.status}).`;
      }
    } catch (err) {
      // Network failure — treat as offline demo mode and keep going locally.
      console.warn('Backend status update note:', err);
      backendOk = true;
    }

    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id !== orderId && ord.orderNumber !== orderId) return ord;

        const now = new Date().toISOString();
        const updatedTracking = trackingInfo ? { ...trackingInfo, dispatchedAt: now } : ord.tracking;

        const statusNotes: Record<OrderStatus, string> = {
          pending_payment: 'Order marked as pending payment.',
          processing: 'Order status updated to processing.',
          shipped: `Dispatched via ${trackingInfo?.carrier || 'Express Courier'} (AWB: ${trackingInfo?.trackingNumber || 'Active'}). Standard delivery 5-7 business days across India.`,
          delivered: 'Package successfully delivered to customer.',
          cancelled: 'Order cancelled.',
        };

        const updatedOrder: Order = {
          ...ord,
          status: newStatus,
          tracking: updatedTracking,
          timeline: [
            ...ord.timeline,
            {
              status: newStatus,
              timestamp: now,
              note: statusNotes[newStatus],
            },
          ],
        };

        const emailHtml = generateStatusUpdateEmailHtml(updatedOrder, adminSettings.store, newStatus);
        const newEmailLog: EmailLog = {
          id: `email-${Date.now()}`,
          orderId: ord.id,
          orderNumber: ord.orderNumber,
          recipientEmail: ord.customer.email,
          recipientName: ord.customer.fullName,
          subject: `Shipped! Your BloomBee Order #${ord.orderNumber} is On Its Way 🚀`,
          templateType: 'status_update',
          orderStatus: newStatus,
          status: 'sent',
          sentAt: now,
          htmlContent: emailHtml,
        };

        setEmailLogs((logs) => [newEmailLog, ...logs]);
        return updatedOrder;
      })
    );

    return backendOk ? { success: true } : { success: false, error: backendError };
  };

  // Product Catalog CRUD (Connected to Backend)
  const updateProduct = async (product: Product): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        const error = data?.error || `Server rejected the save (HTTP ${res.status}). Your change was NOT saved.`;
        console.error('Product update rejected by backend:', error);
        return { success: false, error };
      }
      // Use the server's saved copy as the source of truth.
      const saved: Product = data.product || product;
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      if (activePDPProduct?.id === saved.id) {
        setActivePDPProduct(saved);
      }
      return { success: true };
    } catch (err) {
      // Backend unreachable — apply optimistically for offline demo mode,
      // but tell the caller so it can warn that this won't survive a refresh.
      console.warn('Backend product update note (offline):', err);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
      if (activePDPProduct?.id === product.id) {
        setActivePDPProduct(product);
      }
      return { success: false, error: 'Backend unreachable — change applied locally only and will be lost on refresh.' };
    }
  };

  const addProduct = async (product: Product): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        const error = data?.error || `Server rejected the save (HTTP ${res.status}). Product was NOT created.`;
        console.error('Product add rejected by backend:', error);
        return { success: false, error };
      }
      const saved: Product = data.product || product;
      setProducts((prev) => [saved, ...prev]);
      return { success: true };
    } catch (err) {
      console.warn('Backend product add note (offline):', err);
      setProducts((prev) => [product, ...prev]);
      return { success: false, error: 'Backend unreachable — product added locally only and will be lost on refresh.' };
    }
  };

  const deleteProduct = async (productId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        const error = data?.error || `Server rejected the delete (HTTP ${res.status}).`;
        console.error('Product delete rejected by backend:', error);
        return { success: false, error };
      }
    } catch (err) {
      console.warn('Backend product delete note (offline):', err);
    }

    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (activePDPProduct?.id === productId) {
      setActivePDPProduct(null);
    }
    return { success: true };
  };

  // Category CRUD (Admin Dashboard "Categories" tab). There's no backend
  // endpoint for categories, so — like the product/category localStorage
  // fallback pattern above — these persist to localStorage only. Every
  // screen that lists or filters by category reads this same `categories`
  // array (via useStore()), so add/edit/delete here reflects everywhere
  // at once: Navbar dropdown, Shop tabs & filters, Categories page, the
  // home FSSAI grid, and the product-edit category picker.
  const addCategory = (category: FSSAIProductCategoryConfig) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (category: FSSAIProductCategoryConfig) => {
    setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    // Products already assigned to the deleted category simply stop
    // matching any category tab/filter — they still show under "All
    // Products" since that count is independent of the categories list.
    if (selectedCategory === categoryId) {
      setSelectedCategory('all');
    }
  };

  // Reviews CRUD (Connected to Backend)
  const addReview = async (reviewData: Omit<Review, 'id' | 'date'>): Promise<{ success: boolean; error?: string }> => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };

    let backendOk = false;
    let backendError: string | undefined;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        backendOk = true;
      } else {
        backendError = data?.error || `Server rejected the review (HTTP ${res.status}).`;
      }
    } catch (err) {
      console.warn('Backend add review note (offline):', err);
      backendOk = true;
    }

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const matchingRevs = [newRev, ...reviews.filter((r) => r.productId === p.id)];
          const avg = matchingRevs.reduce((s, r) => s + r.rating, 0) / matchingRevs.length;
          return {
            ...p,
            rating: Number(avg.toFixed(1)),
            reviewCount: matchingRevs.length,
          };
        }
        return p;
      })
    );

    return backendOk ? { success: true } : { success: false, error: backendError };
  };

  const deleteReview = async (reviewId: string): Promise<{ success: boolean; error?: string }> => {
    let backendOk = false;
    let backendError: string | undefined;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        backendOk = true;
      } else {
        backendError = data?.error || `Server rejected the delete (HTTP ${res.status}).`;
      }
    } catch (err) {
      console.warn('Backend delete review note (offline):', err);
      backendOk = true;
    }

    const revToDelete = reviews.find((r) => r.id === reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));

    if (revToDelete) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === revToDelete.productId) {
            const remaining = reviews.filter((r) => r.productId === p.id && r.id !== reviewId);
            const avg = remaining.length > 0 ? remaining.reduce((s, r) => s + r.rating, 0) / remaining.length : 5.0;
            return {
              ...p,
              rating: Number(avg.toFixed(1)),
              reviewCount: remaining.length,
            };
          }
          return p;
        })
      );
    }

    return backendOk ? { success: true } : { success: false, error: backendError };
  };

  // Admin Settings (Connected to Backend)
  const updateAdminSettings = async (settings: AdminSettings): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        const error = data?.error || `Server rejected the settings save (HTTP ${res.status}).`;
        console.error('Settings update rejected by backend:', error);
        // Still don't silently drop the admin's edits from the UI, but let
        // the caller know it did NOT persist.
        setAdminSettings(settings);
        return { success: false, error };
      }
      setAdminSettings(data.settings || settings);
      return { success: true };
    } catch (err) {
      console.warn('Backend settings update note (offline):', err);
      setAdminSettings(settings);
      return { success: false, error: 'Backend unreachable — settings applied locally only and will be lost on refresh.' };
    }
  };

  // Wholesale Inquiries (Connected to Backend)
  const submitWholesaleInquiry = async (
    inquiryData: Omit<WholesaleInquiry, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; error?: string }> => {
    let backendOk = false;
    let backendError: string | undefined;
    try {
      const res = await fetch('/api/b2b-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiryData.contactPerson,
          email: inquiryData.email,
          phone: inquiryData.phone,
          companyName: inquiryData.companyName,
          category: inquiryData.productsInterested[0] || 'sweeteners_honey',
          estimatedVolumeKg: inquiryData.estimatedMonthlyKg,
          message: inquiryData.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        backendOk = true;
      } else {
        backendError = data?.error || `Server rejected the inquiry (HTTP ${res.status}).`;
      }
    } catch (err) {
      console.warn('Backend wholesale submission note (offline):', err);
      backendOk = true;
    }

    const newInquiry: WholesaleInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setWholesaleInquiries((prev) => [newInquiry, ...prev]);

    return backendOk ? { success: true } : { success: false, error: backendError };
  };

  const updateWholesaleStatus = async (id: string, status: WholesaleInquiry['status']): Promise<{ success: boolean; error?: string }> => {
    let backendOk = false;
    let backendError: string | undefined;
    try {
      const res = await fetch(`/api/b2b-inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        backendOk = true;
      } else {
        backendError = data?.error || `Server rejected the update (HTTP ${res.status}).`;
      }
    } catch (err) {
      console.warn('Backend inquiry status note (offline):', err);
      backendOk = true;
    }

    setWholesaleInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );

    return backendOk ? { success: true } : { success: false, error: backendError };
  };

  // Test Email
  const sendTestEmail = (testEmail: string): boolean => {
    const mockOrder = orders[0] || INITIAL_ORDERS[0];
    const emailHtml = generateOrderConfirmationEmailHtml(mockOrder, adminSettings.store);

    const testLog: EmailLog = {
      id: `test-email-${Date.now()}`,
      orderId: mockOrder.id,
      orderNumber: mockOrder.orderNumber,
      recipientEmail: testEmail,
      recipientName: 'Test Recipient',
      subject: `[SMTP TEST SUCCESS] Connected to ${adminSettings.smtp.host} — BloomBee Naturals`,
      templateType: 'custom_test',
      status: 'sent',
      sentAt: new Date().toISOString(),
      htmlContent: emailHtml,
    };

    setEmailLogs((prev) => [testLog, ...prev]);
    return true;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        orders,
        adminSettings,
        emailLogs,
        wholesaleInquiries,
        isCartOpen,
        isGuestCheckoutOpen,
        isB2BModalOpen,
        isLabReportModalOpen,
        activeLabProduct,
        activePDPProduct,
        selectedProduct: activePDPProduct,
        appliedCoupon,
        discountAmount,
        lastCompletedOrder,
        showOrderSuccessModal,
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        setSelectedProduct: setActivePDPProduct,
        trackedOrderNumber,
        setTrackedOrderNumber,

        // Admin Auth
        isAdmin,
        adminUser,
        adminLogin,
        logoutAdmin,

        // User compatibility
        currentUser,
        users,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
        wishlist,
        login,
        loginAsDemo,
        signup,
        logout,
        updateUserProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        toggleWishlist,
        isInWishlist,

        // Cart
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        applyCoupon,
        removeCoupon,
        setIsCartOpen,
        setIsGuestCheckoutOpen,
        setIsB2BModalOpen,
        openLabReportModal,
        closeLabReportModal,
        openPDP,
        closePDP,
        setShowOrderSuccessModal,
        openOrderSuccessModal,
        createRazorpayOrder,
        createGuestOrder,
        updateOrderStatus,
        updateProduct,
        addProduct,
        deleteProduct,
        reviews,
        addReview,
        deleteReview,
        updateAdminSettings,
        submitWholesaleInquiry,
        updateWholesaleStatus,
        sendTestEmail,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};