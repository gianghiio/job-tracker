import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        // get the job description sent from front-end
        const { jobDescription } = await req.json();

        // check whether the job description is empty
        if (!jobDescription || jobDescription.trim().length === 0) {
            return NextResponse.json({ error: "Job Description is required" }, { status: 400 });
        }

        // fetch Claude API
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.ANTHROPIC_API_KEY!, // secret key, server-only
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 1000,
                messages: [{
                    role: "user",
                    content: `Extract key requirements from:\n${jobDescription}`,
                }],
            }),
        });

        // If API fetching is failed
        if (!response.ok) {
            console.error("Anthropic API error", await response.text());
            return NextResponse.json({ error: "Failed to reach Claude API" }, { status: 500 });
        }

        const data = await response.json();
        // pull out the reply text
        const extractedText = data.content?.[0]?.text ?? "No response text found";

        // save this analysis to the database
        await prisma.jobApplication.create({
            data: {
                companyName: "Unknown",
                jobTitle: "Unknown",
                jobDescription: jobDescription,
            },
        });

        // send result back to frontend
        return NextResponse.json({ result: extractedText });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}