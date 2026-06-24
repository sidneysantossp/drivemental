const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");

const entries = [
  "index.html",
  "styles.css",
  "runtime-config.js",
  "supabase-client.js",
  "app.js",
  "platform.js",
  "manifest.webmanifest",
  "sw.js",
  "privacy.html",
  "terms.html",
  "assets",
  "icons",
  "src",
];

function copyEntry(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(output, relativePath);
  const stat = fs.statSync(source);

  if (stat.isDirectory()) {
    fs.cpSync(source, target, { recursive: true });
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const entry of entries) {
  copyEntry(entry);
}

console.log(`Static site built at ${path.relative(root, output)}`);
