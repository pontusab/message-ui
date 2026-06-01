import { Attachment, Divider, Heading, Row, Section, Text } from "@message-ui/components";
import type { PreviewRenderSize } from "@message-ui/preview";
import { Tailwind } from "@message-ui/tailwind";

export type OrderLine = {
  name: string;
  qty: number;
  lineTotalCents: number;
};

export type OrderConfirmationProps = {
  merchantName: string;
  orderNumber: string;
  lines: OrderLine[];
  totalCents: number;
};

function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function OrderConfirmationImpl({
  merchantName,
  orderNumber,
  lines,
  totalCents,
}: OrderConfirmationProps) {
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
        <Section style={{ gap: 16 }}>
          <Row style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Section style={{ gap: 4 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#71717a",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {merchantName}
              </Text>
              <Heading level={2} style={{ color: "#fafafa" }}>
                Order confirmed
              </Heading>
            </Section>
            <Text style={{ fontSize: 13, color: "#a1a1aa" }}>#{orderNumber}</Text>
          </Row>
          <Divider style={{ backgroundColor: "#27272a" }} />
          <Text style={{ fontSize: 14, fontWeight: 600, color: "#e4e4e7" }}>Items</Text>
          <Section style={{ gap: 10 }}>
            {lines.map((line) => (
              <Row
                key={`${line.name}-${line.qty}`}
                style={{ justifyContent: "space-between", width: "100%" }}
              >
                <Text style={{ fontSize: 14, color: "#d4d4d8" }}>
                  {line.name} × {line.qty}
                </Text>
                <Text style={{ fontSize: 14, color: "#fafafa" }}>
                  {formatUsd(line.lineTotalCents)}
                </Text>
              </Row>
            ))}
          </Section>
          <Divider style={{ backgroundColor: "#27272a" }} />
          <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: 600, color: "#fafafa" }}>Total</Text>
            <Text style={{ fontSize: 20, fontWeight: 700, color: "#86efac" }}>
              {formatUsd(totalCents)}
            </Text>
          </Row>
          <Text style={{ fontSize: 12, color: "#71717a", lineHeight: 1.5 }}>
            You’ll get tracking as soon as your order ships. Need help? Reply to this thread — we’re
            here.
          </Text>
        </Section>
      </Attachment>
    </Tailwind>
  );
}

export const OrderConfirmation = Object.assign(OrderConfirmationImpl, {
  PreviewProps: {
    merchantName: "Oak & Co.",
    orderNumber: "48291",
    lines: [
      { name: "Merino crewneck", qty: 1, lineTotalCents: 7800 },
      { name: "Shipping", qty: 1, lineTotalCents: 599 },
    ],
    totalCents: 8399,
  } satisfies OrderConfirmationProps,
  PreviewSize: { width: 800, height: 560 } satisfies PreviewRenderSize,
});

export default OrderConfirmation;
