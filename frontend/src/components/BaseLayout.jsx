// eslint-disable-next-line no-unused-vars
import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Sidebar from "./Sidebar";

/**
 * This page serves as a base that all other pages will be loaded into
 * @param {object} children page content to be rendered
 * @pre None
 * @post Renders base layout containing sidebar and dashboard for children components
 * @returns {JSX.Element} BaseLayout React component
 */
// eslint-disable-next-line react/prop-types
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
