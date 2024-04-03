// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import http from "../../http.js";
// import Grid from "@mui/material/Grid";
import ChangeUsernameModal from "./ChangeUsernameModal.jsx";
import ChangePasswordModal from "./ChangePasswordModal.jsx";
import log from "../logger.js";
import BaseLayout from "./BaseLayout.jsx";
import {
	Avatar,
	Typography,
	Grid,
	Button,
	List,
	ListItem,
	ListItemText,
	Box,
} from "@mui/material";

/**
 * Component: SettingsPage

Dependencies:
- React
- useState
- useEffect
- Container
- Typography
- Button
- LockIcon
- ChangeUsernameModal
- ChangePasswordModal
- Sidebar
- http (HTTP client for making requests)
- logger (for logging)

Behavior:
- Fetches the current username from the server when the component mounts.
- Provides buttons to open modal dialogs for changing username and password.
- Displays the current username and a button to change the username.
- Displays a button to change the password, accompanied by a lock icon.
- Modals for changing username and password are rendered conditionally based on state variables.
- Logs errors encountered during fetching username.
- Handles user interactions to open and close modal dialogs for changing username and password.
- Ensures proper layout and styling using MUI components.
 * 
 */
const SettingsPage = () => {
	// define vars
	const [catalogueName, setCatalogueName] = useState("");
	const [changeUsernameModalVisible, setChangeUsernameModalVisible] =
		useState(false);
	const [changePasswordModalVisible, setChangePasswordModalVisible] =
		useState(false);

	const ip = window.location.host;

	// fetch var data from API
	useEffect(() => {
		http
			.get("/catalogues/1") // NOTE: HARDCODED (ONLY 1 CATALOGUE)
			.then((response) => {
				setCatalogueName(response.data.name);
			})
			.catch((error) => {
				log.error("Error fetching Catalogue data:", error);
			});
	}, []);

	// other states
	const closeChangeUsernameModal = () => {
		setChangeUsernameModalVisible(false);
	};

	const openChangeUsernameModal = () => {
		setChangeUsernameModalVisible(true);
	};

	const closeChangePasswordModal = () => {
		setChangePasswordModalVisible(false);
	};

	const openChangePasswordModal = () => {
		setChangePasswordModalVisible(true);
	};
	return (
		<BaseLayout>
			<Box sx={{ flexGrow: 1, marginLeft: 1, paddingRight: "1rem" }}>
				{/* Title Header */}
				<Typography variant="h4" sx={{ marginBottom: 4, fontWeight: "bold" }}>
					Settings
				</Typography>

				{/* Profile Picture, Username, IP Addres*/}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						marginBottom: 4,
						marginLeft: 2,
					}}
				>
					<Avatar
						alt="Profile Picture"
						// Note: Currently a random photo (not implemented)
						src="https://media.cntraveler.com/photos/5a7b50d069c80815f37e604e/16:9/w_2560,c_limit/British-Museum__2018_00917427_001.jpg"
						sx={{ width: "6rem", height: "6rem" }}
					/>
					<Box sx={{ marginLeft: 2 }}>
						<Typography variant="h5">{catalogueName}</Typography>
						<Typography
							variant="h6"
							sx={{ marginTop: 0, marginLeft: 0.5, fontWeight: 1 }}
						>
							{ip}
						</Typography>
					</Box>
				</Box>

				<Grid container spacing={5} marginTop={5}>
					{/* Left Side Grid: */}
					<Grid item xs={12} md={7}>
						{/* Roles Section */}
						<Typography variant="h5" fontWeight={"medium"} gutterBottom>
							Roles
						</Typography>
						<Box
							sx={{
								border: 1,
								borderColor: "grey.300",
								borderRadius: "16px",
								padding: 2,
								bgcolor: "background.paper",
								marginBottom: 2,
							}}
						>
							<List style={{ maxHeight: 300, overflow: "scroll" }}>
								{/* NOTE: CURRENTLY HARDCODED; ASSUMING CHANGE OF FUNCTIONALITY HERE */}
								<ListItem>
									<ListItemText
										primary="Admin"
										secondary="Permissions: View, Add, Remove, Edit, Import, Export"
									/>
								</ListItem>
								<ListItem>
									<ListItemText
										primary="Tester"
										secondary="Permissions: View, Add, Remove, Edit, Import, Export"
									/>
								</ListItem>
								<ListItem>
									<ListItemText primary="User" secondary="Permissions: View" />
								</ListItem>
							</List>
							<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
								<Button variant="outlined" sx={{ marginTop: "2rem" }}>
									Manage Roles
								</Button>
							</Box>
						</Box>

						{/* Reset to Default Settings Section */}
						<Box
							sx={{
								border: 1,
								borderColor: "grey.300",
								borderRadius: "16px",
								padding: 4,
								bgcolor: "background.paper",
								marginTop: "4rem",
								display: "flex",
								flexDirection: { xs: "column", sm: "row" },
								justifyContent: "space-between",
								alignItems: "center",
								gap: 2,
							}}
						>
							<Typography
								variant="body1"
								sx={{
									flexGrow: 1,
									textAlign: "center",
									order: { xs: 2, sm: 1 },
								}}
							>
								Reset to Default Credentials
							</Typography>
							<Button variant="contained" sx={{ order: { xs: 1, sm: 2 } }}>
								Reset to Default
							</Button>
						</Box>
					</Grid>

					{/* Right Side Grid: */}
					<Grid item xs={12} md={5}>
						{/* Section 1: Placeholder*/}
						<Typography variant="h5" fontWeight={"medium"} gutterBottom>
							Lorem
						</Typography>
						<Box
							sx={{
								border: 1,
								borderColor: "grey.300",
								borderRadius: "16px",
								padding: 3,
								bgcolor: "background.paper",
								marginBottom: 2,
								gap: 2,
							}}
						>
							<Typography variant="body1">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							</Typography>
							<Button variant="contained" sx={{ marginTop: 2 }}>
								Ipsum
							</Button>
						</Box>

						{/* Section 2: Change Credentials*/}
						<Typography
							variant="h5"
							fontWeight={"medium"}
							marginTop={"4rem"}
							gutterBottom
						>
							Change Credentials
						</Typography>
						<Box
							sx={{
								border: 1,
								borderColor: "grey.300",
								borderRadius: "16px",
								padding: 3,
								bgcolor: "background.paper",
								marginBottom: 2,
							}}
						>
							<Typography variant="body1">
								Change your Username and Password
							</Typography>
							<Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
								<Button variant="contained" onClick={openChangeUsernameModal}>
									Change Username
								</Button>
								<Button variant="outlined" onClick={openChangePasswordModal}>
									Change Password
								</Button>
							</Box>
						</Box>
					</Grid>
				</Grid>

				{/* Section for Modals -- note positioning is inside <Box> */}
				<ChangeUsernameModal
					modalVisible={changeUsernameModalVisible}
					closeModal={closeChangeUsernameModal}
				/>
				<ChangePasswordModal
					modalVisible={changePasswordModalVisible}
					closeModal={closeChangePasswordModal}
				/>
			</Box>
		</BaseLayout>
	);
};

export default SettingsPage;
