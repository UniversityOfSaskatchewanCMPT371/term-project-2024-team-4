import { useState } from 'react'
import { Link } from "react-router-dom";
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import HelloWorld from './HelloWorld/'
import './App.css'
import LoginModal from './LoginModal';
import Button from 'react-bootstrap/Button';

function App() {
  const [count, setCount] = useState(0)
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <HelloWorld />
      <Link to="helloworld">Say Hi!</Link>
      <div>
        <Button variant="primary" onClick={() => setModalShow(true)}>
          Launch vertically centered modal
        </Button>

        <LoginModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
      <div className="">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
