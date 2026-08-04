import { HousePlug, Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function ShoppingFooter() {
  const [email, setEmail] = useState("");

  function handleNewsletterSubscribe(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast("Please enter a valid email address");
      return;
    }
    toast("Thank you for subscribing to our newsletter!");
    setEmail("");
  }

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-purple-950/40 relative overflow-hidden mt-auto">
      {/* Background ambient purple glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/shop/home" className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
                <HousePlug className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Shop<span className="gradient-text-purple">EZ</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your ultimate destination for premium lifestyle products, trending fashion, and everyday essentials. Delivered fast & secure.
            </p>
            <div className="space-y-2.5 text-sm text-slate-400 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-purple-400 shrink-0" />
                <span>123 Commerce Way, Tech City, NY 10001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-purple-400 shrink-0" />
                <span>+1 (800) 555-SHOPEZ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-purple-400 shrink-0" />
                <span>support@shopez.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 tracking-widest uppercase text-purple-300">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/shop/home" className="hover:text-purple-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop/listing" className="hover:text-purple-400 transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/shop/listing?category=men" className="hover:text-purple-400 transition-colors">Men's Collection</Link>
              </li>
              <li>
                <Link to="/shop/listing?category=women" className="hover:text-purple-400 transition-colors">Women's Collection</Link>
              </li>
              <li>
                <Link to="/shop/listing?category=kids" className="hover:text-purple-400 transition-colors">Kids Wear</Link>
              </li>
              <li>
                <Link to="/shop/search" className="hover:text-purple-400 transition-colors">Search Store</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 tracking-widest uppercase text-purple-300">Customer Care</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/auth/login" className="hover:text-purple-400 font-semibold text-purple-200 transition-colors">Log In to Account</Link>
              </li>
              <li>
                <Link to="/auth/register" className="hover:text-purple-400 font-semibold text-purple-200 transition-colors">Create New Account</Link>
              </li>
              <li>
                <Link to="/shop/account" className="hover:text-purple-400 transition-colors">Track Orders</Link>
              </li>
              <li>
                <span className="hover:text-purple-400 cursor-pointer transition-colors">Shipping & Delivery</span>
              </li>
              <li>
                <span className="hover:text-purple-400 cursor-pointer transition-colors">Returns & Exchanges</span>
              </li>
              <li>
                <span className="hover:text-purple-400 cursor-pointer transition-colors">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm mb-2 tracking-widest uppercase text-purple-300">Newsletter</h3>
            <p className="text-sm text-slate-400">
              Subscribe to get special discounts, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form onSubmit={handleNewsletterSubscribe} className="space-y-2">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900/90 border-purple-900/50 text-white placeholder:text-slate-500 pr-10 focus-visible:ring-purple-500 rounded-lg"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 bg-purple-600 hover:bg-purple-500 text-white rounded-md shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
            </form>
            <div className="pt-2">
              <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">We accept</p>
              <div className="flex gap-2 text-xs font-bold text-slate-300">
                <span className="px-2.5 py-1 bg-slate-900/80 rounded border border-purple-900/40">Visa</span>
                <span className="px-2.5 py-1 bg-slate-900/80 rounded border border-purple-900/40">Mastercard</span>
                <span className="px-2.5 py-1 bg-slate-900/80 rounded border border-purple-900/40">PayPal</span>
                <span className="px-2.5 py-1 bg-slate-900/80 rounded border border-purple-900/40">Apple Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ShopEZ Inc. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-purple-400 cursor-pointer transition-colors p-1.5 rounded-full bg-slate-900 hover:bg-purple-950 border border-slate-800">
              <Facebook className="h-4 w-4" />
            </span>
            <span className="hover:text-purple-400 cursor-pointer transition-colors p-1.5 rounded-full bg-slate-900 hover:bg-purple-950 border border-slate-800">
              <Twitter className="h-4 w-4" />
            </span>
            <span className="hover:text-purple-400 cursor-pointer transition-colors p-1.5 rounded-full bg-slate-900 hover:bg-purple-950 border border-slate-800">
              <Instagram className="h-4 w-4" />
            </span>
            <span className="hover:text-purple-400 cursor-pointer transition-colors p-1.5 rounded-full bg-slate-900 hover:bg-purple-950 border border-slate-800">
              <Github className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;
