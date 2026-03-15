/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-auth", "xlsx"],
  images: {
    domains: [
      // https://th.bing.com/th/id/OIF.VhD1SDqyoCVi11LDULfwZA?rs=1&pid=ImgDetMain
      "th.bing.com",
      "drive.google.com",
      "stepbysteplistening.com",
      "media.licdn.com",
      "png.pngtree.com",
      "img.freepik.com",
      "cdn.dribbble.com",
      "www.google.com",
      "www.example.com",
      "example.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "",
        pathname: "/uc**",
      },
      {
        protocol: "https",
        hostname: "stepbysteplistening.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        port: "",
        pathname: "/dms/image/**",
      },
      {
        protocol: "https",
        hostname: "png.pngtree.com",
        port: "",
        pathname: "/png-clipart/**",
      },
      {
        protocol: "https",
        hostname: "th.bing.com",
        port: "",
        pathname: "/th/id/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
        pathname: "/free-photo/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        // pathname: "/free-photo/**",
      },
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
        port: "",
        pathname: "/userupload/**",
      },
    ],
  },
};

export default nextConfig;
