import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

function PaypalCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <Card className="w-full max-w-md p-8 text-center">
        <CardHeader className="p-0">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-3xl font-bold">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <p className="text-muted-foreground mb-6">
            Your PayPal payment was cancelled. Your cart items are still saved.
            You can try again or continue shopping.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-sky-950 text-white"
              onClick={() => navigate("/shop/checkout")}
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              className="w-full"
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

export default PaypalCancelPage;

