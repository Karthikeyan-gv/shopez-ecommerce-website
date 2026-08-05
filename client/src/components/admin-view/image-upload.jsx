import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { API_URL } from "@/config";


function ProductImageUpload({
  imageFile,
  setImageFile,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  useEffect(() => {
    async function uploadImageToCloudinary() {
      setImageLoadingState(true);
      const data = new FormData();
      data.append("my_file", imageFile);
      const response = await axios.post(
        `${API_URL}/api/admin/products/upload-image`,
        data
      );
      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
      }
    }

    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile, setImageLoadingState, setUploadedImageUrl]);
  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">Upload Product Image</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60 cursor-not-allowed" : "hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer"
        } border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-2xl p-6 transition-all`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? "cursor-not-allowed" : "cursor-pointer"} flex flex-col items-center justify-center h-32 text-center`}
          >
            <UploadCloudIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-2 animate-bounce" />
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
              Drag & drop or click to upload image
            </span>
            <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        ) : (       
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{imageFile.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg h-8 w-8 shrink-0"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
