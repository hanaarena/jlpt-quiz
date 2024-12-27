/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    QUIZ_ENDPOINT: process.env.QUIZ_ENDPOINT,
  },
};

export default nextConfig;
