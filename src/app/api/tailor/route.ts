import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        // get the job description sent from front-end
        const { companyName, jobTitle, jobDescription } = await req.json();

        // check whether the job description is empty
        if (!jobDescription || jobDescription.trim().length === 0) {
            return NextResponse.json({ error: "Job Description is required" }, { status: 400 });
        }

        // fetch the saved resume
        const resume = await prisma.resume.findFirst();
        
        // build the prompt differently given on existed resume
        let promptContent : string;

        if (resume) {
            promptContent = `Here is a job description:\n${jobDescription}\n\nHere is my resume:\n${resume.content}\n\nFirst, extract the key requirements, skills, and qualifications from the job description as a flat bullet-point list. Then, separately, identify which points from my resume are most relevant to this specific job, and briefly suggest how to phrase or emphasize them to better match this posting. Format your response with two clear sections: "Key Requirements" and "Relevant Resume Points".`;
        } else {
            promptContent = `Extract the key requirements, skills, and qualifications from the following job description. Return ONLY a flat bullet-point list using "-" for each item, no headers, no categories, no bold text, no extra commentary.\n\nJob description:\n${jobDescription}`;
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
                    content: promptContent,
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
                companyName: companyName || "Unknown",
                jobTitle: jobTitle || "Unknown",
                jobDescription: jobDescription,
                result: extractedText,
            },
        });

        // send result back to frontend
        return NextResponse.json({ result: extractedText });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}