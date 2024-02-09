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
        <div className='col'>
          <div className='container'>
            <h2>&lt; Catalogue &lt;Museum of Anthropology&gt; / X Farm</h2>
            {/* <HelloWorld />
            <Link to="helloworld">Say Hi!</Link> */}
            <div>
              {/* <Button variant="primary" onClick={() => setModalShow(true)}>
                Login
              </Button> */}
            </div>
            <div class="row">
              <div class="col">
                1 of 2
              </div>
              <div class="col">
                2 of 2
              </div>
            </div>
            <div class="row">
              <div class="col">
                1 of 3
              </div>
              <div class="col">
                2 of 3
              </div>
              <div class="col">
                3 of 3
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
