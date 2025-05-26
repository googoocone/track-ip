// app/page.js

// 이 컴포넌트는 기본적으로 서버 컴포넌트입니다.
// 클라이언트 측 JS가 필요한 경우 'use client' 지시어를 추가해야 하지만,
// 이 페이지 자체의 UI 렌더링에만 집중한다면 필요 없습니다.

export default function HomePage() {
  return (
    <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginTop: "30px" }}>
        <h2>페이지 이동 테스트</h2>
        <ul>
          <li>
            <a href="/about">About 페이지로 이동</a>
          </li>
          <li>
            <a href="/dashboard">Dashboard 페이지로 이동</a>
          </li>
        </ul>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>클릭 이벤트 테스트</h2>
        <button
          id="test-button-1"
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          클릭하세요 1
        </button>
        <button
          className="test-btn"
          style={{ padding: "10px 20px", fontSize: "16px", marginLeft: "10px" }}
        >
          클릭하세요 2
        </button>
        <p>
          여기도{" "}
          <span style={{ cursor: "pointer", textDecoration: "underline" }}>
            클릭해 보세요
          </span>
        </p>
      </div>
    </main>
  );
}
