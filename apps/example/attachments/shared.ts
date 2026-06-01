import type { CSSProperties } from "react";

export const palette = {
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.68)",
  textSoft: "rgba(255,255,255,0.46)",
  textFaint: "rgba(255,255,255,0.34)",
  border: "rgba(255,255,255,0.08)",
  borderSoft: "rgba(255,255,255,0.06)",
  panel: "rgba(255,255,255,0.03)",
  panelSoft: "rgba(255,255,255,0.02)",
} as const;

export function stageStyle(background: string): CSSProperties {
  return {
    width: "100%",
    height: "100%",
    background,
    padding: 20,
    boxSizing: "border-box",
    justifyContent: "flex-start",
    alignItems: "stretch",
  };
}

export function surfaceStyle(background: string): CSSProperties {
  return {
    width: "100%",
    height: "100%",
    padding: 28,
    boxSizing: "border-box",
    justifyContent: "space-between",
    background,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: palette.borderSoft,
    overflow: "hidden",
    position: "relative",
  };
}

export const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: palette.textSoft,
};

export const metricStyle: CSSProperties = {
  fontSize: 62,
  lineHeight: 0.98,
  fontWeight: 600,
  color: palette.text,
};

export const titleStyle: CSSProperties = {
  fontSize: 20,
  lineHeight: 1.2,
  color: palette.textSoft,
};

export const bodyStyle: CSSProperties = {
  fontSize: 16,
  lineHeight: 1.45,
  color: palette.textMuted,
};

export const metaStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.35,
  color: palette.textFaint,
};

export function moduleStyle(): CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: palette.borderSoft,
    backgroundColor: palette.panelSoft,
    padding: 16,
    boxSizing: "border-box",
  };
}

export function chipStyle(textColor: string, backgroundColor: string): CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: palette.border,
    backgroundColor,
    color: textColor,
  };
}
