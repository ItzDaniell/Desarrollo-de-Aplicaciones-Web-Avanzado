import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const author = await prisma.author.findUnique({
      where: { id: (await params).id },
      select: { id: true, name: true },
    });

    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    const totalBooks = await prisma.book.count({ where: { authorId: author.id } });

    if (totalBooks === 0) {
      return NextResponse.json({
        authorId: author.id,
        authorName: author.name,
        totalBooks: 0,
        firstBook: null,
        latestBook: null,
        averagePages: 0,
        genres: [],
        longestBook: null,
        shortestBook: null,
      });
    }

    if (totalBooks === 1) {
      const only = await prisma.book.findFirst({
        where: { authorId: author.id },
        select: { title: true, publishedYear: true, pages: true, genre: true },
        orderBy: { publishedYear: 'asc' },
      });

      const averagePages = only?.pages ? Math.round(only.pages) : 0;
      const genres = only?.genre ? [only.genre] : [];

      return NextResponse.json({
        authorId: author.id,
        authorName: author.name,
        totalBooks,
        firstBook: only ? { title: only.title, year: only.publishedYear } : null,
        latestBook: only ? { title: only.title, year: only.publishedYear } : null,
        averagePages,
        genres,
        longestBook: only?.pages ? { title: only.title, pages: only.pages } : null,
        shortestBook: only?.pages ? { title: only.title, pages: only.pages } : null,
      });
    }

    const [
      firstBook,
      latestBook,
      avgPagesAgg,
      genresRaw,
      longestBook,
      shortestBook,
    ] = await Promise.all([
      prisma.book.findFirst({
        where: { authorId: author.id, publishedYear: { not: null } },
        orderBy: { publishedYear: 'asc' },
        select: { title: true, publishedYear: true },
      }),
      prisma.book.findFirst({
        where: { authorId: author.id, publishedYear: { not: null } },
        orderBy: { publishedYear: 'desc' },
        select: { title: true, publishedYear: true },
      }),
      prisma.book.aggregate({
        where: { authorId: author.id, pages: { not: null } },
        _avg: { pages: true },
      }),
      prisma.book.findMany({
        where: { authorId: author.id, genre: { not: null } },
        select: { genre: true },
        distinct: ['genre'],
        orderBy: { genre: 'asc' },
      }),
      prisma.book.findFirst({
        where: { authorId: author.id, pages: { not: null } },
        orderBy: { pages: 'desc' },
        select: { title: true, pages: true },
      }),
      prisma.book.findFirst({
        where: { authorId: author.id, pages: { not: null } },
        orderBy: { pages: 'asc' },
        select: { title: true, pages: true },
      }),
    ]);

    const averagePages = avgPagesAgg._avg.pages ? Math.round(avgPagesAgg._avg.pages) : 0;
    const genres = genresRaw.map(g => g.genre!) as string[];

    return NextResponse.json({
      authorId: author.id,
      authorName: author.name,
      totalBooks,
      firstBook: firstBook
        ? { title: firstBook.title, year: firstBook.publishedYear }
        : null,
      latestBook: latestBook
        ? { title: latestBook.title, year: latestBook.publishedYear }
        : null,
      averagePages,
      genres,
      longestBook: longestBook
        ? { title: longestBook.title, pages: longestBook.pages }
        : null,
      shortestBook: shortestBook
        ? { title: shortestBook.title, pages: shortestBook.pages }
        : null,
    });
  } catch (error) {
    console.error("Error fetching author stats:", error);
    return NextResponse.json({ error: 'Failed to fetch author stats' }, { status: 500 });
  }
}
