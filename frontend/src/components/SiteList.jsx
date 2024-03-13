/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import SiteModal from "./SiteModal";
import { Link } from "react-router-dom";
import {
	Grid,
	Card,
	CardContent,
	ButtonBase,
	Typography,
	Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function SiteList({ query, sortValue }) {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState([]);

	// the action to take when the new site button is pressed
	const handleClick1 = () => {
		setOpen(true);
		console.log("Add card clicked!");
	};
	// The action to take when an already existing site is clicked on
	const handleClick2 = (item) => () => {
		// event handler
		console.log("Card clicked! ID:", item.id);

		//Catalogue1.refreshPage(); // Tell the Catalogue1 to refresh
	};

	useEffect(() => {
		// Fetch data from JSON server on component mount
		fetch("http://localhost:3000/sites")
			.then((response) => response.json())
			.then((json) => {
				// sort JSON first
				const sortedData = sortData(json, sortValue);
				setData(sortedData);
			})
			.catch((error) => console.error("Error fetching data:", error));
	}, [open, sortValue]);

	/**
	 * Sorts a JSON array given sorting criteria
	 * Pre-Conditions:
	 * 	- JSON objects need to contain a `createdDate` & `name` field
	 *  - sortValue must be one of: newest, oldest, alphabetical_ascending, alphabetical_descending
	 * Post-Conditions:
	 *   - Original JSON data is kept but is sorted based on the given sorting criteria
	 * @param {Object[]} data - array of JSON objects to be sorted
	 * @param {string} sortValue - criteria to be sorted: "newest", "oldest", "alphabetical_ascending", "alphabetical_descending"
	 * @returns {Object[]} a sorted array of JSON objects
	 */
	function sortData(data, sortValue) {
		return data.sort((a, b) => {
			switch (sortValue) {
				case "newest":
					console.info("Sorting sites from newest-oldest order");
					return new Date(b.createdDate) - new Date(a.createdDate);
				case "oldest":
					console.info("Sorting sites from oldest-newest order");
					return new Date(a.createdDate) - new Date(b.createdDate);
				case "alphabetical_ascending":
					console.info("Sorting sites in alphabetically ascending order");
					return a.name.localeCompare(b.name);
				case "alphabetical_descending":
					console.info("Sorting sites in alphabetically descending order");
					return b.name.localeCompare(a.name);
				default:
					console.warn("Could not sort sites.");
					return 0;
			}
		});
	}
	//Filter data based on search query (mock)
	const filteredData = data?.filter((item) =>
		item.name.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div>
			<Grid maxWidth="md" style={{ marginTop: 20, marginLeft: -10 }}>
				<Box display="flex">
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={3}>
							<ButtonBase onClick={handleClick1}>
								<Card>
									<CardContent style={{ textAlign: "center" }}>
										<AddIcon style={{ fontSize: 80, color: "lightgrey" }} />
									</CardContent>
								</Card>
							</ButtonBase>
						</Grid>
						{filteredData &&
							filteredData.map((item, key) => (
								<Grid item xs={12} sm={6} md={3} key={item.id}>
									<ButtonBase onClick={handleClick2(item)}>
										{/* <Link to={"/addnewprojectile"} state={{key}}> */}

										{/*<Link to="/addnewprojectile" state={{ some: item }}>*/
										/*This is the original line of code, if things don't work add it back*/}
										<Link to="/site" state={{ info: item }}>
											<Card>
												<CardContent>
													<Typography variant="h5" component="h3">
														{item.name}
													</Typography>
													<Typography color="textSecondary" gutterBottom>
														{item.location}
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
			<Typography>{open && <SiteModal setOpen={setOpen} />}</Typography>
		</div>
	);
}
