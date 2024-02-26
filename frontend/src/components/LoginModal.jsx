import { Component } from "react";
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

class LoginModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userName: "",
			password: "",
		};

		/**
		 * These are to make sure the functions are defined for the component
		 */
		this.handleSubmit = this.handleSubmit.bind(this);
		this.userNameChanged = this.userNameChanged.bind(this);
		this.passwordChanged = this.passwordChanged.bind(this);
	}

	async handleSubmit(event) {
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
		logger.info("Username entered: " + this.state.userName);
		logger.info("Password entered: " + this.state.password);

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
	}

	/**
	 * This is for when the username is entered into the textbox to update the state of the component
	 */
	userNameChanged(event) {
		this.setState((state) => ({ ...state, userName: event.target.value }));
	}

	/**
	 * For when the password is entered into the texbox to update the state of the component
	 */
	passwordChanged(event) {
		this.setState((state) => ({ ...state, password: event.target.value }));
	}

	componentDidUpdate() {
		logger.info("LoginModal mounted properly");
	}

	render() {
		return (
			<>
				<Dialog
					// eslint-disable-next-line react/prop-types
					open={this.props.modalVisible}
					// eslint-disable-next-line react/prop-types
					onClose={this.props.closeModal}
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
							label="Username"
							type="string"
							fullWidth
							variant="outlined"
							onChange={this.userNameChanged}
						/>
						<TextField
							required
							margin="dense"
							id="adminpassword"
							name="password"
							label="Password"
							type="password"
							fullWidth
							variant="outlined"
							onChange={this.passwordChanged}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							// eslint-disable-next-line react/prop-types
							onClick={this.props.closeModal}
						>
							Cancel
						</Button>
						<Button onClick={this.handleSubmit} type="submit">
							Login
						</Button>
					</DialogActions>
				</Dialog>
			</>
		);
	}
}

// Define expected PropTypes
LoginModal.propTypes = {
	onHide: PropTypes.func.isRequired,
};

export default LoginModal;
