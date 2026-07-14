import StickyHeader from "@/components/StickyHeader";
import WorkExperience from "@/components/WorkExperience";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full text-black relative"
      style={{ backgroundColor: "#f6f4ec", zIndex: 1, position: "relative" }}
    >
      <StickyHeader />

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
            Hands on go-to-market engineer specialised in turning{" "}
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
            revenue outcomes. Currently, I'm a GTM Engineer at Personio in
            Amsterdam.
          </p>
        </div>
      </div>

      {/* Work Experience Section */}
      <div className="overflow-hidden pt-32 sm:pt-48 md:pt-64">
        <div className="px-6 sm:px-8 md:px-16 w-full max-w-4xl">
          <WorkExperience />
        </div>
      </div>

      {/* Spacing */}
      <div style={{ height: "400px" }} />
    </div>
  );
}
