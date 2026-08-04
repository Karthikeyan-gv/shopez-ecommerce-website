import { useState } from "react";
import { loginFormControls } from "@/config";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "@/components/common/form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "@/store/auth-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast(`Welcome back, ${data.payload.user?.userName || "Customer"}!`);
        sessionStorage.setItem("token", JSON.stringify(data.payload.token));

        const pendingCart = JSON.parse(sessionStorage.getItem("pendingCartAction") || "null");
        if (pendingCart && pendingCart.productId) {
          dispatch(
            addToCart({
              userId: data.payload.user.id,
              productId: pendingCart.productId,
              quantity: 1,
            })
          ).then(() => {
            dispatch(fetchCartItems(data.payload.user.id));
            sessionStorage.removeItem("pendingCartAction");
            if (pendingCart.isBuyNow) {
              navigate("/shop/checkout");
            } else {
              navigate("/shop/home");
            }
          });
        } else {
          navigate("/shop/home");
        }
      } else {
        toast(data?.payload?.message || "Login failed. Please check credentials.");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-purple-950 dark:text-white">
          Sign in to ShopEZ
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?
          <Link
            className="font-bold ml-1.5 text-purple-700 dark:text-purple-400 hover:underline"
            to="/auth/register"
          >
            Create an account
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;
