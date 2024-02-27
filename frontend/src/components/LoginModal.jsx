import React, { useState } from 'react';
import logger from "../logger.js";
import PropTypes from "prop-types";

// MUI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// TODO: fetch login credentials using API endpoint
// async function loginUser(credentials) {
// 	logger.info("Login button clicked");

// 	return fetch("URL", {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify(credentials),
// 	}).then((data) => data.json());
// }

function LoginModal({ modalVisible, closeModal }) {
	const [userName, setUserName] = useState();
  	const [password, setPassword] = useState();

	const handleSubmit = async event => {
		event.preventDefault();

		//**Not needed yet */
		// const response = await loginUser({
		//   username,
		//   password
		// });

		/***
		 * These loggers are for testing to make sure that the information is properly passed
		 * MAKE SURE THESE ARE REMOVED BEFORE RELEASE, VERY IMPORTANT
		 */
		logger.info("Username entered: " + userName);
		logger.info("Password entered: " + password);

		//**Not needed yet */
		// if ('accessToken' in response) {
		//   swal("Success", response.message, "success", {
		//     buttons: false,
		//     timer: 2000,
		//   })
		//   .then((value) => {
		//     localStorage.setItem('accessToken', response['accessToken']);
		//     localStorage.setItem('user', JSON.stringify(response['user']));
		//     window.location.href = "/profile";
		//   });
		// } else {
		//   // Login failed alert message
		// }
	};

	/**
	 * This is for when the username is entered into the textbox to update the state of the component
	 */
	const userNameChanged = event => {
		setUserName(event.target.value)
	};

	/**
	 * For when the password is entered into the texbox to update the state of the component
	 */
	const passwordChanged = event => {
		setPassword(event.target.value)
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
					<Button
						onClick={closeModal}
					>
						Cancel
					</Button>
					<Button onClick={handleSubmit} type="submit">
						Login
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default LoginModal;
