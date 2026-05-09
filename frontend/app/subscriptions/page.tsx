import { SubscriptionsPageContent } from "@/components/subscriptions-page-content";
import { listVideos } from "@/services/metadataService";

export default async function SubscriptionsPage() {
  const videos = await listVideos();
  return <SubscriptionsPageContent videos={videos} />;
}

