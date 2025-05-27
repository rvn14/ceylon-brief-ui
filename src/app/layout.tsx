import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeadSection from "@/components/HeadSection";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactLenis } from 'lenis/react'
import Footer from "@/components/Footer";
import GoogleAnalytics from '@/components/GoogleAnalytics';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CeylonBrief",
  description: "Latest updates from Sri Lanka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><ReactLenis root>
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <HeadSection />
        <GoogleAnalytics />
        {children}
        <Footer />
        </ThemeProvider>
        </ReactLenis>
      </body>
    </html>
  );
}
