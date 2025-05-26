// app/api/track-visit/route.js
// 이 파일은 Edge Runtime 또는 Node.js Runtime에서 실행됩니다.
// 기본적으로 Node.js Runtime에서 실행됩니다.

import { supabase } from "../../../utils/supabaseClient"; // Supabase 클라이언트 경로 확인!
import { NextResponse } from "next/server"; // Next.js 13+의 서버 응답 객체

export async function POST(req) {
  // POST 요청을 처리하는 함수
  try {
    // 요청 바디 파싱
    const body = await req.json();

    // 1. 서버 측에서 직접 수집 가능한 정보
    // req.headers에서 직접 읽습니다.
    const ipAddress = req.headers.get("x-forwarded-for") || req.ip; // req.ip는 Vercel 배포 시 사용 가능
    const userAgent = req.headers.get("user-agent");
    const referrer = req.headers.get("referer") || "direct";
    const acceptLanguage = req.headers.get("accept-language");

    // 2. 클라이언트(프론트엔드)에서 전송된 정보
    const {
      visitorId,
      screenWidth,
      screenHeight,
      colorDepth,
      pixelRatio,
      timeZoneOffset,
      javaEnabled,
      cookiesEnabled,
      platform,
      plugins,
      pagePath,
      pageTitle,
      scrollDepth,
      clickEvents,
    } = body;

    const { data, error } = await supabase.from("visits").insert([
      {
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer,
        accept_language: acceptLanguage,
        visitor_id: visitorId,
        screen_width: screenWidth,
        screen_height: screenHeight,
        color_depth: colorDepth,
        pixel_ratio: pixelRatio,
        time_zone_offset: timeZoneOffset,
        java_enabled: javaEnabled,
        cookies_enabled: cookiesEnabled,
        platform: platform,
        plugins: plugins,
        page_path: pagePath,
        page_title: pageTitle,
        scroll_depth: scrollDepth,
        click_events: clickEvents,
      },
    ]);

    if (error) {
      console.error("Supabase 삽입 오류:", error);
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    }

    console.log("방문 정보 Supabase에 기록됨:", data);
    return NextResponse.json(
      { message: "Visit data recorded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error recording visit data:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
