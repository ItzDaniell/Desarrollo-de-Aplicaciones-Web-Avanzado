import { NextResponse} from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const author = await prisma.author.findUnique({
            where: { id: (await params).id },
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