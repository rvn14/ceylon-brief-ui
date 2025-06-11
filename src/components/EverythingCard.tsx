// EverythingCard.tsx
import { ArrowRightIcon } from "lucide-react";
import { FC, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface EverythingCardProps {
  title: string;
  description: string;
  summary: string;
  imgUrl: string;
  publishedDate: string;
  newsProvider: string | null;
  source: string;
  id: string;
  category: string;
  url?: string | null;
  author?: string | null;
}

const EverythingCard: FC<EverythingCardProps> = ({
  title,
  imgUrl,
  description,
  category,
  id,
  publishedDate,
}) => {
  // Format the date to be more readable
  const formattedDate = new Date(publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="shadow-lg rounded-lg overflow-hidden bg-white dark:bg-darkprimary w-full hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800">
        <Link href={`/${category.toLowerCase()}/${id}`} className="w-full">
        {/* Image section with category badge */}
        <div className="relative overflow-hidden ">
          <Suspense fallback={<Skeleton className="w-full max-h-48 min-h-48" />} >
          <Image
            width={600}
            height={400}
            className="object-cover w-full object-center max-h-48 min-h-48 hover:scale-103 transition-transform duration-300"
            src={imgUrl}
            alt={title}
            
            
          />
          </Suspense>
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider">
              {category}
            </span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-5 flex flex-col gap-2">
          {/* Title */}
          <h2 className="font-serif font-bold text-xl mb-2 line-clamp-2 text-gray-800 dark:text-white">
            {title}
          </h2>

          {/* Meta information */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="mr-3">{formattedDate}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {description}
          </p>

          {/* Read more link - replaced Link with span to avoid nested a tags */}
          <div className="mt-auto pt-2">
            <span
              className="text-red-600 dark:text-red-400 text-sm font-medium hover:underline flex items-center cursor-pointer"
            >
              Read full story
              <ArrowRightIcon size={14} />
            </span>
          </div>
        </div>
    </Link>
      </div>
  );
};

export default EverythingCard;
