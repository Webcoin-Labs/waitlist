import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsShell } from "@/components/docs/DocsShell";
import { DOCS_PAGES, getDocsPage } from "@/lib/docs/content";

type DocsPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export function generateStaticParams() {
  return DOCS_PAGES.map((page) => ({ slug: page.slug ? page.slug.split("/") : [] }));
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocsPage(slug);
  if (!page) return { title: "Documentation not found — Webcoin Labs" };
  return {
    title: `${page.title} — Webcoin Labs Docs`,
    description: page.description,
    alternates: { canonical: page.slug ? `/docs/${page.slug}` : "/docs" },
  };
}

export default async function DocumentationPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const page = getDocsPage(slug);
  if (!page) notFound();
  return <DocsShell page={page} />;
}
