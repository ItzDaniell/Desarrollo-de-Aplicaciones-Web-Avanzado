import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parse } from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const genre = searchParams.get('genre');
        const authorId = searchParams.get('authorId');

        const books = await prisma.book.findMany({
            where: {
                ...(genre && { genre }),
                ...(authorId && { authorId }),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        return NextResponse.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, isbn, publishedYear, genre, pages, authorId } = body;

        if (!title || !authorId) {
            return NextResponse.json(
                { error: "Title and authorId are required" },
                { status: 400 }
            )
        }

        if (title.length < 3) {
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

        const authorExists = await prisma.author.findUnique({
            where: { id: authorId },
        });

        if (!authorExists) {
            return NextResponse.json(
                { error: "Author not found" },
                { status: 404 }
            );
        }

        const book = await prisma.book.create({
            data: {
                title,
                description,
                isbn,
                publishedYear: publishedYear ? parseInt(publishedYear) : null,
                genre,
                pages: pages ? parseInt(pages) : null,
                authorId
            },
            include: {
                author: true,
            }
        })

        return NextResponse.json(book, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "A book with this ISBN already exists" },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } 
}