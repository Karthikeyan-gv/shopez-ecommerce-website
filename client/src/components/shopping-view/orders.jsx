import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user?.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <CardHeader className="p-0 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">Order History</CardTitle>
      </CardHeader>
      <CardContent className="p-0 border-none">
        <div className="w-full overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-800">
          <Table className="w-full min-w-[550px]">
            <TableHeader>
              <TableRow className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                <TableHead className="font-bold text-slate-900 dark:text-white text-xs">Order ID</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-white text-xs">Order Date</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-white text-xs">Order Status</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-white text-xs">Order Price</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => (
                  <TableRow key={orderItem._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-slate-200/60 dark:border-slate-800">
                    <TableCell className="font-medium text-slate-900 dark:text-white text-xs">{orderItem?._id}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300 text-xs">
                      {orderItem?.orderDate
                        ? orderItem.orderDate.split("T")[0]
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`py-0.5 px-2.5 text-white font-bold text-[11px] ${
                          orderItem?.orderStatus === "confirmed" || orderItem?.orderStatus === "delivered"
                            ? "bg-emerald-600"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600"
                            : "bg-indigo-600"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-extrabold text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm">${orderItem?.totalAmount}</TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs px-3 py-1.5"
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-400 text-xs font-medium">
                    No order history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
