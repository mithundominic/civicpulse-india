import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos, party logos, and symbols are admin-supplied URLs from
    // arbitrary sources (government sites, party sites, ECI), so we can't
    // maintain a remotePatterns allowlist. unoptimized keeps next/image's
    // consistent <Image> API (satisfying AGENTS.md Rule 5's exception)
    // without Next's build-time domain restriction.
    unoptimized: true,
  },
};

export default nextConfig;
