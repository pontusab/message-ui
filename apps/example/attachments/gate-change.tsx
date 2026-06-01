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
  stageStyle,
  surfaceStyle,
  titleStyle,
} from "./shared.js";

export type GateChangeProps = {
  flightCode: string;
  route: string;
  newGate: string;
  oldGate: string;
  boardingInMinutes: number;
  departureTime: string;
  seat: string;
  note: string;
};

function GateChangeImpl({
  flightCode,
  route,
  newGate,
  oldGate,
  boardingInMinutes,
  departureTime,
  seat,
  note,
}: GateChangeProps) {
  return (
    <Tailwind style={{ backgroundColor: "#0d0f14" }}>
      <Attachment style={stageStyle("#0d0f14")}>
        <Section style={surfaceStyle("rgba(255,255,255,0.02)")}>
          <Section style={{ gap: 18 }}>
            <Row style={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Text style={eyebrowStyle}>Travel update</Text>
              <div style={chipStyle("#a8d3ff", "rgba(96, 165, 250, 0.12)")}>
                <Text style={{ fontSize: 12, color: "#a8d3ff" }}>Gate changed</Text>
              </div>
            </Row>

            <Row style={{ justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <Section style={{ gap: 8 }}>
                <Text style={metricStyle}>{newGate}</Text>
                <Text style={titleStyle}>Board from gate {newGate}</Text>
                <Text style={bodyStyle}>{flightCode} · {route}</Text>
              </Section>

              <Section style={{ ...moduleStyle(), width: 134, gap: 6 }}>
                <Text style={metaStyle}>Seat</Text>
                <Text style={{ fontSize: 24, fontWeight: 600, color: "#ffffff" }}>{seat}</Text>
                <Text style={metaStyle}>Boarding in {boardingInMinutes} min</Text>
              </Section>
            </Row>

            <Row style={{ gap: 12, width: "100%" }}>
              <Section style={{ ...moduleStyle(), flex: 1, gap: 6 }}>
                <Text style={metaStyle}>Departs</Text>
                <Text style={{ fontSize: 24, fontWeight: 600, color: "#ffffff" }}>{departureTime}</Text>
              </Section>
              <Section style={{ ...moduleStyle(), flex: 1, gap: 6 }}>
                <Text style={metaStyle}>Route</Text>
                <Text style={{ fontSize: 24, fontWeight: 600, color: "#ffffff" }}>{route}</Text>
              </Section>
            </Row>
          </Section>

          <Section style={{ gap: 14 }}>
            <Row style={{ gap: 12, width: "100%" }}>
              <Section style={{ ...moduleStyle(), flex: 1, gap: 6 }}>
                <Text style={metaStyle}>Previous gate</Text>
                <Text style={{ fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
                  {oldGate}
                </Text>
              </Section>
              <Section style={{ ...moduleStyle(), flex: 1, gap: 6 }}>
                <Text style={metaStyle}>New gate</Text>
                <Text style={{ fontSize: 28, fontWeight: 600, color: "#ffffff" }}>{newGate}</Text>
              </Section>
            </Row>

            <div style={moduleStyle()}>
              <Text style={metaStyle}>Terminal note</Text>
              <Text style={{ ...bodyStyle, marginTop: 8 }}>{note}</Text>
            </div>
          </Section>
        </Section>
      </Attachment>
    </Tailwind>
  );
}

export const GateChange = Object.assign(GateChangeImpl, {
  PreviewProps: {
    flightCode: "SK218",
    route: "ARN -> CDG",
    newGate: "C14",
    oldGate: "B07",
    boardingInMinutes: 19,
    departureTime: "19:05",
    seat: "14A",
    note: "Security is clear in Terminal C. Walk straight from the lounge and boarding opens at 18:40.",
  } satisfies GateChangeProps,
  PreviewSize: { width: 800, height: 800 } satisfies PreviewRenderSize,
});

export default GateChange;
