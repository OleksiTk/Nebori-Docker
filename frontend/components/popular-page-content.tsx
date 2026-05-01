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

function CategoryList({
  categories,
  selected,
  onSelect,
  onClose
}: {
  categories: CategoryItem[];
  selected: string;
  onSelect: (value: string) => void;
  onClose?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      {categories.map((category) => (
        <button
          key={category.name}
          type="button"
          onClick={() => {
            onSelect(category.name);
            onClose?.();
          }}
          className={`flex w-full items-center justify-between rounded-[4px] border px-2 py-1.5 text-left transition ${
            selected === category.name
              ? "border-nebori-accent bg-[rgba(245,201,52,0.12)] text-[#e8edf9]"
              : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] text-nebori-muted hover:border-[rgba(255,255,255,0.22)] hover:text-nebori-text"
          }`}
        >
          <span className="text-sm font-semibold">{category.name}</span>
          <span className="text-xs opacity-80">{category.count}</span>
        </button>
      ))}
    </div>
  );
}

export function PopularPageContent({ videos }: PopularPageContentProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
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
    <section className={`mx-auto grid w-full grid-cols-1 gap-4 ${sidebarCollapsed ? "lg:grid-cols-1" : "lg:grid-cols-[minmax(0,1fr)_minmax(280px,22vw)]"}`}>
      <div className="min-w-0 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab, idx) => (
              <Link key={tab.label} href={tab.href} className={`rounded-sm border px-3 py-1.5 text-sm ${idx === 2 ? "btn-primary" : "btn-ghost"}`}>
                {tab.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOverlayOpen(true)}
              className="rounded-[3px] border border-[rgba(255,255,255,0.18)] bg-[#151b28] px-2.5 py-1.5 text-xs text-nebori-muted hover:text-nebori-accent lg:hidden"
              aria-label="Відкрити список категорій"
            >
              ☰ Категорії
            </button>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((value) => !value)}
              className="hidden rounded-[3px] border border-[rgba(255,255,255,0.18)] bg-[#151b28] px-2.5 py-1.5 text-xs text-nebori-muted hover:text-nebori-accent lg:block"
            >
              {sidebarCollapsed ? "Показати категорії" : "Згорнути категорії"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-nebori-muted">
          <span>Категорія:</span>
          <span className="rounded-[4px] border border-[rgba(255,255,255,0.16)] px-2 py-1 text-[#e6e9f3]">{selectedCategory}</span>
        </div>

        {filteredVideos.length > 0 ? (
          <div
            className={`grid grid-cols-1 gap-1.5 ${
              sidebarCollapsed ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            }`}
          >
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

      {!sidebarCollapsed && (
        <aside className="hidden min-w-0 overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3 lg:sticky lg:top-[84px] lg:block lg:self-start">
          <div className="mb-4">
            <h2 className="text-[22px] leading-none text-[#aeb7c8]">КАТЕГОРІЇ</h2>
            <p className="mt-1 text-xs text-nebori-muted">Загальні теми для популярних відео</p>
          </div>
          <div className="max-h-[calc(100vh-150px)] overflow-y-hidden pr-1 hover:overflow-y-auto">
            <CategoryList categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
        </aside>
      )}

      {overlayOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setOverlayOpen(false)}
            className="absolute inset-0 bg-black/65"
            aria-label="Закрити список категорій"
          />
          <aside className="absolute right-0 top-0 h-full w-[360px] max-w-[92vw] overflow-hidden border-l border-[rgba(255,255,255,0.14)] bg-[#0f131b] p-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[20px] leading-none text-[#aeb7c8]">КАТЕГОРІЇ</h2>
              <button
                type="button"
                onClick={() => setOverlayOpen(false)}
                className="rounded-[3px] border border-[rgba(255,255,255,0.18)] bg-[#151b28] px-2 py-1 text-xs text-nebori-muted hover:text-nebori-accent"
              >
                Закрити
              </button>
            </div>
            <div className="max-h-[calc(100vh-96px)] overflow-y-auto pr-1">
              <CategoryList categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} onClose={() => setOverlayOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

