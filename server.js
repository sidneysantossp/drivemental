const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const server = http.createServer((request, response) => {
  const requestedPath = decodeURIComponent(request.url.split("?")[0]);
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  let filePath = path.join(root, safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      filePath = path.join(root, "index.html");
    }

    fs.readFile(filePath, (readError, content) => {
      if (readError) {
        response.writeHead(500);
        response.end("Unable to read file");
        return;
      }

      const relativePath = path.relative(root, filePath).replace(/\\/g, "/");
      const cacheControl = relativePath === "sw.js" || relativePath === "index.html"
        ? "no-cache, no-store, must-revalidate"
        : "public, max-age=3600";
      const headers = {
        "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
        "Cache-Control": cacheControl,
        "Content-Security-Policy": "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; manifest-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      };

      if (relativePath === "sw.js") {
        headers["Service-Worker-Allowed"] = "/";
      }

      response.writeHead(200, headers);
      response.end(content);
    });
  });
});

server.listen(port, () => {
  console.log(`Drive Mental running at http://localhost:${port}`);
});
