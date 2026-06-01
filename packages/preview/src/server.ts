import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, statSync, watch, writeFileSync } from "node:fs";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { renderToPng } from "@message-ui/render";
import * as esbuild from "esbuild";
import { type ComponentType, createElement } from "react";

export type PreviewServerOptions = {
  port: number;
  /** Directory of attachment templates (relative to cwd or absolute). */
  dir: string;
  /**
   * If set, write every template PNG here on startup and when `.tsx` files change
   * (same output as `message-ui export`).
   */
  exportDir?: string;
};

type SseClient = ServerResponse;

function walkTsxFiles(absDir: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(p);
      } else if (entry.isFile() && extname(entry.name) === ".tsx") {
        out.push(p);
      }
    }
  };
  walk(absDir);
  return out;
}

/** Relative id from the templates root: `a/b/card` for `a/b/card.tsx` (forward slashes). */
function templateIdFromAbsPath(absFile: string, absRoot: string): string {
  const rel = relative(absRoot, absFile);
  const withoutExt = rel.replace(/\.tsx$/i, "");
  return withoutExt.split(sep).join("/");
}

function listTemplateIds(absDir: string): string[] {
  const root = resolve(absDir);
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    return [];
  }
  return walkTsxFiles(root)
    .map((p) => templateIdFromAbsPath(p, root))
    .filter((id) => id.length > 0)
    .sort();
}

function resolveTemplatePath(absDir: string, id: string): string {
  const root = resolve(absDir);
  const normalized = id.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) {
    throw new Error("Invalid template name");
  }
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) {
    throw new Error("Invalid template name");
  }
  for (const seg of segments) {
    if (seg === "." || seg === "..") {
      throw new Error("Invalid template name");
    }
  }
  const candidate = resolve(root, ...segments.slice(0, -1), segments[segments.length - 1] + ".tsx");
  const rel = relative(root, candidate);
  if (rel.startsWith("..") || rel.includes("..")) {
    throw new Error("Invalid path");
  }
  if (!existsSync(candidate)) {
    throw new Error(`Template not found: ${id}`);
  }
  return candidate;
}

/** Logical pixels passed to `renderToPng` (default below). Set on a template as `PreviewSize`. */
export type PreviewRenderSize = {
  width: number;
  height: number;
};

/**
 * Open Graph / common link-preview aspect ratio (1200×630). Relevant when your asset is served as
 * `og:image` for **web link previews** in Messages (wide hero / banner). Not a requirement for
 * **in-app rendered** attachment images, which are often taller cards with charts or lists.
 * @see https://developer.apple.com/documentation/technotes/tn3156-create-rich-previews-for-messages
 */
export const IMESSAGE_LINK_PREVIEW_ASPECT = 1200 / 630;

/** Apple TN3156: shared preview images should be at least this wide in **raster pixels** (e.g. met at scale 3 with logical width ≥ 300). */
export const IMESSAGE_MIN_PREVIEW_IMAGE_WIDTH_PX = 900;

/**
 * Logical size with the same aspect ratio as 1200×630 OG images (~1.91:1). Use for banner-style
 * exports or set as `PreviewSize` when you want that wide-hero shape.
 */
export const IMESSAGE_LINK_PREVIEW_LOGICAL_SIZE: PreviewRenderSize = {
  width: 800,
  height: Math.round(800 / IMESSAGE_LINK_PREVIEW_ASPECT),
};

/**
 * Default canvas when a template has no `PreviewSize`: **square** (not portrait), so width is never
 * less than height. Dense vertical layouts should set `PreviewSize` with a larger height.
 */
const DEFAULT_PREVIEW_SIZE: PreviewRenderSize = {
  width: 800,
  height: 800,
};

type ComponentWithPreview = ComponentType<Record<string, unknown>> & {
  PreviewProps?: Record<string, unknown>;
  /** Optional; overrides {@link DEFAULT_PREVIEW_SIZE} when content needs more vertical space. */
  PreviewSize?: PreviewRenderSize;
};

