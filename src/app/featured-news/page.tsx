import ReactMarkdown from "react-markdown";
import { buildMetadata } from "@/utils/seo";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const WEEKS_PER_PAGE = 4;
const DEFAULT_PAGE = 1;

interface FeatureArticleGroup {
  id: string | number;
  feature_articles: Record<string, string>;
}

type FeatureResponse = Record<string, FeatureArticleGroup[]>;
type SearchParams = Record<string, string | string[] | undefined>;

type FeaturedNewsPageProps = {
  searchParams: Promise<SearchParams>;
};

const formatDateKey = (key: string) => {
  const parts = key.split("_");
  if (parts.length < 3) return key;

  const [year, monthRaw, weekRaw] = parts;
  const monthIndex = Number.parseInt(monthRaw, 10) - 1;
  const weekMatch = weekRaw.match(/WEEK(\d+)/i);
  const weekNumber = weekMatch ? weekMatch[1] : weekRaw;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[monthIndex] ?? `Month ${monthRaw}`;
  const paddedWeek = weekNumber.padStart(2, "0");

  return `${monthName} ${year} - week ${paddedWeek}`;
};

const clampPage = (value: number, totalPages: number) => {
  if (totalPages < 1) return DEFAULT_PAGE;
  return Math.min(Math.max(value, DEFAULT_PAGE), totalPages);
};

const getNumericPage = (raw: string | undefined) => {
  const parsed = Number.parseInt(raw ?? `${DEFAULT_PAGE}`, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PAGE;
};

const getPageSequence = (currentPage: number, totalPages: number) => {
  const maxVisible = 7;
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const sequence: (number | "ellipsis")[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    sequence.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    sequence.push(page);
  }

  if (end < totalPages - 1) {
    sequence.push("ellipsis");
  }

  sequence.push(totalPages);

  return sequence;
};

const buildHref = (
  targetPage: number,
  basePath: string,
  searchParams: SearchParams
) => {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (key === "page" || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
      return;
    }

    params.set(key, value);
  });

  params.set("page", `${targetPage}`);
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
};

const toArray = (value: unknown): FeatureArticleGroup[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value as FeatureArticleGroup[];
  return [];
};


export const metadata = buildMetadata({
  title: "Weekly Featured Articles",
  description: "Explore the curated weekly feature articles from CeylonBrief across politics, business, sports, and more.",
  path: "/featured-news",
  keywords: ["feature articles", "Sri Lanka weekly news", "CeylonBrief features"],
});

export default async function FeaturedNewsPage({
  searchParams,
}: FeaturedNewsPageProps) {
  const params = await searchParams;
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
  const requestedPage = getNumericPage(pageParam);

  let featureData: FeatureResponse = {};
  let error: string | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/all_feature_articles`,
      {
        next: { revalidate: 600 },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const payload = await response.json();

    if (payload?.success === false) {
      error = payload?.message ?? "Unable to load featured articles.";
    } else if (payload?.data) {
      featureData = payload.data as FeatureResponse;
    } else {
      featureData = payload as FeatureResponse;
    }
  } catch (err) {
    console.error("Feature news fetch error", err);
    error = "Failed to fetch featured articles. Please try again later.";
  }

  const featureKeys = Object.keys(featureData);
  const sortedKeys = featureKeys.sort((a, b) => b.localeCompare(a));
  const totalPages = Math.max(1, Math.ceil(sortedKeys.length / WEEKS_PER_PAGE));
  const currentPage = clampPage(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * WEEKS_PER_PAGE;
  const currentKeys = sortedKeys.slice(startIndex, startIndex + WEEKS_PER_PAGE);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-primary mb-12 border-b pb-4">
          Weekly Features
        </h1>

        {error ? (
          <div className="mx-auto mb-8 max-w-3xl rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!error && currentKeys.length === 0 ? (
          <div className="mx-auto mb-8 max-w-3xl rounded-md border border-muted bg-muted/30 p-6 text-center text-muted-foreground">
            No featured articles available right now.
          </div>
        ) : null}

        <div className="flex flex-col gap-10">
          {currentKeys.map((key) => (
            <section key={key} className="w-full">
              <h2 className="text-2xl font-semibold text-primary mb-6 border-l-4 border-red-500 pl-3">
                {formatDateKey(key)}
              </h2>

              <div className="flex flex-col gap-6">
                {toArray(featureData[key]).map((item) => (
                  <article key={item.id} className="space-y-6">
                    {Object.entries(item.feature_articles).map(
                      ([articleTitle, articleContent]) => (
                        <div
                          key={`${item.id}-${articleTitle}`}
                          className="bg-white dark:bg-darkprimary rounded-lg shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden"
                        >
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-primary mb-4">
                              {articleTitle}
                            </h3>
                            <div className="prose dark:prose-invert prose-sm text-primary/80 leading-relaxed">
                              <ReactMarkdown>{articleContent}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {totalPages > 1 ? (
          <Pagination className="mt-12">
            <PaginationContent>
              {currentPage > 1 ? (
                <PaginationItem>
                  <PaginationPrevious
                    href={buildHref(currentPage - 1, "/featured-news", params)}
                  />
                </PaginationItem>
              ) : null}

              {getPageSequence(currentPage, totalPages).map((entry, index) => (
                <PaginationItem key={`${entry}-${index}`}>
                  {entry === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href={buildHref(entry, "/featured-news", params)}
                      isActive={entry === currentPage}
                    >
                      {entry}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {currentPage < totalPages ? (
                <PaginationItem>
                  <PaginationNext
                    href={buildHref(currentPage + 1, "/featured-news", params)}
                  />
                </PaginationItem>
              ) : null}
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </div>
  );
}
