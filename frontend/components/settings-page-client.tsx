"use client";

import { useState } from "react";

function Toggle({
  checked,
  onChange,
  label,
  hint
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <label className="flex items-start justify-between gap-3 rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel px-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#e6e9f3]">{label}</p>
        <p className="text-xs text-nebori-muted">{hint}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 cursor-pointer accent-[#f5c534]"
      />
    </label>
  );
}

export function SettingsPageClient() {
  const [autoplay, setAutoplay] = useState(true);
  const [subtitles, setSubtitles] = useState(false);
  const [compactCards, setCompactCards] = useState(false);
  const [showOnline, setShowOnline] = useState(true);
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyGroups, setNotifyGroups] = useState(true);
  const [notifySubscriptions, setNotifySubscriptions] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [historyEnabled, setHistoryEnabled] = useState(true);

  return (
    <section className="mx-auto w-full max-w-[1050px] space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold leading-none">Налаштування</h1>
          <p className="mt-1 text-sm text-nebori-muted">@nebori_user • параметри сайту та акаунта</p>
        </div>
        <button type="button" className="btn-primary rounded-[4px] px-3 py-1.5 text-sm">
          Зберегти зміни
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="space-y-2 rounded-[4px] border border-[rgba(255,255,255,0.08)] p-3">
          <h2 className="text-lg font-semibold text-[#e6e9f3]">Акаунт</h2>
          <label className="block">
            <p className="mb-1 text-xs text-nebori-muted">Нікнейм</p>
            <input
              defaultValue="Nebori User"
              className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
            />
          </label>
          <label className="block">
            <p className="mb-1 text-xs text-nebori-muted">Email</p>
            <input
              defaultValue="nebori_user@mail.gg"
              className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none"
            />
          </label>
          <label className="block">
            <p className="mb-1 text-xs text-nebori-muted">Мова інтерфейсу</p>
            <select className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none">
              <option>Українська</option>
              <option>English</option>
              <option>Русский</option>
            </select>
          </label>
        </section>

        <section className="space-y-2 rounded-[4px] border border-[rgba(255,255,255,0.08)] p-3">
          <h2 className="text-lg font-semibold text-[#e6e9f3]">Відтворення</h2>
          <Toggle checked={autoplay} onChange={setAutoplay} label="Автовідтворення" hint="Автоматично запускати наступне відео." />
          <Toggle checked={subtitles} onChange={setSubtitles} label="Субтитри за замовчуванням" hint="Вмикати субтитри, якщо вони доступні." />
          <label className="block rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel px-3 py-2">
            <p className="text-sm font-semibold text-[#e6e9f3]">Якість відео за замовчуванням</p>
            <p className="mb-2 text-xs text-nebori-muted">Оберіть пріоритет при старті відтворення.</p>
            <select className="h-9 w-full rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#161922] px-3 text-sm text-nebori-text outline-none">
              <option>Авто</option>
              <option>1080p</option>
              <option>720p</option>
              <option>480p</option>
            </select>
          </label>
        </section>

        <section className="space-y-2 rounded-[4px] border border-[rgba(255,255,255,0.08)] p-3">
          <h2 className="text-lg font-semibold text-[#e6e9f3]">Сповіщення</h2>
          <Toggle checked={notifyComments} onChange={setNotifyComments} label="Коментарі" hint="Сповіщати про відповіді та згадки." />
          <Toggle checked={notifyGroups} onChange={setNotifyGroups} label="Групи" hint="Оновлення з груп, де ви перебуваєте." />
          <Toggle checked={notifySubscriptions} onChange={setNotifySubscriptions} label="Підписки" hint="Нові відео від каналів, на які ви підписані." />
          <Toggle checked={emailDigest} onChange={setEmailDigest} label="Email-дайджест" hint="Щотижневе зведення активності на пошту." />
        </section>

        <section className="space-y-2 rounded-[4px] border border-[rgba(255,255,255,0.08)] p-3">
          <h2 className="text-lg font-semibold text-[#e6e9f3]">Приватність та інтерфейс</h2>
          <Toggle checked={historyEnabled} onChange={setHistoryEnabled} label="Зберігати історію переглядів" hint="Використовується для рекомендацій та історії." />
          <Toggle checked={showOnline} onChange={setShowOnline} label="Показувати статус онлайн" hint="Інші користувачі бачитимуть, що ви в мережі." />
          <Toggle checked={compactCards} onChange={setCompactCards} label="Компактні картки відео" hint="Менші превʼю в стрічці для щільнішого списку." />
          <button
            type="button"
            className="w-full rounded-[4px] border border-[rgba(255,120,120,0.35)] bg-[rgba(255,120,120,0.06)] px-3 py-2 text-left text-sm text-[#f6b4b4] hover:bg-[rgba(255,120,120,0.12)]"
          >
            Очистити історію переглядів
          </button>
        </section>
      </div>
    </section>
  );
}

