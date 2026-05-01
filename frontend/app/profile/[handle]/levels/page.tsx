import { ChannelProfileShell } from "@/components/channel-profile-shell";

type PageProps = {
  params: Promise<{ handle: string }>;
};

type LevelTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

type ChannelLevel = {
  level: number;
  title: string;
  tier: LevelTier;
  xpRequired: number;
  perks: string[];
};

const tierStyle: Record<LevelTier, { badge: string; ring: string; label: string }> = {
  bronze: {
    badge: "border-[rgba(180,100,40,0.45)] bg-[rgba(180,100,40,0.12)] text-[#c8803c]",
    ring: "border-[rgba(180,100,40,0.3)]",
    label: "Бронза",
  },
  silver: {
    badge: "border-[rgba(180,190,210,0.45)] bg-[rgba(180,190,210,0.1)] text-[#b8c4d8]",
    ring: "border-[rgba(180,190,210,0.25)]",
    label: "Срібло",
  },
  gold: {
    badge: "border-[rgba(245,197,24,0.45)] bg-[rgba(245,197,24,0.12)] text-nebori-accent",
    ring: "border-[rgba(245,197,24,0.3)]",
    label: "Золото",
  },
  platinum: {
    badge: "border-[rgba(80,200,230,0.45)] bg-[rgba(80,200,230,0.1)] text-[#72d8f0]",
    ring: "border-[rgba(80,200,230,0.25)]",
    label: "Платина",
  },
  diamond: {
    badge: "border-[rgba(180,120,255,0.5)] bg-[rgba(180,120,255,0.12)] text-[#c59fff]",
    ring: "border-[rgba(180,120,255,0.3)]",
    label: "Діамант",
  },
};

const levels: ChannelLevel[] = [
  {
    level: 1,
    title: "Новачок",
    tier: "bronze",
    xpRequired: 0,
    perks: ["Доступ до базових функцій каналу", "Публікація відео та постів"],
  },
  {
    level: 2,
    title: "Контентер",
    tier: "bronze",
    xpRequired: 500,
    perks: ["Розширений опис каналу", "Можливість додавати теги до відео"],
  },
  {
    level: 3,
    title: "Стартовий автор",
    tier: "bronze",
    xpRequired: 1200,
    perks: ["Доступ до аналітики каналу", "Базова вітрина ачивок у профілі"],
  },
  {
    level: 4,
    title: "Активний учасник",
    tier: "silver",
    xpRequired: 2500,
    perks: ["Срібна рамка профілю", "Пріоритет у пошуковій видачі"],
  },
  {
    level: 5,
    title: "Постійний автор",
    tier: "silver",
    xpRequired: 4500,
    perks: ["Доступ до кастомного банера каналу", "Розширена аналітика аудиторії"],
  },
  {
    level: 6,
    title: "Золотий творець",
    tier: "gold",
    xpRequired: 8000,
    perks: ["Золота рамка та значок у профілі", "Доступ до монетизації контенту", "Виділення у каталозі авторів"],
  },
  {
    level: 7,
    title: "Провідний автор",
    tier: "gold",
    xpRequired: 14000,
    perks: ["Можливість проводити прямі ефіри", "Кастомний URL каналу"],
  },
  {
    level: 8,
    title: "Платиновий блогер",
    tier: "platinum",
    xpRequired: 22000,
    perks: ["Платинова рамка та позначка верифікації", "Ранній доступ до нових функцій платформи", "Партнерська підтримка"],
  },
  {
    level: 9,
    title: "Діамантовий лідер",
    tier: "diamond",
    xpRequired: 40000,
    perks: [
      "Діамантова рамка та ексклюзивний значок",
      "Потрапляння до топу рекомендацій платформи",
      "Доступ до закритого клубу авторів",
      "Ексклюзивні колаборації з командою Nebori",
    ],
  },
];

// Current channel state (mock)
const currentXP = 9200;
const currentLevel = levels.reduce((acc, l) => (currentXP >= l.xpRequired ? l : acc), levels[0]);
const nextLevel = levels[levels.indexOf(currentLevel) + 1];

