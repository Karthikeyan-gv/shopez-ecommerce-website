import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "react-toastify";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useNavigate } from "react-router-dom";
import AuthModal from "../common/auth-modal";

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!user) {
      sessionStorage.setItem(
        "pendingCartAction",
        JSON.stringify({ productId: getCurrentProductId, isBuyNow: false })
      );
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
        dispatch(fetchCartItems(user.id));
        toast("Product added to cart!");
      }
    });
  }

  function handleBuyNow(getCurrentProductId, getTotalStock) {
    if (!user) {
      sessionStorage.setItem(
        "pendingCartAction",
        JSON.stringify({ productId: getCurrentProductId, isBuyNow: true })
      );
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
        dispatch(fetchCartItems(user.id));
        handleDialogClose();
        navigate("/shop/checkout");
      }
    });
  }

  function handleAuthSuccess(loggedInUser) {
    const pendingCart = JSON.parse(sessionStorage.getItem("pendingCartAction") || "null");
    if (pendingCart && pendingCart.productId) {
      dispatch(
        addToCart({
          userId: loggedInUser.id,
          productId: pendingCart.productId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(loggedInUser.id));
          sessionStorage.removeItem("pendingCartAction");
          if (pendingCart.isBuyNow) {
            handleDialogClose();
            navigate("/shop/checkout");
          } else {
            toast("Product added to cart!");
          }
        }
      });
    }
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    if (!user) {
      setOpenAuthModal(true);
      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast("Review added successfully!");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails, dispatch]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-8 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950 backdrop-blur-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white">
          <DialogHeader className="sr-only">
            <DialogTitle>{productDetails?.title || "Product Details"}</DialogTitle>
            <DialogDescription>{productDetails?.description || "Product details view"}</DialogDescription>
          </DialogHeader>
          <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <img
              src={productDetails?.image || DEFAULT_FALLBACK_IMAGE}
              alt={productDetails?.title || "Product Details"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_FALLBACK_IMAGE;
              }}
              className="aspect-square w-full object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{productDetails?.title}</h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 mt-3 leading-relaxed">
                {productDetails?.description}
              </p>

              <div className="flex items-center justify-between pt-2 pb-2">
                <p
                  className={`text-3xl font-extrabold text-slate-900 dark:text-white ${
                    productDetails?.salePrice > 0 ? "line-through text-slate-400 text-xl" : ""
                  }`}
                >
                  ${productDetails?.price}
                </p>
                {productDetails?.salePrice > 0 ? (
                  <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    ${productDetails?.salePrice}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-2 mt-1 mb-4">
                <div className="flex items-center gap-0.5">
                  <StarRatingComponent rating={averageReview} />
                </div>
                <span className="text-slate-600 dark:text-slate-300 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {averageReview.toFixed(2)} / 5
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full opacity-60 cursor-not-allowed bg-slate-200 text-slate-500 rounded-xl font-bold py-3">
                  Out of Stock
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-xs transition-colors"
                    onClick={() =>
                      handleAddToCart(
                        productDetails?._id,
                        productDetails?.totalStock
                      )
                    }
                  >
                    Add to Cart
                  </Button>
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl shadow-xs transition-colors"
                    onClick={() =>
                      handleBuyNow(
                        productDetails?._id,
                        productDetails?.totalStock
                      )
                    }
                  >
                    Buy Now
                  </Button>
                </div>
              )}
            </div>

            <Separator className="bg-slate-200 dark:bg-slate-800" />

            {/* Reviews Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Customer Reviews</h2>
              <div className="max-h-[160px] overflow-y-auto space-y-3 pr-2">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem) => (
                    <div key={reviewItem._id} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs">
                      <Avatar className="w-8 h-8 bg-indigo-600 text-white font-bold">
                        <AvatarFallback className="bg-indigo-600 text-white text-xs">
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white">{reviewItem?.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent rating={reviewItem?.reviewValue} />
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">{reviewItem.reviewMessage}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review!</p>
                )}
              </div>

              {/* Add Review Box */}
              <div className="mt-4 flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <Label className="text-xs font-bold text-slate-900 dark:text-white">Write a Review</Label>
                <div className="flex gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs rounded-xl"
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === ""}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal
        open={openAuthModal}
        setOpen={setOpenAuthModal}
        initialMode="login"
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default ProductDetailsDialog;