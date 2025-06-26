import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { isbn } = await req.json();

    if (!isbn) {
      return NextResponse.json({ error: 'ISBN is required' }, { status: 400 });
    }

    // 書籍情報を取得（存在しない場合はOpenBDから取得）
    const bookResponse = await fetch(`${req.nextUrl.origin}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isbn }),
    });

    if (!bookResponse.ok) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const book = await bookResponse.json();

    // 貸出処理
    const [updatedBook, checkout] = await prisma.$transaction([
      prisma.book.update({
        where: { id: book.id },
        data: {
          checkoutCount: { increment: 1 },
          lastCheckout: new Date(),
        },
      }),
      prisma.checkout.create({
        data: {
          bookId: book.id,
        },
      }),
    ]);

    return NextResponse.json({
      book: updatedBook,
      checkout,
      message: '貸し出しが完了しました！',
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Error processing checkout' }, { status: 500 });
  }
}