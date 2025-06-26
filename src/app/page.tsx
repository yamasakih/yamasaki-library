"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Book {
  id: string;
  isbn: string;
  title: string;
  author?: string;
  publisher?: string;
  imageUrl?: string;
  checkoutCount: number;
  lastCheckout?: string;
  recentCheckouts?: number;
}

interface Stats {
  popularBooks: Book[];
  recentNewBooks: Book[];
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px", fontSize: "20px" }}>
        📚 よみこみちゅう...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* ウェルカムメッセージ */}
      <div style={{
        textAlign: "center",
        marginBottom: "40px",
        padding: "30px",
        backgroundColor: "#f0f8ff",
        borderRadius: "15px",
      }}>
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          📚 やまさきとしょかんへようこそ！ 📚
        </h1>
        <p style={{ fontSize: "18px", color: "#666" }}>
          すきなほんをみつけよう！
        </p>
        <Link href="/scan" style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 30px",
          backgroundColor: "#FF6B6B",
          color: "white",
          textDecoration: "none",
          borderRadius: "25px",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          🔍 バーコードでほんをさがす
        </Link>
      </div>

      {/* 人気の本セクション */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{
          fontSize: "24px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <span>🏆</span>
          2しゅうかんでいちばんよまれたほん
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          {stats?.popularBooks.map((book, index) => (
            <div key={book.id} style={{
              backgroundColor: "#fff",
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute",
                top: "-15px",
                left: "15px",
                backgroundColor: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32",
                color: "white",
                padding: "5px 15px",
                borderRadius: "20px",
                fontSize: "18px",
                fontWeight: "bold",
              }}>
                {index + 1}い
              </div>
              <h3 style={{ marginTop: "10px", fontSize: "18px", marginBottom: "10px" }}>
                {book.title}
              </h3>
              {book.author && (
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "10px" }}>
                  かいたひと: {book.author}
                </p>
              )}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "15px",
                fontSize: "14px",
              }}>
                <span style={{ color: "#FF6B6B", fontWeight: "bold" }}>
                  2しゅうかんで {book.recentCheckouts}かい
                </span>
                <span style={{ color: "#999" }}>
                  ぜんぶで {book.checkoutCount}かい
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 最近新しく読まれた本セクション */}
      <section>
        <h2 style={{
          fontSize: "24px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <span>✨</span>
          さいきんあたらしくよまれたほん
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}>
          {stats?.recentNewBooks.map((book) => (
            <div key={book.id} style={{
              backgroundColor: "#fff",
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute",
                top: "-12px",
                right: "15px",
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "3px 12px",
                borderRadius: "15px",
                fontSize: "12px",
                fontWeight: "bold",
              }}>
                はじめて！
              </div>
              <h3 style={{ marginTop: "10px", fontSize: "18px", marginBottom: "10px" }}>
                {book.title}
              </h3>
              {book.author && (
                <p style={{ color: "#666", fontSize: "14px" }}>
                  かいたひと: {book.author}
                </p>
              )}
              {book.lastCheckout && (
                <p style={{ color: "#999", fontSize: "12px", marginTop: "10px" }}>
                  {new Date(book.lastCheckout).toLocaleDateString('ja-JP')} によまれたよ
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
