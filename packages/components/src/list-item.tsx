import type { CSSProperties, ReactNode } from "react";

export type ListItemProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Row content for a list row; use inside List. */
export function ListItem({ children, className: _className, style }: ListItemProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
