import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Heart, Eye, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  handleBuyNow,
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.some((item) => item._id === product?._id));
  }, [product?._id]);

  function handleToggleWishlist(e) {
    e.stopPropagation();
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (isWishlisted) {
      wishlist = wishlist.filter((item) => item._id !== product?._id);
      toast(`Removed "${product?.title}" from wishlist`);
      setIsWishlisted(false);
    } else {
      wishlist.push(product);
      toast(`Added "${product?.title}" to wishlist!`);
      setIsWishlisted(true);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
  }

  const discountPercentage =
    product?.salePrice > 0 && product?.price > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <Card className="glass-panel rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-transform duration-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between group">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={product?.image}
            alt={product?.title}
            loading="lazy"
            className="w-full h-[260px] object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product?.totalStock === 0 ? (
              <Badge className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-2.5 py-0.5 shadow-xs">
                Out Of Stock
              </Badge>
            ) : product?.totalStock < 10 ? (
              <Badge className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-2.5 py-0.5 shadow-xs">
                {`Only ${product?.totalStock} left`}
              </Badge>
            ) : discountPercentage > 0 ? (
              <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-2.5 py-0.5 shadow-xs">
                -{discountPercentage}% OFF
              </Badge>
            ) : null}
          </div>

          {/* Top Right Action Overlay (Wishlist & Quick View) */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full border transition-transform duration-150 active:scale-95 shadow-xs ${
                isWishlisted
                  ? "bg-rose-600 text-white border-rose-500"
                  : "bg-white/90 hover:bg-white text-slate-700 border-slate-200 hover:text-rose-600"
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleGetProductDetails(product?._id);
              }}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 border border-slate-200 hover:text-indigo-600 transition-transform duration-150 active:scale-95 shadow-xs"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        <CardContent className="p-4 flex-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>

          <h2 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1.5">
            {product?.title}
          </h2>

          {/* Star Ratings */}
          <div className="flex items-center gap-1 mb-2 text-amber-500 text-xs">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              ))}
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold ml-1">(4.9)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                ${product?.salePrice > 0 ? product?.salePrice : product?.price}
              </span>
              {product?.salePrice > 0 ? (
                <span className="line-through text-slate-400 text-xs font-semibold">
                  ${product?.price}
                </span>
              ) : null}
            </div>
            {discountPercentage > 0 && (
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                Save ${(product.price - product.salePrice).toFixed(0)}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed bg-slate-200 text-slate-500 rounded-xl text-xs font-bold">
            Out Of Stock
          </Button>
        ) : (
          <>
            <Button
              onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors py-2.5"
            >
              Add to Cart
            </Button>
            {handleBuyNow ? (
              <Button
                onClick={() => handleBuyNow(product?._id, product?.totalStock)}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors py-2.5"
              >
                Buy Now
              </Button>
            ) : null}
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
