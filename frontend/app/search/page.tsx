import { SearchPageContent } from "@/components/search-page-content";
import { videos } from "@/data/mock";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  return <SearchPageContent videos={videos} initialQuery={params.q ?? ""} />;
}
