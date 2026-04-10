import Link from "next/link";
import { groupActivityPosts, videos } from "@/data/mock";
import { ChannelProfileShell } from "@/components/channel-profile-shell";

type PageProps = {
  params: Promise<{ handle: string }>;
};

type ChannelFeedType = "post" | "video" | "playlist" | "achievement" | "comment" | "subscription";

type ChannelFeedItem = {
  id: string;
  type: ChannelFeedType;
  label: string;
  time: string;
  action: string;
  target: string;
  href: string;
  previewSeed?: string;
};

const typeTone: Record<ChannelFeedType, string> = {
  post: "border-[rgba(189,154,255,0.35)] bg-[rgba(189,154,255,0.12)] text-[#c9b3ff]",
  video: "border-[rgba(80,156,255,0.35)] bg-[rgba(80,156,255,0.12)] text-[#9ec7ff]",
  playlist: "border-[rgba(245,197,24,0.35)] bg-[rgba(245,197,24,0.12)] text-nebori-accent",
  achievement: "border-[rgba(120,224,160,0.35)] bg-[rgba(120,224,160,0.12)] text-[#8ee3b0]",
  comment: "border-[rgba(106,190,255,0.35)] bg-[rgba(106,190,255,0.12)] text-[#9dd4ff]",
  subscription: "border-[rgba(255,255,255,0.24)] bg-[rgba(255,255,255,0.08)] text-[#d6dcec]"
};

function makeDisplayName(handle: string) {
  return handle
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function ProfilePage({ params }: PageProps) {
  const { handle } = await params;
  const displayName = makeDisplayName(handle);
  const previewVideos = videos.slice(0, 4);
  const previewActivity = groupActivityPosts[0];

  const channelFeed: ChannelFeedItem[] = [
    {
      id: "cf-1",
      type: "video",
      label: "Відео",
      time: "1 год тому",
      action: "опублікував відео",
      target: "Огляд патчу Expedition 2.1",
      href: "/video/v101",
      previewSeed: "v101"
    },
    {
      id: "cf-2",
      type: "achievement",
      label: "Ачивка",
      time: "2 год тому",
      action: "отримав ачивку",
      target: "Перші 1000 переглядів",
      href: `/profile/${handle}`
    },
    {
      id: "cf-3",
      type: "comment",
      label: "Коментар",
      time: "3 год тому",
      action: "відповів на коментар під відео",
      target: "Турнір загону: фінальна гра",
      href: "/video/v102"
    },
    {
      id: "cf-4",
      type: "playlist",
      label: "Плейлист",
      time: "4 год тому",
      action: "оновив плейлист",
      target: "Кращі кліпи спільноти",
      href: "/playlist/pl-clips-06",
      previewSeed: "pl-clips-06"
    },
    {
      id: "cf-5",
      type: "subscription",
      label: "Підписка",
      time: "5 год тому",
      action: "підписався на канал",
      target: "Raid Signals",
      href: "/profile/raid_signals"
    },
    {
      id: "cf-6",
      type: "post",
      label: "Пост",
      time: previewActivity?.time ?? "сьогодні",
      action: "опублікував пост у групі",
      target: previewActivity?.group ?? "Frontline Hub",
      href: `/groups/activity/${previewActivity?.id ?? "g1"}`,
      previewSeed: previewActivity?.id ?? "g1"
    }
  ];

  const mainChannelFeed = channelFeed.slice(0, 5);

  return (
    <ChannelProfileShell handle={handle} displayName={displayName} activeTab="overview">
      <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#e6e9f3]">Останні відео</h2>
          <Link href={`/profile/${handle}/videos`} className="text-xs text-nebori-accent hover:underline">
            Відкрити всі
          </Link>
        </div>
        <div className="divide-y divide-[rgba(255,255,255,0.08)]">
          {previewVideos.map((item) => (
            <article key={item.id} className="grid grid-cols-1 gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[210px_minmax(0,1fr)]">
              <Link href={`/video/${item.id}`} className="group relative block overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.12)]">
                <img src={`https://picsum.photos/seed/profile-video-${item.id}/640/360`} alt={item.title} className="aspect-video w-full object-cover transition duration-150 group-hover:scale-[1.03]" loading="lazy" />
                <span className="absolute bottom-1.5 right-1.5 rounded-[3px] bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">{item.duration}</span>
              </Link>
              <div className="min-w-0">
                <Link href={`/video/${item.id}`} className="line-clamp-2 text-[16px] font-semibold leading-5 text-[#e6e9f3] hover:text-nebori-accent">
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-nebori-muted">
                  {item.views} переглядів • {item.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      </article>

      <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#e6e9f3]">Остання активність каналу</h2>
          <Link href={`/profile/${handle}/activity`} className="text-xs text-nebori-accent hover:underline">
            Вся активність
          </Link>
        </div>

        <div className="rounded-[6px] border border-[rgba(255,255,255,0.08)]">
          <div className="divide-y divide-[rgba(255,255,255,0.08)]">
            {mainChannelFeed.map((item, idx) => (
              <article key={item.id} className="px-3 py-3 hover:bg-[rgba(255,255,255,0.02)]">
                <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-3">
                  <div className="relative flex justify-center">
                    <Link href={`/profile/${handle}`} className="block">
                      <img src={`https://i.pravatar.cc/72?u=${encodeURIComponent(handle)}`} alt={displayName} className="h-9 w-9 rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover" loading="lazy" />
                    </Link>
                    {idx < mainChannelFeed.length - 1 ? <span className="absolute left-1/2 top-10 h-[calc(100%+14px)] w-px -translate-x-1/2 bg-[rgba(255,255,255,0.12)]" /> : null}
                  </div>

                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-[3px] border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] ${typeTone[item.type]}`}>{item.label}</span>
                      <span className="text-xs text-nebori-muted">{item.time}</span>
                    </div>

                    <p className="text-sm leading-6 text-nebori-text">
                      <Link href={`/profile/${handle}`} className="font-semibold text-nebori-accent hover:underline">
                        {displayName}
                      </Link>{" "}
                      {item.action}{" "}
                      <Link href={item.href} className="font-medium text-[#e7ebf7] hover:text-nebori-accent">
                        «{item.target}»
                      </Link>
                    </p>

                    {item.previewSeed ? (
                      <Link href={item.href} className="group relative block h-[92px] max-w-[320px] overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.1)]">
                        <img src={`https://picsum.photos/seed/channel-activity-${item.previewSeed}/640/360`} alt={item.target} className="h-full w-full object-cover transition duration-150 group-hover:scale-[1.03]" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <span className="absolute bottom-2 left-2 line-clamp-1 text-xs font-medium text-white">{item.target}</span>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </article>
    </ChannelProfileShell>
  );
}
