"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react"; // 1. Додано Suspense
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProfileHoverCard } from "@/components/profile-hover-card";
import type { VideoItem } from "@/data/mock";

type StudioPageClientProps = {
  videos: VideoItem[];
};

type StudioTab = "all" | "published" | "draft" | "scheduled";
type StudioSection =
  | "dashboard"
  | "content"
  | "analytics"
  | "comments"
  | "channel_settings";
type AnalyticsPeriod = "7d" | "28d" | "90d";

type StudioVideoRow = {
  id: string;
  title: string;
  thumbnail: string;
  visibility: "Публічне" | "За посиланням" | "Приватне";
  status: "Опубліковано" | "Чернетка" | "Заплановано";
  date: string;
  views: number;
  likes: number;
  comments: number;
};

type FeedComment = {
  id: string;
  author: string;
  target: string;
  comment: string;
  time: string;
  videoId: string;
};

const sidebarItems: Array<{ id: StudioSection; label: string }> = [
  { id: "dashboard", label: "Дашборд" },
  { id: "content", label: "Контент" },
  { id: "analytics", label: "Аналітика" },
  { id: "comments", label: "Коментарі" },
  { id: "channel_settings", label: "Налаштування каналу" },
];

const trendByPeriod: Record<AnalyticsPeriod, number[]> = {
  "7d": [12, 18, 16, 21, 24, 27, 22],
  "28d": [8, 11, 10, 13, 15, 14, 17, 16, 19, 22, 20, 24, 23, 25],
  "90d": [5, 6, 8, 7, 9, 10, 11, 10, 12, 13, 12, 14, 15, 16, 17],
};

const trafficSources = [
  { source: "Рекомендації", share: 46 },
  { source: "Пошук", share: 29 },
  { source: "Підписки", share: 15 },
  { source: "Зовнішні сайти", share: 10 },
];

function slugifyGroup(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function readFileAsDataUrl(file: File, onLoad: (value: string) => void) {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      onLoad(reader.result);
    }
  };
  reader.readAsDataURL(file);
}

function parseViews(value: string): number {
  const match = value.match(/[\d]+([.,]\d+)?/);
  if (!match) return 0;
  const numeric = Number.parseFloat(match[0].replace(",", "."));
  const isThousands = value.includes("тис") || value.includes("С‚РёСЃ");
  return Math.round(numeric * (isThousands ? 1000 : 1));
}

function getStatus(index: number): StudioVideoRow["status"] {
  if (index % 7 === 0) return "Чернетка";
  if (index % 5 === 0) return "Заплановано";
  return "Опубліковано";
}

function getVisibility(index: number): StudioVideoRow["visibility"] {
  if (index % 6 === 0) return "За посиланням";
  if (index % 9 === 0) return "Приватне";
  return "Публічне";
}

function statusClasses(status: StudioVideoRow["status"]) {
  if (status === "Опубліковано") return "text-[#78d59a]";
  if (status === "Чернетка") return "text-[#d8dce6]";
  return "text-[#f2cd6b]";
}

function buildRows(videos: VideoItem[]): StudioVideoRow[] {
  return videos.slice(0, 12).map((item, index) => ({
    id: item.id,
    title: item.title,
    thumbnail: `https://picsum.photos/seed/studio-${item.id}/320/180`,
    visibility: getVisibility(index),
    status: getStatus(index),
    date: item.date,
    views: parseViews(item.views),
    likes: 88 - (index % 9) * 3,
    comments: 4 + (index % 12) * 3,
  }));
}

function buildComments(rows: StudioVideoRow[]): FeedComment[] {
  return rows.slice(0, 8).map((row, idx) => ({
    id: `cm-${row.id}`,
    author: [
      "Raptor",
      "Mira",
      "ScoutLine",
      "IronBand",
      "TokenCrafter",
      "DeltaNox",
      "Aria",
      "BorealFox",
    ][idx % 8],
    target: row.title,
    comment: [
      "Дуже чітко пояснив, дякую за розбір.",
      "Можна таймкод на момент з білдом?",
      "Онови, будь ласка, після наступного патча.",
      "Класний монтаж, дивиться легко.",
      "Підтвердив у себе, схема працює.",
      "Зроби ще випуск по цій темі.",
      "Було б круто більше прикладів із практики.",
      "Цей формат зайшов, продовжуй.",
    ][idx % 8],
    time: `${idx + 1} год тому`,
    videoId: row.id,
  }));
}

