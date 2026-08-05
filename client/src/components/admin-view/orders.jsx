import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
<Card className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm overflow-hidden">
      <CardHeader className="border-b border-slate-200 dark:border-slate-800 p-6 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">
            Order Management
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review and fulfill customer purchase orders across all categories.
          </p>
        </div>
        <span className="bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 font-bold px-3 py-1 rounded-full text-xs border border-indigo-200 dark:border-indigo-900">
          {orderList ? orderList.length : 0} Orders
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/60">
            <TableRow className="border-b border-slate-200 dark:border-slate-800">
              <TableHead className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 py-3.5 px-4">Order ID</TableHead>
              <TableHead className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 py-3.5 px-4">Order Date</TableHead>
              <TableHead className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 py-3.5 px-4">Order Status</TableHead>
              <TableHead className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 py-3.5 px-4">Total Amount</TableHead>
              <TableHead className="py-3.5 px-4 text-right">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800">
                    <TableCell className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 px-4 py-4">{orderItem?._id}</TableCell>
                    <TableCell className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-4 py-4">
                      {orderItem?.orderDate
                        ? orderItem.orderDate.split("T")[0]
                        : "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge
                        className={`py-1 px-3 text-white font-extrabold text-[11px] rounded-lg shadow-xs uppercase tracking-wider ${
                          orderItem?.orderStatus === "confirmed" || orderItem?.orderStatus === "delivered"
                            ? "bg-emerald-600"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-rose-600"
                            : "bg-amber-500"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-extrabold text-sm text-slate-900 dark:text-white px-4 py-4">${orderItem?.totalAmount}</TableCell>
                    <TableCell className="px-4 py-4 text-right">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button 
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-4 py-2 text-xs shadow-xs transition-all hover:scale-105"
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500 dark:text-slate-400">
                    No customer orders received yet.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
