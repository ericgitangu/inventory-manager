import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
	try {
		const { message } = await req.json();

		// Log the received request
		console.log("Received request with message:", message);

		// Fetch inventory data from the /api/inventory/items endpoint
		const inventoryResponse = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/inventory/items`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		const inventoryData = await inventoryResponse.json();

		// Log the fetched inventory data
		console.log("Fetched inventory data:", inventoryData);

		// Include the inventory data in the OpenAI prompt
		const startTime = Date.now(); // Start time for request timing

		const completion = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content: "You are a helpful assistant for managing inventory.",
				},
				{
					role: "user",
					content: `Inventory: ${JSON.stringify(inventoryData)}. ${message}`,
				},
			],
			max_tokens: 100,
		});

		const reply =
			completion.choices[0]?.message?.content ||
			"I'm not sure how to help with that.";

		// Log the AI's response
		console.log("AI response:", reply);

		const endTime = Date.now(); // End time for request timing
		console.log(`OpenAI API call took ${endTime - startTime}ms to complete.`);

		return NextResponse.json({ reply });
	} catch (error) {
		// Log error details
		console.error("Error with OpenAI API:", (error as Error).message);
		console.error("Stack trace:", (error as Error).stack);

		return NextResponse.json(
			{ error: "Failed to get a response from the AI." },
			{ status: 500 },
		);
	}
}

export async function GET() {
	return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
