import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // content/ klasöründeki mevzuat .md dosyaları runtime'da okunduğu için
  // /api/sor fonksiyonunun dağıtım paketine dahil edilmelerini garanti et.
  outputFileTracingIncludes: {
    "/api/sor": ["./content/**/*"],
  },
};

export default nextConfig;
