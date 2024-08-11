import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
	try {
		const { itemName } = await req.json();

		if (!itemName) {
			return NextResponse.json(
				{ error: "Item name is required" },
				{ status: 400 },
			);
		}

		const response = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"You are an assistant providing detailed descriptions and categories of inventory items.",
				},
				{
					role: "user",
					content: `Provide a detailed description and category of the item: ${itemName}`,
				},
			],
			max_tokens: 150,
		});

		const descriptionText =
			response.choices && response.choices[0]?.message?.content?.trim();
		// You may need to adjust this to parse the specific response format you get from OpenAI
		return NextResponse.json({ description: descriptionText });
	} catch (error) {
		console.error(
			"Error fetching description and category from OpenAI:",
			error,
		);
		return NextResponse.json(
			{ error: "Error fetching description and category" },
			{ status: 500 },
		);
	}
}
