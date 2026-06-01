import { Attachment, Row, Section, Text } from "@message-ui/components";
import type { PreviewRenderSize } from "@message-ui/preview";
import { Tailwind } from "@message-ui/tailwind";
import {
  bodyStyle,
  chipStyle,
  eyebrowStyle,
  metaStyle,
  metricStyle,
  moduleStyle,
  palette,
  stageStyle,
  surfaceStyle,
  titleStyle,
} from "./shared.js";

export type DeliveryWindowProps = {
  etaMinutes: number;
  courierName: string;
  orderLabel: string;
  arrivalWindow: string;
  stages: string[];
  activeStage: number;
  note: string;
};

function DeliveryWindowImpl({
  etaMinutes,
  courierName,
  orderLabel,
  arrivalWindow,
  stages,
  activeStage,
  note,
}: DeliveryWindowProps) {
  return (
    <Tailwind style={{ backgroundColor: "#0b120d" }}>
      <Attachment
        style={stageStyle(
          "radial-gradient(circle at top left, rgba(74, 222, 128, 0.14), transparent 32%), #0b120d",
        )}
      >
        <Section
          style={surfaceStyle(
            "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)",
          )}
        >
          <Section style={{ gap: 18 }}>
            <Row style={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Text style={eyebrowStyle}>Delivery window</Text>
              <div style={chipStyle("#9df7b5", "rgba(74, 222, 128, 0.12)")}>
                <Text style={{ fontSize: 12, color: "#9df7b5" }}>On route</Text>
              </div>
            </Row>

            <Section style={{ gap: 8 }}>
              <Text style={metricStyle}>{etaMinutes} min</Text>
              <Text style={titleStyle}>ETA to your door</Text>
              <Text style={bodyStyle}>
                {courierName} is carrying {orderLabel}.
              </Text>
            </Section>

            <Row style={{ gap: 12, width: "100%" }}>
              <Section style={{ ...moduleStyle(), flex: 1, gap: 6 }}>
                <Text style={metaStyle}>Courier</Text>
                <Text style={{ fontSize: 24, fontWeight: 600, color: "#ffffff" }}>{courierName}</Text>
              </Section>
              <Section style={{ ...moduleStyle(), flex: 1, gap: 6 }}>
                <Text style={metaStyle}>Arrival window</Text>
                <Text style={{ fontSize: 24, fontWeight: 600, color: "#ffffff" }}>{arrivalWindow}</Text>
              </Section>
            </Row>
          </Section>

          <Section style={{ gap: 14 }}>
            <div style={moduleStyle()}>
              <Row style={{ justifyContent: "space-between", width: "100%", marginBottom: 12 }}>
                {stages.map((stage, index) => {
                  const active = index <= activeStage;
                  const current = index === activeStage;
                  return (
                    <Section key={stage} style={{ alignItems: "center", gap: 8, flex: 1 }}>
                      <div
                        style={{
                          width: "100%",
                          height: 12,
                          backgroundColor: active ? "#4ade80" : "rgba(255,255,255,0.08)",
                          borderRadius: 0,
                          boxShadow: current ? "0 0 16px rgba(74, 222, 128, 0.18)" : "none",
                        }}
                      />
                      <Text style={{ fontSize: 12, color: active ? palette.text : palette.textFaint }}>
                        {stage}
                      </Text>
                    </Section>
                  );
                })}
              </Row>
            </div>

            <Row style={{ justifyContent: "space-between", width: "100%" }}>
              <Text style={metaStyle}>Updates live as the courier moves.</Text>
              <Text style={metaStyle}>Refresh 20s ago</Text>
            </Row>

            <Text style={bodyStyle}>{note}</Text>
          </Section>
        </Section>
      </Attachment>
    </Tailwind>
  );
}

export const DeliveryWindow = Object.assign(DeliveryWindowImpl, {
  PreviewProps: {
    etaMinutes: 12,
    courierName: "Nina",
    orderLabel: "your lunch order",
    arrivalWindow: "12:40-12:55",
    stages: ["Packed", "Picked up", "Nearby", "Delivered"],
    activeStage: 2,
    note: "Courier is two blocks away and your drop-off photo will appear in this thread.",
  } satisfies DeliveryWindowProps,
  PreviewSize: { width: 800, height: 800 } satisfies PreviewRenderSize,
});

export default DeliveryWindow;
