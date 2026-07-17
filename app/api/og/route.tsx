import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const fontData = await fetch(
    "https://new-nick-barth.vercel.app/fonts/PPPangaia-Bold-BF654c530cc27f8.otf"
  ).then((res) => res.arrayBuffer());

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
          fontFamily: "PPPangaia",
        }}
      >
        <div
          style={{
            fontSize: 200,
            fontWeight: 700,
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
      fonts: [
        {
          name: "PPPangaia",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
