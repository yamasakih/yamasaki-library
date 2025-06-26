"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header style={{
      backgroundColor: "#E3F2FD",
      borderBottom: "3px solid #64B5F6",
      padding: "15px 20px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      height: "70px",
      boxSizing: "border-box",
    }}>
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
      }}>
        {/* 左側: ホームアイコン */}
        <Link href="/" style={{
          textDecoration: "none",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#1565C0",
        }}>
          <span role="img" aria-label="本">📚</span>
          <span style={{
            fontSize: "16px",
            fontWeight: "bold",
          }}>
            やまさきとしょかん
          </span>
        </Link>

        {/* 右側: バーコードスキャンリンク */}
        {pathname !== "/scan" && (
          <Link href="/scan" style={{
            textDecoration: "none",
            backgroundColor: "#FF6B6B",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FF5252"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FF6B6B"}
          >
            <span role="img" aria-label="虫眼鏡">🔍</span>
            バーコードでさがす
          </Link>
        )}
      </div>
    </header>
  );
}
