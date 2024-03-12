import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar";

// this page serves as a base that all other pages will be loaded into
const BaseLayout = ({ children }) => {
	return (
		<>
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<Sidebar />
				<Box sx={{ flexGrow: 1, padding: "30px" }}>
					{children}{" "}
					{/* This is where the specific page content will be rendered */}
				</Box>
			</Box>
		</>
	);
};

export default BaseLayout;
