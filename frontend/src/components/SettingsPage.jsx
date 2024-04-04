// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import http from "../../http.js";
// import Grid from "@mui/material/Grid";
import ChangeUsernameModal from "./ChangeUsernameModal.jsx";
import ChangePasswordModal from "./ChangePasswordModal.jsx";
import log from "../logger.js";
import BaseLayout from "./BaseLayout.jsx";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import {
	Avatar,
	Alert,
	Snackbar,
	Typography,
	Grid,
	Button,
	List,
	ListItem,
	ListItemText,
	Box,
	TextField,
	IconButton,
} from "@mui/material";

/**
 * Settings Page
 * Includes Sections:
 * [Title, Catalogue Name, IP, Profile Picture]
 * [Role Management] (non-functional)
 * [Reset to Default Credentials]
 * [User Info]
 * [Change Credentials (username/password)]
 */
const SettingsPage = () => {
	// define vars
	const [catalogueName, setCatalogueName] = useState("");
	const [editingCatalogueName, setEditingCatalogueName] = useState(false);
	const [newCatalogueName, setNewCatalogueName] = useState("");
	const [userInfo, setUserInfo] = useState({ username: "", role: "", id: "" });

	// define modals
	const [changeUsernameModalVisible, setChangeUsernameModalVisible] =
		useState(false);
	const [changePasswordModalVisible, setChangePasswordModalVisible] =
		useState(false);
	const [Cataloguedescription, setDescriptionName] = useState("");
	const [newCatalogueDescription, setNewCatalogueDescription] = useState("");
	const [editingCatalogueDescription, setEditingCatalogueDescription] =
		useState(false);

	// define alert
	const [alertInfo, setAlertInfo] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	// define functionals
	const [refreshUserInfo, setRefreshUserInfo] = useState(0);

	const ip = window.location.host;

	// fetch catalogue data from API
	useEffect(() => {
		http
			.get("/catalogues/1") // NOTE: HARDCODED (ONLY 1 CATALOGUE)
			.then((response) => {
				setCatalogueName(response.data.name);
				setDescriptionName(response.data.description);
			})
			.catch((error) => {
				log.error("Error fetching Catalogue data:", error);
			});
	}, []);

	// fetch user data from API
	useEffect(() => {
		http
			.get("/users")
			.then((response) => {
				const userData = response.data;
				setUserInfo({
					username: userData.username,
					role: userData.role,
					id: userData.id,
				});
			})
			.catch((error) => {
				log.error("Error fetching user info:", error);
			});
	}, [refreshUserInfo]);

	// route to reset default credentials
	const resetDefaultCredentials = () => {
		http
			.patch("/users/resetDefaultUser")
			.then((response) => {
				if (response.status === 200) {
					setAlertInfo({
						open: true,
						message: "Default credentials have been reset successfully.",
						severity: "success",
					});
					log.info("Credentials Reset, received 200 OK response");
				} else {
					setAlertInfo({
						open: true,
						message: "Something unexpected occurred. Please try again.",
						severity: "info",
					});
					log.warn("Credential Reset received an unexpected response");
				}
				// fetch user data again upon change
				setRefreshUserInfo((count) => count + 1);
			})
			.catch((error) => {
				setAlertInfo({
					open: true,
					message: "Failed to reset to default credentials.",
					severity: "error",
				});
				log.error("Failed to reset to default credentials:", error);
			});
	};

	const handleEditCatalogueName = () => {
		setEditingCatalogueName(true);
		setNewCatalogueName(catalogueName);
	};

	const handleSaveCatalogueName = () => {
		http
			.put("/catalogues/1", {
				name: newCatalogueName,
				description: Cataloguedescription,
			})
			.then(() => {
				setCatalogueName(newCatalogueName);
				setEditingCatalogueName(false);
			})
			.catch((error) => {
				console.error("Error updating catalogue name:", error);
			});
	};

	const handleEditCatalogueDescription = () => {
		setEditingCatalogueDescription(true);
		setNewCatalogueDescription(Cataloguedescription);
	};

	const handleSaveCatalogueDescription = () => {
		http
			.put("/catalogues/1", {
				name: catalogueName,
				description: newCatalogueDescription,
			})
			.then(() => {
				setDescriptionName(newCatalogueDescription);
				setEditingCatalogueDescription(false);
			})
			.catch((error) => {
				console.error("Error updating catalogue name:", error);
			});
	};

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
				<Grid container spacing={5} marginTop={0}>
					<Grid item xs={12} md={4}>
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
								<Box sx={{ display: "flex", alignItems: "center" }}>
									{editingCatalogueName ? (
										<>
											<Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
												<TextField
													value={newCatalogueName}
													onChange={(e) => setNewCatalogueName(e.target.value)}
													variant="outlined"
													margin="normal"
												/>

												<Button
													variant="contained"
													onClick={handleSaveCatalogueName}
												>
													Save
												</Button>
											</Box>
										</>
									) : (
										<>
											<Typography variant="h5">{catalogueName}</Typography>
											<IconButton onClick={handleEditCatalogueName}>
												<EditOutlinedIcon />
											</IconButton>
										</>
									)}
								</Box>
								<Typography
									variant="h6"
									sx={{ marginTop: 0, marginLeft: 0.5, fontWeight: 1 }}
								>
									{ip}
								</Typography>
							</Box>
						</Box>
					</Grid>

					{/* Right Side Grid: */}
					<Grid item xs={12} md={8}>
						{/* Section 1: User Info */}
						<Typography variant="h5" fontWeight="medium" gutterBottom>
							Description
						</Typography>
						<Box
							sx={{
								border: 1,
								borderColor: "grey.300",
								borderRadius: "16px",
								p: 3,
								bgcolor: "background.paper",
								marginBottom: 2,
								display: "flex",
								flexDirection: "row",
							}}
						>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								{editingCatalogueDescription ? (
									<>
										<Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
											<TextField
												value={newCatalogueDescription}
												onChange={(e) =>
													setNewCatalogueDescription(e.target.value)
												}
												variant="outlined"
												margin="normal"
											/>
											<Button
												variant="contained"
												onClick={handleSaveCatalogueDescription}
											>
												Save
											</Button>
										</Box>
									</>
								) : (
									<>
										<Typography variant="body1">
											{Cataloguedescription}
										</Typography>
										<IconButton onClick={handleEditCatalogueDescription}>
											<EditOutlinedIcon />
										</IconButton>
									</>
								)}
							</Box>
						</Box>
					</Grid>
				</Grid>

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
							<Button
								variant="contained"
								sx={{ order: { xs: 1, sm: 2 } }}
								onClick={resetDefaultCredentials}
							>
								Reset to Default
							</Button>
						</Box>
					</Grid>

					{/* Right Side Grid: */}
					<Grid item xs={12} md={5}>
						{/* Section 1: User Info */}
						<Typography variant="h5" fontWeight="medium" gutterBottom>
							User Info
						</Typography>
						<Box
							sx={{
								border: 1,
								borderColor: "grey.300",
								borderRadius: "16px",
								p: 3,
								bgcolor: "background.paper",
								marginBottom: 2,
								display: "flex",
								flexDirection: "column",
							}}
						>
							<Box>
								<Typography
									variant="subtitle1"
									component="span"
									fontWeight="medium"
								>
									User ID:
								</Typography>
								<Typography
									variant="body1"
									component="span"
									sx={{ marginLeft: 1 }}
								>
									{userInfo.id}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant="subtitle1"
									component="span"
									fontWeight="medium"
								>
									Username:
								</Typography>
								<Typography
									variant="body1"
									component="span"
									sx={{ marginLeft: 1 }}
								>
									{userInfo.username}
								</Typography>
							</Box>
							<Box>
								<Typography
									variant="subtitle1"
									component="span"
									fontWeight="medium"
								>
									Role:
								</Typography>
								<Typography
									variant="body1"
									component="span"
									sx={{ marginLeft: 1 }}
								>
									{userInfo.role}
								</Typography>
							</Box>
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

			{/* To show alerts on the middle-bottom of the screen */}
			<Snackbar
				open={alertInfo.open}
				autoHideDuration={3000}
				onClose={() => setAlertInfo({ ...alertInfo, open: false })}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setAlertInfo({ ...alertInfo, open: false })}
					severity={alertInfo.severity}
					sx={{ width: "100%" }}
				>
					{alertInfo.message}
				</Alert>
			</Snackbar>
		</BaseLayout>
	);
};

export default SettingsPage;
