import { useState, useEffect } from "react";
import logger from "../logger.js";
import LoginModal from "./LoginModal";
import axios from "axios";
// MUI components
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";

import ListItemIcon from "@mui/material/ListItemIcon";
// MUI icons
import { styled } from "@mui/material/styles";

const drawerWidth = 240;

/**
 * Styled List component for the sidebar navigation.
 */
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

/**
 * Styled Icon component for the sidebar navigation.
 */
const SidebarIcon = styled(ListItemIcon)(() => ({
	minWidth: "47px",
}));

/**
 * Sidebar functional component
 * Renders a navigation drawer with links and actions for the application.
 *
 * @pre None
 * @post Creates a sidebar with navigation options. User's login status is checked on component mount.
 * @returns {JSX.Element} A rendered sidebar component containing navigation links.
 */
function Sidebar() {
	const [modalVisible, setModalShow] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		/**
		 * Checks the user's login status with the backend and updates state accordingly.
		 *
		 * @pre axios must be configured correctly.
		 * @post Updates isLoggedIn state based on response from backend.
		 */
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

	/**
	 * Logs the sidebar item clicked by the user.
	 *
	 * @param {Event} event - The click event from a sidebar item.
	 * @pre None
	 * @post Logs the text content of the clicked sidebar item.
	 */
	const handleClick = (event) => {
		logger.info(event.target.innerText + " Sidebar navigation clicked");
	};

	/**
	 * Opens the login modal and logs the action.
	 *
	 * @param {Event} event - The click event from the login sidebar item.
	 * @pre None
	 * @post Sets modalVisible to true and logs the event.
	 */
	const setModalVisible = (event) => {
		handleClick(event);
		setModalShow(true);
		logger.info("LoginModal visible");
	};

	/**
	 * Closes the login modal and logs the action.
	 *
	 * @pre None
	 * @post Sets modalVisible to false and logs the closure of the modal.
	 */
	const closeModal = () => {
		setModalShow(false);
		logger.info("LoginModal closed");
	};

	/**
	 * Handles the user logout process.
	 *
	 * @pre axios must be configured correctly.
	 * @post Sends a logout request to the backend, logs out the user, and reloads the page.
	 */
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
				<SidebarList>{/* List of navigation links and actions */}</SidebarList>
				{/* More lists and login/logout actions */}
			</Drawer>
			<LoginModal modalVisible={modalVisible} closeModal={closeModal} />
		</>
	);
}

export default Sidebar;
