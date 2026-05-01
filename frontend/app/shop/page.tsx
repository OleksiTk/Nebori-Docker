"use client";

import { useMemo, useState } from "react";

type Category = "Усі" | "Рамки аватару" | "Фони профілю" | "Значки";
type ViewMode = "list" | "grid";
type SortMode = "popular" | "price-asc" | "price-desc";

type CosmeticItem = {
  id: string;
  name: string;
  category: Exclude<Category, "Усі">;
  stock: number;
  price: number;
  sold: number;
  quality: "Базова" | "Рідкісна" | "Епічна";
  seed: string;
};

const categories: Category[] = ["Усі", "Рамки аватару", "Фони профілю", "Значки"];

const cosmetics: CosmeticItem[] = [
  { id: "frame-amber", name: "Рамка «Бурштиновий контур»", category: "Рамки аватару", stock: 12480, price: 180, sold: 48320, quality: "Рідкісна", seed: "frame-amber" },
  { id: "frame-raid", name: "Рамка «Рейдовий шеврон»", category: "Рамки аватару", stock: 9210, price: 225, sold: 33610, quality: "Епічна", seed: "frame-raid" },
  { id: "bg-night", name: "Фон «Нічний штаб»", category: "Фони профілю", stock: 17854, price: 140, sold: 55124, quality: "Базова", seed: "bg-night" },
  { id: "bg-steel", name: "Фон «Сталевий ангар»", category: "Фони профілю", stock: 8030, price: 260, sold: 22114, quality: "Епічна", seed: "bg-steel" },
  { id: "badge-officer", name: "Значок «Офіцер загону»", category: "Значки", stock: 25990, price: 90, sold: 80111, quality: "Базова", seed: "badge-officer" },
  { id: "badge-veteran", name: "Значок «Ветеран сезону»", category: "Значки", stock: 14220, price: 130, sold: 41890, quality: "Рідкісна", seed: "badge-veteran" },
  { id: "frame-carbon", name: "Рамка «Карбон v2»", category: "Рамки аватару", stock: 10970, price: 170, sold: 29741, quality: "Базова", seed: "frame-carbon" },
  { id: "bg-rift", name: "Фон «Розлом небес»", category: "Фони профілю", stock: 6240, price: 310, sold: 19882, quality: "Епічна", seed: "bg-rift" },
  { id: "badge-scout", name: "Значок «Скаут»", category: "Значки", stock: 20401, price: 75, sold: 69001, quality: "Базова", seed: "badge-scout" },
  { id: "badge-elite", name: "Значок «Еліта клану»", category: "Значки", stock: 5710, price: 280, sold: 12004, quality: "Епічна", seed: "badge-elite" }
];

function formatCount(value: number) {
  return value.toLocaleString("uk-UA");
}

function qualityClass(quality: CosmeticItem["quality"]) {
  if (quality === "Епічна") return "text-[#f5c518]";
  if (quality === "Рідкісна") return "text-[#83c9ff]";
  return "text-[#9aa8c2]";
}

