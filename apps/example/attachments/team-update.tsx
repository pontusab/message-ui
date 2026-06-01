import {
  Attachment,
  Avatar,
  Divider,
  Heading,
  List,
  ListItem,
  Row,
  Section,
  Text,
} from "@message-ui/components";
import type { PreviewRenderSize } from "@message-ui/preview";
import { Tailwind } from "@message-ui/tailwind";

export type TeamUpdateProps = {
  authorName: string;
  headline: string;
  bullets: string[];
};

function TeamUpdateImpl({ authorName, headline, bullets }: TeamUpdateProps) {
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
          <Row style={{ gap: 12, alignItems: "center" }}>
            <Avatar fallback={authorName} size={48} />
            <Section style={{ gap: 2 }}>
              <Text style={{ fontSize: 14, fontWeight: 600, color: "#fafafa" }}>{authorName}</Text>
              <Row style={{ gap: 8, alignItems: "center" }}>
                <Text style={{ fontSize: 12, color: "#71717a" }}>Product</Text>
                <Text style={{ fontSize: 12, color: "#52525b" }}>·</Text>
                <Text style={{ fontSize: 12, color: "#71717a" }}>Weekly sync</Text>
              </Row>
            </Section>
          </Row>
          <Heading level={3} style={{ color: "#e4e4e7" }}>
            {headline}
          </Heading>
          <Divider style={{ backgroundColor: "#27272a" }} />
          <List>
            {bullets.map((b) => (
              <ListItem key={b}>
                <Text style={{ fontSize: 14, color: "#d4d4d8", lineHeight: 1.5 }}>{b}</Text>
              </ListItem>
            ))}
          </List>
        </Section>
      </Attachment>
    </Tailwind>
  );
}

export const TeamUpdate = Object.assign(TeamUpdateImpl, {
  PreviewProps: {
    authorName: "Maya Singh",
    headline: "Ship notes for this week",
    bullets: [
      "Search is in beta for Pro workspaces — feedback welcome.",
      "Mobile attachments now match desktop rendering.",
      "Next freeze: API tokens UI on Thursday.",
    ],
  } satisfies TeamUpdateProps,
  PreviewSize: { width: 800, height: 540 } satisfies PreviewRenderSize,
});

export default TeamUpdate;
