// app/page.tsx

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();

  const goToReserve = () => {
    router.push("/loading?to=/reserve");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-8 sm:max-w-lg">
        {/* 헤더 / 타이틀 영역 */}
        <header className="mb-4">
          {/* 로고 + 브랜드 영역 */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* 로고 이미지 */}
              <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                <Image
                  src="/logo.jpg"
                  alt="TEN:9 로고"
                  fill
                  className="object-cover"
                />
              </div>

              {/* 브랜드 텍스트 */}
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-semibold text-pink-300 uppercase">
                  TEN:9
                </span>
                <span className="text-[13px] text-zinc-400">
                  10분이면 완성되는 퀵 메이크업
                </span>
              </div>
            </div>

            {/* 위치/서비스 라벨 */}
            <span className="inline-flex flex-col rounded-full bg-pink-500/10 px-4 py-1 text-sm font-medium text-pink-300">
              <span>강남, 신촌, 건대입구</span>
              <span>퀵 메이크업</span>
            </span>
          </div>

          {/* 메인 타이틀 */}
          <h1 className="mt-2 text-2xl font-bold leading-tight text-zinc-50 sm:text-4xl">
            10분이면 완성되는
            <br />
            <span className="text-pink-400">퀵 메이크업 9,900원</span>
          </h1>

          <p className="mt-3 text-sm text-zinc-300 sm:text-base">
            중요한 약속/업무미팅, 면접, 소개팅 직전에{" "}
            <span className="font-semibold text-pink-200">
              10분만 투자해서 핵심 부위만 빠르게 정리
            </span>
            하는 메이크업 서비스입니다.
          </p>
        </header>

        {/* ✅ 헤더 바로 아래 예약 버튼(위로 이동) */}
        <div className="mb-6">
          <button
            onClick={goToReserve}
            className="block w-full rounded-2xl bg-pink-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:bg-pink-400"
          >
            10분 메이크업 예약하기
          </button>
          <p className="mt-2 text-center text-[11px] text-zinc-500">
            남겨주신 개인정보로 예약 확정 및 안내를 드립니다.
          </p>
        </div>

        {/* Before / After 강조 섹션 */}
        <section className="mb-8">
          <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg shadow-black/30 sm:p-5">
            <h2 className="text-sm font-semibold text-zinc-200">
              10분 전·후 실제 사례
            </h2>
            <p className="text-xs text-zinc-400">
              아래 전후 사진은 TEN:9에서 진행한 실제 10분 메이크업 예시입니다.
              짧은 시간 안에 인상이 어떻게 달라지는지 확인해보세요.
            </p>

            <div className="space-y-5">
              {/* 남성 예시 */}
              <div>
                <p className="mb-2 text-xs font-semibold text-zinc-400">
                  남성 고객 예시
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Before */}
                  <div className="relative h-40 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg shadow-black/20 sm:h-52">
                    <Image
                      src="/before.png"
                      alt="메이크업 전 얼굴"
                      width={600}
                      height={800}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-black/60 backdrop-blur px-2 py-1 text-[11px] font-medium text-zinc-100">
                      현재 모습
                    </span>
                  </div>

                  {/* After */}
                  <div className="relative h-40 overflow-hidden rounded-2xl border border-pink-500/60 bg-zinc-900 shadow-lg shadow-pink-500/10 sm:h-52">
                    <Image
                      src="/after.png"
                      alt="10분 후 메이크업 결과"
                      width={600}
                      height={800}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-pink-500 backdrop-blur px-2 py-1 text-[11px] font-semibold text-white">
                      10분 후
                    </span>
                    <span className="absolute right-2 bottom-2 rounded-full border border-pink-500/50 bg-black/50 px-3 py-1 text-[11px] font-semibold text-pink-300 backdrop-blur">
                      ⏱ 단 10분
                    </span>
                  </div>
                </div>
              </div>

              {/* 여성 예시 */}
              <div>
                <p className="mb-2 text-xs font-semibold text-zinc-400">
                  여성 고객 예시
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Before */}
                  <div className="relative h-40 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg shadow-black/20 sm:h-52">
                    <Image
                      src="/001.png"
                      alt="메이크업 전 얼굴"
                      width={600}
                      height={800}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-black/60 backdrop-blur px-2 py-1 text-[11px] font-medium text-zinc-100">
                      현재 모습
                    </span>
                  </div>

                  {/* After */}
                  <div className="relative h-40 overflow-hidden rounded-2xl border border-pink-500/60 bg-zinc-900 shadow-lg shadow-pink-500/10 sm:h-52">
                    <Image
                      src="/002.png"
                      alt="10분 후 메이크업 결과"
                      width={600}
                      height={800}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-pink-500 backdrop-blur px-2 py-1 text-[11px] font-semibold text-white">
                      10분 후
                    </span>
                    <span className="absolute right-2 bottom-2 rounded-full border border-pink-500/50 bg-black/50 px-3 py-1 text-[11px] font-semibold text-pink-300 backdrop-blur">
                      ⏱ 단 10분
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-zinc-500">
              바쁜 일정 중에도 빠르게 정돈된 인상을 만들 수 있도록,
              핵심 포인트만 집중해서 정리해드립니다.
            </p>
          </div>
        </section>

        {/* 서비스 설명 */}
        <section className="mb-6 space-y-2">
          <h2 className="text-sm font-semibold text-zinc-200">서비스 소개</h2>
          <p className="text-sm leading-relaxed text-zinc-200">
            전통적인 풀 메이크업이 아니라,{" "}
            <span className="font-semibold text-pink-300">
              눈·입·피부 등 핵심 포인트만 빠르게 정리
            </span>
            해 드리는 퀵 메이크업 서비스입니다. <br />
            <span className="font-semibold text-pink-300">
              모든 시술은 전문 라이센스를 보유한 메이크업 아티스트가 직접 진행합니다.
            </span>
            <br />
            <br />
            “내가 스스로 하기엔 애매하지만, 전문 메이크업샵 전체를 예약하기엔
            부담스러울 때”를 위한 옵션을 목표로 합니다.
          </p>

          <ul className="mt-2 space-y-1 text-sm text-zinc-300">
            <li>· 소요 시간: 약 10분</li>
            <li>· 가격: 9,900원</li>
            <li>· 부위 선택: 기본 메이크업(피부, 눈썹, 입술)에 부위 추가 가능</li>
            <li>· 용도: 소개팅, 업무미팅, 발표, 면접, 데일리 등</li>
          </ul>
        </section>

        {/* 지도 섹션 */}
        {/* 지도 섹션 */}
