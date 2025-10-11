/* eslint-disable @typescript-eslint/no-unused-vars */
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

    const buildArticleHref = (item?: NewsItem) => {
      if (!item?.category || item.id === undefined || item.id === null) {
        return "/";
      }
      return `/${item.category.toLowerCase()}/${item.id}`;
    };

    const buildCategoryHref = (category?: string) => {
      if (!category) {
        return "/";
      }
      return `/top-headlines/${category.toLowerCase()}`;
    };

    const resolveImageSrc = (item?: NewsItem) => {
      if (!item) {
        return "/images/News_web.jpg";
      }

      if (item.group_id && item.articles?.[0]?.cover_image) {
        return item.articles[0].cover_image;
      }

      return item.cover_image || "/images/News_web.jpg";
    };

    const politicNews = newsData.filter((item) => item?.category === "Politics").slice(0, 3)
    const businessNews = newsData.filter((item) => item?.category === "Business").slice(0, 3)
    const sportsNews = newsData.filter((item) => item?.category === "Sports").slice(0, 3)
    const scienceNews = newsData.filter((item) => item?.category === "Science").slice(0, 3)
    const healthNews = newsData.filter((item) => item?.category === "Health").slice(0, 3)
    const technologyNews = newsData.filter((item) => item?.category === "Technology").slice(0, 3)
    const entertainmentNews = newsData.filter((item) => item?.category === "Entertainment").slice(0, 3)

    const leadStory = politicNews[0] ?? newsData[0];
    if (!leadStory) {
      return null;
    }

    const leadHref = buildArticleHref(leadStory);
    const leadCategoryHref = buildCategoryHref(leadStory.category);
    const secondaryNews = newsData.filter((item) => item !== leadStory).slice(0, 2);
    const leadImageSrc = resolveImageSrc(leadStory);
    const leadTitle =
      leadStory.group_id
        ? leadStory.representative_title || leadStory.title || "News Title"
        : leadStory.title || "News Title";
    const leadSummary = leadStory.short_summary || leadStory.long_summary || "";
    
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
      <div className="w-full mx-auto px-4">
        {/* Main Featured Article */}
        <section className='mb-8'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-6'>
            <article className='md:col-span-3 relative aspect-[5/3] w-full overflow-hidden group'>
              <Link
                href={leadHref}
                className="absolute inset-0 block"
                prefetch
              >
                <Image
                  src={leadImageSrc}
                  alt={leadTitle}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="sr-only">
                  {`Read ${leadTitle}`}
                </span>
              </Link>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="pointer-events-none absolute top-4 left-4 md:top-6 md:left-6">
                <LiveIndicator />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 lg:p-8 pointer-events-none">
                <div className="mb-3 pointer-events-auto">
                  <Link href={leadCategoryHref} prefetch className="inline-block">
                    <span className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-xs hover:bg-red-500 transition-colors duration-200">
                      {leadStory.category || "News"}
                    </span>
                  </Link>
                </div>
                <h1 className="text-xl lg:text-3xl xl:text-4xl font-bold mb-3 leading-tight text-white">
                  <Link
                    href={leadHref}
                    prefetch
                    className="hover:text-red-500 transition-colors duration-300"
                  >
                    {leadTitle}
                  </Link>
                </h1>
                <p className="text-gray-200 text-base lg:text-md leading-relaxed mb-4 line-clamp-2 max-w-4xl">
                  {leadSummary}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">CB</span>
                    </div>
                    <span className="font-medium">Ceylon Brief</span>
                  </div>
                  <span>•</span>
                  <span>{getPublishedDate(leadStory)}</span>
                </div>
              </div>
            </article>

            <div className='md:col-span-2 grid grid-rows-2 gap-4'>
              {secondaryNews.map((newsItem, index) => {
                const articleHref = buildArticleHref(newsItem);
                return (
                  <article key={index} className='relative h-[200px] md:h-full overflow-hidden shadow-lg group'>
                    <Link
                      href={articleHref}
                      className="absolute inset-0 block"
                      prefetch
                    >
                      <Image
                        src={resolveImageSrc(newsItem)}
                        alt={newsItem.title || newsItem.representative_title || "News Image"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 600px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="sr-only">
                        {`Read ${newsItem.title || newsItem.representative_title || "news story"}`}
                      </span>
                    </Link>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="pointer-events-none absolute top-2 left-2 sm:top-4 sm:left-4">
                      <Link
                        href={buildCategoryHref(newsItem?.category)}
                        prefetch
                        className="pointer-events-auto px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-xs hover:bg-red-500 transition-colors duration-200"
                      >
                        {newsItem?.category}
                      </Link>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 pointer-events-none">
                      <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        <Link
                          href={articleHref}
                          prefetch
                          className="pointer-events-auto hover:text-red-500 transition-colors duration-200"
                        >
                          {newsItem.title || newsItem.representative_title || "News Title"}
                        </Link>
                      </h2>
                      <p className="text-gray-200 text-xs mb-2 line-clamp-2">
                        {newsItem.short_summary || ""}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span>{getPublishedDate(newsItem)}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Grid of Categories */}
        {newsData && (
          <section className='mb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='flex flex-col'>
                <div className='flex items-end justify-between w-full p-2'>
                  <h2 className='text-lg font-semibold'>Politics</h2>
                  <Link href="/top-headlines/politics" className='text-red-600 text-sm hover:underline cursor-pointer'>More</Link>
                </div>
                <div className='flex gap-2 flex-col p-2 rounded-md bg-white dark:bg-zinc-900 shadow-md'>
                    {politicNews.map((newsItem, index) => (
                      <Link key={index} href={`/${newsItem.category?.toLowerCase()}/${newsItem.id}`} className='flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded-md transition-colors'>
                        <Image
                          src={newsItem.cover_image || "/images/News_web.jpg"}
                          alt={newsItem.title || "News Image"}
                          width={100} 
                          height={100}
                          className='aspect-[1/1] object-cover'
                        />
                        <div className='flex flex-col gap-2 flex-1'>
                          <span className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-xs hover:bg-red-500 transition-colors duration-200 w-fit">
                            {newsItem.category}
                          </span>
                          <h3 className='text-sm font-medium text-gray-900 dark:text-white line-clamp-2'>{newsItem.title || "News Title"}</h3>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>{getPublishedDate(newsItem)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
          </div>
          <div className='flex flex-col'>
                <div className='flex items-end justify-between w-full p-2'>
                  <h2 className='text-lg font-semibold'>Business</h2>
                  <Link href="/top-headlines/business" className='text-red-600 text-sm hover:underline cursor-pointer'>More</Link>
                </div>
                <div className='flex gap-2 flex-col p-2 rounded-md bg-white dark:bg-zinc-900 shadow-md'>
                    {businessNews.map((newsItem, index) => (
                      <Link key={index} href={`/${newsItem.category?.toLowerCase()}/${newsItem.id}`} className='flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded-md transition-colors'>
                        <Image
                          src={newsItem.cover_image || "/images/News_web.jpg"}
                          alt={newsItem.title || "News Image"}
                          width={100} 
                          height={100}
                          className='aspect-[1/1] object-cover'
                        />
                        <div className='flex flex-col gap-2 flex-1'>
                          <span className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-xs hover:bg-red-500 transition-colors duration-200 w-fit">
                            {newsItem.category}
                          </span>
                          <h3 className='text-sm font-medium text-gray-900 dark:text-white line-clamp-2'>{newsItem.title || "News Title"}</h3>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>{getPublishedDate(newsItem)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
          </div>
          
          <div className='flex flex-col'>
                <div className='flex items-end justify-between w-full p-2'>
                  <h2 className='text-lg font-semibold'>Health</h2>
                  <Link href="/top-headlines/health" className='text-red-600 text-sm hover:underline cursor-pointer'>More</Link>
                </div>
                <div className='flex gap-2 flex-col p-2 rounded-md bg-white dark:bg-zinc-900 shadow-md'>
                    {healthNews.map((newsItem, index) => (
                      <Link key={index} href={`/${newsItem.category?.toLowerCase()}/${newsItem.id}`} className='flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded-md transition-colors'>
                        <Image
                          src={newsItem.cover_image || "/images/News_web.jpg"}
                          alt={newsItem.title || "News Image"}
                          width={100} 
                          height={100}
                          className='aspect-[1/1] object-cover'
                        />
                        <div className='flex flex-col gap-2 flex-1'>
                          <span className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-xs hover:bg-red-500 transition-colors duration-200 w-fit">
                            {newsItem.category}
                          </span>
                          <h3 className='text-sm font-medium text-gray-900 dark:text-white line-clamp-2'>{newsItem.title || "News Title"}</h3>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>{getPublishedDate(newsItem)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
          </div>
          <div className='flex flex-col'>
                <div className='flex items-end justify-between w-full p-2'>
                  <h2 className='text-lg font-semibold'>Science</h2>
                  <Link href="/top-headlines/science" className='text-red-600 text-sm hover:underline cursor-pointer'>More</Link>
                </div>
                <div className='flex gap-2 flex-col p-2 rounded-md bg-white dark:bg-zinc-900 shadow-md'>
                    {scienceNews.map((newsItem, index) => (
                      <Link key={index} href={`/${newsItem.category?.toLowerCase()}/${newsItem.id}`} className='flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded-md transition-colors'>
                        <Image
                          src={newsItem.cover_image || "/images/News_web.jpg"}
                          alt={newsItem.title || "News Image"}
                          width={100} 
                          height={100}
                          className='aspect-[1/1] object-cover'
                        />
                        <div className='flex flex-col gap-2 flex-1'>
                          <span className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-xs hover:bg-red-500 transition-colors duration-200 w-fit">
                            {newsItem.category}
                          </span>
                          <h3 className='text-sm font-medium text-gray-900 dark:text-white line-clamp-2'>{newsItem.title || "News Title"}</h3>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>{getPublishedDate(newsItem)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
          </div>
          
        </section>
        )}
      </div>
    );
}

export default Highlights
