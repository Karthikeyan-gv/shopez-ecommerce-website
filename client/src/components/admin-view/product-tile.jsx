import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Edit3, Trash2 } from "lucide-react";

const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const discountPercentage =
    product?.salePrice > 0 && product?.price > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <Card className="glass-panel rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between group h-full">
      <div>
        <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={product?.image || DEFAULT_PRODUCT_IMAGE}
            alt={product?.title || "Product"}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_PRODUCT_IMAGE;
            }}
            className="w-full h-[240px] object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product?.totalStock === 0 ? (
              <Badge className="bg-rose-600 text-white font-bold text-xs px-2.5 py-0.5 shadow-xs">
                Out Of Stock
              </Badge>
            ) : product?.totalStock < 10 ? (
              <Badge className="bg-amber-600 text-white font-bold text-xs px-2.5 py-0.5 shadow-xs">
                {`Only ${product?.totalStock} left`}
              </Badge>
            ) : discountPercentage > 0 ? (
              <Badge className="bg-indigo-600 text-white font-extrabold text-xs px-2.5 py-0.5 shadow-xs">
                -{discountPercentage}% OFF
              </Badge>
            ) : null}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900">
              {categoryOptionsMap[product?.category] || product?.category || "General"}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
              {brandOptionsMap[product?.brand] || product?.brand || ""}
            </span>
          </div>

          <h2 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
            {product?.title}
          </h2>

          <div className="flex items-baseline justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                ${product?.salePrice > 0 ? product?.salePrice : product?.price}
              </span>
              {product?.salePrice > 0 ? (
                <span className="line-through text-slate-400 text-xs font-semibold">
                  ${product?.price}
                </span>
              ) : null}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Stock: {product?.totalStock}
            </span>
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs py-2 shadow-xs transition-colors flex items-center justify-center gap-1.5"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit
        </Button>
        <Button
          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs py-2 shadow-xs transition-colors flex items-center justify-center gap-1.5"
          onClick={() => handleDelete(product?._id)}
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;