import { METADATA_API_URL, METADATA_BASE } from "./api";

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

export async function createVideoMetadata(
  title: string,
  description?: string,
): Promise<VideoRead> {
  const response = await fetch(`${METADATA_API_URL}/videos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to create video metadata");
  }

  return response.json();
}

export async function getVideoMetadata(videoId: string): Promise<VideoRead> {
  const response = await fetch(`${METADATA_BASE}/videos/${videoId}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to get video metadata");
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

  const response = await fetch(`${METADATA_BASE}/videos?${params.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to list videos");
  }
  return response.json();
}

export async function updateVideoMetadata(
  videoId: string,
  updates: {
    title?: string;
    description?: string;
  },
): Promise<VideoRead> {
  const response = await fetch(`${METADATA_API_URL}/videos/${videoId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to update video metadata");
  }

  return response.json();
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
