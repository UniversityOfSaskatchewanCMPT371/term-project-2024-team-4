import { useState } from "react";
import logger from "../logger.js";
import axios from "axios";

// MUI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// eslint-disable-next-line react/prop-types
function LoginModal({ modalVisible, closeModal }) {
	const [userName, setUserName] = useState();
	const [password, setPassword] = useState();

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.post("http://localhost:3000/users", {
				userName,
				password,
			});

			/***
			 * These loggers are for testing to make sure that the information is properly passed
			 * MAKE SURE THESE ARE REMOVED BEFORE RELEASE, VERY IMPORTANT
			 */
			logger.info("Username entered: " + userName);
			logger.info("Password entered: " + password);

			if (response.status === 200) {
				// Login successful
				alert("Login successful");
				closeModal(); // Close the modal after successful login
				window.location.reload();
			}
		} catch (error) {
			if (error.response) {
				// Request made and server responded with a status code that falls out of the range of 2xx
				if (error.response.status === 401) {
					// Unauthorized: Invalid username or password
					alert("Invalid username or password");
				} else {
					// Other server errors
					alert("An error occurred. Please try again later.");
				}
			} else if (error.request) {
				// The request was made but no response was received
				alert("Network error. Please check your internet connection.");
			} else {
				// Something happened in setting up the request that triggered an error
				console.error("Error:", error.message);
			}
		}
	};

	/**
	 * This is for when the username is entered into the textbox to update the state of the component
	 */
	const userNameChanged = (event) => {
		setUserName(event.target.value);
	};

	/**
	 * For when the password is entered into the texbox to update the state of the component
	 */
	const passwordChanged = (event) => {
		setPassword(event.target.value);
	};

	return (
		<>
			<Dialog
				open={modalVisible}
				onClose={closeModal}
				PaperProps={{
					component: "form",
					onSubmit: (event) => {
						event.preventDefault();
						const formData = new FormData(event.currentTarget);
						const formJson = Object.fromEntries(formData.entries());
						const email = formJson.email;
						console.log(email);
						this.handleClose();
					},
				}}
			>
				<DialogTitle>Admin</DialogTitle>
				<DialogContent>
					<DialogContentText>Lorem ipsum dolor sit amet.</DialogContentText>
					<TextField
						autoFocus
						required
						margin="dense"
						id="adminusername"
						name="username"
						placeholder="Username"
						type="string"
						fullWidth
						variant="outlined"
						onChange={userNameChanged}
					/>
					<TextField
						required
						margin="dense"
						id="adminpassword"
						name="password"
						placeholder="Password"
						type="password"
						fullWidth
						variant="outlined"
						onChange={passwordChanged}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeModal}>Cancel</Button>
					<Button onClick={handleSubmit} type="submit">
						Login
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default LoginModal;
