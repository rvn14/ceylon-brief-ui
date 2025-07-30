import Image from "next/image";
import { Globe } from "lucide-react";

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

interface PageProps {
  params: {
    category: string;
    id: string;
  };
}

const formatDate = (
  dateString: string | { $date: string | number } | undefined
): string => {
  try {
    if (!dateString) return "Date unavailable";

    // Extract the date value
    let dateValue: string | number;

    // Handle object with $date property
    if (typeof dateString === "object" && "$date" in dateString) {
      dateValue = dateString.$date;
    } else {
      dateValue = dateString as string;
    }

    // Create date from the extracted value
    const date =
      typeof dateValue === "number" ? new Date(dateValue) : new Date(dateValue);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (err) {
    console.error("Date formatting error:", err);
    return "Invalid date";
  }
};

const getSourceIcon = (url: string) => {
  if (!url) return <Globe className="h-6 w-6" />;

  const domain = url.toLowerCase();

  if (domain.includes("newsfirst"))
    return (
      <Image
        width={200}
        height={200}
        src="/images/newsfirst.jpeg"
        alt="News First"
        className="h-6 w-6"
      />
    );
  if (domain.includes("adaderana"))
    return (
      <Image
        width={200}
        height={200}
        src="/images/derana.png"
        alt="News First"
        className="h-6 w-6"
      />
    );
  if (domain.includes("hirunews"))
    return (
      <Image
        width={200}
        height={200}
        src="/images/hiru.jpg"
        alt="Hiru News"
        className="h-6 w-6"
      />
    );
  if (domain.includes("siyathanews"))
    return (
      <Image
        width={200}
        height={200}
        src="/images/siyatha.png"
        alt="Siyatha News"
        className="h-6 w-6"
      />
    );
  if (domain.includes("colombotimes"))
    return (
      <Image
        width={200}
        height={200}
        src="/images/colombotimes.jpg"
        alt="Colombo Times"
        className="h-6 w-6"
      />
    );
  if (domain.includes("gagana"))
    return (
      <Image
        width={200}
        height={200}
        src="/images/gagana.jpg"
        alt="Gagana News"
        className="h-6 w-6"
      />
    );

  return <Globe className="h-6 w-6" />;
};

const page = async ({ params }: PageProps) => {
  const { id, category } = await params;

  const formatedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  let news: NewsItem | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/news?category=${formatedCategory}&id=${id}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      news = result.data;
    } else {
      error = result.message || "An error occurred";
    }
  } catch (err) {
    console.error("Fetch error:", err);
    error = "Failed to fetch news. Please try again later.";
  }

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
          <div>
            <div className="text-xl font-medium text-black">Error</div>
            <p className="text-gray-500">
              {error || "Failed to load news content"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isGroup = !!news.articles && news.articles.length > 0;
  const mainArticle = isGroup && news.articles ? news.articles[0] : news;

  // Extract unique sources if it's a group
  const uniqueSources =
    isGroup && news.articles
      ? [...new Set(news.articles.map((article) => article.url))]
      : [];

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-background p-4 md:p-6">
      <div className="w-full max-w-4xl mx-auto pb-16">
        {/* Category Badge */}
        {category && (
          <div className="mb-4 flex justify-between items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-800 text-white shadow-sm">
              {category}
            </span>
            <span className="">
              {formatDate(
                isGroup && news.articles && news.articles[0]
                  ? news.articles[0].date_published
                  : news.date_published
              )}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          className="text-3xl sm:text-5xl font-black pb-4 sm:pb-6 leading-tight"
          style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}
        >
          {isGroup ? news.representative_title! : news.title}
        </h1>

        {/* Image */}
        {(isGroup
          ? news.articles && news.articles[0].cover_image
          : news.cover_image) && (
          <div className="w-full flex justify-center mb-8">
            <Image
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
              src={isGroup ? news.articles![0].cover_image : news.cover_image}
              alt={mainArticle?.title ?? "News cover image"}
              width={600}
              height={400}
            />
          </div>
        )}

        {/* Summary */}
        <section className="pt-4 w-full">
          <p className="leading-relaxed">{news.long_summary}</p>
        </section>

        {/* News Provider */}
        <section className="pt-6">
          <h3 className="text-xl font-semibold mb-3">News Sources</h3>
          {!isGroup ? (
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                {getSourceIcon(news.source)}
              </div>
            </a>
          ) : uniqueSources.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {uniqueSources.map((source, idx) => (
                <a
                  key={idx}
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center max-w-[100px] hover:opacity-80 transition-opacity"
                >
                  <div className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors mb-2">
                    {getSourceIcon(source)}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No source available</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default page;
