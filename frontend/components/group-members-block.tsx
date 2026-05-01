"use client";

import Link from "next/link";
import { useState } from "react";
import { ProfileHoverCard } from "@/components/profile-hover-card";

export type GroupMember = {
  name: string;
  role: string;
};

type GroupMembersBlockProps = {
  members: GroupMember[];
};

export function GroupMembersBlock({ members }: GroupMembersBlockProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-[15px] font-semibold leading-5 text-[#e6e9f3]">{"\u041f\u0456\u0434\u043f\u0438\u0441\u043d\u0438\u043a\u0438"}</h2>
          <button type="button" onClick={() => setOpen(true)} className="text-xs font-semibold text-nebori-accent hover:underline">
            {"\u0412\u0456\u0434\u043a\u0440\u0438\u0442\u0438 \u0432\u0441\u0456\u0445"}
          </button>
        </div>
        <div className="space-y-2">
          {members.slice(0, 6).map((member, idx) => (
            <div key={member.name} className="flex items-center gap-2">
              <ProfileHoverCard
                handle={member.name.toLowerCase()}
                name={member.name}
                avatar={`https://i.pravatar.cc/64?img=${idx + 11}`}
                videosCount={14 + idx}
                groupsCount={2}
                subscribers={`${1 + idx}.${idx} \u0442\u0438\u0441.`}
                status={member.role}
              >
                <Link href={`/profile/${member.name.toLowerCase()}`} className="block">
                  <img
                    src={`https://i.pravatar.cc/64?img=${idx + 11}`}
                    alt={member.name}
                    className="h-9 w-9 rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                    loading="lazy"
                  />
                </Link>
              </ProfileHoverCard>
              <div className="min-w-0">
                <ProfileHoverCard
                  handle={member.name.toLowerCase()}
                  name={member.name}
                  avatar={`https://i.pravatar.cc/64?img=${idx + 11}`}
                  videosCount={14 + idx}
                  groupsCount={2}
                  subscribers={`${1 + idx}.${idx} \u0442\u0438\u0441.`}
                  status={member.role}
                >
                  <Link href={`/profile/${member.name.toLowerCase()}`} className="block truncate text-sm font-semibold text-[#c6d4df] hover:text-nebori-accent">
                    {member.name}
                  </Link>
                </ProfileHoverCard>
                <p className="text-xs text-nebori-muted">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-[120]">
          <button type="button" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/70" aria-label={"\u0417\u0430\u043a\u0440\u0438\u0442\u0438 \u043c\u043e\u0434\u0430\u043b\u044c\u043d\u0435 \u0432\u0456\u043a\u043d\u043e"} />
          <div className="absolute left-1/2 top-1/2 w-[960px] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 rounded-[8px] border border-[rgba(255,255,255,0.16)] bg-[#0f131b] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-[#e6e9f3]">
                {"\u041f\u0456\u0434\u043f\u0438\u0441\u043d\u0438\u043a\u0438"} <span className="text-nebori-muted">({members.length})</span>
              </h3>
              <button type="button" onClick={() => setOpen(false)} className="rounded-[4px] border border-[rgba(255,255,255,0.2)] px-2 py-1 text-xs text-nebori-muted hover:text-nebori-accent">
                {"\u0417\u0430\u043a\u0440\u0438\u0442\u0438"}
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {members.map((member, idx) => (
                  <article key={`modal-${member.name}`} className="rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-[#121826] p-2.5">
                    <div className="flex items-center gap-2">
                      <ProfileHoverCard
                        handle={member.name.toLowerCase()}
                        name={member.name}
                        avatar={`https://i.pravatar.cc/64?img=${idx + 11}`}
                        videosCount={14 + idx}
                        groupsCount={2}
                        subscribers={`${1 + idx}.${idx} \u0442\u0438\u0441.`}
                        status={member.role}
                      >
                        <Link href={`/profile/${member.name.toLowerCase()}`} onClick={() => setOpen(false)} className="block">
                          <img
                            src={`https://i.pravatar.cc/64?img=${idx + 11}`}
                            alt={member.name}
                            className="h-10 w-10 rounded-[3px] border border-[rgba(255,255,255,0.2)] object-cover"
                            loading="lazy"
                          />
                        </Link>
                      </ProfileHoverCard>
                      <div className="min-w-0">
                        <ProfileHoverCard
                          handle={member.name.toLowerCase()}
                          name={member.name}
                          avatar={`https://i.pravatar.cc/64?img=${idx + 11}`}
                          videosCount={14 + idx}
                          groupsCount={2}
                          subscribers={`${1 + idx}.${idx} \u0442\u0438\u0441.`}
                          status={member.role}
                        >
                          <Link href={`/profile/${member.name.toLowerCase()}`} onClick={() => setOpen(false)} className="block truncate text-sm font-semibold text-[#d6dcec] hover:text-nebori-accent">
                            {member.name}
                          </Link>
                        </ProfileHoverCard>
                        <p className="text-xs text-nebori-muted">{member.role}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
