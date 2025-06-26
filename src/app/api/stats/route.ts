import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 2週間前の日付を計算
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // 2週間で最も読まれた本トップ3
    const popularBooks = await prisma.book.findMany({
      where: {
        checkouts: {
          some: {
            createdAt: {
              gte: twoWeeksAgo,
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            checkouts: {
              where: {
                createdAt: {
                  gte: twoWeeksAgo,
                },
              },
            },
          },
        },
      },
      orderBy: {
        checkouts: {
          _count: 'desc',
        },
      },
      take: 3,
    });

    // 最近新規に読まれた本3冊（初めて借りられた本）
    const recentNewBooks = await prisma.book.findMany({
      where: {
        checkoutCount: 1,
      },
      orderBy: {
        lastCheckout: 'desc',
      },
      take: 3,
    });

    return NextResponse.json({
      popularBooks: popularBooks.map(book => ({
        ...book,
        recentCheckouts: book._count.checkouts,
      })),
      recentNewBooks,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
  }
}