// components/Sidebar.tsx
import React from "react";
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	IconButton,
	Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/navigation";

interface SidebarProps {
	isOpen: boolean;
	toggleSidebar: () => void;
	handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
	isOpen,
	toggleSidebar,
	handleLogout,
}) => {
	const router = useRouter();

	const list = () => (
		<Box
			sx={{ width: 250 }}
			role="presentation"
			onClick={toggleSidebar}
			onKeyDown={toggleSidebar}
		>
			<List>
				<ListItem button onClick={() => router.push("/")}>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText primary="Home" />
				</ListItem>
				<ListItem button onClick={() => router.push("/inventory")}>
					<ListItemIcon>
						<InventoryIcon />
					</ListItemIcon>
					<ListItemText primary="Inventory" />
				</ListItem>
				<ListItem button onClick={() => router.push("/dashboard")}>
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary="Dashboard" />
				</ListItem>
				<ListItem button onClick={handleLogout}>
					<ListItemIcon>
						<ExitToAppIcon />
					</ListItemIcon>
					<ListItemText primary="Logout" />
				</ListItem>
			</List>
		</Box>
	);

	return (
		<Drawer anchor="left" open={isOpen} onClose={toggleSidebar}>
			{list()}
		</Drawer>
	);
};

export default Sidebar;
