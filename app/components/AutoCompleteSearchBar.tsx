import { useState, useEffect, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

interface AutocompleteSearchBarProps {
	onSelect: (item: {
		name: string;
		description: string;
		quantity: number;
		category: string;
	}) => void;
}

export const AutocompleteSearchBar = ({
	onSelect,
}: AutocompleteSearchBarProps) => {
	const [inputValue, setInputValue] = useState("");
	const [options, setOptions] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	// Function to fetch suggestions from the API
	const fetchSuggestions = useCallback(async (query: string) => {
		setLoading(true);
		try {
			const response = await fetch(`/api/autosuggest?query=${query}`);
			if (response.ok) {
				const data = await response.json();
				// Remove numbering and trim suggestions
				const suggestions = data.suggestions.map((suggestion: string) =>
					suggestion.replace(/^\d+\.\s*/, "").trim(),
				);
				setOptions(suggestions);
			} else {
				console.error("Error fetching suggestions:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching suggestions:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Function to fetch the description and category from OpenAI
	const fetchDescriptionAndCategory = useCallback(async (itemName: string) => {
		try {
			const response = await fetch(`/api/get-description`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ itemName }),
			});
			if (response.ok) {
				const data = await response.json();
				// Assuming the response contains both description and category, adjust as needed
				const { description, category } = parseDescriptionAndCategory(
					data.description,
				);
				return { description, category };
			} else {
				console.error(
					"Error fetching description and category:",
					response.statusText,
				);
				return { description: "", category: "" };
			}
		} catch (error) {
			console.error("Error fetching description and category:", error);
			return { description: "", category: "" };
		}
	}, []);

	// Helper function to parse the description and category from OpenAI's response
	const parseDescriptionAndCategory = (text: string) => {
		// Assuming the format "Description: ... Category: ..."
		const descriptionMatch = text.match(/Description:\s*(.*)/);
		const categoryMatch = text.match(/Category:\s*(.*)/);
		const description = descriptionMatch ? descriptionMatch[1].trim() : "";
		const category = categoryMatch ? categoryMatch[1].trim() : "";
		return { description, category };
	};

	// Handle when a suggestion is selected from the dropdown
	const handleSelection = useCallback(
		async (event: any, selectedItem: string | null) => {
			if (!selectedItem) return;

			const { description, category } = await fetchDescriptionAndCategory(
				selectedItem,
			);
			onSelect({
				name: selectedItem,
				description: description || "No description available",
				category: category || "Uncategorized",
				quantity: 1,
			});
		},
		[fetchDescriptionAndCategory, onSelect],
	);

	// Fetch suggestions when input value changes
	useEffect(() => {
		if (inputValue.length > 2) {
			fetchSuggestions(inputValue);
		} else {
			setOptions([]); // Clear options if input is too short
		}
	}, [inputValue, fetchSuggestions]);

	return (
		<Autocomplete
			freeSolo
			options={options}
			loading={loading}
			style={{ width: "100%" }}
			onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
			onChange={handleSelection}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Search Items"
					variant="outlined"
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<>
								{loading ? (
									<CircularProgress color="inherit" size={20} />
								) : null}
								{params.InputProps.endAdornment}
							</>
						),
					}}
					fullWidth
					margin="normal"
				/>
			)}
		/>
	);
};
