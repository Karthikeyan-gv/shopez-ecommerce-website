import { Button } from "@/components/ui/button";
import { Download, CheckCircle2 } from "lucide-react";

function Invoice({ orderDetails, userName }) {
  const handleDownload = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${orderDetails?._id || ""}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 40px auto; padding: 24px; color: #1e293b; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4f46e5; padding-bottom: 16px; }
            h1 { color: #312e81; margin: 0; font-size: 28px; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .meta div { padding: 4px 0; }
            .meta .label { font-weight: bold; color: #4338ca; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #f1f5f9; }
            th { background: #e0e7ff; color: #312e81; font-size: 13px; text-transform: uppercase; }
            .total { text-align: right; margin-top: 24px; font-size: 20px; font-weight: bold; color: #312e81; }
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
            <div><span class="label">Customer Name:</span> ${userName || "N/A"}</div>
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
                      <td style="font-weight: bold; color: #4338ca;">$${(Number(item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                    </tr>
                  `).join("")
                : "<tr><td colspan='4'>No items</td></tr>"}
            </tbody>
          </table>
          <div class="total">Total Paid: $${Number(orderDetails?.totalAmount || 0).toFixed(2)}</div>
          <h2 style="font-size: 18px; color: #0f172a; margin-top: 24px;">Shipping Information</h2>
          <div class="shipping">
            <p style="margin: 4px 0;"><strong>Recipient:</strong> ${userName || "N/A"}</p>
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
    <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="font-extrabold text-sm text-slate-900 dark:text-white">Order Receipt #{orderDetails?._id}</span>
        </div>
        <Button
          size="sm"
          onClick={handleDownload}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" /> Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
        <div>
          <span className="text-slate-500 block font-medium">Customer</span>
          <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{userName || "Customer"}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">Total Paid</span>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block mt-0.5">${orderDetails?.totalAmount}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">Method</span>
          <span className="font-bold text-slate-900 dark:text-white uppercase block mt-0.5">{orderDetails?.paymentMethod || "Card"}</span>
        </div>
        <div>
          <span className="text-slate-500 block font-medium">Status</span>
          <span className="font-bold text-emerald-600 block mt-0.5 capitalize">{orderDetails?.orderStatus || "Confirmed"}</span>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
