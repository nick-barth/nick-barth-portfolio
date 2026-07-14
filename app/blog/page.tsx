import { getAllPosts } from "@/lib/blog";
import StickyHeader from "@/components/StickyHeader";
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
    <div className="min-h-screen w-full text-black relative" style={{ backgroundColor: "#f6f4ec", zIndex: 1, position: "relative" }}>
      <StickyHeader />

      {/* Blog Content */}
      <div className="overflow-hidden pt-12 sm:pt-16 md:pt-20">
        <div className="text-left px-6 sm:px-8 md:px-16 w-full">
          <h2
            className="mb-12"
            style={{
              fontFamily: "'PP Pangaia', sans-serif",
              fontSize: "77px",
              fontWeight: "400",
              lineHeight: "92px",
            }}
          >
            Blog
          </h2>

          {posts.length === 0 ? (
            <p style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif', fontSize: "16px" }}>No posts yet.</p>
          ) : (
            <div className="space-y-12">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="hover:opacity-70 transition-opacity">
                    <h3
                      className="mb-3"
                      style={{
                        fontFamily: "'PP Pangaia', sans-serif",
                        fontSize: "32px",
                        fontWeight: "400",
                        lineHeight: "1.2",
                      }}
                    >
                      {post.title}
                    </h3>
                    <p style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif', fontSize: "14px", color: "#666", marginBottom: "12px" }}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif', fontSize: "16px", lineHeight: "1.6" }}>
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
