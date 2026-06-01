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

export type AnalyticsDashboardProps = {
  productName?: string;
  /** Last N months MRR (thousands). */
  mrrSeries: number[];
  mrrLabels: string[];
  donutSegments: { value: number; color: string; name: string }[];
  stats: { label: string; value: string; hint: string }[];
};

function AnalyticsDashboardImpl({
  productName = "Northwind",
  mrrSeries,
  mrrLabels,
  donutSegments,
  stats,
}: AnalyticsDashboardProps) {
  const totalShare = donutSegments.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <Tailwind style={{ backgroundColor: "#0f172a" }}>
      <Attachment
        style={{
          backgroundColor: "#0f172a",
          padding: 22,
          width: "100%",
          boxSizing: "border-box",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#1e293b",
        }}
      >
        <Section style={{ gap: 16 }}>
          <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Section style={{ gap: 6 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  fontWeight: 600,
                }}
              >
                Workspace · {productName}
              </Text>
              <Heading level={1} style={{ color: "#f8fafc", fontSize: 28 }}>
                Growth snapshot
              </Heading>
              <Text style={{ fontSize: 14, color: "#94a3b8" }}>
                Recurring revenue and acquisition mix · snapshot as of today
              </Text>
            </Section>
            <Column
              style={{
                backgroundColor: "#1e293b",
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 8,
                alignItems: "flex-end",
              }}
            >
              <Text style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Status</Text>
              <Text style={{ fontSize: 13, color: "#4ade80", fontWeight: 600 }}>Healthy</Text>
            </Column>
          </Row>

          <Row style={{ gap: 10, width: "100%" }}>
            {stats.map((s) => (
              <Column
                key={s.label}
                style={{
                  flex: 1,
                  backgroundColor: "#1e293b",
                  padding: 14,
                  gap: 6,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#334155",
                }}
              >
                <Text style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{s.label}</Text>
                <Text style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>{s.value}</Text>
                <Text style={{ fontSize: 12, color: "#64748b" }}>{s.hint}</Text>
              </Column>
            ))}
          </Row>

          <Divider style={{ backgroundColor: "#334155" }} />

          <Text style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
            MRR · last 6 months
          </Text>
          <LineChart
            series={mrrSeries}
            width={752}
            height={158}
            color="#38bdf8"
            areaColor="rgba(56, 189, 248, 0.14)"
            gridColor="#334155"
            labels={mrrLabels}
          />

          <Row style={{ gap: 20, alignItems: "center", width: "100%" }}>
            <Column style={{ flex: 1, gap: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
                New signups by channel
              </Text>
              <Text style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.45 }}>
                Share of attributed trials started this month. Paid social includes spark campaigns.
              </Text>
              <Section style={{ gap: 8 }}>
                {donutSegments.map((seg) => (
                  <Row key={seg.name} style={{ gap: 10, alignItems: "center" }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: seg.color,
                      }}
                    />
                    <Text style={{ fontSize: 13, color: "#cbd5e1" }}>
                      <span style={{ color: "#f8fafc", fontWeight: 600 }}>{seg.name}</span>
                      {" · "}
                      {Math.round((seg.value / totalShare) * 100)}% ({seg.value} trials)
                    </Text>
                  </Row>
                ))}
              </Section>
            </Column>
            <DonutChart
              segments={donutSegments}
              size={124}
              strokeWidth={14}
              trackColor="#1e293b"
              centerLabel={`${totalShare}`}
              centerSublabel="trials"
            />
          </Row>
        </Section>
      </Attachment>
    </Tailwind>
  );
}

export const AnalyticsDashboard = Object.assign(AnalyticsDashboardImpl, {
  PreviewProps: {
    productName: "Northwind",
    mrrSeries: [42, 45, 48, 52, 58, 63],
    mrrLabels: ["J", "F", "M", "A", "M", "J"],
    donutSegments: [
      { name: "Organic search", value: 38, color: "#38bdf8" },
      { name: "Paid social", value: 24, color: "#a78bfa" },
      { name: "Referral", value: 18, color: "#f472b6" },
      { name: "Direct", value: 20, color: "#34d399" },
    ],
    stats: [
      { label: "Net MRR", value: "$63.0k", hint: "+8.6% vs last month" },
      { label: "Activations", value: "1,284", hint: "7-day rolling" },
      { label: "Churn", value: "1.9%", hint: "logo churn · enterprise" },
    ],
  } satisfies AnalyticsDashboardProps,
  PreviewSize: { width: 800, height: 1040 } satisfies PreviewRenderSize,
});

export default AnalyticsDashboard;
