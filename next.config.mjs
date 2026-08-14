/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output keeps the production server small and self-contained,
  // which is what Hostinger's Node.js hosting expects to run via `npm start`.
  output: "standalone",
};

export default nextConfig;
