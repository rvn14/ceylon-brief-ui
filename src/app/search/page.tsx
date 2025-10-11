import { AlertCircle } from "lucide-react";
import { buildMetadata } from "@/utils/seo";
import PaginatedNews from "@/components/PaginatedNews";
import { NewsItem } from "@/types/news";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};


export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = params.query;
  const query =
    typeof rawQuery === "string"
      ? rawQuery
      : Array.isArray(rawQuery)
      ? rawQuery[0]
      : "";

  if (!query) {
    return buildMetadata({
      title: "Search News",
      description: "Search CeylonBrief for the latest headlines and in-depth coverage from Sri Lanka.",
      path: "/search",
      keywords: ["CeylonBrief search", "Sri Lanka news search"],
    });
  }

  return buildMetadata({
    title: `Search results for "${query}"`,
    description: `Discover the latest articles, reports, and headlines related to ${query} on CeylonBrief.`,
    path: `/search?query=${encodeURIComponent(query)}`,
    keywords: ["CeylonBrief search", `${query} news`, `Sri Lanka ${query}`],
  });
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  // Await searchParams before accessing properties
  const params = await searchParams;
  const queryValue = params.query;
  const pageParam = params.page;
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const pageNumber = Number.parseInt(pageValue ?? "1", 10);
  const currentPage = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  const query =
    typeof queryValue === "string"
      ? queryValue
      : Array.isArray(queryValue)
      ? queryValue[0]
      : "";

  let data: NewsItem[] = [];
  let error: string | null = null;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await fetch(
      `${apiBaseUrl}/search?query=${encodeURIComponent(query)}`,
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
    console.error("Fetch error:", err);
    error = "Failed to fetch news. Please try again later.";
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-background p-4 sm:p-5 md:p-6 lg:p-8">
      {error ? (
        <div className="w-full max-w-4xl mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      ) : data.length === 0 && query ? (
        <div className="w-full max-w-4xl mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-700">
            No results found for "{query}". Try a different search term.
          </p>
        </div>
      ) : (
        <>
          {query && (
            <div className="w-full mb-6 px-4 bg-primary-foreground border-l-4 border-red-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 border-b">
                <h2 className="text-lg font-medium text-gray-800">
                  Search results for:{" "}
                  <span className="font-bold text-primary">{query}</span>
                </h2>
                <p className="text-sm text-gray-600">
                  {data.length}{" "}
                  {data.length === 1 ? "result" : "results"} found
                </p>
              </div>
            </div>
          )}
          <PaginatedNews
            newsItems={data}
            currentPage={currentPage}
            basePath="/search"
            searchParams={params}
          />
        </>
      )}
    </div>
  );
};

export default SearchPage;
