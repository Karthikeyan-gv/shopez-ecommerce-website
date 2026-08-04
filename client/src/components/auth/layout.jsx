import { Outlet, Link } from "react-router-dom";
import { HousePlug, ShoppingBag, ShieldCheck, ArrowLeft } from "lucide-react";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#faf7fd] dark:bg-[#0b0714] text-slate-900 dark:text-white">
      <div className="hidden lg:flex flex-col justify-between royal-purple-gradient w-1/2 p-12 text-white relative overflow-hidden">
        <div className="space-y-6 z-10">
          <Link to="/shop/home" className="flex items-center gap-2.5 text-white font-extrabold text-2xl tracking-wide">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <HousePlug className="h-7 w-7 text-purple-200" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">ShopEZ</span>
          </Link>
          <div className="pt-8 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Welcome to ShopEZ E-Commerce
            </h1>
            <p className="text-purple-100/90 text-base leading-relaxed max-w-lg">
              Experience fast, seamless shopping for apparel, footwear, accessories, and electronics with instant cart sync and 100% secure payments.
            </p>
          </div>
        </div>

        <div className="space-y-4 z-10 pt-8 border-t border-purple-400/20">
          <div className="flex items-center gap-3 text-sm text-purple-100 font-medium">
            <ShoppingBag className="h-5 w-5 text-purple-300" />
            <span>Instant Cart Sync Across Devices</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-purple-100 font-medium">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>Verified & Safe Checkout Guaranteed</span>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl px-6 py-12 sm:px-12 relative">
        <Link to="/shop/home" className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors bg-purple-50 dark:bg-purple-950/60 px-3 py-1.5 rounded-lg border border-purple-100 dark:border-purple-900">
          <ArrowLeft className="h-4 w-4 text-purple-600" />
          <span>Back to Store</span>
        </Link>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
