import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Download, PackageCheck, Truck, CreditCard, Calendar, User, MapPin, Phone } from "lucide-react";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  const handleDownloadInvoice = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${orderDetails?._id || ""}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 40px auto; padding: 24px; color: #1e293b; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #7e22ce; padding-bottom: 16px; }
            h1 { color: #581c87; margin: 0; font-size: 28px; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0; background: #faf5ff; padding: 16px; border-radius: 12px; border: 1px solid #e9d5ff; }
            .meta div { padding: 4px 0; }
            .meta .label { font-weight: bold; color: #6b21a8; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #f1f5f9; }
            th { background: #f3e8ff; color: #581c87; font-size: 13px; text-transform: uppercase; }
            .total { text-align: right; margin-top: 24px; font-size: 20px; font-weight: bold; color: #581c87; }
            .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; }
            .shipping { margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>ShopEZ Invoice</h1>
              <p style="margin: 4px 0 0; color: #64748b; font-size: 13px;">Official Purchase Receipt</p>
            </div>
            <div style="text-align: right;">
              <p style="margin:0; font-weight: bold;">Invoice #: ${orderDetails?._id || "N/A"}</p>
              <p style="margin:4px 0 0; color: #64748b; font-size: 13px;">Date: ${orderDetails?.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
          <div class="meta">
            <div><span class="label">Customer Name:</span> ${user?.userName || "N/A"}</div>
            <div><span class="label">Payment Method:</span> ${orderDetails?.paymentMethod || "N/A"}</div>
            <div><span class="label">Payment Status:</span> ${orderDetails?.paymentStatus || "N/A"}</div>
            <div><span class="label">Order Status:</span> ${orderDetails?.orderStatus || "N/A"}</div>
          </div>
          <h2 style="font-size: 18px; color: #0f172a; margin-top: 24px;">Items Purchased</h2>
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
                      <td style="font-weight: 600;">${item.title || "N/A"}</td>
                      <td>${item.quantity || 0}</td>
                      <td>$${Number(item.price || 0).toFixed(2)}</td>
                      <td style="font-weight: bold; color: #6b21a8;">$${(Number(item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                    </tr>
                  `).join("")
                : "<tr><td colspan='4'>No items</td></tr>"}
            </tbody>
          </table>
          <div class="total">Total Paid: $${Number(orderDetails?.totalAmount || 0).toFixed(2)}</div>
          <h2 style="font-size: 18px; color: #0f172a; margin-top: 24px;">Shipping Information</h2>
          <div class="shipping">
            <p style="margin: 4px 0;"><strong>Recipient:</strong> ${user?.userName || "N/A"}</p>
            <p style="margin: 4px 0;"><strong>Address:</strong> ${orderDetails?.addressInfo?.address || "N/A"}</p>
            <p style="margin: 4px 0;"><strong>City / Pincode:</strong> ${orderDetails?.addressInfo?.city || "N/A"} - ${orderDetails?.addressInfo?.pincode || ""}</p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> ${orderDetails?.addressInfo?.phone || "N/A"}</p>
            ${orderDetails?.addressInfo?.notes ? `<p style="margin: 4px 0;"><strong>Notes:</strong> ${orderDetails.addressInfo.notes}</p>` : ""}
          </div>
          <div class="footer">Thank you for shopping with ShopEZ! For support contact support@shopez.com</div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  return (
    <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950 backdrop-blur-2xl rounded-2xl border border-purple-100 dark:border-purple-800 text-slate-900 dark:text-white p-6 sm:p-8 shadow-2xl">
      <DialogHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-purple-100 dark:border-purple-900 pb-4 gap-4">
        <div>
          <DialogTitle className="text-xl sm:text-2xl font-extrabold text-purple-950 dark:text-white flex items-center gap-2">
            <PackageCheck className="h-6 w-6 text-purple-700 dark:text-purple-400" />
            Order Details
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Order #{orderDetails?._id}
          </DialogDescription>
        </div>
        <Button
          size="sm"
          onClick={handleDownloadInvoice}
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md purple-glow-xs transition-all shrink-0"
        >
          <Download className="h-4 w-4" /> Download Invoice
        </Button>
      </DialogHeader>

      <div className="space-y-6 pt-4">
        {/* Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium block">Order Date</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              {orderDetails?.orderDate ? orderDetails.orderDate.split("T")[0] : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium block">Total Price</span>
            <span className="font-extrabold text-purple-700 dark:text-purple-400 text-sm mt-0.5 block">
              ${orderDetails?.totalAmount}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium block">Payment Method</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5 uppercase">
              <CreditCard className="w-3.5 h-3.5 text-purple-600" />
              {orderDetails?.paymentMethod || "Card"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium block">Payment Status</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 capitalize mt-0.5 block">
              {orderDetails?.paymentStatus || "Paid"}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium block">Order Status</span>
            <div className="mt-1">
              <Badge
                className={`py-1 px-3 text-white font-bold text-xs ${
                  orderDetails?.orderStatus === "confirmed" || orderDetails?.orderStatus === "delivered"
                    ? "bg-emerald-600"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-purple-700"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div>
          <h3 className="font-extrabold text-sm text-purple-950 dark:text-white mb-3 flex items-center gap-2">
            <span>Purchased Items</span>
            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded-full font-bold">
              {orderDetails?.cartItems?.length || 0}
            </span>
          </h3>
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
              orderDetails.cartItems.map((item, idx) => (
                <div
                  key={item?.productId || item?._id || idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    {item?.image ? (
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-purple-100" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center">
                        {idx + 1}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item?.title}</h4>
                      <p className="text-slate-500 text-[11px] font-medium">Qty: {item?.quantity || 1} × ${item?.price}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-purple-700 dark:text-purple-400 text-sm">
                    ${((item?.price || 0) * (item?.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No item details available</p>
            )}
          </div>
        </div>

        <Separator className="bg-purple-100 dark:bg-purple-900" />

        {/* Shipping Information */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
          <h3 className="font-extrabold text-purple-950 dark:text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-purple-600" /> Shipping Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 pt-1">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-bold">{user?.userName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{orderDetails?.addressInfo?.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {orderDetails?.addressInfo?.address}, {orderDetails?.addressInfo?.city} - {orderDetails?.addressInfo?.pincode}
              </span>
            </div>
            {orderDetails?.addressInfo?.notes ? (
              <div className="sm:col-span-2 text-slate-500 italic pt-1 border-t border-slate-200/50 dark:border-slate-800">
                Notes: {orderDetails.addressInfo.notes}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;