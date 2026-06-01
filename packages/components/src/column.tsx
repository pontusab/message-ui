import type { CSSProperties, ReactNode } from "react";

export type ColumnProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Flex column child for use inside Row (React Email–style columns). */
export function Column({ children, className: _className, style }: ColumnProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
