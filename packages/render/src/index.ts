import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { Resvg } from "@resvg/resvg-js";
import type { ReactNode } from "react";
import satori from "satori";

const require = createRequire(import.meta.url);

export type RenderOptions = {
  width: number;
  height: number;
  /**
   * Yoga layout pixel grid (Satori). Use when you intentionally lay out at a
   * multiple of logical points (e.g. custom high-DPI SVG) so positions snap to
   * device pixels.
   */
  pointScaleFactor?: number;
};

/** Options for PNG rasterization; adds a pixel-density scale when rasterizing only. */
export type PngRenderOptions = RenderOptions & {
  /**
   * Output pixel density: the PNG width is `width * scale` (height scales proportionally).
   * Layout stays at logical `width` × `height` so font sizes and spacing look correct.
   * Default `3` (output pixel dimensions are `width × scale` by `height × scale`).
   */
  scale?: number;
};

export class RenderError extends Error {
  override readonly name = "RenderError";
}

function loadInterLatin(weight: 400 | 500 | 600 | 700): Buffer {
  const fontPath = require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`);
  return readFileSync(fontPath);
}

/** Real per-weight files so Satori does not fake bold (blurry) for 600/700. */
const defaultFonts = [
  {
    name: "Inter",
    data: loadInterLatin(400),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Inter",
    data: loadInterLatin(500),
    weight: 500 as const,
    style: "normal" as const,
  },
  {
    name: "Inter",
    data: loadInterLatin(600),
    weight: 600 as const,
    style: "normal" as const,
  },
  {
    name: "Inter",
    data: loadInterLatin(700),
    weight: 700 as const,
    style: "normal" as const,
  },
];

function toSatoriElement(node: ReactNode): Parameters<typeof satori>[0] {
  return node as Parameters<typeof satori>[0];
}

export async function renderToSvg(element: ReactNode, options: RenderOptions): Promise<string> {
  try {
    return await satori(toSatoriElement(element), {
      width: options.width,
      height: options.height,
      fonts: defaultFonts,
      ...(options.pointScaleFactor !== undefined
        ? { pointScaleFactor: options.pointScaleFactor }
        : {}),
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    throw new RenderError(`Satori render failed: ${message}`, { cause });
  }
}

export async function renderToPng(element: ReactNode, options: PngRenderOptions): Promise<Buffer> {
  const scale = options.scale ?? 3;
  const w = options.width * scale;
  // Layout at logical size so px font sizes and padding match the design; scale only in Resvg.
  const svg = await renderToSvg(element, {
    width: options.width,
    height: options.height,
  });
  try {
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: w,
      },
      shapeRendering: 2,
      textRendering: 2,
      imageRendering: 0,
    });
    return Buffer.from(resvg.render().asPng());
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    throw new RenderError(`PNG rasterization failed: ${message}`, { cause });
  }
}
