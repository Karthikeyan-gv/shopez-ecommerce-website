import { AlignJustify, LogOut, Moon, Sun, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { resetTokenAndCredentials } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  function handleToggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    toast(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} mode`);
  }

  function handleLogout() {
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3.5 glass-header-nav bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="icon"
          className="lg:hidden border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl"
        >
          <AlignJustify className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
          <Shield className="h-3.5 w-3.5" />
          <span>Admin Portal Control Center</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark / Light Mode Toggle */}
        <Button
          onClick={handleToggleTheme}
          variant="outline"
          size="icon"
          className="border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full shadow-xs transition-transform hover:scale-105"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-indigo-600 fill-indigo-100" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-xl px-4 py-2 text-xs sm:text-sm font-bold shadow-xs bg-indigo-600 hover:bg-indigo-700 text-white transition-all hover:scale-105 active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;