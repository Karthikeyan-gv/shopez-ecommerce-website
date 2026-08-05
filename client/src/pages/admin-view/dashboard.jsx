import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { 
  ShoppingBag, 
  ShoppingBasket, 
  BadgeCheck, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  PlusCircle, 
  Eye, 
  Clock, 
  DollarSign 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function AdminDashboard() {
  const fullText = "Welcome to ShopEZ Admin Console";
  const [displayedText, setDisplayedText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productList } = useSelector((state) => state.adminProducts);
  const { orderList } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [fullText]);

  const totalProducts = productList ? productList.length : 0;
  const totalOrders = orderList ? orderList.length : 0;
  const pendingOrders = orderList ? orderList.filter(o => o.orderStatus === "pending" || o.orderStatus === "inProcess").length : 0;
  const totalRevenue = orderList 
    ? orderList.reduce((acc, order) => acc + (order?.totalAmount || 0), 0)
    : 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl royal-purple-gradient text-white p-8 md:p-10 shadow-xl border border-indigo-500/20">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-amber-300 border border-indigo-400/30 text-xs font-bold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>ShopEZ Executive Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white drop-shadow-sm min-h-[50px]">
              {displayedText}
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base opacity-90 max-w-lg">
              Manage your products, monitor incoming customer orders, and track your business metrics seamlessly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => navigate("/admin/products")}
              className="bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold rounded-xl px-5 py-3 shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-sm"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              Add Product
            </Button>
            <Button
              onClick={() => navigate("/admin/orders")}
              variant="outline"
              className="bg-indigo-800/40 hover:bg-indigo-800/70 border-indigo-400/30 text-white font-bold rounded-xl px-5 py-3 shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-sm backdrop-blur-sm"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              View Orders
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <Card className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Products</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {totalProducts}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 group-hover:scale-110 transition-transform">
              <ShoppingBasket className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Active Inventory
            </span>
            <span onClick={() => navigate("/admin/products")} className="text-indigo-600 dark:text-indigo-400 font-bold cursor-pointer hover:underline">
              Manage &rarr;
            </span>
          </div>
        </Card>

        {/* Total Orders */}
        <Card className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Orders</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {totalOrders}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 group-hover:scale-110 transition-transform">
              <BadgeCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
              Customer Orders
            </span>
            <span onClick={() => navigate("/admin/orders")} className="text-indigo-600 dark:text-indigo-400 font-bold cursor-pointer hover:underline">
              View All &rarr;
            </span>
          </div>
        </Card>

        {/* Pending Orders */}
        <Card className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Orders</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-amber-500 transition-colors">
                {pendingOrders}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              Requires Fulfillment
            </span>
            <span onClick={() => navigate("/admin/orders")} className="text-indigo-600 dark:text-indigo-400 font-bold cursor-pointer hover:underline">
              Process &rarr;
            </span>
          </div>
        </Card>

        {/* Sales Volume */}
        <Card className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Revenue</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                ${totalRevenue.toFixed(0)}
              </h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              Completed Orders
            </span>
            <span className="text-slate-400 font-medium">Gross Revenue</span>
          </div>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <Card 
          onClick={() => navigate("/admin/products")}
          className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-md group-hover:scale-110 transition-transform">
              <ShoppingBasket className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Manage Products Catalogue
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create new inventory items, upload high-res images, update pricing, discounts, and edit product specifications.
          </p>
        </Card>

        <Card 
          onClick={() => navigate("/admin/orders")}
          className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-md group-hover:scale-110 transition-transform">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Review Customer Orders
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View full order details, update shipping and payment statuses, print invoices, and process pending fulfillment requests.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
