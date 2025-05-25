import Image from 'next/image'

// Define a type for news items
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
  isLoading: boolean;
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

    console.log(politicNews);
    

    const otherNews = [
      businessNews,
      sportsNews,
      scienceNews,
      healthNews,
      technologyNews,
    ].filter(Boolean);
    
    // Format date helper function
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
        
        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
          return "Invalid date";
        }
        
        // Get time difference in hours
        const hoursDiff = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60));
        
        if (hoursDiff < 24) {
          return `${hoursDiff} hrs ago`;
        } else {
          // Return formatted date: Jan 1, 2023
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
    
    // Get the appropriate date value based on structure
    const getPublishedDate = (news?: NewsItem): string => {
      if (!news) return "Unknown date";
      
      if (news?.group_id && news?.articles?.[0]?.date_published) {
        return formatDate(news.articles[0].date_published);
      } else if (news?.date_published) {
        return formatDate(news.date_published);
      }
      return "Unknown date";
    }

    // Live indicator component
    const LiveIndicator = () => (
      <div className="flex items-center gap-1">
        <div className='border-2 border-red-600 p-1 rounded-full'><div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div></div>
        <span className="text-red-600 font-bold">Breaking</span>
      </div>
    );

    return (
      <div className="max-w-7xl mx-auto px-4">
        {/* Main grid container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left column - Breaking news */}
          <div className="md:col-span-3">
            <div className="pb-4">
              
              <div className="relative w-full h-[200px] overflow-clip">
                <Image 
                  src={politicNews?.group_id
                ? politicNews?.articles?.[0]?.cover_image ||
                  "https://placehold.co/600x400?text=News+Image"
                : politicNews?.cover_image ||
                  "https://placehold.co/600x400?text=News+Image"
}
                  alt="Gaza conflict"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-center object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className='mt-2'><LiveIndicator/></div>
              <h2 className="text-xl font-bold mb-2">
                  <a href={`/${politicNews?.category?.toLowerCase()}/${politicNews?.id}`} className="hover:underline">
                    {politicNews?.group_id
                      ? politicNews.representative_title || "politicNews Title"
                      : politicNews?.title || "News Title"}
                  </a>
                </h2>
              <p className="text-sm text-muted-foreground mb-3">
                {politicNews?.group_id
                  ? politicNews?.short_summary || ""
                  : politicNews?.short_summary || ""}
              </p>
            </div>
          <div className="pb-4">
              
              <div className="relative w-full h-[200px] overflow-clip">
                <Image 
                  src={businessNews?.group_id
                ? businessNews?.articles?.[0]?.cover_image ||
                  "https://placehold.co/600x400?text=News+Image"
                : businessNews?.cover_image ||
                  "https://placehold.co/600x400?text=News+Image"
                  }
                  alt="Gaza conflict"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-center object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className='mt-2'><LiveIndicator/></div>
              <h2 className="font-serif font-bold text-xl mb-2 line-clamp-2 text-gray-800 dark:text-white">
            {businessNews?.group_id
                    ? businessNews?.representative_title || ""
                    : businessNews?.title || ""}
          </h2>
              <p className="text-sm text-muted-foreground mb-3">
                {businessNews?.group_id
                  ? businessNews?.short_summary || ""
                  : businessNews?.short_summary || ""}
              </p>
            </div>
          </div>
          
          
          {/* Middle column - Ukraine talks - now wider */}
          <div className="md:col-span-6 md:px-2 h-fit border-b-2">
            <div className="pb-4"> 
              <div className="relative w-full h-[300px] mb-3 overflow-clip">
                <Image 
                  src={businessNews?.group_id
                ? businessNews?.articles?.[0]?.cover_image ||
                  "https://placehold.co/600x400?text=News+Image"
                : businessNews?.cover_image ||
                  "https://placehold.co/600x400?text=News+Image"
                  }
                  alt="Ukraine-Russia talks"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-center object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="font-serif font-bold text-xl mb-2 line-clamp-2 text-gray-800 dark:text-white">
            {businessNews?.group_id
                    ? businessNews?.representative_title || ""
                    : businessNews?.title || ""}
          </h2>
              <p className="text-sm text-muted-foreground mb-3">
                {businessNews?.group_id
                  ? businessNews?.short_summary || ""
                  : businessNews?.short_summary || ""}
              </p>
            </div>
            
            {/* Hospital news with video icon */}
            
          </div>
          
          
          <div className="md:col-span-3 space-y-4 ">
            {otherNews.map((news, index) => (
              <div key={`${news?.category}-${index}`} className="border-b pb-4 last:border-b-0">
                <h3 className="text-lg font-bold mb-2">
                  <a href={`/${news?.category?.toLowerCase()}/${news?.id}`} className="hover:underline">
                    {news?.group_id
                      ? news.representative_title || "News Title"
                      : news?.title || "News Title"}
                  </a>
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {news?.short_summary || "No summary available for this news item."}
                </p>
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <span>{getPublishedDate(news)}</span>
                  <span className="px-1">|</span>
                  <span className="font-semibold">{news?.category || "General"}</span>
                </div>
              </div>
            ))}
            
            {/* If there are fewer than 4 news items, add placeholder */}
            {otherNews.length < 4 && (
              <div className="pb-4 ">
                
              </div>
            )}
          </div>
        </div>
      </div>
    );
}

export default Highlights