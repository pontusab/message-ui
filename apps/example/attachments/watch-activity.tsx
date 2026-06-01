import {
  ActivityRings,
  Attachment,
  Column,
  Heading,
  Row,
  Section,
  Text,
} from "@message-ui/components";
import type { PreviewRenderSize } from "@message-ui/preview";
import { Tailwind } from "@message-ui/tailwind";

export type WatchActivityProps = {
  dayLabel: string;
  move: { current: number; goal: number; unit: string };
  exercise: { current: number; goal: number; unit: string };
  stand: { current: number; goal: number; unit: string };
};

function formatRatio(current: number, goal: number): string {
  const g = goal || 1;
  return `${Math.round(current)}/${Math.round(g)}`;
}

function WatchActivityImpl({ dayLabel, move, exercise, stand }: WatchActivityProps) {
  const metrics: {
    label: string;
    color: string;
    current: number;
    goal: number;
    unit: string;
  }[] = [
    { label: "Move", color: "#fa114f", ...move },
    { label: "Exercise", color: "#92e82a", ...exercise },
    { label: "Stand", color: "#2ee7ff", ...stand },
  ];

  return (
    <Tailwind style={{ backgroundColor: "#000000" }}>
      <Attachment
        style={{
          backgroundColor: "#000000",
          padding: 28,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Section style={{ gap: 20, alignItems: "center" }}>
          <Section style={{ gap: 6, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#8e8e93",
                letterSpacing: 0.3,
                textTransform: "uppercase",
              }}
            >
              Activity
            </Text>
            <Heading level={1} style={{ color: "#ffffff", fontSize: 34, fontWeight: 600 }}>
              {dayLabel}
            </Heading>
          </Section>

          <ActivityRings
            move={{ current: move.current, goal: move.goal }}
            exercise={{ current: exercise.current, goal: exercise.goal }}
            stand={{ current: stand.current, goal: stand.goal }}
            size={240}
            strokeWidth={8}
          />

          <Row
            style={{
              width: "100%",
              justifyContent: "space-between",
              paddingLeft: 8,
              paddingRight: 8,
              marginTop: 8,
            }}
          >
            {metrics.map((m) => (
              <Column key={m.label} style={{ flex: 1, alignItems: "center", gap: 8 }}>
                <Row style={{ gap: 6, alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      width: 8,
                      height: 8,
                      backgroundColor: m.color,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#8e8e93",
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                    }}
                  >
                    {m.label}
                  </Text>
                </Row>
                <Text style={{ fontSize: 28, fontWeight: 600, color: "#ffffff" }}>
                  {formatRatio(m.current, m.goal)}
                </Text>
                <Text style={{ fontSize: 12, color: "#636366" }}>{m.unit}</Text>
              </Column>
            ))}
          </Row>

          <Text style={{ fontSize: 12, color: "#48484a", marginTop: 4 }}>
            Close your rings by burning active energy, logging brisk minutes, and standing each
            hour.
          </Text>
        </Section>
      </Attachment>
    </Tailwind>
  );
}

export const WatchActivity = Object.assign(WatchActivityImpl, {
  PreviewProps: {
    dayLabel: "Saturday",
    move: { current: 612, goal: 600, unit: "CAL" },
    exercise: { current: 38, goal: 30, unit: "MIN" },
    stand: { current: 11, goal: 12, unit: "HRS" },
  } satisfies WatchActivityProps,
  PreviewSize: { width: 800, height: 900 } satisfies PreviewRenderSize,
});

export default WatchActivity;
