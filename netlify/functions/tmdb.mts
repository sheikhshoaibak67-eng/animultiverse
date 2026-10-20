// Server-side TMDB proxy: keeps the API key out of the client bundle.
const API = "https://api.themoviedb.org/3";

export default async (req: Request) => {
  const key = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
  if (!key) {
    return Response.json({ error: "TMDB API key is not configured" }, { status: 500 });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/tmdb/, "");
  if (!path || path === "/" || path.includes("..")) {
    return Response.json({ error: "Missing TMDB path" }, { status: 400 });
  }

  const qs = new URLSearchParams(url.searchParams);
  qs.delete("api_key");
  qs.set("api_key", key);

  const res = await fetch(`${API}${path}?${qs}`, { signal: AbortSignal.timeout(8000) });
  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/json",
      "Cache-Control": res.ok ? "public, max-age=300" : "no-store",
    },
  });
};

export const config = {
  path: "/api/tmdb/*",
};
