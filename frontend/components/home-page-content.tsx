"use client";

import Link from "next/link";
import { VideoCard } from "@/components/video-card";
import type { VideoItem } from "@/data/mock";

type HomePageContentProps = {
  videos: VideoItem[];
};

const tabs = [
  { label: "\u0414\u043b\u044f \u0432\u0430\u0441", href: "/" },
  { label: "\u041f\u0456\u0434\u043f\u0438\u0441\u043a\u0438", href: "/subscriptions" },
  { label: "\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u0435", href: "/popular" }
];

export function HomePageContent({ videos }: HomePageContentProps) {
  return (
    <section className="mx-auto w-full">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab, idx) => (
              <Link key={tab.label} href={tab.href} className={`rounded-sm border px-3 py-1.5 text-sm ${idx === 0 ? "btn-primary" : "btn-ghost"}`}>
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {videos.map((item, index) => (
            <VideoCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}


