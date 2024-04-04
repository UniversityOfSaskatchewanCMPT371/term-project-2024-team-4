/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import SiteModal from "./SiteModal";
import { Link } from "react-router-dom";
import {
	styled,
	Grid,
	Card,
	CardContent,
	ButtonBase,
	Typography,
	Box,
	Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { baseURL } from "../../http";

import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { sortData } from "../sortUtils";

/**
 * Item component styled from the Paper MUI component.
 * Intended for use in displaying individual site data as cards.
 */
const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
	minHeight: "700px !important",
}));

/**
 * SiteList functional component displays a list of sites.
 * Includes functionality to add a new site and view existing sites.
 *
 * @param {Object} props - The component props.
 * @param {string} props.query - The search query used to filter displayed sites.
 * @pre None
 * @post Renders a list of site cards filtered by the provided query. Each card is clickable.
 * @returns {JSX.Element} The rendered component with a list of site cards.
 */
export default function SiteList({ query, sortValue }) {
	const [openAdd, setOpenAdd] = useState(false); // Controls the visibility of the SiteModal.
	const [data, setData] = useState([]); // Stores the list of sites.
	const { user } = useContext(UserContext);
	/**
	 * Opens the SiteModal when the new site button is clicked.
	 *
	 * @pre None
	 * @post Sets the 'open' state to true, making the SiteModal visible.
	 */
	const handleClick1 = () => {
		setOpenAdd(true);
		console.log("Add card clicked!");
	};

	/**
	 * Logs the click action when an existing site card is clicked.
	 *
	 * @param {Object} item - The site data associated with the clicked card.
	 * @returns {Function} An event handler function for the click event.
	 * @pre None
	 * @post Logs the clicked site's ID to the console.
	 */
	const handleClick2 = (item) => () => {
		console.log("Card clicked! ID:", item.id);
	};

	/**
	 * Fetches the list of sites from the backend upon component mount.
	 *
	 * @pre None
	 * @post Sets the 'data' state to the list of fetched sites. Catches and logs any errors.
	 */
	useEffect(() => {
		fetch(`${baseURL}/sites`)
			.then((response) => response.json())
			.then((json) => {
				// sort JSON first
				const sortedData = sortData(json, sortValue);
				setData(sortedData);
			})
			.catch((error) => console.error("Error fetching data:", error));
	}, [openAdd, sortValue]); // Depend on 'open' to refetch when the modal is closed.

	/**
	 * Filters the fetched sites data based on the search query.
	 */
	const filteredData = data?.filter((item) =>
		item.name.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div>
			<Item variant="outlined" sx={{ mb: "40px" }}>
				<Grid style={{ padding: 30 }}>
					<Box display="flex">
						<Grid container spacing={5}>
							{user && (
								<Grid item xs={12} sm={6} md={3}>
									<ButtonBase onClick={handleClick1}>
										<Card
											sx={{
												minWidth: "12rem",
												minHeight: "12rem",
												alignContent: "center",
											}}
										>
											<CardContent style={{ textAlign: "center" }}>
												<AddIcon style={{ fontSize: 80, color: "lightgrey" }} />
												<Typography variant="body2">Add Site</Typography>
											</CardContent>
										</Card>
									</ButtonBase>
								</Grid>
							)}
							{filteredData &&
								filteredData.map((item) => (
									<Grid item xl={2} key={item.id}>
										<ButtonBase onClick={handleClick2(item)}>
											<Link to="/site" state={{ info: item }}>
												<Card
													sx={{
														minWidth: "12rem",
														minHeight: "12rem",
														alignContent: "center",
													}}
												>
													<CardContent>
														<Typography variant="h5" component="h3">
															{item.name}
														</Typography>
														<Typography color="textSecondary" gutterBottom>
															{/* Limit description characters to prevent text overflow */}
															{item.location.length <= 15
																? item.location
																: item.location.substr(0, 15) + "..."}
														</Typography>
														<Typography variant="body2" component="p">
															{item.id}
														</Typography>
													</CardContent>
												</Card>
											</Link>
										</ButtonBase>
									</Grid>
								))}
						</Grid>
					</Box>
				</Grid>
			</Item>
			{openAdd && <SiteModal openAdd={openAdd} setOpenAdd={setOpenAdd} />}
		</div>
	);
}
