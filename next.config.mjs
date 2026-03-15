/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-auth", "xlsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "th.bing.com",
        pathname: "/th/id/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc**",
      },
      {
        protocol: "https",
        hostname: "stepbysteplistening.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/dms/image/**",
      },
      {
        protocol: "https",
        hostname: "png.pngtree.com",
        pathname: "/png-clipart/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/free-photo/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
        pathname: "/userupload/**",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "www.example.com",
      },
    ],
  },
};

export default nextConfig;
