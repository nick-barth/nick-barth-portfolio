"use client";

export default function Approach() {
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
            align-items: center;
            justify-content: space-between;
            gap: 48px;
            padding-top: 64px;
            padding-bottom: 64px;
            flex-direction: row;
          }
          .approach-label {
            margin-bottom: 48px !important;
          }
          .approach-content {
            flex: 1;
            max-width: 600px;
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
              fontSize: "16px",
              fontWeight: "600",
              color: "#000",
              letterSpacing: "0.5px",
            }}
          >
            Approach
          </div>
        </div>

        <div className="approach-content">
          <div
            className="approach-heading"
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontSize: "clamp(36px, 8vw, 72px)",
              fontWeight: "700",
              lineHeight: "1.2",
              marginBottom: "20px",
              color: "#000",
            }}
          >
            Fast. Iterative. Informed.
          </div>
          <p
            className="approach-description"
            style={{
              fontFamily: '"Geist", "Geist Placeholder", sans-serif',
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#666",
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
