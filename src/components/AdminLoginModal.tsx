import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Key,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AdminLoginModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, adminLogin, isAdmin } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        setSuccessMsg('Admin credentials verified. Redirecting to Admin Portal...');
        setTimeout(() => {
          closeAuthModal();
        }, 600);
      } else {
        setErrorMsg(res.error || 'Invalid credentials. Please check your admin email and password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (adminType: 'master' | 'manager') => {
    if (adminType === 'master') {
      setEmail('admin@bloombeenaturals.com');
      setPassword('bloombee@admin2025');
    } else {
      setEmail('admin@bloombee.com');
      setPassword('admin123');
    }
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-3xl bg-[#FAF8F5] border border-[#EFE5D5] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          {/* Header Banner */}
          <div className="bg-[#1E3F20] px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#F3C067]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  Admin Portal Access
                </h3>
                <p className="text-xs text-[#9EB39C]">
                  BloomBee Naturals HQ Control Desk
                </p>
              </div>
            </div>

            <button
              onClick={closeAuthModal}
              className="rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Helpful Notice about Guests */}
            <div className="p-3.5 rounded-2xl bg-[#FEF7EB] border border-[#F5DCB7] flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-[#9A5B00] shrink-0 mt-0.5" />
              <div className="text-xs text-[#786C5E] leading-relaxed">
                <strong className="text-[#1E3F20] font-semibold block mb-0.5">
                  Shoppers do not need an account:
                </strong>
                Anyone can add items to cart, checkout directly as a guest, and track orders using their order number or phone. This portal is strictly for store administrators.
              </div>
            </div>

            {/* Quick Demo Credentials Banner */}
            {/* <div className="p-3.5 rounded-2xl bg-white border border-[#EFE5D5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#1E3F20] uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#E69500]" />
                  Admin Credentials:
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                  Ready to Login
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EFE5D5] text-xs font-mono text-[#1F2937] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#786C5E]">Email:</span>
                  <span className="font-semibold text-[#1E3F20]">admin@bloombeenaturals.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#786C5E]">Password:</span>
                  <span className="font-semibold text-[#1E3F20]">bloombee@admin2025</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleQuickFill('master')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#FEF7EB] hover:bg-[#F5DCB7] text-[#9A5B00] text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#E69500]" />
                  <span>1-Click Fill HQ Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('manager')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFE5D5] text-[#1E3F20] text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>1-Click Fill Manager</span>
                </button>
              </div>
            </div> */}

            {/* Error / Success Alerts */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E3F20] mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#786C5E]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@bloombeenaturals.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EFE5D5] rounded-xl text-xs sm:text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3F20] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3F20] mb-1.5">
                  Admin Security Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#786C5E]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EFE5D5] rounded-xl text-xs sm:text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3F20] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#1E3F20] hover:bg-[#2D5A27] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify & Enter Admin Portal</span>
                    <ArrowRight className="w-4 h-4 text-[#F3C067]" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
