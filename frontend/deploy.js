import { join, extname } from "https://deno.land/std/path/mod.ts";
import { contentType } from "https://deno.land/std/media_types/mod.ts";

const DIST_DIR = "dist";

async function handler(req) {
  const url = new URL(req.url);
  let filePath = join(DIST_DIR, url.pathname);

  // Serve static files (js, css, images, etc.)
  if (extname(url.pathname)) {
    try {
      const file = await Deno.readFile(filePath);
      const mimeType =
        contentType(extname(filePath)) || "application/octet-stream";

      return new Response(file, {
        headers: {
          "content-type": mimeType,
          "cache-control": "public, max-age=31536000, immutable"
        },
      });
    } catch {
      return new Response("404 Not Found", { status: 404 });
    }
  }

  // SPA fallback → index.html
  try {
    const file = await Deno.readFile(join(DIST_DIR, "index.html"));
    return new Response(file, {
      headers: {
        "content-type": "text/html",
        "cache-control": "no-cache"
      },
    });
  } catch {
    return new Response("404 Not Found", { status: 404 });
  }
}

Deno.serve(handler);