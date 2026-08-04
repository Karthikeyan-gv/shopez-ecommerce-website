import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md bg-white/95 backdrop-blur-2xl text-slate-900 border-l border-purple-100 px-6 py-6 flex flex-col shadow-2xl">
      <SheetHeader className="mb-4 pb-3 border-b border-purple-100">
        <SheetTitle className="text-xl font-extrabold text-purple-950">Your Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-2 space-y-4 overflow-y-auto flex-1 pr-1">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent key={item?.productId || item?._id} cartItem={item} />
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 font-medium">Your cart is currently empty</div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-purple-100 space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-extrabold text-slate-900 text-base">Total</span>
          <span className="font-extrabold text-purple-700 text-xl">${totalCartAmount}</span>
        </div>

        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          disabled={!cartItems || cartItems.length === 0}
          className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md purple-glow-sm transition-all"
        >
          Checkout Now
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