function makeDisplayName(handle: string) {
  return handle
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function XPBar({ current, from, to }: { current: number; from: number; to: number }) {
  const pct = Math.min(100, Math.round(((current - from) / (to - from)) * 100));
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-nebori-muted">
        <span>{(current - from).toLocaleString("uk-UA")} XP набрано</span>
        <span>{(to - from).toLocaleString("uk-UA")} XP потрібно</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
        <div
          className="h-full rounded-full bg-nebori-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default async function ProfileLevelsPage({ params }: PageProps) {
  const { handle } = await params;
  const displayName = makeDisplayName(handle);
  const currentTierStyle = tierStyle[currentLevel.tier];

  return (
    <ChannelProfileShell handle={handle} displayName={displayName} activeTab="levels" hideSidebarOnMobile>
      {/* Current level card */}
      <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <h2 className="mb-3 text-lg font-semibold text-[#e6e9f3]">Поточний рівень каналу</h2>
        <div className={`rounded-[6px] border p-4 ${currentTierStyle.ring} bg-[rgba(255,255,255,0.03)]`}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[6px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] text-3xl font-black text-[#e6e9f3]">
              {currentLevel.level}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xl font-bold text-[#e6e9f3]">{currentLevel.title}</p>
                <span className={`rounded-[3px] border px-2 py-0.5 text-[11px] font-semibold ${currentTierStyle.badge}`}>
                  {tierStyle[currentLevel.tier].label}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-nebori-muted">Загальний досвід: {currentXP.toLocaleString("uk-UA")} XP</p>
            </div>
          </div>

          {nextLevel && (
            <div className="mt-4">
              <p className="mb-2 text-[13px] text-nebori-muted">
                До рівня <span className="font-semibold text-[#e6e9f3]">{nextLevel.level} — {nextLevel.title}</span>
              </p>
              <XPBar current={currentXP} from={currentLevel.xpRequired} to={nextLevel.xpRequired} />
            </div>
          )}
        </div>
      </article>

      {/* How to earn XP */}
      <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <h2 className="mb-3 text-[15px] font-semibold text-[#e6e9f3]">Як отримувати досвід</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { icon: "🎬", action: "Публікація відео", xp: "+50 XP" },
            { icon: "💬", action: "Коментар до відео", xp: "+5 XP" },
            { icon: "👍", action: "Лайк від глядача", xp: "+1 XP" },
            { icon: "👥", action: "Новий підписник", xp: "+10 XP" },
            { icon: "📋", action: "Публікація плейлиста", xp: "+20 XP" },
            { icon: "🔥", action: "Щоденний стрік", xp: "+15 XP" },
          ].map((item) => (
            <div
              key={item.action}
              className="flex items-center gap-3 rounded-[6px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-2.5"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-[#d5ddee]">{item.action}</p>
              </div>
              <span className="rounded-[3px] border border-[rgba(245,197,24,0.3)] bg-[rgba(245,197,24,0.1)] px-2 py-0.5 text-[12px] font-bold text-nebori-accent">
                {item.xp}
              </span>
            </div>
          ))}
        </div>
      </article>

      {/* All levels table */}
      <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <h2 className="mb-3 text-[15px] font-semibold text-[#e6e9f3]">Усі рівні</h2>
        <div className="space-y-2">
          {levels.map((lvl) => {
            const ts = tierStyle[lvl.tier];
            const isActive = lvl.level === currentLevel.level;
            const isPassed = lvl.level < currentLevel.level;
            return (
              <div
                key={lvl.level}
                className={`rounded-[6px] border p-3 transition-colors ${
                  isActive
                    ? `${ts.ring} bg-[rgba(255,255,255,0.05)]`
                    : isPassed
                    ? "border-[rgba(255,255,255,0.06)] bg-transparent opacity-60"
                    : "border-[rgba(255,255,255,0.06)] bg-transparent"
                }`}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] text-[15px] font-black text-[#e6e9f3]">
                    {lvl.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[14px] font-semibold text-[#e6e9f3]">{lvl.title}</p>
                      <span className={`rounded-[3px] border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] ${ts.badge}`}>
                        {ts.label}
                      </span>
                      {isActive && (
                        <span className="rounded-[3px] border border-[rgba(120,224,160,0.3)] bg-[rgba(120,224,160,0.1)] px-1.5 py-0.5 text-[10px] font-semibold text-[#8ee3b0]">
                          ● Поточний
                        </span>
                      )}
                      {isPassed && (
                        <span className="text-[11px] text-nebori-muted">✓ Пройдено</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[12px] text-nebori-muted">
                      Від {lvl.xpRequired.toLocaleString("uk-UA")} XP
                    </p>
                    <ul className="mt-1.5 space-y-0.5">
                      {lvl.perks.map((perk) => (
                        <li key={perk} className="text-[12px] leading-4 text-[#b0bdd4]">
                          — {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </ChannelProfileShell>
  );
}
