// app/layout.tsx
import { ReactNode } from "react";
import "./globals.css";
import { getSession } from "next-auth/react";
import Providers from "./providers";

export const metadata = {
	title: "Inventory Manager by Eric Gitangu",
	description:
		"An advanced inventory management system utilizing AI-powered autocomplete and image recognition. Developed by Eric Gitangu.",
	metadataBase: new URL("https://developer.ericgitangu.com"),
	openGraph: {
		title: "Inventory Manager by Eric Gitangu",
		description:
			"An advanced inventory management system utilizing AI-powered autocomplete and image recognition. Developed by Eric Gitangu.",
		url: "https://developer.ericgitangu.com",
		siteName: "Inventory Manager by Eric Gitangu",
		images: [
			{
				url: "/logo.png",
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
		title: "Inventory Manager by Eric Gitangu",
		description:
			"An advanced inventory management system utilizing AI-powered autocomplete and image recognition. Developed by Eric Gitangu.",
		creator: "@ericgitangu",
		images: ["/logo.png"],
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
