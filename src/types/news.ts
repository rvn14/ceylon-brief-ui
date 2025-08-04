export interface Article {
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

export interface NewsItem {
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

// Legacy interface for backward compatibility
export interface LegacyNewsItem {
  id: string | number;
  title: string;
  content?: string;
  summary?: string;
  image?: string;
  publishedAt?: string | Date;
  source?: string;
  url?: string;
  author?: string;
  category?: string;
}
