import { PopularPageContent } from "@/components/popular-page-content";
import { videos } from "@/data/mock";

export default function PopularPage() {
  return <PopularPageContent videos={videos} />;
}

