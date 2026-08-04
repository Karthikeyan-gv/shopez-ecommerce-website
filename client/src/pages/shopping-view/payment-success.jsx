import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "@/store/shop/order-slice";
import Invoice from "@/components/shopping-view/invoice";
import { CheckCircle2 } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { orderDetails } = useSelector((state) => state.shopOrder);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [orderId, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 max-w-4xl mx-auto w-full">
      <Card className="w-full glass-panel rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
        <CardHeader className="p-0 text-center mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-600 animate-bounce" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Payment Successful!</CardTitle>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>
        </CardHeader>
        <CardContent className="p-0 space-y-6">
          {orderDetails ? (
            <Invoice orderDetails={orderDetails} userName={user?.userName} />
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">Loading order details...</p>
            </div>
          )}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-xs"
              onClick={() => navigate("/shop/account")}
            >
              View My Orders
            </Button>
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 dark:text-slate-200 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => navigate("/shop/listing")}
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
