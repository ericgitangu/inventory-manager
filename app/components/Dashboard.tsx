"use client";
import { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { AutocompleteSearchBar } from "./AutoCompleteSearchBar";
import { ImageRecognition } from "./ImageRecognition";
import { Button, Modal, Snackbar, TextField } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
	{ field: "name", headerName: "Name", width: 150 },
	{ field: "description", headerName: "Description", width: 300 },
	{ field: "quantity", headerName: "Quantity", width: 150 },
	{ field: "category", headerName: "Category", width: 150 },
	{ field: "dateAdded", headerName: "Date Added", width: 200 },
];

const Dashboard = () => {
	const { state, addItem, updateItem, removeItem } = useInventory();
	const [open, setOpen] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [formState, setFormState] = useState({
		name: "",
		description: "",
		quantity: 1,
		category: "",
	});

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormState({ ...formState, [e.target.name]: e.target.value });
	};

	const handleFormSubmit = () => {
		const newItem = {
			...formState,
			id: Date.now().toString(),
			dateAdded: new Date().toISOString(),
		};
		addItem(newItem); // Add the item to the context state
		setSnackbarMessage("Item added successfully");
		setSnackbarOpen(true);
		handleClose();
	};

	const handleSelect = (item: any) => {
		const newItem = {
			...item,
			id: Date.now().toString(),
			dateAdded: new Date().toISOString(),
		};
		addItem(newItem); // Add the item to the context state
		setSnackbarMessage("Item added successfully");
		setSnackbarOpen(true);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Inventory Dashboard</h1>
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

			<Modal open={open} onClose={handleClose}>
				<div className="p-4 bg-white shadow-md rounded mx-auto mt-10 w-1/2">
					<h2 className="text-xl mb-4">Add New Item</h2>
					<form className="space-y-4">
						<TextField
							label="Name"
							name="name"
							fullWidth
							variant="outlined"
							onChange={handleFormChange}
						/>
						<TextField
							label="Description"
							name="description"
							fullWidth
							variant="outlined"
							onChange={handleFormChange}
						/>
						<TextField
							label="Quantity"
							name="quantity"
							type="number"
							fullWidth
							variant="outlined"
							onChange={handleFormChange}
						/>
						<TextField
							label="Category"
							name="category"
							fullWidth
							variant="outlined"
							onChange={handleFormChange}
						/>
						<Button
							variant="contained"
							color="primary"
							onClick={handleFormSubmit}
						>
							Add Item
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
