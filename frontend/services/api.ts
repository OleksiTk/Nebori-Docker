export const UPLOAD_API_URL = (
  process.env.NEXT_PUBLIC_UPLOAD_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export const METADATA_API_URL = (
  process.env.NEXT_PUBLIC_METADATA_API_URL ?? "http://localhost:8001"
).replace(/\/$/, "");
