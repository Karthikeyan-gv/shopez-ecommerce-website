import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthModal from "@/components/common/auth-modal";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [pendingBuyNow, setPendingBuyNow] = useState(false);

  const [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  useEffect(() => {
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword && trimmedKeyword.length > 3) {
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${trimmedKeyword}`));
        dispatch(getSearchResults(trimmedKeyword));
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${trimmedKeyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch, setSearchParams]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!user) {
      sessionStorage.setItem(
        "pendingCartAction",
        JSON.stringify({ productId: getCurrentProductId, isBuyNow: false })
      );
      setPendingProduct(getCurrentProductId);
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
        toast("Product is added to cart");
      }
    });
  }

  function handleBuyNow(getCurrentProductId, getTotalStock) {
    if (!user) {
      sessionStorage.setItem(
        "pendingCartAction",
        JSON.stringify({ productId: getCurrentProductId, isBuyNow: true })
      );
      setPendingProduct(getCurrentProductId);
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
    if (pendingProduct && loggedInUser?.id) {
      dispatch(
        addToCart({
          userId: loggedInUser.id,
          productId: pendingProduct,
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

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-8 px-4 py-10 max-w-7xl">
      <div className="flex justify-center mb-10">
        <div className="w-full max-w-2xl flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6 px-5 text-base border-purple-200 bg-white/90 backdrop-blur-md rounded-2xl shadow-md focus-visible:ring-purple-600 placeholder:text-slate-400"
            placeholder="Search products by title, category, or brand..."
          />
        </div>
      </div>
      {!searchResults.length && keyword.trim().length > 3 ? (
        <div className="text-center py-12">
          <h1 className="text-3xl font-extrabold text-slate-800">No results found for "{keyword}"</h1>
          <p className="text-slate-500 text-sm mt-2">Try searching for keywords like "shirt", "nike", or "shoes"</p>
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            key={item._id}
            handleAddtoCart={handleAddtoCart}
            handleBuyNow={handleBuyNow}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
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

export default SearchProducts;