"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { VideoCard } from "@/components/video-card";
import type { VideoItem } from "@/data/mock";

type PopularPageContentProps = {
  videos: VideoItem[];
};

type CategoryItem = {
  name: string;
  count: number;
};

const tabs = [
  { label: "Для вас", href: "/" },
  { label: "Підписки", href: "/subscriptions" },
  { label: "Популярне", href: "/popular" }
];

const categoryOrder = ["Усі", "Ігри", "Аніме", "Технології", "Кіно", "Музика", "Освіта", "Кіберспорт"];

const tagToCategory: Record<string, string> = {
  guide: "Ігри",
  tokens: "Ігри",
  newbies: "Ігри",
  map: "Ігри",
  build: "Ігри",
  pvp: "Ігри",
  clan: "Ігри",
  raids: "Ігри",
  settings: "Ігри",
  fps: "Ігри",
  lore: "Аніме",
  story: "Аніме",
  devlog: "Технології",
  news: "Технології",
  patch: "Технології",
  platform: "Технології",
  ui: "Технології",
  trailer: "Кіно",
  season: "Кіно",
  highlights: "Кіно",
  community: "Музика",
  clips: "Музика",
  creator: "Освіта",
  growth: "Освіта",
  achievements: "Освіта",
  tips: "Освіта",
  esports: "Кіберспорт",
  tactics: "Кіберспорт",
  teamplay: "Кіберспорт",
  ranking: "Кіберспорт"
};

function resolveCategory(item: VideoItem): string {
  for (const tag of item.tags) {
    const category = tagToCategory[tag];
    if (category) {
      return category;
    }
  }
  return "Ігри";
}

function parseViewsToScore(value: string): number {
  const match = value.match(/[\d]+([.,]\d+)?/);
  if (!match) {
    return 0;
  }
  const numeric = Number.parseFloat(match[0].replace(",", "."));
  const isThousands = value.includes("тис") || value.includes("С‚РёСЃ");
  return Math.round(numeric * (isThousands ? 1000 : 1));
}

export function PopularPageContent({ videos }: PopularPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Усі");

  const sortedVideos = useMemo(
    () =>
      [...videos]
        .map((video) => ({ ...video, category: resolveCategory(video), score: parseViewsToScore(video.views) }))
        .sort((a, b) => b.score - a.score),
    [videos]
  );

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const name of categoryOrder) {
      counts.set(name, 0);
    }
    counts.set("Усі", sortedVideos.length);
    for (const video of sortedVideos) {
      counts.set(video.category, (counts.get(video.category) ?? 0) + 1);
    }
    return categoryOrder.map((name) => ({ name, count: counts.get(name) ?? 0 }));
  }, [sortedVideos]);

  const filteredVideos = useMemo(() => {
    if (selectedCategory === "Усі") {
      return sortedVideos;
    }
    return sortedVideos.filter((video) => video.category === selectedCategory);
  }, [sortedVideos, selectedCategory]);

  return (
    <section className="mx-auto w-full">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab, idx) => (
              <Link key={tab.label} href={tab.href} className={`rounded-sm border px-3 py-1.5 text-sm ${idx === 2 ? "btn-primary" : "btn-ghost"}`}>
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => setSelectedCategory(category.name)}
              className={`rounded-[4px] border px-3 py-1 text-sm font-semibold transition ${
                selectedCategory === category.name
                  ? "border-nebori-accent bg-[rgba(245,201,52,0.12)] text-[#e8edf9]"
                  : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] text-nebori-muted hover:border-[rgba(255,255,255,0.22)] hover:text-nebori-text"
              }`}
            >
              {category.name} <span className="ml-1 text-xs opacity-60">{category.count}</span>
            </button>
          ))}
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {filteredVideos.map((item, index) => (
              <VideoCard key={item.id} item={item} index={index} rank={index + 1} />
            ))}
          </div>
        ) : (
          <div className="rounded-[6px] border border-[rgba(255,255,255,0.14)] bg-nebori-panel p-4 text-sm text-nebori-muted">
            У цій категорії поки немає відео.
          </div>
        )}
      </div>
    </section>
  );
}

