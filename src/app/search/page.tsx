import React, { FC } from "react";
import { AlertCircle } from "lucide-react";
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

type Props = {
  searchParams: {
    query?: string;
  };
};

const page: FC<Props> = async ({ searchParams }) => {
  // Await searchParams before accessing properties
  const params = await searchParams;
  const queryValue = params.query;
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
      `${apiBaseUrl}/api/search?query=${encodeURIComponent(query)}`,
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
          <PaginatedNewsList newsItems={data} />
        </>
      )}
    </div>
  );
};

export default page;
