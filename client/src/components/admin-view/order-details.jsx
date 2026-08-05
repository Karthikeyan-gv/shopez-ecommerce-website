import { useState } from "react";
import CommonForm from "../common/form";
import { Button } from "../ui/button";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import {toast} from 'react-toastify';

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleDownloadInvoice = () => {
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
            <div><span class="label">Customer:</span> ${user?.userName || "N/A"}</div>
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

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast(data?.payload?.message);
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[650px] bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Order Details</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Order ID: #{orderDetails?._id}</p>
        </div>
        <Button
          size="sm"
          onClick={handleDownloadInvoice}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs px-4 py-2 shadow-xs transition-all hover:scale-105 flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Download Invoice
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Order Info Summary */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 grid gap-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-600 dark:text-slate-400">Order Date</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {orderDetails?.orderDate
                ? orderDetails.orderDate.split("T")[0]
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-600 dark:text-slate-400">Order Total</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-base">
              ${orderDetails?.totalAmount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-600 dark:text-slate-400">Payment Method</span>
            <span className="font-semibold text-slate-900 dark:text-white uppercase text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
              {orderDetails?.paymentMethod}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-600 dark:text-slate-400">Payment Status</span>
            <span className="font-semibold text-slate-900 dark:text-white capitalize">
              {orderDetails?.paymentStatus}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-600 dark:text-slate-400">Order Status</span>
            <Badge
              className={`py-1 px-3 text-white font-extrabold text-[11px] rounded-lg shadow-xs uppercase tracking-wider ${
                orderDetails?.orderStatus === "confirmed" || orderDetails?.orderStatus === "delivered"
                  ? "bg-emerald-600"
                  : orderDetails?.orderStatus === "rejected"
                  ? "bg-rose-600"
                  : "bg-amber-500"
              }`}
            >
              {orderDetails?.orderStatus}
            </Badge>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="grid gap-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-xs">Ordered Items</h3>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <ul className="grid gap-3 text-sm divide-y divide-slate-200 dark:divide-slate-700">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (
                    <li key={item.productId || item.title || index} className={`${index > 0 ? "pt-3" : ""} flex items-center justify-between`}>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))
                : <li className="text-slate-500 text-xs">No items found</li>}
            </ul>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="grid gap-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-xs">Shipping Information</h3>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 grid gap-1">
            <p className="font-bold text-slate-900 dark:text-white">{user?.userName}</p>
            <p>{orderDetails?.addressInfo?.address}</p>
            <p>{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</p>
            <p>Phone: {orderDetails?.addressInfo?.phone}</p>
            {orderDetails?.addressInfo?.notes && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Note: {orderDetails?.addressInfo?.notes}
              </p>
            )}
          </div>
        </div>

        {/* Update Status Form */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <CommonForm
            formControls={[
              {
                label: "Update Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;