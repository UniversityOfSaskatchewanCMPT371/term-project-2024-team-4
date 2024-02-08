import { useState } from 'react'
// import { Link } from "react-router-dom";
// import HelloWorld from './HelloWorld/'
// import './App.css'
import Sidebar from './Sidebar';
import LoginModal from './LoginModal';
import Button from 'react-bootstrap/Button';

function App() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div className="row">
        <div className='col-3'>
          <Sidebar />
        </div>
        <div className='col-9'>
          <h1>Projectile</h1>
          {/* <HelloWorld />
          <Link to="helloworld">Say Hi!</Link> */}
          <div>
            <Button variant="primary" onClick={() => setModalShow(true)}>
              Login
            </Button>

            <LoginModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
