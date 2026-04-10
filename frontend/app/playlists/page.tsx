import Link from "next/link";
import { ProfileHoverCard } from "@/components/profile-hover-card";

type PlaylistItem = {
  id: string;
  title: string;
  author: string;
  videos: number;
  views: string;
  updated: string;
  isLikes?: boolean;
};

const playlists: PlaylistItem[] = [
  {
    id: "pl-liked-00",
    title: "\u041b\u0430\u0439\u043a\u0438",
    author: "",
    videos: 24,
    views: "",
    updated: "2 \u0434\u043d\u0456 \u0442\u043e\u043c\u0443",
    isLikes: true
  },
  {
    id: "pl-meta-02",
    title: "\u041c\u0435\u0442\u0430-\u0441\u0435\u0437\u043e\u043d #12",
    author: "IronBand",
    videos: 18,
    views: "93 \u0442\u0438\u0441.",
    updated: "5 \u0434\u043d\u0456\u0432 \u0442\u043e\u043c\u0443"
  },
  {
    id: "pl-tokens-03",
    title: "\u0424\u0430\u0440\u043c \u0442\u043e\u043a\u0435\u043d\u0456\u0432 \u0431\u0435\u0437 \u0440\u0443\u0442\u0438\u043d\u0438",
    author: "TokenCrafter",
    videos: 31,
    views: "201 \u0442\u0438\u0441.",
    updated: "1 \u0442\u0438\u0436\u0434\u0435\u043d\u044c \u0442\u043e\u043c\u0443"
  },
  {
    id: "pl-dev-04",
    title: "Nebori Devlog",
    author: "Nebori Team",
    videos: 12,
    views: "62 \u0442\u0438\u0441.",
    updated: "3 \u0434\u043d\u0456 \u0442\u043e\u043c\u0443"
  },
  {
    id: "pl-pvp-05",
    title: "PvP-\u043f\u043e\u0437\u0438\u0446\u0456\u0457 \u043d\u0430 \u043a\u0430\u0440\u0442\u0430\u0445",
    author: "DeltaNox",
    videos: 27,
    views: "117 \u0442\u0438\u0441.",
    updated: "\u0432\u0447\u043e\u0440\u0430"
  },
  {
    id: "pl-clips-06",
    title: "\u041a\u0440\u0430\u0449\u0456 \u043a\u043b\u0456\u043f\u0438 \u0441\u043f\u0456\u043b\u044c\u043d\u043e\u0442\u0438",
    author: "Community Hub",
    videos: 54,
    views: "324 \u0442\u0438\u0441.",
    updated: "\u0441\u044c\u043e\u0433\u043e\u0434\u043d\u0456"
  },
  {
    id: "pl-lore-07",
    title: "\u041b\u043e\u0440 \u0441\u0435\u0437\u043e\u043d\u0443: \u043f\u043e\u0432\u043d\u0430 \u0445\u0440\u043e\u043d\u043e\u043b\u043e\u0433\u0456\u044f",
    author: "Lore Keepers",
    videos: 16,
    views: "49 \u0442\u0438\u0441.",
    updated: "4 \u0434\u043d\u0456 \u0442\u043e\u043c\u0443"
  },
  {
    id: "pl-builds-08",
    title: "\u0420\u043e\u0431\u043e\u0447\u0456 \u0431\u0456\u043b\u0434\u0438 \u043f\u0456\u0441\u043b\u044f \u043f\u0430\u0442\u0447\u0443",
    author: "ScoutLine",
    videos: 22,
    views: "78 \u0442\u0438\u0441.",
    updated: "6 \u0434\u043d\u0456\u0432 \u0442\u043e\u043c\u0443"
  }
];

export default function PlaylistsPage() {
  return (
    <section className="mx-auto w-full max-w-[1050px] space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold leading-none">
            {"\u041f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u0438"}
          </h1>
          <p className="mt-1 text-sm text-nebori-muted">
            @nebori_user {"\u2022"} {"\u0434\u043e\u0431\u0456\u0440\u043a\u0438 \u0432\u0456\u0434\u0435\u043e"}
          </p>
        </div>

        <Link
          href="/studio"
          className="btn-primary rounded-[4px] px-3 py-1.5 text-sm font-semibold"
        >
          {"\u0421\u0442\u0432\u043e\u0440\u0438\u0442\u0438 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442"}
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {playlists.map((item) => {
          const profileHandle = item.author.toLowerCase().replace(/\s+/g, "_");
          const profileAvatar = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(item.author)}`;

          return (
            <article
              key={item.id}
              className="group rounded-[4px] border border-transparent p-0.5 transition-all duration-150 hover:border-[rgba(245,197,24,0.28)] hover:bg-[rgba(255,255,255,0.04)]"
            >
              <Link href={`/playlist/${item.id}`} className="block">
                <div className="relative aspect-video overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.12)]">
                  <img
                    src={`https://picsum.photos/seed/playlist-global-${item.id}/960/540`}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-150 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1.5 right-1.5 rounded-[3px] bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {item.videos} {"\u0432\u0456\u0434\u0435\u043e"}
                  </span>
                </div>
              </Link>

              <div className="space-y-1 px-0.5 pb-0.5 pt-1.5">
                <Link
                  href={`/playlist/${item.id}`}
                  className="line-clamp-2 text-[16px] font-semibold leading-5 text-[#e6e9f3] hover:text-nebori-accent"
                >
                  {item.title}
                </Link>

                {item.isLikes ? (
                  <div className="min-w-0">
                    <p className="truncate text-[11px] leading-4 text-nebori-muted">
                      {"\u0410\u0432\u0442\u043e\u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442"} {"\u2022"} {"\u043f\u0440\u0438\u0432\u0430\u0442\u043d\u0438\u0439"}
                    </p>
                    <p className="truncate text-[11px] leading-4 text-nebori-muted">
                      {"\u041e\u043d\u043e\u0432\u043b\u0435\u043d\u043e"}: {item.updated}
                    </p>
                  </div>
                ) : (
                  <ProfileHoverCard
                    handle={profileHandle}
                    name={item.author}
                    avatar={profileAvatar}
                    className="block"
                  >
                    <div className="flex items-start gap-1.5">
                      <img
                        src={profileAvatar}
                        alt={item.author}
                        className="mt-0.5 h-6 w-6 flex-none rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/profile/${profileHandle}`}
                          className="block truncate text-xs font-semibold text-[#d6dcec] hover:text-nebori-accent"
                        >
                          {item.author}
                        </Link>
                        <p className="truncate text-[11px] leading-4 text-nebori-muted">
                          {item.views} {"\u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434\u0456\u0432 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u0430"}
                        </p>
                        <p className="truncate text-[11px] leading-4 text-nebori-muted">
                          {item.updated}
                        </p>
                      </div>
                    </div>
                  </ProfileHoverCard>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
