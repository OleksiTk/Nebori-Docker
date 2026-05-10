const isServer = typeof window === "undefined";

// Хелпер, який гарантовано прибирає кінцевий слеш
const cleanUrl = (url: string) => url.replace(/\/$/, "");

/*
 * Якщо на порту 8103 висить сам бекенд (FastAPI),
 * йому найімовірніше НЕ потрібен префікс /api/metadata.
 * Тому для сервера вказуємо чистий хост+порт.
 */
export const METADATA_API_URL = cleanUrl(
  isServer
    ? (process.env.METADATA_API_URL ?? "http://localhost:8103")
    : (process.env.NEXT_PUBLIC_METADATA_API_URL ??
        "http://localhost/api/metadata"),
);

/**
 * UPLOAD API
 */
export const UPLOAD_API_URL = cleanUrl(
  isServer
    ? (process.env.UPLOAD_API_URL ?? "http://localhost:8101")
    : (process.env.NEXT_PUBLIC_UPLOAD_API_URL ?? "http://localhost/api/upload"),
);

/**
 * MINIO API (зазвичай віддає статику, тому шлях часто однаковий,
 * але якщо є внутрішній доступ — розділяємо аналогічно)
 */
export const MINIO_API_URL = cleanUrl(
  process.env.NEXT_PUBLIC_MINIO_API_URL ?? "http://localhost/media",
);
