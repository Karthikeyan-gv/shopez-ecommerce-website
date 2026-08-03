import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOrderDetails, capturePayment } from "@/store/shop/order-slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "react-toastify";

function DemoPaymentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { orderDetails } = useSelector((state) => state.shopOrder);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [orderId, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (
      !cardInfo.cardNumber ||
      !cardInfo.cardName ||
      !cardInfo.expiry ||
      !cardInfo.cvv
    ) {
      toast("Please fill in all payment details");
      return;
    }
    setIsProcessing(true);
    dispatch(capturePayment({ orderId })).then((data) => {
      if (data?.payload?.success) {
        toast("Payment successful!");
        navigate(`/shop/payment-success?orderId=${orderId}`);
      } else {
        setIsProcessing(false);
        toast(data?.payload?.message || "Payment failed. Please try again.");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <Card className="w-full max-w-lg p-8">
        <CardHeader className="p-0 text-center">
          <div className="flex justify-center mb-4">
            <CreditCard className="h-12 w-12 text-sky-950" />
          </div>
          <CardTitle className="text-2xl font-bold">Demo Payment</CardTitle>
          <p className="text-muted-foreground mt-2 text-sm">
            This is a demo payment page. No real payment will be processed.
          </p>
        </CardHeader>
        <CardContent className="p-0 mt-6">
          {orderDetails ? (
            <>
              <div className="flex justify-between items-center mb-4 p-4 bg-muted/50 rounded-lg">
                <span className="font-medium">Order Total</span>
                <span className="text-xl font-bold">
                  ${Number(orderDetails?.totalAmount || 0).toFixed(2)}
                </span>
              </div>
              <Separator className="my-4" />
              <form onSubmit={handlePay} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={cardInfo.cardNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    value={cardInfo.cardName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      placeholder="MM/YY"
                      value={cardInfo.expiry}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="123"
                      value={cardInfo.cvv}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-10 bg-sky-950 text-white flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  {isProcessing ? "Processing..." : "Pay Now"}
                </Button>
              </form>
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/shop/paypal-cancel")}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading order details...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DemoPaymentPage;
