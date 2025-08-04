/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import EverythingCard from "./EverythingCard";
import { Article, NewsItem } from "@/types/news";


interface PaginatedNewsListProps {
  newsItems: NewsItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}


import Loader from "./Loader";

const PaginatedNewsList = ({ newsItems, currentPage, totalPages, onPageChange, isLoading = false }: PaginatedNewsListProps) => {
  // Responsive page button count
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [isBrowser, setIsBrowser] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState(false);
  const maxPageButtons = 12;

  useEffect(() => {
    setIsBrowser(true);
    setScreenWidth(window.innerWidth);
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate page buttons with ellipsis
  const getPageButtons = () => {
    const effectiveMaxButtons = isBrowser && screenWidth < 640 ? 5 : maxPageButtons;
    if (totalPages <= effectiveMaxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const sideButtons = Math.floor((effectiveMaxButtons - 5) / 2);
    let startPage = Math.max(2, currentPage - sideButtons);
    let endPage = Math.min(totalPages - 1, currentPage + sideButtons);
    if (currentPage - sideButtons < 2) {
      endPage = Math.min(totalPages - 1, 1 + effectiveMaxButtons - 3);
    }
    if (currentPage + sideButtons > totalPages - 1) {
      startPage = Math.max(2, totalPages - effectiveMaxButtons + 3);
    }
    const pages: (number | string)[] = [1];
    if (startPage > 2) pages.push('...');
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) pages.push(i);
    }
    if (endPage < totalPages - 1) {
      pages.push('...');
    } else if (endPage === totalPages - 1) {
      pages.push(totalPages - 1);
    }
    pages.push(totalPages);
    return pages;
  };

  // Handler to show loading for 2 seconds before changing page
  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setLocalLoading(true);
    setTimeout(() => {
      setLocalLoading(false);
      onPageChange(page);
    }, 2000);
  };

  return (
    <>
      {localLoading ? (
        <div className="flex justify-center items-center min-h-dvh">
          <Loader />
        </div>
      ) : (
        <>
          <div id="latest-news-grid" className="flex justify-center items-center p-4 relative">
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 w-full max-w-8xl transition-opacity duration-200 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
              {newsItems.map((element, index) => {
                const isGroup = Boolean(element.group_id);
                if (isGroup && (!element.articles || element.articles.length === 0)) return null;
                const urls = isGroup ? element.articles!.map((article) => article.url).join(",") : element.url;
                const newsProviders = isGroup ? element.articles!.map((article) => article.source).join(",") : element.source;
                return (
                  <EverythingCard
                    key={index}
                    title={isGroup ? element.representative_title || "" : element.title || ""}
                    description={element.short_summary}
                    summary={element.long_summary}
                    imgUrl={isGroup ? element.articles![0].cover_image || "/images/News_web.jpg" : element.cover_image || "/images/News_web.jpg"}
                    publishedDate={isGroup ? (typeof element.articles![0].date_published === "string" ? element.articles![0].date_published : (element.articles![0].date_published as { $date: string }).$date.toString()) : (typeof element.date_published === "string" ? element.date_published : (element.date_published as { $date: string }).$date.toString())}
                    newsProvider={newsProviders ?? null}
                    source={urls ?? ""}
                    id={element.id}
                    category={element.category}
                  />
                );
              })}
            </div>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center py-8 px-4">
              <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center justify-center whitespace-nowrap cursor-pointer rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 gap-1 pl-2.5 ${currentPage === 1 ? "pointer-events-none opacity-50 text-muted-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </button>
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageButtons().map((page, index) => (
                    typeof page === 'number' ? (
                      <button
                        key={index}
                        onClick={() => handlePageChange(page)}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md cursor-pointer text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 w-10 ${currentPage === page ? "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={index} className="flex h-9 w-9 items-center justify-center text-muted-foreground" aria-hidden="true">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 14.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 14.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM5.5 14.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                      </span>
                    )
                  ))}
                </div>
                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center justify-center whitespace-nowrap cursor-pointer rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 gap-1 pr-2.5 ${currentPage === totalPages ? "pointer-events-none opacity-50 text-muted-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
export default PaginatedNewsList;