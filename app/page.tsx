import StickyHeader from "@/components/StickyHeader";
import WorkExperience from "@/components/WorkExperience";
import Approach from "@/components/Approach";
import { InViewAnimationWrapper } from "@/components/InViewAnimationWrapper";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full text-black relative"
      style={{ backgroundColor: "#f6f4ec" }}
    >
      <StickyHeader />

      <div className="w-full mx-auto" style={{ maxWidth: "1200px" }}>
        {/* Main content area */}
        <div className="overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-32">
          <div className="text-left px-6 sm:px-8 md:px-16 w-full">
            <div
              className="mb-2"
              style={{
                fontFamily: "'PP Pangaia', sans-serif",
                fontSize: "clamp(32px, 10vw, 77px)",
                fontWeight: "400",
                fontVariantLigatures: "common-ligatures",
                lineHeight: "1.2",
              }}
            >
              Hands-on growth engineer who turns{" "}
              <span
                className="animate-slide-in"
                style={{ color: "#7c3aed", display: "inline-block" }}
              >
                data → revenue
              </span>
            </div>

            <InViewAnimationWrapper animationClass="animate-fade-in-up">
              <p
                style={{
                  fontFamily: '"Geist", "Geist Placeholder", sans-serif',
                  fontSize: "clamp(16px, 4vw, 24px)",
                  fontWeight: "300",
                  lineHeight: "1.6",
                  marginTop: "clamp(24px, 6vw, 48px)",
                  color: "#666",
                }}
              >
                I'm a Growth Engineer with 11+ years of experience architecting
                data-driven growth systems and revenue infrastructure across PLG
                and sales-led motions. I specialize in identifying revenue
                drivers, establishing feedback loops between data and product,
                and building sustainable go-to-market foundations that compound.
                Currently driving outcomes at Personio in Amsterdam.
              </p>
            </InViewAnimationWrapper>

            <InViewAnimationWrapper animationClass="animate-fade-in-up">
              <a
                href="/nick_barth_resume.pdf"
                download="nick_barth_resume.pdf"
                style={{
                  display: "inline-block",
                  marginTop: "clamp(32px, 8vw, 48px)",
                  padding: "12px 24px",
                  backgroundColor: "#7c3aed",
                  color: "#f6f4ec",
                  textDecoration: "none",
                  fontFamily: '"Geist", "Geist Placeholder", sans-serif',
                  fontSize: "16px",
                  fontWeight: "500",
                  borderRadius: "4px",
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Download Resume
              </a>
            </InViewAnimationWrapper>
          </div>
        </div>

        {/* Divider */}
        <div className="pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-24 md:pb-32">
          <div className="px-6 sm:px-8 md:px-16 w-full">
            <hr className="border-t border-gray-300" />
          </div>
        </div>

        {/* Work Experience Section */}
        <div>
          <div className="px-6 sm:px-8 md:px-16 w-full">
            <style>{`
            @media (max-width: 768px) {
              .work-grid {
                display: flex !important;
                flex-direction: column !important;
              }
              .growth-title {
                position: static !important;
                margin-bottom: 24px !important;
              }
            }
          `}</style>
            <div className="work-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "48px" }}>
              <h2
                className="growth-title"
                style={{
                  fontFamily: "'PP Pangaia', sans-serif",
                  fontSize: "32px",
                  fontWeight: "400",
                  color: "#000",
                  margin: 0,
                  paddingTop: "clamp(48px, 12vw, 128px)",
                  paddingBottom: "16px",
                  position: "sticky",
                  top: "75px",
                  zIndex: 20,
                  height: "fit-content",
                  gridColumn: 1,
                }}
              >
                Growth
              </h2>
              <div style={{ gridColumn: 2 }}>
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
    </div>
  );
}
