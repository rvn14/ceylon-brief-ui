"use client";

import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { SelectCategory } from "./SelectCategory";
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
        className="bg-darkprimary px-4 flex items-center justify-between relative shadow-md py-4 sm:py-6 md:py-8 min-h-[4rem] sm:min-h-[6rem] md:min-h-[7rem] w-full"
        style={{
          backgroundImage: "url('/images/cover2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="logo font-mono font-semibold text-6xl md:text-6xl ">
          Ceylon Brief
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-darkprimary py-2 z-20 shadow-lg">
            <ul className="flex flex-col space-y-2 mb-4">
              <li className="nav-link px-4">
                <Link href="/">Home</Link>
              </li>
              <li className="nav-link px-4">
                <Link href={`/top-headlines/Business`}>Business</Link>
              </li>
              <li className="nav-link px-4">
                <Link href={`/top-headlines/Entertainment`}>Entertainment</Link>
              </li>
              <li className="bg-transparent px-4">
                {" "}
                <SelectCategory />{" "}
              </li>
            </ul>
            {/* Search moved inside mobile menu */}
            <div className="px-4 pb-4">
              <form
                onSubmit={handleSearch}
                className="flex items-center w-full"
              >
                <div className="search-container w-full flex">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Search news..."
                    className="p-2 px-4 focus:outline-none focus:ring-0 bg-white/3 rounded-l-md w-full"
                  />
                  <button
                    type="submit"
                    className="bg-white/3 text-white p-2 px-4 hover:bg-white/5 transition-colors duration-100 cursor-pointer rounded-r-md"
                  >
                    <Search className="text-white" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Mode Toggle - Outside the dropdown */}
        <div className="md:hidden"></div>
      </div>
      <div className="sticky top-0 bg-darkprimary hidden md:flex justify-center items-center  gap-4 text-sm shadow-xs">
        <Link className="nav-link p-2" href={"/"}>
          Home
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
        <Link className="nav-link p-2" href={"/top-headlines/politics"}>
          Politics
        </Link>
        {/* <Link className="nav-link p-2 bg-white/8" href={"/featured-news"}>
          Featured Articles
        </Link> */}
      </div>
    </div>
  );
};

export default HeadSection;
