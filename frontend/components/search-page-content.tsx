"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileHoverCard } from "@/components/profile-hover-card";
import { VideoCard } from "@/components/video-card";
import type { VideoItem } from "@/data/mock";

type SearchPageContentProps = {
  videos: VideoItem[];
  initialQuery: string;
};

type SearchTab = "videos" | "playlists" | "groups" | "channels";
type DurationFilter = "any" | "short" | "medium" | "long";
type DateFilter = "any" | "day" | "week" | "month";
type VideoSort = "relevance" | "views" | "latest";

type PlaylistResult = {
  id: string;
  title: string;
  author: string;
  videos: number;
  views: string;
  updated: string;
};

type GroupResult = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  members: string;
  online: string;
  posts: string;
};

type ChannelResult = {
  name: string;
  handle: string;
  avatar: string;
  videos: number;
  subscribers: string;
  lastVideo: string;
};

const tabs: Array<{ id: SearchTab; label: string }> = [
  { id: "videos", label: "Відео" },
  { id: "playlists", label: "Плейлисти" },
  { id: "groups", label: "Групи" },
  { id: "channels", label: "Канали" }
];

const playlists: PlaylistResult[] = [
  { id: "pl-meta-02", title: "Мета-сезон #12", author: "IronBand", videos: 18, views: "93 тис.", updated: "5 днів тому" },
  { id: "pl-tokens-03", title: "Фарм токенів без рутини", author: "TokenCrafter", videos: 31, views: "201 тис.", updated: "1 тиждень тому" },
  { id: "pl-dev-04", title: "Nebori Devlog", author: "Nebori Team", videos: 12, views: "62 тис.", updated: "3 дні тому" },
  { id: "pl-pvp-05", title: "PvP-позиції на картах", author: "DeltaNox", videos: 27, views: "117 тис.", updated: "вчора" },
  { id: "pl-clips-06", title: "Кращі кліпи спільноти", author: "Community Hub", videos: 54, views: "324 тис.", updated: "сьогодні" },
  { id: "pl-lore-07", title: "Лор сезону: повна хронологія", author: "Lore Keepers", videos: 16, views: "49 тис.", updated: "4 дні тому" }
];

const groups: GroupResult[] = [
  { id: "frontline-hub", name: "Frontline Hub", description: "Координація рейдів, тактичні обговорення, щоденні збори складів.", tags: ["Тактика", "Команди", "Рейди"], members: "12 480", online: "840", posts: "1 320" },
  { id: "raid-signals", name: "Raid Signals", description: "Швидкий пошук команди, ролі та спільні вечірні сесії.", tags: ["LFG", "Голос", "Події"], members: "8 910", online: "612", posts: "970" },
  { id: "market-watch", name: "Market Watch", description: "Аналітика токенів, економіка та огляди змін після патчів.", tags: ["Економіка", "Токени", "Аналітика"], members: "6 304", online: "421", posts: "714" },
  { id: "lore-keepers", name: "Lore Keepers", description: "Теорії та хронологія сезону, обговорення лору Nebori.", tags: ["Лор", "Теорії", "Обговорення"], members: "4 932", online: "255", posts: "503" }
];

function durationToSeconds(value: string): number {
  const [mm = "0", ss = "0"] = value.split(":");
  const minutes = Number.parseInt(mm, 10) || 0;
  const seconds = Number.parseInt(ss, 10) || 0;
  return minutes * 60 + seconds;
}

function parseViewsToScore(value: string): number {
  const match = value.match(/[\d]+([.,]\d+)?/);
  if (!match) return 0;
  const numeric = Number.parseFloat(match[0].replace(",", "."));
  const isThousands = value.includes("тис");
  return Math.round(numeric * (isThousands ? 1000 : 1));
}

function parseDateToDays(value: string): number {
  const normalized = value.toLowerCase();
  if (normalized.includes("сьогодні") || normalized.includes("хв") || normalized.includes("год")) return 0;
  if (normalized.includes("вчора")) return 1;
  const dayMatch = normalized.match(/(\d+)\s*д/);
  if (dayMatch) return Number.parseInt(dayMatch[1], 10);
  const weekMatch = normalized.match(/(\d+)\s*тиж/);
  if (weekMatch) return Number.parseInt(weekMatch[1], 10) * 7;
  return 30;
}

function containsQuery(query: string, ...fields: string[]): boolean {
  if (!query) return true;
  return fields.some((field) => field.toLowerCase().includes(query));
}

