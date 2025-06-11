import Image from 'next/image'
import Link from 'next/link';


interface NewsItem {
  id: string | number;
  category?: string;
  title?: string;
  representative_title?: string;
  cover_image?: string;
  date_published?: string | { $date: string } | null;
  group_id?: string;
  isLive?: boolean;
  short_summary?: string;
  source?: string;
  articles?: Array<{
    cover_image?: string;
    date_published?: string | { $date: string } | null;
  }>;
}

interface HighlightsProps {
  news: NewsItem[];
}

const Highlights = ({ news }: HighlightsProps) => {
    const newsData = news || [];
    
    const politicNews = newsData.find((item) => item?.category === "Politics")
    const businessNews = newsData.find((item) => item?.category === "Business")
    const sportsNews = newsData.find((item) => item?.category === "Sports")
    const scienceNews = newsData.find((item) => item?.category === "Science")
    const healthNews = newsData.find((item) => item?.category === "Health")
    const technologyNews = newsData.find((item) => item?.category === "Technology")
    const entertainmentNews = newsData.find((item) => item?.category === "Entertainment")

    
    const otherNews = [
      businessNews,
      sportsNews,
      scienceNews,
      healthNews,
      technologyNews,
      entertainmentNews
    ].filter(Boolean);
    
    
    const formatDate = (dateValue: string | { $date: string } | null | undefined): string => {
      if (!dateValue) return "Unknown date";
      
      try {
        let dateObj: Date;
        if (typeof dateValue === "string") {
          dateObj = new Date(dateValue);
        } else if (dateValue.$date) {
          dateObj = new Date(dateValue.$date);
        } else {
          return "Invalid date";
        }
        
        
        if (isNaN(dateObj.getTime())) {
          return "Invalid date";
        }
        
       
        const hoursDiff = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60));
        
        if (hoursDiff < 1) {
          return "Just now";
        }

        if (hoursDiff < 24) {
          return `${hoursDiff} hrs ago`;
        } else {
          
          return dateObj.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric'
          });
        }
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
      }
    }
    
    
    const getPublishedDate = (news?: NewsItem): string => {
      if (!news) return "Unknown date";
      
      if (news?.group_id && news?.articles?.[0]?.date_published) {
        return formatDate(news.articles[0].date_published);
      } else if (news?.date_published) {
        return formatDate(news.date_published);
      }
      return "Unknown date";
    }

    // Indicator 
    const LiveIndicator = () => (
      <div className="flex items-center gap-2 backdrop-blur-sm bg-black/30 rounded-full px-3 py-1.5">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-75"></div>
        </div>
        <span className="text-white font-medium text-xs uppercase tracking-wider">Latest News</span>
      </div>
    );

    return (
      <div className="w-full px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Today's Highlights</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - Featured article */}
          <div className="lg:col-span-8">
            <div className="group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800">
              <div className="relative w-full h-[500px] overflow-hidden">
                <Image 
                  src={politicNews?.group_id
                    ? politicNews?.articles?.[0]?.cover_image ||
                      "https://placehold.co/600x400?text=News+Image"
                    : politicNews?.cover_image ||
                      "https://placehold.co/600x400?text=News+Image"
                  }
                  alt="Featured news"
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-center object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <LiveIndicator/>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="mb-4">
                    <Link href={`/top-headlines/${politicNews?.category?.toLowerCase()}`} 
                          className="inline-block">
                      <span className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600/90 backdrop-blur-sm rounded-full uppercase tracking-wider hover:bg-red-500 transition-colors duration-200">
                        {politicNews?.category}
                      </span>
                    </Link>
                  </div>
                  <h1 className="text-2xl lg:text-4xl font-bold mb-4 leading-tight text-white">
                    <a href={`/${politicNews?.category?.toLowerCase()}/${politicNews?.id}`} 
                       className="hover:text-red-400 transition-colors duration-300">
                      {politicNews?.group_id
                        ? politicNews.representative_title || "News Title"
                        : politicNews?.title || "News Title"}
                    </a>
                  </h1>
                  <p className="text-gray-200 text-lg leading-relaxed mb-4 line-clamp-2">
                    {politicNews?.group_id
                      ? politicNews?.short_summary || ""
                      : politicNews?.short_summary || ""}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Ceylon Brief</span>
                    </div>
                    <span>•</span>
                    <span>{getPublishedDate(politicNews)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Smaller news items */}
          <div className="lg:col-span-4 space-y-4">
            {otherNews.slice(0, 5).map((newsItem, index) => (
              newsItem && (
                <article key={newsItem.id || index} className="group bg-white dark:bg-darkprimary rounded-lg overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-800 h-28">
                  <div className="flex gap-4">
                    <div className="relative w-36 h-30 flex-shrink-0 overflow-hidden">
                      <Image 
                        src={newsItem?.group_id
                          ? newsItem?.articles?.[0]?.cover_image ||
                            "https://placehold.co/600x400?text=News+Image"
                          : newsItem?.cover_image ||
                            "https://placehold.co/600x400?text=News+Image"
                        }
                        alt="News thumbnail"
                        fill
                        sizes="120px"
                        className="object-center object-cover group-hover:scale-105 transition-transform duration-300 h-30"
                      />
                    </div>
                    <div className="flex-1 min-w-0 p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Link href={`/top-headlines/${newsItem?.category?.toLowerCase()}`} className="text-xs font-medium hover:text-red-600 transition-colors duration-200">
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-600/90 rounded-full uppercase tracking-wide hover:bg-red-500 transition-colors duration-200">
                          {newsItem.category}
                        </span></Link>
                      </div>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-tight text-gray-900 dark:text-white hover:text-red-500 transition-colors duration-200">
                        <a href={`/${newsItem?.category?.toLowerCase()}/${newsItem?.id}`}>
                          {newsItem?.group_id
                            ? newsItem?.representative_title || "News Title"
                            : newsItem?.title || "News Title"}
                        </a>
                      </h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getPublishedDate(newsItem)}
                      </div>
                    </div>
                  </div>
                </article>
              )
            ))}
          </div>
        </div>
      </div>
    );
}

export default Highlights