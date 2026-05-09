export const METADATA_BASE =
  typeof window === "undefined"
    ? (process.env.METADATA_API_URL ?? "http://localhost:8103")
    : (process.env.NEXT_PUBLIC_METADATA_API_URL ??
      "http://localhost/api/metadata");

export const UPLOAD_API_URL = (
  process.env.NEXT_PUBLIC_UPLOAD_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export const METADATA_API_URL = (
  process.env.NEXT_PUBLIC_METADATA_API_URL ?? "http://localhost:8001"
).replace(/\/$/, "");

export const MINIO_API_URL = (
  process.env.NEXT_PUBLIC_MINIO_API_URL ?? "http://localhost:9000"
).replace(/\/$/, "");
