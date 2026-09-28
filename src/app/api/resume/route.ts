import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse.js";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    // Get the logged-in user's id
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" }, 
            { status: 401 }
        );
    }
    try {
        // read the incoming FormData
        const formData = await req.formData();
        const file = formData.get("resume") as File | null;

        if (!file) {
            return NextResponse.json(
                {error: "No file uploaded"},
                {status: 400}
            )
        }

        // check whether the uploaded file is not PDF
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                {error: "Only PDF files are supported"},
                {status: 400}
            )
        }

        // convert the uploaded file into a Buffer, which pdf-parse needs
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // extract plain text from the PDF
        const data = await pdf(buffer);
        const extractedText = data.text;
        console.log(extractedText);

        // update this user's resume if they have one, otherwise create it
        await prisma.resume.upsert({
            where: { userId },
            update: { content: extractedText, uploadedAt: new Date() },
            create: { content: extractedText, userId },
        });

        return NextResponse.json(
            { success: true, preview: extractedText.slice(0, 300) }
        );

    } catch (error) {
        console.error("Error processing resume upload", error);
        return NextResponse.json(
            {error: "Failed to process resume"},
            {status: 500}
        )
    }
}