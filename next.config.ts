import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not regenerate AGENTS.md / CLAUDE.md on every dev start.
  agentRules: false,
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
