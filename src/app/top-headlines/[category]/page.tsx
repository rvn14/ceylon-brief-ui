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
  const category =
    params.category.charAt(0).toUpperCase() + params.category.slice(1);

  let data: TopHeadlineItem[] = [];
  let error = null;

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL
      }/api/news?category=${encodeURIComponent(category || "general")}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const json = await response.json();

    if (json.success) {
      data = json.data;
    } else {
      error = json.message || "An error occurred";
      
    }
  } catch (err) {
    console.error("Fetch error:", err);
    error = "Failed to fetch news. Please try again later.";
    
  }

  return (
    <div className="bg-background p-2 md:p-16">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="font-semibold justify-center w-full items-center mb-8">
        <div className="w-fit flex text-3xl font-bold font-inter">
          <span>{category} News</span>
        </div>
        <div className="border-1 border-primary w-full opacity-60 mb-8"></div>
      </div>
      <div className="flex flex-col justify-center items-center mb-8 p-2 md:p-10">
        <PaginatedNewsList newsItems={data} />
      </div>
    </div>
  );
}
