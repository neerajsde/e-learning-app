/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "some.neerajprajapati.in",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;