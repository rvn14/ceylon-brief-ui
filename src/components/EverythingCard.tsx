import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

interface EverythingCardProps {
  title: string;
  description: string;
  summary?: string;
  imgUrl: string;
  publishedDate: string;
  newsProvider?: string | null;
  id: string;
  category: string;
}

const formatDisplayDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const EverythingCard = ({
  title,
  description,
  summary,
  imgUrl,
  publishedDate,
  newsProvider,
  id,
  category,
}: EverythingCardProps) => {
  const formattedDate = formatDisplayDate(publishedDate);
  const href = `/${category.toLowerCase()}/${id}`;

  return (
    <article className="shadow-lg relative rounded-lg overflow-hidden bg-white dark:bg-darkprimary w-full hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800">
      <Link href={href} className="flex h-full flex-col">
        <div className="relative h-48 sm:h-56 md:h-60 lg:h-52 xl:h-60 overflow-hidden group">
          <Image
            fill
            src={imgUrl}
            alt={title}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80" />
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-red-600 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              {category}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5 pb-14">
          <header>
            <h2
              className="font-serif font-bold text-xl mb-2 line-clamp-2 text-gray-900 dark:text-white"
              title={title}
            >
              {title}
            </h2>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-3">
              <span>{formattedDate}</span>
              {newsProvider ? (
                <span className="truncate max-w-[10rem]" title={newsProvider}>
                  {newsProvider}
                </span>
              ) : null}
            </div>
          </header>

          <p
            className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4"
            title={summary ?? description}
          >
            {description}
          </p>

          <div className="mt-auto absolute bottom-4 left-5 flex items-center gap-1 text-red-600 dark:text-red-400 text-sm font-medium">
            <span>Read full story</span>
            <ArrowRightIcon size={14} />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default EverythingCard;
