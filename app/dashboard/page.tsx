"use client";
import React from "react";
import Dashboard from "../components/Dashboard";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import { useTheme } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function DashboardAdmin() {
	const { isDark, toggleTheme } = useTheme();
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
			<Dashboard />
		</>
	);
}

export default DashboardAdmin;
