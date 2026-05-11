import { HomePageContent } from "@/components/home-page-content";
import { listVideos } from "@/services/metadataService";

export default async function HomePage() {
  const videos = await listVideos();
  console.log(videos, "take vidoe");

  return <HomePageContent videos={videos} />;
}
