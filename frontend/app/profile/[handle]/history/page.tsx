import { ProfileHistoryPageClient } from "@/components/profile-history-page-client";

type PageProps = {
  params: Promise<{ handle: string }>;
};

export default async function ProfileHistoryPage({ params }: PageProps) {
  const { handle } = await params;
  return <ProfileHistoryPageClient handle={handle} />;
}
