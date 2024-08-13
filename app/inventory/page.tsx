"use client";

import React, { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CircularProgress from "@mui/material/CircularProgress";

export default function DashboardPage() {
	const { isDark, toggleTheme } = useTheme();
	const [initialItems, setInitialItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

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
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						InvenAI
					</Typography>
					<IconButton color="inherit" onClick={toggleTheme}>
						{isDark ? <Brightness7Icon /> : <Brightness4Icon />}
					</IconButton>
					<Avatar alt="User Avatar" src="/path-to-user-avatar.jpg" />
				</Toolbar>
			</AppBar>
			<Dashboard initialItems={initialItems} />
		</>
	);
}
