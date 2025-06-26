// app/scan/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import Link from "next/link";

interface Book {
  id: string;
  isbn: string;
  title: string;
  author?: string;
  publisher?: string;
  imageUrl?: string;
  checkoutCount: number;
}

export default function JanScanner() {
  const [janCode, setJanCode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkoutBook, setCheckoutBook] = useState<Book | null>(null);
  const [showError, setShowError] = useState(false);

  const { ref } = useZxing({
    onDecodeResult(result) {
      const code = result.getText();
      // 処理中でない場合のみ新しいスキャンを処理
      if (!isProcessing && code !== janCode) {
        setJanCode(code);
        handleCheckout(code);
      }
    },
    // 背面カメラを使用するための制約
    constraints: {
      video: {
        facingMode: "environment",
      },
    },
  });

  useEffect(() => {
    console.log("ScanPage mounted");
  }, []);

  const handleClosePopup = () => {
    setShowSuccess(false);
    setIsProcessing(false);
    setJanCode(null);
    setCheckoutBook(null);
  };

  const handleCloseError = () => {
    setShowError(false);
    setIsProcessing(false);
    setJanCode(null);
  };

  const handleCheckout = async (isbn: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isbn }),
      });

      if (response.ok) {
        const data = await response.json();
        setCheckoutBook(data.book);
        setShowSuccess(true);
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setShowError(true);
    }
  };

  return (
    <div style={{ textAlign: "center", width: "100%", maxWidth: 1000, margin: "0 auto", position: "relative", paddingTop: "30px" }}>
      <div style={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid #ccc",
      }}>
        <video
          ref={ref}
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: "16 / 6",
            objectFit: "cover",
          }}
        />
        {/* スキャンエリアのガイドライン */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70%",
          height: "60%",
          border: "2px dashed rgba(255, 255, 255, 0.8)",
          borderRadius: 8,
          pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute",
            top: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "4px 12px",
            borderRadius: 4,
            fontSize: "14px",
            whiteSpace: "nowrap",
          }}>
            バーコードをここにあわせてね
          </div>
        </div>
      </div>
      <div style={{
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#f0f8ff",
        borderRadius: "10px",
        fontSize: "18px",
        fontWeight: "bold",
        color: "#333",
      }}>
        {janCode ? (
          <>
            <span style={{ fontSize: "24px", marginRight: "10px" }}>🎯</span>
            みつけた！ {janCode}
            <span style={{ fontSize: "24px", marginLeft: "10px" }}>📖</span>
          </>
        ) : (
          <>
            <div>
              <span style={{ fontSize: "24px", marginRight: "10px" }}>👀</span>
              バーコードをさがしてるよ...
              <span style={{ 
                display: "inline-block",
                animation: "bounce 1s infinite",
                fontSize: "24px",
                marginLeft: "10px"
              }}>🔍</span>
            </div>
            <div style={{ 
              fontSize: "14px", 
              color: "#666", 
              marginTop: "8px" 
            }}>
              9からはじまるバーコードをみつけてね
            </div>
            <style jsx>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
            `}</style>
          </>
        )}
      </div>

      {/* 成功ポップアップ */}
      {showSuccess && checkoutBook && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          zIndex: 1000,
          textAlign: "center",
          minWidth: "300px",
          animation: "popIn 0.3s ease-out",
        }}>
          <style jsx>{`
            @keyframes popIn {
              0% {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0;
              }
              100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
              }
            }
          `}</style>
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>
            📚✨
          </div>
          <h2 style={{ color: "#4CAF50", marginBottom: "15px", fontSize: "24px" }}>
            かしだしできたよ！
          </h2>
          <div style={{ marginBottom: "10px" }}>
            <strong>{checkoutBook.title}</strong>
          </div>
          {checkoutBook.author && (
            <div style={{ color: "#666", marginBottom: "10px" }}>
              かいたひと: {checkoutBook.author}
            </div>
          )}
          <div style={{ color: "#999", fontSize: "14px" }}>
            これまでかりたかいすう: {checkoutBook.checkoutCount}回
          </div>
          <div style={{ marginTop: "20px", fontSize: "20px" }}>
            🎉 たのしいどくしょを！ 🎉
          </div>
          <button
            onClick={handleClosePopup}
            style={{
              marginTop: "20px",
              padding: "10px 30px",
              fontSize: "18px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"}
          >
            OK
          </button>
        </div>
      )}
      
      {/* エラーポップアップ */}
      {showError && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          zIndex: 1000,
          textAlign: "center",
          minWidth: "300px",
          animation: "popIn 0.3s ease-out",
        }}>
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>
            😅📚
          </div>
          <h2 style={{ color: "#FF6B6B", marginBottom: "15px", fontSize: "22px" }}>
            あれれ？みつからなかったよ
          </h2>
          <div style={{ color: "#666", marginBottom: "20px", fontSize: "16px" }}>
            ほんのバーコードを<br />
            もういちどスキャンしてみてね！
          </div>
          <div style={{ fontSize: "20px", marginBottom: "20px" }}>
            🔄 もういっかい！ 🔄
          </div>
          <button
            onClick={handleCloseError}
            style={{
              padding: "10px 30px",
              fontSize: "18px",
              backgroundColor: "#FF6B6B",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FF5252"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FF6B6B"}
          >
            やりなおす
          </button>
        </div>
      )}
      
      {/* オーバーレイ */}
      {(showSuccess || showError) && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 999,
        }} />
      )}
      
      {/* トップページへ戻るリンク */}
      <div style={{ marginTop: "80px", paddingBottom: "40px" }}>
        <Link href="/" style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#2196F3",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1976D2"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2196F3"}
        >
          🏠 トップページへもどる
        </Link>
      </div>
    </div>
  );
}
