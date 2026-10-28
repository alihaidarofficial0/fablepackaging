const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_NAME = /\.(png|jpe?g|webp|gif|avif|svg|ico)$/i;

function isAllowedImage(file: File) {
  return file.type.startsWith("image/") || ALLOWED_NAME.test(file.name);
}

export type UploadImageResult = {
  success: boolean;
  imageUrl?: string;
  error?: string;
};

export async function uploadClientImage(file: File): Promise<UploadImageResult> {
  if (!isAllowedImage(file)) {
    return { success: false, error: "Please select a valid image file (JPG, PNG, WebP, SVG, or ICO)." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { success: false, error: "Image must be under 10MB." };
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    const imageUrl = data.imageUrl || data.url;
    if (response.ok && data.success && imageUrl) {
      return { success: true, imageUrl };
    }

    return { success: false, error: data.error || "Failed to upload image." };
  } catch {
    return { success: false, error: "Failed to upload image. Please check your connection." };
  }
}
