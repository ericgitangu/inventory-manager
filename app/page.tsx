// app/page.tsx
import { useTheme } from "./context/ThemeContext";
import Dashboard from "./components/Dashboard";
import { AppBar, Toolbar, Typography, IconButton, Avatar } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function Page() {
	const { isDark, toggleTheme } = useTheme();

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Inventory Manager
					</Typography>
					<IconButton color="inherit" onClick={toggleTheme}>
						{isDark ? <Brightness7Icon /> : <Brightness4Icon />}
					</IconButton>
					<Avatar alt="User Avatar" src="/path-to-user-avatar.jpg" />
				</Toolbar>
			</AppBar>

			<main className="p-4">
				<Dashboard />
			</main>
		</>
	);
}
