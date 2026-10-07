import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not regenerate AGENTS.md / CLAUDE.md on every dev start.
  agentRules: false,
  // The dev server is also opened from other devices on the LAN (e.g. http://172.30.192.1:3000).
  // Without this, Next blocks /_next/* script requests from those origins with 403, so pages render
  // but never become interactive. Add further LAN addresses or hostnames here as needed.
  allowedDevOrigins: ["172.30.192.1", "c-5cg2145xpf", "localhost", "127.0.0.1", "*.local"],
  // The interview books and quiz sets are plain files read at request time with fs.readdir,
  // which Next's file tracing cannot see. Include them in every server function bundle so
  // they exist when deployed to Vercel (or any serverless target).
  outputFileTracingIncludes: {
    "/**": ["./interview/**/*", "./quizzes/**/*"],
  },
  // The PDF.js worker is served from /public; nothing else needs special handling.
  experimental: {
    // Allow large multipart uploads for the local library (server actions are not used,
    // but this keeps the body limit consistent if they are added later).
    serverActions: { bodySizeLimit: "200mb" },
  },
};

export default nextConfig;
