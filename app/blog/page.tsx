import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Nick Barth",
  description: "Articles on scaling products, user acquisition, and data-driven decision making.",
  metadataBase: new URL("https://new-nick-barth.vercel.app"),
  alternates: {
    canonical: "https://new-nick-barth.vercel.app/blog",
  },
  openGraph: {
    title: "Blog — Nick Barth",
    description: "Articles on scaling products, user acquisition, and data-driven decision making.",
    url: "https://new-nick-barth.vercel.app/blog",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-950 text-black dark:text-white p-6 sm:p-8 md:p-16">
      <Link href="/" className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors mb-8 inline-block">
        ← Home
      </Link>

      <div className="max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-bodoni)", fontStyle: "italic" }}>
          Blog
        </h1>

        {posts.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No posts yet.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="pb-8 hover:opacity-70 transition-opacity">
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

      <footer className="mt-16 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
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
