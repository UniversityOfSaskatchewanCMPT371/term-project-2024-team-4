import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './LoginModal.css';
import logger from '../logger.js';

async function loginUser(credentials) {
	logger.info("Login button clicked.");

	return fetch('URL', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	}).then(data => data.json());
}

class LoginModal extends Component {
  	constructor(props){
    	super(props);

    	this.state={
      		userName: "",
      		password: "",
    	};
    
    	this.handleSubmit=this.handleSubmit.bind(this);
    	this.userNameChanged=this.userNameChanged.bind(this);
    	this.passwordChanged=this.passwordChanged.bind(this);
  	}

  	async handleSubmit(e) {
    	e.preventDefault();

    	//**Not needed yet */
    	// const response = await loginUser({
    	//   username,
    	//   password
    	// });

    	/***
    	 * These loggers are for testing to make sure that the information is properly passed
    	 */
    	logger.info("Username submitted: " + this.state.userName);
    	logger.info("Password submitted: " + this.state.password);

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

	userNameChanged(e) {
		this.setState((state)=>({...state,
		userName:e.target.value}));
	}

	passwordChanged(e) {
		this.setState((state)=>({...state,
		password: e.target.value}));
	}

	componentDidUpdate() {
		logger.info("LoginModal mounted properly.");
	}

  	render() {
		return (
			<div>
				<Modal
				{...this.props}
				size="md"
				aria-labelledby="contained-modal-title-vcenter"
				centered
				animation={false}
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group className="mb-3" controlId="loginFormUsername">
								<Form.Label>Username</Form.Label>
								<Form.Control
								type="email"
								placeholder="Username"
								autoFocus
								onChange={this.userNameChanged}
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="loginFormPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control
								type="password"
								placeholder="Password"
								onChange={this.passwordChanged}
								/>
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.props.onHide}>Close</Button>
						<Button variant="primary" onClick={this.handleSubmit}>Login</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

export default LoginModal;