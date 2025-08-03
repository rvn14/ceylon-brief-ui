"use client";

import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";

const HeadSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const date = new Date();
    setCurrentDate(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="relative text-white w-full">
      <div className="flex justify-between items-center bg-darkprimary p-6 py-2">
        <div className="text-sm font-light">{currentDate}</div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <div>
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="search-container flex">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Search news..."
                    className="p-2 px-6 focus:outline-none focus:ring-0 bg-white/3 rounded-l-md"
                  />
                  <button
                    type="submit"
                    className="bg-white/3 text-white p-2 px-6 hover:bg-white/5 transition-colors duration-100 cursor-pointer rounded-r-md"
                  >
                    <Search className="text-white" />
                  </button>
                </div>
              </form>
            </div>
          </div>
          <ModeToggle />
        </div>
      </div>

      <div
        className="bg-darkprimary px-4 flex items-center justify-center relative shadow-md py-6 sm:py-6 md:py-8 min-h-[4rem] sm:min-h-[6rem] md:min-h-[7rem] w-full"
        style={{
          backgroundImage: "url('/images/cover2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="logo w-full flex justify-center items-center py-2">
          <div className="flex  md:flex-row items-center gap-2 md:gap-4">
            <span className="font-Cormorant font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-white drop-shadow-lg">
              CeylonBrief |
            </span>
            <span className="font-inter font-light text-lg sm:text-2xl md:text-3xl text-white/90 mt-1 sm:mt-2 md:mt-3">
               Latest News from Sri Lanka
            </span>
          </div>
        </div>
        {/* Mobile Menu Toggle */}
        <div className="md:hidden ml-auto self-center flex items-center">
          <button onClick={toggleMobileMenu} className="text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}

        {/* Mobile Navigation - Positioned Absolutely */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-darkprimary shadow-2xl border-t border-gray-200 dark:border-gray-700 z-50">
            <div className="max-h-screen overflow-y-auto">
              <ul className="py-2">
                <li>
                  <Link
                    href="/"
                    className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-darkprimary transition-colors duration-200 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/top-headlines/politics"
                    className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-darkprimary transition-colors duration-200 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Politics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/top-headlines/general"
                    className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-darkprimary transition-colors duration-200 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    General
                  </Link>
                </li>
                <li>
                  <Link
                    href="/top-headlines/business"
                    className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-darkprimary transition-colors duration-200 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Business
                  </Link>
                </li>
                <li>
                  <Link
                    href="/top-headlines/entertainment"
                    className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-darkprimary transition-colors duration-200 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entertainment
                  </Link>
                </li>
                <li>
                  <Link
                    href="/top-headlines/health"
                    className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-darkprimary transition-colors duration-200 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Health
                  </Link>
                </li>
                <li>
                  <Link
                    href="/top-headlines/science"
                    className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-darkprimary transition-colors duration-200 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Science
                  </Link>
                </li>
                <li>
                  <Link
                    href="/top-headlines/sports"
                    className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-darkprimary transition-colors duration-200 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sports
                  </Link>
                </li>
                <li>
                  <Link
                    href="/top-headlines/technology"
                    className="block px-6 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-darkprimary transition-colors duration-200 border-b border-gray-100 dark:border-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Technology
                  </Link>
                </li>
                
              </ul>

              {/* Search section in mobile menu */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-darkprimary border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleInputChange}
                      placeholder="Search news..."
                      className="flex-1 p-3 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white p-3 transition-colors duration-200"
                    >
                      <Search size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      
        <div className="md:hidden"></div>
      </div>
      <div className="sticky top-0 bg-darkprimary hidden md:flex justify-center items-center  gap-4 text-sm shadow-xs">
        <Link className="nav-link p-2" href={"/"}>
          Home
        </Link>
        <Link className="nav-link p-2" href={"/top-headlines/politics"}>
          Politics
        </Link>
        <Link className="nav-link p-2" href={"/top-headlines/general"}>
          General
        </Link>
        <Link className="nav-link p-2" href={"/top-headlines/business"}>
          Business
        </Link>
        <Link className="nav-link p-2" href={"/top-headlines/entertainment"}>
          Entertainment
        </Link>
        <Link className="nav-link p-2" href={"/top-headlines/health"}>
          Health
        </Link>
        <Link className="nav-link p-2" href={"/top-headlines/science"}>
          Science
        </Link>
        <Link className="nav-link p-2" href={"/top-headlines/sports"}>
          Sports
        </Link>
        <Link className="nav-link p-2" href={"/top-headlines/technology"}>
          Technology
        </Link>
        
        {/* <Link className="nav-link p-2 bg-white/8" href={"/featured-news"}>
          Featured Articles
        </Link> */}
      </div>
    </div>
  );
};

export default HeadSection;