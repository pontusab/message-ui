import type { CSSProperties } from "react";

function formatSize(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

export type SpacerProps = {
  className?: string;
  style?: CSSProperties;
  /** Horizontal size. If omitted while height is set, width defaults to 100%. */
  width?: number | string;
  /** Vertical size. If omitted while width is set, height defaults to 0. */
  height?: number | string;
};

/** Fixed layout gap; set width, height, or both for predictable Satori layout. */
export function Spacer({ className: _className, width, height, style }: SpacerProps) {
  if (width === undefined && height === undefined) {
    return (
      <div
        style={{
          display: "flex",
          width: 8,
          height: 8,
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  const w = width !== undefined ? formatSize(width) : height !== undefined ? "100%" : "8px";
  const h = height !== undefined ? formatSize(height) : width !== undefined ? "0px" : "8px";

  return (
    <div
      style={{
        display: "flex",
        width: w,
        height: h,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
