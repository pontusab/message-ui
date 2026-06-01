import { CodePreviewShowcase } from "./components/code-preview-showcase";
import { CopyButton } from "./components/copy-button";
import { ExamplesGallery } from "./components/examples-gallery";
import { Logo } from "./components/logo";

const INSTALL = "npm install @message-ui/render @message-ui/components @message-ui/tailwind";
const DEV = "npx message-ui dev --dir ./attachments";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-[#050506] text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-white/6 bg-[#050506]/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <Logo />
          </div>
          <nav className="flex items-center gap-6 text-sm text-zinc-400">
            <a href="#examples" className="transition hover:text-white">
              Examples
            </a>
            <a href="#get-started" className="transition hover:text-white">
              Get started
            </a>
            <a
              href="https://github.com/pontusab/message-ui"
              className="transition hover:text-white"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero: one full viewport below header; next sections start on scroll */}
        <section className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center border-b border-white/6 py-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="hero-bg-grid absolute inset-0 mask-[linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]" />
          </div>

          <div className="mx-auto w-full max-w-6xl px-6">
            <h1 className="font-pixel mx-auto max-w-4xl text-center text-4xl leading-[1.1] text-white md:text-6xl">
              Dynamic chat
              <br />
              attachments
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-zinc-400 md:text-lg">
              Build rich chat attachments with React. Develop locally, then export PNGs for iMessage,
              WhatsApp, and more in one line of code.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <a
                href="#get-started"
                className="inline-flex h-10 items-center bg-white px-5 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Get started
              </a>
              <a
                href="https://github.com/pontusab/message-ui"
                className="inline-flex h-10 items-center border border-white/12 bg-white/4 px-5 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/8"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </div>

            <div className="mt-16 flex justify-center">
              <div className="flex w-full max-w-md items-center justify-between gap-4 border border-white/8 bg-[#0c0c0e] py-3 pl-5 pr-3">
                <code className="font-mono text-sm text-zinc-300">
                  <span className="text-zinc-600">$</span> npm i @message-ui/render
                </code>
                <CopyButton text="npm i @message-ui/render" />
              </div>
            </div>
          </div>
        </section>

        <section id="code-preview" className="border-b border-white/6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <CodePreviewShowcase />
          </div>
        </section>

        <section id="examples" className="border-b border-white/6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Start from real examples
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-400">
              Real exported attachments from the example app, covering commerce, health, travel, and
              finance scenarios.
            </p>

            <div className="mt-14">
              <ExamplesGallery />
            </div>
          </div>
        </section>

        <section id="get-started" className="border-b border-white/6 py-20 md:py-28">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Get started
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-zinc-400">
              Install the packages, then run the preview to edit templates locally and export them to
              PNGs.
            </p>

            <div className="mt-12">
              <div className="code-panel overflow-hidden border border-white/8 bg-[#0c0c0e]">
                <div className="flex items-center justify-between border-b border-white/6 px-4 py-2.5">
                  <span className="font-mono text-xs text-zinc-500">Terminal</span>
                  <CopyButton text={`${INSTALL}\n${DEV}`} />
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-zinc-300">
                  <code>
                    <span className="text-zinc-600"># install</span>
                    {"\n"}
                    {INSTALL}
                    {"\n\n"}
                    <span className="text-zinc-600"># preview locally, then export PNGs</span>
                    {"\n"}
                    {DEV}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-4xl">
              What you get
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-zinc-400">
              Primitives for attachment-style layouts, a renderer that outputs sharp PNGs, and tools to preview
              and export—focused on this one job, not general-purpose UI.
            </p>

            <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
              {[
                {
                  title: "React components",
                  body: "Author attachments as React templates with the same component patterns you already use.",
                },
                {
                  title: "Live preview",
                  body: "Run a local preview server with template search, selection, and instant refresh on save.",
                },
                {
                  title: "PNG export",
                  body: "Export templates to PNGs with predictable output paths for uploads, jobs, or CI.",
                },
                {
                  title: "Layouts & charts",
                  body: "Use rows, sections, text, images, avatars, and charts built for dense attachment cards.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-white/6 bg-white/2 p-6 transition hover:border-white/10"
                >
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="works-with" className="border-t border-white/6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Fits into your stack
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-400">
              Message UI is the attachment layer: use it alongside your chat runtime, app backend, and
              delivery flow.
            </p>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              <div className="border border-white/6 bg-white/2 p-6">
                <div className="font-mono text-[11px] text-zinc-500">Frameworks</div>
                <h3 className="mt-2 text-lg font-semibold text-white">Chat SDK and similar</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Use Message UI with frameworks like{" "}
                  <a
                    href="https://chat-sdk.dev/"
                    className="text-zinc-300 underline decoration-white/20 underline-offset-4 transition hover:text-white hover:decoration-white/40"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Chat SDK
                  </a>{" "}
                  when you need a visual attachment layer for multi-channel chat apps.
                </p>
              </div>

              <div className="border border-white/6 bg-white/2 p-6">
                <div className="font-mono text-[11px] text-zinc-500">Channels</div>
                <h3 className="mt-2 text-lg font-semibold text-white">iMessage, WhatsApp, and more</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Build once in React, then render attachments for the chat surfaces where your users
                  already spend time.
                </p>
              </div>

              <div className="border border-white/6 bg-white/2 p-6">
                <div className="font-mono text-[11px] text-zinc-500">Runtime</div>
                <h3 className="mt-2 text-lg font-semibold text-white">CLI, jobs, or server routes</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Run preview locally during development, then export from app routes, workers, or
                  background jobs in production.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <span className="text-sm text-zinc-500">© {new Date().getFullYear()} Message UI</span>
          <a
            href="https://x.com/pontusab"
            className="text-sm text-zinc-500 transition hover:text-zinc-300"
            rel="noopener noreferrer"
            target="_blank"
          >
            @pontusab
          </a>
        </div>
      </footer>
    </div>
  );
}
