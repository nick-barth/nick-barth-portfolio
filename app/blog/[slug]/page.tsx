import { getPostBySlug } from "@/lib/blog";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const url = `https://new-nick-barth.vercel.app/blog/${slug}`;

  return {
    title: `${post.title} — Nick Barth`,
    description: post.excerpt,
    metadataBase: new URL("https://new-nick-barth.vercel.app"),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      authors: ["Nick Barth"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: "@nickbarth",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const url = `https://new-nick-barth.vercel.app/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Nick Barth",
      url: "https://new-nick-barth.vercel.app",
    },
    url,
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-950 text-black dark:text-white p-6 sm:p-8 md:p-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/blog" className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors mb-8 inline-block">
        ← Back to Blog
      </Link>

      <article className="max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-bodoni)", fontStyle: "italic" }}>
          {post.title}
        </h1>

        <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-8">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div
          className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      <footer className="mt-16 text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div className="flex gap-6 mb-4">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Home</Link>
          <Link href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Blog</Link>
          <a href="https://www.linkedin.com/in/nicholasbarth/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">LinkedIn</a>
          <a href="/nick_barth_growth_engineer.pdf" download className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Resume</a>
        </div>
        <p>© 2026 Nick Barth. All rights reserved.</p>
      </footer>
    </div>
  );
}