export default function ShopPage() {
  const [mode, setMode] = useState<ViewMode>("list");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("Усі");
  const [sort, setSort] = useState<SortMode>("popular");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = cosmetics.filter((item) => {
      const byCategory = category === "Усі" ? true : item.category === category;
      const byQuery = q.length === 0 ? true : item.name.toLowerCase().includes(q);
      return byCategory && byQuery;
    });

    return [...base].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return b.sold - a.sold;
    });
  }, [category, query, sort]);

  return (
    <section className="mx-auto w-full max-w-[1050px] space-y-4">
      <header>
        <h1 className="text-2xl font-bold leading-none">Магазин косметики</h1>
        <p className="mt-1 text-sm text-nebori-muted">
          Придбайте предмети для профілю Nebori: рамки аватару, фони та значки. Усе куплене видно в коментарях, профілі та стрічках.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_248px]">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#0F1117] px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-semibold leading-5 text-nebori-text">Результати:</span>
              <span className="rounded-[4px] border border-[rgba(245,197,24,0.35)] bg-[rgba(245,197,24,0.14)] px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-nebori-accent">
                {category}
              </span>
              <span className="text-sm text-nebori-muted">{formatCount(filtered.length)} позицій</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode("list")}
                className={`rounded-[4px] border px-3 py-1.5 text-sm ${mode === "list" ? "btn-primary" : "btn-ghost"}`}
              >
                Список
              </button>
              <button
                type="button"
                onClick={() => setMode("grid")}
                className={`rounded-[4px] border px-3 py-1.5 text-sm ${mode === "grid" ? "btn-primary" : "btn-ghost"}`}
              >
                Картки
              </button>
            </div>
          </div>

          {mode === "list" ? (
            <div className="overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#0F1117]">
              <div className="grid grid-cols-[minmax(0,1fr)_110px_110px] border-b border-[rgba(255,255,255,0.08)] bg-[#161922] px-3 py-2 text-xs uppercase tracking-[0.08em] text-nebori-muted">
                <span>Назва</span>
                <span className="text-right">Кількість</span>
                <span className="text-right">Ціна</span>
              </div>

              <div className="divide-y divide-[rgba(255,255,255,0.06)]">
                {filtered.map((item) => (
                  <article key={item.id} className="grid grid-cols-[minmax(0,1fr)_110px_110px] items-center gap-3 px-3 py-3 transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={`https://picsum.photos/seed/cosmetic-${item.seed}/96/96`}
                        alt={item.name}
                        className="h-16 w-16 rounded-[3px] border border-[rgba(255,255,255,0.14)] object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <h2 className="truncate text-[15px] font-semibold leading-5 text-[#e6e9f3]">{item.name}</h2>
                        <p className="mt-1 text-[13px] leading-5 text-nebori-muted">{item.category}</p>
                        <p className={`text-[11px] font-semibold uppercase tracking-[0.04em] ${qualityClass(item.quality)}`}>{item.quality}</p>
                      </div>
                    </div>
                    <p className="text-right text-[13px] leading-5 text-nebori-muted">{formatCount(item.stock)}</p>
                    <div className="text-right">
                      <p className="text-[15px] font-semibold leading-5 text-[#f0f5ff]">{item.price} ток.</p>
                      <button className="mt-1 rounded-[4px] border border-[#a7760a] bg-[linear-gradient(180deg,#f8d44b_0%,#dfb325_100%)] px-2.5 py-1 text-xs font-semibold text-[#121318]">
                        Купити
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <article key={item.id} className="rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#0F1117] p-2.5 transition-all duration-150 hover:border-[rgba(245,197,24,0.35)] hover:shadow-[0_0_0_1px_rgba(245,197,24,0.2)]">
                  <img
                    src={`https://picsum.photos/seed/cosmetic-grid-${item.seed}/480/280`}
                    alt={item.name}
                    className="h-28 w-full rounded-[3px] border border-[rgba(255,255,255,0.12)] object-cover"
                    loading="lazy"
                  />
                  <h2 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-5 text-[#e6e9f3]">{item.name}</h2>
                  <p className="text-[13px] leading-5 text-nebori-muted">{item.category}</p>
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.04em] ${qualityClass(item.quality)}`}>{item.quality}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-nebori-muted">В наявності: {formatCount(item.stock)}</span>
                    <span className="text-sm font-semibold text-nebori-accent">{item.price} ток.</span>
                  </div>
                  <button className="mt-2 w-full rounded-[4px] border border-[#a7760a] bg-[linear-gradient(180deg,#f8d44b_0%,#dfb325_100%)] px-3 py-1.5 text-sm font-semibold text-[#121318]">
                    Купити
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#0F1117] p-2.5">
          <h3 className="text-[15px] font-semibold leading-5 text-[#e6e9f3]">Пошук предметів</h3>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Пошук..."
            className="mt-2 h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-2.5 text-sm text-white outline-none placeholder:text-nebori-muted focus:border-[rgba(245,197,24,0.4)]"
          />

          <div className="mt-3 rounded-[4px] border border-[rgba(138,191,86,0.45)] bg-[linear-gradient(180deg,#4f6f33_0%,#405a2a_100%)] px-2.5 py-2 text-sm text-[#d6e8c2]">
            Баланс: <span className="font-semibold text-[#f2ffdf]">740 токенів</span>
          </div>

          <div className="mt-3">
            <p className="mb-1 text-xs uppercase tracking-[0.08em] text-nebori-muted">Фільтри</p>
            {categories.map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setCategory(entry)}
                className={`block w-full py-1 text-left text-[14px] leading-6 transition-colors ${
                  category === entry
                    ? "font-semibold text-nebori-accent"
                    : "text-[#cfd8ea] hover:text-nebori-text"
                }`}
              >
                {entry}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <p className="mb-1 text-xs uppercase tracking-[0.08em] text-nebori-muted">Сортування</p>
            <button
              type="button"
              onClick={() => setSort("popular")}
              className={`block w-full py-1 text-left text-[14px] leading-6 transition-colors ${
                sort === "popular" ? "font-semibold text-nebori-accent" : "text-[#cfd8ea] hover:text-nebori-text"
              }`}
            >
              Популярні
            </button>
            <button
              type="button"
              onClick={() => setSort("price-asc")}
              className={`block w-full py-1 text-left text-[14px] leading-6 transition-colors ${
                sort === "price-asc" ? "font-semibold text-nebori-accent" : "text-[#cfd8ea] hover:text-nebori-text"
              }`}
            >
              Ціна: від дешевих
            </button>
            <button
              type="button"
              onClick={() => setSort("price-desc")}
              className={`block w-full py-1 text-left text-[14px] leading-6 transition-colors ${
                sort === "price-desc" ? "font-semibold text-nebori-accent" : "text-[#cfd8ea] hover:text-nebori-text"
              }`}
            >
              Ціна: від дорогих
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
