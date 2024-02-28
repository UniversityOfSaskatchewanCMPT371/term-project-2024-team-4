// import { useState } from "react";
// import logger from "../logger.js";
// import LoginModal from "./LoginModal";
// import { Link } from "react-router-dom";

// // MUI
// import Drawer from "@mui/material/Drawer";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import List from "@mui/material/List";
// import Divider from "@mui/material/Divider";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import HomeIcon from "@mui/icons-material/Home";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import FolderCopyIcon from "@mui/icons-material/FolderCopy";
// import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
// import LoginIcon from "@mui/icons-material/Login";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import ExploreIcon from "@mui/icons-material/Explore";
// import IconButton from "@mui/material/IconButton";
// import { styled } from "@mui/material/styles";

// const drawerWidth = 240;

// const SidebarList = styled(List)(() => ({
// 	padding: "10px",
// 	"&& .Mui-selected, && .Mui-selected:hover": {
// 		backgroundColor: "#cda057",
// 		borderRadius: "7px",
// 		"&, & .MuiListItemIcon-root": {
// 			color: "white",
// 		},
// 	},
// 	"& .MuiListItemButton-root:hover": {
// 		backgroundColor: "#cda057",
// 		borderRadius: "7px",
// 		"&, & .MuiListItemIcon-root": {
// 			color: "white",
// 		},
// 	},
// }));

// const SidebarIcon = styled(ListItemIcon)(() => ({
// 	minWidth: "47px",
// }));

// const SidebarIconButton = styled(IconButton)(() => ({
// 	minWidth: "47px",
// }));

// function Sidebar() {
// 	const [modalVisible, setModalShow] = useState(false);

// 	const handleClick = (event) => {
// 		logger.info(event.target.innerText + " Sidebar navigation clicked");
// 	};

// 	const setModalVisible = (event) => {
// 		handleClick(event);
// 		setModalShow(true);
// 		logger.info("LoginModal visible");
// 	};

// 	const closeModal = () => {
// 		setModalShow(false);
// 		logger.info("LoginModal closed");
// 	};

// 	return (
// 		<>
// 			<Drawer
// 				sx={{
// 					width: drawerWidth,
// 					flexShrink: 0,
// 					"& .MuiDrawer-paper": {
// 						width: drawerWidth,
// 						boxSizing: "border-box",
// 					},
// 				}}
// 				PaperProps={{
// 					sx: {
// 						backgroundColor: "#f1f1f1",
// 					},
// 				}}
// 				variant="permanent"
// 				anchor="left"
// 			>
// 				<Toolbar>
// 					<Typography variant="h6" noWrap component="div">
// 						PCubed
// 					</Typography>
// 				</Toolbar>
// 				<SidebarList>
// 					<ListItem key="Home" disablePadding onClick={handleClick}>
// 						<ListItemButton component={Link} to="/catalogue">
// 							<SidebarIcon>
// 								<HomeIcon />
// 							</SidebarIcon>
// 							<ListItemText primary="Home" />
// 						</ListItemButton>
// 					</ListItem>
// 					<ListItem key="Site" disablePadding onClick={handleClick}>
// 						<ListItemButton component={Link} to="/sites">
// 							<SidebarIconButton>
// 								<ExploreIcon />
// 							</SidebarIconButton>
// 							<ListItemText primary="Site" />
// 						</ListItemButton>
// 					</ListItem>
// 					<ListItem
// 						key="Add New Projectile"
// 						disablePadding
// 						onClick={handleClick}
// 					>
// 						<ListItemButton component={Link} to="/addnewprojectile">
// 							<SidebarIconButton>
// 								<AddCircleIcon />
// 							</SidebarIconButton>
// 							<ListItemText primary="Add New Projectile" />
// 						</ListItemButton>
// 					</ListItem>
// 				</SidebarList>
// 				<Divider />
// 				<SidebarList>
// 					<ListItem key="Statistics" disablePadding onClick={handleClick}>
// 						<ListItemButton>
// 							<SidebarIcon>
// 								<BarChartIcon />
// 							</SidebarIcon>
// 							<ListItemText primary="Statistics" />
// 						</ListItemButton>
// 					</ListItem>
// 					<ListItem key="Data Management" disablePadding onClick={handleClick}>
// 						<ListItemButton>
// 							<SidebarIcon>
// 								<FolderCopyIcon />
// 							</SidebarIcon>
// 							<ListItemText primary="Data Management" />
// 						</ListItemButton>
// 					</ListItem>
// 				</SidebarList>
// 				<SidebarList sx={{ marginTop: "auto" }}>
// 					<ListItem key="Settings" disablePadding onClick={handleClick}>
// 						<ListItemButton>
// 							<SidebarIcon>
// 								<RoomPreferencesIcon />
// 							</SidebarIcon>
// 							<ListItemText primary="Settings" />
// 						</ListItemButton>
// 					</ListItem>
// 					<ListItem key="Login" disablePadding onClick={setModalVisible}>
// 						<ListItemButton>
// 							<SidebarIcon>
// 								<LoginIcon />
// 							</SidebarIcon>
// 							<ListItemText primary="Login" />
// 						</ListItemButton>
// 					</ListItem>
// 				</SidebarList>
// 			</Drawer>
// 			<LoginModal modalVisible={modalVisible} closeModal={closeModal} />
// 		</>
// 	);
// }

