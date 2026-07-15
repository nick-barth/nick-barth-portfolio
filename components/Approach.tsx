"use client";

export default function Approach() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "48px",
        paddingTop: "64px",
        paddingBottom: "64px",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'PP Pangaia', sans-serif",
            fontSize: "18px",
            fontWeight: "400",
            marginBottom: "48px",
            color: "#000",
            letterSpacing: "0.5px",
          }}
        >
          Approach
        </div>
      </div>

      <div
        style={{
          flex: 1,
          maxWidth: "600px",
        }}
      >
        <div
          style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: "56px",
            fontWeight: "400",
            lineHeight: "1.2",
            marginBottom: "24px",
            color: "#000",
          }}
        >
          Direct. Fast. Iterative. Informed.
        </div>
        <p
          style={{
            fontFamily: '"Geist", "Geist Placeholder", sans-serif',
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#666",
          }}
        >
          These principles shape how I approach growth. I believe in getting to the core of the problem quickly, acting decisively, learning constantly, and letting data guide every decision.
        </p>
      </div>
    </div>
  );
}
