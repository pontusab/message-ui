import type { CSSProperties, ReactNode } from "react";

export type AttachmentProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Root container for an iMessage attachment image (Satori subtree). */
export function Attachment({ children, className: _className, style }: AttachmentProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
