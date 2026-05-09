import { PopularPageContent } from "@/components/popular-page-content";
import { listVideos } from "@/services/metadataService";

export default async function PopularPage() {
  const videos = await listVideos();
  return <PopularPageContent videos={videos} />;
}

