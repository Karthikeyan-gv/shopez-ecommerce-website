import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { loginUser, registerUser } from "@/store/auth-slice";
import { fetchCartItems as getCartItems } from "@/store/shop/cart-slice";
import { HousePlug, ShoppingBag, ShieldCheck, Lock, Mail, User } from "lucide-react";

function AuthModal({ open, setOpen, onSuccess, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, open]);

  function handleInputChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleModeSwitch(newMode) {
    setMode(newMode);
    setFormData({ userName: "", email: "", password: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    if (mode === "signup") {
      if (!formData.userName || !formData.email || !formData.password) {
        toast("Please fill in all fields.");
        setIsLoading(false);
        return;
      }
      const data = await dispatch(registerUser(formData));
      setIsLoading(false);
      const result = data?.payload || data?.error;
      if (result?.success) {
        toast(result.message || "Registration successful! Please log in.");
        setMode("login");
        setFormData({ userName: "", email: formData.email, password: "" });
      } else {
        toast(result?.message || "Registration failed. Please try again.");
      }
    } else {
      if (!formData.email || !formData.password) {
        toast("Please enter both email and password.");
        setIsLoading(false);
        return;
      }
      const data = await dispatch(
        loginUser({ email: formData.email, password: formData.password })
      );
      setIsLoading(false);
      const result = data?.payload;
      if (result?.success) {
        toast(`Welcome back, ${result.user?.userName || "Customer"}!`);
        const loggedInUser = result.user;
        if (loggedInUser?.id) {
          dispatch(getCartItems(loggedInUser.id));
        }
        setOpen(false);
        if (onSuccess) {
          onSuccess(loggedInUser);
        }
      } else {
        toast(result?.message || "Login failed. Please check your credentials.");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white/95 backdrop-blur-2xl rounded-2xl border border-purple-100 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-5 min-h-[480px]">
          {/* Royal Purple Left Brand Banner */}
          <div className="md:col-span-2 royal-purple-gradient text-white p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                  <HousePlug className="h-6 w-6 text-purple-200" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  ShopEZ
                </span>
              </div>
              <h2 className="text-xl font-bold leading-snug pt-4">
                {mode === "login" ? "Login to Complete Your Purchase" : "Create an Account"}
              </h2>
              <p className="text-xs text-purple-200/90 leading-relaxed">
                Get access to your Orders, Wishlist, Fast Checkout, and Exclusive Deals.
              </p>
            </div>

            <div className="space-y-3 z-10 pt-6 border-t border-purple-400/20">
              <div className="flex items-center gap-2.5 text-xs text-purple-100 font-medium">
                <ShoppingBag className="h-4 w-4 text-purple-300 shrink-0" />
                <span>Instant Cart Sync</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-purple-100 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>100% Safe & Secure Payments</span>
              </div>
            </div>

            {/* Glowing blur orb */}
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Right Side Form */}
          <div className="md:col-span-3 p-8 flex flex-col justify-between bg-white">
            <div>
              <DialogTitle className="sr-only">Authentication Modal</DialogTitle>
              <DialogDescription className="sr-only">
                Sign in or create an account to proceed with your shopping
              </DialogDescription>

              {/* Toggle Mode Header */}
              <div className="flex border-b border-purple-100 mb-6">
                <button
                  type="button"
                  onClick={() => handleModeSwitch("login")}
                  className={`flex-1 py-3 text-sm font-bold text-center transition-all border-b-2 ${
                    mode === "login"
                      ? "border-purple-700 text-purple-950"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch("signup")}
                  className={`flex-1 py-3 text-sm font-bold text-center transition-all border-b-2 ${
                    mode === "signup"
                      ? "border-purple-700 text-purple-950"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-1">
                    <Label htmlFor="userName" className="text-xs font-bold text-purple-950">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                      <Input
                        id="userName"
                        name="userName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.userName}
                        onChange={handleInputChange}
                        className="pl-9 text-sm border-purple-100 focus-visible:ring-purple-600 rounded-lg"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-bold text-purple-950">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-9 text-sm border-purple-100 focus-visible:ring-purple-600 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-bold text-purple-950">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-9 text-sm border-purple-100 focus-visible:ring-purple-600 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2.5 rounded-xl text-sm font-bold transition-all mt-6 shadow-md purple-glow-sm"
                >
                  {isLoading
                    ? "Processing..."
                    : mode === "login"
                    ? "Log In & Continue"
                    : "Create Account"}
                </Button>
              </form>
            </div>

            <div className="text-center text-xs text-slate-500 pt-6 border-t border-purple-100 mt-4">
              {mode === "login" ? (
                <p>
                  New to ShopEZ?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("signup")}
                    className="text-purple-700 font-extrabold hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("login")}
                    className="text-purple-700 font-extrabold hover:underline"
                  >
                    Log In
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
