// app/context/ThemeContext.tsx
"use client";
import {
	createContext,
	useState,
	useContext,
	useEffect,
	ReactNode,
} from "react";
import {
	ThemeProvider as MuiThemeProvider,
	createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextProps {
	toggleTheme: () => void;
	isDark: boolean;
}

// Create the ThemeContext with a default value of undefined
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [isDark, setIsDark] = useState<boolean>(() => {
		// Initialize theme based on local storage or system preference
		if (typeof window !== "undefined") {
			const storedTheme = localStorage.getItem("theme");
			return storedTheme
				? storedTheme === "dark"
				: window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return false;
	});

	// useEffect to save theme preference to local storage and update theme on change
	useEffect(() => {
		if (isDark) {
			localStorage.setItem("theme", "dark");
		} else {
			localStorage.setItem("theme", "light");
		}
	}, [isDark]);

	// Function to toggle between dark and light themes
	const toggleTheme = () => {
		setIsDark((prevMode) => !prevMode);
	};

	// Create the theme object
	const theme = createTheme({
		palette: {
			mode: isDark ? "dark" : "light",
			background: {
				default: isDark ? "#121212" : "#ffffff",
			},
			primary: {
				main: isDark ? "#90caf9" : "#1976d2",
			},
			secondary: {
				main: isDark ? "#f48fb1" : "#dc004e",
			},
			text: {
				primary: isDark ? "#ffffff" : "#000000",
				secondary: isDark ? "#b0bec5" : "#555555",
			},
		},
	});

	return (
		<ThemeContext.Provider value={{ toggleTheme, isDark }}>
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};

// Custom hook to use the ThemeContext
export const useTheme = (): ThemeContextProps => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
