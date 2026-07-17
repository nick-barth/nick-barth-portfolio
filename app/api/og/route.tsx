import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#7c3aed",
          fontFamily: "'PP Pangaia', sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 200,
            fontWeight: 400,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          NB
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
