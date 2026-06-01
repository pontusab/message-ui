import {
  Attachment,
  Column,
  Divider,
  Heading,
  LineChart,
  Row,
  Section,
  Text,
} from "@message-ui/components";
import type { PreviewRenderSize } from "@message-ui/preview";
import { Tailwind } from "@message-ui/tailwind";

export type WorkoutSummaryProps = {
  title: string;
  durationMinutes: number;
  activeCalories: number;
  avgHeartRate: number;
  /** Heart rate samples across the session (bpm). */
  heartRateSeries: number[];
};

function WorkoutSummaryImpl({
  title,
  durationMinutes,
  activeCalories,
  avgHeartRate,
  heartRateSeries,
}: WorkoutSummaryProps) {
  const hrLabels =
    heartRateSeries.length <= 8 ? heartRateSeries.map((_, i) => `${i + 1}`) : undefined;

  return (
    <Tailwind style={{ backgroundColor: "#0c0a09" }}>
      <Attachment
        style={{
          backgroundColor: "#0c0a09",
          padding: 24,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Section style={{ gap: 16 }}>
          <Section style={{ gap: 6 }}>
            <Text
              style={{
                fontSize: 12,
                color: "#78716c",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Workout
            </Text>
            <Heading level={1} style={{ color: "#fafaf9" }}>
              {title}
            </Heading>
            <Text style={{ fontSize: 13, color: "#a8a29e" }}>
              Outdoor run · GPS · Heart rate strap
            </Text>
          </Section>

          <Divider style={{ backgroundColor: "#292524" }} />

          <Row style={{ gap: 12, alignItems: "stretch" }}>
            <Column style={{ gap: 6, backgroundColor: "#1c1917", padding: 12, flex: 1 }}>
              <Text style={{ fontSize: 12, color: "#a8a29e" }}>Time</Text>
              <Text style={{ fontSize: 22, fontWeight: 700, color: "#fbbf24" }}>
                {durationMinutes}m
              </Text>
            </Column>
            <Column style={{ gap: 6, backgroundColor: "#1c1917", padding: 12, flex: 1 }}>
              <Text style={{ fontSize: 12, color: "#a8a29e" }}>Active</Text>
              <Text style={{ fontSize: 22, fontWeight: 700, color: "#fb923c" }}>
                {activeCalories}
              </Text>
              <Text style={{ fontSize: 11, color: "#78716c" }}>kcal</Text>
            </Column>
            <Column style={{ gap: 6, backgroundColor: "#1c1917", padding: 12, flex: 1 }}>
              <Text style={{ fontSize: 12, color: "#a8a29e" }}>Avg HR</Text>
              <Text style={{ fontSize: 22, fontWeight: 700, color: "#f87171" }}>
                {avgHeartRate}
              </Text>
              <Text style={{ fontSize: 11, color: "#78716c" }}>bpm</Text>
            </Column>
          </Row>

          <Section style={{ gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: 600, color: "#e7e5e4" }}>
              Heart rate · session
            </Text>
            <LineChart
              series={heartRateSeries}
              width={752}
              height={132}
              color="#f87171"
              areaColor="rgba(248, 113, 113, 0.12)"
              gridColor="#44403c"
              labels={hrLabels}
            />
          </Section>
        </Section>
      </Attachment>
    </Tailwind>
  );
}

export const WorkoutSummary = Object.assign(WorkoutSummaryImpl, {
  PreviewProps: {
    title: "Morning intervals",
    durationMinutes: 42,
    activeCalories: 418,
    avgHeartRate: 152,
    heartRateSeries: [118, 132, 148, 155, 162, 158, 151, 142, 128],
  } satisfies WorkoutSummaryProps,
  PreviewSize: { width: 800, height: 880 } satisfies PreviewRenderSize,
});

export default WorkoutSummary;
