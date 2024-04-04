import { useState } from "react";
import log from "../logger.js";
import http from "../../http.js";

// MUI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

/**
 * Modal for admin user login
 * @param {boolean} modalVisible to set modal visibility
 * @param {function} closeModal hide modal
 * @pre None
 * @post Renders login modal
 * @returns {JSX.Element} LoginModal React component
 */
// eslint-disable-next-line react/prop-types
function LoginModal({ modalVisible, closeModal }) {
	const [userName, setUserName] = useState();
	const [password, setPassword] = useState();

	/**
	 * Submit login information for authentication
	 * @param {object} event login form values
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await http.post("/users", {
				userName,
				password,
			});

			/***
			 * These loggers are for testing to make sure that the information is properly passed
			 * MAKE SURE THESE ARE REMOVED BEFORE RELEASE, VERY IMPORTANT
			 */
			log.info("Username entered: " + userName);
			log.info("Password entered: " + password);

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
	 * Set user name value every textfield input change
	 * @param {object} event input textfield event object
	 */
	const userNameChanged = (event) => {
		setUserName(event.target.value);
	};

	/**
	 * Set password value every textfield input change
	 * @param {object} event input textfield event object
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
				<DialogTitle>Login</DialogTitle>
				<DialogContent>
					<DialogContentText marginBottom={0.5}>
						Welcome to PCubed
					</DialogContentText>
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
