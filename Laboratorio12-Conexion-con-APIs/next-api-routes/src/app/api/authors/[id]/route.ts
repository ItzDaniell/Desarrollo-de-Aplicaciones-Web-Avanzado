import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const author = await prisma.author.findUnique({
            where: { id: (await params).id },
            include: {
                books: {
                    orderBy: {
                        publishedYear: "desc"
                    }
                },
                _count: {
                    select: { books: true }
                }
            },
        });

        if (!author) {
            return NextResponse.json(
                { error: "Author not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(author);
    } catch (error) {
        console.error("Error fetching author:", error);
        return NextResponse.json({ error: "Failed to fetch author" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();

        const { name, email, bio, nationality, birthDate } = body;

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json(
                    { error: "Invalid email format" },
                    { status: 400 }
                );
            }
        }

        const author = await prisma.author.update({
            where: { id: (await params).id },
            data: {
                name,
                email,
                bio,
                nationality,
                birthYear: birthDate ? parseInt(birthDate) : null,
            },
            include: {
                books: true,
            },
        });
        return NextResponse.json(author);
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json(
                { error: "Author not found" },
                { status: 404 }
            );
        }

        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        await prisma.$transaction([
            prisma.book.deleteMany({ where: { authorId: id } }),
            prisma.author.delete({ where: { id } }),
        ]);
        return NextResponse.json({ message: "Author deleted successfully" });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json(
                { error: "Author not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}