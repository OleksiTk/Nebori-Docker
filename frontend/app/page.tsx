import { HomePageContent } from "@/components/home-page-content";
import { videos } from "@/data/mock";

export default function HomePage() {
  return <HomePageContent videos={videos} />;
}
