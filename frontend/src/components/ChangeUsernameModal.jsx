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
	const [userName, setNewUserName] = useState("");
	const [password, setConfirmPassword] = useState("");
	// const [checkPassword, setCheckPassword] = useState();
	const [errors, setErrors] = useState({
		userName: "",
	});

	// validation rules
	const validateForm = () => {
		let isValid = true;
		const newErrors = {
			userName: "",
		};

		// validate new username chosen based on backend validation rules
		if (!userName.trim()) {
			newErrors.userName = "Username is required.";
			isValid = false;
		} else if (userName.length < 3 || userName.length > 15) {
			newErrors.userName = "Username must be between 3 to 15 characters long.";
			isValid = false;
		} else if (!/^[a-zA-Z0-9!@#$%^&*(),.?]+$/.test(userName)) {
			newErrors.userName = "Username contains invalid characters.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};
	/**
	 * Submit username change request.
	 * @param {object} event - Event object representing form submission.
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validateForm()) {
			log.debug("Change Username Modal fails frontend validation");
			return;
		}

		try {
			const response = await http.patch("/users/changeUsername", {
				newUsername: userName,
				password: password,
			});

			log.info("Username change request made with new username: " + userName);

			if (response.status === 200) {
				alert("Username Changed successfully");
				closeModal();
				window.location.reload();
			} else {
				alert("An unexpected status was received. Please try again later.");
			}
		} catch (error) {
			if (error.response) {
				if (error.response.status === 422 || error.response.status === 500) {
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
						error={!!errors.userName}
						helperText={errors.userName}
					/>
					<DialogContentText marginTop={"1rem"}>
						{" "}
						Confirm password
					</DialogContentText>
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
