import Link from "next/link";
import type { VideoRead } from "@/services/metadataService";
import { ProfileHoverCard } from "@/components/profile-hover-card";
import { UPLOAD_API_URL } from "@/services/api";

type VideoCardProps = {
  item: VideoRead;
  index: number;
  rank?: number;
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

function rankBadgeClasses(rank: number) {
  if (rank === 1) {
    return "border-[#f5c534] bg-[rgba(245,197,52,0.92)] text-black";
  }
  if (rank === 2) {
    return "border-[#c8d2e3] bg-[rgba(200,210,227,0.92)] text-[#101624]";
  }
  if (rank === 3) {
    return "border-[#ce8c50] bg-[rgba(206,140,80,0.92)] text-[#14100a]";
  }
  return "border-[rgba(255,255,255,0.2)] bg-[rgba(15,20,30,0.78)] text-[#d3dcef]";
}

export function VideoCard({ item, index, rank }: VideoCardProps) {
  const isNew = index % 3 !== 1;
  const quality = index % 4 === 0 ? "720p" : "1080p";
  const authorName = `User ${item.user_id}`; // Placeholder since we don't have author name
  const profileHandle = authorName.toLowerCase().replace(/\s+/g, "_");
  const profileAvatar = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(authorName)}`;

  let thumbnailUrl = item.thumbnail_url;
  if (thumbnailUrl && !thumbnailUrl.startsWith("http")) {
    thumbnailUrl = `${UPLOAD_API_URL}/${thumbnailUrl.replace(/^\//, "")}`;
  }

  return (
    <article className="group rounded-[4px] border border-transparent p-0.5 transition-all duration-150 hover:border-[rgba(245,197,24,0.28)] hover:bg-[rgba(255,255,255,0.04)]">
      <Link href={`/video/${item.id}`} className="block">
        <div className="relative aspect-video overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.12)]">
          <img
            src={
              thumbnailUrl ||
              `https://picsum.photos/seed/nebori-${item.id}/640/360`
            }
            alt={item.title}
            className="h-full w-full object-cover transition duration-150 group-hover:scale-[1.03]"
            loading="lazy"
          />
          {isNew && (
            <span className="absolute left-1 top-1 rounded-[3px] bg-[rgba(245,197,24,0.92)] px-1 py-[1px] text-[10px] font-semibold uppercase tracking-[0.04em] text-black">
              {"\u041d\u043e\u0432\u0438\u043d\u043a\u0430"}
            </span>
          )}
          <span className="absolute right-1 top-1 rounded-[3px] border border-[rgba(255,255,255,0.2)] bg-[rgba(15,20,30,0.78)] px-1 py-[1px] text-[10px] font-semibold uppercase text-[#c5cedf]">
            {quality}
          </span>
          <span className="absolute bottom-1.5 right-1.5 rounded-[3px] bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {formatDuration(item.duration)}
          </span>
          {typeof rank === "number" && (
            <span
              className={`absolute bottom-1.5 left-1.5 rounded-[3px] border px-1.5 py-0.5 text-[11px] font-bold ${rankBadgeClasses(rank)}`}
            >
              #{rank}
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-1 px-0.5 pb-0.5 pt-1.5">
        <Link
          href={`/video/${item.id}`}
          className="line-clamp-2 text-[15px] font-semibold leading-5 text-[#e6e9f3]"
        >
          {item.description}
        </Link>

        <ProfileHoverCard
          handle={profileHandle}
          name={authorName}
          avatar={profileAvatar}
          videosCount={23}
          subscribers={`12.4 ${"\u0442\u0438\u0441."}`}
          className="block"
        >
          <div className="flex items-start gap-1.5">
            <img
              src={profileAvatar}
              alt={authorName}
              className="mt-0.5 h-6 w-6 flex-none rounded-[2px] border border-[rgba(255,255,255,0.2)] object-cover"
              loading="lazy"
            />
            <div className="min-w-0">
              <Link
                href={`/profile/${profileHandle}`}
                className="block truncate text-xs font-semibold text-[#d6dcec] hover:text-nebori-accent"
              >
                {authorName}
              </Link>
              <p className="truncate text-[11px] leading-4 text-nebori-muted">
                {formatViews(item.views_count)}{" "}
                {"\u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434\u0456\u0432"}
              </p>
              <p className="truncate text-[11px] leading-4 text-nebori-muted">
                {formatDate(item.created_at)}
              </p>
            </div>
          </div>
        </ProfileHoverCard>
      </div>
    </article>
  );
}
