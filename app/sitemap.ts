import type { MetadataRoute } from "next";
import { DOCS_PAGES, docsHref } from "@/lib/docs/content";

function baseUrl() {
  return (process.env.WAITLIST_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: baseUrl(), lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...DOCS_PAGES.map((page) => ({
      url: `${baseUrl()}${docsHref(page.slug)}`,
      lastModified: now,
      changeFrequency: page.group === "Legal" ? ("monthly" as const) : ("weekly" as const),
      priority: page.slug ? 0.7 : 0.9,
    })),
  ];
}
