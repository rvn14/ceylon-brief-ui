// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import ReactMarkdown from "react-markdown";

// const formatDateKey = (key: string) => {
//   const parts = key.split("_");
//   if (parts.length < 3) return key;

//   const year = parts[0];
//   const monthNum = parseInt(parts[1], 10);

//   const weekPart = parts[2];
//   const weekMatch = weekPart.match(/WEEK(\d+)/i);
//   const weekNum = weekMatch ? weekMatch[1] : weekPart;

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const monthName = monthNames[monthNum - 1] || `Month ${monthNum}`;

//   const formattedWeek = weekNum.padStart(2, "0");

//   return `${monthName} ${year} - week ${formattedWeek}`;
// };

// // Move fetch to a separate function for client component
// const fetchFeaturedArticles = async () => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/all_feature_articles`,
//       {
//         next: { revalidate: 60 },
//       }
//     );
//     if (!res.ok) {
//       throw new Error("Failed to fetch data");
//     }
//     return await res.json();
//   } catch (error) {
//     console.log(error);
//     return {};
//   }
// };

// const FeaturedNewsPage = () => {
//   const [data, setData] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const weeksPerPage = 4;

//   useEffect(() => {
//     const loadData = async () => {
//       const articleData = await fetchFeaturedArticles();
//       setData(articleData);
//     };
//     loadData();
//   }, []);

//   // Get sorted keys to ensure chronological order
//   const sortedKeys = Object.keys(data).sort((a, b) => {
//     // Sort in reverse chronological order (newest first)
//     return b.localeCompare(a);
//   });
//   type FeatureArticle = {
//     [key: string]: string; // articleKey: articleContent
//   };

//   type NewsItem = {
//     id: string | number;
//     feature_articles: FeatureArticle;
//   };
//   // Calculate pagination
//   const totalPages = Math.ceil(sortedKeys.length / weeksPerPage);
//   const startIdx = (currentPage - 1) * weeksPerPage;
//   const currentKeys = sortedKeys.slice(startIdx, startIdx + weeksPerPage);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className="bg-background min-h-screen py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-3xl font-bold text-center text-primary mb-12 border-b pb-4">
//           Weekly Features
//         </h1>

//         <div className="flex flex-col ">
//           {currentKeys.map((key) => (
//             <React.Fragment key={key}>
//               {data[key]?.map((item: NewsItem) => (
//                 <div key={item.id} className="w-full mb-8 ">
//                   <h2 className="text-2xl font-semibold text-primary mb-6 pl-2 border-l-4 border-red-500">
//                     {formatDateKey(key)}
//                   </h2>

//                   <div className="flex flex-col space-y-6 ">
//                     {Object.keys(item.feature_articles).map((articleKey) => (
//                       <div key={articleKey} className="w-full mb-4">
//                         <div className="bg-white dark:bg-darkprimary rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 duration-300 ">
//                           <div className="p-6 flex flex-col">
//                             <h3 className="text-xl font-bold text-primary mb-4">
//                               {articleKey}
//                             </h3>
//                             <div className="prose dark:prose-invert prose-sm text-primary/80 leading-relaxed">
//                               <ReactMarkdown>
//                                 {item.feature_articles[articleKey]}
//                               </ReactMarkdown>
//                             </div>
//                             <div className="mt-6 pt-4 border-t border-gray-100">
//                               <button className="text-red-600 hover:text-red-800 font-medium cursor-pointer">
//                                 Read more →
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </React.Fragment>
//           ))}
//         </div>

//         {totalPages > 1 && (
//           <Pagination className="mt-8">
//             <PaginationContent>
//               {currentPage > 1 && (
//                 <PaginationItem>
//                   <PaginationPrevious
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handlePageChange(currentPage - 1);
//                     }}
//                   />
//                 </PaginationItem>
//               )}

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                 (page) => (
//                   <PaginationItem key={page}>
//                     <PaginationLink
//                       href="#"
//                       isActive={page === currentPage}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         handlePageChange(page);
//                       }}
//                     >
//                       {page}
//                     </PaginationLink>
//                   </PaginationItem>
//                 )
//               )}

//               {currentPage < totalPages && (
//                 <PaginationItem>
//                   <PaginationNext
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handlePageChange(currentPage + 1);
//                     }}
//                   />
//                 </PaginationItem>
//               )}
//             </PaginationContent>
//           </Pagination>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FeaturedNewsPage;


import React from 'react'

const page = () => {
  return (
    <div className='w-screen h-screen bg-black flex items-center justify-center relativ'>
      
    </div>
  )
}

export default page