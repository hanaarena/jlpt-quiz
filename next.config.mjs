/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    QUIZ_ENDPOINT: process.env.QUIZ_ENDPOINT,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
};

export default nextConfig;