function isBunRuntime(): boolean {
  return typeof (globalThis as { Bun?: unknown }).Bun !== "undefined";
}

function previewCacheDir(): string {
  return join(process.cwd(), "node_modules", ".cache", "message-ui");
}

async function loadTemplateModule(absPath: string): Promise<{ default?: unknown }> {
  if (isBunRuntime()) {
    const url = `${pathToFileURL(absPath).href}?t=${Date.now()}`;
    return (await import(url)) as { default?: unknown };
  }

  const stat = statSync(absPath);
  const hash = createHash("sha256")
    .update(absPath)
    .update(String(stat.mtimeMs))
    .digest("hex")
    .slice(0, 32);
  const cacheDir = previewCacheDir();
  mkdirSync(cacheDir, { recursive: true });
  const outfile = join(cacheDir, `tpl-${hash}.mjs`);

  if (!existsSync(outfile)) {
    await esbuild.build({
      entryPoints: [absPath],
      bundle: true,
      outfile,
      format: "esm",
      platform: "node",
      target: "node20",
      jsx: "automatic",
      absWorkingDir: process.cwd(),
      external: ["react", "react/jsx-runtime"],
      logLevel: "silent",
    });
  }

  const fileUrl = pathToFileURL(outfile).href;
  return (await import(fileUrl)) as { default?: unknown };
}

async function renderTemplateFile(absPath: string): Promise<{
  png: Buffer;
  width: number;
  height: number;
}> {
  const mod = await loadTemplateModule(absPath);
  const Component = mod.default;
  if (typeof Component !== "function") {
    throw new Error("Template must export a default React component");
  }
  const C = Component as ComponentWithPreview;
  const props = C.PreviewProps ?? {};
  const size = C.PreviewSize ?? DEFAULT_PREVIEW_SIZE;
  const png = await renderToPng(createElement(C, props), { width: size.width, height: size.height });
  return { png, width: size.width, height: size.height };
}

/** Render all `*.tsx` templates under `absDir` to `outDir`, mirroring subfolders (`a/b.png` for `a/b.tsx`). */
export async function exportTemplatePngs(absDir: string, outDir: string): Promise<number> {
  mkdirSync(outDir, { recursive: true });
  const ids = listTemplateIds(absDir);
  for (const id of ids) {
    const absPath = resolveTemplatePath(absDir, id);
    const { png } = await renderTemplateFile(absPath);
    const parts = id.split("/");
    const file = parts.pop() + ".png";
    const outPath = join(outDir, ...parts, file);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, png);
  }
  return ids.length;
}

