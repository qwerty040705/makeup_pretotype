// app/api/reservations/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      gender,
      date,
      time,
      areas,
      purpose,
      message,
      ageGroup,
      basePrice,
      addOnPrice,
      totalPrice,
      totalMinutes,
      addEyes,
      addShading,
      timeDetail,
    } = body;

    // 필수값 체크 (전화번호 제거, 나이대 필수 추가)
    if (!name || !email || !gender || !date || !time || !purpose || !ageGroup) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    // 숫자 필드 안전 처리
    const numericBasePrice = typeof basePrice === "number" ? basePrice : 9900;
    const numericAddOnPrice = typeof addOnPrice === "number" ? addOnPrice : 4900;
    const numericTotalPrice =
      typeof totalPrice === "number" ? totalPrice : numericBasePrice;
    const numericTotalMinutes =
      typeof totalMinutes === "number" ? totalMinutes : 10;

    // ───────────────── MongoDB 저장 ─────────────────
    const client = await clientPromise;
    const db = client.db("makeup10min");
    const reservations = db.collection("reservations");

    const doc = {
      name,
      email,
      gender,
      ageGroup,
      date,
      time,
      areas,
      purpose,
      message,
      pricing: {
        basePrice: numericBasePrice,
        addOnPrice: numericAddOnPrice,
        totalPrice: numericTotalPrice,
        totalMinutes: numericTotalMinutes,
        addEyes: !!addEyes,
        addShading: !!addShading,
      },
      timeDetail: timeDetail || null,
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

    const areaLabelMap: Record<string, string> = {
      compact: "컴팩트 메이크업 (피부, 눈썹, 입술) — 기본",
      eyes: "눈 메이크업 추가",
      shading: "코 / 쉐딩 추가",
    };

    const areasText =
      Array.isArray(areas) && areas.length > 0
        ? (areas as string[])
            .map((a) => areaLabelMap[a] || a)
            .join(", ")
        : "컴팩트 메이크업 (기본)";

    const purposeLabelMap: Record<string, string> = {
      introdate: "소개팅",
      meeting: "중요한 업무미팅 / 발표",
      daily: "데일리 일정",
      other: "기타",
    };

    const genderLabelMap: Record<string, string> = {
      female: "여성",
      male: "남성",
    };

    // 프론트에서 사용하는 value 기준
    const ageGroupLabelMap: Record<string, string> = {
      "10s-late": "10대 후반",
      "20s-early": "20대 초반",
      "20s-mid": "20대 중반",
      "20s-late": "20대 후반",
      "30s-early": "30대 초반",
      "30s-mid": "30대 중반",
      others: "기타",
    };

    const purposeLabel = purposeLabelMap[purpose] || purpose;
    const genderLabel = genderLabelMap[gender] || gender;
    const ageGroupLabel = ageGroupLabelMap[ageGroup] || ageGroup;

    const timeRangeText =
      timeDetail && timeDetail.startLabel && timeDetail.endLabel
        ? `${timeDetail.startLabel} ~ ${timeDetail.endLabel}`
        : "미입력";

    const summaryText = `
[TEN:9 프리토타입 테스트 – 입력 내용 요약]

이름: ${name}
이메일: ${email}
성별: ${genderLabel}
나이대: ${ageGroupLabel}
희망 날짜: ${date}
희망 시간: ${time}
예상 소요 시간: ${timeRangeText} (약 ${numericTotalMinutes}분)
예상 결제 금액(가상): ${numericTotalPrice.toLocaleString("ko-KR")}원
시술 옵션: ${areasText}
용도: ${purposeLabel}
추가 내용:
${message || "(없음)"}
`;

    const baseUrl = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://ten9-inky.vercel.app"
    ).replace(/\/$/, "");

    const logoUrl = `${baseUrl}/logo.jpg`;

    // ───────────────── 고객용 HTML 메일 ─────────────────
    const userHtml = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charSet="utf-8" />
    <title>[TEN:9] 🚨 예약이 접수되지 않습니다 (프리토타입 안내)</title>
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
                        10분이면 완성되는 퀵 메이크업 (프리토타입)
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 🔴 최상단 경고/안내 박스 -->
            <tr>
              <td style="padding-top:16px;padding-bottom:10px;">
                <div style="border-radius:12px;background:#450a0a;padding:10px 12px;border:1px solid #f87171;color:#fee2e2;font-size:12px;line-height:1.6;">
                  <strong style="font-size:13px;">🚨 중요한 안내</strong><br />
                  이 메일은 <strong>실제 미용 서비스 예약이 아니라</strong>,
                  <strong>테스트용 프리토타입 페이지</strong>에서 남겨주신 정보를
                  정리해서 보내드리는 안내 메일입니다.
                  <br />
                  입력하신 내용은 <strong>실제 매장 예약, 시술, 결제, 방문 일정</strong>으로
                  이어지지 않습니다.
                </div>
              </td>
            </tr>

            <!-- 🙏 수요조사·댓글/좋아요·소문 관련 안내 -->
            <tr>
              <td style="padding-top:6px;padding-bottom:4px;">
                <div style="border-radius:12px;background:#020617;padding:10px 12px;border:1px solid #27272a;color:#e5e5e5;font-size:12px;line-height:1.7;">
                  <div style="font-weight:600;margin-bottom:4px;">🙏 부탁드리고 싶은 점</div>
                  <ul style="margin:0;padding-left:18px;">
                    <li style="margin-bottom:4px;">
                      이번 페이지는 <strong>향후 실제 서비스 출시를 검토하기 위한 수요조사용 프리토타입(MVP)</strong>입니다.
                      많은 분들이 관심을 보여주시면, <strong>정식 서비스로 출시</strong>하는 것을 진지하게 준비할 예정입니다. 🚀
                    </li>
                    <li style="margin-bottom:4px;">
                      인스타그램에서 보신 <strong>TEN:9 관련 게시물/광고</strong>가 마음에 드셨다면,
                      <strong>좋아요와 긍정적인 댓글</strong>을 남겨주시면 정말 큰 힘이 됩니다. 💗
                    </li>
                    <li>
                      한편, 이 페이지가 <strong>수업용 테스트</strong>라는 점을 모르고
                      다른 분들이 <strong>‘가짜 예약 사이트’, ‘사기 서비스’</strong>로 오해할 수 있어,
                      SNS나 커뮤니티에 그런 식으로 소문을 내기보다는
                      <strong>“수업용 실험 프로젝트”</strong>라는 점을 너그럽게 이해해 주시면 정말 감사하겠습니다. 🙏
                    </li>
                  </ul>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:6px;padding-bottom:8px;">
                <div style="font-size:14px;font-weight:600;color:#f4f4f5;margin-bottom:4px;">
                  ${name}님, TEN:9 프리토타입 테스트에 참여해 주셔서 감사합니다.
                </div>
                <div style="font-size:12px;color:#a1a1aa;line-height:1.7;">
                  현재 이 서비스는 <strong>서울대학교 벤처경영학과 「창조와 혁신」 수업</strong>에서
                  진행 중인 <strong>서비스 아이디어 검증용 프리토타입(MVP)</strong>입니다.
                  <br />
                  남겨주신 정보는 <strong>수업 내 연구·기획 참고용</strong>으로만 활용되며,
                  실제 예약 확정이나 일정 배정, 결제에 사용되지 않습니다.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:8px;padding-bottom:8px;">
                <div style="font-size:13px;font-weight:600;color:#e5e5e5;margin-bottom:6px;">
                  테스트 페이지에서 입력하신 내용
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
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">성별</td>
                    <td style="padding:4px 0;">${genderLabel}</td>
                  </tr>
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">나이대</td>
                    <td style="padding:4px 0;">${ageGroupLabel}</td>
                  </tr>
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">희망 일정</td>
                    <td style="padding:4px 0;">${date} · ${time}</td>
                  </tr>
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">예상 시간(가상)</td>
                    <td style="padding:4px 0;">
                      ${timeRangeText} (약 ${numericTotalMinutes}분)
                    </td>
                  </tr>
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">예상 금액(가상)</td>
                    <td style="padding:4px 0;">
                      ${numericTotalPrice.toLocaleString("ko-KR")}원
                    </td>
                  </tr>
                  <tr>
                    <td width="80" style="color:#a1a1aa;padding:4px 0;">시술 옵션</td>
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
                <div style="font-size:11px;color:#71717a;line-height:1.7;">
                  이 메일은 <strong>서울대학교 벤처경영학과 「창조와 혁신」 수업</strong>에서
                  진행 중인 <strong>TEN:9 퀵 메이크업 프리토타입(MVP) 테스트</strong>의
                  일환으로 자동 발송되었습니다.
                  <br />
                  실제 예약 진행을 원하실 경우에는, 향후 정식 서비스 오픈 안내를
                  별도로 드릴 예정입니다.
                </div>

                <div style="margin-top:14px;font-size:10px;color:#52525b;line-height:1.6;border-top:1px solid #27272a;padding-top:10px;">
                  ※ 현재 페이지는 <strong>아이디어 검증을 위한 프리토타입/테스트용 MVP</strong>이며,
                  입력하신 정보는 <strong>실제 매장 예약, 시술, 결제, 방문</strong>에 사용되지 않습니다.
                </div>
              </td>
            </tr>
          </table>

          <div style="margin-top:12px;font-size:10px;color:#52525b;">
            © ${new Date().getFullYear()} TEN:9 — Quick Makeup Prototype (SNU Venture Management · 창조와 혁신)
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    // ───────────────── 운영자용 HTML 메일 ─────────────────
    const adminHtml = `<!DOCTYPE html>
<html lang="ko">
  <head><meta charSet="utf-8" /></head>
  <body style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#111827;">
    <h2 style="margin-bottom:4px;">[TEN:9 프리토타입] 새로운 테스트 응답</h2>
    <p style="margin-top:0;color:#6b7280;font-size:12px;">
      서울대학교 벤처경영학과 「창조와 혁신」 수업 내
      TEN:9 퀵 메이크업 프리토타입(MVP) 페이지에서 신규 응답이 접수되었습니다.
    </p>
    <table cellpadding="4" cellspacing="0" style="border-collapse:collapse;font-size:13px;">
      <tr>
        <td style="color:#6b7280;">이름</td><td>${name}</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">이메일</td><td>${email}</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">성별</td><td>${genderLabel}</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">나이대</td><td>${ageGroupLabel}</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">희망 일정</td><td>${date} · ${time}</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">예상 시간(가상)</td>
        <td>${timeRangeText} (약 ${numericTotalMinutes}분)</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">예상 금액(가상)</td>
        <td>${numericTotalPrice.toLocaleString("ko-KR")}원</td>
      </tr>
      <tr>
        <td style="color:#6b7280;">시술 옵션</td><td>${areasText}</td>
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
      이 메일은 TEN:9 퀵 메이크업 프리토타입(MVP) 웹 페이지에서 자동 발송되었습니다.
    </p>
  </body>
</html>`;

    // ───────────────── 1) 고객에게 안내 메일 ─────────────────
    await transporter.sendMail({
      from: `"TEN:9 프리토타입" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "[TEN:9] 🚨 예약이 접수되지 않습니다",
      text:
        `${name}님, 안녕하세요.\n\n` +
        "이 메일은 실제 미용 서비스 예약 안내가 아니라,\n" +
        "서울대학교 벤처경영학과 「창조와 혁신」 수업에서 진행 중인\n" +
        "TEN:9 퀵 메이크업 서비스 아이디어의 프리토타입(MVP) 테스트용 안내 메일입니다.\n\n" +
        "이번 프로젝트가 좋은 반응을 얻으면, 향후 실제 서비스로 정식 출시하는 것을 진지하게 검토할 예정입니다.\n" +
        "지금은 그 가능성을 확인하기 위한 일종의 수요조사 단계라고 봐주시면 됩니다. 🙌\n\n" +
        "특히 인스타그램에서 보신 TEN:9 관련 게시물/광고가 마음에 드셨다면,\n" +
        "해당 게시물에 좋아요와 긍정적인 댓글을 남겨주시면 정말 큰 힘이 됩니다. 💗\n\n" +
        "다만, 이 페이지가 수업용 테스트라는 점을 모르고 다른 분들이\n" +
        "‘가짜 예약 사이트’, ‘사기 서비스’로 오해할 수 있어,\n" +
        "SNS나 커뮤니티에서 그런 식으로 소문을 내기보다는\n" +
        "수업용 실험 프로젝트라는 점을 너그럽게 이해해 주시면 정말 감사하겠습니다. 🙏\n\n" +
        "따라서 아래 내용은 모두 ‘테스트용 입력 정보’이며,\n" +
        "실제 매장 예약, 시술, 결제, 방문 일정이 진행되지는 않습니다.\n\n" +
        "--- 프리토타입 페이지에서 남기신 내용 ---\n" +
        summaryText +
        "\n테스트에 참여해 주셔서 감사합니다.\n" +
        "서울대학교 벤처경영학과 TEN:9 팀 드림",
      html: userHtml,
    });

    // ───────────────── 2) 운영자(너)에게 알림 메일 ─────────────────
    await transporter.sendMail({
      from: `"TEN:9 프리토타입 알림" <${process.env.EMAIL_USER}>`,
      to: "makeup10min@gmail.com",
      subject: "[TEN:9 프리토타입] 새로운 테스트 응답이 도착했습니다",
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
