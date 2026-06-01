import { Children, type CSSProperties, isValidElement, type ReactNode } from "react";
import { ListItem } from "./list-item.js";
import { Text } from "./text.js";

export type ListProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** When true, items are numbered; otherwise a bullet is used. */
  ordered?: boolean;
};

export function List({ children, className: _className, ordered = false, style }: ListProps) {
  const items = Children.toArray(children).filter(Boolean);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        ...style,
      }}
    >
      {items.map((child, i) => {
        const prefix = ordered ? `${i + 1}.` : "•";
        const body =
          isValidElement(child) && child.type === ListItem ? (
            child
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minWidth: 0,
              }}
            >
              {child}
            </div>
          );
        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 8,
              width: "100%",
            }}
          >
            <Text style={{ flexShrink: 0, color: "#a1a1aa" }}>{prefix}</Text>
            {body}
          </div>
        );
      })}
    </div>
  );
}
