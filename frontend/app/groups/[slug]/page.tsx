import Link from "next/link";
import { groupActivityPosts } from "@/data/mock";
import { GroupMembersBlock } from "@/components/group-members-block";
import { ProfileHoverCard } from "@/components/profile-hover-card";

const tabs = ["Головна", "Пости", "Відео", "Учасники"];

type PageProps = {
  params: Promise<{ slug: string }>;
};

type GroupMeta = {
  name: string;
  short: string;
  description: string;
  members: string;
  online: string;
  posts: string;
  tags: string[];
};

const groupMetaBySlug: Record<string, GroupMeta> = {
  "frontline-hub": {
    name: "Frontline Hub",
    short: "Координація рейдів та командних сесій",
    description: "Група для організації вечірніх рейдів, спільних тренувань та обговорення тактик.",
    members: "12 480",
    online: "840",
    posts: "1 320",
    tags: ["Рейди", "Тактика", "Команди", "Навчання"]
  },
  "raid-signals": {
    name: "Raid Signals",
    short: "LFG-спільнота для швидкого пошуку складу",
    description: "Збірка ролей, розклад матчів, голосові канали й внутрішні оголошення.",
    members: "8 910",
    online: "612",
    posts: "970",
    tags: ["LFG", "Голос", "Події", "Кооп"]
  },
  "market-watch": {
    name: "Market Watch",
    short: "Аналітика токенів та економіки платформи",
    description: "Розбір ринку, поради по активностях і щотижневі огляди змін після патчів.",
    members: "6 304",
    online: "421",
    posts: "714",
    tags: ["Економіка", "Токени", "Аналітика"]
  }
};

function LikeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-thumbs-up-icon lucide-thumbs-up h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      <path d="M7 10v12" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-messages-square-icon lucide-messages-square h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      <path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-share2-icon lucide-share-2 h-3.5 w-3.5"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

