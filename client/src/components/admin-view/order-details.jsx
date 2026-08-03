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
    <DialogContent className="sm:max-w-[600px] bg-white text-black">
      <div className="flex justify-end mb-2">
        <Button
          size="sm"
          onClick={handleDownloadInvoice}
          className="bg-sky-950 text-white flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Download Invoice
        </Button>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Order Date</p>
              <Label>
                {orderDetails?.orderDate
                  ? orderDetails.orderDate.split("T")[0]
                  : "N/A"}
              </Label>
            </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 text-white ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li key={item.productId || item.title} className="flex items-center justify-between">
                      <span>Title: {item.title}</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>Price: ${item.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
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