function parseQuery(req: IncomingMessage): URLSearchParams {
  const host = "http://localhost";
  const url = new URL(req.url ?? "/", host);
  return url.searchParams;
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendText(res: ServerResponse, status: number, text: string): void {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

function previewHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Message UI — Preview</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #050506;
        --bg-elevated: #080809;
        --panel: #0a0a0c;
        --border: #18181b;
        --border-subtle: #0e0e10;
        --muted: #65656d;
        --text: #e4e4e7;
        --text-secondary: #8b8b93;
        --accent: #22c55e;
        --accent-dim: rgba(34, 197, 94, 0.12);
        --danger-bg: #3f0a0a;
        --danger-text: #f0abab;
        --checker: rgba(255,255,255,0.025);
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      :root[data-theme="light"] {
        color-scheme: light;
        --bg: #fafafa;
        --bg-elevated: #ffffff;
        --panel: #f4f4f5;
        --border: #e4e4e7;
        --border-subtle: #ececee;
        --muted: #71717a;
        --text: #18181b;
        --text-secondary: #52525b;
        --accent: #16a34a;
        --accent-dim: rgba(22, 163, 74, 0.12);
        --danger-bg: #fef2f2;
        --danger-text: #991b1b;
        --checker: rgba(0,0,0,0.04);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        font-size: 14px;
        line-height: 1.45;
        -webkit-font-smoothing: antialiased;
      }
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0 1rem;
        height: 52px;
        border-bottom: 1px solid var(--border);
        background: var(--bg-elevated);
        flex-shrink: 0;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .brand-title {
        font-weight: 600;
        letter-spacing: -0.03em;
        font-size: 15px;
        color: var(--text);
      }
      .brand-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.2rem 0.5rem;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--text-secondary);
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 3px;
        line-height: 1;
      }
      .topbar-actions { display: flex; align-items: center; gap: 0.5rem; }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
        padding: 0.35rem 0.65rem;
        border-radius: 3px;
        border: 1px solid var(--border);
        background: var(--panel);
        color: var(--text-secondary);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      .btn:hover { color: var(--text); border-color: var(--muted); }
      .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      .layout { display: flex; flex: 1; min-height: 0; }
      aside {
        width: 280px;
        min-width: 240px;
        border-right: 1px solid var(--border);
        background: var(--panel);
        display: flex;
        flex-direction: column;
        min-height: 0;
      }
      .sidebar-head {
        padding: 0.75rem 0.75rem 0.5rem;
      }
      .sidebar-head label {
        display: block;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--muted);
        margin-bottom: 0.35rem;
      }
      #search {
        width: 100%;
        padding: 0.5rem 0.65rem;
        border-radius: 3px;
        border: 1px solid var(--border);
        background: var(--bg-elevated);
        color: var(--text);
        font: inherit;
        font-size: 13px;
      }
      #search::placeholder { color: var(--muted); }
      #search:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
      #nav {
        flex: 1;
        overflow: auto;
        padding: 0.25rem 0.5rem 1rem;
      }
      #nav button {
        display: block;
        width: 100%;
        text-align: left;
        padding: 0.5rem 0.65rem;
        margin-bottom: 2px;
        border: none;
        border-radius: 3px;
        background: transparent;
        color: var(--text-secondary);
        font: inherit;
        font-size: 13px;
        cursor: pointer;
      }
      #nav button:hover { color: var(--text); background: var(--border-subtle); }
      #nav button.active {
        color: var(--text);
        background: var(--bg-elevated);
        box-shadow: inset 0 0 0 1px var(--border);
      }
      #nav button:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
      .nav-folder {
        margin-bottom: 2px;
      }
      .nav-folder > summary {
        list-style: none;
        cursor: pointer;
        padding: 0.35rem 0.65rem;
        border-radius: 3px;
        color: var(--muted);
        font-size: 12px;
        font-weight: 500;
        user-select: none;
      }
      .nav-folder > summary::-webkit-details-marker {
        display: none;
      }
      .nav-folder > summary::before {
        content: "▸";
        display: inline-block;
        width: 0.65rem;
        margin-right: 0.25rem;
        font-size: 10px;
        transition: transform 0.12s ease;
      }
      .nav-folder[open] > summary::before {
        transform: rotate(90deg);
      }
      .nav-folder > summary:hover {
        color: var(--text);
        background: var(--border-subtle);
      }
      .nav-folder-items {
        padding: 0.1rem 0 0.15rem 0.5rem;
        margin-left: 0.25rem;
        border-left: 1px solid var(--border);
      }
      main {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        min-height: 0;
        background: var(--bg);
      }
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem 1rem;
        padding: 0.65rem 1.25rem;
        border-bottom: 1px solid var(--border);
        background: var(--bg-elevated);
      }
      .toolbar-title {
        font-weight: 600;
        font-size: 15px;
        letter-spacing: -0.02em;
        margin-right: auto;
      }
      .meta {
        font-size: 12px;
        color: var(--muted);
        font-variant-numeric: tabular-nums;
      }
      .toolbar .btn-group { display: inline-flex; border-radius: 3px; overflow: hidden; border: 1px solid var(--border); }
      .toolbar .btn-group .btn {
        border: none;
        border-radius: 0;
        border-right: 1px solid var(--border);
      }
      .toolbar .btn-group .btn:last-child { border-right: none; }
      .toolbar .btn-group .btn.active {
        background: var(--accent-dim);
        color: var(--accent);
      }
      .stage-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        min-height: 0;
        padding: 1.25rem;
        gap: 0.75rem;
        overflow: auto;
      }
      #error {
        max-width: 56rem;
        margin: 0 auto;
        width: 100%;
        padding: 0.85rem 1rem;
        background: var(--danger-bg);
        color: var(--danger-text);
        font-size: 13px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        white-space: pre-wrap;
        border-radius: 3px;
        border: 1px solid rgba(239, 68, 68, 0.35);
        display: none;
      }
      #error.visible { display: block; }
      .preview-shell {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        position: relative;
      }
      #preview-wrap {
        width: 100%;
        max-width: min(96vw, 1100px);
        aspect-ratio: 16 / 9;
        background-color: var(--bg);
        background-image:
          linear-gradient(45deg, var(--checker) 25%, transparent 25%),
          linear-gradient(-45deg, var(--checker) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, var(--checker) 75%),
          linear-gradient(-45deg, transparent 75%, var(--checker) 75%);
        background-size: 16px 16px;
        background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
        border: 1px solid var(--border);
        border-radius: 3px;
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        box-shadow: none;
      }
      :root[data-theme="light"] #preview-wrap {
        box-shadow: 0 1px 2px rgba(0,0,0,0.06);
      }
      #preview-scaler {
        max-width: 100%;
        max-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s ease;
      }
      #preview {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
        display: block;
        border-radius: 0;
        box-shadow: 0 8px 32px rgba(0,0,0,0.45);
      }
      .loading-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(5, 5, 6, 0.55);
        border-radius: 3px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s;
      }
      :root[data-theme="light"] .loading-overlay {
        background: rgba(250, 250, 250, 0.6);
      }
      .loading-overlay.visible { opacity: 1; pointer-events: auto; }
      .spinner {
        width: 28px;
        height: 28px;
        border: 2px solid var(--border);
        border-top-color: var(--accent);
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .empty {
        color: var(--muted);
        font-size: 14px;
        text-align: center;
        padding: 2rem;
      }
      .toast {
        position: fixed;
        bottom: 1.25rem;
        left: 50%;
        transform: translateX(-50%) translateY(120%);
        padding: 0.5rem 1rem;
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 3px;
        font-size: 13px;
        color: var(--text-secondary);
        box-shadow: 0 4px 20px rgba(0,0,0,0.45);
        transition: transform 0.25s ease;
        z-index: 100;
      }
      .toast.show { transform: translateX(-50%) translateY(0); }
      kbd {
        font-family: ui-monospace, monospace;
        font-size: 11px;
        padding: 0.1rem 0.35rem;
        border-radius: 2px;
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--muted);
      }
      .hint { font-size: 11px; color: var(--muted); margin-top: 0.25rem; }
    </style>
  </head>
  <body>
    <header class="topbar">
      <div class="brand">
        <span class="brand-title">Message UI</span>
        <span class="brand-badge">Preview</span>
      </div>
      <div class="topbar-actions">
        <button type="button" class="btn" id="btn-theme" title="Toggle light / dark">Theme</button>
        <a class="btn" id="btn-dl" href="#" download>Download PNG</a>
      </div>
    </header>
    <div class="layout">
      <aside>
        <div class="sidebar-head">
          <label for="search">Templates</label>
          <input id="search" type="search" placeholder="Search… (⌘K)" autocomplete="off" spellcheck="false" />
        </div>
        <nav id="nav" aria-label="Templates"></nav>
      </aside>
      <main>
        <div class="toolbar">
          <span class="toolbar-title" id="toolbar-title">—</span>
          <span class="meta" id="meta-dims"></span>
          <div class="btn-group" role="group" aria-label="Zoom">
            <button type="button" class="btn zoom-btn" data-zoom="0.5">50%</button>
            <button type="button" class="btn zoom-btn" data-zoom="0.75">75%</button>
            <button type="button" class="btn zoom-btn active" data-zoom="1">100%</button>
            <button type="button" class="btn zoom-btn" data-zoom="fit">Fit</button>
          </div>
        </div>
        <div class="stage-wrap">
          <div id="error"></div>
          <div class="preview-shell">
            <div id="preview-wrap" hidden>
              <div id="preview-scaler">
                <img id="preview" alt="Attachment preview" />
              </div>
            </div>
            <div class="loading-overlay" id="loading"><div class="spinner" aria-hidden="true"></div></div>
            <p class="empty" id="empty">Loading templates…</p>
            <p class="hint" id="kbd-hint" hidden>
              <kbd>j</kbd> <kbd>k</kbd> or arrows · <kbd>/</kbd> search · <kbd>⌘K</kbd> search
            </p>
          </div>
        </div>
      </main>
    </div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <script type="module">
      const nav = document.getElementById("nav");
      const preview = document.getElementById("preview");
      const scaler = document.getElementById("preview-scaler");
      const wrap = document.getElementById("preview-wrap");
      const errEl = document.getElementById("error");
      const empty = document.getElementById("empty");
      const loading = document.getElementById("loading");
      const toolbarTitle = document.getElementById("toolbar-title");
      const metaDims = document.getElementById("meta-dims");
      const search = document.getElementById("search");
      const toastEl = document.getElementById("toast");
      const btnDl = document.getElementById("btn-dl");
      const btnTheme = document.getElementById("btn-theme");
      const kbdHint = document.getElementById("kbd-hint");
      const zoomBtns = document.querySelectorAll(".zoom-btn");

      let current = new URLSearchParams(location.search).get("template") ?? "";
      let templateIds = [];
      let zoom = 1;
      let zoomMode = "fixed";

      function applyTheme(t) {
        document.documentElement.dataset.theme = t;
        try { localStorage.setItem("message-ui-preview-theme", t); } catch (e) {}
      }
      function initTheme() {
        try {
          const s = localStorage.getItem("message-ui-preview-theme");
          if (s === "light" || s === "dark") { applyTheme(s); return; }
        } catch (e) {}
        applyTheme(window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      }
      initTheme();
      btnTheme.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        applyTheme(next);
      });

      function showToast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add("show");
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toastEl.classList.remove("show"), 2200);
      }

      function setLoading(on) {
        loading.classList.toggle("visible", on);
      }

      function buildTree(ids) {
        const root = {};
        for (const id of ids) {
          const parts = id.split("/");
          let cur = root;
          for (let i = 0; i < parts.length; i++) {
            const p = parts[i];
            const last = i === parts.length - 1;
            if (last) {
              cur[p] = id;
            } else {
              if (!cur[p]) cur[p] = {};
              cur = cur[p];
            }
          }
        }
        return root;
      }

      function flattenTreeOrder(node) {
        const out = [];
        for (const k of Object.keys(node).sort()) {
          const v = node[k];
          if (typeof v === "string") out.push(v);
          else out.push(...flattenTreeOrder(v));
        }
        return out;
      }

      function filteredTemplateIds() {
        const q = search.value.trim().toLowerCase();
        return q ? templateIds.filter((id) => id.toLowerCase().includes(q)) : templateIds;
      }

      function filteredIds() {
        return flattenTreeOrder(buildTree(filteredTemplateIds()));
      }

      function selectTemplate(id) {
        if (!templateIds.includes(id)) return;
        current = id;
        history.replaceState(null, "", "?template=" + encodeURIComponent(id));
        renderNavList();
        loadPreview();
      }

      function renderTree(node, pathPrefix, container) {
        const keys = Object.keys(node).sort();
        for (const k of keys) {
          const v = node[k];
          const fullPath = pathPrefix ? pathPrefix + "/" + k : k;
          if (typeof v === "string") {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = k;
            b.title = v;
            b.className = v === current ? "active" : "";
            b.addEventListener("click", () => selectTemplate(v));
            container.appendChild(b);
          } else {
            const shouldOpen = current.startsWith(fullPath + "/") || current === fullPath;
            const details = document.createElement("details");
            details.className = "nav-folder";
            details.open = shouldOpen;
            const summary = document.createElement("summary");
            summary.textContent = k;
            details.appendChild(summary);
            const inner = document.createElement("div");
            inner.className = "nav-folder-items";
            renderTree(v, fullPath, inner);
            details.appendChild(inner);
            container.appendChild(details);
          }
        }
      }

      function renderNavList() {
        nav.replaceChildren();
        renderTree(buildTree(filteredTemplateIds()), "", nav);
      }

      function syncZoomButtons() {
        zoomBtns.forEach((b) => {
          const z = b.getAttribute("data-zoom");
          const active =
            zoomMode === "fit"
              ? z === "fit"
              : z !== "fit" && Math.abs(parseFloat(z) - zoom) < 1e-6;
          b.classList.toggle("active", active);
        });
      }

      function applyZoom() {
        if (zoomMode === "fit") {
          scaler.style.transform = "scale(1)";
          scaler.style.transformOrigin = "center center";
          preview.style.maxWidth = "100%";
          preview.style.maxHeight = "100%";
          wrap.style.aspectRatio = "auto";
          wrap.style.minHeight = "200px";
          const ar = preview.naturalWidth && preview.naturalHeight
            ? preview.naturalWidth / preview.naturalHeight
            : 16 / 9;
          wrap.style.aspectRatio = String(ar);
          return;
        }
        scaler.style.transform = "scale(" + zoom + ")";
        scaler.style.transformOrigin = "center center";
        preview.style.maxWidth = "";
        preview.style.maxHeight = "";
        wrap.style.aspectRatio = "16 / 9";
        wrap.style.minHeight = "";
      }

      zoomBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const z = btn.getAttribute("data-zoom");
          if (z === "fit") {
            zoomMode = "fit";
            syncZoomButtons();
            applyZoom();
            return;
          }
          zoomMode = "fixed";
          zoom = parseFloat(z);
          syncZoomButtons();
          applyZoom();
        });
      });

      async function loadList() {
        const r = await fetch("/api/templates");
        const data = await r.json();
        templateIds = data.templates ?? [];
        kbdHint.hidden = templateIds.length === 0;
        if (templateIds.length === 0) {
          empty.textContent = "No .tsx templates in this folder.";
          empty.hidden = false;
          wrap.hidden = true;
          toolbarTitle.textContent = "No templates";
          metaDims.textContent = "";
          return;
        }
        empty.hidden = true;
        if (!current || !templateIds.includes(current)) current = templateIds[0];
        renderNavList();
        await loadPreview();
      }

      async function loadPreview() {
        errEl.classList.remove("visible");
        errEl.textContent = "";
        if (!current) return;
        toolbarTitle.textContent = current.split("/").join(" / ");
        btnDl.href = "/api/preview?name=" + encodeURIComponent(current);
        btnDl.setAttribute("download", current.split("/").join("-") + ".png");
        setLoading(true);
        try {
          const r = await fetch("/api/preview?name=" + encodeURIComponent(current));
          const w = r.headers.get("X-Preview-Width");
          const h = r.headers.get("X-Preview-Height");
          if (w && h) metaDims.textContent = w + " × " + h + " logical px";
          else metaDims.textContent = "";
          if (!r.ok) {
            const t = await r.text();
            errEl.textContent = t;
            errEl.classList.add("visible");
            wrap.hidden = true;
            metaDims.textContent = "";
            setLoading(false);
            return;
          }
          const blob = await r.blob();
          const url = URL.createObjectURL(blob);
          if (preview.dataset.url) URL.revokeObjectURL(preview.dataset.url);
          preview.dataset.url = url;
          preview.onload = () => {
            applyZoom();
            setLoading(false);
          };
          preview.onerror = () => setLoading(false);
          preview.src = url;
          wrap.hidden = false;
        } catch (e) {
          errEl.textContent = e instanceof Error ? e.message : String(e);
          errEl.classList.add("visible");
          wrap.hidden = true;
          setLoading(false);
        }
      }

      function navRelative(delta) {
        const ids = filteredIds();
        if (ids.length === 0) return;
        const i = ids.indexOf(current);
        const next = i < 0 ? ids[0] : ids[(i + delta + ids.length) % ids.length];
        selectTemplate(next);
      }

      document.addEventListener("keydown", (e) => {
        const meta = e.metaKey || e.ctrlKey;
        if (meta && e.key.toLowerCase() === "k") {
          e.preventDefault();
          search.focus();
          search.select();
          return;
        }
        if (e.key === "/" && document.activeElement !== search) {
          e.preventDefault();
          search.focus();
          return;
        }
        if (document.activeElement === search) return;
        if (e.key === "j" || e.key === "ArrowDown") {
          e.preventDefault();
          navRelative(1);
        } else if (e.key === "k" || e.key === "ArrowUp") {
          e.preventDefault();
          navRelative(-1);
        }
      });

      search.addEventListener("input", () => {
        renderNavList();
        const ids = filteredIds();
        if (ids.length && !ids.includes(current)) selectTemplate(ids[0]);
      });

      const es = new EventSource("/api/events");
      es.addEventListener("reload", () => {
        showToast("Templates updated — refreshing");
        loadList();
      });

      loadList();
    </script>
  </body>
