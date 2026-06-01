import type { CSSProperties, ReactNode } from "react";

/** Tailwind config object (same authoring shape as @react-email/tailwind; compile target is Satori — TODO). */
export type TailwindConfig = Record<string, unknown>;

export type TailwindProps = {
  children?: ReactNode;
  /** Tailwind theme/config; compiled to inline styles in a future release. */
  config?: TailwindConfig;
  style?: CSSProperties;
};

/**
 * Wrap children for Tailwind-style `className` usage. Implementation will mirror
 * `@react-email/tailwind` with a Satori-compatible style pipeline.
 *
 * Uses a real node (not a fragment) so Satori gets an explicit layout root.
 */
export function Tailwind({ children, style }: TailwindProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
