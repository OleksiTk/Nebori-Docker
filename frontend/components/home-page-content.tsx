"use client";

import { useState } from "react";
import Link from "next/link";
import { VideoCard } from "@/components/video-card";
import { ProfileHoverCard } from "@/components/profile-hover-card";
import type { VideoItem } from "@/data/mock";

type HomePageContentProps = {
  videos: VideoItem[];
  activity: string[];
};

const tabs = [
  { label: "\u0414\u043b\u044f \u0432\u0430\u0441", href: "/" },
  { label: "\u041f\u0456\u0434\u043f\u0438\u0441\u043a\u0438", href: "/subscriptions" },
  { label: "\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u0435", href: "/popular" }
];

const groupPosts = [
  "Frontline Hub: \u0441\u0442\u0430\u0440\u0442\u0443\u0454 \u0437\u0431\u0456\u0440 \u043d\u0430 \u0432\u0435\u0447\u0456\u0440\u043d\u0456\u0439 \u0440\u0435\u0439\u0434 \u043e 21:30",
  "Raid Signals: \u043e\u043d\u043e\u0432\u043b\u0435\u043d\u043e \u0441\u043f\u0438\u0441\u043e\u043a \u0440\u043e\u043b\u0435\u0439 \u0434\u043b\u044f \u043d\u043e\u0432\u0430\u0447\u043a\u0456\u0432",
  "Market Watch: \u043d\u043e\u0432\u0438\u0439 \u043f\u043e\u0441\u0442 \u043f\u0440\u043e \u0431\u0430\u043b\u0430\u043d\u0441 \u0442\u043e\u043a\u0435\u043d\u0456\u0432 \u043f\u0456\u0441\u043b\u044f \u043f\u0430\u0442\u0447\u0443",
  "Lore Keepers: \u043e\u043f\u0443\u0431\u043b\u0456\u043a\u043e\u0432\u0430\u043d\u043e \u0442\u0435\u043e\u0440\u0456\u044e \u043f\u043e \u043b\u043e\u0440\u0443 \u0441\u0435\u0437\u043e\u043d\u0443 12"
];

function SidebarItem({
  title,
  date,
  time,
  author
}: {
  title: string;
  date: string;
  time: string;
  author: string;
}) {
  const handle = author.toLowerCase().replace(/\s+/g, "_");
  return (
    <article className="rounded-[3px] px-1 py-1 hover:bg-[rgba(255,255,255,0.04)]">
      <p className="line-clamp-2 text-[14px] leading-5 text-[#d6dceb]">{title}</p>
      <div className="mt-0.5 text-[12px] text-nebori-muted">
        {date}, {time} {"\u2022"}{" "}
        <ProfileHoverCard
          handle={handle}
          name={author}
          avatar={`https://i.pravatar.cc/72?u=${encodeURIComponent(author)}`}
          videosCount={18}
          groupsCount={2}
          subscribers={`6.1 ${"\u0442\u0438\u0441."}`}
        >
          <Link href={`/profile/${handle}`} className="cursor-pointer text-nebori-accent hover:underline">
            {author}
          </Link>
        </ProfileHoverCard>
      </div>
    </article>
  );
}

