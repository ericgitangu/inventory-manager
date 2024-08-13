import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === "POST") {
		const { message } = req.body;

		// Log the received request
		console.log("Received request with message:", message);

		try {
			const startTime = Date.now(); // Start time for request timing

			const completion = await openai.chat.completions.create({
				model: "gpt-4",
				messages: [
					{
						role: "system",
						content: "You are a helpful assistant for managing inventory.",
					},
					{ role: "user", content: message },
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

			res.status(200).json({ reply });
		} catch (error) {
			// Log error details
			console.error("Error with OpenAI API:", (error as Error).message);
			console.error("Stack trace:", (error as Error).stack);

			res.status(500).json({ error: "Failed to get a response from the AI." });
		}
	} else {
		console.warn("Method not allowed. Received method:", req.method);
		res.status(405).json({ error: "Method not allowed" });
	}
}
