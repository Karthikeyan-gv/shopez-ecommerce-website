import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {toast} from 'react-toastify';

import AuthModal from "@/components/common/auth-modal";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [pendingBuyNow, setPendingBuyNow] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const categorySearchParam = searchParams.get("category");
  const { cartItems } = useSelector((state) => state.shopCart);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!user) {
      sessionStorage.setItem(
        "pendingCartAction",
        JSON.stringify({ productId: getCurrentProductId, isBuyNow: false })
      );
      setPendingProduct(getCurrentProductId);
      setPendingBuyNow(false);
      setOpenAuthModal(true);
      return;
    }

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast(`Only ${getQuantity} quantity can be added for this item`);
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast("Product is added to cart");
      }
    });
  }

  function handleBuyNow(getCurrentProductId, getTotalStock) {
    if (!user) {
      sessionStorage.setItem(
        "pendingCartAction",
        JSON.stringify({ productId: getCurrentProductId, isBuyNow: true })
      );
      setPendingProduct(getCurrentProductId);
      setPendingBuyNow(true);
      setOpenAuthModal(true);
      return;
    }

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast(`Only ${getQuantity} quantity can be added for this item`);
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        navigate("/shop/checkout");
      }
    });
  }

  function handleAuthSuccess(loggedInUser) {
    if (pendingProduct && loggedInUser?.id) {
      dispatch(
        addToCart({
          userId: loggedInUser.id,
          productId: pendingProduct,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(loggedInUser.id));
          if (pendingBuyNow) {
            navigate("/shop/checkout");
          } else {
            toast("Product added to cart!");
          }
          setPendingProduct(null);
          setPendingBuyNow(false);
        }
      });
    }
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="flex flex-col w-full">
        <div className="glass-panel p-5 rounded-2xl border border-purple-100/80 bg-white/80 flex items-center justify-between mb-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-purple-950 tracking-tight">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-purple-200 text-purple-900 hover:bg-purple-50 rounded-xl text-xs font-bold"
                >
                  <ArrowUpDownIcon className="h-3.5 w-3.5 text-purple-600" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] bg-white/95 backdrop-blur-md text-slate-900 border-purple-100 shadow-xl rounded-xl"
              >
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                      className="focus:bg-purple-50 focus:text-purple-900 cursor-pointer text-xs font-medium"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productList.map((productItem) => (
            <ShoppingProductTile
              key={productItem._id}
              handleGetProductDetails={handleGetProductDetails}
              product={productItem}
              handleAddtoCart={handleAddtoCart}
              handleBuyNow={handleBuyNow}
            />
          ))}
        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

      <AuthModal
        open={openAuthModal}
        setOpen={setOpenAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default ShoppingListing;
