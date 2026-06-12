import type { NextConfig } from "next";
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  outputFileTracingRoot: __dirname,
  allowedDevOrigins: ['192.168.56.1'],
};

export default withPWA(nextConfig);
