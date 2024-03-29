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

const SettingsPage = () => {
	const [username, setUsername] = useState(null);
	const [changeUsernameModalVisible, setChangeUsernameModalVisible] = useState(false);
	const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);

	useEffect(() => {
		// Fetch username when component mounts
		const fetchUsername = async () => {
			try {
				const response = await http.get("/users/1");
				setUsername(response.data.username);
			} catch (error) {
				console.error("Error fetching username:", error);
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
		<Container>
			<Sidebar />
			<Typography variant="h4" style={{ color: "black", fontWeight: "bold", transform: "translateY(200%) translateX(10%)" }}>
                Change Credentials
			</Typography>
			<Typography variant="body1" style={{ color: "black", transform: "translateY(370%) translateX(10.2%)" }}>
                Username: {username || "Loading..."}  <Button variant="contained" onClick={openChangeUsernameModal}> Change Username </Button>
			</Typography>
			<Typography variant="body1" style={{ color: "black", transform: "translateY(450%) translateX(10.2%)" }}>
                Password <LockIcon sx={{ marginRight: "27px", marginTop: "5px" }} /> <Button variant="contained" onClick={openChangePasswordModal}> Change Password </Button>
			</Typography>
			<ChangeUsernameModal modalVisible={changeUsernameModalVisible} closeModal={closeChangeUsernameModal} />
			<ChangePasswordModal modalVisible={changePasswordModalVisible} closeModal={closeChangePasswordModal} />
		</Container>
		
	);
};

export default SettingsPage;
