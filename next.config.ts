import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Tebi calculators moved under the market prefix, like the local pages
  async redirects() {
    return [
      { source: "/case-studies/tebi/tools", destination: "/case-studies/tebi/nl/tools", permanent: true },
      { source: "/case-studies/tebi/tools/:tool", destination: "/case-studies/tebi/nl/tools/:tool", permanent: true },
    ];
  },
};

export default nextConfig;
