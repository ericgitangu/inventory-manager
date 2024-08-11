import { NextRequest, NextResponse } from "next/server";
import VisionClient from "@google-cloud/vision";

// Initialize the Google Vision client
const client = new VisionClient.ImageAnnotatorClient();

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

		// Ensure client and method availability
		if (!client || typeof client.objectLocalization !== "function") {
			console.error("Google Vision client is not initialized or invalid.");
			return NextResponse.json(
				{ error: "Google Vision client is not available" },
				{ status: 500 },
			);
		}

		// Call Google Vision API for object localization
		const [result] = await client.objectLocalization({
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

			// You can refine the logic for determining the category based on your needs
			const category = "Uncategorized";
			const description = `This is a recognized item: ${itemName}`;

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
