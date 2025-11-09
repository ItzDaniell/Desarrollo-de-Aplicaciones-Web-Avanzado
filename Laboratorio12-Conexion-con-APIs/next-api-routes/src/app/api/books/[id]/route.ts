import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const book = await prisma.book.findUnique({
            where: { id: (await params).id },
            include: {
                author: true,
            },
        });
        if (!book) {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { title, description, isbn, publishedYear, genre, pages, authorId } = body;

        if (title && title.length < 3) {
            return NextResponse.json(
                { error: "Title must be at least 3 characters long" },
                { status: 400 }
            )
        }

        if (pages && pages < 1) {
            return NextResponse.json(
                { error: "Pages must be a positive number" },
                { status: 400 }
            )
        }

        if (authorId) {
            const authorExists = await prisma.author.findUnique({
                where: { id: authorId },
            });
            if (!authorExists) {
                return NextResponse.json(
                    { error: "Author not found" },
                    { status: 404 }
                );
            }
        }

        const book = await prisma.book.update({
            where: { id: (await params).id },
            data: {
                title,
                description,
                isbn,
                publishedYear: publishedYear ? parseInt(publishedYear) : null,
                genre,
                pages: pages ? parseInt(pages) : null,
                authorId,
            },
            include: {
                author: true,
            }
        });

        return NextResponse.json(book);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            );
        }
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "ISBN must be unique" },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.book.delete({
            where: { id: (await params).id },
        });
        return NextResponse.json({ message: "Book deleted successfully" });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
    }
}