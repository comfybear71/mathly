/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

// Only wrap with PWA in production and when the module is available
let finalConfig = nextConfig;

try {
  const withPWAInit = (await import("next-pwa")).default;
  const withPWA = withPWAInit({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
  });
  finalConfig = withPWA(nextConfig);
} catch {
  // next-pwa not available, continue without it
}

export default finalConfig;
