import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Nick Barth",
  description: "Thoughts on growth engineering, product strategy, and building.",
  openGraph: {
    title: "Blog — Nick Barth",
    description: "Thoughts on growth engineering, product strategy, and building.",
    url: "https://new-nick-barth.vercel.app/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen w-screen bg-white dark:bg-zinc-950 text-black dark:text-white p-6 sm:p-8 md:p-16">
      <Link href="/" className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors mb-8 inline-block">
        ← Home
      </Link>

      <div className="max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-bodoni)", fontStyle: "italic" }}>
          Blog
        </h1>

        <p className="text-zinc-700 dark:text-zinc-300 mb-12">
          Thoughts on growth engineering, product strategy, and building.
        </p>

        {posts.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No posts yet.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="pb-8 border-b border-zinc-200 dark:border-zinc-800 hover:opacity-70 transition-opacity">
                  <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-3">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-zinc-700 dark:text-zinc-300">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