// 2. Змінено ім'я з StudioPageClient на StudioPageContent (це тепер внутрішній компонент)
function StudioPageContent({ videos }: StudioPageClientProps) {
  const searchParams = useSearchParams();
  const [section, setSection] = useState<StudioSection>("dashboard");
  const [tab, setTab] = useState<StudioTab>("all");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState<AnalyticsPeriod>("28d");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorDescription, setEditorDescription] = useState("");
  const [editorTags, setEditorTags] = useState("");
  const [editorVisibility, setEditorVisibility] =
    useState<StudioVideoRow["visibility"]>("Публічне");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState<"dropzone" | "basics">(
    "dropzone",
  );
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadPreviewName, setUploadPreviewName] = useState("");
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState("");
  const [uploadParamHandled, setUploadParamHandled] = useState(false);
  const [channelAvatarUrl, setChannelAvatarUrl] = useState(
    "https://i.pravatar.cc/160?img=2",
  );
  const [channelBannerUrl, setChannelBannerUrl] = useState(
    "https://picsum.photos/seed/studio-channel-banner/1200/360",
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadPreviewInputRef = useRef<HTMLInputElement | null>(null);
  const channelAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const channelBannerInputRef = useRef<HTMLInputElement | null>(null);

  const rows = useMemo(() => buildRows(videos), [videos]);
  const [commentsFeed, setCommentsFeed] = useState<FeedComment[]>(() =>
    buildComments(buildRows(videos)),
  );
  const [pinnedComments, setPinnedComments] = useState<Record<string, boolean>>(
    {},
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const byTab =
        tab === "all" ||
        (tab === "published" && row.status === "Опубліковано") ||
        (tab === "draft" && row.status === "Чернетка") ||
        (tab === "scheduled" && row.status === "Заплановано");
      if (!byTab) return false;
      if (!q) return true;
      return (
        row.title.toLowerCase().includes(q) || row.id.toLowerCase().includes(q)
      );
    });
  }, [rows, tab, query]);

  const totalViews = rows.reduce((acc, row) => acc + row.views, 0);
  const publishedCount = rows.filter(
    (row) => row.status === "Опубліковано",
  ).length;
  const totalComments = rows.reduce((acc, row) => acc + row.comments, 0);
  const trend = trendByPeriod[period] ?? trendByPeriod["28d"];
  const trendMax = Math.max(...trend, 1);
  const topVideos = [...rows].sort((a, b) => b.views - a.views).slice(0, 5);
  const draftAndScheduled = rows
    .filter((row) => row.status !== "Опубліковано")
    .slice(0, 6);
  const orderedComments = [...commentsFeed].sort(
    (a, b) =>
      Number(Boolean(pinnedComments[b.id])) -
      Number(Boolean(pinnedComments[a.id])),
  );
  const chartPoints = trend.map((point, idx) => ({
    x: (idx / Math.max(trend.length - 1, 1)) * 100,
    y: 100 - (point / trendMax) * 92,
  }));
  const chartLine = chartPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const chartArea = `0,100 ${chartLine} 100,100`;

  const openEditor = (row: StudioVideoRow) => {
    setEditingVideoId(row.id);
    setEditorTitle(row.title);
    setEditorDescription(
      "Опис відео. Додайте короткий контекст та ключові моменти.",
    );
    setEditorTags("гайд, nebori, контент");
    setEditorVisibility(row.visibility);
    setEditorOpen(true);
  };

  const openUploadModal = () => {
    setUploadModalOpen(true);
    setUploadStep("dropzone");
    setUploadedFileName("");
    setUploadPreviewName("");
    setUploadPreviewUrl("");
    setEditorTitle("");
    setEditorDescription("");
    setEditorTags("");
    setEditorVisibility("Публічне");
  };

  const handleUploadFile = (file?: File | null) => {
    if (!file) return;
    setUploadedFileName(file.name);
    setEditorTitle(file.name.replace(/\.[^/.]+$/, ""));
    setEditorDescription("Коротко опишіть відео для глядачів.");
    setEditorTags("nebori, відео");
    setEditorVisibility("Публічне");
    setUploadStep("basics");
    setSection("content");
    setTab("draft");
  };

  const handleUploadPreviewFile = (file?: File | null) => {
    if (!file) return;
    setUploadPreviewName(file.name);
    readFileAsDataUrl(file, setUploadPreviewUrl);
  };

  const handleChannelAvatarFile = (file?: File | null) => {
    if (!file) return;
    readFileAsDataUrl(file, setChannelAvatarUrl);
  };

  const handleChannelBannerFile = (file?: File | null) => {
    if (!file) return;
    readFileAsDataUrl(file, setChannelBannerUrl);
  };

  useEffect(() => {
    const shouldOpenUpload = searchParams.get("upload") === "1";
    if (shouldOpenUpload && !uploadParamHandled) {
      openUploadModal();
      setUploadParamHandled(true);
    }
  }, [searchParams, uploadParamHandled]);

  return (
    <section className="mx-auto w-full max-w-[1320px]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3 lg:sticky lg:top-[84px] lg:self-start">
          <div className="mb-3 border-b border-[rgba(255,255,255,0.08)] pb-3">
            <p className="text-xs uppercase tracking-[0.06em] text-nebori-muted">
              Nebori Studio
            </p>
            <p className="mt-1 text-lg font-semibold text-[#e6e9f3]">
              Nebori User
            </p>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`w-full rounded-[4px] border px-2.5 py-2 text-left text-sm transition ${
                  section === item.id
                    ? "border-[rgba(245,201,52,0.45)] bg-[rgba(245,201,52,0.1)] text-[#e9edf7]"
                    : "border-transparent text-nebori-muted hover:border-[rgba(255,255,255,0.12)] hover:text-nebori-text"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="space-y-4">
          <header className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold leading-none">
                  Студія каналу
                </h1>
                <p className="mt-1 text-sm text-nebori-muted">
                  Огляд ефективності та керування контентом
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSection("channel_settings")}
                  className="btn-ghost rounded-[4px] px-3 py-1.5 text-sm"
                >
                  Налаштувати канал
                </button>
                <button
                  type="button"
                  onClick={openUploadModal}
                  className="btn-primary rounded-[4px] px-3 py-1.5 text-sm"
                >
                  Завантажити відео
                </button>
              </div>
            </div>
          </header>

          {section === "dashboard" && (
            <>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setSection("analytics")}
                  className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3 text-left"
                >
                  <p className="text-xs text-nebori-muted">
                    Перегляди (28 днів)
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#e8edf9]">
                    {totalViews.toLocaleString("uk-UA")}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setSection("analytics")}
                  className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3 text-left"
                >
                  <p className="text-xs text-nebori-muted">
                    Підписники (28 днів)
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#e8edf9]">
                    +1 284
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSection("content");
                    setTab("published");
                  }}
                  className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3 text-left"
                >
                  <p className="text-xs text-nebori-muted">
                    Опубліковано відео
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#e8edf9]">
                    {publishedCount}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setSection("comments")}
                  className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3 text-left"
                >
                  <p className="text-xs text-nebori-muted">Нові коментарі</p>
                  <p className="mt-1 text-2xl font-bold text-[#e8edf9]">
                    {totalComments}
                  </p>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.75fr)_minmax(260px,0.55fr)]">
                <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-[#e6e9f3]">
                      Огляд динаміки
                    </h2>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setPeriod("7d")}
                        className={`rounded-[3px] border px-2 py-1 text-[11px] ${period === "7d" ? "btn-primary" : "btn-ghost"}`}
                      >
                        7д
                      </button>
                      <button
                        type="button"
                        onClick={() => setPeriod("28d")}
                        className={`rounded-[3px] border px-2 py-1 text-[11px] ${period === "28d" ? "btn-primary" : "btn-ghost"}`}
                      >
                        28д
                      </button>
                      <button
                        type="button"
                        onClick={() => setPeriod("90d")}
                        className={`rounded-[3px] border px-2 py-1 text-[11px] ${period === "90d" ? "btn-primary" : "btn-ghost"}`}
                      >
                        90д
                      </button>
                    </div>
                  </div>
                  <div className="h-40 rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-2">
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="h-full w-full"
                    >
                      <defs>
                        <linearGradient
                          id="studioTrendFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="rgba(245,210,81,0.48)" />
                          <stop
                            offset="100%"
                            stopColor="rgba(245,210,81,0.02)"
                          />
                        </linearGradient>
                      </defs>
                      <path d={`M ${chartArea}`} fill="url(#studioTrendFill)" />
                      <polyline
                        fill="none"
                        stroke="#f5d251"
                        strokeWidth="1.4"
                        points={chartLine}
                      />
                      {chartPoints.map((point, idx) => (
                        <circle
                          key={`pt-${idx}`}
                          cx={point.x}
                          cy={point.y}
                          r="1.2"
                          fill="#f5d251"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="rounded-[3px] border border-[rgba(255,255,255,0.1)] px-2 py-1.5 text-xs text-nebori-muted">
                      CTR: 6.8%
                    </div>
                    <div className="rounded-[3px] border border-[rgba(255,255,255,0.1)] px-2 py-1.5 text-xs text-nebori-muted">
                      Середній перегляд: 4:12
                    </div>
                    <div className="rounded-[3px] border border-[rgba(255,255,255,0.1)] px-2 py-1.5 text-xs text-nebori-muted">
                      Повернення: 38%
                    </div>
                  </div>
                </article>

                <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
                  <h2 className="mb-2 text-lg font-semibold text-[#e6e9f3]">
                    Швидкі дії
                  </h2>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSection("content");
                        setTab("draft");
                      }}
                      className="btn-primary w-full rounded-[4px] px-3 py-2 text-sm"
                    >
                      Створити чернетку
                    </button>
                    <button
                      type="button"
                      onClick={() => setSection("comments")}
                      className="btn-ghost w-full rounded-[4px] px-3 py-2 text-sm"
                    >
                      Модерація коментарів
                    </button>
                    <button
                      type="button"
                      onClick={() => setSection("analytics")}
                      className="btn-ghost w-full rounded-[4px] px-3 py-2 text-sm"
                    >
                      Розгорнута аналітика
                    </button>
                    <button
                      type="button"
                      onClick={() => setSection("channel_settings")}
                      className="btn-ghost w-full rounded-[4px] px-3 py-2 text-sm"
                    >
                      Налаштування каналу
                    </button>
                  </div>
                </article>
              </div>

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
                  <h2 className="mb-2 text-lg font-semibold text-[#e6e9f3]">
                    Чернетки та заплановані
                  </h2>
                  <ul className="divide-y divide-[rgba(255,255,255,0.08)]">
                    {draftAndScheduled.map((row) => (
                      <li
                        key={`ds-${row.id}`}
                        className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-[#dce4f3]">
                            {row.title}
                          </p>
                          <p className={`text-xs ${statusClasses(row.status)}`}>
                            {row.status}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openEditor(row)}
                          className="text-xs text-nebori-accent hover:underline"
                        >
                          Редагувати
                        </button>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
                  <h2 className="mb-2 text-lg font-semibold text-[#e6e9f3]">
                    Топ відео
                  </h2>
                  <ol className="divide-y divide-[rgba(255,255,255,0.08)]">
                    {topVideos.map((row, idx) => (
                      <li
                        key={`top-${row.id}`}
                        className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <span className="mr-2 text-xs text-nebori-muted">
                            {idx + 1}.
                          </span>
                          <Link
                            href={`/video/${row.id}`}
                            className="truncate text-sm text-[#dce4f3] hover:text-nebori-accent"
                          >
                            {row.title}
                          </Link>
                        </div>
                        <span className="ml-3 text-xs text-nebori-muted">
                          {Math.round(row.views / 1000)} тис.
                        </span>
                      </li>
                    ))}
                  </ol>
                </article>
              </div>
            </>
          )}

          {section === "content" && (
            <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-[#e6e9f3]">
                  Контент каналу
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTab("all")}
                    type="button"
                    className={`rounded-[4px] border px-2.5 py-1 text-xs ${tab === "all" ? "btn-primary" : "btn-ghost"}`}
                  >
                    Усі
                  </button>
                  <button
                    onClick={() => setTab("published")}
                    type="button"
                    className={`rounded-[4px] border px-2.5 py-1 text-xs ${tab === "published" ? "btn-primary" : "btn-ghost"}`}
                  >
                    Опубліковані
                  </button>
                  <button
                    onClick={() => setTab("draft")}
                    type="button"
                    className={`rounded-[4px] border px-2.5 py-1 text-xs ${tab === "draft" ? "btn-primary" : "btn-ghost"}`}
                  >
                    Чернетки
                  </button>
                  <button
                    onClick={() => setTab("scheduled")}
                    type="button"
                    className={`rounded-[4px] border px-2.5 py-1 text-xs ${tab === "scheduled" ? "btn-primary" : "btn-ghost"}`}
                  >
                    Заплановані
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="text"
                  placeholder="Пошук по назві або ID..."
                  className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[940px] w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th className="border-b border-[rgba(255,255,255,0.1)] px-2 py-2 text-left text-xs font-semibold text-nebori-muted">
                        Відео
                      </th>
                      <th className="border-b border-[rgba(255,255,255,0.1)] px-2 py-2 text-left text-xs font-semibold text-nebori-muted">
                        Видимість
                      </th>
                      <th className="border-b border-[rgba(255,255,255,0.1)] px-2 py-2 text-left text-xs font-semibold text-nebori-muted">
                        Статус
                      </th>
                      <th className="border-b border-[rgba(255,255,255,0.1)] px-2 py-2 text-left text-xs font-semibold text-nebori-muted">
                        Дата
                      </th>
                      <th className="border-b border-[rgba(255,255,255,0.1)] px-2 py-2 text-right text-xs font-semibold text-nebori-muted">
                        Перегляди
                      </th>
                      <th className="border-b border-[rgba(255,255,255,0.1)] px-2 py-2 text-right text-xs font-semibold text-nebori-muted">
                        Лайки
                      </th>
                      <th className="border-b border-[rgba(255,255,255,0.1)] px-2 py-2 text-right text-xs font-semibold text-nebori-muted">
                        Коментарі
                      </th>
                      <th className="border-b border-[rgba(255,255,255,0.1)] px-2 py-2 text-right text-xs font-semibold text-nebori-muted">
                        Дії
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-[rgba(255,255,255,0.03)]"
                      >
                        <td className="border-b border-[rgba(255,255,255,0.06)] px-2 py-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={row.thumbnail}
                              alt={row.title}
                              className="h-12 w-20 rounded-[3px] border border-[rgba(255,255,255,0.14)] object-cover"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <Link
                                href={`/video/${row.id}`}
                                className="line-clamp-2 text-sm font-semibold text-[#dce4f2] hover:text-nebori-accent"
                              >
                                {row.title}
                              </Link>
                              <p className="text-[11px] text-nebori-muted">
                                ID: {row.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-[rgba(255,255,255,0.06)] px-2 py-2 text-sm text-[#d7deed]">
                          {row.visibility}
                        </td>
                        <td
                          className={`border-b border-[rgba(255,255,255,0.06)] px-2 py-2 text-sm font-semibold ${statusClasses(row.status)}`}
                        >
                          {row.status}
                        </td>
                        <td className="border-b border-[rgba(255,255,255,0.06)] px-2 py-2 text-sm text-nebori-muted">
                          {row.date}
                        </td>
                        <td className="border-b border-[rgba(255,255,255,0.06)] px-2 py-2 text-right text-sm text-[#e7ecf7]">
                          {row.views.toLocaleString("uk-UA")}
                        </td>
                        <td className="border-b border-[rgba(255,255,255,0.06)] px-2 py-2 text-right text-sm text-[#e7ecf7]">
                          {row.likes}%
                        </td>
                        <td className="border-b border-[rgba(255,255,255,0.06)] px-2 py-2 text-right text-sm text-[#e7ecf7]">
                          {row.comments}
                        </td>
                        <td className="border-b border-[rgba(255,255,255,0.06)] px-2 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => openEditor(row)}
                            className="rounded-[3px] border border-[rgba(255,255,255,0.14)] px-2 py-1 text-[11px] text-nebori-muted hover:text-nebori-accent"
                          >
                            Редагувати
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {section === "analytics" && (
            <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
              <h2 className="mb-2 text-lg font-semibold text-[#e6e9f3]">
                Аналітика каналу
              </h2>
              <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-[4px] border border-[rgba(255,255,255,0.1)] p-3">
                  <p className="text-xs text-nebori-muted">Перегляди</p>
                  <p className="mt-1 text-2xl font-bold text-[#e8edf9]">
                    {totalViews.toLocaleString("uk-UA")}
                  </p>
                </div>
                <div className="rounded-[4px] border border-[rgba(255,255,255,0.1)] p-3">
                  <p className="text-xs text-nebori-muted">CTR</p>
                  <p className="mt-1 text-2xl font-bold text-[#e8edf9]">6.8%</p>
                </div>
                <div className="rounded-[4px] border border-[rgba(255,255,255,0.1)] p-3">
                  <p className="text-xs text-nebori-muted">Коментарі</p>
                  <p className="mt-1 text-2xl font-bold text-[#e8edf9]">
                    {totalComments}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {trafficSources.map((item) => (
                  <div
                    key={item.source}
                    className="rounded-[4px] border border-[rgba(255,255,255,0.1)] p-3"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#dce4f3]">
                        {item.source}
                      </p>
                      <p className="text-xs text-nebori-muted">{item.share}%</p>
                    </div>
                    <div className="h-2 rounded bg-[rgba(255,255,255,0.08)]">
                      <div
                        className="h-2 rounded bg-[linear-gradient(90deg,#f5d251_0%,#b38318_100%)]"
                        style={{ width: `${item.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )}

          {section === "comments" && (
            <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
              <h2 className="text-lg font-semibold text-[#e6e9f3]">
                Коментарі
              </h2>
              <p className="mt-0.5 text-sm text-nebori-muted">
                Останні коментарі під вашими відео
              </p>
              <div className="mt-2 rounded-[6px] border border-[rgba(255,255,255,0.08)]">
                <div className="divide-y divide-[rgba(255,255,255,0.08)]">
                  {orderedComments.map((item, idx) => {
                    const handle = item.author
                      .toLowerCase()
                      .replace(/\s+/g, "_");
                    const isPinned = Boolean(pinnedComments[item.id]);
                    return (
                      <article
                        key={item.id}
                        className="px-3 py-3 hover:bg-[rgba(255,255,255,0.02)]"
                      >
                        <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-3">
                          <div className="relative flex justify-center">
                            <ProfileHoverCard
                              handle={handle}
                              name={item.author}
                              avatar={`https://i.pravatar.cc/72?u=${encodeURIComponent(item.author)}`}
                              videosCount={18}
                              subscribers="6.1 тис."
                            >
                              <img
                                src={`https://i.pravatar.cc/72?u=${encodeURIComponent(item.author)}`}
                                alt={item.author}
                                className="h-9 w-9 rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                                loading="lazy"
                              />
                            </ProfileHoverCard>
                            {idx < orderedComments.length - 1 ? (
                              <span className="absolute left-1/2 top-10 h-[calc(100%+14px)] w-px -translate-x-1/2 bg-[rgba(255,255,255,0.12)]" />
                            ) : null}
                          </div>
                          <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-[3px] border border-[rgba(80,156,255,0.35)] bg-[rgba(80,156,255,0.12)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#9ec7ff]">
                                Коментар
                              </span>
                              {isPinned ? (
                                <span className="rounded-[3px] border border-[rgba(245,201,52,0.35)] bg-[rgba(245,201,52,0.12)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-nebori-accent">
                                  Закріплено
                                </span>
                              ) : null}
                              <span className="text-xs text-nebori-muted">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-sm leading-6 text-nebori-text">
                              <ProfileHoverCard
                                handle={handle}
                                name={item.author}
                                avatar={`https://i.pravatar.cc/72?u=${encodeURIComponent(item.author)}`}
                                videosCount={18}
                                subscribers="6.1 тис."
                              >
                                <Link
                                  href={`/profile/${handle}`}
                                  className="cursor-pointer font-semibold text-nebori-accent hover:underline"
                                >
                                  {item.author}
                                </Link>
                              </ProfileHoverCard>{" "}
                              залишив(ла) коментар під відео{" "}
                              <Link
                                href={`/video/${item.videoId}`}
                                className="font-medium text-[#e7ebf7] hover:text-nebori-accent"
                              >
                                «{item.target}»
                              </Link>
                            </p>
                            <p className="rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-2.5 py-2 text-sm text-[#dfe5f2]">
                              “{item.comment}”
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              <Link
                                href={`/video/${item.videoId}`}
                                className="text-nebori-accent hover:underline"
                              >
                                До відео
                              </Link>
                              <button
                                type="button"
                                onClick={() =>
                                  setCommentsFeed((prev) =>
                                    prev.filter((x) => x.id !== item.id),
                                  )
                                }
                                className="text-nebori-muted hover:text-nebori-accent"
                              >
                                Сховати
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setPinnedComments((prev) => ({
                                    ...prev,
                                    [item.id]: !prev[item.id],
                                  }))
                                }
                                className="text-nebori-muted hover:text-nebori-accent"
                              >
                                {isPinned ? "Відкріпити" : "Закріпити"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </article>
          )}

          {section === "channel_settings" && (
            <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
              <h2 className="text-lg font-semibold text-[#e6e9f3]">
                Налаштування каналу
              </h2>
              <div className="mt-2 rounded-[6px] border border-[rgba(255,255,255,0.1)]">
                <div className="relative h-28 bg-black">
                  <img
                    src={channelBannerUrl}
                    alt="Банер каналу"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(15,19,27,0.46)]" />
                  <button
                    type="button"
                    onClick={() => channelBannerInputRef.current?.click()}
                    className="absolute right-2 top-2 rounded-[4px] border border-[rgba(255,255,255,0.24)] bg-[#0f131bcc] px-2 py-1 text-xs text-nebori-muted hover:text-nebori-accent"
                  >
                    Змінити банер
                  </button>
                  <input
                    ref={channelBannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      handleChannelBannerFile(event.target.files?.[0])
                    }
                  />
                </div>
                <div className="flex items-end gap-3 p-3">
                  <img
                    src={channelAvatarUrl}
                    alt="Аватар каналу"
                    className="relative z-10 -mt-8 h-16 w-16 rounded-[6px] border border-[rgba(255,255,255,0.2)] bg-[#121826] object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => channelAvatarInputRef.current?.click()}
                      className="rounded-[4px] border border-[rgba(255,255,255,0.16)] px-3 py-1.5 text-sm text-nebori-muted hover:text-nebori-accent"
                    >
                      Змінити аватар
                    </button>
                    <input
                      ref={channelAvatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        handleChannelAvatarFile(event.target.files?.[0])
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                <label className="block">
                  <p className="mb-1 text-xs text-nebori-muted">Назва каналу</p>
                  <input
                    defaultValue="Nebori User"
                    className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
                  />
                </label>
                <label className="block">
                  <p className="mb-1 text-xs text-nebori-muted">Категорія</p>
                  <select className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none">
                    <option>Ігри</option>
                    <option>Освіта</option>
                    <option>Технології</option>
                  </select>
                </label>
              </div>
              <label className="mt-2 block">
                <p className="mb-1 text-xs text-nebori-muted">Опис каналу</p>
                <textarea
                  defaultValue="Офіційний канал Nebori User: гайди, огляди патчів, розбір мети."
                  rows={4}
                  className="w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 py-2 text-sm text-nebori-text outline-none"
                />
              </label>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                <label className="block">
                  <p className="mb-1 text-xs text-nebori-muted">URL аватарки</p>
                  <input
                    value={channelAvatarUrl}
                    onChange={(event) =>
                      setChannelAvatarUrl(event.target.value)
                    }
                    className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
                  />
                </label>
                <label className="block">
                  <p className="mb-1 text-xs text-nebori-muted">URL банера</p>
                  <input
                    value={channelBannerUrl}
                    onChange={(event) =>
                      setChannelBannerUrl(event.target.value)
                    }
                    className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
                  />
                </label>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-primary rounded-[4px] px-3 py-1.5 text-sm"
                >
                  Зберегти
                </button>
                <button
                  type="button"
                  className="btn-ghost rounded-[4px] px-3 py-1.5 text-sm"
                >
                  Скасувати
                </button>
              </div>
            </article>
          )}
        </div>
      </div>

      {uploadModalOpen && (
        <div className="fixed inset-0 z-[130]">
          <button
            type="button"
            onClick={() => setUploadModalOpen(false)}
            className="absolute inset-0 bg-black/70"
            aria-label="Закрити завантаження відео"
          />
          <div className="absolute left-1/2 top-1/2 w-[780px] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 rounded-[8px] border border-[rgba(255,255,255,0.16)] bg-[#0f131b] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-[#e6e9f3]">
                Завантаження відео
              </h3>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="rounded-[4px] border border-[rgba(255,255,255,0.2)] px-2 py-1 text-xs text-nebori-muted hover:text-nebori-accent"
              >
                Закрити
              </button>
            </div>

            {uploadStep === "dropzone" ? (
              <div
                className="rounded-[8px] border border-dashed border-[rgba(245,201,52,0.45)] bg-[rgba(245,201,52,0.06)] p-6 text-center"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleUploadFile(event.dataTransfer.files?.[0]);
                }}
              >
                <p className="text-base font-semibold text-[#e6e9f3]">
                  Перетягніть файл сюди
                </p>
                <p className="mt-1 text-sm text-nebori-muted">
                  Демо-режим: можна кинути будь-який файл
                </p>
                <div className="mt-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(event) =>
                      handleUploadFile(event.target.files?.[0])
                    }
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary rounded-[4px] px-4 py-2 text-sm"
                  >
                    Обрати файл
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-[6px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-sm text-nebori-muted">
                  Завантажено:{" "}
                  <span className="font-medium text-[#e4e9f5]">
                    {uploadedFileName}
                  </span>
                </div>
                <div className="rounded-[6px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-[#e6e9f3]">
                      Прев’ю відео
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        ref={uploadPreviewInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          handleUploadPreviewFile(event.target.files?.[0])
                        }
                      />
                      <button
                        type="button"
                        onClick={() => uploadPreviewInputRef.current?.click()}
                        className="rounded-[4px] border border-[rgba(255,255,255,0.18)] px-3 py-1.5 text-sm text-nebori-muted hover:text-nebori-accent"
                      >
                        Додати прев’ю
                      </button>
                    </div>
                  </div>
                  {uploadPreviewUrl ? (
                    <div className="mt-2 flex items-start gap-2">
                      <img
                        src={uploadPreviewUrl}
                        alt="Прев’ю відео"
                        className="h-16 w-28 rounded-[4px] border border-[rgba(255,255,255,0.14)] object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm text-[#dfe5f2]">
                          {uploadPreviewName}
                        </p>
                        <p className="text-xs text-nebori-muted">
                          Прев’ю буде використано на сторінці відео і в
                          стрічках.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-nebori-muted">
                      Ще не додано. Рекомендований формат: 1280x720 (16:9).
                    </p>
                  )}
                </div>
                <label className="block">
                  <p className="mb-1 text-xs text-nebori-muted">Назва</p>
                  <input
                    value={editorTitle}
                    onChange={(event) => setEditorTitle(event.target.value)}
                    className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
                  />
                </label>
                <label className="block">
                  <p className="mb-1 text-xs text-nebori-muted">Опис</p>
                  <textarea
                    value={editorDescription}
                    onChange={(event) =>
                      setEditorDescription(event.target.value)
                    }
                    rows={4}
                    className="w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 py-2 text-sm text-nebori-text outline-none"
                  />
                </label>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <label className="block">
                    <p className="mb-1 text-xs text-nebori-muted">Теги</p>
                    <input
                      value={editorTags}
                      onChange={(event) => setEditorTags(event.target.value)}
                      className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
                    />
                  </label>
                  <label className="block">
                    <p className="mb-1 text-xs text-nebori-muted">Видимість</p>
                    <select
                      value={editorVisibility}
                      onChange={(event) =>
                        setEditorVisibility(
                          event.target.value as StudioVideoRow["visibility"],
                        )
                      }
                      className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
                    >
                      <option>Публічне</option>
                      <option>За посиланням</option>
                      <option>Приватне</option>
                    </select>
                  </label>
                </div>
                <div className="flex flex-wrap justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setUploadStep("dropzone")}
                    className="btn-ghost rounded-[4px] px-3 py-1.5 text-sm"
                  >
                    Назад
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="btn-primary rounded-[4px] px-3 py-1.5 text-sm"
                  >
                    Продовжити
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {editorOpen && (
        <div className="fixed inset-0 z-[120]">
          <button
            type="button"
            onClick={() => setEditorOpen(false)}
            className="absolute inset-0 bg-black/70"
            aria-label="Закрити редактор відео"
          />
          <div className="absolute left-1/2 top-1/2 w-[760px] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 rounded-[8px] border border-[rgba(255,255,255,0.16)] bg-[#0f131b] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-[#e6e9f3]">
                Редактор відео {editingVideoId ? `• ${editingVideoId}` : ""}
              </h3>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="rounded-[4px] border border-[rgba(255,255,255,0.2)] px-2 py-1 text-xs text-nebori-muted hover:text-nebori-accent"
              >
                Закрити
              </button>
            </div>
            <div className="space-y-2">
              <label className="block">
                <p className="mb-1 text-xs text-nebori-muted">Назва</p>
                <input
                  value={editorTitle}
                  onChange={(event) => setEditorTitle(event.target.value)}
                  className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
                />
              </label>
              <label className="block">
                <p className="mb-1 text-xs text-nebori-muted">Опис</p>
                <textarea
                  value={editorDescription}
                  onChange={(event) => setEditorDescription(event.target.value)}
                  rows={4}
                  className="w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 py-2 text-sm text-nebori-text outline-none"
                />
              </label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <label className="block">
                  <p className="mb-1 text-xs text-nebori-muted">Теги</p>
                  <input
                    value={editorTags}
                    onChange={(event) => setEditorTags(event.target.value)}
                    className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
                  />
                </label>
                <label className="block">
                  <p className="mb-1 text-xs text-nebori-muted">Видимість</p>
                  <select
                    value={editorVisibility}
                    onChange={(event) =>
                      setEditorVisibility(
                        event.target.value as StudioVideoRow["visibility"],
                      )
                    }
                    className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
                  >
                    <option>Публічне</option>
                    <option>За посиланням</option>
                    <option>Приватне</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="btn-ghost rounded-[4px] px-3 py-1.5 text-sm"
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="btn-primary rounded-[4px] px-3 py-1.5 text-sm"
              >
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function StudioPageClient({ videos }: StudioPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="py-10 text-center text-sm text-nebori-muted">
          Завантаження студії...
        </div>
      }
    >
      <StudioPageContent videos={videos} />
    </Suspense>
  );
}
