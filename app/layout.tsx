// app/layout.tsx
import { ReactNode } from "react";
import "./globals.css";
import { getSession } from "next-auth/react";
import Providers from "./providers";

export const metadata = {
	title: "InvenAI - An AI-Powered Inventory Manager.",
	description:
		"An advanced inventory management system utilizing AI-powered autocomplete and image recognition. Developed by Eric Gitangu.",
	metadataBase: new URL("https://developer.ericgitangu.com"),
	Author: "Eric Gitangu",
	openGraph: {
		title: "InvenAI - An AI-Powered Inventory Manager.",
		description:
			"An advanced inventory management system utilizing AI-powered autocomplete and image recognition. Developed by Eric Gitangu.",
		url: "https://developer.ericgitangu.com",
		author: "Eric Gitangu",
		siteName: "InvenAI - An AI-Powered Inventory Manager.",
		images: [
			{
				url: "https://inventory-manager-deveric.vercel.app/_next/image?url=%2Flogo.png&w=256&q=75",
				width: 800,
				height: 600,
				alt: "Inventory Manager Logo",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "InvenAI - An AI-Powered Inventory Manager.",
		author: "Eric Gitangu",
		description:
			"An advanced inventory management system utilizing AI-powered autocomplete and image recognition. Developed by Eric Gitangu.",
		creator: "@ericgitangu",
		images: [
			"https://inventory-manager-deveric.vercel.app/_next/image?url=%2Flogo.png&w=256&q=75",
		],
	},
};

export default async function RootLayout({
	children,
}: { children: React.ReactNode }) {
	const session = await getSession();
	return (
		<html lang="en">
			<body>
				<Providers session={session}>{children}</Providers>
			</body>
		</html>
	);
}
