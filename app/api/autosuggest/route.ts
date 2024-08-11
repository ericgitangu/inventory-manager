import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const query = searchParams.get("query");

	if (!query) {
		return NextResponse.json({ suggestions: [] });
	}

	try {
		// Request OpenAI to generate suggestions based on the query
		const response = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"You are an assistant providing autosuggestions for inventory items.",
				},
				{
					role: "user",
					content: `Provide a list of items related to: ${query}`,
				},
			],
			max_tokens: 50,
			n: 1,
			stop: ["\n"],
		});

		// Extract the suggestions from OpenAI's response
		const suggestionsText =
			response.choices?.[0]?.message?.content?.trim() || "";
		const suggestions = suggestionsText.split(",").map((s) => s.trim());

		return NextResponse.json({ suggestions });
	} catch (error) {
		console.error("Error fetching suggestions from OpenAI:", error);
		return NextResponse.json(
			{ error: "Error fetching suggestions" },
			{ status: 500 },
		);
	}
}
