"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { VideoCard } from "@/components/video-card";
import { ProfileHoverCard } from "@/components/profile-hover-card";
import type { VideoItem } from "@/data/mock";

type SubscriptionsPageContentProps = {
  videos: VideoItem[];
};

type Channel = {
  name: string;
  handle: string;
  avatar: string;
  videosCount: number;
};

const tabs = [
  { label: "Для вас", href: "/" },
  { label: "Підписки", href: "/subscriptions" },
  { label: "Популярне", href: "/popular" }
];

const subscribedChannelNames = [
  "Nebori Team",
  "IronBand",
  "TokenCrafter",
  "ScoutLine",
  "Raid Signals",
  "Frontline Hub",
  "Community Hub",
  "DeltaNox"
];

function buildChannels(videos: VideoItem[]): Channel[] {
  return subscribedChannelNames
    .map((name) => {
      const videosCount = videos.filter((item) => item.author === name).length;
      return {
        name,
        handle: name.toLowerCase().replace(/\s+/g, "_"),
        avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(name)}`,
        videosCount
      };
    })
    .filter((channel) => channel.videosCount > 0);
}

function ChannelList({
  channels,
  selected,
  onSelect,
  onClose
}: {
  channels: Channel[];
  selected: string;
  onSelect: (value: string) => void;
  onClose?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => {
          onSelect("all");
          onClose?.();
        }}
        className={`flex w-full items-center justify-between rounded-[4px] border px-2 py-1.5 text-left transition ${
          selected === "all"
            ? "border-nebori-accent bg-[rgba(245,201,52,0.12)] text-[#e8edf9]"
            : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] text-nebori-muted hover:border-[rgba(255,255,255,0.22)] hover:text-nebori-text"
        }`}
      >
        <span className="text-sm font-semibold">Усі підписки</span>
        <span className="text-xs opacity-80">{channels.length}</span>
      </button>

      {channels.map((channel) => (
        <button
          key={channel.name}
          type="button"
          onClick={() => {
            onSelect(channel.name);
            onClose?.();
          }}
          className={`flex w-full items-center gap-2 rounded-[4px] border px-2 py-1.5 text-left transition ${
            selected === channel.name
              ? "border-nebori-accent bg-[rgba(245,201,52,0.12)]"
              : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.22)]"
          }`}
        >
          <ProfileHoverCard
            handle={channel.handle}
            name={channel.name}
            avatar={channel.avatar}
            videosCount={channel.videosCount}
            groupsCount={2}
            subscribers={`${channel.videosCount * 7} тис.`}
          >
            <span className="block">
              <img
                src={channel.avatar}
                alt={channel.name}
                className="h-9 w-9 rounded-[3px] border border-[rgba(255,255,255,0.18)] object-cover"
                loading="lazy"
              />
            </span>
          </ProfileHoverCard>

          <div className="min-w-0">
            <ProfileHoverCard
              handle={channel.handle}
              name={channel.name}
              avatar={channel.avatar}
              videosCount={channel.videosCount}
              groupsCount={2}
              subscribers={`${channel.videosCount * 7} тис.`}
            >
              <span className="block truncate text-sm font-semibold text-[#d6dcec]">{channel.name}</span>
            </ProfileHoverCard>
            <p className="text-xs text-nebori-muted">{channel.videosCount} відео</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export function SubscriptionsPageContent({ videos }: SubscriptionsPageContentProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>("all");

  const channels = useMemo(() => buildChannels(videos), [videos]);
  const subscribedSet = useMemo(() => new Set(channels.map((channel) => channel.name)), [channels]);

  const filteredVideos = useMemo(() => {
    const subscribedVideos = videos.filter((item) => subscribedSet.has(item.author));
    if (selectedChannel === "all") {
      return subscribedVideos;
    }
    return subscribedVideos.filter((item) => item.author === selectedChannel);
  }, [videos, subscribedSet, selectedChannel]);

  return (
    <section className={`mx-auto grid w-full grid-cols-1 gap-4 ${sidebarCollapsed ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_minmax(280px,22vw)]"}`}>
      <div className="min-w-0 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab, idx) => (
              <Link key={tab.label} href={tab.href} className={`rounded-sm border px-3 py-1.5 text-sm ${idx === 1 ? "btn-primary" : "btn-ghost"}`}>
                {tab.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOverlayOpen(true)}
              className="rounded-[3px] border border-[rgba(255,255,255,0.18)] bg-[#151b28] px-2.5 py-1.5 text-xs text-nebori-muted hover:text-nebori-accent lg:hidden"
              aria-label="Відкрити список підписок"
            >
              ☰ Канали
            </button>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="hidden rounded-[3px] border border-[rgba(255,255,255,0.18)] bg-[#151b28] px-2.5 py-1.5 text-xs text-nebori-muted hover:text-nebori-accent lg:block"
            >
              {sidebarCollapsed ? "Показати канали" : "Згорнути канали"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-nebori-muted">
          <span>Фільтр:</span>
          <span className="rounded-[4px] border border-[rgba(255,255,255,0.16)] px-2 py-1 text-[#e6e9f3]">
            {selectedChannel === "all" ? "Усі підписки" : selectedChannel}
          </span>
        </div>

        {filteredVideos.length > 0 ? (
          <div
            className={`grid grid-cols-1 gap-1.5 ${
              sidebarCollapsed ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            }`}
          >
            {filteredVideos.map((item, index) => (
              <VideoCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-[6px] border border-[rgba(255,255,255,0.14)] bg-nebori-panel p-4 text-sm text-nebori-muted">
            Немає відео для цього каналу.
          </div>
        )}
      </div>

      {!sidebarCollapsed && (
        <aside className="hidden min-w-0 overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3 lg:sticky lg:top-[84px] lg:block lg:self-start">
          <div className="mb-4">
            <h2 className="text-[22px] leading-none text-[#aeb7c8]">ВАШІ ПІДПИСКИ</h2>
            <p className="mt-1 text-xs text-nebori-muted">Натисніть канал, щоб відфільтрувати стрічку</p>
          </div>
          <div className="max-h-[calc(100vh-150px)] overflow-y-hidden pr-1 hover:overflow-y-auto">
            <ChannelList channels={channels} selected={selectedChannel} onSelect={setSelectedChannel} />
          </div>
        </aside>
      )}

      {overlayOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setOverlayOpen(false)}
            className="absolute inset-0 bg-black/65"
            aria-label="Закрити список підписок"
          />
          <aside className="absolute right-0 top-0 h-full w-[360px] max-w-[92vw] overflow-hidden border-l border-[rgba(255,255,255,0.14)] bg-[#0f131b] p-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[20px] leading-none text-[#aeb7c8]">ВАШІ ПІДПИСКИ</h2>
              <button
                type="button"
                onClick={() => setOverlayOpen(false)}
                className="rounded-[3px] border border-[rgba(255,255,255,0.18)] bg-[#151b28] px-2 py-1 text-xs text-nebori-muted hover:text-nebori-accent"
              >
                Закрити
              </button>
            </div>
            <div className="max-h-[calc(100vh-96px)] overflow-y-auto pr-1">
              <ChannelList channels={channels} selected={selectedChannel} onSelect={setSelectedChannel} onClose={() => setOverlayOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