function slugifyName(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

export default async function GroupPage({ params }: PageProps) {
  const { slug } = await params;
  const memberProfiles = [
    { name: "Raptor", role: "Онлайн" },
    { name: "Mira", role: "Учасник" },
    { name: "ScoutLine", role: "Учасник" },
    { name: "IronBand", role: "Модератор" },
    { name: "TokenCrafter", role: "Учасник" },
    { name: "Aria", role: "Учасник" }
  ];

  const adminProfiles = [
    { name: "Nebori Team", role: "Адміністратор" },
    { name: "Raptor", role: "Адміністратор" },
    { name: "IronBand", role: "Модератор" }
  ];

  const meta =
    groupMetaBySlug[slug] ?? {
      name: slug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      short: "Офіційна сторінка спільноти в Nebori",
      description: "Публікації учасників, закріплені оновлення, обговорення та відео активності групи.",
      members: "4 200",
      online: "230",
      posts: "410",
      tags: ["Спільнота", "Оновлення", "Обговорення"]
    };

  const posts = groupActivityPosts.filter((post) => slugifyName(post.group) === slug);
  const renderedPosts = posts.length > 0 ? posts : groupActivityPosts.slice(0, 4);

  return (
    <section className="-mt-6 mx-auto w-full max-w-[1240px] space-y-4">
      <article className="mx-auto w-full max-w-[1050px] overflow-hidden rounded-b-[6px] border border-[rgba(255,255,255,0.1)] border-t-0 bg-nebori-panel">
        <div className="relative h-[150px] w-full border-b border-[rgba(255,255,255,0.08)] bg-black sm:h-[180px]">
          <img
            src={`https://picsum.photos/seed/group-cover-${slug}/1600/520`}
            alt={meta.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(9,12,18,0.22)] via-[rgba(9,12,18,0.32)] to-[rgba(9,12,18,0.72)]" />
        </div>

        <div className="p-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex min-w-0 items-end gap-3">
              <img
                src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(meta.name)}`}
                alt={meta.name}
                className="-mt-10 h-16 w-16 rounded-[4px] border border-[rgba(255,255,255,0.18)] bg-[#101621] object-cover"
              />
              <div className="min-w-0 pb-0.5">
                <h1 className="truncate text-xl font-bold leading-none text-[#e8ecf7] sm:text-2xl">{meta.name}</h1>
                <p className="mt-1 text-[13px] leading-5 text-nebori-muted">{meta.short}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-primary rounded-[4px] px-3 py-1.5 text-sm">
                Підписатися
              </button>
            </div>
          </div>

          <p className="mt-2 text-[13px] leading-5 text-nebori-muted">{meta.description}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[12px] text-nebori-muted">
            {meta.tags.map((tag) => (
              <span key={tag} className="rounded-[3px] border border-[rgba(255,255,255,0.14)] px-2 py-0.5">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      <nav className="mx-auto flex w-full max-w-[1050px] flex-wrap gap-2">
        {tabs.map((tab, idx) => (
          <button key={tab} className={`rounded-sm border px-3 py-1.5 text-sm ${idx === 0 ? "btn-primary" : "btn-ghost"}`} type="button">
            {tab}
          </button>
        ))}
      </nav>

      <div className="mx-auto grid w-full max-w-[1050px] grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="space-y-3">
          <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-2.5">
            <div className="flex items-start gap-3">
              <img src="https://i.pravatar.cc/80?img=2" alt="Ви" className="h-8 w-8 rounded-[3px] border border-[rgba(255,255,255,0.16)] object-cover" />
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  placeholder="Поділитися новиною у групі..."
                  className="w-full rounded-[4px] border border-[rgba(255,255,255,0.12)] bg-[#101621] px-2.5 py-1.5 text-sm text-nebori-text outline-none"
                />
                <div className="mt-2 flex flex-wrap justify-end gap-2">
                  <button className="btn-ghost rounded-[4px] px-2.5 py-1 text-xs" type="button">
                    Додати фото
                  </button>
                  <button className="btn-primary rounded-[4px] px-2.5 py-1 text-xs" type="button">
                    Опублікувати
                  </button>
                </div>
              </div>
            </div>
          </article>

          {renderedPosts.map((post) => (
            <article key={post.id} className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-2.5">
              <header className="flex items-start gap-3">
                <img
                  src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(post.group)}`}
                  alt={post.group}
                  className="h-8 w-8 rounded-[3px] border border-[rgba(255,255,255,0.16)] object-cover"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#d6dcec]">{post.group}</p>
                  <p className="text-[11px] leading-4 text-nebori-muted">
                    {post.author} • {post.time}
                  </p>
                </div>
              </header>

              <Link href={`/groups/activity/${post.id}`} className="mt-2 block text-base font-semibold leading-6 text-[#e6e9f3] hover:text-nebori-accent">
                {post.title}
              </Link>
              <p className="mt-1 text-sm leading-6 text-nebori-muted">{post.body}</p>

              <Link href={`/groups/activity/${post.id}`} className="relative mt-3 block h-[220px] overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-black lg:h-[260px]">
                <img
                  src={`https://picsum.photos/seed/group-post-${post.id}/980/540`}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-md"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/25" />
                <img
                  src={`https://picsum.photos/seed/group-post-${post.id}/980/540`}
                  alt={post.title}
                  className="relative z-10 h-full w-full object-contain"
                  loading="lazy"
                />
              </Link>

              <footer className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <button className="btn-ghost inline-flex items-center gap-1.5 rounded-[4px] px-2 py-1" type="button">
                  <LikeIcon />
                  {20 + Number(post.id.slice(1))}
                </button>
                <button className="btn-ghost inline-flex items-center gap-1.5 rounded-[4px] px-2 py-1" type="button">
                  <CommentIcon />
                  {8 + Number(post.id.slice(1))}
                </button>
                <button className="btn-ghost inline-flex items-center gap-1.5 rounded-[4px] px-2 py-1" type="button">
                  <ShareIcon />
                  Поділитися
                </button>
              </footer>
            </article>
          ))}
        </div>

        <aside className="space-y-3">
          <section className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
            <h2 className="mb-2 text-[15px] font-semibold leading-5 text-[#e6e9f3]">Інформація</h2>
            <ul className="space-y-1.5 text-[12px] leading-5 text-nebori-muted">
              <li>Учасників: {meta.members}</li>
              <li>Онлайн: {meta.online}</li>
              <li>Постів: {meta.posts}</li>
              <li>Мова: Українська</li>
            </ul>
          </section>

          <section className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-[15px] font-semibold leading-5 text-[#e6e9f3]">Адміністратори</h2>
            </div>
            <div className="space-y-2">
              {adminProfiles.map((admin, idx) => {
                const handle = admin.name.toLowerCase().replace(/\s+/g, "_");
                return (
                  <div key={`admin-${admin.name}`} className="flex items-center gap-2">
                    <ProfileHoverCard
                      handle={handle}
                      name={admin.name}
                      avatar={`https://i.pravatar.cc/64?img=${idx + 41}`}
                      videosCount={20 + idx}
                      groupsCount={3}
                      subscribers={`${2 + idx}.1 тис.`}
                      status={admin.role}
                    >
                      <Link href={`/profile/${handle}`} className="block">
                        <img
                          src={`https://i.pravatar.cc/64?img=${idx + 41}`}
                          alt={admin.name}
                          className="h-9 w-9 rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                          loading="lazy"
                        />
                      </Link>
                    </ProfileHoverCard>
                    <div className="min-w-0">
                      <ProfileHoverCard
                        handle={handle}
                        name={admin.name}
                        avatar={`https://i.pravatar.cc/64?img=${idx + 41}`}
                        videosCount={20 + idx}
                        groupsCount={3}
                        subscribers={`${2 + idx}.1 тис.`}
                        status={admin.role}
                      >
                        <Link href={`/profile/${handle}`} className="block truncate text-sm font-semibold text-[#c6d4df] hover:text-nebori-accent">
                          {admin.name}
                        </Link>
                      </ProfileHoverCard>
                      <p className="text-xs text-nebori-muted">{admin.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <GroupMembersBlock members={memberProfiles} />

          <section className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
            <h2 className="mb-2 text-[15px] font-semibold leading-5 text-[#e6e9f3]">Посилання</h2>
            <div className="divide-y divide-[rgba(255,255,255,0.08)]">
              <a
                href="https://discord.gg/nebori-frontline"
                target="_blank"
                rel="noreferrer"
                className="block py-2 hover:text-nebori-accent"
              >
                <p className="mb-1 text-[11px] uppercase tracking-[0.04em] text-nebori-muted">Голосовий сервер</p>
                <div className="flex items-center gap-2">
                  <img
                    src="https://www.google.com/s2/favicons?sz=64&domain=discord.com"
                    alt="Discord"
                    className="h-4 w-4 rounded-[2px]"
                    loading="lazy"
                  />
                  <span className="truncate text-[12px] text-[#d8dfed]">discord.gg/nebori-frontline</span>
                </div>
              </a>

              <a
                href="https://forum.nebori.gg/frontline"
                target="_blank"
                rel="noreferrer"
                className="block py-2 hover:text-nebori-accent"
              >
                <p className="mb-1 text-[11px] uppercase tracking-[0.04em] text-nebori-muted">Форум групи</p>
                <div className="flex items-center gap-2">
                  <img
                    src="https://www.google.com/s2/favicons?sz=64&domain=nebori.gg"
                    alt="Nebori"
                    className="h-4 w-4 rounded-[2px]"
                    loading="lazy"
                  />
                  <span className="truncate text-[12px] text-[#d8dfed]">forum.nebori.gg/frontline</span>
                </div>
              </a>

              <a
                href="samp://play.nebori.gg:7777"
                className="block py-2 hover:text-nebori-accent"
              >
                <p className="mb-1 text-[11px] uppercase tracking-[0.04em] text-nebori-muted">SAMP сервер</p>
                <div className="flex items-center gap-2">
                  <img
                    src="https://www.google.com/s2/favicons?sz=64&domain=samp.com"
                    alt="SAMP"
                    className="h-4 w-4 rounded-[2px]"
                    loading="lazy"
                  />
                  <span className="truncate text-[12px] text-[#d8dfed]">play.nebori.gg:7777</span>
                </div>
              </a>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}



