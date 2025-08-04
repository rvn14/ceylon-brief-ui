
import Highlights from "@/components/Highlights";
import ClientPaginatedNews from "@/components/ClientPaginatedNews";
import { LegacyNewsItem } from "@/types/news";

const HomePage = async () => {
  let data: LegacyNewsItem[] = [];
  let error: string | null = null;

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

  const newsData = data;

  return (
    <div className="bg-background p-2 md:p-16 md:px-28">
      <div className="pt-6 pb-8 flex justify-center items-center">
        <Highlights news={newsData} />
      </div>
      <div className="font-semibold justify-center w-full items-center mb-8 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Latest News</h2>
          <div className="w-full h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></div>
        </div>
      </div>

      <ClientPaginatedNews newsItems={newsData} />
    </div>
  );
};

export default HomePage;
