import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const author = await prisma.author.findUnique({
            where: { id },
        })

        if (!author) {
            return NextResponse.json(
                { error: "Author not found" },
                { status: 404 }
            );
        }

        const books = await prisma.book.findMany({
            where: { authorId: author.id },
            orderBy: { publishedYear: 'desc' },
        });

        return NextResponse.json({
            author: {
                id: author.id,
                name: author.name,
            },
            totalbooks: books.length,
            books,
        })
    } catch (error) {
        console.error("Error fetching author's books:", error);
        return NextResponse.json({ error: "Failed to fetch author's books" }, { status: 500 });
    }
}