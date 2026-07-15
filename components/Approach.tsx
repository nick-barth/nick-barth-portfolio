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
            fontWeight: "600",
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
            fontWeight: "600",
            lineHeight: "1.2",
            color: "#000",
          }}
        >
          Iterative. Fast. Informed.
        </div>
      </div>
    </div>
  );
}
