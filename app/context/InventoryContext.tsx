"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";

interface Item {
	id: string;
	name: string;
	description: string;
	quantity: number;
}

interface InventoryState {
	items: Item[];
}

interface InventoryAction {
	type: string;
	payload: Item;
}

const InventoryContext = createContext<any>(undefined);

const inventoryReducer = (state: InventoryState, action: InventoryAction) => {
	switch (action.type) {
		case "ADD_ITEM":
			return { ...state, items: [...state.items, action.payload] };
		case "UPDATE_ITEM":
			return {
				...state,
				items: state.items.map((item) =>
					item.id === action.payload.id ? action.payload : item,
				),
			};
		case "REMOVE_ITEM":
			return {
				...state,
				items: state.items.filter((item) => item.id !== action.payload.id),
			};
		default:
			return state;
	}
};

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(inventoryReducer, { items: [] });

	const addItem = (item: Item) => {
		dispatch({ type: "ADD_ITEM", payload: item });
	};

	const updateItem = (item: Item) => {
		dispatch({ type: "UPDATE_ITEM", payload: item });
	};

	const removeItem = (id: string) => {
		dispatch({
			type: "REMOVE_ITEM",
			payload: {
				id,
				name: "",
				description: "",
				quantity: 0,
			},
		});
	};

	return (
		<InventoryContext.Provider
			value={{ state, addItem, updateItem, removeItem }}
		>
			{children}
		</InventoryContext.Provider>
	);
};

export const useInventory = () => useContext(InventoryContext);
