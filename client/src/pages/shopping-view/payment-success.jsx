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
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <Card className="w-full max-w-2xl p-8">
        <CardHeader className="p-0 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-4xl font-bold">Payment Successful!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          {orderDetails ? (
            <Invoice orderDetails={orderDetails} userName={user?.userName} />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading order details...</p>
            </div>
          )}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-sky-950 text-white"
              onClick={() => navigate("/shop/account")}
            >
              View Orders
            </Button>
            <Button
              variant="outline"
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
