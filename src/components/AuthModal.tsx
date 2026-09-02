import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    loginAsDemo,
    signup,
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [accountType, setAccountType] = useState<'customer' | 'wholesale_buyer'>('customer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to sign in.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await signup({
      fullName,
      email,
      phone,
      password,
      companyName: accountType === 'wholesale_buyer' ? companyName : undefined,
      role: accountType,
    });

    setIsLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to create account.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg(`Password reset instructions have been sent to ${email}.`);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAuthModalOpen(false);
      }}
    >
      <div
        id="auth-modal-content"
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#EFE5D5] overflow-hidden relative animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-[#FAF8F5] p-6 border-b border-[#EFE5D5] relative">
          <button
            id="close-auth-modal"
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#FEF7EB] flex items-center justify-center border border-[#F5DCB7] text-[#9A5B00]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1E3F20] font-serif">
                {authModalTab === 'login' && 'Welcome Back'}
                {authModalTab === 'signup' && 'Create Your Account'}
                {authModalTab === 'forgot' && 'Reset Password'}
              </h3>
              <p className="text-xs text-[#786C5E]">
                {authModalTab === 'login' && 'Sign in to access orders, saved addresses & loyalty points'}
                {authModalTab === 'signup' && 'Get ₹200 welcome bonus reward points instantly'}
                {authModalTab === 'forgot' && 'Enter your email to receive recovery instructions'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          {authModalTab !== 'forgot' && (
            <div className="flex rounded-xl bg-white p-1 mt-4 border border-[#EFE5D5]">
              <button
                id="tab-login"
                type="button"
                onClick={() => {
                  setAuthModalTab('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authModalTab === 'login'
                    ? 'bg-[#1E3F20] text-white shadow-xs'
                    : 'text-[#786C5E] hover:text-[#1E3F20]'
                }`}
              >
                Sign In
              </button>
              <button
                id="tab-signup"
                type="button"
                onClick={() => {
                  setAuthModalTab('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authModalTab === 'signup'
                    ? 'bg-[#1E3F20] text-white shadow-xs'
                    : 'text-[#786C5E] hover:text-[#1E3F20]'
                }`}
              >
                Register New
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1-Click Demo Logins */}
          <div className="mb-5 pb-5 border-b border-[#EFE5D5]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9A5B00] mb-2 flex items-center justify-between">
              <span>Quick 1-Click Demo Accounts</span>
              <span className="text-[10px] text-[#786C5E] font-normal">Instant Access</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="demo-login-customer"
                type="button"
                onClick={() => loginAsDemo('customer')}
                className="p-2.5 text-center bg-[#FAF8F5] hover:bg-[#FEF7EB] hover:border-[#F5DCB7] border border-[#EFE5D5] rounded-xl transition-all group cursor-pointer"
              >
                <span className="text-base block mb-0.5">🌿</span>
                <span className="text-xs font-bold text-[#1E3F20] block">Customer</span>
                <span className="text-[10px] text-[#786C5E] block">Aarav S.</span>
              </button>
              <button
                id="demo-login-wholesale"
                type="button"
                onClick={() => loginAsDemo('wholesale_buyer')}
                className="p-2.5 text-center bg-[#FAF8F5] hover:bg-[#FEF7EB] hover:border-[#F5DCB7] border border-[#EFE5D5] rounded-xl transition-all group cursor-pointer"
              >
                <span className="text-base block mb-0.5">🏢</span>
                <span className="text-xs font-bold text-[#1E3F20] block">B2B Buyer</span>
                <span className="text-[10px] text-[#786C5E] block">Rohan M.</span>
              </button>
              <button
                id="demo-login-admin"
                type="button"
                onClick={() => loginAsDemo('admin')}
                className="p-2.5 text-center bg-[#FAF8F5] hover:bg-[#FEF7EB] hover:border-[#F5DCB7] border border-[#EFE5D5] rounded-xl transition-all group cursor-pointer"
              >
                <span className="text-base block mb-0.5">👑</span>
                <span className="text-xs font-bold text-[#1E3F20] block">Store Admin</span>
                <span className="text-[10px] text-[#786C5E] block">Manager</span>
              </button>
            </div>
          </div>

          {/* Sign In Form */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav.sharma@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3F20]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#374151]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-xs font-semibold text-[#9A5B00] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3F20]"
                  />
                </div>
              </div>

              <button
                id="btn-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#1E3F20] hover:bg-[#2D5A27] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing in...' : 'Sign In to Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Registration Form */}
          {authModalTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              {/* Customer vs Wholesale Account Toggle */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('customer')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      accountType === 'customer'
                        ? 'bg-[#1E3F20] text-white border-[#1E3F20]'
                        : 'bg-[#FAF8F5] text-[#374151] border-[#EFE5D5]'
                    }`}
                  >
                    🌿 Retail Shopper
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('wholesale_buyer')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      accountType === 'wholesale_buyer'
                        ? 'bg-[#1E3F20] text-white border-[#1E3F20]'
                        : 'bg-[#FAF8F5] text-[#374151] border-[#EFE5D5]'
                    }`}
                  >
                    🏢 B2B Wholesale Buyer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-signup-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3F20]"
                  />
                </div>
              </div>

              {accountType === 'wholesale_buyer' && (
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1">
                    Company / Organization Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-signup-company"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Himalayan Ayurveda Pvt Ltd"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3F20]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3F20]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-signup-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3F20]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3F20]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFE5D5] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2D5A27] shrink-0" />
                <span className="text-[11px] text-[#786C5E]">
                  By registering you agree to BloomBee Purity terms & receive 200 welcome points.
                </span>
              </div>

              <button
                id="btn-signup-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#1E3F20] hover:bg-[#2D5A27] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating account...' : 'Create Account & Claim ₹200'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {authModalTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1.5">
                  Your Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aarav.sharma@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EFE5D5] rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E3F20]"
                  />
                </div>
              </div>

              <button
                id="btn-forgot-submit"
                type="submit"
                className="w-full py-3 bg-[#9A5B00] hover:bg-[#7D4900] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Send Reset Link</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-bold text-[#1E3F20] hover:underline cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
