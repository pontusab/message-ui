"use client";

import { useState } from "react";

const TAILWIND_TAB = "tailwind";
const INLINE_TAB = "inline";

const CODE_TAILWIND = `import { Attachment, Text, Row } from "@message-ui/components";
import { Tailwind } from "@message-ui/tailwind";

export default function OrderCard() {
  return (
    <Tailwind style={{ backgroundColor: "#18181b" }}>
      <Attachment style={{ padding: 24, maxWidth: 400 }}>
        <Text style={{ fontSize: 20, fontWeight: 600, color: "#fafafa" }}>
          Your order
        </Text>
        <Row style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 14, color: "#a1a1aa" }}>
            Ships today · Track in Messages
          </Text>
        </Row>
      </Attachment>
    </Tailwind>
  );
}`;

const CODE_INLINE = `import { Attachment, Text, Row } from "@message-ui/components";

export default function OrderCard() {
  return (
    <Attachment
      style={{
        padding: 24,
        maxWidth: 400,
        backgroundColor: "#18181b",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: 600, color: "#fafafa" }}>
        Your order
      </Text>
      <Row style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 14, color: "#a1a1aa" }}>
          Ships today · Track in Messages
        </Text>
      </Row>
    </Attachment>
  );
}`;

type TabId = typeof TAILWIND_TAB | typeof INLINE_TAB;

export function CodePreviewShowcase() {
  const [styleTab, setStyleTab] = useState<TabId>(TAILWIND_TAB);
  const code = styleTab === TAILWIND_TAB ? CODE_TAILWIND : CODE_INLINE;

  return (
    <div className="w-full">
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          What a template looks like
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-400 md:text-lg">
          A template is a small React file that renders an attachment card. In the real workflow you edit
          the template, preview it locally, then export the same template to a PNG. Toggle to compare
          using the <span className="text-zinc-300">Tailwind</span> wrapper vs{" "}
          <span className="text-zinc-300">inline styles</span>.
        </p>
      </div>

      <div className="code-panel overflow-hidden border border-white/8 bg-[#0c0c0e]">
        {/* File + style tabs — react.email pattern */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 px-3 py-2 sm:px-4">
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="bg-white/6 px-2.5 py-1 text-zinc-300">order-card.tsx</span>
          </div>
          <div className="flex border border-white/8 bg-black/40 p-0.5">
            <button
              type="button"
              onClick={() => setStyleTab(TAILWIND_TAB)}
              className={`px-3 py-1.5 text-xs font-medium transition ${
                styleTab === TAILWIND_TAB
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Tailwind
            </button>
            <button
              type="button"
              onClick={() => setStyleTab(INLINE_TAB)}
              className={`px-3 py-1.5 text-xs font-medium transition ${
                styleTab === INLINE_TAB
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Inline CSS
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-white/6">
          {/* Code */}
          <div className="min-h-[280px] max-h-[min(52vh,420px)] overflow-auto border-b border-white/6 lg:max-h-[min(60vh,480px)] lg:border-b-0">
            <pre className="p-4 font-mono text-[12px] leading-relaxed text-zinc-300 md:text-[13px]">
              <code>{code}</code>
            </pre>
          </div>

          {/* Preview — static mock matching the snippet output */}
          <div className="flex min-h-[280px] flex-col bg-[#050506] lg:min-h-0">
            <div className="border-b border-white/6 px-4 py-2">
              <span className="text-xs font-medium text-zinc-500">Preview</span>
            </div>
            <div className="preview-frame relative flex flex-1 items-center justify-center overflow-hidden bg-[#0a0a0a] p-6 md:p-10">
              <div
                className="relative w-full max-w-[320px] border border-white/10 bg-[#18181b] p-6"
                style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)" }}
              >
                <p className="text-xl font-semibold text-white">Your order</p>
                <p className="mt-3 text-sm text-zinc-400">Ships today · Track in Messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
