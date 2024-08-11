// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { InventoryProvider } from "./context/InventoryContext";

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
				url: "/path-to-your-logo.png",
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
		images: ["/path-to-your-logo.png"],
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<html lang="en">
				<InventoryProvider>{children}</InventoryProvider>
			</html>
		</ThemeProvider>
	);
}
