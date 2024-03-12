import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './Sidebar'; // Import your Sidebar component

const BaseLayout = ({ children }) => {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar />
        <Box sx={{ flexGrow: 1, padding: "30px" }}>
          {children} {/* This is where the specific page content will be rendered */}
        </Box>
      </Box>
    </>
  );
}

export default BaseLayout;