import type { Metadata } from "next";
import { site } from "@/lib/data";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string[];
};

export function absoluteUrl(path: string): string {
  const base = site.url.replace(/\/$/, "");
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  ogImage = "/logo.png",
  ogType = "website",
  keywords,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(ogImage);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: ogType,
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 512,
          height: 512,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const privatePageMetadata = (path: string, title: string): Metadata =>
  buildPageMetadata({
    title,
    description: "Private page — not indexed.",
    path,
    noIndex: true,
  });