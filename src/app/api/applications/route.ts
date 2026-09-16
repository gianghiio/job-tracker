import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // fetch all applications by newest
        const applications = await prisma.jobApplication.findMany({
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