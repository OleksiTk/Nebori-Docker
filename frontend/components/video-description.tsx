"use client";

import { useState } from "react";

type VideoDescriptionProps = {
  preview: string;
  fullText: string;
  metaLine?: string;
};

export function VideoDescription({ preview, fullText, metaLine }: VideoDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`mt-4 rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-[#15151F] p-4 ${expanded ? "" : "cursor-pointer"}`}
      onClick={() => {
        if (!expanded) setExpanded(true);
      }}
      role={expanded ? undefined : "button"}
      tabIndex={expanded ? -1 : 0}
      onKeyDown={(e) => {
        if (!expanded && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setExpanded(true);
        }
      }}
    >
      <p className={`text-sm leading-6 text-[#c1c6d4] ${expanded ? "" : "line-clamp-2"}`}>{expanded ? fullText : preview}</p>
      {expanded && metaLine ? <p className="mt-3 font-mono text-xs text-nebori-muted">{metaLine}</p> : null}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((v) => !v);
        }}
        className="mt-1 text-sm font-semibold text-nebori-text hover:text-nebori-accent"
      >
        {expanded ? "Згорнути" : "...ще"}
      </button>
    </div>
  );
}
