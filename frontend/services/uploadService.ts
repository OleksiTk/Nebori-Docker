import { UPLOAD_API_URL } from "./api";

export type UploadResponse = {
  id: string;
  video_id: string;
  user_id: string;
  title: string;
  filename: string;
  s3_path: string;
  status: string;
  created_at: string;
};

export async function uploadVideo(
  videoId: string,
  userId: string | number,
  title: string,
  file: File,
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("video_id", videoId);
  formData.append("user_id", String(userId));
  formData.append("file", file);

  const response = await fetch(`${UPLOAD_API_URL}/videos/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to upload video");
  }

  return response.json();
}

export async function checkUploadHealth(): Promise<{
  status: string;
  service: string;
}> {
  const response = await fetch(`${UPLOAD_API_URL}/health`);
  if (!response.ok) throw new Error("Upload service is not available");
  return response.json();
}