// export default Sidebar;

import { useState } from "react";
import logger from "../logger.js";
import LoginModal from "./LoginModal";
import { Link } from "react-router-dom";

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
import BarChartIcon from "@mui/icons-material/BarChart";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import LoginIcon from "@mui/icons-material/Login";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExploreIcon from "@mui/icons-material/Explore";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

const drawerWidth = 240;

const SidebarList = styled(List)(() => ({
	padding: "10px",
	"&& .Mui-selected, && .Mui-selected:hover": {
		backgroundColor: "#cda057",
		borderRadius: "7px",
		"&, & .MuiListItemIcon-root": {
			color: "white",
		},
	},
	"& .MuiListItemButton-root:hover": {
		backgroundColor: "#cda057",
		borderRadius: "7px",
		"&, & .MuiListItemIcon-root": {
			color: "white",
		},
	},
}));

const SidebarIcon = styled(ListItemIcon)(() => ({
	minWidth: "47px",
}));

const SidebarIconButton = styled(IconButton)(() => ({
	minWidth: "47px",
}));

function Sidebar() {
	const [modalVisible, setModalShow] = useState(false);

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
				<SidebarList>
					<ListItem key="Home" disablePadding onClick={handleClick}>
						<ListItemButton
							component={Link}
							to="/catalogue"
							{...{ pros: "Catalogue" }}
						>
							<SidebarIcon>
								<HomeIcon />
							</SidebarIcon>
							<ListItemText primary="Home" />
						</ListItemButton>
					</ListItem>
					<ListItem key="Site" disablePadding onClick={handleClick}>
						<ListItemButton component={Link} to="/sites" {...{ pros: "Sites" }}>
							<SidebarIconButton>
								<ExploreIcon />
							</SidebarIconButton>
							<ListItemText primary="Site" />
						</ListItemButton>
					</ListItem>
					<ListItem
						key="Add New Projectile"
						disablePadding
						onClick={handleClick}
					>
						<ListItemButton component={Link} to="/addnewprojectile">
							<SidebarIconButton>
								<AddCircleIcon />
							</SidebarIconButton>
							<ListItemText primary="Add New Projectile" />
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
					<ListItem key="Login" disablePadding onClick={setModalVisible}>
						<ListItemButton>
							<SidebarIcon>
								<LoginIcon />
							</SidebarIcon>
							<ListItemText primary="Login" />
						</ListItemButton>
					</ListItem>
				</SidebarList>
			</Drawer>
			<LoginModal modalVisible={modalVisible} closeModal={closeModal} />
		</>
	);
}

export default Sidebar;
