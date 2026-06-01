import type { CSSProperties, ReactNode } from "react";

export type SectionProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Section({ children, className: _className, style }: SectionProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
