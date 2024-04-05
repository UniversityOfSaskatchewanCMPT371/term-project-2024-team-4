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
 * Modal component for changing user password.
 * @param {boolean} modalVisible - Boolean value to set modal visibility.
 * @param {function} closeModal - Function to hide the modal.
 * @returns {JSX.Element} - ChangePasswordModal React component.
 */
// eslint-disable-next-line react/prop-types
function ChangePasswordModal({ modalVisible, closeModal }) {
	const [newPassword, setNewPassword] = useState("");
	const [password, setOldPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [errors, setErrors] = useState({
		newPassword: "",
	});

	// validation rules
	const validateForm = () => {
		let isValid = true;
		const newErrors = {
			newPassword: "",
		};

		// validate new password based on backend validation rules
		if (!newPassword.trim()) {
			newErrors.newPassword = "Password is required.";
			isValid = false;
		} else if (newPassword.length < 8) {
			newErrors.newPassword = "Password must be at least 8 characters long.";
			isValid = false;
		} else if (
			!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?]).+$/.test(
				newPassword,
			)
		) {
			newErrors.newPassword =
				"Password must include uppercase, lowercase, numbers, and special characters.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	/**
	 * Submit login information for authentication.
	 * @param {object} event - Event object representing form submission.
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validateForm()) {
			log.debug("Change password modal fails frontend validation");
			return;
		}

		if (confirmPassword !== newPassword) {
			alert("Confirmed Passwords do not match");
			return;
		}

		try {
			const response = await http.patch("/users/changePassword", {
				oldPassword: password,
				newPassword: newPassword,
			});

			log.info("Password change request made");

			if (response.status === 200) {
				alert("Password Changed succesfully");
				closeModal();
				window.location.reload();
			} else {
				alert("An unexpected status was received. Please try again later.");
			}
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401 || error.response.status === 422) {
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
	 * Handle password change event.
	 * @param {object} event - Event object representing text field input change.
	 */
	const passwordChanged = (event) => {
		setNewPassword(event.target.value);
	};

	/**
	 * Handle old password change event.
	 * @param {object} event - Event object representing text field input change.
	 */
	const oldPassword = (event) => {
		setOldPassword(event.target.value);
	};

	/**
	 * Handle confirmed password change event.
	 * @param {object} event - Event object representing text field input change.
	 */
	const ConfirmPasswordChanged = (event) => {
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
				<DialogTitle>Change Password</DialogTitle>
				<DialogContent>
					<DialogContentText>Enter Original Password</DialogContentText>
					<TextField
						autoFocus
						required
						margin="dense"
						id="adminoldusername"
						name="oldpassword"
						placeholder="Original/Old Password"
						type="password"
						fullWidth
						variant="outlined"
						onChange={oldPassword}
					/>
					<DialogContentText marginTop={"1rem"}>
						Enter New Password
					</DialogContentText>
					<TextField
						required
						margin="dense"
						id="adminpassword"
						name="password"
						placeholder="New Password"
						type="password"
						fullWidth
						variant="outlined"
						onChange={passwordChanged}
						error={!!errors.newPassword}
						helperText={errors.newPassword}
					/>
					<DialogContentText marginTop={"1rem"}>
						Confirm New Password
					</DialogContentText>
					<TextField
						required
						margin="dense"
						id="adminconfirmpassword"
						name="Confirmpassword"
						placeholder="Confirm New Password"
						type="password"
						fullWidth
						variant="outlined"
						onChange={ConfirmPasswordChanged}
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

export default ChangePasswordModal;
