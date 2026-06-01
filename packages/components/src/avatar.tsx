import type { CSSProperties } from "react";
import { Image } from "./image.js";
import { Text } from "./text.js";

export type AvatarProps = {
  className?: string;
  style?: CSSProperties;
  /** Raster source; when omitted, `fallback` initials are shown. */
  src?: string;
  /** Used for initials when `src` is missing (first two characters). */
  fallback?: string;
  /** Square size in pixels. */
  size?: number;
};

function initialsFromFallback(fallback: string | undefined): string {
  if (!fallback?.trim()) {
    return "?";
  }
  const parts = fallback.trim().split(/\s+/);
  if (parts.length >= 2) {
    const a = parts[0]?.[0];
    const b = parts[1]?.[0];
    if (a && b) {
      return (a + b).toUpperCase();
    }
  }
  return fallback.slice(0, 2).toUpperCase();
}

/** Square image or initials placeholder. */
export function Avatar({
  className: _className,
  src,
  fallback = "?",
  size = 40,
  style,
}: AvatarProps) {
  const s = size;
  const shell: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: s,
    height: s,
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: "#3f3f46",
    ...style,
  };

  if (src) {
    return (
      <div style={shell}>
        <Image alt="" height={s} src={src} width={s} />
      </div>
    );
  }

  const label = initialsFromFallback(fallback);
  return (
    <div style={shell}>
      <Text style={{ fontSize: s * 0.4, fontWeight: 600, color: "#fafafa" }}>{label}</Text>
    </div>
  );
}
