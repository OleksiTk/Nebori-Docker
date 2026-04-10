import Link from "next/link";
import { ProfileHoverCard } from "@/components/profile-hover-card";

type ActivityType = "Відео" | "Група" | "Ачівка" | "Публікація" | "Підписка";

type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  target: string;
  type: ActivityType;
  time: string;
  href: string;
  previewSeed?: string;
};

const feed: ActivityItem[] = [
  { id: "a1", actor: "Іван", action: "подивився", target: "Огляд патчу Expedition 2.1", type: "Відео", time: "1 год тому", href: "/video/v101", previewSeed: "v101" },
  { id: "a2", actor: "Марія", action: "вступила в групу", target: "Raid Signals", type: "Група", time: "2 год тому", href: "/groups/raid-signals" },
  { id: "a3", actor: "Олег", action: "отримав ачівку", target: "Перші 1000 переглядів", type: "Ачівка", time: "3 год тому", href: "/profile/oleg" },
  { id: "a4", actor: "Daria", action: "опублікувала відео у групі", target: "Nebori Devlog #3: групи", type: "Публікація", time: "4 год тому", href: "/video/v103", previewSeed: "v103" },
  { id: "a5", actor: "Raptor", action: "підписався на автора", target: "Nebori Team", type: "Підписка", time: "5 год тому", href: "/profile/nebori_team" },
  { id: "a6", actor: "Mira", action: "подивилася", target: "Гайд по швидкому фарму токенів", type: "Відео", time: "6 год тому", href: "/video/v104", previewSeed: "v104" }
];

const typeTone: Record<ActivityType, string> = {
  Відео: "border-[rgba(80,156,255,0.35)] bg-[rgba(80,156,255,0.12)] text-[#9ec7ff]",
  Група: "border-[rgba(245,197,24,0.35)] bg-[rgba(245,197,24,0.12)] text-nebori-accent",
  Ачівка: "border-[rgba(120,224,160,0.35)] bg-[rgba(120,224,160,0.12)] text-[#8ee3b0]",
  Публікація: "border-[rgba(189,154,255,0.35)] bg-[rgba(189,154,255,0.12)] text-[#c9b3ff]",
  Підписка: "border-[rgba(255,255,255,0.24)] bg-[rgba(255,255,255,0.08)] text-[#d6dcec]"
};

export default function ActivityPage() {
  return (
    <section className="mx-auto w-full max-w-[900px] space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold leading-none">Стрічка активності</h1>
        <p className="text-sm text-nebori-muted">Останні дії підписок</p>
      </header>

      <div className="rounded-[6px] border border-[rgba(255,255,255,0.08)]">
        <div className="divide-y divide-[rgba(255,255,255,0.08)]">
          {feed.map((item, idx) => (
            <article key={item.id} className="px-4 py-3 hover:bg-[rgba(255,255,255,0.02)]">
              <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-3">
                <div className="relative flex justify-center">
                  <ProfileHoverCard
                    handle={item.actor.toLowerCase().replace(/\s+/g, "_")}
                    name={item.actor}
                    avatar={`https://i.pravatar.cc/72?u=${encodeURIComponent(item.actor)}`}
                    videosCount={18}
                    groupsCount={2}
                    subscribers="6.1 тис."
                  >
                    <img
                      src={`https://i.pravatar.cc/72?u=${encodeURIComponent(item.actor)}`}
                      alt={item.actor}
                      className="h-9 w-9 flex-none rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                      loading="lazy"
                    />
                  </ProfileHoverCard>
                  {idx < feed.length - 1 ? <span className="absolute left-1/2 top-10 h-[calc(100%+14px)] w-px -translate-x-1/2 bg-[rgba(255,255,255,0.12)]" /> : null}
                </div>

                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-[3px] border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] ${typeTone[item.type]}`}>
                      {item.type}
                    </span>
                    <span className="text-xs text-nebori-muted">{item.time}</span>
                  </div>

                  <p className="text-sm leading-6 text-nebori-text">
                    <ProfileHoverCard
                      handle={item.actor.toLowerCase().replace(/\s+/g, "_")}
                      name={item.actor}
                      avatar={`https://i.pravatar.cc/72?u=${encodeURIComponent(item.actor)}`}
                      videosCount={18}
                      groupsCount={2}
                      subscribers="6.1 тис."
                    >
                      <Link href={`/profile/${item.actor.toLowerCase().replace(/\s+/g, "_")}`} className="cursor-pointer font-semibold text-nebori-accent hover:underline">
                        {item.actor}
                      </Link>
                    </ProfileHoverCard>{" "}
                    {item.action}{" "}
                    <Link href={item.href} className="font-medium text-[#e7ebf7] hover:text-nebori-accent">
                      «{item.target}»
                    </Link>
                  </p>

                  {item.previewSeed ? (
                    <Link
                      href={item.href}
                      className="group relative block h-[104px] max-w-[330px] overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.1)]"
                    >
                      <img
                        src={`https://picsum.photos/seed/activity-${item.previewSeed}/640/360`}
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
    </section>
  );
}
