# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

図書館のバーコードリーダーを模したWeb Appで、子どもと遊ぶことを目的としています。スマートフォンでの利用を基本想定しており、バーコードをスキャンすることで図書館での貸出をシミュレートします。

### 主な機能
- バーコードスキャンによる書籍の「貸出」処理
- 「貸し出し完了」を可愛い絵文字付きのポップアップで表示
- 貸出回数のカウント機能
- トップページに最近借りた本のトップ3を表示

## 開発コマンド

```bash
# 開発サーバーの起動（Turbopackを使用）
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm run start

# ESLintの実行
npm run lint

# Prismaマイグレーションの実行
npx prisma migrate dev

# Prisma Studioの起動（データベースGUI）
npx prisma studio

# Prismaクライアントの生成
npx prisma generate
```

## アーキテクチャ概要

### 技術スタック
- **Next.js 15.3.2** - Turbopackを使用した高速開発環境
- **TypeScript** - 型安全な開発（strict: false設定）
- **Prisma** - PostgreSQLデータベースのORM
- **Tailwind CSS v4** - スタイリング
- **react-zxing** - バーコードスキャン機能

### データベース構造
- **Book**モデル: ISBN、タイトル、著者、出版社、画像URL、貸出回数、最終貸出日時を管理
- **Checkout**モデル: 個別の貸出履歴を記録
- PostgreSQL接続（DATABASE_URL環境変数が必要）

### 主要コンポーネント

1. **書籍API（/api/books/route.ts）**
   - ISBNを受け取り、OpenBD APIから書籍情報を自動取得
   - データベースへの保存・検索機能

2. **バーコードスキャナー（/scan/page.tsx）**
   - カメラを使用したリアルタイムJAN/ISBNコードスキャン
   - react-zxingライブラリを使用

### 外部API
- **OpenBD API**: 日本の書籍情報を取得（`https://api.openbd.jp/v1/get`）

## 開発時の注意点

### 環境変数
DATABASE_URL設定が必要です。PostgreSQLの接続情報を.envファイルに設定してください。

### TypeScript設定
strict: falseに設定されているため、型チェックは緩やかです。新規コードでは可能な限り型安全性を保つようにしてください。

### データベース操作
Prismaを使用しているため、スキーマ変更時は必ず以下を実行してください：
1. `npx prisma migrate dev` - マイグレーション作成
2. `npx prisma generate` - クライアント再生成