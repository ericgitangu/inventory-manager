import { NextRequest, NextResponse } from "next/server";
import VisionClient from "@google-cloud/vision";
import OpenAI from "openai";
import fs from "fs";
import os from "os";
import path from "path";

// Decode and save the Google credentials to a temporary file
const credentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credentialsBase64) {
    throw new Error("Environment variable GOOGLE_APPLICATION_CREDENTIALS_BASE64 is not set.");
}

const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf8');
const credentialsPath = path.join(os.tmpdir(), 'google-credentials.json');

fs.writeFileSync(credentialsPath, credentialsJson);

// Initialize the Google Vision client
const visionClient = new VisionClient.ImageAnnotatorClient({
    keyFilename: credentialsPath,
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

        // Ensure client and method availability
        if (!visionClient || typeof visionClient.objectLocalization !== "function") {
            console.error("Google Vision client is not initialized or invalid.");
            return NextResponse.json(
                { error: "Google Vision client is not available" },
                { status: 500 },
            );
        }

        // Call Google Vision API for object localization
        const [result] = await visionClient.objectLocalization({
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
                    { role: "system", content: "You are a helpful assistant for classifying items." },
                    { role: "user", content: `Please list only the categories, separated by commas, for the following item: ${itemName}` },
                ],
                max_tokens: 50,
            });

            // Extract the content from the OpenAI response
            const rawCategories = openaiResponse?.choices[0]?.message?.content ?? "Uncategorized";

            // Convert the raw categories into a structured format
            const category = rawCategories
                .split(',')
                .map(category => category.trim())
                .join('/');

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
    } finally {
        // Clean up the temporary credentials file after use
        fs.unlinkSync(credentialsPath);
    }
}
