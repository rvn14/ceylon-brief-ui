"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const ScrollToTop = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams ? searchParams.toString() : "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, searchString]);

  return null;
};

export default ScrollToTop;
