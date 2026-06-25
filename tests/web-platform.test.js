const assert = require("assert");
const fs = require("fs");

const manifest = JSON.parse(fs.readFileSync("manifest.webmanifest", "utf8"));
const indexHtml = fs.readFileSync("index.html", "utf8");
const serviceWorker = fs.readFileSync("sw.js", "utf8");
const platformSource = fs.readFileSync("platform.js", "utf8");
const runtimeConfigSource = fs.readFileSync("runtime-config.js", "utf8");
const supabaseClientSource = fs.readFileSync("supabase-client.js", "utf8");
const serverSource = fs.readFileSync("server.js", "utf8");
const privacyHtml = fs.readFileSync("privacy.html", "utf8");
const termsHtml = fs.readFileSync("terms.html", "utf8");
const netlifyConfig = fs.readFileSync("netlify.toml", "utf8");
const vercelConfig = fs.readFileSync("vercel.json", "utf8");

assert.strictEqual(manifest.name, "Drive Astral");
assert.strictEqual(manifest.start_url, "/");
assert.strictEqual(manifest.scope, "/");
assert.strictEqual(manifest.display, "standalone");
assert.strictEqual(manifest.theme_color, "#020d0b");
assert.ok(manifest.icons.some((icon) => icon.purpose === "any"));
assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
for (const icon of manifest.icons) {
  assert.ok(fs.existsSync(icon.src.replace(/^\//, "")), icon.src);
}

assert.ok(indexHtml.includes('rel="manifest" href="/manifest.webmanifest"'));
assert.ok(indexHtml.includes('id="connection-status"'));
assert.ok(indexHtml.includes('href="/styles.css?v=chakra-method-v22"'));
assert.ok(indexHtml.includes('src="/app.js?v=chakra-method-v22"'));
assert.ok(indexHtml.includes('src="/platform.js?v=chakra-method-v22"'));
assert.ok(indexHtml.includes('src="/runtime-config.js?v=chakra-method-v22"'));
assert.ok(indexHtml.includes('src="/supabase-client.js?v=chakra-method-v22"'));
assert.ok(indexHtml.includes('src="/src/domain/sincronario/engine.js"'));
assert.ok(indexHtml.includes("mobile-web-app-capable"));

for (const asset of [
  "/index.html",
  "/styles.css",
  "/runtime-config.js",
  "/supabase-client.js",
  "/app.js",
  "/platform.js",
  "/manifest.webmanifest",
  "/privacy.html",
  "/terms.html",
  "/src/domain/sincronario/engine.js",
  "/src/domain/sincronario/thirteen-moons-engine.js",
]) {
  assert.ok(serviceWorker.includes(`"${asset}"`), asset);
}
assert.ok(serviceWorker.includes('self.addEventListener("install"'));
assert.ok(serviceWorker.includes('self.addEventListener("fetch"'));
assert.ok(serviceWorker.includes("self.skipWaiting()"));
assert.ok(serviceWorker.includes("self.clients.claim()"));
assert.ok(serviceWorker.includes("drive-astral-web-v22"));

assert.ok(platformSource.includes('navigator.serviceWorker.register("/sw.js")'));
assert.ok(platformSource.includes("isLocalDevelopmentHost"));
assert.ok(platformSource.includes("registration.unregister()"));
assert.ok(platformSource.includes('"beforeinstallprompt"'));
assert.ok(platformSource.includes('"appinstalled"'));
assert.ok(platformSource.includes('"offline"'));
assert.ok(runtimeConfigSource.includes('environment: "production"'));
assert.ok(runtimeConfigSource.includes('authMode: "supabase"'));
assert.ok(runtimeConfigSource.includes("https://jjnmxkfumiwoeyyregzb.supabase.co"));
assert.ok(runtimeConfigSource.includes('billingMode: "external-checkout"'));
assert.ok(supabaseClientSource.includes("DriveAstralSupabase"));
assert.ok(supabaseClientSource.includes("@supabase/supabase-js@2.102.0"));

assert.ok(serverSource.includes('".webmanifest": "application/manifest+json; charset=utf-8"'));
assert.ok(serverSource.includes('"Content-Security-Policy"'));
assert.ok(serverSource.includes('"Service-Worker-Allowed"'));
assert.ok(serverSource.includes('"X-Content-Type-Options": "nosniff"'));
assert.ok(netlifyConfig.includes("Content-Security-Policy"));
assert.ok(netlifyConfig.includes("Permissions-Policy"));
assert.ok(vercelConfig.includes("Content-Security-Policy"));
assert.ok(vercelConfig.includes("Strict-Transport-Security"));

assert.ok(privacyHtml.includes("Privacidade e Dados"));
assert.ok(privacyHtml.includes("armazenados localmente"));
assert.ok(privacyHtml.includes("Excluir meus dados deste dispositivo"));
assert.ok(termsHtml.includes("Termos de Uso"));
assert.ok(termsHtml.includes("Fase beta e contas"));
assert.ok(fs.existsSync("netlify.toml"));
assert.ok(fs.existsSync("vercel.json"));
assert.ok(fs.existsSync("docs/plataforma-web/README.md"));
assert.ok(fs.existsSync("docs/producao/api-contract.md"));
assert.ok(fs.existsSync("docs/producao/checklist-lancamento.md"));
assert.ok(fs.existsSync("docs/producao/admin-planejamento.md"));
assert.ok(fs.existsSync("infra/postgres/schema.sql"));
assert.ok(fs.existsSync("supabase/migrations/202606240002_admin_foundation.sql"));
assert.ok(fs.existsSync("supabase/migrations/202606240003_admin_users_plans.sql"));

console.log("web-platform tests passed");
