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
    <div className="min-h-screen w-full text-black" style={{ backgroundColor: "#f6f4ec" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="w-full">
        <div className="flex justify-between items-start px-6 sm:px-8 md:px-16 py-3 sm:py-4">
          <Link href="/">
            <h1
              className="font-black mb-2 hover:text-gray-600 transition-colors"
              style={{
                fontFamily: "'PP Pangaia', sans-serif",
                fontWeight: "500",
                lineHeight: "1.1",
                fontSize: "32px",
              }}
            >
              Nick Barth
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-right" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif', fontSize: "16px" }}>
            <Link href="/blog" className="hover:text-gray-600 transition-colors">
              Blog
            </Link>
            <a
              href="https://www.linkedin.com/in/nicholasbarth/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="/nick_barth_growth_engineer.pdf"
              download
              className="hover:text-gray-600 transition-colors"
            >
              Resume
            </a>
          </nav>
        </div>
      </header>

      {/* Blog Content */}
      <div className="overflow-hidden pt-12 sm:pt-16 md:pt-20">
        <article className="px-6 sm:px-8 md:px-16 w-full max-w-3xl">
          <h1
            className="mb-6"
            style={{
              fontFamily: "'PP Pangaia', sans-serif",
              fontSize: "52px",
              fontWeight: "400",
              lineHeight: "1.2",
            }}
          >
            {post.title}
          </h1>

          <p style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif', fontSize: "14px", color: "#666", marginBottom: "32px" }}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div
            className="prose max-w-none"
            style={{
              fontFamily: '"Geist", "Geist Placeholder", sans-serif',
              fontSize: "16px",
              lineHeight: "1.8",
              color: "#000",
            }}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </div>
    </div>
  );
}
