import Link from "next/link";
import { ProfileHoverCard } from "@/components/profile-hover-card";
import { ChannelProfileShell } from "@/components/channel-profile-shell";

type PageProps = {
  params: Promise<{ handle: string }>;
};

type ChannelActivityType = "video" | "playlist" | "comment" | "post" | "achievement" | "subscription";

type ChannelActivityItem = {
  id: string;
  actor: string;
  action: string;
  target: string;
  type: ChannelActivityType;
  label: string;
  time: string;
  href: string;
  previewSeed?: string;
};

const typeTone: Record<ChannelActivityType, string> = {
  video: "border-[rgba(80,156,255,0.35)] bg-[rgba(80,156,255,0.12)] text-[#9ec7ff]",
  playlist: "border-[rgba(245,197,24,0.35)] bg-[rgba(245,197,24,0.12)] text-nebori-accent",
  comment: "border-[rgba(120,224,160,0.35)] bg-[rgba(120,224,160,0.12)] text-[#8ee3b0]",
  post: "border-[rgba(189,154,255,0.35)] bg-[rgba(189,154,255,0.12)] text-[#c9b3ff]",
  achievement: "border-[rgba(120,224,160,0.35)] bg-[rgba(120,224,160,0.12)] text-[#8ee3b0]",
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

function buildChannelFeed(handle: string, displayName: string): ChannelActivityItem[] {
  const actorName = displayName || handle;
  return [
    { id: "ca-1", actor: actorName, action: "опублікував відео", target: "Огляд патчу Expedition 2.1", type: "video", label: "Відео", time: "1 год тому", href: "/video/v101", previewSeed: "v101" },
    { id: "ca-2", actor: actorName, action: "отримав ачивку", target: "Перші 1000 переглядів", type: "achievement", label: "Ачивка", time: "2 год тому", href: `/profile/${handle}` },
    { id: "ca-3", actor: actorName, action: "відповів на коментар під відео", target: "Турнір загону: фінальна гра", type: "comment", label: "Коментар", time: "3 год тому", href: "/video/v102" },
    { id: "ca-4", actor: actorName, action: "опублікував пост у групі", target: "Frontline Hub", type: "post", label: "Пост", time: "4 год тому", href: "/groups/frontline-hub" },
    { id: "ca-5", actor: actorName, action: "підписався на канал", target: "Raid Signals", type: "subscription", label: "Підписка", time: "5 год тому", href: "/profile/raid_signals" },
    { id: "ca-6", actor: actorName, action: "оновив плейлист", target: "Кращі кліпи спільноти", type: "playlist", label: "Плейлист", time: "вчора", href: "/playlist/pl-clips-06", previewSeed: "pl-clips-06" }
  ];
}

export default async function ProfileChannelActivityPage({ params }: PageProps) {
  const { handle } = await params;
  const displayName = makeDisplayName(handle);
  const feed = buildChannelFeed(handle, displayName);
  const profileHandle = handle.toLowerCase();
  const profileAvatar = `https://i.pravatar.cc/72?u=${encodeURIComponent(handle)}`;

  return (
    <ChannelProfileShell handle={handle} displayName={displayName} activeTab="activity" hideSidebarOnMobile>
      <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#e6e9f3]">Остання активність каналу</h2>
          <p className="text-xs text-nebori-muted">{feed.length} подій</p>
        </div>

        <div className="rounded-[6px] border border-[rgba(255,255,255,0.08)]">
          <div className="divide-y divide-[rgba(255,255,255,0.08)]">
            {feed.map((item, idx) => (
              <article key={item.id} className="px-3 py-3 hover:bg-[rgba(255,255,255,0.02)]">
                <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-3">
                  <div className="relative flex justify-center">
                    <ProfileHoverCard handle={profileHandle} name={displayName} avatar={profileAvatar} videosCount={48} groupsCount={3} subscribers="6.1 тис.">
                      <img
                        src={profileAvatar}
                        alt={displayName}
                        className="h-9 w-9 flex-none rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                        loading="lazy"
                      />
                    </ProfileHoverCard>
                    {idx < feed.length - 1 ? <span className="absolute left-1/2 top-10 h-[calc(100%+14px)] w-px -translate-x-1/2 bg-[rgba(255,255,255,0.12)]" /> : null}
                  </div>

                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-[3px] border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] ${typeTone[item.type]}`}>
                        {item.label}
                      </span>
                      <span className="text-xs text-nebori-muted">{item.time}</span>
                    </div>

                    <p className="text-sm leading-6 text-nebori-text">
                      <ProfileHoverCard handle={profileHandle} name={displayName} avatar={profileAvatar} videosCount={48} groupsCount={3} subscribers="6.1 тис.">
                        <Link href={`/profile/${handle}`} className="cursor-pointer font-semibold text-nebori-accent hover:underline">
                          {displayName}
                        </Link>
                      </ProfileHoverCard>{" "}
                      {item.action}{" "}
                      <Link href={item.href} className="font-medium text-[#e7ebf7] hover:text-nebori-accent">
                        «{item.target}»
                      </Link>
                    </p>

                    {item.previewSeed ? (
                      <Link href={item.href} className="group relative block h-[104px] max-w-[330px] overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.1)]">
                        <img
                          src={`https://picsum.photos/seed/channel-activity-${item.previewSeed}/640/360`}
                          alt={item.target}
                          className="h-full w-full object-cover transition duration-150 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
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
