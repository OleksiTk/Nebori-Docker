"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { VideoCard } from "@/components/video-card";
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

export function SubscriptionsPageContent({ videos }: SubscriptionsPageContentProps) {
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
    <section className="mx-auto w-full">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab, idx) => (
              <Link key={tab.label} href={tab.href} className={`rounded-sm border px-3 py-1.5 text-sm ${idx === 1 ? "btn-primary" : "btn-ghost"}`}>
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedChannel("all")}
            className={`rounded-[4px] border px-3 py-1 text-sm font-semibold transition ${
              selectedChannel === "all"
                ? "border-nebori-accent bg-[rgba(245,201,52,0.12)] text-[#e8edf9]"
                : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] text-nebori-muted hover:border-[rgba(255,255,255,0.22)] hover:text-nebori-text"
            }`}
          >
            Усі підписки <span className="ml-1 text-xs opacity-60">{channels.length}</span>
          </button>
          {channels.map((channel) => (
            <button
              key={channel.name}
              type="button"
              onClick={() => setSelectedChannel(channel.name)}
              className={`flex items-center gap-2 rounded-[4px] border px-2 py-1 text-sm font-semibold transition ${
                selectedChannel === channel.name
                  ? "border-nebori-accent bg-[rgba(245,201,52,0.12)] text-[#e8edf9]"
                  : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] text-nebori-muted hover:border-[rgba(255,255,255,0.22)] hover:text-nebori-text"
              }`}
            >
              <img src={channel.avatar} alt={channel.name} className="h-5 w-5 rounded-full object-cover" />
              {channel.name}
            </button>
          ))}
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
    </section>
  );
}
