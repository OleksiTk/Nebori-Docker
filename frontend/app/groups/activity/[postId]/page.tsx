import Link from "next/link";
import { CommentThread } from "@/components/comment-thread";
import { groupActivityPosts, threadComments } from "@/data/mock";

type PageProps = {
  params: Promise<{ postId: string }>;
};

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

function CommentIcon() {
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
      className="lucide lucide-messages-square-icon lucide-messages-square h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      <path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1" />
    </svg>
  );
}

function ShareIcon() {
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
      className="lucide lucide-share2-icon lucide-share-2 h-3.5 w-3.5"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}

function groupSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default async function GroupPostPage({ params }: PageProps) {
  const { postId } = await params;
  const post = groupActivityPosts.find((item) => item.id === postId) ?? groupActivityPosts[0];

  return (
    <section className="mx-auto w-full max-w-[900px] space-y-3">
      <div className="mx-auto w-full max-w-[760px] space-y-3">
        <Link href="/groups/activity" className="inline-flex rounded-[4px] border border-[rgba(255,255,255,0.18)] bg-[#151b28] px-3 py-1.5 text-sm text-nebori-muted hover:text-nebori-accent">
          ← Назад до стрічки
        </Link>

        <article className="rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-nebori-panel p-2.5">
          <header className="flex items-start gap-3">
            <Link href={`/groups/${groupSlug(post.group)}`} className="block flex-none">
              <img
                src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(post.group)}`}
                alt={post.group}
                className="h-8 w-8 rounded-[3px] border border-[rgba(255,255,255,0.16)] object-cover"
              />
            </Link>
            <div className="min-w-0">
              <Link href={`/groups/${groupSlug(post.group)}`} className="block w-fit text-xs font-semibold leading-4 text-[#d6dcec] hover:text-nebori-accent">
                {post.group}
              </Link>
              <p className="text-[11px] leading-4 text-nebori-muted">
                {post.author} • {post.time}
              </p>
            </div>
          </header>

          <p className="mt-2 text-base font-semibold leading-6 text-[#e6e9f3]">{post.title}</p>
          <p className="mt-1 text-sm leading-6 text-nebori-muted">{post.body}</p>

          <div className="relative mt-3 h-[220px] overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.1)] bg-black lg:h-[250px]">
            <img
              src={`https://picsum.photos/seed/group-post-${post.id}/980/540`}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-md"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/25" />
            <img
              src={`https://picsum.photos/seed/group-post-${post.id}/980/540`}
              alt={post.title}
              className="relative z-10 h-full w-full object-contain"
              loading="lazy"
            />
          </div>

          <footer className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <button className="btn-ghost inline-flex items-center gap-1.5 rounded-[4px] px-2 py-1" type="button">
              <LikeIcon />
              {20 + Number(post.id.slice(1))}
            </button>
            <button className="btn-ghost inline-flex items-center gap-1.5 rounded-[4px] px-2 py-1" type="button">
              <CommentIcon />
              {8 + Number(post.id.slice(1))}
            </button>
            <button className="btn-ghost inline-flex items-center gap-1.5 rounded-[4px] px-2 py-1" type="button">
              <ShareIcon />
              Поділитися
            </button>
          </footer>
        </article>

        <CommentThread comments={threadComments} className="mt-4" />
      </div>
    </section>
  );
}

