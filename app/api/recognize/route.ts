import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
	apiKey: process.env["OPENAI_API_KEY"],
});

export async function POST(req: NextRequest) {
	const { query } = await req.json();

	if (!query) {
		return NextResponse.json({ error: "Query is required" }, { status: 400 });
	}

	try {
		const response = await client.chat.completions.create({
			model: "gpt-4", // Specify the model correctly
			messages: [
				{ role: "system", content: "You are a helpful assistant." },
				{ role: "user", content: `Find items for: ${query}` },
			],
			max_tokens: 50,
			n: 5,
			stop: ["\n"],
		});

		const suggestions = response.choices.map((choice: any) =>
			choice.message.content.trim(),
		);

		return NextResponse.json({ suggestions }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Error fetching autocomplete suggestions" },
			{ status: 500 },
		);
	}
}
