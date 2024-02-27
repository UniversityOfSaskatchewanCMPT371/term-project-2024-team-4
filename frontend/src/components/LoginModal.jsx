import { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./LoginModal.css";
import logger from "../logger.js";
import axios from "axios"; // Import Axios

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

  async handleSubmit(e) {
    e.preventDefault();

    const { userName, password } = this.state;

    try {
      const response = await axios.post("http://localhost:3000/users", {
        userName,
        password,
      });
      logger.info("Username entered:" + this.state.userName);
      logger.info("Password entered:" + this.state.password);

      // Assuming successful login, you can perform further actions
      if (response.status === 200) {
        console.log(response.data);
        // Successful login
        this.setState({ loginStatus: "success" }); // Update loginStatus state
        this.props.onLogin();
        this.props.onHide();
      } else {
        // Unsuccessful login
        this.setState({ loginStatus: "failed" }); // Update loginStatus state
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle error
    }
  }

  /**
   * This is for when the username is entered into the textbox to update the state of the component
   */
  userNameChanged(e) {
    this.setState((state) => ({ ...state, userName: e.target.value }));
  }

  /**
   * For when the password is entered into the texbox to update the state of the component
   */
  passwordChanged(e) {
    this.setState((state) => ({ ...state, password: e.target.value }));
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
            <Button variant="secondary" onClick={this.props.onHide}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              Login
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default LoginModal;
