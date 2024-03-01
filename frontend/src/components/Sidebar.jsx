import { useState, useEffect } from "react";
import logger from "../logger.js";
import LoginModal from "./LoginModal";
import axios from "axios";
// MUI
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import UploadIcon from "@mui/icons-material/Upload";
import BarChartIcon from "@mui/icons-material/BarChart";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import LoginIcon from "@mui/icons-material/Login";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { styled } from "@mui/material/styles";

const drawerWidth = 240;

// create SidebarList component and styling, based on List MUI component
const SidebarList = styled(List)(() => ({
	padding: "10px",
	// selected and (selected + hover) states
	"&& .Mui-selected, && .Mui-selected:hover": {
		backgroundColor: "#cda057",
		borderRadius: "7px",
		"&, & .MuiListItemIcon-root": {
			color: "white",
		},
	},
	// hover states
	"& .MuiListItemButton-root:hover": {
		backgroundColor: "#cda057",
		borderRadius: "7px",
		"&, & .MuiListItemIcon-root": {
			color: "white",
		},
	},
}));

// create SidebarIcon component and styling, based on ListItemIcon MUI component
const SidebarIcon = styled(ListItemIcon)(() => ({
	minWidth: "47px",
}));

function Sidebar() {
	const [modalVisible, setModalShow] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		// Check if user is logged in
		const checkLoginStatus = async () => {
			try {
				const response = await axios.get("http://localhost:3000/users");
				setIsLoggedIn(!!response.data);
			} catch (error) {
				console.error("Error checking login status:", error);
			}
		};

		checkLoginStatus();
	}, []);

	const handleClick = (event) => {
		logger.info(event.target.innerText + " Sidebar navigation clicked");
	};

	const setModalVisible = (event) => {
		handleClick(event);
		setModalShow(true);
		logger.info("LoginModal visible");
	};

	const closeModal = () => {
		setModalShow(false);
		logger.info("LoginModal closed");
	};

	const handleLogout = async () => {
		try {
			await axios.post("http://localhost:3000/users/logout");
			setIsLoggedIn(false);
			window.location.reload();
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	return (
		<>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
					},
				}}
				PaperProps={{
					sx: {
						// sidebar background color
						backgroundColor: "#f1f1f1",
					},
				}}
				variant="permanent"
				anchor="left"
			>
				<Toolbar>
					<Typography variant="h6" noWrap component="div">
						PCubed
					</Typography>
				</Toolbar>
				<SidebarList>
					<ListItem key="Home" disablePadding onClick={handleClick}>
						<ListItemButton>
							<SidebarIcon>
								<HomeIcon />
							</SidebarIcon>
							<ListItemText primary="Home" />
						</ListItemButton>
					</ListItem>
					<ListItem key="Connect" disablePadding onClick={handleClick}>
						<ListItemButton>
							<SidebarIcon>
								<UploadIcon />
							</SidebarIcon>
							<ListItemText primary="Connect" />
						</ListItemButton>
					</ListItem>
				</SidebarList>
				<Divider />
				<SidebarList>
					<ListItem key="Statistics" disablePadding onClick={handleClick}>
						<ListItemButton>
							<SidebarIcon>
								<BarChartIcon />
							</SidebarIcon>
							<ListItemText primary="Statistics" />
						</ListItemButton>
					</ListItem>
					<ListItem key="Data Management" disablePadding onClick={handleClick}>
						<ListItemButton>
							<SidebarIcon>
								<FolderCopyIcon />
							</SidebarIcon>
							<ListItemText primary="Data Management" />
						</ListItemButton>
					</ListItem>
				</SidebarList>
				<SidebarList sx={{ marginTop: "auto" }}>
					<ListItem key="Settings" disablePadding onClick={handleClick}>
						<ListItemButton>
							<SidebarIcon>
								<RoomPreferencesIcon />
							</SidebarIcon>
							<ListItemText primary="Settings" />
						</ListItemButton>
					</ListItem>
					{isLoggedIn ? (
						<ListItem key="Logout" disablePadding onClick={handleLogout}>
							<ListItemButton>
								<SidebarIcon>
									<ExitToAppIcon />
								</SidebarIcon>
								<ListItemText primary="Logout" />
							</ListItemButton>
						</ListItem>
					) : (
						<ListItem key="Login" disablePadding onClick={setModalVisible}>
							<ListItemButton>
								<SidebarIcon>
									<LoginIcon />
								</SidebarIcon>
								<ListItemText primary="Login" />
							</ListItemButton>
						</ListItem>
					)}
				</SidebarList>
			</Drawer>
			<LoginModal modalVisible={modalVisible} closeModal={closeModal} />
		</>
	);
}

export default Sidebar;
