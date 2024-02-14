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
import HomeIcon from '@mui/icons-material/Home';
import UploadIcon from '@mui/icons-material/Upload';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import LoginIcon from '@mui/icons-material/Login';


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
                    <List>
                        <ListItem key='Home' disablePadding onClick={this.handleClick}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary='Home' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='Connect' disablePadding onClick={this.handleClick}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <UploadIcon />
                                </ListItemIcon>
                                <ListItemText primary='Connect' />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem key='Statistics' disablePadding onClick={this.handleClick}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <BarChartIcon />
                                </ListItemIcon>
                                <ListItemText primary='Statistics' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='Data Management' disablePadding onClick={this.handleClick}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <FolderCopyIcon />
                                </ListItemIcon>
                                <ListItemText primary='Data Management' />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <List style={{ marginTop: 'auto' }}>
                        <ListItem key='Settings' disablePadding onClick={this.handleClick}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <RoomPreferencesIcon />
                                </ListItemIcon>
                                <ListItemText primary='Settings' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='Login' disablePadding onClick={this.setModalShow}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LoginIcon />
                                </ListItemIcon>
                                <ListItemText primary='Login' />
                            </ListItemButton>
                        </ListItem>
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