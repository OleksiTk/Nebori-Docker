import { METADATA_API_URL } from "./api"; // Залишаємо один базовий URL

export type VideoStatus =
  | "queued"
  | "uploading"
  | "transcoding"
  | "published"
  | "blocked"
  | "deleted"
  | "error"
  | "canceled";

export type VideoRead = {
  id: string;
  user_id: number;
  title: string;
  description: string | null;
  status: VideoStatus;
  hls_urls: Record<string, string>;
  thumbnail_url: string | null;
  duration: number | null;
  views_count: number;
  created_at: string;
};

// Хелпер для обробки помилок, щоб не дублювати код
async function handleResponse<T>(response: Response, url?: string): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    // Виводимо в консоль URL, щоб побачити, куди саме пішов запит
    console.error(`[FETCH ERROR] 404 на адресі: ${response.url || url}`);
    throw new Error(
      errorData?.detail || `Request failed with status ${response.status}`,
    );
  }
  return response.json();
}

export async function listVideos(
  limit: number = 20,
  offset: number = 0,
): Promise<VideoRead[]> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  // ВАЖЛИВО: пишемо /videos без кінцевого слеша!
  const url = `${METADATA_API_URL}/videos?${params.toString()}`;

  const response = await fetch(url);
  return handleResponse<VideoRead[]>(response, url);
}

export async function createVideoMetadata(
  title: string,
  description?: string,
): Promise<VideoRead> {
  const response = await fetch(`${METADATA_API_URL}/videos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  return handleResponse<VideoRead>(response);
}

export async function getVideoMetadata(videoId: string): Promise<VideoRead> {
  const response = await fetch(`${METADATA_API_URL}/videos/${videoId}`);
  return handleResponse<VideoRead>(response);
}

export async function updateVideoMetadata(
  videoId: string,
  updates: { title?: string; description?: string },
): Promise<VideoRead> {
  const response = await fetch(`${METADATA_API_URL}/videos/${videoId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse<VideoRead>(response);
}

export async function deleteVideo(videoId: string): Promise<void> {
  const response = await fetch(`${METADATA_API_URL}/videos/${videoId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to delete video");
  }
}

export async function checkMetadataHealth(): Promise<{
  status: string;
  service: string;
}> {
  const response = await fetch(`${METADATA_API_URL}/health`);
  if (!response.ok) throw new Error("Metadata service is not available");
  return response.json();
}
