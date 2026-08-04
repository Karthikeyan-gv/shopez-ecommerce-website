import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Root path: redirect to home or admin dashboard
  if (location.pathname === "/") {
    if (isAuthenticated && user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/shop/home" />;
  }

  // Redirect authenticated users away from auth pages (login / register)
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Protected User Routes (require authentication)
  const isProtectedUserRoute =
    location.pathname.includes("/shop/checkout") ||
    location.pathname.includes("/shop/account") ||
    location.pathname.includes("/shop/demo-payment") ||
    location.pathname.includes("/shop/payment-success") ||
    location.pathname.includes("/shop/paypal-cancel");

  if (!isAuthenticated && isProtectedUserRoute) {
    return <Navigate to="/auth/login" />;
  }

  // Protected Admin Routes
  if (location.pathname.includes("/admin")) {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }
    if (user?.role !== "admin") {
      return <Navigate to="/unauth-page" />;
    }
  }

  // Admin trying to access /shop routes
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("/shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;