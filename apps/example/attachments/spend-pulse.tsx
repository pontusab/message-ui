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

export type SpendPulseProps = {
  spent: string;
  leftToBudget: string;
  topCategory: string;
  transactionCount: string;
  spendSeries: number[];
  spendLabels: string[];
  note: string;
};

function SpendPulseImpl({
  spent,
  leftToBudget,
  topCategory,
  transactionCount,
  spendSeries,
  spendLabels,
  note,
}: SpendPulseProps) {
  return (
    <Tailwind style={{ backgroundColor: "#120d0a" }}>
      <Attachment style={stageStyle("#120d0a")}>
        <Section style={surfaceStyle("rgba(255,255,255,0.02)")}>
          <Section style={{ gap: 18 }}>
            <Row style={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Text style={eyebrowStyle}>Weekly spend pulse</Text>
              <div style={chipStyle("#fdba74", "rgba(251, 146, 60, 0.12)")}>
                <Text style={{ fontSize: 12, color: "#fdba74" }}>Budget on track</Text>
              </div>
            </Row>

            <Section style={{ gap: 8 }}>
              <Text style={metricStyle}>{spent}</Text>
              <Text style={titleStyle}>Spent this week</Text>
              <Text style={bodyStyle}>A compact budget update for your finance assistant.</Text>
            </Section>
          </Section>

          <Section style={{ gap: 14 }}>
            <Row style={{ gap: 12, width: "100%" }}>
              {[
                { label: "Left to budget", value: leftToBudget },
                { label: "Top category", value: topCategory },
                { label: "Transactions", value: transactionCount },
              ].map((item) => (
                <Section key={item.label} style={{ ...moduleStyle(), flex: 1, gap: 6 }}>
                  <Text style={metaStyle}>{item.label}</Text>
                  <Text style={{ fontSize: 22, fontWeight: 600, color: "#ffffff" }}>{item.value}</Text>
                </Section>
              ))}
            </Row>

            <div style={moduleStyle()}>
              <Text style={{ ...metaStyle, marginBottom: 10 }}>Daily spend trend</Text>
              <LineChart
                series={spendSeries}
                width={688}
                height={120}
                color="#fb923c"
                areaColor="rgba(251, 146, 60, 0.12)"
                gridColor="rgba(255,255,255,0.08)"
                labels={spendLabels}
              />
            </div>

            <Text style={bodyStyle}>{note}</Text>
          </Section>
        </Section>
      </Attachment>
    </Tailwind>
  );
}

export const SpendPulse = Object.assign(SpendPulseImpl, {
  PreviewProps: {
    spent: "$428",
    leftToBudget: "$92",
    topCategory: "Dining",
    transactionCount: "23",
    spendSeries: [38, 62, 54, 88, 47, 72, 67],
    spendLabels: ["M", "T", "W", "T", "F", "S", "S"],
    note: "Spending is trending below your weekly cap, with dining still the biggest category.",
  } satisfies SpendPulseProps,
  PreviewSize: { width: 800, height: 800 } satisfies PreviewRenderSize,
});

export default SpendPulse;
