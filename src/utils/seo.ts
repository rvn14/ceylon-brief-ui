import type { Metadata } from "next";

const SITE_NAME = "CeylonBrief";
const DEFAULT_DESCRIPTION = "CeylonBrief delivers the latest breaking news, in-depth analysis, and daily headlines from across Sri Lanka.";
const DEFAULT_TITLE = `${SITE_NAME} - Latest News from Sri Lanka`;
const FALLBACK_URL = "https://www.ceylonbrief.lk";
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL).replace(/\/$/, "");
const DEFAULT_IMAGE_PATH = "/images/News_web.jpg";

const toAbsoluteUrl = (path?: string) => {
  if (!path) {
    return `${BASE_URL}${DEFAULT_IMAGE_PATH}`;
  }

  try {
    return new URL(path, BASE_URL).toString();
  } catch {
    return path;
  }
};

const toImageEntries = (images?: string | string[]) => {
  const normalized = Array.isArray(images) ? images : images ? [images] : [DEFAULT_IMAGE_PATH];
  return normalized.map((image) => {
    const url = toAbsoluteUrl(image);
    return {
      url,
      width: 1200,
      height: 630,
      alt: `${SITE_NAME} cover image`,
    };
  });
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: BASE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: toImageEntries(),
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [toAbsoluteUrl(DEFAULT_IMAGE_PATH)],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/favicon.ico",
  },
};

export type BuildMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  images?: string | string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
  tags?: string[];
};

export const buildMetadata = (options: BuildMetadataOptions = {}): Metadata => {
  const {
    title,
    description,
    path = "/",
    images,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    keywords,
    tags,
  } = options;

  const resolvedTitle = title ?? defaultMetadata.title?.default ?? DEFAULT_TITLE;
  const resolvedDescription = description ?? defaultMetadata.description ?? DEFAULT_DESCRIPTION;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const absoluteUrl = toAbsoluteUrl(canonicalPath);
  const imageEntries = toImageEntries(images);

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      ...(defaultMetadata.openGraph ?? {}),
      type,
      url: absoluteUrl,
      title: resolvedTitle,
      description: resolvedDescription,
      images: imageEntries,
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors,
            tags,
          }
        : {}),
    },
    twitter: {
      ...(defaultMetadata.twitter ?? {}),
      title: resolvedTitle,
      description: resolvedDescription,
      images: imageEntries.map(({ url }) => url),
    },
  } satisfies Metadata;
};
