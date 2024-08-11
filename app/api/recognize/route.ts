import { NextRequest, NextResponse } from "next/server";
import VisionClient from "@google-cloud/vision";
import OpenAI from "openai";

// Decode the Base64-encoded credentials and use them directly
const credentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;

if (!credentialsBase64) {
	throw new Error(
		"Environment variable GOOGLE_APPLICATION_CREDENTIALS_BASE64 is not set.",
	);
}

const credentialsJson = Buffer.from(credentialsBase64, "base64").toString(
	"utf8",
);

// Initialize the Google Vision client in memory
const visionClient = new VisionClient.ImageAnnotatorClient({
	credentials: JSON.parse(credentialsJson),
});

// Initialize the OpenAI client
const openaiClient = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Define interfaces for the request and response
interface ImageRecognitionRequest {
	image: string;
}

interface ImageRecognitionResponse {
	name: string;
	description: string;
	category: string;
}

interface ErrorResponse {
	error: string;
}

export async function POST(
	req: NextRequest,
): Promise<NextResponse<ImageRecognitionResponse | ErrorResponse>> {
	try {
		const { image }: ImageRecognitionRequest = await req.json();

		// Validate input
		if (!image) {
			return NextResponse.json(
				{ error: "Image data is required" },
				{ status: 400 },
			);
		}

		// Remove the prefix of the base64 string, if it exists
		const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
		const buffer = Buffer.from(base64Image, "base64");

		if (buffer.length === 0) {
			return NextResponse.json(
				{ error: "Invalid image buffer provided" },
				{ status: 400 },
			);
		}
		// Ensure visionClient and its method are defined
		if (!visionClient || !visionClient.objectLocalization) {
			throw new Error(
				"visionClient or its method objectLocalization is not defined",
			);
		}

		// Call Google Vision API for object localization
		const [result] = await visionClient?.objectLocalization({
			image: { content: buffer },
		});

		if (!result) {
			return NextResponse.json(
				{ error: "No result from Vision API" },
				{ status: 500 },
			);
		}

		const labels = result.localizedObjectAnnotations ?? [];

		if (labels.length > 0) {
			// Use the first detected object as the item's name, with a fallback
			const itemName = labels[0]?.name ?? "Unknown Item";

			// Use OpenAI to categorize the item
			const openaiResponse = await openaiClient.chat.completions.create({
				model: "gpt-4",
				messages: [
					{
						role: "system",
						content: "You are a helpful assistant for classifying items.",
					},
					{
						role: "user",
						content: `Please list only the categories, separated by commas, for the following item: ${itemName}`,
					},
				],
				max_tokens: 50,
			});

			// Extract the content from the OpenAI response
			const rawCategories =
				openaiResponse?.choices[0]?.message?.content ?? "Uncategorized";

			// Convert the raw categories into a structured format
			const category = rawCategories
				.split(",")
				.map((category) => category.trim())
				.join("/");

			const description = ` ${itemName}`;

			const response: ImageRecognitionResponse = {
				name: itemName,
				description,
				category,
			};

			return NextResponse.json(response, { status: 200 });
		} else {
			return NextResponse.json(
				{ error: "No recognizable objects found" },
				{ status: 400 },
			);
		}
	} catch (error) {
		console.error(
			"Error calling Google Vision API:",
			(error as Error).message || error,
		);
		return NextResponse.json(
			{ error: "An error occurred while processing the image" },
			{ status: 500 },
		);
	}
}