<section className="mb-6 space-y-3">
  <h2 className="text-sm font-semibold text-zinc-200">
    위치 : 강남역, 신촌역, 건대입구 2호선에서 5분 거리
  </h2>
  <p className="text-xs text-zinc-400">
    현재 TEN:9는 강남역, 신촌역, 건대입구역 인근 상가에
    위치해 있습니다. 역에서 도보 5분 내 거리에 위치해 있습니다.
  </p>

  <div className="space-y-3">

    {/* 강남역 */}
    <div>
      <p className="mb-1 text-[11px] font-medium text-zinc-400">
        강남역 11번 출구 인근
      </p>
      <div className="h-40 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <iframe
          title="강남역 11번 출구 위치"
          src="https://www.google.com/maps?q=강남역+11번+출구&output=embed"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>

    {/* 신촌역 1번 출구 */}
    <div>
      <p className="mb-1 text-[11px] font-medium text-zinc-400">
        신촌역 1번 출구 인근
      </p>
      <div className="h-40 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <iframe
          title="신촌역 1번 출구 위치"
          src="https://www.google.com/maps?q=신촌역+1번+출구&output=embed"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>

    {/* 건대입구역 1번 출구 */}
    <div>
      <p className="mb-1 text-[11px] font-medium text-zinc-400">
        건대입구역 1번 출구 인근
      </p>
      <div className="h-40 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <iframe
          title="건대입구역 1번 출구 위치"
          src="https://www.google.com/maps?q=건대입구역+1번+출구&output=embed"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>

  </div>
</section>

      </div>
    </main>
  );
}
