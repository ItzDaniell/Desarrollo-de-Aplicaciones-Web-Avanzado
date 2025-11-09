import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

const SORTABLE_FIELDS = new Set(['title', 'publishedYear', 'createdAt']);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search')?.trim();
    const genre = searchParams.get('genre')?.trim();
    const authorName = searchParams.get('authorName')?.trim();

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);

    const sortByParam = (searchParams.get('sortBy') || 'createdAt').trim();
    const orderParam = (searchParams.get('order') || 'desc').trim().toLowerCase();

    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limitBase = Number.isNaN(limitParam) || limitParam < 1 ? 10 : limitParam;
    const limit = Math.min(limitBase, 50);

    const sortBy = SORTABLE_FIELDS.has(sortByParam) ? (sortByParam as 'title' | 'publishedYear' | 'createdAt') : 'createdAt';
    const order: 'asc' | 'desc' = orderParam === 'asc' ? 'asc' : 'desc';

    const AND: Prisma.BookWhereInput[] = [];
    if (search) {
      AND.push({ title: { contains: search, mode: 'insensitive' } });
    }
    if (genre) {
      AND.push({ genre });
    }
    if (authorName) {
      AND.push({ author: { name: { contains: authorName, mode: 'insensitive' } } });
    }

    const where: Prisma.BookWhereInput = AND.length ? { AND } : {};

    const [total, data] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error searching books:', error);
    return NextResponse.json({ error: 'Failed to search books' }, { status: 500 });
  }
}
