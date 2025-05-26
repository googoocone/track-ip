// components/Tracker.js
"use client"; // 이 파일이 클라이언트 컴포넌트임을 Next.js에 명시

import { useEffect, useState, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // App Router용 useRouter 훅

const Tracker = () => {
  const router = useRouter();
  const [scrollDepth, setScrollDepth] = useState(0);
  const [clickEvents, setClickEvents] = useState([]);

  // `router.asPath` 변경 시 첫 렌더링을 구분하기 위한 ref
  const isInitialLoad = useRef(true);

  // 방문자 ID (쿠키 기반)를 가져오거나 새로 생성하는 함수
  const getVisitorId = useCallback(() => {
    let visitorId = Cookies.get("visitorId");
    if (!visitorId) {
      // 새로운 방문자 ID 생성 (간단한 랜덤 문자열)
      // 실제 프로덕션에서는 더 견고한 UUID 생성 라이브러리 (예: 'uuid')를 사용하는 것이 좋습니다.
      visitorId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      // 쿠키 설정: 1년 유효, HTTPS에서만 전송, SameSite=Lax (보안 및 CSRF 방지)
      Cookies.set("visitorId", visitorId, {
        expires: 365,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
    }
    return visitorId;
  }, []);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    const scrolled = window.scrollY;
    // 페이지 최하단까지 스크롤 시 100%로 보정하여 스크롤 깊이 계산
    const depth = Math.min(
      100,
      Math.round((scrolled / Math.max(1, fullHeight - windowHeight)) * 100)
    );
    setScrollDepth(depth);
  }, []);

  // 클릭 이벤트 핸들러
  const handleClick = useCallback((event) => {
    setClickEvents(
      (prevEvents) =>
        [
          ...prevEvents,
          {
            timestamp: new Date()
              .toLocaleString("sv-SE", { timeZone: "Asia/Seoul" })
              .replace(" ", "T"), // YYYY-MM-DDTHH:mm:ss 형식으로 변환
            target_tag: event.target.tagName, // 클릭된 요소의 HTML 태그 (DIV, BUTTON 등)
            target_id: event.target.id || null, // 클릭된 요소의 ID 속성
            target_class: event.target.className || null, // 클릭된 요소의 Class 속성
            target_text: event.target.innerText // 클릭된 요소 내부 텍스트 (최대 50자)
              ? event.target.innerText.substring(0, 50)
              : null,
            x_coord: event.clientX, // 화면 기준 X 좌표
            y_coord: event.clientY, // 화면 기준 Y 좌표
          },
        ].slice(-50) // 너무 많은 클릭 이벤트가 쌓이지 않도록 최근 50개만 유지
    );
  }, []);

  // --- 첫 페이지 로드 시 정보 전송 및 이벤트 리스너 등록 ---
  useEffect(() => {
    const visitorId = getVisitorId();

    // 초기 페이지 방문 시 수집할 데이터
    const dataToSend = {
      visitorId,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      timeZoneOffset: new Date().getTimezoneOffset(),
      javaEnabled: navigator.javaEnabled(),
      cookiesEnabled: navigator.cookieEnabled,
      platform: navigator.platform,
      // 브라우저 플러그인 정보 (모든 브라우저에서 동일하게 동작하지 않을 수 있음)
      plugins: Array.from(navigator.plugins).map((p) => ({
        name: p.name,
        description: p.description,
      })),
      pagePath: router.asPath, // 현재 페이지 경로 (초기 경로)
      pageTitle: document.title, // 현재 페이지 제목 (초기 제목)
      scrollDepth: 0, // 초기 스크롤 깊이
      clickEvents: [], // 초기 클릭 이벤트
    };

    // 서버의 API 라우트로 초기 방문 데이터 전송
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => console.log("Initial visit data sent to Supabase:", data))
      .catch((error) =>
        console.error("Error sending initial visit data:", error)
      );

    // 스크롤 및 클릭 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClick);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거 (클린업 함수)
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
    };
  }, []); // 빈 의존성 배열: 컴포넌트가 마운트될 때 한 번만 실행

  // --- 페이지 이동 (soft navigation) 감지 및 정보 전송 ---
  // router.asPath가 변경될 때마다 이 useEffect가 실행됩니다.
  // 이는 Next.js App Router에서 클라이언트 사이드 라우팅을 감지하는 일반적인 방법입니다.
  useEffect(() => {
    // 첫 렌더링 시에는 이 useEffect가 실행되지 않도록 건너뜀
    // (초기 방문 데이터는 위의 useEffect에서 이미 전송됨)
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const visitorId = getVisitorId();
    const pagePath = router.asPath;
    const pageTitle = document.title;

    // 페이지 이동 시 업데이트된 스크롤 깊이 및 클릭 이벤트를 전송
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        pagePath,
        pageTitle,
        scrollDepth, // 현재까지의 스크롤 깊이
        clickEvents, // 현재까지 수집된 클릭 이벤트
        // 이 외의 브라우저/기기 정보는 변경될 가능성이 낮으므로 다시 보내지 않습니다.
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Page change data sent to Supabase:", data);
        setScrollDepth(0); // 새 페이지에서 스크롤 깊이 초기화
        setClickEvents([]); // 새 페이지에서 클릭 이벤트 초기화
      })
      .catch((error) =>
        console.error("Error sending page change data:", error)
      );
  }, [router.asPath, scrollDepth, clickEvents, getVisitorId]); // router.asPath, scrollDepth, clickEvents, getVisitorId 변경 시 실행

  return null; // 이 컴포넌트는 UI를 렌더링하지 않으므로 null을 반환합니다.
};

export default Tracker;
