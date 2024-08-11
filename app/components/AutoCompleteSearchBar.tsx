import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

interface AutocompleteSearchBarProps {
	onSelect: (item: any) => void;
	addToTable: (item: any) => void;
}

export const AutocompleteSearchBar = ({
	onSelect,
	addToTable,
}: AutocompleteSearchBarProps) => {
	const [inputValue, setInputValue] = useState("");
	const [options, setOptions] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	// Function to fetch suggestions from the API
	const fetchSuggestions = async (query: string) => {
		setLoading(true);
		try {
			const response = await fetch(`/api/autocomplete?query=${query}`);
			if (response.ok) {
				const data = await response.json();
				setOptions(data.suggestions);
			} else {
				console.error("Error fetching suggestions:", response.statusText);
			}
		} catch (error) {
			console.error("Error fetching suggestions:", error);
		} finally {
			setLoading(false);
		}
	};

	// Function to handle when a suggestion is selected
	const handleSuggestionSelect = (suggestion: string) => {
		const selectedItem = {
			name: suggestion,
			description: "Auto-generated description", // Placeholder description
			quantity: 1,
		};
		onSelect(selectedItem);
		addToTable(selectedItem); // Add to table after selection
	};

	// Fetch suggestions when input value changes
	useEffect(() => {
		if (inputValue.length > 2) {
			fetchSuggestions(inputValue);
		}
	}, [inputValue]);

	return (
		<Autocomplete
			freeSolo
			options={options}
			getOptionLabel={(option) => option}
			onInputChange={(event, newInputValue) => {
				setInputValue(newInputValue);
			}}
			onChange={(event, newValue) => {
				if (newValue) handleSuggestionSelect(newValue);
			}}
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
				/>
			)}
		/>
	);
};
