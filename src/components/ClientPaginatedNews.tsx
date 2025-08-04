"use client";

import { useState, useMemo } from "react";
import PaginatedNewsList from "@/components/PaginatedNewsList";
import { NewsItem, LegacyNewsItem } from "@/types/news";

interface ClientPaginatedNewsProps {
  newsItems: NewsItem[] | LegacyNewsItem[];
  itemsPerPage?: number;
}

// Helper function to convert legacy news items to the new format
function convertLegacyToNewsItem(item: LegacyNewsItem): NewsItem {
  return {
    _id: item.id.toString(),
    id: item.id.toString(),
    category: item.category || "general",
    url: item.url || "",
    source: item.source || "",
    cover_image: item.image || "/images/News_web.jpg",
    date_published: item.publishedAt ? item.publishedAt.toString() : new Date().toISOString(),
    short_summary: item.summary || item.content || "",
    long_summary: item.content || item.summary || "",
    title: item.title,
    group_id: null,
    articles: undefined
  };
}

// Type guard to check if item is legacy format
function isLegacyNewsItem(item: NewsItem | LegacyNewsItem): item is LegacyNewsItem {
  return !('_id' in item) && !('short_summary' in item);
}

export default function ClientPaginatedNews({ 
  newsItems, 
  itemsPerPage = 20 
}: ClientPaginatedNewsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Convert legacy items to new format if needed
  const convertedNewsItems: NewsItem[] = useMemo(() => {
    return newsItems.map(item => 
      isLegacyNewsItem(item) ? convertLegacyToNewsItem(item) : item
    );
  }, [newsItems]);

  // Calculate pagination
  const totalPages = Math.ceil(convertedNewsItems.length / itemsPerPage);
  
  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return convertedNewsItems.slice(startIndex, endIndex);
  }, [convertedNewsItems, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of news grid when page changes
    const newsGrid = document.getElementById('latest-news-grid');
    if (newsGrid) {
      newsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <PaginatedNewsList
      newsItems={currentItems}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
