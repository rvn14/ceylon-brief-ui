import PaginatedNews from "@/components/PaginatedNews";
import { Article, NewsItem } from "@/types/news";
import { dummy } from "@/utils/dummyData";
import { buildMetadata } from "@/utils/seo";

interface TopHeadlineItem {
  _id: string;
  id: string;
  category: string;
  url: string;
  source: string;
  cover_image: string;
  date_published: string | { $date: string };
  short_summary: string;
  long_summary: string;
  representative_title?: string;
  title: string;
  group_id?: string | null;
  articles?: Article[];
}

interface PageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}


export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return buildMetadata({
    title: `${formattedCategory} Headlines`,
    description: `Catch up on the latest ${formattedCategory.toLowerCase()} stories curated by CeylonBrief.`,
    path: `/top-headlines/${category}`,
    keywords: [
      `${formattedCategory} news`,
      `Sri Lanka ${formattedCategory.toLowerCase()}`,
      `${formattedCategory} headlines`
    ],
  });
}

export default async function TopHeadlines({ params, searchParams }: PageProps) {
  const { category } = await params;
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);
  const dummtData = dummy
  const queryParams = await searchParams;
  const pageParam = queryParams.page;
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const pageNumber = Number.parseInt(pageValue ?? "1", 10);
  const currentPage = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  // let data: NewsItem[] = [];
  let data = dummy
  let error = null;

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/news?category=${encodeURIComponent(formattedCategory || "general")}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const json = await response.json();

    if (json.success) {
      data = json.data
        .map((item: TopHeadlineItem) => ({
          ...item,
          date_published:
            typeof item.date_published === "string"
              ? item.date_published
              : item.date_published.$date,
        }))
        .sort((a: TopHeadlineItem, b: TopHeadlineItem) => {
          const dateA = new Date(a.date_published as string);
          const dateB = new Date(b.date_published as string);
          return dateB.getTime() - dateA.getTime(); // Sort from newest to oldest
        });
    } else {
      error = json.message || "An error occurred";
    }
  } catch (err) {
    console.error("Fetch error:", err);
    error = "Failed to fetch news. Please try again later.";
  }

  return (
    <div className="bg-background p-2 md:p-16 md:px-28 pt-16 min-h-screen">
      <div className="font-semibold justify-center w-full items-center mb-8 px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {formattedCategory} Stories
          </h2>
          <div className="w-full h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></div>
        </div>
      </div>

      {error ? (
        <div className="w-full max-w-4xl mx-auto mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col justify-center items-center p-2">
        <PaginatedNews
          newsItems={data}
          currentPage={currentPage}
          basePath={`/top-headlines/${category}`}
          searchParams={queryParams}
        />
      </div>
    </div>
  );
}
