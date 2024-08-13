"use client";
import { useState, useEffect } from "react";
import { useInventory } from "../context/InventoryContext";
import { AutocompleteSearchBar } from "./AutoCompleteSearchBar";
import { ImageRecognition } from "./ImageRecognition";
import { Button, Modal, Snackbar, TextField, IconButton } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { format, parseISO } from "date-fns";
import { useTheme } from "../context/ThemeContext";

const Dashboard = ({ initialItems }: { initialItems: any[] }) => {
	const { state, addItem, updateItem, removeItem, setItems } = useInventory();
	const { isDark } = useTheme(); // Get the current theme mode
	const [open, setOpen] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [editingItem, setEditingItem] = useState<any | null>(null);
	const [formState, setFormState] = useState({
		name: "",
		description: "",
		quantity: 1,
		category: "",
	});

	useEffect(() => {
		setItems(initialItems);
	}, [initialItems]);

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setEditingItem(null);
	};

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormState({ ...formState, [e.target.name]: e.target.value });
	};

	const handleFormSubmit = () => {
		if (editingItem) {
			updateItem({ ...editingItem, ...formState });
			setSnackbarMessage("Item updated successfully");
		} else {
			const newItem = {
				...formState,
				id: Date.now().toString(),
				dateAdded: new Date().toISOString(), // Store as ISO string
			};
			addItem(newItem);
			setSnackbarMessage("Item added successfully");
		}
		setSnackbarOpen(true);
		handleClose();
	};

	const handleSelect = (item: any) => {
		const newItem = {
			...item,
			id: Date.now().toString(),
			dateAdded: new Date().toISOString(), // Store as ISO string
		};
		addItem(newItem);
		setSnackbarMessage("Item added successfully");
		setSnackbarOpen(true);
	};

	const handleEditClick = (item: any) => {
		setEditingItem(item);
		setFormState({
			name: item.name,
			description: item.description,
			quantity: parseInt(item.quantity, 10),
			category: item.category,
		});
		setOpen(true);
	};

	const handleDeleteClick = async (id: string) => {
		try {
			// Check if the item exists in the database
			const response = await fetch(`/api/inventory/${id}`, {
				method: "GET",
			});

			if (response.ok) {
				const item = await response.json();

				if (item) {
					// If the item exists in the database, delete it
					await fetch(`/api/inventory/items/${id}`, {
						method: "DELETE",
					});
					removeItem(id); // Remove from the context state
					setSnackbarMessage("Item deleted successfully");
				} else {
					setSnackbarMessage("Item not found in the database");
				}
			} else {
				setSnackbarMessage("Error checking item in the database");
			}
		} catch (error) {
			console.error("Error deleting item:", error);
			setSnackbarMessage("Error deleting item");
		}

		setSnackbarOpen(true);
	};

	const handleDone = async () => {
		try {
			// Call your API to persist data to PostgreSQL
			const response = await fetch("/api/inventory/items", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(state.items),
			});
			if (response.ok) {
				setSnackbarMessage("Inventory saved successfully");
			} else {
				setSnackbarMessage("Failed to save inventory");
			}
		} catch (error) {
			setSnackbarMessage("Error saving inventory");
		}
		setSnackbarOpen(true);
	};

	const columns: GridColDef[] = [
		{ field: "name", headerName: "Name", width: 150 },
		{ field: "description", headerName: "Description", width: 300 },
		{ field: "quantity", headerName: "Quantity", width: 150 },
		{ field: "category", headerName: "Category", width: 150 },
		{
			field: "dateAdded",
			headerName: "Date Added",
			width: 200,
			valueFormatter: (params: any) => {
				console.log(params);
				if (!params) {
					return "Invalid date"; // Handle undefined or null date
				}
				try {
					// Use parseISO to correctly parse the date if it's an ISO string
					return format(parseISO(params), "PPpp"); // Format to readable date and time
				} catch (error) {
					console.error("Date formatting error:", error);
					return "Invalid date";
				}
			},
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 150,
			renderCell: (params) => (
				<>
					<IconButton onClick={() => handleEditClick(params.row)}>
						<EditIcon />
					</IconButton>
					<IconButton onClick={() => handleDeleteClick(params.row.id)}>
						<DeleteIcon />
					</IconButton>
				</>
			),
		},
	];

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Manage Inventory</h1>
			<div className="flex flex-col items-center space-y-4 mb-4 sm:flex-row sm:justify-center sm:space-x-4 sm:items-center">
				<AutocompleteSearchBar onSelect={handleSelect} />
				<ImageRecognition onRecognize={handleSelect} />
				<Button variant="contained" color="primary" onClick={handleOpen}>
					Add Item Manually
				</Button>
			</div>
			<div style={{ height: 400, width: "100%" }}>
				<DataGrid
					rows={state.items}
					columns={columns}
					pageSizeOptions={[5, 10, 20, 50, 100]}
					checkboxSelection
					disableRowSelectionOnClick
					paginationMode="client"
				/>
			</div>
			<Button
				variant="contained"
				color="success"
				onClick={handleDone}
				startIcon={<SaveIcon />}
				sx={{ mt: 2 }}
			>
				Done
			</Button>

			<Modal
				open={open}
				onClose={handleClose}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					className="p-4 rounded mx-auto mt-10 w-1/2"
					style={{
						backgroundColor: isDark ? "#424242" : "#ffffff",
						color: isDark ? "#ffffff" : "#000000",
					}}
				>
					<h2 className="text-xl mb-4">
						{editingItem ? "Edit Item" : "Add New Item"}
					</h2>
					<form className="space-y-4">
						<TextField
							label="Name"
							name="name"
							fullWidth
							variant="outlined"
							value={formState.name}
							onChange={handleFormChange}
							InputLabelProps={{
								style: { color: isDark ? "#ffffff" : "#000000" },
							}}
							InputProps={{
								style: { color: isDark ? "#ffffff" : "#000000" },
							}}
						/>
						<TextField
							label="Description"
							name="description"
							fullWidth
							variant="outlined"
							value={formState.description}
							onChange={handleFormChange}
							InputLabelProps={{
								style: { color: isDark ? "#ffffff" : "#000000" },
							}}
							InputProps={{
								style: { color: isDark ? "#ffffff" : "#000000" },
							}}
						/>
						<TextField
							label="Quantity"
							name="quantity"
							type="number"
							fullWidth
							variant="outlined"
							value={formState.quantity}
							onChange={handleFormChange}
							InputLabelProps={{
								style: { color: isDark ? "#ffffff" : "#000000" },
							}}
							InputProps={{
								style: { color: isDark ? "#ffffff" : "#000000" },
							}}
						/>
						<TextField
							label="Category"
							name="category"
							fullWidth
							variant="outlined"
							value={formState.category}
							onChange={handleFormChange}
							InputLabelProps={{
								style: { color: isDark ? "#ffffff" : "#000000" },
							}}
							InputProps={{
								style: { color: isDark ? "#ffffff" : "#000000" },
							}}
						/>
						<Button
							variant="contained"
							color="primary"
							onClick={handleFormSubmit}
						>
							{editingItem ? "Update Item" : "Add Item"}
						</Button>
					</form>
				</div>
			</Modal>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={() => setSnackbarOpen(false)}
			>
				<MuiAlert
					elevation={6}
					variant="filled"
					onClose={() => setSnackbarOpen(false)}
					severity="success"
				>
					{snackbarMessage}
				</MuiAlert>
			</Snackbar>
		</div>
	);
};

export default Dashboard;
