import Link from "next/link";
import { type ReactNode } from "react";
import { ChannelCommunityBlocks } from "@/components/channel-community-blocks";

type ActiveTab = "overview" | "videos" | "playlists" | "activity";

type ChannelProfileShellProps = {
  handle: string;
  displayName: string;
  activeTab: ActiveTab;
  hideSidebarOnMobile?: boolean;
  children: ReactNode;
};

const badgeShowcase = ["Перші 1000 переглядів", "Активний коментатор", "Командний гравець", "Топ автор тижня"];

const channelFriends = [
  { name: "Raptor", href: "/profile/raptor", role: "Спільний рейдер" },
  { name: "Mira", href: "/profile/mira", role: "Ко-автор гайдів" },
  { name: "ScoutLine", href: "/profile/scoutline", role: "Тестер патчів" },
  { name: "TokenCrafter", href: "/profile/tokencrafter", role: "Партнер каналу" },
  { name: "IronBand", href: "/profile/ironband", role: "Гість ефірів" },
  { name: "DeltaNox", href: "/profile/deltanox", role: "Модератор чату" }
];

function tabClass(active: boolean) {
  return active ? "btn-primary rounded-sm border px-3 py-1.5 text-sm" : "btn-ghost rounded-sm border px-3 py-1.5 text-sm";
}

export function ChannelProfileShell({ handle, displayName, activeTab, hideSidebarOnMobile = false, children }: ChannelProfileShellProps) {
  const isOwnProfile = handle === "nebori_user";

  const communityFriends = channelFriends.map((friend) => ({
    ...friend,
    avatar: `https://i.pravatar.cc/72?u=${encodeURIComponent(friend.name)}`
  }));

  return (
    <section className="mx-auto w-full max-w-[1240px] space-y-4 sm:-mt-6">
      <article className="mx-auto w-full max-w-[1050px] overflow-hidden rounded-b-[6px] border border-[rgba(255,255,255,0.1)] border-t-0 bg-nebori-panel">
        <div className="relative h-[150px] border-b border-[rgba(255,255,255,0.08)] bg-black sm:h-[180px]">
          <img
            src={`https://picsum.photos/seed/profile-cover-${encodeURIComponent(handle)}/1600/520`}
            alt={`${displayName} cover`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(9,12,18,0.22)] via-[rgba(9,12,18,0.32)] to-[rgba(9,12,18,0.72)]" />
        </div>

        <div className="p-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex min-w-0 items-end gap-3">
              <img
                src={`https://i.pravatar.cc/160?u=${encodeURIComponent(handle)}`}
                alt={displayName}
                className="relative z-10 -mt-6 h-16 w-16 rounded-[4px] border border-[rgba(255,255,255,0.18)] bg-[#101621] object-cover sm:-mt-10"
              />
              <div className="min-w-0 pb-0.5">
                <h1 className="truncate text-xl font-bold leading-none text-[#e8ecf7] sm:text-2xl">{displayName}</h1>
                <p className="mt-1 text-[13px] leading-5 text-nebori-muted">@{handle}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isOwnProfile ? (
                <>
                  <Link href="/settings" className="btn-ghost rounded-[4px] px-3 py-1.5 text-sm">
                    Керувати каналом
                  </Link>
                  <Link href="/studio" className="btn-primary rounded-[4px] px-3 py-1.5 text-sm">
                    Студія
                  </Link>
                </>
              ) : (
                <>
                  <button type="button" className="btn-primary rounded-[4px] px-3 py-1.5 text-sm">
                    Підписатися
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="mt-2 text-[13px] leading-5 text-nebori-muted">Канал з гайдами, патч-розборами та щотижневими добірками.</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[12px] text-nebori-muted">
            <span className="rounded-[3px] border border-[rgba(255,255,255,0.14)] px-2 py-0.5">Підписники: 6.1 тис.</span>
            <span className="rounded-[3px] border border-[rgba(255,255,255,0.14)] px-2 py-0.5">Відео: 48</span>
            <span className="rounded-[3px] border border-[rgba(255,255,255,0.14)] px-2 py-0.5">Перегляди: 1.4 млн</span>
            <span className="rounded-[3px] border border-[rgba(255,255,255,0.14)] px-2 py-0.5">Дата: березень 2024</span>
          </div>
        </div>
      </article>

      <nav className="mx-auto flex w-full max-w-[1050px] flex-wrap gap-2">
        <Link href={`/profile/${handle}`} className={tabClass(activeTab === "overview")}>
          Огляд
        </Link>
        <Link href={`/profile/${handle}/videos`} className={tabClass(activeTab === "videos")}>
          Відео каналу
        </Link>
        <Link href={`/profile/${handle}/playlists`} className={tabClass(activeTab === "playlists")}>
          Плейлисти каналу
        </Link>
        <Link href={`/profile/${handle}/activity`} className={tabClass(activeTab === "activity")}>
          Активність каналу
        </Link>
      </nav>

      <div className="mx-auto grid w-full max-w-[1050px] grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
        <aside className={`order-1 space-y-3 lg:order-2 ${hideSidebarOnMobile ? "hidden lg:block" : ""}`}>
          <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
            <h2 className="mb-2 text-[15px] font-semibold leading-5 text-[#e6e9f3]">Про канал</h2>
            <div className="space-y-2 text-sm text-[#d5ddee]">
              <p>Канал про тактику, розбір патчів і практичні гайди по Nebori. Нові відео виходять 3-4 рази на тиждень.</p>
              <ul className="space-y-1 text-nebori-muted">
                <li>Мова контенту: українська</li>
                <li>Категорія: ігри / ком'юніті</li>
                <li>Контакт: collab@nebori.dev</li>
              </ul>
            </div>
          </article>

          <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
            <h2 className="mb-2 text-[15px] font-semibold leading-5 text-[#e6e9f3]">Вітрина ачивок</h2>
            <div className="flex flex-wrap gap-1.5">
              {badgeShowcase.map((badge) => (
                <span
                  key={badge}
                  className="rounded-[4px] border border-[rgba(245,201,52,0.28)] bg-[rgba(245,201,52,0.08)] px-2 py-1 text-xs font-semibold text-[#f4d66c]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </article>

          <ChannelCommunityBlocks friends={communityFriends} />
        </aside>

        <div className="order-2 min-w-0 space-y-3 lg:order-1">{children}</div>
      </div>
    </section>
  );
}
