import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const templatePath = path.join(root, "dist", "index.html");
const serverEntry = path.join(root, "dist", "server", "entry-server.js");

if (!fs.existsSync(templatePath)) {
  console.error(`✗ Missing ${templatePath}. Run 'vite build' first.`);
  process.exit(1);
}
if (!fs.existsSync(serverEntry)) {
  console.error(
    `✗ Missing ${serverEntry}. Run 'vite build --ssr src/entry-server.tsx --outDir dist/server' first.`
  );
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf-8");

const { render } = await import(pathToFileURL(serverEntry).href);
const appHtml = render();

if (!template.includes('<div id="root"></div>')) {
  console.error(
    "✗ Could not find <div id=\"root\"></div> in dist/index.html — prerender aborted."
  );
  process.exit(1);
}

const html = template.replace(
  '<div id="root"></div>',
  `<div id="root">${appHtml}</div>`
);

fs.writeFileSync(templatePath, html);

// Cleanup: remove the server build folder; it's not needed at runtime.
fs.rmSync(path.join(root, "dist", "server"), { recursive: true, force: true });

const sizeKb = (Buffer.byteLength(html) / 1024).toFixed(1);
console.log(`✓ Prerendered dist/index.html (${sizeKb} kB)`);
