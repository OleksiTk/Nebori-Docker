"use client";

import Link from "next/link";
import { useState } from "react";

type SidebarEntity = {
  name: string;
  role: string;
  href: string;
  avatar: string;
};

type ChannelCommunityBlocksProps = {
  friends: SidebarEntity[];
};

type ModalKind = "friends" | null;

function SidebarList({
  title,
  items,
  onOpen
}: {
  title: string;
  items: SidebarEntity[];
  onOpen: () => void;
}) {
  return (
    <section className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold leading-5 text-[#e6e9f3]">{title}</h2>
        <button type="button" onClick={onOpen} className="text-xs font-semibold text-nebori-accent hover:underline">
          Відкрити всіх
        </button>
      </div>
      <div className="space-y-2">
        {items.slice(0, 6).map((item) => (
          <div key={`${title}-${item.name}`} className="flex items-center gap-2">
            <Link href={item.href} className="block">
              <img
                src={item.avatar}
                alt={item.name}
                className="h-9 w-9 rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                loading="lazy"
              />
            </Link>
            <div className="min-w-0">
              <Link href={item.href} className="block truncate text-sm font-semibold text-[#c6d4df] hover:text-nebori-accent">
                {item.name}
              </Link>
              <p className="text-xs text-nebori-muted">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ListModal({
  title,
  items,
  onClose
}: {
  title: string;
  items: SidebarEntity[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[120]">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/70" aria-label="Закрити модальне вікно" />
      <div className="absolute left-1/2 top-1/2 w-[960px] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 rounded-[8px] border border-[rgba(255,255,255,0.16)] bg-[#0f131b] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-[#e6e9f3]">
            {title} <span className="text-nebori-muted">({items.length})</span>
          </h3>
          <button type="button" onClick={onClose} className="rounded-[4px] border border-[rgba(255,255,255,0.2)] px-2 py-1 text-xs text-nebori-muted hover:text-nebori-accent">
            Закрити
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {items.map((item) => (
              <article key={`${title}-modal-${item.name}`} className="rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#121826] p-2.5">
                <div className="flex items-center gap-2">
                  <Link href={item.href} onClick={onClose} className="block">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="h-10 w-10 rounded-[3px] border border-[rgba(255,255,255,0.2)] object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link href={item.href} onClick={onClose} className="block truncate text-sm font-semibold text-[#d6dcec] hover:text-nebori-accent">
                      {item.name}
                    </Link>
                    <p className="text-xs text-nebori-muted">{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChannelCommunityBlocks({ friends }: ChannelCommunityBlocksProps) {
  const [open, setOpen] = useState<ModalKind>(null);

  return (
    <>
      <SidebarList title="Друзі каналу" items={friends} onOpen={() => setOpen("friends")} />

      {open === "friends" ? <ListModal title="Друзі каналу" items={friends} onClose={() => setOpen(null)} /> : null}
    </>
  );
}
