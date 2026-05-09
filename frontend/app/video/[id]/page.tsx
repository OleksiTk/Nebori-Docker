import Link from "next/link";
import { threadComments } from "@/data/mock";
import { VideoDescription } from "@/components/video-description";
import { CustomVideoPlayer } from "@/components/custom-video-player";
import { CommentThread } from "@/components/comment-thread";
import { ProfileHoverCard } from "@/components/profile-hover-card";
import { getVideoMetadata, listVideos } from "@/services/metadataService";
import { MINIO_API_URL, UPLOAD_API_URL } from "@/services/api";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDuration(seconds: number | null) {
  if (seconds === null) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatViews(count: number) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)} млн`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)} тис.`;
  return count.toString();
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "щойно";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} хв тому`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} год тому`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} дн тому`;
  return date.toLocaleDateString();
}

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
  const current = await getVideoMetadata(id);
  const allVideos = await listVideos();
  const recommended = allVideos.filter((v) => v.id !== current.id).slice(0, 12);
  console.log(current, "vido");

  // Get the best available HLS URL (prefer higher resolutions)
  const hlsUrls = current.hls_urls || {};
  // const resolutions = Object.keys(hlsUrls).sort((a, b) => {
  //   const resA = parseInt(a) || 0;
  //   const resB = parseInt(b) || 0;
  //   return resB - resA;
  // });
  // let videoSrc = resolutions.length > 0 ? hlsUrls[resolutions[0]] : "";
  const resolutions = Object.keys(hlsUrls)
    .filter((k) => k !== "audio")
    .sort((a, b) => (parseInt(b) || 0) - (parseInt(a) || 0));

  let videoSrc = resolutions.length > 0 ? hlsUrls[resolutions[0]] : "";
  if (videoSrc && !videoSrc.startsWith("http")) {
    videoSrc = `${MINIO_API_URL}/${videoSrc.replace(/^\//, "")}`;
  }

  // Повні URL для перемикання якості в плеєрі
  const fullHlsUrls: Record<string, string> = {};
  for (const [key, val] of Object.entries(hlsUrls)) {
    if (key === "audio") continue;
    fullHlsUrls[key] = val.startsWith("http")
      ? val
      : `${MINIO_API_URL}/${videoSrc.replace(/^\//, "")}`;
  }
  if (videoSrc && !videoSrc.startsWith("http")) {
    videoSrc = `${UPLOAD_API_URL}/${videoSrc.replace(/^\//, "")}`;
  }
  console.log(videoSrc);

  let poster =
    current.thumbnail_url ||
    `https://picsum.photos/seed/player-${current.id}/1280/720`;
  if (poster && !poster.startsWith("http")) {
    poster = `${UPLOAD_API_URL}/${poster.replace(/^\//, "")}`;
  }
  console.log("hls_urls:", JSON.stringify(current.hls_urls, null, 2));
  console.log("videoSrc:", videoSrc);
  const authorName = `User ${current.user_id}`;
  const authorHandle = authorName.toLowerCase().replace(/\s+/g, "_");

  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)]">
      <section className="min-w-0">
        <CustomVideoPlayer
          src={videoSrc}
          poster={poster}
          initialDuration={formatDuration(current.duration)}
          hlsUrls={hlsUrls} // додай це
        />
        <h1 className="mt-4 text-[2rem] font-bold leading-tight">
          {current.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-[rgba(255,255,255,0.08)] bg-[#15151F] p-3">
          <div className="flex items-center gap-3">
            <ProfileHoverCard
              handle={authorHandle}
              name={authorName}
              avatar={`https://picsum.photos/seed/author-${current.user_id}/80/80`}
              videosCount={29}
              subscribers="12.4 тис."
            >
              <img
                src={`https://picsum.photos/seed/author-${current.user_id}/80/80`}
                alt={authorName}
                className="h-11 w-11 rounded-[6px] border border-[rgba(255,255,255,0.14)] object-cover"
              />
            </ProfileHoverCard>
            <div>
              <ProfileHoverCard
                handle={authorHandle}
                name={authorName}
                avatar={`https://picsum.photos/seed/author-${current.user_id}/80/80`}
                videosCount={29}
                subscribers="12.4 тис."
              >
                <Link
                  href={`/profile/${authorHandle}`}
                  className="text-base font-semibold text-nebori-accent hover:underline"
                >
                  {authorName}
                </Link>
              </ProfileHoverCard>
              <p className="text-xs text-nebori-muted">12.4 тис. підписників</p>
            </div>
            <button className="btn-primary ml-2 rounded-[6px] px-4 py-2 text-sm font-semibold">
              Підписатися
            </button>
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
          <Link
            href={`/profile/${authorHandle}`}
            className="font-semibold text-nebori-accent hover:underline"
          >
            {authorName}
          </Link>
          <span className="text-nebori-muted">
            {formatViews(current.views_count)} переглядів
          </span>
          <span className="text-nebori-muted">
            {formatDate(current.created_at)}
          </span>
        </div>

        <VideoDescription
          preview={current.description || "Опис відео відсутній."}
          fullText={current.description || "Опис відео відсутній."}
          metaLine={`Технічні мітки: render:v1 | id:${current.id} | status:${current.status}`}
        />

        <CommentThread comments={threadComments} className="mt-8" />
      </section>

      <aside className="min-w-0">
        <h3 className="mb-4 border-l-2 border-nebori-accent pl-3 text-sm font-bold uppercase tracking-[0.14em] text-nebori-text">
          Рекомендовані
        </h3>
        <div className="space-y-2">
          {recommended.map((item, idx) => {
            const recAuthorName = `User ${item.user_id}`;
            const recAuthorHandle = recAuthorName
              .toLowerCase()
              .replace(/\s+/g, "_");

            let recThumbnail = item.thumbnail_url;
            if (recThumbnail && !recThumbnail.startsWith("http")) {
              recThumbnail = `${UPLOAD_API_URL}/${recThumbnail.replace(/^\//, "")}`;
            }

            return (
              <div
                key={item.id}
                className="group flex gap-2 rounded-[4px] px-1 py-1.5 hover:bg-[rgba(255,255,255,0.04)]"
              >
                <Link
                  href={`/video/${item.id}`}
                  className="relative h-[94px] w-[168px] flex-none overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.1)] transition-all duration-150 group-hover:border-[rgba(245,197,24,0.35)]"
                >
                  <img
                    src={
                      recThumbnail ||
                      `https://picsum.photos/seed/reco-${item.id}/336/188`
                    }
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
                    {formatDuration(item.duration)}
                  </span>
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/video/${item.id}`}
                    className="line-clamp-2 text-[15px] font-semibold leading-5 text-[#e6e9f3]"
                  >
                    {item.title}
                  </Link>
                  <ProfileHoverCard
                    handle={recAuthorHandle}
                    name={recAuthorName}
                    avatar={`https://picsum.photos/seed/avatar-${item.user_id}/64/64`}
                    videosCount={19}
                    subscribers={`5.8 тис.`}
                    className="mt-1 block"
                  >
                    <div className="flex items-start gap-1.5">
                      <img
                        src={`https://picsum.photos/seed/avatar-${item.user_id}/64/64`}
                        alt={recAuthorName}
                        className="mt-0.5 h-6 w-6 flex-none rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/profile/${recAuthorHandle}`}
                          className="block truncate text-xs font-semibold text-[#d6dcec] hover:text-nebori-accent"
                        >
                          {recAuthorName}
                        </Link>
                        <p className="truncate text-[11px] leading-4 text-nebori-muted">
                          {formatViews(item.views_count)} переглядів
                        </p>
                        <p className="truncate text-[11px] leading-4 text-nebori-muted">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                    </div>
                  </ProfileHoverCard>
                </div>
                <button
                  type="button"
                  className="self-start rounded-[4px] p-1 text-nebori-muted hover:bg-[rgba(255,255,255,0.08)] hover:text-nebori-text"
                >
                  <MoreIcon />
                </button>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
