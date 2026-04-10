import Link from "next/link";
import { threadComments, videos } from "@/data/mock";
import { VideoDescription } from "@/components/video-description";
import { CustomVideoPlayer } from "@/components/custom-video-player";
import { CommentThread } from "@/components/comment-thread";
import { ProfileHoverCard } from "@/components/profile-hover-card";

type PageProps = {
  params: Promise<{ id: string }>;
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

function Share2Icon() {
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

function SaveIcon() {
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
      className="lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M12 17V3" />
      <path d="m6 11 6 6 6-6" />
      <path d="M19 21H5" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4">
      <circle cx="8" cy="3" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="8" cy="13" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;
  const current = videos.find((v) => v.id === id) ?? videos[0];
  const recommended = videos.filter((v) => v.id !== current.id).slice(0, 12);
  const demoVideoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const demoPoster = `https://picsum.photos/seed/player-${current.id}/1280/720`;

  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)]">
      <section className="min-w-0">
        <CustomVideoPlayer src={demoVideoSrc} poster={demoPoster} initialDuration={current.duration} />
        <h1 className="mt-4 text-[2rem] font-bold leading-tight">{current.title}</h1>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-[rgba(255,255,255,0.08)] bg-[#15151F] p-3">
          <div className="flex items-center gap-3">
            <ProfileHoverCard
              handle={current.author.toLowerCase().replace(/\s+/g, "_")}
              name={current.author}
              avatar={`https://picsum.photos/seed/author-${encodeURIComponent(current.author)}/80/80`}
              videosCount={29}
              groupsCount={4}
              subscribers="12.4 тис."
            >
              <img
                src={`https://picsum.photos/seed/author-${encodeURIComponent(current.author)}/80/80`}
                alt={current.author}
                className="h-11 w-11 rounded-[6px] border border-[rgba(255,255,255,0.14)] object-cover"
              />
            </ProfileHoverCard>
            <div>
              <ProfileHoverCard
                handle={current.author.toLowerCase().replace(/\s+/g, "_")}
                name={current.author}
                avatar={`https://picsum.photos/seed/author-${encodeURIComponent(current.author)}/80/80`}
                videosCount={29}
                groupsCount={4}
                subscribers="12.4 тис."
              >
                <Link href={`/profile/${current.author.toLowerCase()}`} className="text-base font-semibold text-nebori-accent hover:underline">
                  {current.author}
                </Link>
              </ProfileHoverCard>
              <p className="text-xs text-nebori-muted">12.4 тис. підписників</p>
            </div>
            <button className="btn-primary ml-2 rounded-[6px] px-4 py-2 text-sm font-semibold">Підписатися</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost flex items-center gap-1.5 rounded-[6px] px-3 py-2 text-sm">
              <LikeIcon />
              1.2 тис.
            </button>
            <button className="btn-ghost flex items-center gap-1.5 rounded-[6px] px-3 py-2 text-sm">
              <DislikeIcon />
              32
            </button>
            <button className="btn-ghost flex items-center gap-1.5 rounded-[6px] px-3 py-2 text-sm">
              <Share2Icon />
              {"\u041f\u043e\u0434\u0456\u043b\u0438\u0442\u0438\u0441\u044f"}
            </button>
            <button className="btn-ghost flex items-center gap-1.5 rounded-[6px] px-3 py-2 text-sm">
              <SaveIcon />
              {"\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438"}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[rgba(255,255,255,0.08)] pb-4 text-sm">
          <Link href={`/profile/${current.author.toLowerCase()}`} className="font-semibold text-nebori-accent hover:underline">
            {current.author}
          </Link>
          <span className="text-nebori-muted">{current.views} переглядів</span>
          <span className="text-nebori-muted">{current.date}</span>
          <div className="flex flex-wrap gap-2">
            {current.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-[#141925] px-2 py-1 font-mono text-[11px] text-[#b8c0d4]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <VideoDescription
          preview="Опис відео. Тут розміщується контекст випуску, корисні посилання та службова інформація автора."
          fullText="Опис відео. Тут розміщується контекст випуску, корисні посилання та службова інформація автора. У повній версії опису можна додати додаткові примітки, таймкоди, відсилки до минулих випусків, правила обговорення та інші деталі, як це зроблено на YouTube."
          metaLine="Технічні мітки: render:v1 | locale:uk | ui:nebori"
        />

        <CommentThread comments={threadComments} className="mt-8" />
      </section>

      <aside className="min-w-0">
        <h3 className="mb-4 border-l-2 border-nebori-accent pl-3 text-sm font-bold uppercase tracking-[0.14em] text-nebori-text">
          Рекомендовані
        </h3>
        <div className="space-y-2">
          {recommended.map((item, idx) => (
            <div key={item.id} className="group flex gap-2 rounded-[4px] px-1 py-1.5 hover:bg-[rgba(255,255,255,0.04)]">
              <Link
                href={`/video/${item.id}`}
                className="relative h-[94px] w-[168px] flex-none overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.1)] transition-all duration-150 group-hover:border-[rgba(245,197,24,0.35)]"
              >
                <img
                  src={`https://picsum.photos/seed/reco-${item.id}/336/188`}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-150 group-hover:scale-[1.03] group-hover:brightness-110"
                  loading="lazy"
                />
                {idx < 3 && (
                  <span className="absolute left-1 top-1 rounded-[3px] bg-[rgba(245,197,24,0.92)] px-1 py-[1px] text-[10px] font-semibold uppercase tracking-[0.04em] text-black">
                    Новинка
                  </span>
                )}
                <span className="absolute bottom-1.5 right-1.5 rounded-[3px] bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {item.duration}
                </span>
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/video/${item.id}`} className="line-clamp-2 text-[15px] font-semibold leading-5 text-[#e6e9f3]">
                  {item.title}
                </Link>
                <ProfileHoverCard
                  handle={item.author.toLowerCase().replace(/\s+/g, "_")}
                  name={item.author}
                  avatar={`https://picsum.photos/seed/avatar-${encodeURIComponent(item.author)}/64/64`}
                  videosCount={19}
                  groupsCount={2}
                  subscribers={`5.8 ${"\u0442\u0438\u0441."}`}
                  className="mt-1 block"
                >
                  <div className="flex items-start gap-1.5">
                    <img
                      src={`https://picsum.photos/seed/avatar-${encodeURIComponent(item.author)}/64/64`}
                      alt={item.author}
                      className="mt-0.5 h-6 w-6 flex-none rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/profile/${item.author.toLowerCase().replace(/\s+/g, "_")}`}
                        className="block truncate text-xs font-semibold text-[#d6dcec] hover:text-nebori-accent"
                      >
                        {item.author}
                      </Link>
                      <p className="truncate text-[11px] leading-4 text-nebori-muted">
                        {item.views} {"\u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434\u0456\u0432"}
                      </p>
                      <p className="truncate text-[11px] leading-4 text-nebori-muted">{item.date}</p>
                    </div>
                  </div>
                </ProfileHoverCard>
              </div>
              <button type="button" className="self-start rounded-[4px] p-1 text-nebori-muted hover:bg-[rgba(255,255,255,0.08)] hover:text-nebori-text">
                <MoreIcon />
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
