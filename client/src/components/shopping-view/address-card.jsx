import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-200 rounded-xl overflow-hidden ${
        isSelected
          ? "border-2 border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-xs"
          : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <CardContent className="grid p-4 gap-2 text-xs">
        <Label className="font-bold text-slate-900 dark:text-white">Address: <span className="font-normal text-slate-600 dark:text-slate-300">{addressInfo?.address}</span></Label>
        <Label className="font-bold text-slate-900 dark:text-white">City: <span className="font-normal text-slate-600 dark:text-slate-300">{addressInfo?.city}</span></Label>
        <Label className="font-bold text-slate-900 dark:text-white">Pincode: <span className="font-normal text-slate-600 dark:text-slate-300">{addressInfo?.pincode}</span></Label>
        <Label className="font-bold text-slate-900 dark:text-white">Phone: <span className="font-normal text-slate-600 dark:text-slate-300">{addressInfo?.phone}</span></Label>
        {addressInfo?.notes ? (
          <Label className="font-bold text-slate-900 dark:text-white">Notes: <span className="font-normal text-slate-600 dark:text-slate-300">{addressInfo?.notes}</span></Label>
        ) : null}
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between gap-2 border-t border-slate-200/60 dark:border-slate-800 mt-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          variant="outline"
          className="h-8 text-xs font-bold border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex-1"
        >
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          variant="outline"
          className="h-8 text-xs font-bold border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 flex-1"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
