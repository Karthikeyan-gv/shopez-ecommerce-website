import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  SlidersHorizontal,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket className="h-5 w-5" />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-6 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 text-sm font-bold ${
              isActive
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            {menuItem.icon}
            <span>{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-6">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <SheetTitle className="flex gap-2.5 items-center cursor-pointer text-left" onClick={() => { navigate("/admin/dashboard"); setOpen(false); }}>
                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
                  <ChartNoAxesCombined className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Shop<span className="text-indigo-600 dark:text-indigo-400">EZ</span>
                  <span className="text-[10px] font-extrabold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full ml-1 border border-indigo-200 dark:border-indigo-900">
                    Admin
                  </span>
                </span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 transition-colors min-h-screen">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2.5 mb-8 group"
        >
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm group-hover:scale-105 transition-transform">
            <ChartNoAxesCombined className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
            Shop<span className="text-indigo-600 dark:text-indigo-400">EZ</span>
            <span className="text-[10px] font-extrabold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full ml-1.5 border border-indigo-200 dark:border-indigo-900">
              Admin
            </span>
          </span>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
  