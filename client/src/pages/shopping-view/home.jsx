import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { toast } from 'react-toastify';
import AuthModal from "@/components/common/auth-modal";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [pendingBuyNow, setPendingBuyNow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const slides = [bannerOne, bannerTwo, bannerThree];

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!user) {
      sessionStorage.setItem(
        "pendingCartAction",
        JSON.stringify({ productId: getCurrentProductId, isBuyNow: false })
      );
      setPendingProduct({ id: getCurrentProductId, stock: getTotalStock });
      setPendingBuyNow(false);
      setOpenAuthModal(true);
      return;
    }

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast(`Only ${getQuantity} quantity can be added for this item`);
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast("Product added to cart");
      }
    });
  }

  function handleBuyNow(getCurrentProductId, getTotalStock) {
    if (!user) {
      sessionStorage.setItem(
        "pendingCartAction",
        JSON.stringify({ productId: getCurrentProductId, isBuyNow: true })
      );
      setPendingProduct({ id: getCurrentProductId, stock: getTotalStock });
      setPendingBuyNow(true);
      setOpenAuthModal(true);
      return;
    }

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast(`Only ${getQuantity} quantity can be added for this item`);
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        navigate("/shop/checkout");
      }
    });
  }

  function handleAuthSuccess(loggedInUser) {
    if (pendingProduct?.id && loggedInUser?.id) {
      dispatch(
        addToCart({
          userId: loggedInUser.id,
          productId: pendingProduct.id,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(loggedInUser.id));
          if (pendingBuyNow) {
            navigate("/shop/checkout");
          } else {
            toast("Product added to cart!");
          }
          setPendingProduct(null);
          setPendingBuyNow(false);
        }
      });
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Slider with CTA Overlay */}
      <div className="relative w-full h-[480px] sm:h-[560px] overflow-hidden bg-slate-950">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            } absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out`}
          >
            <img
              src={slide}
              alt={`Hero Banner ${index + 1}`}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Dark overlay & hero typography */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-indigo-950/70 to-transparent flex items-center">
              <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                <div className="max-w-xl text-white space-y-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 backdrop-blur-md border border-indigo-400/30 text-xs font-bold uppercase tracking-widest text-indigo-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> New Season Collection
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                    Elevate Your Style Every Day.
                  </h1>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                    Discover premium footwear, apparel, and lifestyle accessories designed for comfort & elegance.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <Button
                      onClick={() => navigate("/shop/listing")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-6 py-6 rounded-xl shadow-lg transition-all text-sm group"
                    >
                      Shop New Arrivals
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      onClick={() => navigate("/shop/listing")}
                      variant="outline"
                      className="border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-bold px-6 py-6 rounded-xl text-sm"
                    >
                      Explore Deals
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 hover:bg-white text-slate-900 dark:text-white z-20 rounded-full shadow-md"
        >
          <ChevronLeftIcon className="w-5 h-5 text-slate-900 dark:text-white" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 hover:bg-white text-slate-900 dark:text-white z-20 rounded-full shadow-md"
        >
          <ChevronRightIcon className="w-5 h-5 text-slate-900 dark:text-white" />
        </Button>
      </div>

      {/* Trust Badges Bar */}
      <section className="py-6 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-2">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Express Delivery</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Free shipping over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">100% Secure Checkout</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Encrypted SSL security</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">30 Days Returns</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Money-back guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 shrink-0">
                <Headphones className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">24/7 VIP Support</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Dedicated care team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Shop by <span className="text-indigo-600 dark:text-indigo-400">Category</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Explore our wide selection of trending styles and products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="glass-panel rounded-2xl cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <categoryItem.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-wide group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Callout Grid */}
      <section className="py-10 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-md border border-indigo-900/50">
              <div className="space-y-2 z-10">
                <span className="bg-amber-600 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Limited Offer</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold pt-2">Up to 40% Off Summer Trends</h3>
                <p className="text-xs text-slate-300">Exclusive designer streetwear and seasonal footwear.</p>
              </div>
              <div className="pt-4 z-10">
                <Button onClick={() => navigate("/shop/listing")} className="bg-white text-slate-950 font-extrabold hover:bg-slate-100 text-xs px-5 py-2.5 rounded-xl">
                  Shop Collection Now
                </Button>
              </div>
            </div>

            <div className="bg-indigo-950 p-8 rounded-3xl text-white relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-md border border-indigo-800/50">
              <div className="space-y-2 z-10">
                <span className="bg-indigo-600 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Featured Brands</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold pt-2">Nike & Adidas Original Drops</h3>
                <p className="text-xs text-indigo-200">Authentic sneakers and athletic wear with fast dispatch.</p>
              </div>
              <div className="pt-4 z-10">
                <Button onClick={() => navigate("/shop/listing")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl">
                  Explore Drops
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-14 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Shop by <span className="text-indigo-600 dark:text-indigo-400">Brand</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Top global brands curated just for you</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="glass-panel rounded-2xl cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <brandItem.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured <span className="text-indigo-600 dark:text-indigo-400">Products</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Handpicked bestsellers with special discounts</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                    handleBuyNow={handleBuyNow}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      <AuthModal
        open={openAuthModal}
        setOpen={setOpenAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default ShoppingHome;
