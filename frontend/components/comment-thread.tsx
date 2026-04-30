import type { ThreadComment } from "@/data/mock";
import { ProfileHoverCard } from "@/components/profile-hover-card";
import Link from "next/link";

function LikeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-thumbs-up-icon lucide-thumbs-up h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      <path d="M7 10v12" />
    </svg>
  );
}

function DislikeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-thumbs-down-icon lucide-thumbs-down h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
      <path d="M17 14V2" />
    </svg>
  );
}

type CommentThreadProps = {
  comments: ThreadComment[];
  className?: string;
};

export function CommentThread({
  comments,
  className = "",
}: CommentThreadProps) {
  return (
    <div className={className}>
      <h2 className="mb-3 border-l-2 border-nebori-accent pl-3 text-xl font-bold">
        Коментарі
      </h2>
      <div className="rounded-[6px] border border-[rgba(255,255,255,0.08)] bg-[#0f131b]">
        <div className="border-b border-[rgba(255,255,255,0.08)] p-3">
          <div className="flex items-start gap-2">
            <img
              src="https://i.pravatar.cc/80?img=2"
              alt="Ви"
              className="h-9 w-9 flex-none rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
            />
            <div className="min-w-0 flex-1">
              <input
                type="text"
                placeholder="Написати коментар..."
                className="w-full rounded-[2px] border border-[rgba(255,255,255,0.12)] bg-[#0b0f16] px-3 py-2 text-sm text-nebori-text outline-none"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button className="btn-primary rounded-[2px] px-3 py-1 text-xs">
                  Опублікувати
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[rgba(255,255,255,0.06)]">
          {comments.map((comment) => (
            <article key={comment.id} className="p-3">
              <div className="flex items-start gap-3">
                <ProfileHoverCard
                  handle={comment.author.toLowerCase().replace(/\s+/g, "_")}
                  name={comment.author}
                  avatar={comment.avatar}
                  videosCount={14}
                  subscribers="4.2 тис."
                >
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="h-9 w-9 flex-none rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                  />
                </ProfileHoverCard>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <ProfileHoverCard
                      handle={comment.author.toLowerCase().replace(/\s+/g, "_")}
                      name={comment.author}
                      avatar={comment.avatar}
                      videosCount={14}
                      subscribers="4.2 тис."
                    >
                      <Link
                        href={`/profile/${comment.author.toLowerCase().replace(/\s+/g, "_")}`}
                        className="cursor-pointer text-base font-semibold text-[#c6d4df] transition-colors hover:text-nebori-accent"
                      >
                        {comment.author}
                      </Link>
                    </ProfileHoverCard>
                    <span className="text-xs text-nebori-muted">
                      {comment.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[#d6dde9]">
                    {comment.text}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#8f98ab]">
                    <button className="flex items-center gap-1 hover:text-nebori-accent">
                      <LikeIcon />
                      {comment.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-nebori-accent">
                      <DislikeIcon />
                      {comment.dislikes}
                    </button>
                    <button className="hover:text-nebori-accent">
                      Відповісти
                    </button>
                    <button className="hover:text-nebori-accent">
                      Поскаржитися
                    </button>
                  </div>

                  <div className="mt-3 space-y-2 border-l border-[rgba(255,255,255,0.1)] pl-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <ProfileHoverCard
                          handle={reply.author
                            .toLowerCase()
                            .replace(/\s+/g, "_")}
                          name={reply.author}
                          avatar={reply.avatar}
                          videosCount={8}
                          subscribers="1.1 тис."
                        >
                          <img
                            src={reply.avatar}
                            alt={reply.author}
                            className="h-7 w-7 flex-none rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                          />
                        </ProfileHoverCard>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <ProfileHoverCard
                              handle={reply.author
                                .toLowerCase()
                                .replace(/\s+/g, "_")}
                              name={reply.author}
                              avatar={reply.avatar}
                              videosCount={8}
                              subscribers="1.1 тис."
                            >
                              <Link
                                href={`/profile/${reply.author.toLowerCase().replace(/\s+/g, "_")}`}
                                className="cursor-pointer text-sm font-semibold text-[#c6d4df] transition-colors hover:text-nebori-accent"
                              >
                                {reply.author}
                              </Link>
                            </ProfileHoverCard>
                            <span className="text-xs text-nebori-muted">
                              {reply.time}
                            </span>
                          </div>
                          <p className="text-sm text-[#cfd7e6]">{reply.text}</p>
                          <div className="mt-1 flex gap-3 text-xs text-[#8f98ab]">
                            <button className="flex items-center gap-1 hover:text-nebori-accent">
                              <LikeIcon />
                              {reply.likes}
                            </button>
                            <button className="flex items-center gap-1 hover:text-nebori-accent">
                              <DislikeIcon />
                              {reply.dislikes}
                            </button>
                            <button className="hover:text-nebori-accent">
                              Відповісти
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-end gap-1 border-t border-[rgba(255,255,255,0.08)] bg-[#0c1017] px-3 py-2 text-sm">
          <button className="btn-ghost rounded-[2px] px-2 py-0.5">{`<`}</button>
          <button className="text-nebori-muted hover:text-nebori-text">
            1
          </button>
          <button className="font-semibold text-nebori-accent">2</button>
          <button className="text-nebori-muted hover:text-nebori-text">
            3
          </button>
          <button className="text-nebori-muted hover:text-nebori-text">
            4
          </button>
          <span className="px-1 text-nebori-muted">...</span>
          <button className="text-nebori-muted hover:text-nebori-text">
            14
          </button>
          <button className="btn-ghost rounded-[2px] px-2 py-0.5">{`>`}</button>
        </div>
      </div>
    </div>
  );
}
