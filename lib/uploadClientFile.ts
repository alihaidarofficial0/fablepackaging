export type UploadFileResult = {
  success: boolean;
  fileUrl?: string;
  name?: string;
  error?: string;
};

export async function uploadClientFile(file: File): Promise<UploadFileResult> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload/file", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    const fileUrl = data.fileUrl || data.url;
    if (response.ok && data.success && fileUrl) {
      return { success: true, fileUrl, name: file.name };
    }

    return { success: false, error: data.error || "Failed to upload file." };
  } catch {
    return { success: false, error: "Failed to upload file. Please check your connection." };
  }
}
