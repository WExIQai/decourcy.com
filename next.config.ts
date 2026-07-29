import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  env: {
    BUILD_TIMESTAMP: new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) + " ET",
  },
  // /Meridian is served by professorleads.com (multi-zone proxy).
  // The briefing content lives in that private repo; this public repo carries
  // only the rewrites, so nothing confidential is ever in world-readable
  // source. /pl-static is that zone's assetPrefix, so its JS/CSS never collide
  // with this app's /_next files.
  // Removed 2026-07-23 ("briefing moved to wexiq.ai"), restored 2026-07-29:
  // wexiq.ai and decourcy.com both serve it, and the client had been given a
  // decourcy.com URL that 404'd.
  // Remove all three rewrites + the headers block after 2026-07-31.
  async rewrites() {
    return [
      {
        source: "/Meridian",
        destination: "https://professorleads.com/Meridian",
      },
      {
        source: "/Meridian/:path+",
        destination: "https://professorleads.com/Meridian/:path+",
      },
      {
        source: "/pl-static/:path+",
        destination: "https://professorleads.com/pl-static/:path+",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/Meridian",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" }],
      },
      {
        source: "/Meridian/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" }],
      },
    ];
  },
};

export default nextConfig;
