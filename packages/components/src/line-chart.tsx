import type { CSSProperties, ReactNode } from "react";

export type LineChartProps = {
  /** Y values (at least one point). */
  series: number[];
  width: number;
  /** SVG chart height (labels render below and add ~26px when `labels` is set). */
  height: number;
  /** Line and point highlight color. */
  color?: string;
  strokeWidth?: number;
  /** Horizontal grid lines. */
  gridColor?: string;
  /** Fill under the line (rgba recommended). */
  areaColor?: string;
  /** X-axis labels; if omitted, none are drawn. */
  labels?: string[];
  style?: CSSProperties;
};

/** SVG line chart for Satori-rendered attachments (no canvas). Satori does not support SVG `<text>`, so axis labels use HTML. */
export function LineChart({
  series,
  width,
  height,
  color = "#38bdf8",
  strokeWidth = 2.5,
  gridColor = "#3f3f46",
  areaColor = "rgba(56, 189, 248, 0.12)",
  labels,
  style,
}: LineChartProps) {
  const padL = 8;
  const padR = 8;
  const padT = 10;
  const padB = 12;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  const data = series.length > 0 ? series : [0];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const xAt = (i: number) =>
    padL + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const yAt = (v: number) => padT + innerH - ((v - min) / span) * innerH;

  const linePoints = data.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
  const bottom = padT + innerH;
  const areaPoints = `${padL},${bottom} ${data.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ")} ${padL + innerW},${bottom}`;

  const gridLines = 4;
  const gridEls = Array.from({ length: gridLines + 1 }, (_, g) => {
    const y = padT + (innerH * g) / gridLines;
    return (
      <line
        key={`grid-${String(g)}`}
        x1={padL}
        y1={y}
        x2={padL + innerW}
        y2={y}
        stroke={gridColor}
        strokeWidth={1}
      />
    );
  });

  const labelRow: ReactNode =
    labels && labels.length > 0 ? (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width,
          justifyContent: "space-between",
          paddingLeft: 4,
          paddingRight: 4,
          marginTop: 2,
        }}
      >
        {labels.map((label, i) => {
          if (i >= data.length) {
            return null;
          }
          return (
            <div
              key={`${String(i)}-${label}`}
              style={{
                flex: 1,
                fontSize: 11,
                color: "#a1a1aa",
                fontFamily: "Inter",
                textAlign: "center",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    ) : null;

  return (
    <div style={{ ...style, display: "flex", flexDirection: "column", width }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block", flexShrink: 0 }}
        role="img"
        aria-label="Line chart"
      >
        {gridEls}
        <polygon fill={areaColor} points={areaPoints} />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          points={linePoints}
        />
        {data.map((v, i) => (
          <circle
            key={`${String(xAt(i))}-${String(yAt(v))}`}
            cx={xAt(i)}
            cy={yAt(v)}
            r={3.5}
            fill={color}
          />
        ))}
      </svg>
      {labelRow}
    </div>
  );
}
