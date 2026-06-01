<p align="center">
  <img src="https://raw.githubusercontent.com/pontusab/message-ui/main/apps/web/public/og.png" alt="Message UI — Dynamic message attachments" width="100%" />
</p>

# Message UI

**Dynamic message attachments, built with React.**

Message UI is React Email for message attachments. Author rich attachment cards as
React components, preview them locally with hot reload, then export the same template to a
PNG you can send through iMessage, WhatsApp, and other chat surfaces — perfect for chat
bots and agents that need to send more than plain text.

## Install

```bash
npm install @message-ui/render @message-ui/components @message-ui/tailwind
```

## Quick start

Write an attachment as a React component:

```tsx
import { Attachment, Text, Row } from "@message-ui/components";

export default function OrderCard() {
  return (
    <Attachment style={{ padding: 24, maxWidth: 400, backgroundColor: "#18181b" }}>
      <Text style={{ fontSize: 20, fontWeight: 600, color: "#fafafa" }}>Your order</Text>
      <Row style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 14, color: "#a1a1aa" }}>Ships today · Track in Messages</Text>
      </Row>
    </Attachment>
  );
}
```

Preview your templates locally with live reload:

```bash
npx message-ui dev --dir ./attachments
```

Export a template to a PNG from a script, server route, or job:

```ts
import { renderToPng } from "@message-ui/render";
import OrderCard from "./attachments/order-card";

const png = await renderToPng(<OrderCard />, { width: 800, height: 800 });
// upload, attach, or write to disk
```

## How it works

- **Author** attachments as React templates with the component patterns you already use.
- **Preview** locally — `message-ui dev` serves a browser preview with search and instant refresh on save.
- **Export** the same template to sharp PNGs via [Satori](https://github.com/vercel/satori) + Resvg, with predictable output paths.

## Packages

| Package | Description |
| --- | --- |
| `@message-ui/components` | Attachment primitives — `Attachment`, `Row`, `Section`, `Text`, `Heading`, `Image`, `Avatar`, `Divider`, `List`, `LineChart`, `DonutChart`, `ActivityRings`, and more. |
| `@message-ui/render` | Renders React elements to SVG/PNG with `renderToPng` and `renderToSvg`. |
| `@message-ui/tailwind` | `Tailwind` wrapper for styling templates. |
| `@message-ui/preview` | Local preview server used by the CLI. |
| `@message-ui/cli` | `message-ui dev` and `message-ui export` commands. |

## Works with your stack

Message UI is the attachment layer. Use it alongside your chat runtime, app backend, and
delivery flow — including frameworks like [Chat SDK](https://chat-sdk.dev/) when you need a
visual attachment layer for multi-channel chat apps.

## License

MIT © [@pontusab](https://x.com/pontusab)
