import type { CSSProperties } from "react";

export type DonutSegment = {
  value: number;
  color: string;
};

export type DonutChartProps = {
  segments: DonutSegment[];
  /** Outer box size in px. */
  size: number;
  /** Ring thickness. */
  strokeWidth: number;
  /** Background ring color. */
  trackColor?: string;
  /** Optional center label (e.g. total or %). Satori does not support SVG `<text>`; these render as HTML overlays. */
  centerLabel?: string;
  centerSublabel?: string;
  style?: CSSProperties;
};

const TAU = 2 * Math.PI;

/** SVG donut chart for Satori-rendered attachments. */
export function DonutChart({
  segments,
  size,
  strokeWidth,
  trackColor = "#27272a",
  centerLabel,
  centerSublabel,
  style,
}: DonutChartProps) {
  const vb = 100;
  const cx = vb / 2;
  const cy = vb / 2;
  const r = 38;
  const C = TAU * r;

  const total = segments.reduce((s, x) => s + x.value, 0) || 1;

  let acc = 0;
  const arcs = segments.map((seg) => {
    const len = clamp((seg.value / total) * C, 0, C);
    const gap = Math.max(C - len, 0.02);
    const dash = `${len} ${gap}`;
    const offset = -acc;
    acc += len;
    return (
      <circle
        key={`${seg.color}-${String(offset)}`}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    );
  });

  return (
    <div
      style={{
        ...style,
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${vb} ${vb}`}
        style={{ display: "block" }}
        role="img"
        aria-label="Donut chart"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {arcs}
      </svg>
      {(centerLabel || centerSublabel) && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: size,
            height: size,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {centerLabel ? (
            <div
              style={{
                fontSize: Math.max(11, size * 0.13),
                fontWeight: 700,
                color: "#fafafa",
                fontFamily: "Inter",
              }}
            >
              {centerLabel}
            </div>
          ) : null}
          {centerSublabel ? (
            <div
              style={{
                fontSize: Math.max(9, size * 0.078),
                color: "#a1a1aa",
                fontFamily: "Inter",
              }}
            >
              {centerSublabel}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
