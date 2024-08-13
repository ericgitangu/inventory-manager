"use client";
import React, { useEffect, useState } from "react";
import {
	Container,
	Grid,
	Card,
	CardContent,
	Typography,
	Box,
	AppBar,
	Toolbar,
	Avatar,
	Skeleton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import Chatbot from "../components/Chatbot";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	CircularProgress,
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";


const COLORS = [
	"#8884d8",
	"#82ca9d",
	"#ffc658",
	"#ff7300",
	"#d0ed57",
	"#a4de6c",
];

const Dashboard = () => {
	const router = useRouter();
	const { isDark, toggleTheme } = useTheme();
	const { data: session } = useSession();
	const [loading, setLoading] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [items, setItems] = useState<any[]>([]);
	const [abbreviations, setAbbreviations] = useState<Record<string, string>>(
		{},
	);
	const [inspectItem, setInspectItem] = useState<any | null>(null);

	const toggleSidebar = () => {
		setDrawerOpen(!drawerOpen);
	};

	const handleInspectClick = (item: any) => {
		setInspectItem(item);
	};

	const handleInspectClose = () => {
		setInspectItem(null);
	};

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await fetch("/api/inventory/items");
				const data = await response.json();
				setItems(data);
				generateAbbreviations(data);
			} catch (error) {
				console.error("Error fetching inventory items:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchItems();
	}, []);

	const generateAbbreviations = (items: any[]) => {
		const abbrevMap: Record<string, string> = {};
		items.forEach((item) => {
			const abbrev =
				item.category.length > 10
					? `${item.category.substring(0, 7)}...`
					: item.category;
			abbrevMap[abbrev] = item.category;
		});
		setAbbreviations(abbrevMap);
	};

	const totalItems = items.length;
	const totalCategories = new Set(items.map((item) => item.category)).size;
	const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

	const categoryData = items.reduce((acc: Record<string, number>, item) => {
		acc[item.category] = (acc[item.category] || 0) + 1;
		return acc;
	}, {});

	const chartData = Object.keys(categoryData).map((key) => ({
		category: key.length > 10 ? `${key.substring(0, 7)}...` : key,
		count: categoryData[key],
	}));

	const columns = [
		{ field: "name", headerName: "Name", width: 150 },
		{ field: "description", headerName: "Description", width: 300 },
		{ field: "quantity", headerName: "Quantity", width: 150 },
		{ field: "category", headerName: "Category", width: 150 },
		{
			field: "dateAdded",
			headerName: "Date Added",
			width: 200,
			valueFormatter: (params: any) =>
				new Date(params).toLocaleDateString("en-US", {
					year: "numeric",
					month: "short",
					day: "numeric",
				}),
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 150,
			renderCell: (params: any) => (
				<IconButton onClick={() => handleInspectClick(params.row)}>
					<VisibilityIcon />
				</IconButton>
			),
		},
	];

	const itemsByCategory = items.reduce((acc: Record<string, any[]>, item) => {
		const abbrev =
			item.category.length > 10
				? `${item.category.substring(0, 7)}...`
				: item.category;

		if (!acc[abbrev]) {
			acc[abbrev] = [];
		}
		acc[abbrev].push(item.name);
		return acc;
	}, {});

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const category = payload[0].payload.category;
			const items = itemsByCategory[category] || [];

			console.log("Tooltip category:", category);
			console.log("Items in category:", items);

			return (
				<Box
					sx={{
						backgroundColor: isDark ? "#333" : "#fff",
						border: "1px solid #ccc",
						borderRadius: 4,
						padding: 2,
						color: isDark ? "#fff" : "#000",
						maxWidth: 250,
					}}
				>
					<Typography variant="h6">{abbreviations[category]}:</Typography>
					{items.length > 0 ? (
						items.map((item: any, index: number) => (
							<Typography key={index} variant="body2">
								{index + 1}. {item}
							</Typography>
						))
					) : (
						<Typography variant="body2">No items in this category</Typography>
					)}
				</Box>
			);
		}

		return null;
	};

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
						src={session?.user?.image || "/path-to-placeholder-avatar.jpg"}
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
			<Container maxWidth="lg" sx={{ marginTop: 4 }}>
				<Grid container spacing={4}>
					{loading ? (
						<Skeleton variant="rectangular" width="100%" height={118} />
					) : (
						<>
							<Grid item xs={12} sm={4}>
								<Card>
									<CardContent sx={{ textAlign: "center" }}>
										<Typography variant="h6">Total Items</Typography>
										<Typography variant="h4">{totalItems}</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Card>
									<CardContent sx={{ textAlign: "center" }}>
										<Typography variant="h6">Total Categories</Typography>
										<Typography variant="h4">{totalCategories}</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Card>
									<CardContent sx={{ textAlign: "center" }}>
										<Typography variant="h6">Total Quantity</Typography>
										<Typography variant="h4">{totalQuantity}</Typography>
									</CardContent>
								</Card>
							</Grid>
						</>
					)}
				</Grid>

				<Grid container spacing={4} sx={{ marginTop: 4 }}>
					<Grid item xs={12} sm={6}>
						<Typography variant="h6" gutterBottom textAlign="center">
							Items by Category
						</Typography>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="category" />
								<YAxis />
								<Tooltip
									content={<CustomTooltip itemsByCategory={itemsByCategory} />}
								/>
								<Bar dataKey="count">
									{chartData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Typography variant="h6" gutterBottom textAlign="center">
							Items Distribution
						</Typography>
						<ResponsiveContainer width="100%" height={300}>
							{loading ? (
								<Skeleton variant="rectangular" width="100%" height={300} />
							) : (
								<PieChart>
									<Pie
										data={chartData}
										dataKey="count"
										nameKey="category"
										cx="50%"
										cy="50%"
										outerRadius={100}
										label
									>
										{chartData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							)}
						</ResponsiveContainer>
					</Grid>
				</Grid>

				<Box sx={{ marginTop: 4, height: 400, width: "100%" }}>
					{loading ? (
						<Skeleton variant="rectangular" width="100%" height={400} />
					) : (
						<DataGrid rows={items} columns={columns} />
					)}
				</Box>
				{inspectItem && (
					<Dialog
						open={Boolean(inspectItem)}
						onClose={handleInspectClose}
						maxWidth="sm"
						fullWidth
					>
						<DialogTitle>Item Details</DialogTitle>
						<DialogContent>
							<Typography variant="h6">Name: {inspectItem.name}</Typography>
							<Typography variant="body1">
								Description: {inspectItem.description}
							</Typography>
							<Typography variant="body1">
								Quantity: {inspectItem.quantity}
							</Typography>
							<Typography variant="body1">
								Category: {inspectItem.category}
							</Typography>
							<Typography variant="body1">
								Date Added:{" "}
								{new Date(inspectItem.dateAdded).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</Typography>
						</DialogContent>
					</Dialog>
				)}

				<Chatbot items={items} />
			</Container>
		</>
	);
};

export default Dashboard;
