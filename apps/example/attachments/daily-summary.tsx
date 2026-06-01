import {
  Attachment,
  Column,
  Divider,
  DonutChart,
  Heading,
  LineChart,
  Row,
  Section,
  Text,
} from "@message-ui/components";
import type { PreviewRenderSize } from "@message-ui/preview";
import { Tailwind } from "@message-ui/tailwind";

export type DailySummaryProps = {
  title?: string;
  /** 7 daily step counts (Mon–Sun). */
  stepsSeries: number[];
  dayLabels: string[];
  /** Macro split (e.g. protein / carbs / fat) as relative weights. */
  macroSegments: { value: number; color: string }[];
  headlineStat: string;
  headlineLabel: string;
};

function DailySummaryImpl({
  title = "This week at a glance",
  stepsSeries,
  dayLabels,
  macroSegments,
  headlineStat,
  headlineLabel,
}: DailySummaryProps) {
  const macroTotal = macroSegments.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <Tailwind style={{ backgroundColor: "#18181b" }}>
      <Attachment
        style={{
          backgroundColor: "#18181b",
          padding: 24,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Section style={{ gap: 14 }}>
          <Row style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
            <Section style={{ gap: 6 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: "#71717a",
                  textTransform: "uppercase",
                  letterSpacing: 1.1,
                  fontWeight: 600,
                }}
              >
                Health
              </Text>
              <Heading level={1} style={{ color: "#fafafa" }}>
                {title}
              </Heading>
            </Section>
            <Column style={{ alignItems: "flex-end", gap: 2 }}>
              <Text style={{ fontSize: 28, fontWeight: 700, color: "#86efac" }}>
                {headlineStat}
              </Text>
              <Text style={{ fontSize: 12, color: "#a1a1aa" }}>{headlineLabel}</Text>
            </Column>
          </Row>

          <Divider style={{ backgroundColor: "#27272a" }} />

          <Text style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7" }}>
            Steps · last 7 days
          </Text>
          <LineChart
            series={stepsSeries}
            width={752}
            height={140}
            color="#4ade80"
            areaColor="rgba(74, 222, 128, 0.12)"
            gridColor="#3f3f46"
            labels={dayLabels}
          />

          <Row style={{ gap: 18, alignItems: "center", width: "100%" }}>
            <Column style={{ flex: 1, gap: 10 }}>
              <Text style={{ fontSize: 13, fontWeight: 600, color: "#e4e4e7" }}>
                Macros · target mix
              </Text>
              <Text style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.5 }}>
                A balanced plate keeps energy steady through the afternoon. Tap any day in the chart
                to compare.
              </Text>
              <Section style={{ gap: 6 }}>
                {macroSegments.map((seg) => (
                  <Row
                    key={`${seg.color}-${String(seg.value)}`}
                    style={{ gap: 8, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: seg.color,
                      }}
                    />
                    <Text style={{ fontSize: 13, color: "#d4d4d8" }}>
                      {Math.round((seg.value / macroTotal) * 100)}% of meals logged
                    </Text>
                  </Row>
                ))}
              </Section>
            </Column>
            <DonutChart
              segments={macroSegments}
              size={112}
              strokeWidth={12}
              trackColor="#27272a"
              centerLabel="Balanced"
              centerSublabel="this week"
            />
          </Row>
        </Section>
      </Attachment>
    </Tailwind>
  );
}

export const DailySummary = Object.assign(DailySummaryImpl, {
  PreviewProps: {
    title: "This week at a glance",
    stepsSeries: [6200, 8420, 9100, 7800, 11200, 9800, 10450],
    dayLabels: ["M", "T", "W", "T", "F", "S", "S"],
    macroSegments: [
      { value: 32, color: "#f472b6" },
      { value: 44, color: "#fbbf24" },
      { value: 24, color: "#60a5fa" },
    ],
    headlineStat: "10.4k",
    headlineLabel: "avg steps · rolling 7d",
  } satisfies DailySummaryProps,
  PreviewSize: { width: 800, height: 900 } satisfies PreviewRenderSize,
});

export default DailySummary;
