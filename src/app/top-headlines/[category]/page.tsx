/* eslint-disable @typescript-eslint/no-unused-vars */
import PaginatedNewsList from "@/components/PaginatedNewsList";

interface Article {
  url: string;
  content: string;
  category: string;
  id: string;
  source: string;
  cover_image: string;
  date_published: string | { $date: string };
  title: string;
  week: string;
}

interface NewsItem {
  _id: string;
  id: string;
  category: string;
  url: string;
  source: string;
  cover_image: string;
  date_published: string;
  short_summary: string;
  long_summary: string;
  representative_title?: string;
  title: string;
  group_id?: string | null;
  articles?: Article[];
}

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
  params: {
    category: string;
  };
}

export default async function TopHeadlines({ params }: PageProps) {
  const { category } = await params;
  const formattedCatogory =
    category.charAt(0).toUpperCase() + category.slice(1);

  let data: NewsItem[] = [];
  let error = null;

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/news?category=${encodeURIComponent(formattedCatogory || "general")}`,
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
            {category.charAt(0).toUpperCase() + category.slice(1)} Stories
          </h2>
          <div className="w-full h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-2">
        <PaginatedNewsList newsItems={data} />
      </div>
    </div>
  );
}
