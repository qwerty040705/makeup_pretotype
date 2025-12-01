// app/api/reservations/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, areas, purpose, message } = body;

    // 필수값 체크
    if (!name || !email || !phone || !date || !time || !purpose) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    // ───────────────── MongoDB 저장 ─────────────────
    const client = await clientPromise;
    const db = client.db("makeup10min");
    const reservations = db.collection("reservations");

    const doc = {
      name,
      email,
      phone,
      date,
      time,
      areas,
      purpose,
      message,
      createdAt: new Date(),
    };

    await reservations.insertOne(doc);

    // ───────────────── 이메일 설정 체크 ─────────────────
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("[예약 API] EMAIL_USER / EMAIL_PASSWORD 미설정");
      return NextResponse.json(
        { error: "이메일 설정이 올바르지 않습니다." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // 예: makeup10min@gmail.com
        pass: process.env.EMAIL_PASSWORD, // Gmail 앱 비밀번호
      },
    });

    const areasText =
      Array.isArray(areas) && areas.length > 0
        ? (areas as string[]).join(", ")
        : "선택 없음";

    const purposeLabelMap: Record<string, string> = {
      introdate: "소개팅",
      meeting: "중요한 미팅",
      presentation: "발표 / PT",
      interview: "면접",
      daily: "데일리 일정",
      etc: "기타",
    };

    const purposeLabel = purposeLabelMap[purpose] || purpose;

    const summaryText = `
[10분 메이크업 예약 요청]

이름: ${name}
이메일: ${email}
전화번호: ${phone}
희망 날짜: ${date}
희망 시간: ${time}
시술 부위: ${areasText}
용도: ${purposeLabel}
추가 내용:
${message || "(없음)"}
`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const logoUrl = baseUrl ? `${baseUrl}/logo.jpg` : "";

    // ───────────────── 고객용 HTML 메일 ─────────────────
    const userHtml = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charSet="utf-8" />
    <title>[TEN:9] 예약 요청이 접수되었습니다</title>
  </head>
  <body style="margin:0;padding:0;background-color:#050509;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#f4f4f5;">
    <table width="100%" cellspacing="0" cellpadding="0" style="background:#050509;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#18181b;border-radius:16px;padding:24px;border:1px solid #27272a;">
            <tr>
              <td align="left" style="padding-bottom:16px;border-bottom:1px solid #27272a;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:56px;vertical-align:top;">
                      ${
                        logoUrl
                          ? `<div style="width:48px;height:48px;border-radius:14px;overflow:hidden;border:1px solid rgba(244,114,182,0.5);background:#020617;">
                               <img src="${logoUrl}" alt="TEN:9 로고" style="display:block;width:100%;height:100%;object-fit:cover;" />
                             </div>`
                          : `<div style="width:48px;height:48px;border-radius:14px;background:#020617;border:1px solid rgba(244,114,182,0.5);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#f9a8d4;">T</div>`
                      }
                    </td>
                    <td style="padding-left:12px;vertical-align:middle;">
                      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#f9a8d4;font-weight:600;">
                        TEN:9
                      </div>
                      <div style="font-size:12px;color:#a1a1aa;margin-top:2px;">
                        10분이면 완성되는 퀵 메이크업
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding-top:18px;padding-bottom:8px;">
                <div style="font-size:15px;font-weight:600;color:#f4f4f5;margin-bottom:4px;">
                  ${name}님, 예약 요청이 정상적으로 접수되었습니다. 💄
                </div>
                <div style="font-size:12px;color:#a1a1aa;line-height:1.6;">
                  보내주신 정보를 확인한 뒤, 담당자가 이메일 또는 연락처로 다시 한 번
                  <span style="color:#f9a8d4;font-weight:500;">예약 확정 안내</span>를 드릴 예정입니다.
                  <br />
                  아직 최종 확정 단계는 아니니, 이후 안내 메일도 꼭 함께 확인해주세요.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:8px;padding-bottom:8px;">
                <div style="font-size:13px;font-weight:600;color:#e5e5e5;margin-bottom:6px;">
                  예약 요청 내용
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:12px;color:#d4d4d8;background:#09090b;border-radius:12px;padding:10px 12px;border:1px solid #27272a;">
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">이름</td>
                    <td style="padding:4px 0;">${name}</td>
                  </tr>
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">이메일</td>
                    <td style="padding:4px 0;">${email}</td>
                  </tr>
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">전화번호</td>
                    <td style="padding:4px 0;">${phone}</td>
                  </tr>
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">희망 일정</td>
                    <td style="padding:4px 0;">${date} · ${time}</td>
                  </tr>
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">시술 부위</td>
                    <td style="padding:4px 0;">${areasText}</td>
                  </tr>
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">용도</td>
                    <td style="padding:4px 0;">${purposeLabel}</td>
                  </tr>
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;vertical-align:top;">추가 내용</td>
                    <td style="padding:4px 0;white-space:pre-line;">${
                      message || "(없음)"
                    }</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding-top:10px;">
                <div style="font-size:11px;color:#71717a;line-height:1.6;">
                  이 메일은
                  <span style="color:#e5e5e5;"> 10분 퀵 메이크업 예약 요청 접수</span>를
                  안내드리기 위한 자동 발송 메일입니다.
                  <br />
                  예약 내용에 수정이 필요하시거나, 페이지에 대한 개선 의견이 있으시다면
                  <span style="color:#e5e5e5;"> makeup10min@gmail.com </span>
                  으로 편하게 회신 주세요.
                </div>

                <div style="margin-top:14px;font-size:10px;color:#52525b;line-height:1.6;border-top:1px solid #27272a;padding-top:10px;">
                  ※ 현재 서비스는 운영 방향을 검토하기 위한
                  <span style="color:#a1a1aa;"> 프리토타입 테스트 단계</span>이며,
                  일부 예약은 실제 확정 예약으로 이어지지 않을 수 있습니다.
                </div>
              </td>
            </tr>
          </table>

          <div style="margin-top:12px;font-size:10px;color:#52525b;">
            © ${new Date().getFullYear()} TEN:9 — Quick Makeup Prototype
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    // ───────────────── 운영자용 HTML 메일 (조금 심플하게) ─────────────────
    const adminHtml = `<!DOCTYPE html>
<html lang="ko">
  <head><meta charSet="utf-8" /></head>
  <body style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#111827;">
    <h2 style="margin-bottom:4px;">[TEN:9] 새로운 예약 요청</h2>
    <p style="margin-top:0;color:#6b7280;font-size:12px;">웹 프리토타입에서 신규 예약 요청이 접수되었습니다.</p>
    <table cellpadding="4" cellspacing="0" style="border-collapse:collapse;font-size:13px;">
      <tr>
        <td style="color:#6b7280;">이름</td><td>${name}</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">이메일</td><td>${email}</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">전화번호</td><td>${phone}</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">희망 일정</td><td>${date} · ${time}</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">시술 부위</td><td>${areasText}</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">용도</td><td>${purposeLabel}</td>
      </tr>
      <tr>
        <td style="color:#6b7280;vertical-align:top;">추가 내용</td>
        <td style="white-space:pre-line;">${message || "(없음)"}</td>
      </tr>
    </table>
    <p style="margin-top:16px;font-size:11px;color:#9ca3af;">
      이 메일은 TEN:9 퀵 메이크업 프리토타입 예약 페이지에서 자동 발송되었습니다.
    </p>
  </body>
</html>`;

    // ───────────────── 1) 고객에게 확인 메일 ─────────────────
    await transporter.sendMail({
      from: `"TEN:9 퀵 메이크업" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "[TEN:9] 10분 메이크업 예약 요청이 접수되었습니다.",
      text:
        `${name}님, 안녕하세요.\n\n` +
        `보내주신 예약 정보가 정상적으로 접수되었습니다.\n` +
        `담당자가 확인 후 이메일 또는 연락처로 다시 안내드릴 예정입니다.\n\n` +
        `--- 예약 내용 ---\n` +
        summaryText +
        `\n감사합니다.\nTEN:9 드림`,
      html: userHtml,
    });

    // ───────────────── 2) 운영자(너)에게 알림 메일 ─────────────────
    await transporter.sendMail({
      from: `"TEN:9 예약 알림" <${process.env.EMAIL_USER}>`,
      to: "makeup10min@gmail.com",
      subject: "[TEN:9] 새로운 예약 요청이 들어왔습니다.",
      text: summaryText,
      html: adminHtml,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[예약 API] error:", err);
    return NextResponse.json(
      { error: "예약 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
