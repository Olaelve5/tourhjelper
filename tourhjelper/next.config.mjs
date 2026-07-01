/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add the quality you want to use here
    qualities: [25, 50, 75, 85, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.tourmanager.no",
        pathname: "/jerseys/**",
      },
    ],
  },
};

export default nextConfig;
