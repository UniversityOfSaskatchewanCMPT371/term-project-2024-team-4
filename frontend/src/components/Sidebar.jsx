import React, { Component } from 'react';
import './Sidebar.css';
import logger from '../logger.js';
import LoginModal from './LoginModal';

// MUI
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';


const drawerWidth = 240;

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

        console.log(this.state.modalShow);
        return (
            <>
                <Drawer
                    sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Toolbar />
                    <Divider />
                    <List>
                    {['Home', 'Connect'].map((text, index) => (
                        <ListItem key={text} disablePadding onClick={this.handleClick}>
                        <ListItemButton>
                            <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                        </ListItem>
                    ))}
                    </List>
                    <Divider />
                    <List>
                    {['Statistics', 'Data Management'].map((text, index) => (
                        <ListItem key={text} disablePadding onClick={this.handleClick}>
                        <ListItemButton>
                            <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                        </ListItem>
                    ))}
                    </List>
                    <Divider />
                    <List>
                    {['Settings', 'Login'].map((text, index) => (
                        <ListItem key={text} disablePadding onClick={this.setModalShow}>
                        <ListItemButton>
                            <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                        </ListItem>
                    ))}
                    </List>
                </Drawer>
                <LoginModal 
				isOpen={this.state.modalShow}
                />
            </>
        )
    }
}
  
export default Sidebar;