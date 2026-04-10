"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { videos } from "@/data/mock";
import { ProfileHoverCard } from "@/components/profile-hover-card";

type ProfileHistoryPageClientProps = {
  handle: string;
};

type HistoryVideoItem = {
  id: string;
  title: string;
  author: string;
  views: string;
  date: string;
  duration: string;
  watchedAt: string;
};

const watchedAt = [
  "\u0421\u044c\u043e\u0433\u043e\u0434\u043d\u0456, 13:42",
  "\u0421\u044c\u043e\u0433\u043e\u0434\u043d\u0456, 12:08",
  "\u0421\u044c\u043e\u0433\u043e\u0434\u043d\u0456, 10:14",
  "\u0412\u0447\u043e\u0440\u0430, 21:30",
  "\u0412\u0447\u043e\u0440\u0430, 18:50",
  "2 \u0434\u043d\u0456 \u0442\u043e\u043c\u0443, 20:11",
  "3 \u0434\u043d\u0456 \u0442\u043e\u043c\u0443, 17:02",
  "4 \u0434\u043d\u0456 \u0442\u043e\u043c\u0443, 22:40",
  "5 \u0434\u043d\u0456\u0432 \u0442\u043e\u043c\u0443, 19:26",
  "6 \u0434\u043d\u0456\u0432 \u0442\u043e\u043c\u0443, 23:05",
  "1 \u0442\u0438\u0436\u0434\u0435\u043d\u044c \u0442\u043e\u043c\u0443, 16:58",
  "1 \u0442\u0438\u0436\u0434\u0435\u043d\u044c \u0442\u043e\u043c\u0443, 14:21"
];

