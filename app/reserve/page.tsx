// app/reserve/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReservePage() {
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // 🔵 약관 / 개인정보 보기 모달 상태
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    const anyInput = input as any;
    if (typeof anyInput.showPicker === "function") {
      anyInput.showPicker();
    } else {
      input.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // 1) 브라우저 기본 검증
    const isValid = form.reportValidity();
    if (!isValid) {
      const firstInvalid = form.querySelector<HTMLElement>(":invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // 2) 데이터 읽기
    const formData = new FormData(form);

    // (체크박스는 required 속성으로도 막히지만, 로직도 한 번 더 확인해줌)
    const agreeTerms = formData.get("agreeTerms");
    const agreePrivacy = formData.get("agreePrivacy");
    if (!agreeTerms || !agreePrivacy) {
      alert("이용약관과 개인정보 수집·이용에 모두 동의해주셔야 예약이 가능합니다.");
      return;
    }

    const timeAmpm = (formData.get("timeAmpm") || "").toString();
    const timeHour = (formData.get("timeHour") || "").toString();
    const timeMinute = (formData.get("timeMinute") || "").toString();
    const time = `${timeAmpm} ${timeHour}:${timeMinute}`;

    const gender = (formData.get("gender") || "").toString();

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      gender,
      date: formData.get("date"),
      time,
      areas: formData.getAll("areas"),
      purpose: formData.get("purpose"),
      message: formData.get("message"),
      // ※ agreeTerms / agreePrivacy 는 서버로 굳이 보내지 않고, 프론트 검증용으로만 사용
    };

    try {
      setSubmitting(true);

      // ✅ 로컬스토리지에 예약 정보 저장
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "pendingReservation",
          JSON.stringify(data)
        );
      }

      // ✅ 로딩/처리 페이지로 이동
      router.push("/loading_reserve");
    } catch (error) {
      console.error("예약 데이터 저장 중 오류:", error);
      alert("예약 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-8 sm:max-w-lg">
        {/* 상단 헤더 */}
        <header className="mb-4 flex items-center justify-between">
          {/* 왼쪽: 로고 + 브랜드 + 제목 */}
          <div>
            {/* 로고 + TEN:9 */}
            <div className="mb-2 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                <Image
                  src="/logo.jpg"
                  alt="TEN:9 로고"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-bold tracking-tight text-pink-300 uppercase">
                  TEN:9
                </span>
                <span className="text-[13px] text-zinc-400">
                  10분이면 완성되는 퀵 메이크업
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-500">10분 메이크업 9,900원</p>
            <h1 className="text-xl font-semibold text-zinc-50">예약하기</h1>
          </div>

          {/* 오른쪽: 메인으로 */}
          <Link
            href="/loading"
            className="text-xs font-medium text-zinc-300 underline underline-offset-4 hover:text-zinc-100"
          >
            ← 메인으로
          </Link>
        </header>

        <p className="mb-1 text-xs text-zinc-400">
          아래 정보를 남겨주시면 예약 요청이 접수됩니다. 담당자가 확인 후,
          남겨주신 이메일 또는 연락처로 일정 안내를 드립니다.
        </p>
        <p className="mb-4 text-[11px] text-zinc-500">
          예약 정보 수정이나 페이지 개선에 대한 의견이 있으시면{" "}
          <span className="font-semibold text-zinc-300">
            makeup10min@gmail.com
          </span>
          으로 자유롭게 메일 보내주세요. 🙏
        </p>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-zinc-900/80 p-4 shadow-xl shadow-black/40"
        >
          {/* 기본 정보 */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-200">기본 정보</h2>

            <div className="space-y-1">
              <label className="text-xs text-zinc-300" htmlFor="name">
                이름
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none ring-pink-500/60 focus:border-pink-500 focus:ring-2"
                placeholder="이름을 입력해주세요"
              />
            </div>

            {/* 성별 */}
            <div className="space-y-1">
              <span className="text-xs text-zinc-300">성별</span>
              <div className="flex flex-wrap gap-2 text-xs text-zinc-100">
                <label className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    required
                    className="h-3 w-3 accent-pink-500"
                  />
                  <span>여성</span>
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="h-3 w-3 accent-pink-500"
                  />
                  <span>남성</span>
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    className="h-3 w-3 accent-pink-500"
                  />
                  <span>기타 / 선택 안함</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-300" htmlFor="email">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none ring-pink-500/60 focus:border-pink-500 focus:ring-2"
                placeholder="example@email.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-300" htmlFor="phone">
                전화번호
              </label>
              <input
                id="phone"
                name="phone"
                required
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none ring-pink-500/60 focus:border-pink-500 focus:ring-2"
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          {/* 날짜 / 시간 */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-200">희망 일정</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* 날짜 */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-300" htmlFor="date">
                  날짜
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  ref={dateInputRef}
                  onClick={openDatePicker}
                  required
                  className="w-full rounded-xl border border-zinc-500 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 outline-none ring-pink-500/60 placeholder:text-zinc-500 focus:border-pink-500 focus:ring-2"
                />
              </div>

              {/* 시간 */}
              <div className="space-y-1">
                <label className="text-xs text-zinc-300">시간</label>

                <div className="flex items-stretch rounded-xl border border-zinc-500 bg-zinc-800 px-2 py-1 text-xs text-zinc-100">
                  {/* 오전/오후 */}
                  <select
                    name="timeAmpm"
                    required
                    className="bg-transparent px-1 py-1 outline-none border-none focus:ring-0 focus:outline-none"
                    defaultValue="오후"
                  >
                    <option value="오전">오전</option>
                    <option value="오후">오후</option>
                  </select>

                  <div className="mx-1 h-5 w-px self-center bg-zinc-600/60" />

                  {/* 시 */}
                  <select
                    name="timeHour"
                    required
                    className="bg-transparent px-1 py-1 outline-none border-none focus:ring-0 focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      시
                    </option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h.toString().padStart(2, "0")}>
                        {h.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  <span className="mx-1 self-center text-zinc-500">:</span>

                  {/* 분 */}
                  <select
                    name="timeMinute"
                    required
                    className="w-16 bg-transparent px-1 py-1 outline-none border-none focus:ring-0 focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      분
                    </option>
                    {[
                      "00",
                      "05",
                      "10",
                      "15",
                      "20",
                      "25",
                      "30",
                      "35",
                      "40",
                      "45",
                      "50",
                      "55",
                    ].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 시술 부위 선택 */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-200">
              어느 부위를 중심으로 메이크업 받고 싶으신가요?
            </h2>
            <p className="text-[11px] text-zinc-400">
              여러 부위를 함께 선택하실 수 있습니다.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-100">
              <label className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                <input
                  type="checkbox"
                  name="areas"
                  value="눈 메이크업"
                  className="h-3 w-3 accent-pink-500"
                />
                <span>눈 메이크업</span>
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                <input
                  type="checkbox"
                  name="areas"
                  value="코 / 쉐딩"
                  className="h-3 w-3 accent-pink-500"
                />
                <span>코 / 쉐딩</span>
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                <input
                  type="checkbox"
                  name="areas"
                  value="입술"
                  className="h-3 w-3 accent-pink-500"
                />
                <span>입술</span>
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                <input
                  type="checkbox"
                  name="areas"
                  value="피부 / 전체 베이스"
                  className="h-3 w-3 accent-pink-500"
                />
                <span>피부 / 전체 베이스</span>
              </label>
              <label className="col-span-2 flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2">
                <input
                  type="checkbox"
                  name="areas"
                  value="기타 (추가 내용 참조)"
                  className="h-3 w-3 accent-pink-500"
                />
                <span>기타 (추가 내용에 적어주세요)</span>
              </label>
            </div>
          </div>

          {/* 용도 선택 */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-200">
              어떤 용도의 메이크업인가요?
            </h2>
            <select
              name="purpose"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none ring-pink-500/60 focus:border-pink-500 focus:ring-2"
              defaultValue=""
            >
              <option value="" disabled>
                선택해주세요
              </option>
              <option value="introdate">소개팅</option>
              <option value="meeting">중요한 미팅</option>
              <option value="presentation">발표 / PT</option>
              <option value="interview">면접</option>
              <option value="daily">데일리 일정</option>
              <option value="etc">기타</option>
            </select>
          </div>

          {/* 기타 요청 사항 */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-300" htmlFor="message">
              추가로 남기고 싶은 내용
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none ring-pink-500/60 focus:border-pink-500 focus:ring-2"
              placeholder="예: 피부 타입, 평소 메이크업 스타일, 피하고 싶은 색감 등"
            />
          </div>

          {/* 이용약관 및 개인정보 동의 */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-200">
              이용약관 및 개인정보 수집·이용 동의
            </h2>
            <p className="text-[11px] text-zinc-400">
              예약 요청을 위해 아래 필수 항목에 모두 동의해주셔야 합니다.
            </p>

            <div className="space-y-2 text-[11px] text-zinc-300">
              {/* 이용약관 동의 */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  required
                  className="mt-1 h-3 w-3 accent-pink-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="agreeTerms"
                    className="font-medium text-zinc-100"
                  >
                    [필수] 서비스 이용약관에 동의합니다.
                  </label>
                  <div className="mt-1">
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="rounded-full bg-pink-800 px-3 py-1 text-[10px] font-semibold text-white hover:bg-pink-700"
                    >
                      이용약관 보기
                    </button>
                  </div>
                </div>
              </div>

              {/* 개인정보 처리 동의 */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreePrivacy"
                  name="agreePrivacy"
                  required
                  className="mt-1 h-3 w-3 accent-pink-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="agreePrivacy"
                    className="font-medium text-zinc-100"
                  >
                    [필수] 개인정보 수집·이용에 동의합니다.
                  </label>
                  <div className="mt-1">
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(true)}
                      className="rounded-full bg-pink-800 px-3 py-1 text-[10px] font-semibold text-white hover:bg-pink-700"
                    >
                      개인정보 처리방침 보기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-2xl bg-pink-500 px-4 py-3 
                       text-sm font-semibold text-white shadow-lg 
                       shadow-pink-500/30 transition hover:bg-pink-400
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "예약 요청 보내는 중…" : "이 정보로 예약 요청 보내기"}
          </button>

          <p className="text-[10px] text-zinc-500">
            남겨주신 연락처는 예약 상담 및 일정 안내 용도로만 사용됩니다.
          </p>
        </form>
      </div>

      {/* 📜 이용약관 모달 */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-4 shadow-2xl shadow-black/60">
            <h3 className="mb-2 text-sm font-semibold text-zinc-50">
              서비스 이용약관
            </h3>

            <div className="max-h-64 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] leading-relaxed text-zinc-200">
              <p className="mb-2">
                본 서비스는 10분 메이크업 예약을 위한{" "}
                <span className="font-semibold">예약 요청 플랫폼</span>
                입니다. 실제 시술은 제휴된 메이크업 아티스트 또는 매장에서
                제공하며, 서비스 제공자에 따라 가격, 일정, 서비스 내용이 달라질
                수 있습니다.
              </p>

              <p className="mb-1">
                1. 본 페이지를 통해 남겨주신 예약 요청은 &quot;확정 예약&quot;이
                아니며, 담당자의 개별 안내를 통해 최종 확정됩니다.
              </p>

              <p className="mb-1">
                2. 이용자는 정확한 연락처 및 일정을 기입해야 하며, 잘못된 정보
                제공으로 인한 불이익에 대해 서비스 제공자는 책임을 지지
                않습니다.
              </p>

              <p className="mb-1">
                3. 서비스 내용, 가격, 일정 등은 사전 공지 없이 변경될 수
                있으며, 최종 내용은 담당자의 안내를 기준으로 합니다.
              </p>

              <p className="mb-1">
                4. 본 서비스는 테스트 운영 중일 수 있으며, 예고 없이 중단되거나
                기능이 변경될 수 있습니다.
              </p>

              <p className="mt-3 text-[10px] text-zinc-500">
                ※ 본 화면은 서비스 개선과 기획 검증을 위한 프리토타입이며, 입력된
                정보는 실제 예약 확정이나 일정 배정으로 이어지지 않을 수 있습니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="mt-3 w-full rounded-xl bg-pink-600 px-3 py-2 text-xs font-semibold text-white hover:bg-pink-500"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 🔒 개인정보 처리방침 모달 */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-4 shadow-2xl shadow-black/60">
            <h3 className="mb-2 text-sm font-semibold text-zinc-50">
              개인정보 수집·이용 안내
            </h3>

            <div className="max-h-64 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-[11px] leading-relaxed text-zinc-200">
              <p className="mb-2">
                예약 요청 처리 및 상담을 위해 아래와 같은 개인정보를
                수집·이용합니다.
              </p>

              <p className="mb-1">
                1.{" "}
                <span className="font-semibold">
                  수집 항목: 이름, 이메일, 전화번호, 예약 희망일시, 시술 부위,
                  용도, 추가 요청 사항
                </span>
              </p>

              <p className="mb-1">
                2. 이용 목적: 예약 요청 확인, 일정 조율, 서비스 안내, 필요 시
                문의를 위한 연락
              </p>

              <p className="mb-1">
                3. 보유 기간: 예약 처리 및 상담 종료 후 지체 없이 파기하며,
                관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관할 수
                있습니다.
              </p>

              <p className="mb-1">
                4. 제공: 예약 및 시술 진행을 위해 제휴 아티스트 또는 매장에
                최소한의 정보(이름, 연락처, 예약 정보)가 제공될 수 있습니다.
              </p>

              <p className="mt-2 text-zinc-400">
                위 개인정보 수집·이용에 동의하지 않으실 수 있으나, 이 경우
                서비스 이용(예약 요청)이 제한될 수 있습니다.
              </p>

              <p className="mt-3 text-[10px] text-zinc-500">
                ※ 본 화면은 서비스 기획·검증을 위한 프리토타입으로, 입력된 정보는
                실제 예약 확정이나 일정 배정에 사용되지 않을 수 있습니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPrivacy(false)}
              className="mt-3 w-full rounded-xl bg-pink-600 px-3 py-2 text-xs font-semibold text-white hover:bg-pink-500"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
