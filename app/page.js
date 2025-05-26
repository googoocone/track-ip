// app/page.js

// 이 컴포넌트는 기본적으로 서버 컴포넌트입니다.
// 클라이언트 측 JS가 필요한 경우 'use client' 지시어를 추가해야 하지만,
// 이 페이지 자체의 UI 렌더링에만 집중한다면 필요 없습니다.

export default function HomePage() {
  return (
    <main
      className="w-full h-[100vh] bg-black/80 flex items-center justify-center"
      style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}
    >
      <button className="text-white px-5 py-3 bg-black rounded-lg cursor-pointer">
        다운로드
      </button>
    </main>
  );
}
