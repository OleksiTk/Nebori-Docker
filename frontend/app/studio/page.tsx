import { StudioPageClient } from "@/components/studio-page-client";
import { videos } from "@/data/mock";

export default function StudioPage() {
  return <StudioPageClient videos={videos} />;
}

