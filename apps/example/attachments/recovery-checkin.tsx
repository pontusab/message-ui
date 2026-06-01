import { Attachment, LineChart, Row, Section, Text } from "@message-ui/components";
import type { PreviewRenderSize } from "@message-ui/preview";
import { Tailwind } from "@message-ui/tailwind";
import {
  bodyStyle,
  chipStyle,
  eyebrowStyle,
  metaStyle,
  metricStyle,
  moduleStyle,
  stageStyle,
  surfaceStyle,
  titleStyle,
} from "./shared.js";

export type RecoveryCheckinProps = {
  score: number;
  sleepHours: string;
  restingDelta: string;
  energy: string;
  readinessSeries: number[];
  readinessLabels: string[];
  note: string;
};

function RecoveryCheckinImpl({
  score,
  sleepHours,
  restingDelta,
  energy,
  readinessSeries,
  readinessLabels,
  note,
}: RecoveryCheckinProps) {
  return (
    <Tailwind style={{ backgroundColor: "#0a1010" }}>
      <Attachment style={stageStyle("#0a1010")}>
        <Section style={surfaceStyle("rgba(255,255,255,0.02)")}>
          <Section style={{ gap: 18 }}>
            <Row style={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Text style={eyebrowStyle}>Recovery check-in</Text>
              <div style={chipStyle("#7ef2d8", "rgba(45, 212, 191, 0.12)")}>
                <Text style={{ fontSize: 12, color: "#7ef2d8" }}>Ready to train</Text>
              </div>
            </Row>

            <Section style={{ gap: 8 }}>
              <Text style={metricStyle}>{score}</Text>
              <Text style={titleStyle}>Readiness score</Text>
              <Text style={bodyStyle}>A quick signal before you send today&apos;s coaching message.</Text>
            </Section>
          </Section>

          <Section style={{ gap: 14 }}>
            <Row style={{ gap: 12, width: "100%" }}>
              {[
                { label: "Sleep", value: sleepHours },
                { label: "Resting HR", value: restingDelta },
                { label: "Energy", value: energy },
              ].map((item) => (
                <Section key={item.label} style={{ ...moduleStyle(), flex: 1, gap: 6 }}>
                  <Text style={metaStyle}>{item.label}</Text>
                  <Text style={{ fontSize: 24, fontWeight: 600, color: "#ffffff" }}>{item.value}</Text>
                </Section>
              ))}
            </Row>

            <div style={moduleStyle()}>
              <Text style={{ ...metaStyle, marginBottom: 10 }}>Last 7 days</Text>
              <LineChart
                series={readinessSeries}
                width={688}
                height={120}
                color="#2dd4bf"
                areaColor="rgba(45, 212, 191, 0.1)"
                gridColor="rgba(255,255,255,0.08)"
                labels={readinessLabels}
              />
            </div>

            <Text style={bodyStyle}>{note}</Text>
          </Section>
        </Section>
      </Attachment>
    </Tailwind>
  );
}

export const RecoveryCheckin = Object.assign(RecoveryCheckinImpl, {
  PreviewProps: {
    score: 82,
    sleepHours: "7h 48m",
    restingDelta: "-4 bpm",
    energy: "High",
    readinessSeries: [64, 68, 71, 73, 76, 79, 82],
    readinessLabels: ["M", "T", "W", "T", "F", "S", "S"],
    note: "Good sleep and lower resting heart rate suggest your next workout can push a bit harder.",
  } satisfies RecoveryCheckinProps,
  PreviewSize: { width: 800, height: 800 } satisfies PreviewRenderSize,
});

export default RecoveryCheckin;
