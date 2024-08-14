"use client";

import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CircularProgress from "@mui/material/CircularProgress";
import { useSession, signOut } from "next-auth/react";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
	const router = useRouter();
	const [avatarUrl, setAvatarUrl] = useState<string>("");
	const { isDark, toggleTheme } = useTheme();
	const { data: session, status } = useSession();
	const [initialItems, setInitialItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const toggleSidebar = () => {
		setDrawerOpen(!drawerOpen);
	};

	// Fetch data from the API on client side
	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await fetch("/api/inventory/items");
				const data = await response.json();
				setInitialItems(data);
			} catch (error) {
				console.error("Failed to fetch items:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchItems();
	}, []);

	useEffect(() => {
		console.log("status", status);
		if (status === "authenticated") {
			setAvatarUrl(session?.user?.image || "");
		}
	}, [status]);

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<div style={{ textAlign: "center" }}>
					<CircularProgress />
					<Typography variant="h6" component="div" sx={{ mt: 2 }}>
						Loading...
					</Typography>
				</div>
			</div>
		);
	}

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						onClick={toggleSidebar}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						InvenAI
					</Typography>
					<IconButton color="inherit" onClick={toggleTheme}>
						{isDark ? <Brightness7Icon /> : <Brightness4Icon />}
					</IconButton>
					<Avatar
						alt={session?.user?.name || "InvenAI User Avatar"}
						src={avatarUrl || "/path-to-placeholder-avatar.jpg"}
					/>
				</Toolbar>
			</AppBar>
			<Sidebar
				isOpen={drawerOpen}
				toggleSidebar={toggleSidebar}
				handleLogout={() => {
					signOut();
				}}
			/>
			<Dashboard initialItems={initialItems} />
		</>
	);
}
