// pages/index.tsx
"use client";
import {
	Container,
	Box,
	Typography,
	Button,
	Grid,
	Paper,
	Switch,
	IconButton,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useSession, signIn } from "next-auth/react";
import { useTheme } from "./context/ThemeContext";

export default function Home() {
	const { data: session } = useSession();
	const { toggleTheme, isDark } = useTheme(); // Access the theme context

	const handleGetStarted = () => {
		if (!session) {
			signIn("google");
		} else {
			window.location.href = "/dashboard";
		}
	};

	return (
		<Container maxWidth="lg">
			<Box sx={{ textAlign: "center", padding: "50px 0" }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
						mb: 2,
					}}
				>
					<IconButton onClick={toggleTheme} color="inherit">
						{isDark ? <DarkModeIcon /> : <LightModeIcon />}
					</IconButton>
					<Switch checked={isDark} onChange={toggleTheme} />
				</Box>
				<Typography variant="h2" component="h1" gutterBottom>
					Welcome to AI-Powered Inventory Manager
				</Typography>
				<Typography variant="h5" component="h2" gutterBottom>
					Efficiently manage and categorize your inventory with the power of AI
					and cloud services.
				</Typography>
				<Typography variant="body1" color="textSecondary" gutterBottom>
					Leverage Google Vision and OpenAI to automatically recognize,
					categorize, and describe your inventory items. Integrated
					authentication and secure data storage using Google and PostgreSQL
					ensure your inventory is safe and accessible anytime, anywhere.
				</Typography>

				<Box sx={{ marginTop: "30px" }}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={handleGetStarted}
					>
						Get Started
					</Button>
				</Box>
			</Box>

			<Box sx={{ marginTop: "50px" }}>
				<Typography variant="h4" component="h3" gutterBottom>
					Features
				</Typography>
				<Grid container spacing={4}>
					<Grid item xs={12} sm={6}>
						<Paper sx={{ padding: "20px" }} elevation={3}>
							<Typography variant="h6" component="h4">
								AI-Powered Recognition
							</Typography>
							<Typography variant="body2" color="textSecondary">
								Use Google Vision API to automatically recognize and identify
								items using your device’s camera.
							</Typography>
						</Paper>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Paper sx={{ padding: "20px" }} elevation={3}>
							<Typography variant="h6" component="h4">
								Smart Categorization
							</Typography>
							<Typography variant="body2" color="textSecondary">
								Leverage OpenAI to categorize and describe your inventory items
								for easier management.
							</Typography>
						</Paper>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Paper sx={{ padding: "20px" }} elevation={3}>
							<Typography variant="h6" component="h4">
								Secure Data Storage
							</Typography>
							<Typography variant="body2" color="textSecondary">
								All your inventory data is securely stored in a PostgreSQL
								database with Prisma ORM integration.
							</Typography>
						</Paper>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Paper sx={{ padding: "20px" }} elevation={3}>
							<Typography variant="h6" component="h4">
								User Authentication
							</Typography>
							<Typography variant="body2" color="textSecondary">
								Google OAuth2.0 authentication ensures secure access to your
								inventory dashboard.
							</Typography>
						</Paper>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Paper sx={{ padding: "20px" }} elevation={3}>
							<Typography variant="h6" component="h4">
								Customer Service Chatbot
							</Typography>
							<Typography variant="body2" color="textSecondary">
								An integrated AI chatbot assists you with inventory management,
								pricing queries, and more.
							</Typography>
						</Paper>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Paper sx={{ padding: "20px" }} elevation={3}>
							<Typography variant="h6" component="h4">
								Rate-Limited API Usage
							</Typography>
							<Typography variant="body2" color="textSecondary">
								Throttle API calls to manage costs and ensure efficient use of
								resources.
							</Typography>
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
