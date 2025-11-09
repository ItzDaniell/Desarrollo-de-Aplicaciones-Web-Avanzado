import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const authors = await prisma.author.findMany({
            include: {
                books: true,
                _count: {
                    select : { books: true }
                }
            },
            orderBy: {
                name: "asc"
            }
        });
        return NextResponse.json(authors);
    } catch (error) {
        console.log("Error fetching authors:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, bio, nationality, birthDate } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 }
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        const author = await prisma.author.create({
            data: {
                name,
                email,
                bio,
                nationality,
                birthYear: birthDate ? new Date(birthDate).getFullYear() : null,
            },
            include:{
                books: true,
            }
        })
        return NextResponse.json(author, { status: 201 });
    } catch (error) {
        console.log("Error creating author:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { id, name, email, bio, nationality, birthDate } = body;

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            if (!emailRegex.test(email)) {
                return NextResponse.json(
                    { error: "Invalid email format" },
                    { status: 400 }
                )
            }
        }
        
        const author = await prisma.author.update({
            where: { id: (await params).id },
            data: {
                name,
                email,
                bio,
                nationality,
                birthYear: birthDate ? new Date(birthDate).getFullYear() : null,
            },
            include: {
                books: true,
            }
        });
        return NextResponse.json(author);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: "Author not found" },
                { status: 404 }
            )
        }
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 409 }
            )
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string },
}) {
    try {
        await prisma.author.delete({
            where: { id: (await params).id },
        })

        return NextResponse.json(
            { message: "Author deleted successfully" },
            { status: 200 }
        )
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: "Author not found" },
                { status: 404 }
            )
        }
        if (error.code === 'P2003') {
            return NextResponse.json(
                { error: "Cannot delete author with existing books" },
                { status: 409 }
            )
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
