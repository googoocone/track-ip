// app/layout.js
import "./globals.css";
import Tracker from "@/components/Tracker"; // Tracker 컴포넌트 임포트

export const metadata = {
  title: "수아 폭로자료 모음",
  description: "폭로자료 모음",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Tracker />
      </body>
    </html>
  );
}
