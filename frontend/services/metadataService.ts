import { METADATA_API_URL } from "./api";

export type VideoMetadata = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "pending" | "processed";
  playlist_url: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  views_count: number;
  created_at: string;
};

export async function createVideoMetadata(
  userId: string | number,
  title: string,
  description: string,
): Promise<VideoMetadata> {
  const response = await fetch(`${METADATA_API_URL}/videos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: String(userId), title, description }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to create video metadata");
  }

  return response.json();
}

export async function getVideoMetadata(
  videoId: string,
): Promise<VideoMetadata> {
  const response = await fetch(`${METADATA_API_URL}/videos/${videoId}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to get video metadata");
  }
  return response.json();
}

export async function listVideos(
  limit?: number,
  offset?: number,
): Promise<VideoMetadata[]> {
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit.toString());
  if (offset) params.append("offset", offset.toString());

  const response = await fetch(
    `${METADATA_API_URL}/videos/?${params.toString()}`,
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to list videos");
  }
  return response.json();
}

export async function updateVideoMetadata(
  videoId: string,
  updates: Partial<{
    title: string;
    description: string;
    status: "pending" | "processed";
  }>,
): Promise<VideoMetadata> {
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