export function ProfileHistoryPageClient({ handle }: ProfileHistoryPageClientProps) {
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<HistoryVideoItem[]>(
    [...videos, ...videos, ...videos].slice(0, 18).map((video, index) => ({
      id: `${video.id}-${index}`,
      title: video.title,
      author: video.author,
      views: video.views,
      date: video.date,
      duration: video.duration,
      watchedAt: watchedAt[index % watchedAt.length]
    }))
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.title.toLowerCase().includes(q) || item.author.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <section className="mx-auto w-full max-w-[1050px] space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold leading-none">{"\u0406\u0441\u0442\u043e\u0440\u0456\u044f \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434\u0456\u0432"}</h1>
          <p className="mt-1 text-sm text-nebori-muted">
            @{handle} {"\u2022"} {"\u043b\u0438\u0448\u0435 \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u043d\u0443\u0442\u0456 \u0432\u0456\u0434\u0435\u043e"}
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
          <button type="button" onClick={() => setItems([])} className="h-7 px-1 text-[13px] text-nebori-muted transition-colors hover:text-nebori-text">
            {"\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u0438"}
          </button>
          <button
            type="button"
            onClick={() => setHistoryEnabled((value) => !value)}
            className={`h-7 px-1 text-[13px] transition-colors ${
              historyEnabled ? "font-semibold text-nebori-accent" : "text-nebori-muted hover:text-nebori-text"
            }`}
          >
            {historyEnabled ? "\u0406\u0441\u0442\u043e\u0440\u0456\u044f: \u0443\u0432\u0456\u043c\u043a." : "\u0406\u0441\u0442\u043e\u0440\u0456\u044f: \u0432\u0438\u043c\u043a."}
          </button>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder={"\u041f\u043e\u0448\u0443\u043a \u0432 \u0456\u0441\u0442\u043e\u0440\u0456\u0457..."}
            className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none placeholder:text-nebori-muted sm:w-[220px]"
          />
        </div>
      </header>

      {!historyEnabled ? (
        <div className="rounded-[4px] border border-[rgba(255,255,255,0.08)] px-4 py-5 text-sm text-nebori-muted">
          {"\u0406\u0441\u0442\u043e\u0440\u0456\u044e \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434\u0456\u0432 \u0432\u0438\u043c\u043a\u043d\u0435\u043d\u043e. \u0423\u0432\u0456\u043c\u043a\u043d\u0456\u0442\u044c \u0457\u0457, \u0449\u043e\u0431 \u0437\u043d\u043e\u0432\u0443 \u0431\u0430\u0447\u0438\u0442\u0438 \u0441\u043f\u0438\u0441\u043e\u043a \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u043d\u0443\u0442\u0438\u0445 \u0432\u0456\u0434\u0435\u043e."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.08)]">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-nebori-muted">{"\u041d\u0456\u0447\u043e\u0433\u043e \u043d\u0435 \u0437\u043d\u0430\u0439\u0434\u0435\u043d\u043e \u0432 \u0456\u0441\u0442\u043e\u0440\u0456\u0457."}</div>
          ) : (
            filtered.map((item, index) => {
              const profileHandle = item.author.toLowerCase().replace(/\s+/g, "_");
              const profileAvatar = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(item.author)}`;

              return (
                <article
                  key={item.id}
                  className="grid grid-cols-1 gap-3 border-b border-[rgba(255,255,255,0.08)] px-3 py-3 last:border-b-0 sm:grid-cols-[220px_minmax(0,1fr)_150px] sm:items-start hover:bg-[rgba(255,255,255,0.02)]"
                >
                  <Link href={`/video/${item.id.split("-")[0]}`} className="group relative block overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.12)]">
                    <img
                      src={`https://picsum.photos/seed/history-${item.id}/640/360`}
                      alt={item.title}
                      className="aspect-video w-full object-cover transition duration-150 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <span className="absolute right-1.5 top-1.5 rounded-[3px] border border-[rgba(255,255,255,0.2)] bg-[rgba(15,20,30,0.78)] px-1 py-[1px] text-[10px] font-semibold uppercase text-[#c5cedf]">
                      {index % 4 === 0 ? "720p" : "1080p"}
                    </span>
                    <span className="absolute bottom-1.5 right-1.5 rounded-[3px] bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">{item.duration}</span>
                  </Link>

                  <div className="min-w-0">
                    <Link href={`/video/${item.id.split("-")[0]}`} className="line-clamp-2 text-[15px] font-semibold leading-5 text-[#e6e9f3] hover:text-nebori-accent">
                      {item.title}
                    </Link>
                    <ProfileHoverCard handle={profileHandle} name={item.author} avatar={profileAvatar} className="mt-1 block">
                      <div className="flex items-start gap-1.5">
                        <img
                          src={profileAvatar}
                          alt={item.author}
                          className="mt-0.5 h-6 w-6 rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <Link href={`/profile/${profileHandle}`} className="block truncate text-xs font-semibold text-[#d6dcec] hover:text-nebori-accent">
                            {item.author}
                          </Link>
                          <p className="truncate text-[12px] leading-4 text-nebori-muted">
                            {item.views} {"\u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434\u0456\u0432"} {"\u2022"} {item.date}
                          </p>
                        </div>
                      </div>
                    </ProfileHoverCard>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-nebori-muted">
                      {"\u041f\u0435\u0440\u0435\u0433\u043b\u044f\u043d\u0443\u0442\u043e \u0443 \u0432\u0430\u0448\u0456\u0439 \u0456\u0441\u0442\u043e\u0440\u0456\u0457. \u0412\u0456\u0434\u0435\u043e \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0435 \u0434\u043b\u044f \u0448\u0432\u0438\u0434\u043a\u043e\u0433\u043e \u043f\u043e\u0432\u0435\u0440\u043d\u0435\u043d\u043d\u044f."}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-[12px] leading-4 text-nebori-muted">{"\u041f\u0435\u0440\u0435\u0433\u043b\u044f\u043d\u0443\u0442\u043e"}</p>
                    <p className="mt-0.5 text-[12px] font-semibold leading-4 text-[#cfd8ea]">{item.watchedAt}</p>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
