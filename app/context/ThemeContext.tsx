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

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const storedTheme = localStorage.getItem("theme");
		if (storedTheme) {
			setIsDark(storedTheme === "dark");
		}
	}, []);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);
		localStorage.setItem("theme", newIsDark ? "dark" : "light");
	};

	const theme = createTheme({
		palette: {
			mode: isDark ? "dark" : "light",
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

// This is the key part: ensure that this hook is correctly defined and exported
export const useTheme = (): ThemeContextProps => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
