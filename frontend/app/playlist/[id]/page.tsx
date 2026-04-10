import Link from "next/link";
import { Suspense } from "react";
import { videos } from "@/data/mock";
import { ProfileHoverCard } from "@/components/profile-hover-card";

type PageProps = {
  params: Promise<{ id: string }>;
};

type PlaylistMeta = {
  id: string;
  title: string;
  author: string;
  updated: string;
  totalVideos: number;
  duration: string;
  created: string;
  description: string;
};

const playlists: PlaylistMeta[] = [
  {
    id: "pl-raids-01",
    title:
      "\u0420\u0435\u0439\u0434\u0438 \u0434\u043b\u044f \u043d\u043e\u0432\u0430\u0447\u043a\u0456\u0432",
    author: "Nebori Team",
    updated:
      "\u041e\u043d\u043e\u0432\u043b\u0435\u043d\u043e 2 \u0434\u043d\u0456 \u0442\u043e\u043c\u0443",
    totalVideos: 24,
    duration:
      "3 \u0433\u043e\u0434\u0438\u043d\u0438 15 \u0445\u0432\u0438\u043b\u0438\u043d",
    created: "20 \u0441\u0456\u0447\u043d\u044f 2026",
    description:
      "\u0414\u043e\u0431\u0456\u0440\u043a\u0430 \u0433\u0430\u0439\u0434\u0456\u0432 \u0434\u043b\u044f \u0441\u0442\u0430\u0440\u0442\u0443: \u0440\u043e\u043b\u0456, \u0442\u0430\u0439\u043c\u0456\u043d\u0433\u0438, \u0431\u0430\u0437\u043e\u0432\u0456 \u043f\u043e\u0437\u0438\u0446\u0456\u0457 \u0442\u0430 \u0440\u043e\u0437\u0431\u0456\u0440 \u043f\u043e\u043c\u0438\u043b\u043e\u043a. \u041e\u043d\u043e\u0432\u043b\u044e\u0454\u0442\u044c\u0441\u044f \u0449\u043e\u0442\u0438\u0436\u043d\u044f.",
  },
  {
    id: "pl-meta-02",
    title: "\u041c\u0435\u0442\u0430-\u0441\u0435\u0437\u043e\u043d #12",
    author: "IronBand",
    updated:
      "\u041e\u043d\u043e\u0432\u043b\u0435\u043d\u043e 5 \u0434\u043d\u0456\u0432 \u0442\u043e\u043c\u0443",
    totalVideos: 18,
    duration:
      "2 \u0433\u043e\u0434\u0438\u043d\u0438 48 \u0445\u0432\u0438\u043b\u0438\u043d",
    created: "27 \u0441\u0456\u0447\u043d\u044f 2026",
    description:
      "\u0410\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u0456 \u0431\u0456\u043b\u0434\u0438 \u0456 \u043f\u043e\u0437\u0438\u0446\u0456\u0457 \u043f\u0456\u0441\u043b\u044f \u043f\u0430\u0442\u0447\u0443 \u0441\u0435\u0437\u043e\u043d\u0443, \u043f\u043e\u0435\u0442\u0430\u043f\u043d\u0438\u0439 \u0440\u043e\u0437\u0431\u0456\u0440 \u0434\u043b\u044f \u0441\u043e\u043b\u043e \u0442\u0430 \u0441\u043a\u0432\u0430\u0434\u0456\u0432.",
  },
];

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
      <path
        d="M5 3.3v9.4c0 .4.4.7.8.5l7-4.7c.4-.3.4-.8 0-1.1l-7-4.7c-.4-.2-.8 0-.8.6z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 14 4 4-4 4" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" />
      <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" />
      <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
      <circle
        cx="12.2"
        cy="3.3"
        r="1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle
        cx="3.8"
        cy="8"
        r="1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle
        cx="12.2"
        cy="12.7"
        r="1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5.2 8.7 10.7 12M10.7 4 5.2 7.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

