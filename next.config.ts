import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "files.edgestore.dev" },
      { hostname: "res.cloudinary.com" },
      { hostname: "b.tile.openstreetmap.org" },
      { hostname: "images.barcodelookup.com" },
      { hostname: "www.mentainstruments.com" },
      { hostname: "example.com" }
    ],
  },
};

export default nextConfig;
