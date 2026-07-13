export default function Home() {
  return (
    <div
      className="min-h-screen w-full text-black"
      style={{ backgroundColor: "#f6f4ec" }}
    >
      {/* Header */}
      <header className="w-full">
        <div className="flex justify-between items-start px-6 sm:px-8 md:px-16 py-3 sm:py-4">
          <div>
            <h1
              className="font-black mb-2"
              style={{
                fontFamily: "'PP Pangaia', sans-serif",
                fontWeight: "500",
                lineHeight: "1.1",
                fontSize: "32px",
              }}
            >
              Nick Barth
            </h1>
          </div>

          {/* Navigation */}
          <nav
            className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-right"
            style={{
              fontFamily: '"Geist", "Geist Placeholder", sans-serif',
              fontSize: "16px",
            }}
          >
            <a href="/blog" className="hover:text-gray-600 transition-colors">
              Blog
            </a>
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

      {/* Main content area */}
      <div className="overflow-hidden pt-12 sm:pt-16 md:pt-20">
        <div className="text-left px-6 sm:px-8 md:px-16 w-full">
          <div
            className="mb-2"
            style={{
              fontFamily: "'PP Pangaia', sans-serif",
              fontSize: "77px",
              fontWeight: "400",
              fontVariantLigatures: "common-ligatures",
              lineHeight: "92px",
            }}
          >
            Hands on go-to-market engineer who turns{" "}
            <span style={{ color: "#7c3aed" }}>data → revenue</span>
          </div>

          <p
            style={{
              fontFamily: '"Geist", "Geist Placeholder", sans-serif',
              fontSize: "24px",
              fontWeight: "300",
              lineHeight: "1.6",
              marginTop: "48px",
              color: "#000",
            }}
          >
            I'm a GTM Engineer with 11+ years of experience building data-driven
            growth systems across PLG and PLS motions. I specialize in
            connecting data, systems, and teams to optimize the customer
            journey, scale go-to-market strategies, and deliver measurable
            revenue outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