export function SearchPageContent({ videos, initialQuery }: SearchPageContentProps) {
  const router = useRouter();
  const [tab, setTab] = useState<SearchTab>("videos");
  const [query, setQuery] = useState(initialQuery);
  const [showVideoFilters, setShowVideoFilters] = useState(false);
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("any");
  const [dateFilter, setDateFilter] = useState<DateFilter>("any");
  const [videoSort, setVideoSort] = useState<VideoSort>("relevance");

  const normalizedQuery = query.trim().toLowerCase();

  const channelResults = useMemo<ChannelResult[]>(() => {
    const byAuthor = new Map<string, number>();
    for (const item of videos) {
      byAuthor.set(item.author, (byAuthor.get(item.author) ?? 0) + 1);
    }
    return [...byAuthor.entries()]
      .map(([name, count]) => ({
        name,
        handle: name.toLowerCase().replace(/\s+/g, "_"),
        avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(name)}`,
        videos: count,
        subscribers: `${Math.max(1, count * 7)} тис.`,
        lastVideo: videos.find((item) => item.author === name)?.title ?? "Останнє відео"
      }))
      .sort((a, b) => b.videos - a.videos);
  }, [videos]);

  const filteredVideos = useMemo(() => {
    const filtered = videos.filter((item) => {
      if (!containsQuery(normalizedQuery, item.title, item.author, item.tags.join(" "))) {
        return false;
      }
      const seconds = durationToSeconds(item.duration);
      const days = parseDateToDays(item.date);
      const byDuration =
        durationFilter === "any" ||
        (durationFilter === "short" && seconds < 4 * 60) ||
        (durationFilter === "medium" && seconds >= 4 * 60 && seconds <= 20 * 60) ||
        (durationFilter === "long" && seconds > 20 * 60);
      const byDate =
        dateFilter === "any" ||
        (dateFilter === "day" && days <= 1) ||
        (dateFilter === "week" && days <= 7) ||
        (dateFilter === "month" && days <= 30);
      return byDuration && byDate;
    });

    if (videoSort === "views") {
      return [...filtered].sort((a, b) => parseViewsToScore(b.views) - parseViewsToScore(a.views));
    }
    if (videoSort === "latest") {
      return [...filtered].sort((a, b) => parseDateToDays(a.date) - parseDateToDays(b.date));
    }

    return [...filtered].sort((a, b) => {
      const aScore = Number(a.title.toLowerCase().includes(normalizedQuery)) * 3 + Number(a.author.toLowerCase().includes(normalizedQuery)) * 2;
      const bScore = Number(b.title.toLowerCase().includes(normalizedQuery)) * 3 + Number(b.author.toLowerCase().includes(normalizedQuery)) * 2;
      return bScore - aScore || parseViewsToScore(b.views) - parseViewsToScore(a.views);
    });
  }, [videos, normalizedQuery, durationFilter, dateFilter, videoSort]);

  const filteredPlaylists = useMemo(
    () => playlists.filter((item) => containsQuery(normalizedQuery, item.title, item.author)),
    [normalizedQuery]
  );

  const filteredGroups = useMemo(
    () => groups.filter((item) => containsQuery(normalizedQuery, item.name, item.description, item.tags.join(" "))),
    [normalizedQuery]
  );

  const filteredChannels = useMemo(
    () => channelResults.filter((item) => containsQuery(normalizedQuery, item.name, item.handle)),
    [channelResults, normalizedQuery]
  );

  const totalByTab = {
    videos: filteredVideos.length,
    playlists: filteredPlaylists.length,
    groups: filteredGroups.length,
    channels: filteredChannels.length
  };

  const submitSearch = () => {
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <section className="mx-auto w-full max-w-[1240px] space-y-3">
      <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <h1 className="text-2xl font-bold text-[#e7ebf7]">Пошук</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitSearch();
              }
            }}
            placeholder="Пошук відео, плейлистів, груп і каналів..."
            className="h-9 min-w-[220px] flex-1 rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
          />
          <button type="button" onClick={submitSearch} className="btn-primary rounded-[4px] px-3 py-1.5 text-sm">
            Знайти
          </button>
        </div>
      </article>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`rounded-sm border px-3 py-1.5 text-sm ${tab === item.id ? "btn-primary" : "btn-ghost"}`}>
            {item.label}
          </button>
        ))}
      </nav>

      <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-nebori-muted">
            Знайдено: <span className="font-semibold text-[#e6e9f3]">{totalByTab[tab]}</span>
          </p>
          {tab === "videos" ? (
            <button type="button" onClick={() => setShowVideoFilters((value) => !value)} className="btn-ghost rounded-[4px] px-3 py-1.5 text-sm">
              Фільтри
            </button>
          ) : null}
        </div>

        {tab === "videos" && showVideoFilters ? (
          <div className="mb-3 grid grid-cols-1 gap-2 rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-2.5 md:grid-cols-3">
            <label className="block">
              <p className="mb-1 text-xs text-nebori-muted">Тривалість</p>
              <select value={durationFilter} onChange={(event) => setDurationFilter(event.target.value as DurationFilter)} className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none">
                <option value="any">Будь-яка</option>
                <option value="short">&lt; 4 хв</option>
                <option value="medium">4-20 хв</option>
                <option value="long">&gt; 20 хв</option>
              </select>
            </label>
            <label className="block">
              <p className="mb-1 text-xs text-nebori-muted">Дата завантаження</p>
              <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value as DateFilter)} className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none">
                <option value="any">Будь-коли</option>
                <option value="day">За добу</option>
                <option value="week">За тиждень</option>
                <option value="month">За місяць</option>
              </select>
            </label>
            <label className="block">
              <p className="mb-1 text-xs text-nebori-muted">Сортування</p>
              <select value={videoSort} onChange={(event) => setVideoSort(event.target.value as VideoSort)} className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none">
                <option value="relevance">За релевантністю</option>
                <option value="views">За переглядами</option>
                <option value="latest">За новизною</option>
              </select>
            </label>
          </div>
        ) : null}

        {tab === "videos" ? (
          filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredVideos.map((item, index) => (
                <VideoCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-nebori-muted">За вашим запитом немає відео.</p>
          )
        ) : null}

        {tab === "playlists" ? (
          filteredPlaylists.length > 0 ? (
            <div className="divide-y divide-[rgba(255,255,255,0.08)]">
              {filteredPlaylists.map((item) => (
                <article key={item.id} className="grid grid-cols-1 gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[220px_minmax(0,1fr)]">
                  <Link href={`/playlist/${item.id}`} className="group relative block overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.12)]">
                    <img src={`https://picsum.photos/seed/search-playlist-${item.id}/640/360`} alt={item.title} className="aspect-video w-full object-cover transition duration-150 group-hover:scale-[1.03]" loading="lazy" />
                    <span className="absolute bottom-1.5 right-1.5 rounded-[3px] bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">{item.videos} відео</span>
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/playlist/${item.id}`} className="line-clamp-2 text-[16px] font-semibold leading-5 text-[#e6e9f3] hover:text-nebori-accent">
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-nebori-muted">{item.author} • {item.views} переглядів • оновлено {item.updated}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-nebori-muted">За вашим запитом немає плейлистів.</p>
          )
        ) : null}

        {tab === "groups" ? (
          filteredGroups.length > 0 ? (
            <div className="divide-y divide-[rgba(255,255,255,0.08)]">
              {filteredGroups.map((item) => (
                <article key={item.id} className="grid grid-cols-1 gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[88px_minmax(0,1fr)]">
                  <Link href={`/groups/${item.id}`} className="block overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.14)]">
                    <img src={`https://picsum.photos/seed/search-group-${item.id}/176/176`} alt={item.name} className="h-[88px] w-[88px] object-cover" loading="lazy" />
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/groups/${item.id}`} className="text-[15px] font-semibold leading-5 text-[#e6e9f3] hover:text-nebori-accent">
                      {item.name}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-nebori-muted">{item.description}</p>
                    <p className="mt-1 text-[12px] leading-4 text-nebori-muted">{item.tags.map((tag) => `#${tag}`).join(" ")}</p>
                    <p className="mt-1 text-[12px] leading-4 text-nebori-muted">Учасників: {item.members} • Онлайн: {item.online} • Постів: {item.posts}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-nebori-muted">За вашим запитом немає груп.</p>
          )
        ) : null}

        {tab === "channels" ? (
          filteredChannels.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filteredChannels.map((channel, index) => (
                <article key={channel.handle} className="rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-[#121826] p-2.5">
                  <div className="flex items-center gap-2">
                    <ProfileHoverCard handle={channel.handle} name={channel.name} avatar={channel.avatar} videosCount={channel.videos} groupsCount={2} subscribers={channel.subscribers}>
                      <Link href={`/profile/${channel.handle}`} className="block">
                        <img src={channel.avatar} alt={channel.name} className="h-10 w-10 rounded-[3px] border border-[rgba(255,255,255,0.2)] object-cover" loading="lazy" />
                      </Link>
                    </ProfileHoverCard>
                    <div className="min-w-0">
                      <ProfileHoverCard handle={channel.handle} name={channel.name} avatar={channel.avatar} videosCount={channel.videos} groupsCount={2} subscribers={channel.subscribers}>
                        <Link href={`/profile/${channel.handle}`} className="block truncate text-sm font-semibold text-[#d6dcec] hover:text-nebori-accent">
                          {channel.name}
                        </Link>
                      </ProfileHoverCard>
                      <p className="text-xs text-nebori-muted">@{channel.handle}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-nebori-muted">Відео: {channel.videos} • Підписники: {channel.subscribers}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-nebori-muted">Останнє: {channel.lastVideo}</p>
                  <div className="mt-2">
                    <Link href={`/profile/${channel.handle}`} className="btn-ghost inline-flex rounded-[4px] px-2.5 py-1.5 text-xs">
                      Відкрити канал
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-nebori-muted">За вашим запитом немає каналів.</p>
          )
        ) : null}
      </article>
    </section>
  );
}
