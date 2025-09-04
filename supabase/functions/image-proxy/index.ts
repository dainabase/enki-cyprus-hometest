// supabase/functions/image-proxy/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Simple image proxy to bypass hotlink/CORS issues and enable caching
serve(async (req) => {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");

  if (!target) {
    return new Response("Missing url", { status: 400 });
  }

  try {
    const upstream = await fetch(target, {
      // Forward minimal headers to avoid blocking
      headers: {
        "User-Agent": "Lovable-Image-Proxy/1.0",
        "Accept": "image/*,*/*;q=0.8",
        "Referer": "",
      },
    });

    if (!upstream.ok) {
      return new Response(`Upstream error: ${upstream.status}`, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";

    // Stream the body back to the client
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache for 1 day at the edge; browsers can revalidate
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=600",
        // Allow usage from browser <img> without CORS issues
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response(`Proxy error: ${e}`, { status: 500 });
  }
});
