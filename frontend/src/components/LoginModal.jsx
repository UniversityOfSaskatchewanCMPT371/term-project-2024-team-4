import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

async function loginUser(credentials) {
    console.log("Login button clicked");
    return fetch('URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

function LoginModal(props) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      username,
      password
    });

    console.log("Username entered: " + username);
    console.log("Password entered: " + password);

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

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Login
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
        <Form.Group className="mb-3" controlId="loginFormUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="email"
              placeholder="Username"
              autoFocus
              onChange={e => setUserName(e.target.value)}
            />
        </Form.Group>
        <Form.Group className="mb-3" controlId="loginFormPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
              />
        </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal