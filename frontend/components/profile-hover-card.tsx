"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ProfileHoverCardProps = {
  handle: string;
  name: string;
  avatar: string;
  status?: string;
  videosCount?: number;
  subscribers?: string;
  level?: number;
  children: ReactNode;
  className?: string;
};

export function ProfileHoverCard({
  handle,
  name,
  avatar,
  status = "\u041d\u0435 \u0432 \u043c\u0435\u0440\u0435\u0436\u0456",
  videosCount = 12,
  subscribers = "12.4 \u0442\u0438\u0441.",
  level = 21,
  children,
  className
}: ProfileHoverCardProps) {
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const gap = 8;
      const margin = 8;
      const cardWidth = Math.min(320, window.innerWidth - margin * 2);
      const cardHeight = cardRef.current?.offsetHeight ?? 240;

      const hasRoomRight = rect.left + cardWidth + margin <= window.innerWidth;
      const preferredLeft = hasRoomRight ? rect.left : rect.right - cardWidth;
      const clampedLeft = Math.min(window.innerWidth - cardWidth - margin, Math.max(margin, preferredLeft));

      let top = rect.bottom + gap;
      if (top + cardHeight > window.innerHeight - margin) {
        top = rect.top - cardHeight - gap;
      }
      const clampedTop = Math.max(margin, Math.min(window.innerHeight - cardHeight - margin, top));

      setPosition({ left: clampedLeft, top: clampedTop });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const hoverCard =
    mounted && open
      ? createPortal(
          <div
            ref={cardRef}
            className="pointer-events-none fixed z-[200] w-[320px] max-w-[86vw] overflow-hidden rounded-[6px] border border-[rgba(255,255,255,0.16)] bg-[#0f131b] opacity-100 shadow-[0_18px_40px_rgba(0,0,0,0.55)] transition duration-150"
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`
            }}
          >
            <div className="relative h-20 border-b border-[rgba(255,255,255,0.08)]">
              <img
                src={`https://picsum.photos/seed/profile-hover-${encodeURIComponent(handle)}/640/240`}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover opacity-45"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,10,15,0.1)] to-[rgba(8,10,15,0.86)]" />
            </div>

            <div className="relative p-3">
              <div className="-mt-11 flex items-end gap-3">
                <img src={avatar} alt={name} className="h-16 w-16 rounded-[4px] border border-[rgba(245,197,24,0.45)] bg-[#111826] object-cover" />
                <div className="min-w-0 pb-1">
                  <Link href={`/profile/${handle}`} className="block truncate text-[30px] font-semibold leading-none text-[#e8edf9] hover:text-nebori-accent">
                    {name}
                  </Link>
                  <div className="mt-1 text-[13px] leading-4 text-nebori-muted">{status}</div>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm text-[#c5cede]">
                <div>
                  {"\u0420\u0456\u0432\u0435\u043d\u044c"}: <span className="font-semibold text-[#e6ebf8]">{level}</span>
                </div>
                <div>
                  {"\u0412\u0456\u0434\u0435\u043e"}: <span className="font-semibold text-[#e6ebf8]">{videosCount}</span>
                </div>
                <div>
                  {"\u041f\u0456\u0434\u043f\u0438\u0441\u043d\u0438\u043a\u0438"}: <span className="font-semibold text-nebori-accent">{subscribers}</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <span
      ref={anchorRef}
      className={`relative inline-block align-top ${className ?? ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {hoverCard}
    </span>
  );
}
