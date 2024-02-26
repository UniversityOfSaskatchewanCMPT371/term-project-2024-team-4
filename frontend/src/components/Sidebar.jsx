import { Component } from 'react';
import './Sidebar.css';
import logger from '../logger.js';
import LoginModal from './LoginModal';

// MUI
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
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
import { styled } from '@mui/material/styles';


const drawerWidth = 240;

const SidebarList = styled(List)(() => ({
    padding: '10px',
    // selected and (selected + hover) states
    '&& .Mui-selected, && .Mui-selected:hover': {
        backgroundColor: '#cda057',
        borderRadius: '7px',
        '&, & .MuiListItemIcon-root': {
            color: 'white',
        },
    },
    // hover states
    '& .MuiListItemButton-root:hover': {
        backgroundColor: '#cda057',
        borderRadius: '7px',
        '&, & .MuiListItemIcon-root': {
            color: 'white',
        },
    },
}));

const SidebarIcon = styled(ListItemIcon)(() => ({
    minWidth: '47px',
}));

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false
        };

        this.setModalVisible = this.setModalVisible.bind(this);
        this.closeModal = this.closeModal.bind(this);

        logger.info("Sidebar component rendered");
    }

    handleClick(event) {
        logger.info(event.target.innerText + " Sidebar navigation clicked");
    }

    setModalVisible(event) {
        this.handleClick(event);
        this.setState({ modalVisible: true }, () => {
            logger.info("LoginModal visible");
        });
    }

    closeModal() {
        this.setState({ modalVisible: false }, () => {
            logger.info("LoginModal closed");
        });
    }

    render() {
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
                    PaperProps={{
                        sx: {
                            backgroundColor: "#f1f1f1",
                        }
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            PCubed
                        </Typography>
                    </Toolbar>
                    <SidebarList>
                        <ListItem
                        key='Home'
                        disablePadding
                        onClick={this.handleClick}
                        >
                            <ListItemButton>
                                <SidebarIcon>
                                    <HomeIcon />
                                </SidebarIcon>
                                <ListItemText primary='Home' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='Connect' disablePadding onClick={this.handleClick}>
                            <ListItemButton>
                                <SidebarIcon>
                                    <UploadIcon />
                                </SidebarIcon>
                                <ListItemText primary='Connect' />
                            </ListItemButton>
                        </ListItem>
                    </SidebarList>
                    <Divider />
                    <SidebarList>
                        <ListItem key='Statistics' disablePadding onClick={this.handleClick}>
                            <ListItemButton>
                                <SidebarIcon>
                                    <BarChartIcon />
                                </SidebarIcon>
                                <ListItemText primary='Statistics' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='Data Management' disablePadding onClick={this.handleClick}>
                            <ListItemButton>
                                <SidebarIcon>
                                    <FolderCopyIcon />
                                </SidebarIcon>
                                <ListItemText primary='Data Management' />
                            </ListItemButton>
                        </ListItem>
                    </SidebarList>
                    <SidebarList sx={{ marginTop: 'auto' }}>
                        <ListItem key='Settings' disablePadding onClick={this.handleClick}>
                            <ListItemButton>
                                <SidebarIcon>
                                    <RoomPreferencesIcon />
                                </SidebarIcon>
                                <ListItemText primary='Settings' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='Login' disablePadding onClick={this.setModalVisible}>
                            <ListItemButton>
                                <SidebarIcon>
                                    <LoginIcon />
                                </SidebarIcon>
                                <ListItemText primary='Login' />
                            </ListItemButton>
                        </ListItem>
                    </SidebarList>
                </Drawer>
                <LoginModal 
				modalVisible={this.state.modalVisible}
                closeModal={this.closeModal}
                />
            </>
        )
    }
}
  
export default Sidebar;