// app/loading_reserve/page.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function LoadingReserve() {
  const router = useRouter();
  const hasRun = useRef(false); // 🔥 useEffect 중복 실행 방지

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const submitReservation = async () => {
      try {
        if (typeof window === "undefined") return;

        const raw = window.localStorage.getItem("pendingReservation");

        // 저장된 예약 정보가 없으면 그냥 홈으로
        if (!raw) {
          router.push("/");
          return;
        }

        const data = JSON.parse(raw);

        const res = await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("예약 요청 처리 실패:", text);
          alert(
            "예약 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
          router.push("/reserve");
          return;
        }

        // 성공 시: 저장된 pendingReservation 제거
        window.localStorage.removeItem("pendingReservation");

        // 🔥 첫 번째 alert
        await new Promise((resolve) => {
          alert(
            "예약 요청이 정상적으로 접수되었습니다! 🎉\n이메일을 확인해주세요. 예약 정보가 발송되었습니다."
          );
          resolve(null);
        });

        // 🔥 두 번째 alert
        await new Promise((resolve) => {
          alert("메인 페이지로 이동합니다.");
          resolve(null);
        });

        // 🔥 이동
        router.push("/");
      } catch (error) {
        console.error("예약 요청 중 네트워크 오류:", error);
        alert(
          "네트워크 오류가 발생했습니다. 인터넷 연결 후 다시 시도해주세요."
        );
        router.push("/reserve");
      }
    };

    submitReservation();
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-pink-500/20 bg-zinc-900/80 px-6 py-8 shadow-xl shadow-black/40 backdrop-blur-md text-center">
        {/* 메이크업 아이콘 + 효과 */}
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
        <h1 className="text-lg font-semibold text-zinc-50">
          예약 요청을 처리하고 있어요…
        </h1>
        <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
          남겨주신 예약 정보를 확인하고
          <br /> 담당자에게 전달하는 중입니다.
        </p>

        {/* 로딩 바 */}
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800 relative">
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-pink-400 animate-loadingSlide" />
        </div>

        {/* 하단 문구 */}
        <p className="mt-3 text-[10px] text-zinc-500">
          잠시만 기다려 주세요.{" "}
          <span className="text-pink-300">예약 접수가 곧 완료됩니다.</span>
        </p>
      </div>

      {/* 글로벌 애니메이션 정의 */}
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
