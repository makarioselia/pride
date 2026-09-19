const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * Uploads an image directly from the browser to Cloudinary using an
 * unsigned upload preset. No API secret is ever used on the frontend.
 */
export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  if (!cloudinaryConfigured) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET."
    );
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be smaller than 10 MB.");
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.timeout = 60_000;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve({ secure_url: data.secure_url, public_id: data.public_id });
      } else {
        let message = `Cloudinary upload failed (HTTP ${xhr.status})`;
        try {
          const data = JSON.parse(xhr.responseText);
          message = data.error?.message || message;
        } catch {
          // Keep the generic message when Cloudinary does not return JSON.
        }
        reject(new Error(message));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.ontimeout = () => reject(new Error("Cloudinary upload timed out. Check your internet connection."));
    xhr.send(formData);
  });
}

/** Returns an optimized, responsive Cloudinary delivery URL. */
export function optimizedUrl(secureUrl: string, width?: number): string {
  if (!secureUrl.includes("/upload/")) return secureUrl;
  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);
  return secureUrl.replace("/upload/", `/upload/${transforms.join(",")}/`);
}
