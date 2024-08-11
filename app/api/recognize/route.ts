import { NextRequest, NextResponse } from "next/server";
import vision from "@google-cloud/vision";

// Initialize the Google Vision client
const client = new vision.ImageAnnotatorClient();

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

		if (!image) {
			return NextResponse.json(
				{ error: "Image data is required" },
				{ status: 400 },
			);
		}

		// Remove the prefix of the base64 string, if it exists
		const base64Image = image.replace(/^data:image\/png;base64,/, "");
		const buffer = Buffer.from(base64Image, "base64");

		// Call Google Vision API for object localization
		const [result] =
			(await client?.objectLocalization({ image: { content: buffer } })) ?? [];
		if (!result) {
			return NextResponse.json(
				{ error: "No result from Vision API" },
				{ status: 500 },
			);
		}

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

			// Additional logic to determine the category (you can refine this)
			const category = "Uncategorized"; // Default category
			const description = `This is a recognized item: ${itemName}`;

			const response: ImageRecognitionResponse = {
				name: itemName,
				description,
				category,
			};

			return NextResponse.json(response);
		} else {
			return NextResponse.json(
				{ error: "No recognizable objects found" },
				{ status: 400 },
			);
		}
	} catch (error) {
		console.error("Error recognizing image:", error);
		return NextResponse.json(
			{ error: "Error processing image" },
			{ status: 500 },
		);
	}
}