</html>`;
}

/** HTTP server: sidebar + PNG preview, SSE reload on template changes. */
export async function startPreviewServer(options: PreviewServerOptions): Promise<Server> {
  const absDir = resolve(process.cwd(), options.dir);
  const absExportDir = options.exportDir ? resolve(process.cwd(), options.exportDir) : undefined;
  const sseClients = new Set<SseClient>();

  const broadcastReload = () => {
    for (const res of sseClients) {
      try {
        res.write(`event: reload\ndata: {}\n\n`);
      } catch {
        sseClients.delete(res);
      }
    }
  };

  const runExport = async (): Promise<void> => {
    if (!absExportDir) {
      return;
    }
    try {
      const n = await exportTemplatePngs(absDir, absExportDir);
      console.log(`message-ui: exported ${n} PNG(s) → ${absExportDir}`);
    } catch (e) {
      console.error("message-ui: export failed:", e);
    }
  };

  if (existsSync(absDir) && statSync(absDir).isDirectory()) {
    let debounce: ReturnType<typeof setTimeout> | undefined;
    watch(absDir, { recursive: true }, (_evt, filename) => {
      if (filename && typeof filename === "string" && !filename.endsWith(".tsx")) {
        return;
      }
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => {
        broadcastReload();
        void runExport();
      }, 120);
    });
  }

  const server = createServer(async (req, res) => {
    const url = req.url ?? "/";
    if (req.method === "GET" && (url === "/" || url.startsWith("/?"))) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(previewHtml());
      return;
    }

    if (req.method === "GET" && url.startsWith("/api/templates")) {
      const templates = listTemplateIds(absDir);
      sendJson(res, 200, { templates, dir: absDir });
      return;
    }

    if (req.method === "GET" && url.startsWith("/api/preview")) {
      const name = parseQuery(req).get("name") ?? "";
      try {
        const path = resolveTemplatePath(absDir, name);
        const { png, width, height } = await renderTemplateFile(path);
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Cache-Control": "no-store",
          "X-Preview-Width": String(width),
          "X-Preview-Height": String(height),
        });
        res.end(png);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        sendText(res, 500, msg);
      }
      return;
    }

    if (req.method === "GET" && url.startsWith("/api/events")) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      res.write(`retry: 2000\ndata: {}\n\n`);
      sseClients.add(res);
      req.on("close", () => {
        sseClients.delete(res);
      });
      return;
    }

    res.writeHead(404);
    res.end();
  });

  await new Promise<void>((resolveListen, reject) => {
    server.listen(options.port, () => resolveListen());
    server.on("error", reject);
  });

  await runExport();

  return server;
}
