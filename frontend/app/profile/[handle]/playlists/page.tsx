import Link from "next/link";
import { ChannelProfileShell } from "@/components/channel-profile-shell";

type PageProps = {
  params: Promise<{ handle: string }>;
};

type PlaylistItem = {
  id: string;
  title: string;
  videos: number;
  views: string;
  updated: string;
};

const playlists: PlaylistItem[] = [
  { id: "pl-meta-02", title: "Мета-сезон #12", videos: 18, views: "93 тис.", updated: "5 днів тому" },
  { id: "pl-tokens-03", title: "Фарм токенів без рутини", videos: 31, views: "201 тис.", updated: "1 тиждень тому" },
  { id: "pl-dev-04", title: "Nebori Devlog", videos: 12, views: "62 тис.", updated: "3 дні тому" },
  { id: "pl-pvp-05", title: "PvP-позиції на картах", videos: 27, views: "117 тис.", updated: "вчора" },
  { id: "pl-clips-06", title: "Кращі кліпи спільноти", videos: 54, views: "324 тис.", updated: "сьогодні" },
  { id: "pl-lore-07", title: "Лор сезону: повна хронологія", videos: 16, views: "49 тис.", updated: "4 дні тому" },
  { id: "pl-builds-08", title: "Робочі білди після патчу", videos: 22, views: "78 тис.", updated: "6 днів тому" }
];

function makeDisplayName(handle: string) {
  return handle
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function ProfilePlaylistsPage({ params }: PageProps) {
  const { handle } = await params;
  const displayName = makeDisplayName(handle);

  return (
    <ChannelProfileShell handle={handle} displayName={displayName} activeTab="playlists" hideSidebarOnMobile>
      <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#e6e9f3]">Список плейлистів каналу</h2>
          <p className="text-xs text-nebori-muted">{playlists.length} плейлистів</p>
        </div>

        <div className="divide-y divide-[rgba(255,255,255,0.08)]">
          {playlists.map((item) => (
            <article key={item.id} className="grid grid-cols-1 gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[210px_minmax(0,1fr)]">
              <Link href={`/playlist/${item.id}`} className="group relative block overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.12)]">
                <img
                  src={`https://picsum.photos/seed/playlist-${item.id}/640/360`}
                  alt={item.title}
                  className="aspect-video w-full object-cover transition duration-150 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <span className="absolute bottom-1.5 right-1.5 rounded-[3px] bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">{item.videos} відео</span>
              </Link>
              <div className="min-w-0">
                <Link href={`/playlist/${item.id}`} className="line-clamp-2 text-[16px] font-semibold leading-5 text-[#e6e9f3] hover:text-nebori-accent">
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-nebori-muted">
                  {item.views} переглядів плейлиста • оновлено {item.updated}
                </p>
              </div>
            </article>
          ))}
        </div>
      </article>
    </ChannelProfileShell>
  );
}
