import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Printer, Download } from "lucide-react";

function Invoice({ orderDetails, userName }) {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a hidden iframe for printing the invoice only
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${orderDetails?._id || ""}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
            h1 { color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 10px; }
            h2 { color: #0f172a; margin-top: 30px; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
            .meta div { padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
            .meta .label { font-weight: bold; color: #475569; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f1f5f9; color: #0f172a; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; }
            .shipping { margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ShopEZ Invoice</h1>
            <div>
              <p><strong>Invoice #:</strong> ${orderDetails?._id || "N/A"}</p>
              <p><strong>Date:</strong> ${orderDetails?.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
          <div class="meta">
            <div><span class="label">Customer:</span> ${userName || "N/A"}</div>
            <div><span class="label">Payment Method:</span> ${orderDetails?.paymentMethod || "N/A"}</div>
            <div><span class="label">Payment Status:</span> ${orderDetails?.paymentStatus || "N/A"}</div>
            <div><span class="label">Order Status:</span> ${orderDetails?.orderStatus || "N/A"}</div>
          </div>
          <h2>Items</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails?.cartItems && orderDetails.cartItems.length > 0
                ? orderDetails.cartItems.map((item) => `
                    <tr>
                      <td>${item.title || "N/A"}</td>
                      <td>${item.quantity || 0}</td>
                      <td>$${Number(item.price || 0).toFixed(2)}</td>
                      <td>$${(Number(item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                    </tr>
                  `).join("")
                : "<tr><td colspan='4'>No items</td></tr>"}
            </tbody>
          </table>
          <div class="total">Total Amount: $${Number(orderDetails?.totalAmount || 0).toFixed(2)}</div>
          <h2>Shipping Information</h2>
          <div class="shipping">
            <p><strong>Address:</strong> ${orderDetails?.addressInfo?.address || "N/A"}</p>
            <p><strong>City:</strong> ${orderDetails?.addressInfo?.city || "N/A"}</p>
            <p><strong>Pincode:</strong> ${orderDetails?.addressInfo?.pincode || "N/A"}</p>
            <p><strong>Phone:</strong> ${orderDetails?.addressInfo?.phone || "N/A"}</p>
            ${orderDetails?.addressInfo?.notes ? `<p><strong>Notes:</strong> ${orderDetails.addressInfo.notes}</p>` : ""}
          </div>
          <div class="footer">Thank you for shopping with ShopEZ! This is a system-generated invoice.</div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-sky-950">ShopEZ Invoice</h2>
        <div className="flex gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="bg-sky-950 text-white flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Download Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Invoice #</p>
          <p className="font-medium">{orderDetails?._id || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Date</p>
          <p className="font-medium">
            {orderDetails?.orderDate
              ? new Date(orderDetails.orderDate).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Customer</p>
          <p className="font-medium">{userName || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Payment Method</p>
          <p className="font-medium capitalize">{orderDetails?.paymentMethod || "N/A"}</p>
        </div>
      </div>

      <Separator className="my-4" />

      <h3 className="font-semibold mb-2">Items</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3">Product</th>
              <th className="text-left py-2 px-3">Qty</th>
              <th className="text-left py-2 px-3">Price</th>
              <th className="text-left py-2 px-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails?.cartItems && orderDetails.cartItems.length > 0
              ? orderDetails.cartItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-3">{item.title || "N/A"}</td>
                    <td className="py-2 px-3">{item.quantity || 0}</td>
                    <td className="py-2 px-3">${Number(item.price || 0).toFixed(2)}</td>
                    <td className="py-2 px-3">
                      ${(Number(item.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))
              : (
                  <tr>
                    <td colSpan="4" className="py-2 px-3 text-center text-muted-foreground">
                      No items
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      <div className="text-right mt-4">
        <p className="text-xl font-bold">
          Total: ${Number(orderDetails?.totalAmount || 0).toFixed(2)}
        </p>
      </div>

      <Separator className="my-4" />

      <h3 className="font-semibold mb-2">Shipping Information</h3>
      <div className="bg-muted/50 rounded-lg p-4 text-sm grid gap-1">
        <p><strong>Address:</strong> {orderDetails?.addressInfo?.address || "N/A"}</p>
        <p><strong>City:</strong> {orderDetails?.addressInfo?.city || "N/A"}</p>
        <p><strong>Pincode:</strong> {orderDetails?.addressInfo?.pincode || "N/A"}</p>
        <p><strong>Phone:</strong> {orderDetails?.addressInfo?.phone || "N/A"}</p>
        {orderDetails?.addressInfo?.notes ? (
          <p><strong>Notes:</strong> {orderDetails.addressInfo.notes}</p>
        ) : null}
      </div>
    </div>
  );
}

export default Invoice;
