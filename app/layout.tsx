// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TEN:9 | 10분 메이크업 9,900원",
  description:
    "강남역 11번 출구, 10분 만에 인상이 확 달라지는 퀵 메이크업 서비스. 번개 약속·소개팅·면접·발표 전 핵심 부위만 빠르게 정리해주는 9,900원 메이크업. 바쁜 직장인과 학생을 위한 즉시 예약형 뷰티 솔루션.",
  // 🔗 배포 도메인 기준
  metadataBase: new URL("https://ten9-inky.vercel.app"),
  openGraph: {
    title: "TEN:9 | 10분 메이크업 9,900원",
    description:
      "강남역 11번 출구, 10분 만에 눈·입·피부 등 핵심 포인트만 빠르게 정리하는 퀵 메이크업 서비스.",
    url: "https://ten9-inky.vercel.app",
    siteName: "TEN:9",
    images: [
      {
        // public/logo.jpg 썸네일로 사용
        url: "https://ten9-inky.vercel.app/logo.jpg",
        width: 1200,
        height: 630,
        alt: "TEN:9 퀵 메이크업 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TEN:9 | 10분 메이크업 9,900원",
    description:
      "강남역 11번 출구, 10분 만에 눈·입·피부 등 핵심 포인트만 빠르게 정리하는 퀵 메이크업 서비스.",
    images: ["https://ten9-inky.vercel.app/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-zinc-950 text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
