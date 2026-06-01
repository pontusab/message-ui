import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Message UI — Dynamic message attachments";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "public", "og-fonts");
const semibold = readFileSync(join(fontDir, "Geist-SemiBold.ttf"));
const regular = readFileSync(join(fontDir, "Geist-Regular.ttf"));

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#050506",
      }}
    >
      <div
        style={{
          fontFamily: "Geist",
          fontSize: 104,
          fontWeight: 600,
          letterSpacing: -3,
          color: "#fafafa",
          lineHeight: 1,
        }}
      >
        message-ui
      </div>
      <div
        style={{
          fontFamily: "Geist",
          fontWeight: 400,
          marginTop: 28,
          fontSize: 34,
          color: "#8b8b93",
        }}
      >
        Dynamic message attachments
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
