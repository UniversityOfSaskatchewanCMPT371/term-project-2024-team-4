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
 * Modal component for changing user username.
 * @param {boolean} modalVisible - Boolean value to set modal visibility.
 * @param {function} closeModal - Function to hide the modal.
 * @returns {JSX.Element} - ChangeUsernameModal React component.
 */
// eslint-disable-next-line react/prop-types
function ChangeUsernameModal({ modalVisible, closeModal }) {
	const [userName, setNewUserName] = useState();
	const [password, setConfirmPassword] = useState();
	// const [checkPassword, setCheckPassword] = useState();

	/**
	 * Submit username change request.
	 * @param {object} event - Event object representing form submission.
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await http.post("/users/check-password", {
				password,
			});
			log.info("New Username entered: " + password);

			if (response.status === 200) {
				const response = await http.patch("/users/1/username", {
					userName,
				});

				log.info("New Username entered: " + userName);

				if (response.status === 200) {
					alert("Username Changed successful");
					closeModal();
					window.location.reload();
				}
			}
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401) {
					alert("Password does not match");
				} else {
					alert("An error occurred. Please try again later.");
				}
			} else if (error.request) {
				alert("Network error. Please check your internet connection.");
			} else {
				console.error("Error:", error.message);
				log.error("Error:", error.message);
			}
		}
	};

	/**
	 * Handle username change event.
	 * @param {object} event - Event object representing text field input change.
	 */
	const userNameChanged = (event) => {
		setNewUserName(event.target.value);
	};

	/**
	 * Handle password change event.
	 * @param {object} event - Event object representing text field input change.
	 */
	const passwordChanged = (event) => {
		setConfirmPassword(event.target.value);
	};

	return (
		<>
			<Dialog
				open={modalVisible}
				onClose={closeModal}
				PaperProps={{
					sx: {
						width: "50%", // Adjust width as needed
						height: "auto", // Set height to 'auto' for dynamic content
					},
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
				<DialogTitle>Change Username</DialogTitle>
				<DialogContent>
					<DialogContentText>New Username</DialogContentText>
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
					<DialogContentText> Confirm password</DialogContentText>
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
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default ChangeUsernameModal;