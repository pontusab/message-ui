import Image from "next/image";

import deliveryWindow from "../../../example/out/delivery-window.png";
import gateChange from "../../../example/out/gate-change.png";
import recoveryCheckin from "../../../example/out/recovery-checkin.png";
import spendPulse from "../../../example/out/spend-pulse.png";

const EXAMPLES = [
  {
    title: "Delivery update",
    description: "Live order progress with ETA, courier info, and status milestones.",
    file: "delivery-window.tsx",
    image: deliveryWindow,
  },
  {
    title: "Recovery check-in",
    description: "A coaching card with readiness score, key metrics, and a trend line.",
    file: "recovery-checkin.tsx",
    image: recoveryCheckin,
  },
  {
    title: "Gate change",
    description: "Time-sensitive travel updates for departures, seats, and terminal changes.",
    file: "gate-change.tsx",
    image: gateChange,
  },
  {
    title: "Spend pulse",
    description: "A weekly finance summary with totals, category context, and a spend chart.",
    file: "spend-pulse.tsx",
    image: spendPulse,
  },
];

export function ExamplesGallery() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {EXAMPLES.map((example) => (
        <div
          key={example.file}
          className="overflow-hidden rounded-xl border border-white/6 bg-white/2"
        >
          <div className="border-b border-white/6 px-4 py-3">
            <div className="font-mono text-[11px] text-zinc-500">{example.file}</div>
            <h3 className="mt-2 text-lg font-semibold text-white">{example.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">{example.description}</p>
          </div>
          <div className="border-b border-white/6 bg-[#09090a] p-4">
            <div className="overflow-hidden rounded-md border border-white/6 bg-black/20">
              <Image
                src={example.image}
                alt={example.title}
                className="h-auto w-full grayscale"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
          <div className="px-4 py-3 text-sm text-zinc-500">
            Real exported example from the `apps/example/attachments` set.
          </div>
        </div>
      ))}
    </div>
  );
}
