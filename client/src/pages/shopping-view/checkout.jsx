import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePayment() {
    const cartItemsList = cartItems?.items || [];

    if (cartItemsList.length === 0) {
      toast("Your cart is empty. Please add items to proceed");
      return;
    }

    if (currentSelectedAddress === null) {
      toast("Please select one address to proceed.");
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItemsList.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "card",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
        navigate(`/shop/demo-payment?orderId=${data.payload.orderId}`);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50/40 via-white to-purple-50/20 py-8 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <div className="relative h-[250px] w-full overflow-hidden rounded-2xl border border-purple-100 shadow-md mb-8">
        <img src={img} className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/80 via-purple-900/60 to-transparent flex items-center p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Checkout Order</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
        <div className="glass-panel p-6 rounded-2xl border border-purple-100/80 bg-white/80 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-extrabold text-purple-950 mb-4 pb-3 border-b border-purple-100">Order Summary</h2>
            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
              {cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items.map((item) => (
                    <UserCartItemsContent key={item?.productId || item?._id} cartItem={item} />
                  ))
                : null}
            </div>
          </div>
          <div className="pt-6 border-t border-purple-100 mt-6 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-extrabold text-slate-900">Total Order Amount</span>
              <span className="font-extrabold text-purple-700 text-2xl">${totalCartAmount}</span>
            </div>
            <Button onClick={handleInitiatePayment} className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md purple-glow-sm transition-all text-sm">
              {isPaymentStart
                ? "Processing Payment..."
                : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
