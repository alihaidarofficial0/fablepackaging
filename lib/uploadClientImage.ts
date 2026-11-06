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

export async function uploadClientImage(
  file: File,
  slug?: string,
  folder?: string
): Promise<UploadImageResult> {
  if (!isAllowedImage(file)) {
    return { success: false, error: "Please select a valid image file (JPG, PNG, WebP, SVG, or ICO)." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { success: false, error: "Image must be under 10MB." };
  }

  const formData = new FormData();
  formData.append("file", file);
  if (slug) formData.append("slug", slug);
  if (folder) formData.append("folder", folder);

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

export async function applyImageSlug(
  url: string,
  slug: string,
  folder?: string
): Promise<UploadImageResult> {
  try {
    const response = await fetch("/api/upload", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, slug, folder }),
    });

    const data = await response.json();
    const imageUrl = data.imageUrl || data.url;
    if (response.ok && data.success && imageUrl) {
      return { success: true, imageUrl };
    }

    return { success: false, error: data.error || "Failed to apply image slug." };
  } catch {
    return { success: false, error: "Failed to apply image slug. Please check your connection." };
  }
}
