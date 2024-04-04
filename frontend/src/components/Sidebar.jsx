import { useState, useEffect } from "react";
import logger from "../logger.js";
import LoginModal from "./LoginModal";
import http from "../../http.js";
import { Link } from "react-router-dom";
// MUI
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
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
import { useNavigate } from "react-router-dom";
const drawerWidth = 240;
import { useContext } from "react";
import { UserContext } from "../context/userContext";
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
	const { user } = useContext(UserContext);
	useEffect(() => {
		/**
		 * Checks the user's login status with the backend and updates state accordingly.
		 *
		 * @pre http must be configured correctly.
		 * @post Updates isLoggedIn state based on response from backend.
		 */
		const checkLoginStatus = async () => {
			try {
				const response = await http.get("/users");
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

	const navigate = useNavigate();

	const handleSettingClick = () => {
		navigate("/settings");
	};

	/**
	 * Handles the user logout process.
	 *
	 * @pre http must be configured correctly.
	 * @post Sends a logout request to the backend, logs out the user, and reloads the page.
	 */
	const handleLogout = async () => {
		try {
			await http.post("/users/logout");
			setIsLoggedIn(false);
			navigate("/");
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
					<Typography
						variant="h4"
						noWrap
						component="div"
						sx={{ marginTop: "20px", fontWeight: "medium" }}
					>
						PCubed
					</Typography>
				</Toolbar>
				<SidebarList>
					<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
						<ListItem key="Catalogue" disablePadding onClick={handleClick}>
							<ListItemButton>
								<SidebarIcon>
									<HomeIcon />
								</SidebarIcon>
								<ListItemText primary="Catalogue" />
							</ListItemButton>
						</ListItem>
					</Link>
					<ListItem key="Connect" disablePadding onClick={handleClick}>
						<ListItemButton>
							<SidebarIcon>
								<UploadIcon />
							</SidebarIcon>
							<ListItemText primary="Connect" />
						</ListItemButton>
					</ListItem>
					<Link
						to="/stats"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<ListItem key="Statistics" disablePadding onClick={handleClick}>
							<ListItemButton>
								<SidebarIcon>
									<BarChartIcon />
								</SidebarIcon>
								<ListItemText primary="Statistics" />
							</ListItemButton>
						</ListItem>
					</Link>
					<Link
						to="/manageCultures"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<ListItem
							key="Cultures Data Management"
							disablePadding
							onClick={handleClick}
						>
							<ListItemButton>
								<SidebarIcon>
									<FolderCopyIcon />
								</SidebarIcon>
								<ListItemText primary="Cultures Management" />
							</ListItemButton>
						</ListItem>
					</Link>
					<Link
						to="/managePeriods"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<ListItem
							key="Periods Data Management"
							disablePadding
							onClick={handleClick}
						>
							<ListItemButton>
								<SidebarIcon>
									<FolderCopyIcon />
								</SidebarIcon>
								<ListItemText primary="Periods Management" />
							</ListItemButton>
						</ListItem>
					</Link>
					<Link
						to="/manageMaterials"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<ListItem
							key="Materials Data Management"
							disablePadding
							onClick={handleClick}
						>
							<ListItemButton>
								<SidebarIcon>
									<FolderCopyIcon />
								</SidebarIcon>
								<ListItemText primary="Materials Management" />
							</ListItemButton>
						</ListItem>
					</Link>
				</SidebarList>
				<SidebarList sx={{ marginTop: "auto" }}>
					{user && (
						<ListItem
							key="Settings"
							disablePadding
							onClick={handleSettingClick}
						>
							<ListItemButton>
								<SidebarIcon>
									<RoomPreferencesIcon />
								</SidebarIcon>
								<ListItemText primary="Settings" />
							</ListItemButton>
						</ListItem>
					)}
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
