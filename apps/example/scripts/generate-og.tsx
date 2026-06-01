import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { renderToPng } from "@message-ui/render";

const WIDTH = 1200;
const HEIGHT = 630;

const element = (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#050506",
      padding: 80,
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
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
        marginTop: 28,
        fontSize: 34,
        fontWeight: 400,
        color: "#8b8b93",
      }}
    >
      Dynamic message attachments
    </div>
  </div>
);

const png = await renderToPng(element, { width: WIDTH, height: HEIGHT, scale: 2 });
const out = resolve(import.meta.dir, "../../web/public/og.png");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, png);
console.log(`wrote ${out} (${png.length} bytes)`);
