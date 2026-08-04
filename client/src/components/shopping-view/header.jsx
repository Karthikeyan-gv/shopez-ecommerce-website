import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Heart, Sparkles, Tag, Truck, Sun, Moon } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { toast } from "react-toastify";
import AuthModal from "../common/auth-modal";

function TopAnnouncementBar() {
  return (
    <div className="bg-slate-900 dark:bg-slate-950 text-white py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-between shadow-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-slate-300">
          <Truck className="h-3.5 w-3.5 text-indigo-400" />
          <span>Free Worldwide Shipping on Orders Over $50</span>
        </div>
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span>FESTIVE SALE: EXTRA 15% OFF WITH CODE <strong className="bg-indigo-900/80 px-2 py-0.5 rounded border border-indigo-500/40 text-amber-300 tracking-widest">SHOPEZ15</strong></span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5 text-indigo-400" /> Daily Flash Deals</span>
        </div>
      </div>
    </div>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const { cartItems } = useSelector((state) => state.shopCart);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleToggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    toast(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} mode`);
  }

  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(wishlist.length);
    };
    updateWishlistCount();
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);
    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  function handleLogout() {
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  }

  function handleCartClick() {
    if (!user) {
      toast("Please login to view your cart");
      setAuthMode("login");
      setOpenAuthModal(true);
      return;
    }
    setOpenCartSheet(true);
  }

  function handleWishlistClick() {
    toast(`Wishlist contains ${wishlistCount} saved item(s)!`);
  }

  function handleOpenLogin() {
    setAuthMode("login");
    setOpenAuthModal(true);
  }

  function handleOpenSignup() {
    setAuthMode("signup");
    setOpenAuthModal(true);
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-3.5">
      {/* Wishlist Button */}
      <Button
        onClick={handleWishlistClick}
        variant="outline"
        size="icon"
        className="relative border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full shadow-xs transition-transform hover:scale-105"
        title="Saved Wishlist"
      >
        <Heart className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-50 dark:fill-indigo-950" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-extrabold text-[10px] h-4 w-4 rounded-full flex items-center justify-center border border-white shadow-xs">
            {wishlistCount}
          </span>
        )}
        <span className="sr-only">Wishlist</span>
      </Button>

      {/* Dark / Light Mode Toggle Button */}
      <Button
        onClick={handleToggleTheme}
        variant="outline"
        size="icon"
        className="border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full shadow-xs transition-transform hover:scale-105"
        title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {theme === "light" ? (
          <Moon className="w-4 h-4 text-indigo-600 fill-indigo-100" />
        ) : (
          <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
        )}
        <span className="sr-only">Toggle dark/light mode</span>
      </Button>

      {/* Cart Sheet Trigger */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={handleCartClick}
          variant="outline"
          size="icon"
          className="relative border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full shadow-xs transition-transform hover:scale-105"
        >
          <ShoppingCart className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
          <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white font-extrabold text-[11px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
            {user ? cartItems?.items?.length || 0 : 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        {user ? (
          <UserCartWrapper
            setOpenCartSheet={setOpenCartSheet}
            cartItems={
              cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items
                : []
            }
          />
        ) : null}
      </Sheet>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-indigo-600 text-white cursor-pointer ring-2 ring-indigo-500/30 shadow-sm hover:scale-105 transition-transform">
              <AvatarFallback className="bg-indigo-600 text-white font-extrabold text-xs">
                {user?.userName ? user.userName[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 shadow-xl rounded-xl">
            <DropdownMenuLabel className="text-slate-900 dark:text-white font-bold">Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator className="h-[1px] bg-slate-200 dark:bg-slate-800" />
            <DropdownMenuItem className="hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 cursor-pointer font-medium" onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              My Account & Orders
            </DropdownMenuItem>
            <DropdownMenuSeparator className="h-[1px] bg-slate-200 dark:bg-slate-800" />
            <DropdownMenuItem className="hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 cursor-pointer font-medium" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-red-500" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenLogin}
            variant="outline"
            className="border-slate-300 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs sm:text-sm px-4"
          >
            Log In
          </Button>
          <Button
            onClick={handleOpenSignup}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs sm:text-sm px-4 shadow-sm transition-all"
          >
            Sign Up
          </Button>
        </div>
      )}

      <AuthModal
        open={openAuthModal}
        setOpen={setOpenAuthModal}
        initialMode={authMode}
      />
    </div>
  );
}

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row px-5 mt-4 lg:mt-0">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function ShoppingHeader() {
  return (
    <div className="w-full sticky top-0 z-40">
      <TopAnnouncementBar />
      <header className="glass-header-nav w-full transition-all">
        <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
          <Link to="/shop/home" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm group-hover:scale-105 transition-transform">
              <HousePlug className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              Shop<span className="text-indigo-600 dark:text-indigo-400">EZ</span>
            </span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden border-slate-300 text-slate-800 dark:text-slate-200">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <MenuItems />
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <HeaderRightContent />
              </div>
            </SheetContent>
          </Sheet>
          <div className="hidden lg:block">
            <MenuItems />
          </div>

          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        </div>
      </header>
    </div>
  );
}

export default ShoppingHeader;
