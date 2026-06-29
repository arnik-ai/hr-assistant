/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = "hr-assistant"; // اسم مخزن گیت‌هاب (برای basePath در GitHub Pages)

const nextConfig = {
  reactStrictMode: true,
  output: "export", // خروجی ثابت برای GitHub Pages
  images: { unoptimized: true }, // next/image بدون سرور بهینه‌سازی
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true,
};

export default nextConfig;
