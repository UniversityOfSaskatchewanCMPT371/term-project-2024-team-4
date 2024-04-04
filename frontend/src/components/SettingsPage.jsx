// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import Sidebar from "./Sidebar.jsx";
import http from "../../http.js";
// import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import ChangeUsernameModal from "./ChangeUsernameModal.jsx";
import ChangePasswordModal from "./ChangePasswordModal.jsx";
import logger from "../logger.js";

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
	const [username, setUsername] = useState(null);
	const [changeUsernameModalVisible, setChangeUsernameModalVisible] =
		useState(false);
	const [changePasswordModalVisible, setChangePasswordModalVisible] =
		useState(false);

	useEffect(() => {
		// Fetch username when component mounts
		const fetchUsername = async () => {
			try {
				const response = await http.get("/users/1");
				setUsername(response.data.username);
				logger.error(" username:", response.data.username);
			} catch (error) {
				console.error("Error fetching username:", error);
				logger.error("Error fetching username:", error);
			}
		};

		fetchUsername(); // Invoke the fetchUsername function
	}, []); // Empty dependency array to ensure the effect runs only once when the component mounts

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
		<Container
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
			}}
		>
			<Sidebar />
			<Typography
				variant="h4"
				style={{
					color: "black",
					fontWeight: "bold",
					transform: "translateY(200%) translateX(10%)",
					marginLeft: "10%",
					marginBottom: "1rem",
				}}
			>
				Change Credentials
			</Typography>
			<div
				style={{
					transform: "translateY(370%) translateX(10.2%)",
					display: "flex",
					justifyContent: "space-between",
					width: "35%",
					marginLeft: "10%",
					marginBottom: "1rem",
				}}
			>
				<Typography
					variant="body1"
					style={{ color: "black", marginBottom: "0.5rem" }}
				>
					Username: {username || "Loading..."}
				</Typography>
				<Button variant="contained" onClick={openChangeUsernameModal}>
					{" "}
					Change Username{" "}
				</Button>
			</div>
			<div
				style={{
					transform: "translateY(370%) translateX(10.2%)",
					display: "flex",
					justifyContent: "space-between",
					width: "35%",
					marginLeft: "10%",
					marginBottom: "1rem",
				}}
			>
				<Typography
					variant="body1"
					style={{ color: "black", marginBottom: "0.5rem" }}
				>
					Password <LockIcon sx={{ marginRight: "27px", marginTop: "5px" }} />
				</Typography>
				<Button variant="contained" onClick={openChangePasswordModal}>
					{" "}
					Change Password{" "}
				</Button>
			</div>
			<ChangeUsernameModal
				modalVisible={changeUsernameModalVisible}
				closeModal={closeChangeUsernameModal}
			/>
			<ChangePasswordModal
				modalVisible={changePasswordModalVisible}
				closeModal={closeChangePasswordModal}
			/>
		</Container>
	);
};

export default SettingsPage;
