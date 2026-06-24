import { getPostBySlug, getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const url = `https://new-nick-barth.vercel.app/blog/${post.slug}`;

  return {
    title: `${post.title} — Nick Barth`,
    description: post.excerpt,
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
    },
    canonical: url,
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen w-screen bg-white dark:bg-zinc-950 text-black dark:text-white p-6 sm:p-8 md:p-16">
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
    </div>
  );
}
