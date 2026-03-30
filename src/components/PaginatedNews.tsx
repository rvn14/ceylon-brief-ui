import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import EverythingCard from "@/components/EverythingCard";
import { LegacyNewsItem, NewsItem } from "@/types/news";

const DEFAULT_IMAGE = "/images/News_web.jpg";

type SearchParams = Record<string, string | string[] | undefined>;

type CombinedNewsItem = NewsItem | LegacyNewsItem;

type NormalizedNewsItem = {
  id: string;
  title: string;
  description: string;
  summary: string;
  imgUrl: string;
  publishedDate: string;
  newsProvider?: string | null;
  category: string;
};

interface PaginatedNewsProps {
  newsItems: CombinedNewsItem[];
  currentPage: number;
  itemsPerPage?: number;
  basePath: string;
  searchParams?: SearchParams;
}

const isLegacyNewsItem = (item: CombinedNewsItem): item is LegacyNewsItem => {
  return !("_id" in item);
};

const resolveDateString = (value: unknown): string => {
  if (!value) return new Date().toISOString();

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "$date" in (value as Record<string, unknown>) &&
    typeof (value as Record<string, unknown>)["$date"] === "string"
  ) {
    return (value as { $date: string })["$date"];
  }

  return new Date().toISOString();
};

const normalizeNewsItem = (item: CombinedNewsItem): NormalizedNewsItem => {
  if (isLegacyNewsItem(item)) {
    return {
      id: item.id.toString(),
      title: item.title,
      description: item.summary ?? item.content ?? "",
      summary: item.content ?? item.summary ?? "",
      imgUrl: item.image ?? DEFAULT_IMAGE,
      publishedDate: resolveDateString(item.publishedAt),
      newsProvider: item.source ?? null,
      category: item.category ?? "general",
    };
  }

  const isGroup = Boolean(item.group_id && item.articles && item.articles.length > 0);
  const primaryArticle = isGroup ? item.articles![0] : undefined;

  const title = isGroup
    ? item.representative_title ?? primaryArticle?.title ?? item.title
    : item.title;

  const description = item.short_summary ?? item.long_summary ?? "";
  const summary = item.long_summary ?? item.short_summary ?? "";
  const newsProvider = isGroup
    ? item.articles?.map((article) => article.source).filter(Boolean).join(", ") ?? null
    : item.source ?? null;

  return {
    id: item.id,
    title,
    description,
    summary,
    imgUrl:
      (isGroup ? primaryArticle?.cover_image : item.cover_image) ??
      DEFAULT_IMAGE,
    publishedDate: resolveDateString(
      isGroup ? primaryArticle?.date_published : item.date_published
    ),
    newsProvider,
    category: item.category,
  };
};

const clampPage = (page: number, totalPages: number) => {
  if (totalPages === 0) return 1;
  return Math.min(Math.max(page, 1), totalPages);
};

const buildHref = (
  basePath: string,
  searchParams: SearchParams | undefined,
  targetPage: number
) => {
  const params = new URLSearchParams();

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === "page") return;
      if (value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((entry) => params.append(key, entry));
        return;
      }
      params.set(key, value);
    });
  }

  params.set("page", targetPage.toString());
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
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

const PaginatedNews = ({
  newsItems,
  currentPage,
  itemsPerPage = 20,
  basePath,
  searchParams,
}: PaginatedNewsProps) => {
  const normalizedNews = newsItems.map(normalizeNewsItem);
  const totalPages = Math.max(1, Math.ceil(normalizedNews.length / itemsPerPage));
  const safePage = clampPage(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = normalizedNews.slice(startIndex, endIndex);

  if (normalizedNews.length === 0) {
    return (
      <div className="w-full text-center text-sm text-muted-foreground py-12">
        No news articles available at the moment.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div
        id="latest-news-grid"
        className="flex justify-center items-center p-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 w-full max-w-8xl">
          {currentItems.map((item) => (
            <EverythingCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      {totalPages > 1 ? (
        <div className="flex w-full justify-center pb-6 px-4">
          <Pagination>
            <PaginationContent className="justify-center">
            {safePage > 1 ? (
              <PaginationItem>
                <PaginationPrevious href={buildHref(basePath, searchParams, safePage - 1)} />
              </PaginationItem>
            ) : null}

            {getPageSequence(safePage, totalPages).map((entry, index) => (
              <PaginationItem key={`${entry}-${index}`}>
                {entry === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={buildHref(basePath, searchParams, entry)}
                    isActive={entry === safePage}
                  >
                    {entry}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {safePage < totalPages ? (
              <PaginationItem>
                <PaginationNext href={buildHref(basePath, searchParams, safePage + 1)} />
              </PaginationItem>
            ) : null}
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
};

export default PaginatedNews;
