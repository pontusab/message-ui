import type { CSSProperties, ReactNode } from "react";

export type TextProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Text({ children, className: _className, style }: TextProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontFamily: "Inter",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
