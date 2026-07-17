"use client";

import { useInViewAnimation } from "@/hooks/useInViewAnimation";

export default function Approach() {
  const { ref: titleRef, isInView: titleInView } = useInViewAnimation();
  const { ref: descRef, isInView: descInView } = useInViewAnimation();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingTop: "32px",
        paddingBottom: "32px",
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          .approach-container {
            display: flex;
            align-items: flex-start;
            gap: 48px;
            padding-top: 64px;
            padding-bottom: 64px;
            flex-direction: row;
          }
          .approach-label {
            flex: 0 0 25%;
            margin-bottom: 0 !important;
          }
          .approach-content {
            flex: 1;
          }
          .approach-heading {
            font-size: 72px !important;
          }
          .approach-description {
            font-size: 18px !important;
          }
        }
      `}</style>

      <div className="approach-container" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="approach-label" style={{ marginBottom: 0 }}>
          <div
            style={{
              fontFamily: "'PP Pangaia', sans-serif",
              fontSize: "32px",
              fontWeight: "400",
              color: "#000",
            }}
          >
            Approach
          </div>
        </div>

        <div className="approach-content">
          <div
            ref={titleRef}
            className="approach-heading"
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "clamp(36px, 8vw, 72px)",
              fontWeight: "700",
              lineHeight: "1.2",
              marginBottom: "20px",
              color: "#000",
              opacity: titleInView ? 1 : 0,
              transform: titleInView ? "translateX(0)" : "translateX(-20px)",
              transition: "all 0.8s ease-out",
            }}
          >
            Fast. Iterative. Informed.
          </div>
          <p
            ref={descRef}
            className="approach-description"
            style={{
              fontFamily: '"Geist", "Geist Placeholder", sans-serif',
              fontSize: "18px",
              lineHeight: "1.8",
              color: "#666",
              opacity: descInView ? 1 : 0,
              transform: descInView ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease-out 0.2s",
            }}
          >
            Move quickly, learn constantly through iteration, and let data guide
            every decision.
          </p>
        </div>
      </div>
    </div>
  );
}
