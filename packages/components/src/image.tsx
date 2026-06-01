import type { CSSProperties } from "react";

export type ImageProps = {
  className?: string;
  style?: CSSProperties;
  /** Image URL. Use an absolute `https:` URL or a `data:` URL for reliable Satori / Resvg output. */
  src: string;
  /** Pixel width (required for layout). */
  width: number;
  /** Pixel height (required for layout). */
  height: number;
  alt?: string;
};

/** Embedded raster; dimensions are required for predictable Satori layout. */
export function Image({ className: _className, src, width, height, alt = "", style }: ImageProps) {
  return (
    <img
      alt={alt}
      height={height}
      src={src}
      style={{
        display: "block",
        width,
        height,
        objectFit: "cover",
        ...style,
      }}
      width={width}
    />
  );
}
