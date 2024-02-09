import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Sidebar.css';
import LoginModal from './LoginModal';
import logger from '../logger.js';

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false
        };

        this.setModalShow = this.setModalShow.bind(this);
        this.setModalHidden = this.setModalHidden.bind(this);

        logger.info("Sidebar component rendered.");
    }

    handleClick(e) {
        logger.info(e.target.innerText + " Sidebar navigation clicked.");
    }

    setModalShow(e) {
        this.handleClick(e);
        this.setState({ modalShow: true }, () => {
            logger.info("LoginModal shown.");
        });
    }

    setModalHidden() {
        this.setState({ modalShow: false }, () => {
            logger.info("LoginModal hidden.");
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="sidebar col-auto min-vh-100 d-flex justify-content-between flex-column">
                    <div>
                        <a className="title text-decoration-none d-none d-sm-inline d-flex align-items-center m-4">
                            <span className="fs-2 fw-bold">Projectile</span>
                        </a>
                        <hr className="d-none d-sm-block" />
                        <ul className="nav nav-pills flex-column mt-3 mt-sm-0">
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0">
                                <a href="#" onClick={this.handleClick} className="nav-link fs-5" aria-current="page">
                                    <i className="bi bi-house-door-fill"></i>
                                    <span className="ms-3 d-none d-sm-inline">Home</span>
                                </a>
                            </li>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0">
                                <a href="#" onClick={this.handleClick} className="nav-link fs-5" aria-current="page">
                                    <i className="bi bi-file-earmark-arrow-down-fill"></i>
                                    <span className="ms-3 d-none d-sm-inline">Connect</span>
                                </a>
                            </li>
                        </ul>
                        <hr className="d-none d-sm-block" />
                        <ul className="nav nav-pills flex-column mt-3 mt-sm-0">
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0">
                                <a href="#" onClick={this.handleClick} className="nav-link fs-5" aria-current="page">
                                    <i className="bi bi-clipboard2-data-fill"></i>
                                    <span className="ms-3 d-none d-sm-inline">Statistics</span>
                                </a>
                            </li>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0">
                                <a href="#" onClick={this.handleClick} className="nav-link fs-5" aria-current="page">
                                    <i className="bi bi-database-fill"></i>
                                    <span className="ms-3 d-none d-sm-inline">Data Management</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <ul className="nav nav-pills flex-column mt-3 mt-sm-0">
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0">
                                <a href="#" onClick={this.handleClick} className="nav-link fs-5" aria-current="page">
                                    <i className="bi bi-gear-fill"></i>
                                    <span className="ms-3 d-none d-sm-inline">Settings</span>
                                </a>
                            </li>
                            <li className="nav-item fs-4 my-1 py-2 py-sm-0">
                                <a href="#" className="nav-link fs-5" aria-current="page" onClick={this.setModalShow}>
                                    <i className="bi bi-box-arrow-in-right"></i>
                                    <span className="ms-3 d-none d-sm-inline">Login</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <LoginModal show={this.state.modalShow} onHide={this.setModalHidden} />
            </div>
        )
    }
}
  
export default Sidebar;