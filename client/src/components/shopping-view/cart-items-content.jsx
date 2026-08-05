import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "react-toastify";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );

        if (getCurrentProductIndex > -1) {
          const getTotalStock =
            productList[getCurrentProductIndex]?.totalStock || 0;

          if (indexOfCurrentCartItem > -1) {
            const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
            if (getQuantity + 1 > getTotalStock) {
              toast(`Only ${getQuantity} quantity can be added for this item`);
              return;
            }
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast("Cart item updated successfully");
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast("Cart item deleted successfully");
      }
    });
  }

const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80";

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-purple-50/40 border border-purple-100/60 shadow-2xs transition-all">
      <img
        src={cartItem?.image || DEFAULT_PRODUCT_IMAGE}
        alt={cartItem?.title || "Product"}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DEFAULT_PRODUCT_IMAGE;
        }}
        className="w-16 h-16 rounded-lg object-cover border border-purple-100"
      />

      <div className="flex flex-col justify-between flex-1">
        <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{cartItem?.title}</h3>

        <div className="flex items-center gap-2 mt-2">
          <Button
            disabled={cartItem?.quantity === 1}
            variant="outline"
            className="h-7 w-7 rounded-full border-purple-200 hover:bg-purple-100 text-purple-950 p-0"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-3 h-3 text-purple-700" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-bold text-xs text-purple-950 px-1">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-7 w-7 rounded-full border-purple-200 hover:bg-purple-100 text-purple-950 p-0"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-3 h-3 text-purple-700" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="font-extrabold text-sm text-purple-950">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <button
          onClick={() => handleCartItemDelete(cartItem)}
          className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
          title="Remove Item"
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
