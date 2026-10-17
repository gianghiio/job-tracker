import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // fetch all user's applications by newest
        const applications = await prisma.jobApplication.findMany({
            where: {userId},
            orderBy: {createdAt: "desc"},
        })

        return NextResponse.json({ applications });
    } catch (error) {
        console.error("Error loading applications", error);
        return NextResponse.json(
            {error: "Failed to fetch applications"},
            {status: 500}
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const {id} = await req.json();
        const result = await prisma.jobApplication.deleteMany({
            where: { id, userId },
        });

        if (result.count === 0) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error deleting application", error);
        return NextResponse.json(
            {error: "Failed to delete application"},
            {status: 500}
        )
    }
}