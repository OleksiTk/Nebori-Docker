"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logo from "../logo.png";
import { useAuth } from "@/components/auth-provider";

const navItems = [
  { href: "/", label: "Головна" },
  { href: "/activity", label: "Активність" },
  { href: "/shop", label: "Магазин" },
];

const notifications = [
  {
    id: "n1",
    text: "IronBand відповів на ваш коментар",
    time: "2 хв тому",
    href: "/video/v101",
  },
  {
    id: "n2",
    text: "Frontline Hub опублікувала новий пост",
    time: "18 хв тому",
    href: "/groups/activity",
  },
  {
    id: "n3",
    text: "Нове відео у плейлисті «Мета-сезон #12»",
    time: "1 год тому",
    href: "/playlist/pl-meta-02",
  },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, logout } = useAuth();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileGroupsOpen, setMobileGroupsOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAvatarMenuOpen(false);
    setMobileGroupsOpen(false);
    setMobileProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/search")) {
      setSearchValue(searchParams.get("q") ?? "");
      return;
    }
    setSearchValue("");
  }, [pathname, searchParams]);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!avatarMenuRef.current) return;
      const target = event.target as Node;
      if (!avatarMenuRef.current.contains(target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return (
        pathname === "/" ||
        pathname.startsWith("/video/") ||
        pathname.startsWith("/subscriptions") ||
        pathname.startsWith("/popular") ||
        pathname.startsWith("/search")
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const groupsActive = pathname.startsWith("/groups/");
  const profileActive =
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname.startsWith("/history") ||
    pathname.startsWith("/playlists");

  const submitSearch = () => {
    const q = searchValue.trim();
    router.push(
      q.length > 0 ? `/search?q=${encodeURIComponent(q)}` : "/search",
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.08)] bg-[linear-gradient(90deg,#0f1117_0%,#121824_60%,#1b1913_100%)]">
      <div className="mx-auto flex w-full max-w-[1720px] flex-wrap items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4 xl:px-6">
        <Link href="/" className="flex items-center justify-center py-1">
          <Image
            src={logo}
            alt="NEBORI"
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[4px] px-3 py-2 text-lg leading-none transition-colors duration-150 ${
                isActive(item.href)
                  ? "font-semibold text-nebori-accent"
                  : "text-nebori-muted hover:text-nebori-text"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="group relative">
            <button
              type="button"
              className={`flex items-center gap-1 rounded-[4px] px-3 py-2 text-lg leading-none transition-colors duration-150 ${
                profileActive
                  ? "font-semibold text-nebori-accent"
                  : "text-nebori-muted hover:text-nebori-text"
              }`}
            >
              Профіль
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-180 group-focus-within:rotate-180"
              >
                <path
                  d="M3 4.5 6 7.5 9 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="invisible absolute left-0 top-full z-50 mt-1 w-44 rounded-[4px] border border-[rgba(255,255,255,0.16)] bg-[#141a25] p-1 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link
                href="/profile"
                className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
              >
                Мій профіль
              </Link>
              <Link
                href="/profile/nebori_user/history"
                className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
              >
                Історія
              </Link>
              <Link
                href="/playlists"
                className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
              >
                Плейлисти
              </Link>
              <Link
                href="/subscriptions"
                className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
              >
                Підписки
              </Link>
            </div>
          </div>

          <div className="group relative">
            <Link
              href="/groups/activity"
              className={`flex items-center gap-1 rounded-[4px] px-3 py-2 text-lg leading-none transition-colors duration-150 ${
                groupsActive
                  ? "font-semibold text-nebori-accent"
                  : "text-nebori-muted hover:text-nebori-text"
              }`}
            >
              Групи
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className="h-3.5 w-3.5 transition-transform duration-150 group-hover:rotate-180 group-focus-within:rotate-180"
              >
                <path
                  d="M3 4.5 6 7.5 9 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <div className="invisible absolute left-0 top-full z-50 mt-1 w-44 rounded-[4px] border border-[rgba(255,255,255,0.16)] bg-[#141a25] p-1 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link
                href="/groups/activity"
                className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
              >
                Стрічка
              </Link>
              <Link
                href="/groups/catalog"
                className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
              >
                Каталог
              </Link>
              <Link
                href="/studio?createGroup=1"
                className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
              >
                Створити
              </Link>
            </div>
          </div>
        </div>

        <div className="flex w-full min-w-0 items-center gap-2 sm:flex-1 sm:min-w-[260px] sm:justify-end">
          <div className="relative min-w-0 w-full sm:max-w-xl">
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submitSearch();
                }
              }}
              placeholder="Пошук відео, груп, користувачів..."
              className="w-full rounded-[4px] border border-[rgba(255,255,255,0.12)] bg-nebori-panel py-2 pl-3 pr-10 text-sm text-nebori-text outline-none"
            />
            <button
              type="button"
              onClick={submitSearch}
              aria-label="Пошук"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-[3px] border border-[rgba(255,255,255,0.16)] bg-[#151b28] p-1 text-nebori-muted hover:text-nebori-accent"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
                <circle
                  cx="7"
                  cy="7"
                  r="4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M10.5 10.5 14 14"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="group relative hidden md:block">
            <button
              type="button"
              className="relative rounded-[4px] border border-[rgba(255,255,255,0.12)] bg-nebori-panel p-2 text-sm"
              aria-label="Сповіщення"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-5 w-5 text-nebori-text"
              >
                <path
                  d="M8 1.8c-1.9 0-3.3 1.5-3.3 3.5v1.1c0 .7-.3 1.4-.7 2l-.8 1.2c-.2.4 0 .9.5.9h8.6c.5 0 .8-.5.5-.9l-.8-1.2c-.4-.6-.7-1.3-.7-2V5.3C11.3 3.3 9.9 1.8 8 1.8zM6.3 12c.2 1 .9 1.6 1.7 1.6.8 0 1.5-.6 1.7-1.6H6.3z"
                  fill="currentColor"
                />
              </svg>
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-nebori-accent px-1 text-[10px] font-semibold text-black">
                3
              </span>
            </button>
            <div className="invisible absolute right-0 top-full z-50 mt-1 w-[320px] overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.16)] bg-[#141a25] opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="border-b border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm font-semibold text-nebori-text">
                Сповіщення
              </div>
              <div className="divide-y divide-[rgba(255,255,255,0.08)]">
                {notifications.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="block px-3 py-2 hover:bg-[rgba(255,255,255,0.04)]"
                  >
                    <p className="line-clamp-2 text-[13px] leading-5 text-[#dde4f3]">
                      {item.text}
                    </p>
                    <p className="text-[11px] text-nebori-muted">{item.time}</p>
                  </Link>
                ))}
              </div>
              <Link
                href="/activity"
                className="block border-t border-[rgba(255,255,255,0.08)] px-3 py-2 text-xs font-semibold text-nebori-accent hover:bg-[rgba(255,255,255,0.04)]"
              >
                Усі сповіщення →
              </Link>
            </div>
          </div>

          <div ref={avatarMenuRef} className="group relative">
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  router.push("/register");
                  return;
                }
                setAvatarMenuOpen((v) => !v);
              }}
              className="flex h-9 w-9 items-center justify-center border border-[rgba(255,255,255,0.12)] bg-nebori-panel p-0.5"
              aria-label="Меню профілю"
              aria-expanded={avatarMenuOpen}
            >
              <img
                src="https://i.pravatar.cc/40?img=2"
                alt={`@${user?.username ?? "guest"}`}
                className="h-7 w-7 shrink-0 rounded-none border border-[rgba(255,255,255,0.16)] object-cover"
              />
            </button>
            <div
              className={`absolute right-0 top-full z-50 mt-1 w-52 rounded-[4px] border border-[rgba(255,255,255,0.16)] bg-[#141a25] p-1 transition duration-150 ${
                isAuthenticated
                  ? `md:group-hover:visible md:group-hover:opacity-100 md:group-focus-within:visible md:group-focus-within:opacity-100 ${
                      avatarMenuOpen
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                    }`
                  : "pointer-events-none invisible opacity-0"
              }`}
            >
              <div className="mb-1 rounded-[3px] border border-[rgba(255,255,255,0.08)] px-3 py-2">
                <p className="text-sm font-semibold text-nebori-text">
                  {user?.username ?? "Nebori User"}
                </p>
                <p className="text-xs text-nebori-muted">
                  @{user?.username ?? "nebori_user"}
                </p>
              </div>
              <Link
                href="/studio?upload=1"
                onClick={() => setAvatarMenuOpen(false)}
                className="block w-full rounded-[3px] px-3 py-2 text-left text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
              >
                Додати відео
              </Link>
              <Link
                href="/studio"
                onClick={() => setAvatarMenuOpen(false)}
                className="block w-full rounded-[3px] px-3 py-2 text-left text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
              >
                Студія
              </Link>
              <Link
                href="/settings"
                onClick={() => setAvatarMenuOpen(false)}
                className="block w-full rounded-[3px] px-3 py-2 text-left text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
              >
                Налаштування
              </Link>
              <Link
                href="/profile"
                onClick={() => setAvatarMenuOpen(false)}
                className="block w-full rounded-[3px] px-3 py-2 text-left text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
              >
                Мій профіль
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setAvatarMenuOpen(false);
                }}
                className="block w-full rounded-[3px] px-3 py-2 text-left text-sm text-[#f3b3b3] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#ffd4d4]"
              >
                Вийти
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-1 pb-1 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[4px] px-1.5 py-1.5 text-[13px] leading-none ${
                isActive(item.href)
                  ? "font-semibold text-nebori-accent"
                  : "bg-nebori-panel text-nebori-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setMobileGroupsOpen((v) => !v);
                setMobileProfileOpen(false);
              }}
              className={`flex items-center gap-1 rounded-[4px] px-1.5 py-1.5 text-[13px] leading-none ${groupsActive ? "font-semibold text-nebori-accent" : "bg-nebori-panel text-nebori-muted"}`}
            >
              Групи
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className={`h-3 w-3 transition-transform ${mobileGroupsOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M3 4.5 6 7.5 9 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {mobileGroupsOpen ? (
              <div className="absolute right-0 top-full z-50 mt-1 w-44 max-w-[92vw] rounded-[4px] border border-[rgba(255,255,255,0.16)] bg-[#141a25] p-1">
                <Link
                  href="/groups/activity"
                  onClick={() => setMobileGroupsOpen(false)}
                  className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
                >
                  Стрічка
                </Link>
                <Link
                  href="/groups/catalog"
                  onClick={() => setMobileGroupsOpen(false)}
                  className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
                >
                  Каталог
                </Link>
                <Link
                  href="/studio?createGroup=1"
                  onClick={() => setMobileGroupsOpen(false)}
                  className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
                >
                  Створити
                </Link>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setMobileProfileOpen((v) => !v);
                setMobileGroupsOpen(false);
              }}
              className={`flex items-center gap-1 rounded-[4px] px-1.5 py-1.5 text-[13px] leading-none ${profileActive ? "font-semibold text-nebori-accent" : "bg-nebori-panel text-nebori-muted"}`}
            >
              Профіль
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                className={`h-3 w-3 transition-transform ${mobileProfileOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M3 4.5 6 7.5 9 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {mobileProfileOpen ? (
              <div className="absolute right-0 top-full z-50 mt-1 w-44 max-w-[92vw] rounded-[4px] border border-[rgba(255,255,255,0.16)] bg-[#141a25] p-1">
                <Link
                  href="/profile"
                  onClick={() => setMobileProfileOpen(false)}
                  className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
                >
                  Мій профіль
                </Link>
                <Link
                  href="/profile/nebori_user/history"
                  onClick={() => setMobileProfileOpen(false)}
                  className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
                >
                  Історія
                </Link>
                <Link
                  href="/playlists"
                  onClick={() => setMobileProfileOpen(false)}
                  className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
                >
                  Плейлисти
                </Link>
                <Link
                  href="/subscriptions"
                  onClick={() => setMobileProfileOpen(false)}
                  className="block rounded-[3px] px-3 py-2 text-sm text-nebori-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-nebori-text"
                >
                  Підписки
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
