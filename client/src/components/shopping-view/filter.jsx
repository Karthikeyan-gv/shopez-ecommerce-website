import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="glass-panel rounded-2xl shadow-sm border border-purple-100/80 bg-white/80 overflow-hidden">
      <div className="p-5 border-b border-purple-100/60 bg-purple-50/50">
        <h2 className="text-lg font-extrabold text-purple-950 tracking-tight">Filters</h2>
      </div>

      <div className="p-5 space-y-6">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-3">{keyItem}</h3>
              <div className="grid gap-2.5">
                {filterOptions[keyItem].map((option, idx) => (
                  <Label
                    key={option.id || option.label || idx}
                    className="flex font-medium items-center gap-2.5 text-slate-700 hover:text-purple-700 transition-colors cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                      className="border-purple-300 data-[state=checked]:bg-purple-700 data-[state=checked]:border-purple-700"
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator className="bg-purple-100/80 my-2" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
