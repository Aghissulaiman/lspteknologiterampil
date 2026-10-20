import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));
const backendOrigin = process.env.API_URL ?? "http://127.0.0.1:4000";

const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${backendOrigin.replace(/\/$/, "")}/api/:path*`,
        },
      ],
    };
  },
  turbopack: {
    root: path.resolve(frontendRoot, ".."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
