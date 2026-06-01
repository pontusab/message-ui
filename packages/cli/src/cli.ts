#!/usr/bin/env node
import { resolve } from "node:path";
import { exportTemplatePngs, startPreviewServer } from "@message-ui/preview";

const argv = process.argv.slice(2);

function printHelp(): void {
  const lines = [
    "message-ui — iMessage attachment preview & tooling",
    "",
    "Usage:",
    "  message-ui dev [--dir <path>] [--port <n>] [--export <dir>]",
    "  message-ui export [--dir <path>] [--out <dir>]",
    "  message-ui init",
    "",
    "Commands:",
    "  dev     Start preview server (default dir: attachments, port: 3000)",
    "  export  Render all templates to PNG files (no server)",
    "  init    Scaffold attachments/ and sample template (coming soon)",
    "",
    "Options:",
    "  --dir     Folder of *.tsx attachment templates (default: attachments)",
    "  --port    HTTP port for dev (default: 3000)",
    "  --export  With dev: also write <dir>/*.png on start and when templates change",
    "  --out     With export: output directory (default: out)",
  ];
  console.log(lines.join("\n"));
}

async function cmdDev(args: string[]): Promise<void> {
  let dir = "attachments";
  let port = 3000;
  let exportDir: string | undefined;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--dir" && args[i + 1]) {
      dir = args[++i] ?? dir;
    } else if (a === "--port" && args[i + 1]) {
      port = Number(args[++i]);
      if (Number.isNaN(port)) {
        console.error("message-ui: invalid --port");
        process.exitCode = 1;
        return;
      }
    } else if (a === "--export" && args[i + 1]) {
      exportDir = args[++i];
    }
  }
  const server = await startPreviewServer({ port, dir, exportDir });
  const addr = server.address();
  const where = typeof addr === "object" && addr ? addr.port : port;
  const absDir = resolve(process.cwd(), dir);
  console.log(`message-ui preview at http://127.0.0.1:${where}`);
  console.log(`  templates: ${absDir}`);
  if (exportDir) {
    console.log(`  PNG export: ${resolve(process.cwd(), exportDir)}`);
  }
}

async function cmdExport(args: string[]): Promise<void> {
  let dir = "attachments";
  let out = "out";
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--dir" && args[i + 1]) {
      dir = args[++i] ?? dir;
    } else if ((a === "--out" || a === "--export") && args[i + 1]) {
      out = args[++i] ?? out;
    }
  }
  const absDir = resolve(process.cwd(), dir);
  const absOut = resolve(process.cwd(), out);
  const n = await exportTemplatePngs(absDir, absOut);
  console.log(`message-ui: exported ${n} PNG(s) → ${absOut}`);
}

function cmdInit(): void {
  console.log("message-ui init — scaffold will create attachments/ and a sample template.");
  process.exitCode = 1;
}

async function main(): Promise<void> {
  const [cmd, ...rest] = argv;
  if (!cmd || cmd === "-h" || cmd === "--help") {
    printHelp();
    return;
  }
  if (cmd === "dev") {
    await cmdDev(rest);
    return;
  }
  if (cmd === "export") {
    await cmdExport(rest);
    return;
  }
  if (cmd === "init") {
    cmdInit();
    return;
  }
  console.error(`message-ui: unknown command ${cmd}`);
  printHelp();
  process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
