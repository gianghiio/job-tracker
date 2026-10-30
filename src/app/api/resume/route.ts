import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse.js";
import { auth } from "@clerk/nextjs/server";

const MAX_SIZE = 4 * 1024 * 1024;

// sections to look for, and the words that identify each heading
const SECTIONS: { name: string; pattern: RegExp }[] = [
    { name: "Summary", pattern: /summary|profile|objective/i },
    { name: "Skills", pattern: /skills/i },
    { name: "Experience", pattern: /experience|employment/i },
    { name: "Projects", pattern: /projects?/i },
    { name: "Education", pattern: /education/i },
];

function findSections(content: string): string[] {
    const shortLines = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && line.length <= 40);

    return SECTIONS
        .filter((section) => shortLines.some((line) => section.pattern.test(line)))
        .map((section) => section.name);
}

export async function POST(req: NextRequest) {
    try {
        // Get the logged-in user's id
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" }, 
                { status: 401 }
            );
        }
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

        // reject files over 4 MB 
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                {error: "File is too large - Keep it under 4 MB"},
                {status: 413}
            )
        }

        // convert the uploaded file into a Buffer, which pdf-parse needs
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // extract plain text from the PDF
        const data = await pdf(buffer);
        const extractedText = data.text;

        // scanned PDFs have no text to read
        if (!extractedText.trim()) {
            return NextResponse.json(
                { error: "Couldn't read any text from this PDF. Try one exported from Word or Google Docs." },
                { status: 422 }
            );
        }

        // update this user's resume if they have one, otherwise create it
        await prisma.resume.upsert({
            where: { userId },
            update: { content: extractedText, uploadedAt: new Date() },
            create: { content: extractedText, userId },
        });

        // the page doesn't read anything else, and this keeps resume text out of the response
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error processing resume upload", error);
        return NextResponse.json(
            {error: "Failed to process resume"},
            {status: 500}
        )
    }
}

// Get the specific resume based on logged in user
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" }, 
                { status: 401 }
            );
        }

        const resume = await prisma.resume.findUnique({ where: { userId } });

        if (!resume) {
            return NextResponse.json(
                { resume: null }
            );
        }

        return NextResponse.json({ 
            resume: { 
                uploadedAt: resume.uploadedAt,
                sections: findSections(resume.content),
            }
        });
    } catch (error) {
        console.error("Error loading resume", error);
        return NextResponse.json(
            {error: "Failed to load resume"},
            {status: 500}
        )
    }
}