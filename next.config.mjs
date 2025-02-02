/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    QUIZ_ENDPOINT: process.env.QUIZ_ENDPOINT,
  },
};

export default nextConfig;
