import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
	apiKey: process.env["OPENAI_API_KEY"],
});

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const query = searchParams.get("query");

		if (!query) {
			return NextResponse.json({ error: "Query is required" }, { status: 400 });
		}

		const response = await client.chat.completions.create({
			model: "gpt-4",
			messages: [
				{ role: "system", content: "You are a helpful assistant." },
				{ role: "user", content: `Find items for: ${query}` },
			],
			max_tokens: 50,
		});

		const suggestions = response.choices.map((choice: any) =>
			choice.message.content.trim(),
		);

		return NextResponse.json({ suggestions }, { status: 200 });
	} catch (error) {
		console.error("Error fetching autocomplete suggestions:", error);
		return NextResponse.json(
			{ error: "Error fetching autocomplete suggestions" },
			{ status: 500 },
		);
	}
}
