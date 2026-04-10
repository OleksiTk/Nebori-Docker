import Link from "next/link";
import { videos } from "@/data/mock";
import { ChannelProfileShell } from "@/components/channel-profile-shell";

type PageProps = {
  params: Promise<{ handle: string }>;
};

function makeDisplayName(handle: string) {
  return handle
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function ProfileVideosPage({ params }: PageProps) {
  const { handle } = await params;
  const displayName = makeDisplayName(handle);
  const channelVideos = [...videos, ...videos].slice(0, 18);

  return (
    <ChannelProfileShell handle={handle} displayName={displayName} activeTab="videos" hideSidebarOnMobile>
      <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#e6e9f3]">Список відео каналу</h2>
          <p className="text-xs text-nebori-muted">{channelVideos.length} відео</p>
        </div>

        <div className="divide-y divide-[rgba(255,255,255,0.08)]">
          {channelVideos.map((item, index) => (
            <article key={`${item.id}-${index}`} className="grid grid-cols-1 gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[220px_minmax(0,1fr)]">
              <Link href={`/video/${item.id}`} className="group relative block overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.12)]">
                <img
                  src={`https://picsum.photos/seed/profile-videos-${item.id}-${index}/640/360`}
                  alt={item.title}
                  className="aspect-video w-full object-cover transition duration-150 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <span className="absolute bottom-1.5 right-1.5 rounded-[3px] bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">{item.duration}</span>
              </Link>
              <div className="min-w-0">
                <Link href={`/video/${item.id}`} className="line-clamp-2 text-[16px] font-semibold leading-5 text-[#e6e9f3] hover:text-nebori-accent">
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-nebori-muted">
                  {item.views} переглядів • {item.date}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-[#c7d0e4]">Категорії: {item.tags.join(", ")}</p>
              </div>
            </article>
          ))}
        </div>
      </article>
    </ChannelProfileShell>
  );
}
