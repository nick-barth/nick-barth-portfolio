import StickyHeader from "@/components/StickyHeader";
import WorkExperience from "@/components/WorkExperience";
import Approach from "@/components/Approach";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full text-black relative"
      style={{ backgroundColor: "#f6f4ec", zIndex: 1, position: "relative" }}
    >
      <StickyHeader />

      {/* Main content area */}
      <div className="overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-32">
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
              color: "#666",
            }}
          >
            I'm a GTM Engineer with 11+ years of experience architecting
            data-driven growth systems and revenue infrastructure across PLG and
            sales-led motions. I specialize in identifying revenue drivers,
            establishing feedback loops between data and product, and building
            sustainable go-to-market foundations that compound. Currently
            driving outcomes at Personio in Amsterdam.
          </p>
        </div>
      </div>

      {/* Work Experience Section */}
      <div className="overflow-hidden pt-16 sm:pt-48 md:pt-64">
        <div className="px-6 sm:px-8 md:px-16 w-full">
          <style>{`
            @media (max-width: 768px) {
              .growth-container {
                flex-direction: column !important;
              }
              .growth-title {
                position: static !important;
                margin-bottom: 24px !important;
              }
            }
          `}</style>
          <div className="growth-container" style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}>
            <div style={{ flex: "0 0 25%", paddingTop: "4px" }}>
              <h2
                className="growth-title"
                style={{
                  fontFamily: "'PP Pangaia', sans-serif",
                  fontSize: "32px",
                  fontWeight: "400",
                  color: "#000",
                  margin: 0,
                  position: "sticky",
                  top: "80px",
                  height: "fit-content",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Growth
              </h2>
            </div>
            <div style={{ flex: 1 }}>
              <WorkExperience />
            </div>
          </div>
        </div>
      </div>

      {/* Approach Section */}
      <div className="overflow-hidden pt-32 sm:pt-48 md:pt-64">
        <div className="px-6 sm:px-8 md:px-16 w-full">
          <Approach />
        </div>
      </div>

      {/* Spacing */}
      <div style={{ height: "400px" }} />
    </div>
  );
}
