import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse.js";

export async function POST(req: NextRequest) {
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

        // check if a resume already exists, update it instead of creating a duplicate
        const existingResume = await prisma.resume.findFirst();

        if (existingResume) {
            await prisma.resume.update({
                where: { id: existingResume.id },
                data: { content: extractedText },
            });
        } else {
            await prisma.resume.create({
                data: { content: extractedText },
            });
        }

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