import { createContext, useState, useContext, ReactNode } from "react";
import {
	ThemeProvider as MuiThemeProvider,
	createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextProps {
	toggleTheme: () => void;
	isDark: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [isDark, setIsDark] = useState(true);

	const toggleTheme = () => {
		setIsDark(!isDark);
	};

	const theme = createTheme({
		palette: {
			mode: isDark ? "dark" : "light",
			background: {
				default: isDark ? "#121212" : "#ffffff",
			},
			primary: {
				main: isDark ? "#90caf9" : "#1976d2",
				contrastText: isDark ? "#000000" : "#ffffff", // Adding contrast text
			},
			secondary: {
				main: isDark ? "#f48fb1" : "#dc004e",
				contrastText: isDark ? "#000000" : "#ffffff", // Adding contrast text
			},
			text: {
				primary: isDark ? "#ffffff" : "#000000",
				secondary: isDark ? "#b0bec5" : "#555555",
			},
			contrastThreshold: 3, // Setting contrast threshold
			tonalOffset: 0.2, // Setting tonal offset for dynamic color adjustments
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

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
