import type { CSSProperties } from "react";

export type DividerProps = {
  className?: string;
  style?: CSSProperties;
};

export function Divider({ className: _className, style }: DividerProps) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: 1,
        backgroundColor: "#3f3f46",
        ...style,
      }}
    />
  );
}