export function HomePageContent({ videos, activity }: HomePageContentProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const friendRows = activity.map((item, idx) => ({
    title: item,
    date: "11.02.26",
    time: `0${(idx + 2) % 10}:0${idx + 3}`,
    author: ["Nebori User", "ScoutLine", "IronBand", "Mira", "Raptor"][idx % 5]
  }));

  const groupRows = groupPosts.map((item, idx) => ({
    title: item,
    date: "12.02.26",
    time: `1${idx}:1${idx}`,
    author: ["Frontline Hub", "Raid Signals", "Market Watch", "Lore Keepers"][idx]
  }));

  return (
    <section className={`mx-auto grid w-full grid-cols-1 gap-4 ${sidebarCollapsed ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_minmax(280px,22vw)]"}`}>
      <div className="min-w-0 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab, idx) => (
              <Link key={tab.label} href={tab.href} className={`rounded-sm border px-3 py-1.5 text-sm ${idx === 0 ? "btn-primary" : "btn-ghost"}`}>
                {tab.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOverlayOpen(true)}
              className="rounded-[3px] border border-[rgba(255,255,255,0.18)] bg-[#151b28] px-2.5 py-1.5 text-xs text-nebori-muted hover:text-nebori-accent lg:hidden"
              aria-label="\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u0441\u0442\u0440\u0456\u0447\u043a\u0443 \u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u0456"
            >
              {"\u2630"}{" "}
              {"\u0421\u0442\u0440\u0456\u0447\u043a\u0430"}
            </button>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="hidden rounded-[3px] border border-[rgba(255,255,255,0.18)] bg-[#151b28] px-2.5 py-1.5 text-xs text-nebori-muted hover:text-nebori-accent lg:block"
            >
              {sidebarCollapsed
                ? "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u0438 \u0441\u0442\u0440\u0456\u0447\u043a\u0443"
                : "\u0417\u0433\u043e\u0440\u043d\u0443\u0442\u0438 \u0441\u0442\u0440\u0456\u0447\u043a\u0443"}
            </button>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 gap-1.5 ${
            sidebarCollapsed ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          }`}
        >
          {videos.map((item, index) => (
            <VideoCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>

      {!sidebarCollapsed && (
        <aside className="hidden min-w-0 overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3 lg:sticky lg:top-[84px] lg:block lg:self-start">
          <div className="mb-4">
            <h2 className="text-[22px] leading-none text-[#aeb7c8]">
              {"\u0410\u041a\u0422\u0418\u0412\u041d\u0406\u0421\u0422\u042c \u0421\u041f\u0406\u041b\u042c\u041d\u041e\u0422\u0418"}
            </h2>
          </div>
          <div className="max-h-[calc(100vh-150px)] overflow-y-hidden pr-1 hover:overflow-y-auto">
            <div className="mb-4">
              <div className="mb-2 border-b border-[rgba(255,255,255,0.08)] pb-2 text-sm text-[#cfd6e6]">
                {"\u0410\u043a\u0442\u0438\u0432\u043d\u0456\u0441\u0442\u044c \u0434\u0440\u0443\u0437\u0456\u0432"}
              </div>
              <div className="space-y-0.5">
                {friendRows.map((row, idx) => (
                  <SidebarItem key={`friend-${row.title}-${idx}`} title={row.title} date={row.date} time={row.time} author={row.author} />
                ))}
              </div>
              <Link href="/activity" className="mt-1 inline-block text-xs text-nebori-accent hover:underline">
                {"\u0412\u0441\u044f \u0430\u043a\u0442\u0438\u0432\u043d\u0456\u0441\u0442\u044c \u0434\u0440\u0443\u0437\u0456\u0432 \u2192"}
              </Link>
            </div>

            <div>
              <div className="mb-2 border-b border-[rgba(255,255,255,0.08)] pb-2 text-sm text-[#cfd6e6]">
                {"\u0410\u043a\u0442\u0438\u0432\u043d\u0456\u0441\u0442\u044c \u0433\u0440\u0443\u043f"}
              </div>
              <div className="space-y-0.5">
                {groupRows.map((row, idx) => (
                  <SidebarItem key={`group-${row.title}-${idx}`} title={row.title} date={row.date} time={row.time} author={row.author} />
                ))}
              </div>
              <Link href="/groups/activity" className="mt-1 inline-block text-xs text-nebori-accent hover:underline">
                {"\u0412\u0441\u044f \u0430\u043a\u0442\u0438\u0432\u043d\u0456\u0441\u0442\u044c \u0433\u0440\u0443\u043f \u2192"}
              </Link>
            </div>
          </div>
        </aside>
      )}

      {overlayOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setOverlayOpen(false)}
            className="absolute inset-0 bg-black/65"
            aria-label="\u0417\u0430\u043a\u0440\u0438\u0442\u0438 \u0441\u0442\u0440\u0456\u0447\u043a\u0443"
          />
          <aside className="absolute right-0 top-0 h-full w-[360px] max-w-[92vw] overflow-hidden border-l border-[rgba(255,255,255,0.14)] bg-[#0f131b] p-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[20px] leading-none text-[#aeb7c8]">
                {"\u0410\u041a\u0422\u0418\u0412\u041d\u0406\u0421\u0422\u042c \u0421\u041f\u0406\u041b\u042c\u041d\u041e\u0422\u0418"}
              </h2>
              <button
                type="button"
                onClick={() => setOverlayOpen(false)}
                className="rounded-[3px] border border-[rgba(255,255,255,0.18)] bg-[#151b28] px-2 py-1 text-xs text-nebori-muted hover:text-nebori-accent"
              >
                {"\u0417\u0430\u043a\u0440\u0438\u0442\u0438"}
              </button>
            </div>

            <div className="max-h-[calc(100vh-96px)] overflow-y-auto pr-1">
              <div className="mb-4">
                <div className="mb-2 border-b border-[rgba(255,255,255,0.08)] pb-2 text-sm text-[#cfd6e6]">
                  {"\u0410\u043a\u0442\u0438\u0432\u043d\u0456\u0441\u0442\u044c \u0434\u0440\u0443\u0437\u0456\u0432"}
                </div>
                <div className="space-y-0.5">
                  {friendRows.map((row, idx) => (
                    <SidebarItem key={`m-friend-${row.title}-${idx}`} title={row.title} date={row.date} time={row.time} author={row.author} />
                  ))}
                </div>
                <Link href="/activity" onClick={() => setOverlayOpen(false)} className="mt-1 inline-block text-xs text-nebori-accent hover:underline">
                  {"\u0412\u0441\u044f \u0430\u043a\u0442\u0438\u0432\u043d\u0456\u0441\u0442\u044c \u0434\u0440\u0443\u0437\u0456\u0432 \u2192"}
                </Link>
              </div>

              <div>
                <div className="mb-2 border-b border-[rgba(255,255,255,0.08)] pb-2 text-sm text-[#cfd6e6]">
                  {"\u0410\u043a\u0442\u0438\u0432\u043d\u0456\u0441\u0442\u044c \u0433\u0440\u0443\u043f"}
                </div>
                <div className="space-y-0.5">
                  {groupRows.map((row, idx) => (
                    <SidebarItem key={`m-group-${row.title}-${idx}`} title={row.title} date={row.date} time={row.time} author={row.author} />
                  ))}
                </div>
                <Link href="/groups/activity" onClick={() => setOverlayOpen(false)} className="mt-1 inline-block text-xs text-nebori-accent hover:underline">
                  {"\u0412\u0441\u044f \u0430\u043a\u0442\u0438\u0432\u043d\u0456\u0441\u0442\u044c \u0433\u0440\u0443\u043f \u2192"}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}


