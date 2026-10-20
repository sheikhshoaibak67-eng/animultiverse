// Server-side TMDB proxy: keeps the private API key out of the client bundle.
const API = "https://api.themoviedb.org/3";

export default async (req: Request) => {
  const key = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
  if (!key) {
    return Response.json({ error: "TMDB key not configured" }, { status: 503 });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/tmdb/, "");
  if (!path.startsWith("/") || path.includes("..")) {
    return Response.json({ error: "Invalid path" }, { status: 400 });
  }

  const qs = new URLSearchParams(url.searchParams);
  qs.delete("api_key");
  qs.set("api_key", key);

  const res = await fetch(`${API}${path}?${qs}`, { signal: AbortSignal.timeout(8000) });
  return new Response(res.body, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
      "cache-control": res.ok ? "public, max-age=300" : "no-store",
    },
  });
};

export const config = {
  path: "/api/tmdb/*",
};
