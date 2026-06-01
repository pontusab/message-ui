const ITEMS = [
  { label: "@message-ui/components", value: "React templates" },
  { label: "message-ui dev", value: "Local preview" },
  { label: "@message-ui/render", value: "PNG export" },
  { label: "TypeScript", value: "Typed props" },
];

export function CapabilityStrip() {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-white/6 bg-white/2 px-4 py-3 text-left"
        >
          <div className="font-mono text-[11px] text-zinc-500">{item.label}</div>
          <div className="mt-1 text-sm font-medium text-zinc-200">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
