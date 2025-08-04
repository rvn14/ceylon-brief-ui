"use client";

import { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

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
  const [imgLoaded, setImgLoaded] = useState(false);

  // Format date for readability
  const formattedDate = new Date(publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="shadow-lg rounded-lg overflow-hidden bg-white dark:bg-darkprimary w-full hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800">
      <Link href={`/${category.toLowerCase()}/${id}`} className="w-full">
        <div className="relative overflow-hidden h-48 sm:h-56 md:h-60 lg:h-52 xl:h-60">
          {/* Blurred skeleton while image loads */}
          {!imgLoaded && (
            <div className="absolute inset-0 w-full h-full z-0 bg-red-400 rounded-none animate-pulse" />
          )}
          {/* Image */}
          <Image
            fill
            src={imgUrl}
            alt={title}
            className={`object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
            priority={false}
            style={{ borderRadius: 0 }}
          />

          {/* Category badge */}
          <div className="absolute top-4 left-4 z-20">
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

          {/* Meta info */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="mr-3">{formattedDate}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {description}
          </p>

          {/* Read more */}
          <div className="mt-auto pt-2">
            <span className="text-red-600 dark:text-red-400 text-sm font-medium hover:underline flex items-center cursor-pointer">
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
