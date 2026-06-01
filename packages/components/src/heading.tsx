import type { CSSProperties, ReactNode } from "react";

const levelDefaults: Record<1 | 2 | 3, Pick<CSSProperties, "fontSize" | "fontWeight">> = {
  1: { fontSize: 32, fontWeight: 700 },
  2: { fontSize: 24, fontWeight: 600 },
  3: { fontSize: 20, fontWeight: 600 },
};

export type HeadingProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Visual level; maps to default type scale. */
  level?: 1 | 2 | 3;
};

export function Heading({ children, className: _className, level = 1, style }: HeadingProps) {
  const defaults = levelDefaults[level];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontFamily: "Inter",
        ...defaults,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
