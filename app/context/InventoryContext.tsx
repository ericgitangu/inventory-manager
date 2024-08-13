// app/context/InventoryContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define an interface for inventory items
interface InventoryItem {
	id: string;
	name: string;
	description: string;
	quantity: number;
	category: string;
	dateAdded: string;
}

// Define the state type
interface InventoryState {
	items: InventoryItem[];
}

// Define action types for the reducer
type InventoryAction =
	| { type: "ADD_ITEM"; item: InventoryItem }
	| { type: "UPDATE_ITEM"; item: InventoryItem }
	| { type: "REMOVE_ITEM"; id: string }
	| { type: "SET_ITEMS"; items: InventoryItem[] };

// Initial state for the context
const initialState: InventoryState = {
	items: [],
};

// Create a reducer function to handle state changes
function inventoryReducer(
	state: InventoryState,
	action: InventoryAction,
): InventoryState {
	switch (action.type) {
		case "ADD_ITEM":
			return { ...state, items: [...state.items, action.item] };
		case "UPDATE_ITEM":
			return {
				...state,
				items: state.items.map((item) =>
					item.id === action.item.id ? action.item : item,
				),
			};
		case "REMOVE_ITEM":
			return {
				...state,
				items: state.items.filter((item) => item.id !== action.id),
			};
		case "SET_ITEMS":
			return {
				...state,
				items: action.items,
			};
		default:
			return state;
	}
}

// Create a context for inventory state and dispatch
const InventoryContext = createContext<
	| {
			state: InventoryState;
			addItem: (item: InventoryItem) => void;
			updateItem: (item: InventoryItem) => void;
			removeItem: (id: string) => void;
			setItems: (items: InventoryItem[]) => void;
	  }
	| undefined
>(undefined);

// InventoryProvider component
export const InventoryProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(inventoryReducer, initialState);

	// Function to add an item
	const addItem = (item: InventoryItem) => {
		dispatch({ type: "ADD_ITEM", item });
	};

	// Function to update an item
	const updateItem = (item: InventoryItem) => {
		dispatch({ type: "UPDATE_ITEM", item });
	};

	// Function to remove an item
	const removeItem = (id: string) => {
		dispatch({ type: "REMOVE_ITEM", id });
	};

	// Function to set multiple items
	const setItems = (items: InventoryItem[]) => {
		dispatch({ type: "SET_ITEMS", items });
	};

	return (
		<InventoryContext.Provider
			value={{ state, addItem, updateItem, removeItem, setItems }}
		>
			{children}
		</InventoryContext.Provider>
	);
};

// Custom hook to use the inventory context
export const useInventory = () => {
	const context = useContext(InventoryContext);
	if (!context) {
		throw new Error("useInventory must be used within an InventoryProvider");
	}
	return context;
};
