// app/loading/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ?to=/reserve 이런 식으로 들어온 값
  const target = searchParams.get("to") || "/";

  useEffect(() => {
    const timer = setTimeout(() => {
      // 🔥 push → replace 로 변경해서 히스토리에 /loading이 안 남도록 처리
      router.replace(target);
    }, 700); // 0.7초 후 원하는 페이지로 이동

    return () => clearTimeout(timer);
  }, [router, target]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-pink-500/20 bg-zinc-900/80 px-6 py-8 shadow-xl shadow-black/40 backdrop-blur-md text-center">
        {/* 상단 라벨 */}
        <p className="mb-2 text-[11px] font-medium tracking-wide text-pink-300/80">
          로딩중…
        </p>

        {/* 메이크업 아이콘 */}
        <div className="relative mx-auto mb-6 h-28 w-28">
          <div className="absolute inset-0 rounded-full bg-pink-500/40 blur-2xl" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-pink-400/60 bg-zinc-950/90">
            <span className="text-4xl">💄</span>
          </div>

          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl animate-bounce">
            ✨
          </span>
          <span className="absolute bottom-0 -left-2 text-2xl animate-pulse">
            💋
          </span>
          <span className="absolute -right-2 top-3 text-xl animate-ping">
            💅
          </span>
        </div>

        {/* 텍스트 */}
        <h1 className="text-lg font-semibold text-zinc-50">로딩중입니다</h1>
        <p className="mt-1 text-xs text-zinc-400">잠시만 기다려주세요.</p>

        {/* ⭐ 움직이는 로딩바 */}
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800 relative">
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-pink-400 animate-loadingSlide" />
        </div>
      </div>

      {/* 애니메이션 정의 */}
      <style jsx global>{`
        @keyframes loadingSlide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-loadingSlide {
          animation: loadingSlide 1.4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
