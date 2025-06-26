
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// OpenBD APIから書籍情報を取得する関数
async function getBookInfoFromOpenBD(isbn: string) {
  try {
    const response = await fetch(`https://api.openbd.jp/v1/get?isbn=${isbn}`);
    const data = await response.json();
    if (data && data[0] && data[0].summary) {
      const summary = data[0].summary;
      return {
        isbn: summary.isbn,
        title: summary.title,
        author: summary.author,
        publisher: summary.publisher,
        imageUrl: summary.cover,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching book info from OpenBD:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { isbn } = await req.json();

    if (!isbn) {
      return NextResponse.json({ error: 'ISBN is required' }, { status: 400 });
    }

    // まずDBに書籍が存在するか確認
    let book = await prisma.book.findUnique({
      where: { isbn },
    });

    // DBに存在しない場合はOpenBDから取得してDBに保存
    if (!book) {
      const bookInfo = await getBookInfoFromOpenBD(isbn);
      if (bookInfo) {
        book = await prisma.book.create({
          data: bookInfo,
        });
      } else {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      }
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
