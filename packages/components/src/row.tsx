import type { CSSProperties, ReactNode } from "react";

export type RowProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Row({ children, className: _className, style }: RowProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
