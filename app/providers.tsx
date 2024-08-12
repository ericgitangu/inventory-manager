"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { InventoryProvider } from "./context/InventoryContext";

export default function Providers({
	session,
	children,
}: { session: Session | null; children: ReactNode }) {
	return (
		<SessionProvider session={session}>
			<ThemeProvider>
				<InventoryProvider>{children}</InventoryProvider>
			</ThemeProvider>
		</SessionProvider>
	);
}
