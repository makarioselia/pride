import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOwnedWedding } from "../../hooks/useOwnedWedding";
import { subscribeGallery, addGalleryImage, updateGalleryImage, deleteGalleryImage } from "../../firestore/gallery";
import { updateWedding } from "../../firestore/weddings";
import { cloudinaryConfigured, uploadImageToCloudinary, optimizedUrl } from "../../services/cloudinary/upload";
import type { GalleryImage } from "../../types";
import { LoadingScreen, EmptyState } from "../../components/ui/States";

export default function AdminGallery() {
  const { wedding } = useOwnedWedding();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!wedding) return;
    return subscribeGallery(wedding.id, setImages);
  }, [wedding]);

  if (wedding === undefined) return <LoadingScreen />;
  if (!wedding) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const res = await uploadImageToCloudinary(files[i], setProgress);
        await addGalleryImage(wedding.id, {
          imageUrl: res.secure_url,
          publicId: res.public_id,
          order: images.length + i,
        });
      }
      toast.success("Photos uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
      e.target.value = "";
    }
  };

  const handleDelete = async (img: GalleryImage) => {
    if (!confirm("Delete this photo?")) return;
    await deleteGalleryImage(wedding.id, img.id);
    toast.success("Photo deleted");
  };

  const handleCaption = async (img: GalleryImage, caption: string) => {
    await updateGalleryImage(wedding.id, img.id, { caption });
  };

  const handleSetCover = async (img: GalleryImage) => {
    await updateWedding(wedding.id, { coverImage: img.imageUrl });
    toast.success("Cover image set");
  };

  const moveImage = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const a = images[index];
    const b = images[target];
    await updateGalleryImage(wedding.id, a.id, { order: b.order });
    await updateGalleryImage(wedding.id, b.id, { order: a.order });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl">Gallery</h1>
        <label className={`bg-gold text-white px-4 py-2 rounded-md text-xs uppercase tracking-widest ${cloudinaryConfigured ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
          {uploading ? `Uploading ${progress}%` : "+ Upload photos"}
          <input type="file" accept="image/*" multiple hidden onChange={handleUpload} disabled={uploading || !cloudinaryConfigured} />
        </label>
      </div>

      {!cloudinaryConfigured && (
        <div className="border border-orange-200 bg-orange-50 text-orange-800 rounded-md p-4 mb-6 text-sm">
          Add an unsigned Cloudinary upload preset as <strong>VITE_CLOUDINARY_UPLOAD_PRESET</strong> in .env.local, then restart the dev server.
        </div>
      )}

      {images.length === 0 ? (
        <EmptyState title="No photos yet" subtitle="Upload photos to build your gallery." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div key={img.id} className="bg-white border border-champagne/60 rounded-lg overflow-hidden">
              <img src={optimizedUrl(img.imageUrl, 300)} className="w-full h-32 object-cover" />
              <div className="p-2 space-y-1.5">
                <input
                  defaultValue={img.caption}
                  placeholder="Caption"
                  onBlur={(e) => handleCaption(img, e.target.value)}
                  className="w-full text-xs border border-champagne rounded px-2 py-1 outline-none"
                />
                <div className="flex justify-between text-[10px] uppercase tracking-wide">
                  <button onClick={() => moveImage(i, -1)} className="opacity-60">↑</button>
                  <button onClick={() => moveImage(i, 1)} className="opacity-60">↓</button>
                  <button onClick={() => handleSetCover(img)} className="text-gold">Cover</button>
                  <button onClick={() => handleDelete(img)} className="text-red-600">Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
