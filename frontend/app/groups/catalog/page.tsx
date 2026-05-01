import Link from "next/link";

type GroupCatalogItem = {
  id: string;
  rank: number;
  name: string;
  description: string;
  tags: string[];
  members: string;
  online: string;
  posts: string;
  badge?: string;
};

const groups: GroupCatalogItem[] = [
  {
    id: "frontline-hub",
    rank: 1,
    name: "Frontline Hub",
    description: "Координація рейдів, тактичні обговорення, щоденні збори складів і live-розбір ігор.",
    tags: ["Тактика", "Команди", "Рейди", "Навчання"],
    members: "12 480",
    online: "840",
    posts: "1 320",
    badge: "Преміум"
  },
  {
    id: "raid-signals",
    rank: 2,
    name: "Raid Signals",
    description: "Група для швидкого пошуку команди, обміну ролями та спільних вечірніх сесій.",
    tags: ["LFG", "Команди", "Голос", "Події"],
    members: "8 910",
    online: "612",
    posts: "970",
    badge: "Буст"
  },
  {
    id: "market-watch",
    rank: 3,
    name: "Market Watch",
    description: "Аналітика економіки токенів, огляди патчів, таблиці прибутковості активностей.",
    tags: ["Економіка", "Токени", "Аналітика"],
    members: "6 304",
    online: "421",
    posts: "714"
  },
  {
    id: "lore-keepers",
    rank: 4,
    name: "Lore Keepers",
    description: "Теорії, хронологія сезону, обговорення історії світу Nebori і сюжетних деталей.",
    tags: ["Лор", "Теорії", "Обговорення"],
    members: "4 932",
    online: "255",
    posts: "503"
  },
  {
    id: "creator-lab",
    rank: 5,
    name: "Creator Lab",
    description: "Для авторів: монтаж, оформлення каналу, зростання аудиторії та взаємний фідбек.",
    tags: ["Автори", "Монтаж", "Просування"],
    members: "3 781",
    online: "198",
    posts: "446",
    badge: "Нове"
  },
  {
    id: "arena-core",
    rank: 6,
    name: "Arena Core",
    description: "Сквади для PvP, мап-пули, тренування позицій і регулярні внутрішні турніри.",
    tags: ["PvP", "Сквади", "Тренування"],
    members: "3 260",
    online: "177",
    posts: "389"
  },
  {
    id: "build-workshop",
    rank: 7,
    name: "Build Workshop",
    description: "Збірки, патч-ноути, баланс класів і тести нових мета-комбінацій.",
    tags: ["Білди", "Мета", "Патчі"],
    members: "2 912",
    online: "162",
    posts: "354"
  },
  {
    id: "clip-foundry",
    rank: 8,
    name: "Clip Foundry",
    description: "Обмін кліпами, підбір моментів, фідбек по монтажу та заголовках роликів.",
    tags: ["Кліпи", "Монтаж", "Оформлення"],
    members: "2 477",
    online: "149",
    posts: "318"
  },
  {
    id: "night-watch",
    rank: 9,
    name: "Night Watch",
    description: "Пізні рейди, нічні черги, координація ролей і голосові сесії після 23:00.",
    tags: ["Нічні рейди", "Кооператив", "Голос"],
    members: "2 041",
    online: "133",
    posts: "281"
  },
  {
    id: "quest-archive",
    rank: 10,
    name: "Quest Archive",
    description: "Гайди по квестах, маршрутні листи, секрети локацій і чеклісти прогресу.",
    tags: ["Квести", "Гайди", "Маршрути"],
    members: "1 804",
    online: "118",
    posts: "249"
  },
  {
    id: "token-ops",
    rank: 11,
    name: "Token Ops",
    description: "Щоденні задачі, івент-трекінг, економіка нагород і командні фарм-маршрути.",
    tags: ["Токени", "Івенти", "Фарм"],
    members: "1 622",
    online: "104",
    posts: "217"
  },
  {
    id: "rookie-hub",
    rank: 12,
    name: "Rookie Hub",
    description: "Онбординг для новачків: базові механіки, FAQ, ролі та стартові поради.",
    tags: ["Новачки", "FAQ", "Підтримка"],
    members: "1 290",
    online: "92",
    posts: "186",
    badge: "Нове"
  }
];

export default function GroupsCatalogPage() {
  return (
    <section className="mx-auto w-full max-w-[1050px] space-y-4">
      <header>
        <h1 className="text-2xl font-bold leading-none">Каталог груп</h1>
        <p className="mt-1 text-sm text-nebori-muted">Оберіть спільноту за інтересами та приєднуйтесь</p>
      </header>

      <div className="overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.08)]">
        <div className="divide-y divide-[rgba(255,255,255,0.08)]">
          {groups.map((group) => (
            <article
              key={group.id}
              className="grid grid-cols-[56px_76px_minmax(0,1fr)_120px] items-start gap-3 px-3 py-3 transition-colors hover:bg-[rgba(255,255,255,0.02)]"
            >
              <div className="space-y-2 text-center">
                <div className="rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#131a26] px-2 py-2 text-lg font-bold leading-none text-nebori-accent">
                  {group.rank}
                </div>
                <div className="rounded-[4px] border border-[rgba(255,255,255,0.14)] px-2 py-1 text-xs text-nebori-muted">UA</div>
              </div>

              <div className="overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.14)]">
                <img
                  src={`https://picsum.photos/seed/group-catalog-${group.id}/152/152`}
                  alt={group.name}
                  className="h-[76px] w-[76px] object-cover"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/groups/${group.id}`} className="text-[15px] font-semibold leading-5 text-[#e6e9f3] hover:text-nebori-accent">
                    {group.name}
                  </Link>
                  {group.badge && (
                    <span className="rounded-[3px] border border-[rgba(245,197,24,0.35)] bg-[rgba(245,197,24,0.12)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-nebori-accent">
                      {group.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-nebori-muted">{group.description}</p>
                <p className="mt-1 text-[12px] leading-4 text-nebori-muted">{group.tags.map((tag) => `#${tag}`).join(" ")}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] leading-4 text-nebori-muted">
                  <span>
                    <span className="text-nebori-accent">●</span> {group.members}
                  </span>
                  <span>
                    <span className="text-[#9fb3d9]">●</span> {group.online}
                  </span>
                  <span>
                    <span className="text-[#cbd2e2]">●</span> {group.posts}
                  </span>
                </div>
              </div>

              <div className="flex h-full items-center justify-end">
                <Link href={`/groups/${group.id}`} className="btn-primary rounded-[4px] px-3 py-1.5 text-sm font-semibold">
                  Вступити
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-end gap-1 border-t border-[rgba(255,255,255,0.08)] bg-[#0c1017] px-3 py-2 text-sm">
          <button className="btn-ghost rounded-[2px] px-2 py-0.5" type="button">
            {"<"}
          </button>
          <button className="text-nebori-muted hover:text-nebori-text" type="button">
            1
          </button>
          <button className="font-semibold text-nebori-accent" type="button">
            2
          </button>
          <button className="text-nebori-muted hover:text-nebori-text" type="button">
            3
          </button>
          <button className="text-nebori-muted hover:text-nebori-text" type="button">
            4
          </button>
          <span className="px-1 text-nebori-muted">...</span>
          <button className="text-nebori-muted hover:text-nebori-text" type="button">
            14
          </button>
          <button className="btn-ghost rounded-[2px] px-2 py-0.5" type="button">
            {">"}
          </button>
        </div>
      </div>
    </section>
  );
}
