import { ChannelProfileShell } from "@/components/channel-profile-shell";

type PageProps = {
  params: Promise<{ handle: string }>;
};

type AchievementCategory = "перегляди" | "активність" | "спільнота" | "контент" | "особливі";

type Achievement = {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  total?: number;
  icon: string;
};

const categoryTone: Record<AchievementCategory, string> = {
  перегляди: "border-[rgba(80,156,255,0.35)] bg-[rgba(80,156,255,0.12)] text-[#9ec7ff]",
  активність: "border-[rgba(189,154,255,0.35)] bg-[rgba(189,154,255,0.12)] text-[#c9b3ff]",
  спільнота: "border-[rgba(120,224,160,0.35)] bg-[rgba(120,224,160,0.12)] text-[#8ee3b0]",
  контент: "border-[rgba(245,197,24,0.35)] bg-[rgba(245,197,24,0.12)] text-nebori-accent",
  особливі: "border-[rgba(255,140,80,0.35)] bg-[rgba(255,140,80,0.12)] text-[#ffb380]",
};

const achievements: Achievement[] = [
  {
    id: "ach-01",
    title: "Перші 1000 переглядів",
    description: "Набрати 1000 переглядів на каналі.",
    category: "перегляди",
    unlocked: true,
    unlockedAt: "15 берез. 2024",
    icon: "👁",
  },
  {
    id: "ach-02",
    title: "10 тисяч переглядів",
    description: "Сумарно набрати 10 000 переглядів.",
    category: "перегляди",
    unlocked: true,
    unlockedAt: "2 квіт. 2024",
    icon: "🔥",
  },
  {
    id: "ach-03",
    title: "100 тисяч переглядів",
    description: "Сумарно набрати 100 000 переглядів.",
    category: "перегляди",
    unlocked: false,
    progress: 68400,
    total: 100000,
    icon: "💥",
  },
  {
    id: "ach-04",
    title: "Активний коментатор",
    description: "Залишити 50 коментарів на платформі.",
    category: "активність",
    unlocked: true,
    unlockedAt: "20 берез. 2024",
    icon: "💬",
  },
  {
    id: "ach-05",
    title: "Тижневий стрік",
    description: "Публікувати контент 7 днів поспіль.",
    category: "активність",
    unlocked: true,
    unlockedAt: "8 квіт. 2024",
    icon: "📅",
  },
  {
    id: "ach-06",
    title: "Місячний стрік",
    description: "Публікувати контент 30 днів поспіль.",
    category: "активність",
    unlocked: false,
    progress: 14,
    total: 30,
    icon: "🗓",
  },
  {
    id: "ach-07",
    title: "Командний гравець",
    description: "Вступити до 3 груп одночасно.",
    category: "спільнота",
    unlocked: true,
    unlockedAt: "5 квіт. 2024",
    icon: "🤝",
  },
  {
    id: "ach-08",
    title: "Перші 100 підписників",
    description: "Досягти позначки 100 підписників.",
    category: "спільнота",
    unlocked: true,
    unlockedAt: "28 берез. 2024",
    icon: "👥",
  },
  {
    id: "ach-09",
    title: "Перші 1000 підписників",
    description: "Досягти позначки 1000 підписників.",
    category: "спільнота",
    unlocked: false,
    progress: 612,
    total: 1000,
    icon: "🌐",
  },
  {
    id: "ach-10",
    title: "Топ автор тижня",
    description: "Потрапити до топ-10 авторів за тиждень.",
    category: "контент",
    unlocked: true,
    unlockedAt: "14 квіт. 2024",
    icon: "🏅",
  },
  {
    id: "ach-11",
    title: "Перше відео",
    description: "Опублікувати перше відео на каналі.",
    category: "контент",
    unlocked: true,
    unlockedAt: "12 берез. 2024",
    icon: "🎬",
  },
  {
    id: "ach-12",
    title: "Першопроходець",
    description: "Зареєструватися в перший місяць роботи платформи.",
    category: "особливі",
    unlocked: true,
    unlockedAt: "12 берез. 2024",
    icon: "🚀",
  },
];

function makeDisplayName(handle: string) {
  return handle
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = Math.min(100, Math.round((value / total) * 100));
  return (
    <div className="mt-2">
      <div className="mb-1 flex justify-between text-[11px] text-nebori-muted">
        <span>{value.toLocaleString("uk-UA")} / {total.toLocaleString("uk-UA")}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
        <div
          className="h-full rounded-full bg-nebori-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default async function ProfileAchievementsPage({ params }: PageProps) {
  const { handle } = await params;
  const displayName = makeDisplayName(handle);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const categories = Array.from(new Set(achievements.map((a) => a.category))) as AchievementCategory[];

  return (
    <ChannelProfileShell handle={handle} displayName={displayName} activeTab="achievements" hideSidebarOnMobile>
      {/* Summary bar */}
      <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-[#e6e9f3]">Ачивки каналу</h2>
          <p className="text-sm text-nebori-muted">
            Отримано:{" "}
            <span className="font-semibold text-nebori-accent">{unlockedCount}</span>
            {" / "}
            <span>{achievements.length}</span>
          </p>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
          <div
            className="h-full rounded-full bg-nebori-accent"
            style={{ width: `${Math.round((unlockedCount / achievements.length) * 100)}%` }}
          />
        </div>
      </article>

      {/* Per category */}
      {categories.map((cat) => {
        const items = achievements.filter((a) => a.category === cat);
        return (
          <article
            key={cat}
            className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3"
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`rounded-[3px] border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] ${categoryTone[cat]}`}
              >
                {cat}
              </span>
              <span className="text-xs text-nebori-muted">
                {items.filter((i) => i.unlocked).length}/{items.length}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {items.map((ach) => (
                <div
                  key={ach.id}
                  className={`rounded-[6px] border p-3 transition-colors ${
                    ach.unlocked
                      ? "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)]"
                      : "border-[rgba(255,255,255,0.06)] bg-transparent opacity-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-2xl leading-none">{ach.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[14px] font-semibold leading-5 text-[#e6e9f3]">
                          {ach.title}
                        </p>
                        {ach.unlocked && (
                          <span className="rounded-[3px] border border-[rgba(120,224,160,0.3)] bg-[rgba(120,224,160,0.1)] px-1.5 py-0.5 text-[10px] font-semibold text-[#8ee3b0]">
                            ✓ Отримано
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[12px] leading-4 text-nebori-muted">
                        {ach.description}
                      </p>
                      {ach.unlocked && ach.unlockedAt && (
                        <p className="mt-1 text-[11px] text-nebori-muted">
                          Отримано: {ach.unlockedAt}
                        </p>
                      )}
                      {!ach.unlocked && ach.progress !== undefined && ach.total !== undefined && (
                        <ProgressBar value={ach.progress} total={ach.total} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </ChannelProfileShell>
  );
}