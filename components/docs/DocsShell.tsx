"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  FileText,
  Info,
  LifeBuoy,
  Menu,
  Palette,
  Search,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import { Wordmark } from "@/components/waitlist/Brand";
import { cn } from "@/lib/utils";
import {
  DOCS_GROUPS,
  DOCS_PAGES,
  docsHref,
  docsPageText,
  type DocsBlock,
  type DocsPage,
} from "@/lib/docs/content";

const GROUP_ICON = {
  Start: BookOpen,
  Platform: Sparkles,
  Access: CheckCircle2,
  Trust: ShieldAlert,
  Brand: Palette,
  Support: CircleHelp,
  Legal: FileText,
} as const;

function DocsSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return DOCS_PAGES.filter((page) => docsPageText(page).includes(normalized)).slice(0, 6);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setQuery("");
        }}
        placeholder="Search documentation"
        aria-label="Search documentation"
        className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-9 text-sm text-zinc-900 outline-none transition-shadow duration-150 placeholder:text-zinc-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear documentation search"
          className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
        >
          <X className="size-3.5" />
        </button>
      ) : null}

      <AnimatePresence>
        {query ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-zinc-200 bg-white p-2 shadow-lg"
          >
            {results.length ? (
              results.map((page) => (
                <Link
                  key={page.slug}
                  href={docsHref(page.slug)}
                  onClick={() => setQuery("")}
                  className="block rounded-lg px-3 py-2.5 hover:bg-zinc-50"
                >
                  <span className="block text-xs font-medium text-violet-700">{page.group}</span>
                  <span className="mt-0.5 block text-sm font-semibold text-zinc-950">{page.title}</span>
                  <span className="mt-0.5 line-clamp-1 block text-xs text-zinc-500">{page.description}</span>
                </Link>
              ))
            ) : (
              <div className="px-3 py-5 text-center">
                <p className="text-sm font-medium text-zinc-800">No matching guide</p>
                <Link href="/docs/help" className="mt-1 inline-block text-xs font-medium text-violet-700">
                  Ask for help
                </Link>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function DocsNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label={mobile ? "Mobile documentation" : "Documentation"} className="space-y-6">
      {DOCS_GROUPS.map((group) => {
        const Icon = GROUP_ICON[group];
        const pages = DOCS_PAGES.filter((page) => page.group === group);
        return (
          <div key={group}>
            <p className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
              <Icon aria-hidden className="size-3.5" />
              {group}
            </p>
            <div className="mt-2 space-y-0.5">
              {pages.map((page) => {
                const href = docsHref(page.slug);
                const active = pathname === href;
                return (
                  <Link
                    key={page.slug}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition-colors duration-150",
                      active ? "bg-violet-50 font-semibold text-violet-800" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950",
                    )}
                  >
                    {page.title}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function Callout({ block }: { block: Extract<DocsBlock, { type: "callout" }> }) {
  const Icon = block.tone === "warning" ? TriangleAlert : Info;
  return (
    <div
      className={cn(
        "my-6 rounded-xl border p-4",
        block.tone === "warning"
          ? "border-amber-200 bg-amber-50"
          : block.tone === "info"
            ? "border-violet-200 bg-violet-50"
            : "border-zinc-200 bg-zinc-50",
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 size-4 shrink-0", block.tone === "warning" ? "text-amber-700" : "text-violet-700")} />
        <div>
          <p className="text-sm font-semibold text-zinc-950">{block.title}</p>
          <p className="mt-1 text-pretty text-sm leading-6 text-zinc-600">{block.text}</p>
        </div>
      </div>
    </div>
  );
}

function RenderBlock({ block }: { block: DocsBlock }) {
  if (block.type === "paragraph") {
    return <p className="my-4 text-pretty text-[15px] leading-7 text-zinc-600">{block.text}</p>;
  }
  if (block.type === "bullets") {
    return (
      <ul className="my-5 space-y-2.5 pl-1">
        {block.items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-pretty text-[15px] leading-7 text-zinc-600">
            <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-violet-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "steps") {
    return (
      <ol className="my-6 space-y-5">
        {block.items.map((item, index) => (
          <li key={item.title} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3">
            <span className="grid size-8 place-items-center rounded-full border border-violet-200 bg-violet-50 text-sm font-semibold tabular-nums text-violet-800">
              {index + 1}
            </span>
            <div>
              <p className="font-semibold text-zinc-950">{item.title}</p>
              <p className="mt-1 text-pretty text-sm leading-6 text-zinc-600">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  if (block.type === "callout") return <Callout block={block} />;
  if (block.type === "table") {
    return (
      <div className="my-6 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full min-w-[540px] border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-950">
            <tr>{block.headers.map((header) => <th key={header} className="border-b border-zinc-200 px-4 py-3 font-semibold">{header}</th>)}</tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`${row[0]}-${rowIndex}`} className="border-b border-zinc-100 last:border-0">
                {row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className="px-4 py-3 align-top leading-6 text-zinc-600 first:font-medium first:text-zinc-900">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2">
      {block.items.map((item) => {
        const external = item.href.startsWith("http");
        return (
          <Link
            key={item.href}
            href={item.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="group rounded-xl border border-zinc-200 bg-white p-4 transition-transform duration-150 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-sm"
          >
            <span className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-950">
              {item.label}
              <ArrowRight className="size-4 text-zinc-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-violet-700" />
            </span>
            <span className="mt-1.5 block text-pretty text-xs leading-5 text-zinc-500">{item.description}</span>
          </Link>
        );
      })}
    </div>
  );
}

function Article({ page }: { page: DocsPage }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const index = DOCS_PAGES.findIndex((item) => item.slug === page.slug);
  const previous = index > 0 ? DOCS_PAGES[index - 1] : null;
  const next = index < DOCS_PAGES.length - 1 ? DOCS_PAGES[index + 1] : null;

  return (
    <motion.article
      key={pathname}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="min-w-0"
    >
      <div className="border-b border-zinc-200 pb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-violet-700">
          <span>{page.group}</span>
          <span aria-hidden className="text-zinc-300">/</span>
          <span className="text-zinc-500">Docs</span>
        </div>
        <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">{page.title}</h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-zinc-600 sm:text-lg">{page.description}</p>
        {page.updated ? <p className="mt-4 text-xs font-medium text-zinc-400">{page.updated}</p> : null}
      </div>

      <div className="py-3">
        {page.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24 border-b border-zinc-100 py-8 last:border-0">
            <h2 className="text-balance text-2xl font-semibold text-zinc-950">{section.title}</h2>
            <div className="mt-3">{section.blocks.map((block, blockIndex) => <RenderBlock key={`${section.id}-${blockIndex}`} block={block} />)}</div>
          </section>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-zinc-950">Need more help?</p>
          <p className="mt-1 text-pretty text-sm text-zinc-600">Contact the Webcoin Labs team with your profile email and a concise description.</p>
        </div>
        <Link href="/docs/help" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white sm:mt-0">
          <LifeBuoy className="size-4" />
          Get help
        </Link>
      </div>

      <nav aria-label="Previous and next documentation" className="mt-8 grid gap-3 border-t border-zinc-200 pt-8 sm:grid-cols-2">
        {previous ? (
          <Link href={docsHref(previous.slug)} className="rounded-xl border border-zinc-200 p-4 hover:border-violet-200 hover:bg-violet-50/40">
            <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500"><ArrowLeft className="size-3.5" /> Previous</span>
            <span className="mt-1 block text-sm font-semibold text-zinc-950">{previous.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={docsHref(next.slug)} className="rounded-xl border border-zinc-200 p-4 text-right hover:border-violet-200 hover:bg-violet-50/40">
            <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-zinc-500">Next <ArrowRight className="size-3.5" /></span>
            <span className="mt-1 block text-sm font-semibold text-zinc-950">{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </motion.article>
  );
}

export function DocsShell({ page }: { page: DocsPage }) {
  return (
    <div className="min-h-dvh bg-white text-zinc-950">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="Webcoin Labs home" className="flex shrink-0 items-center gap-3">
            <Wordmark variant="dark" height={20} priority />
            <span aria-hidden className="h-5 w-px bg-zinc-200" />
            <span className="text-sm font-semibold text-zinc-700">Docs</span>
          </Link>
          <div className="ml-auto hidden flex-1 justify-center md:flex"><DocsSearch /></div>
          <Link href="/" className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-950 sm:block">Home</Link>
          <Link href="/#join" className="rounded-lg bg-zinc-950 px-3.5 py-2 text-sm font-semibold text-white hover:bg-zinc-800">Request access</Link>
        </div>
        <div className="border-t border-zinc-100 px-4 py-3 md:hidden"><DocsSearch /></div>
      </header>

      <details className="border-b border-zinc-200 bg-zinc-50 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-zinc-800 marker:hidden">
          <span className="flex items-center gap-2"><Menu className="size-4" /> Browse documentation</span>
          <span className="text-xs text-zinc-500">{page.group}</span>
        </summary>
        <div className="max-h-[65dvh] overflow-y-auto border-t border-zinc-200 bg-white px-4 py-5"><DocsNav mobile /></div>
      </details>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_210px]">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto border-r border-zinc-200 px-5 py-8 lg:block">
          <DocsNav />
        </aside>

        <main className="min-w-0 px-5 py-10 sm:px-8 lg:px-12 lg:py-14 xl:px-16">
          <div className="mx-auto max-w-3xl"><Article page={page} /></div>
        </main>

        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto border-l border-zinc-100 px-5 py-10 xl:block">
          <p className="text-xs font-semibold text-zinc-500">On this page</p>
          <nav aria-label="On this page" className="mt-3 space-y-1">
            {page.sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="block rounded-md px-2 py-1.5 text-xs leading-5 text-zinc-500 hover:bg-zinc-50 hover:text-violet-700">
                {section.title}
              </a>
            ))}
          </nav>
          <div className="mt-8 border-t border-zinc-200 pt-5">
            <p className="text-xs font-semibold text-zinc-700">Webcoin Labs</p>
            <p className="mt-2 text-pretty text-xs leading-5 text-zinc-500">Public tools are planned to begin rolling out at the start of Q4 2026.</p>
          </div>
        </aside>
      </div>

      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-6 py-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Webcoin Labs. Documentation for early-access and public tools.</p>
          <nav className="flex flex-wrap gap-5" aria-label="Documentation footer">
            <Link href="/docs/help" className="hover:text-zinc-950">Help</Link>
            <Link href="/docs/legal/terms" className="hover:text-zinc-950">Terms</Link>
            <Link href="/docs/legal/privacy" className="hover:text-zinc-950">Privacy</Link>
            <a href="mailto:contact@webcoinlabs.com" className="hover:text-zinc-950">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
