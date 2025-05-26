// app/layout.js
import "./globals.css";
import Tracker from "@/components/Tracker"; // Tracker 컴포넌트 임포트

export const metadata = {
  title: "Next.js Tracking App",
  description: "Track user visits with Next.js App Router",
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
