
import Highlights from "@/components/Highlights";
import { buildMetadata } from "@/utils/seo";
import PaginatedNews from "@/components/PaginatedNews";
import { LegacyNewsItem } from "@/types/news";
import { dummy } from "@/utils/dummyData";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export const metadata = buildMetadata({
  title: "Latest Sri Lankan Headlines",
  description: "Catch up on the most recent political, business, sports, and technology stories curated by CeylonBrief.",
  path: "/",
  keywords: ["Sri Lanka news", "CeylonBrief", "latest headlines", "Sri Lankan politics", "business news"],
});

const HomePage = async ({ searchParams }: PageProps) => {
  let data: LegacyNewsItem[] = [];
  let error: string | null = null;
  const dummyData = dummy;
  const params = await searchParams;
  const pageParam = params?.page;
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const currentPage = Number.parseInt(pageValue ?? "1", 10);
  const safeCurrentPage = Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/latest-news`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      data = result.data;
    } else {
      error = result.message || "An error occurred";
    }
  } catch (err) {
    error = "Failed to fetch news. Please try again later.";
    console.error("Fetch error:", err, error);
  }

  const newsData = dummyData;

  return (
    <div className="bg-background px-3 sm:px-6 lg:px-20 xl:px-28 py-6 sm:py-12">
      <div className="w-full max-w-8xl mx-auto pt-4 sm:pt-6 pb-8 flex justify-center items-center">
        <Highlights news={newsData} />
      </div>
      <div className="w-full max-w-8xl mx-auto font-semibold justify-center items-center mb-8 px-2 sm:px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest News</h2>
          <div className="w-full h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></div>
        </div>
      </div>

      {error ? (
        <div className="w-full max-w-3xl mx-auto mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="w-full max-w-8xl mx-auto">
        <PaginatedNews
          newsItems={newsData}
          currentPage={safeCurrentPage}
          basePath="/"
          searchParams={params}
        />
      </div>
    </div>
  );
};

export default HomePage;
