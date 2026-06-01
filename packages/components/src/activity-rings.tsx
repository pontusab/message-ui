import type { CSSProperties } from "react";

/** Move / Exercise / Stand goals — same shape as Apple Watch Activity rings. */
export type ActivityRingMetric = {
  current: number;
  goal: number;
};

export type ActivityRingsProps = {
  move: ActivityRingMetric;
  exercise: ActivityRingMetric;
  stand: ActivityRingMetric;
  /** Square size in px. */
  size?: number;
  /** Ring stroke width in viewBox units (shared). */
  strokeWidth?: number;
  style?: CSSProperties;
};

const TAU = 2 * Math.PI;

/** Apple Watch–style three concentric activity rings (Move · Exercise · Stand). Satori-safe SVG only. */
export function ActivityRings({
  move,
  exercise,
  stand,
  size = 220,
  strokeWidth = 8,
  style,
}: ActivityRingsProps) {
  const vb = 132;
  const cx = vb / 2;
  const cy = vb / 2;
  /** Outer → inner: Move, Exercise, Stand (centerlines spaced for stroke width). */
  const radii = [52, 39, 26] as const;
  const colors = ["#fa114f", "#92e82a", "#2ee7ff"] as const;
  const track = "#3a3a3c";

  const metrics = [move, exercise, stand];
  const rings = radii.map((r, i) => {
    const C = TAU * r;
    const goal = metrics[i].goal || 1;
    const p = clamp(metrics[i].current / goal, 0, 1);
    const len = p * C;
    const gap = Math.max(C - len, 0.02);
    return { r, len, gap, color: colors[i] };
  });

  const circles = rings.flatMap((ring) => [
    <circle
      key={`t-${String(ring.r)}`}
      cx={cx}
      cy={cy}
      r={ring.r}
      fill="none"
      stroke={track}
      strokeWidth={strokeWidth}
      transform={`rotate(-90 ${cx} ${cy})`}
    />,
    <circle
      key={`p-${String(ring.r)}`}
      cx={cx}
      cy={cy}
      r={ring.r}
      fill="none"
      stroke={ring.color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={`${ring.len} ${ring.gap}`}
      transform={`rotate(-90 ${cx} ${cy})`}
    />,
  ]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${vb} ${vb}`}
      style={{ display: "block", flexShrink: 0, ...style }}
      role="img"
      aria-label="Activity rings"
    >
      {circles}
    </svg>
  );
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
