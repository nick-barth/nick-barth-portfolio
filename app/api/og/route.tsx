import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const fontPath = join(process.cwd(), "public/fonts/PPPangaia-Bold-BF654c530cc27f8.otf");
    const fontData = await readFile(fontPath);

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
  } catch (e) {
    return new Response("Failed to generate image", { status: 500 });
  }
}