async function Page({ params }: PageProps) {
  const { id } = await params;
  const playlist = playlists.find((item) => item.id === id) ?? playlists[0];
  const playlistAuthorHandle = playlist.author
    .toLowerCase()
    .replace(/\s+/g, "_");
  const playlistAuthorAvatar = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(playlist.author)}`;
  const queue = [...videos, ...videos]
    .slice(0, playlist.totalVideos)
    .map((video, index) => ({
      ...video,
      order: index + 1,
    }));

  return (
    <section className="-mt-6 mx-auto w-full max-w-[1050px] space-y-4">
      <article className="relative overflow-hidden rounded-b-[6px] border border-[rgba(255,255,255,0.1)] border-t-0 bg-nebori-panel">
        <div className="absolute inset-0">
          <img
            src={`https://picsum.photos/seed/playlist-cover-${playlist.id}/1600/520`}
            alt={playlist.title}
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(245,197,24,0.15),transparent_45%),linear-gradient(180deg,rgba(10,12,18,0.45),rgba(10,12,18,0.82))]" />
        </div>

        <div className="relative grid grid-cols-1 gap-3 p-3 sm:grid-cols-[108px_minmax(0,1fr)_auto] sm:items-end sm:p-4">
          <div className="relative h-[108px] w-[108px] overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.18)]">
            <img
              src={`https://picsum.photos/seed/playlist-avatar-${playlist.id}/240/240`}
              alt={playlist.title}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-1.5 top-1.5 rounded-[3px] bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[#e7edf8]">
              Public
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-white sm:text-[32px]">
              {playlist.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#c7cfdf]">
              <ProfileHoverCard
                handle={playlistAuthorHandle}
                name={playlist.author}
                avatar={playlistAuthorAvatar}
                className="inline-block"
              >
                <img
                  src={playlistAuthorAvatar}
                  alt={playlist.author}
                  className="h-5 w-5 rounded-[2px] border border-[rgba(255,255,255,0.16)] object-cover"
                />
              </ProfileHoverCard>
              <ProfileHoverCard
                handle={playlistAuthorHandle}
                name={playlist.author}
                avatar={playlistAuthorAvatar}
                className="inline-block"
              >
                <Link
                  href={`/profile/${playlistAuthorHandle}`}
                  className="font-semibold text-[#dce4f3] hover:text-nebori-accent"
                >
                  {playlist.author}
                </Link>
              </ProfileHoverCard>
              <span>{"\u2022"}</span>
              <span>
                {playlist.totalVideos} {"\u0432\u0456\u0434\u0435\u043e"}
              </span>
              <span>{"\u2022"}</span>
              <span>{playlist.updated}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:pb-1">
            <button className="btn-primary inline-flex items-center justify-center gap-1.5 rounded-[4px] px-3 py-1.5 text-sm font-semibold">
              <PlayIcon />
              {
                "\u0412\u0456\u0434\u0442\u0432\u043e\u0440\u0438\u0442\u0438 \u0432\u0441\u0435"
              }
            </button>
            <button
              className="btn-ghost rounded-[4px] p-2"
              type="button"
              aria-label="\u041f\u0435\u0440\u0435\u043c\u0456\u0448\u0430\u0442\u0438"
            >
              <ShuffleIcon />
            </button>
            <button
              className="btn-ghost rounded-[4px] p-2"
              type="button"
              aria-label="\u041f\u043e\u0434\u0456\u043b\u0438\u0442\u0438\u0441\u044f"
            >
              <ShareIcon />
            </button>
          </div>
        </div>
      </article>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-2 text-sm">
            <p className="text-nebori-muted">
              {"\u0421\u043e\u0440\u0442\u0443\u0432\u0430\u043d\u043d\u044f"}:{" "}
              <span className="font-semibold text-nebori-text">
                {"\u0420\u0443\u0447\u043d\u0435"}
              </span>
            </p>
            <button
              className="text-nebori-muted hover:text-nebori-text"
              type="button"
            >
              {"\u0424\u0456\u043b\u044c\u0442\u0440"}
            </button>
          </div>

          <div className="divide-y divide-[rgba(255,255,255,0.08)]">
            {queue.map((item) => (
              <article
                key={`${item.id}-${item.order}`}
                className="grid grid-cols-[22px_150px_minmax(0,1fr)] items-start gap-2.5 py-2.5 sm:grid-cols-[26px_170px_minmax(0,1fr)] sm:gap-3"
              >
                <span className="pt-7 text-center text-sm font-medium text-[#8d98ae] sm:pt-8 sm:text-base">
                  {item.order}
                </span>
                <Link
                  href={`/video/${item.id}`}
                  className="group relative block overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.12)]"
                >
                  <img
                    src={`https://picsum.photos/seed/playlist-row-${item.id}-${item.order}/420/236`}
                    alt={item.title}
                    className="aspect-video w-full object-cover transition duration-150 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 rounded-[3px] bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {item.duration}
                  </span>
                </Link>
                <div className="min-w-0 pt-0.5">
                  <Link
                    href={`/video/${item.id}`}
                    className="line-clamp-2 text-[15px] font-semibold leading-5 text-[#e6e9f3] hover:text-nebori-accent"
                  >
                    {item.title}
                  </Link>
                  <ProfileHoverCard
                    handle={item.author.toLowerCase().replace(/\s+/g, "_")}
                    name={item.author}
                    avatar={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(item.author)}`}
                    className="mt-1 block"
                  >
                    <div className="flex items-start gap-1.5">
                      <img
                        src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(item.author)}`}
                        alt={item.author}
                        className="mt-0.5 h-5 w-5 rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/profile/${item.author.toLowerCase().replace(/\s+/g, "_")}`}
                          className="block truncate text-xs font-semibold leading-4 text-[#c9d0df] hover:text-nebori-accent"
                        >
                          {item.author}
                        </Link>
                        <p className="truncate text-[12px] leading-4 text-nebori-muted">
                          {item.views} {"\u2022"}{" "}
                          {"\u0414\u043e\u0434\u0430\u043d\u043e"} {item.date}
                        </p>
                      </div>
                    </div>
                  </ProfileHoverCard>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="min-w-0">
          <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3 lg:sticky lg:top-[84px]">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-[20px] font-semibold leading-none text-[#edf2ff]">
                {
                  "\u041f\u0440\u043e \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442"
                }
              </h2>
              <button
                type="button"
                className="rounded-[4px] p-1 text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
                aria-label="\u041c\u0435\u043d\u044e"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
                  <circle cx="8" cy="3" r="1.2" fill="currentColor" />
                  <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                  <circle cx="8" cy="13" r="1.2" fill="currentColor" />
                </svg>
              </button>
            </div>

            <p className="mt-3 text-[13px] leading-6 text-[#c4ccdc]">
              {playlist.description}
            </p>

            <div className="mt-4 space-y-2 border-t border-[rgba(255,255,255,0.08)] pt-3 text-sm">
              <div className="flex items-center justify-between text-nebori-muted">
                <span>
                  {
                    "\u0417\u0430\u0433\u0430\u043b\u043e\u043c \u0432\u0456\u0434\u0435\u043e"
                  }
                </span>
                <span className="font-semibold text-nebori-text">
                  {playlist.totalVideos}
                </span>
              </div>
              <div className="flex items-center justify-between text-nebori-muted">
                <span>
                  {
                    "\u0422\u0440\u0438\u0432\u0430\u043b\u0456\u0441\u0442\u044c"
                  }
                </span>
                <span className="font-semibold text-nebori-text">
                  {playlist.duration}
                </span>
              </div>
              <div className="flex items-center justify-between text-nebori-muted">
                <span>
                  {"\u0421\u0442\u0432\u043e\u0440\u0435\u043d\u043e"}
                </span>
                <span className="font-semibold text-nebori-text">
                  {playlist.created}
                </span>
              </div>
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}
export default async function PlaylistsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-10 text-center text-sm text-nebori-muted">
          Завантаження...
        </div>
      }
    >
      {Page({ params: Promise.resolve({ id: "pl-raids-01" }) })}
    </Suspense>
  );
}
