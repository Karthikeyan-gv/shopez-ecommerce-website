

import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

function AdminFeatures() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  function handleUploadBanner() {
    if (!uploadedImageUrl) {
      toast("Please select and upload a banner image first.");
      return;
    }
    toast.success("Feature banner uploaded successfully!");
    setImageFile(null);
    setUploadedImageUrl("");
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Store Feature Banners
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload custom promotional banners to display on the storefront homepage slideshow.
          </p>
        </div>
      </div>

      <Card className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Upload New Banner
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button
            onClick={handleUploadBanner}
            disabled={!uploadedImageUrl || imageLoadingState}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-xs transition-colors text-sm flex items-center justify-center gap-2"
          >
            <ImageIcon className="w-4 h-4" /> Save Feature Banner
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminFeatures;