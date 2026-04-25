import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
};

serve(async (req) => {
  let url = new URL(req.url).pathname;

  if (url === "/") url = "/index.html";

  try {
    const file = await Deno.readFile(`./dist${url}`);

    const ext =
      Object.keys(MIME_TYPES).find((e) => url.endsWith(e)) || ".html";

    const headers = new Headers({
      "content-type": MIME_TYPES[ext] || "application/octet-stream",
    });

    // ✅ caching rules
    if (ext === ".html") {
      headers.set(
        "Cache-Control",
        "public, max-age=3600, stale-while-revalidate=86400"
      );
    } else if ([".xml", ".json"].includes(ext)) {
      headers.set(
        "Cache-Control",
        "public, max-age=3600, stale-while-revalidate=86400"
      );
    } else if (ext === ".txt") {
      headers.set("Cache-Control", "public, max-age=86400");
    } else {w
      headers.set(
        "Cache-Control",
        "public, max-age=31536000, immutable"
      );
    }

    return new Response(file, { status: 200, headers });
  } catch {
    // SPA fallback
    try {
      const file = await Deno.readFile("./dist/index.html");

      return new Response(file, {
        status: 200,
        headers: {
          "content-type": "text/html",
          "Cache-Control":
            "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    } catch {
      return new Response("404 Not Found", { status: 404 });
    }
  }
});