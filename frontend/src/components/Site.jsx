/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ProjectileList from "./ProjectileList";
import BaseLayout from "./BaseLayout";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import log from "../logger.js";
import {
	TextField,
	IconButton,
	Typography,
	Grid,
	MenuItem,
} from "@mui/material";

import { useLocation } from "react-router-dom";

const Site = () => {
	const [siteName, setSiteName] = useState("");
	const [siteDescription, setSiteDescription] = useState("");

	const [searchValue, setSearchValue] = useState("");
	const [sortValue, setSortValue] = useState("newest"); // does nothing atm
	const [filterValue, setFilterValue] = useState(""); // does nothing atm

	//This has all the information about the site that was clicked on in the catalogue
	// which are name, location and id
	// Need to use 'inComingInfo.state.info.<item>' to get a value out of this
	const inComingInfo = useLocation();
	const siteID = inComingInfo.state.info.id;

	useEffect(() => {
		async function fetchSite() {
			try {
				const response = await axios.get(
					`http://localhost:3000/sites/${siteID}`,
				);
				setSiteName(response.data.name);
				setSiteDescription(response.data.description);
			} catch (error) {
				log.error("Error fetching site:", error);
			}
		}

		fetchSite();
	}, []);

	const handleSearch = (event) => {
		setSearchValue(event.target.value);
	};

	// useEffect(() => {
	// 	// console.log(inComingInfo.state.name);

	// 	//Not sure what this is for, because this file should only be used for sites, right? | Jorden
	// 	if (props.props === "catalogue") {
	// 		console.log("Searching Catalogue for:", searchValue);
	// 	} else if (props.props === "site") {
	// 		console.log("Searching Site for:", searchValue);
	// 	}

	// 	// This is a test to see if the props are being passed correctly
	// 	if (inComingInfo != null) {
	// 		//console.log(locationx.state);
	// 		//console.log(locationx.state.name);
	// 		log.info(inComingInfo.state.info);
	// 	} else {
	// 		log.warn("Site information null");
	// 	}
	// }, [searchValue, props.props]);

	const handleSortChange = (event) => {
		setSortValue(event.target.value);
	};

	const handleFilterChange = (event) => {
		setFilterValue(event.target.value);
	};

	//Used to refresh the page after a new artifact is added
	// const refreshPage = () => {
	// 	console.info("Site page refreshed");
	// 	window.location.reload();
	// };

	// const sendInfo = () => {
	// 	return inComingInfo.state.info;
	// };

	return (
		<BaseLayout>
			<Grid item xs={12}>
				<Grid>
					<Typography variant="h4">{siteName}</Typography>
					<Typography>{siteDescription}</Typography>
				</Grid>

				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						{/*Search Bar*/}
						<form noValidate autoComplete="off">
							<TextField
								id="search"
								label="Search"
								variant="outlined"
								fullWidth
								value={searchValue}
								onChange={handleSearch}
								InputProps={{
									startAdornment: (
										<IconButton type="submit" aria-label="search">
											<SearchIcon />
										</IconButton>
									),
								}}
							/>
						</form>
					</Grid>
				</Grid>
				<Grid container spacing={2} style={{ marginTop: 5 }}>
					{" "}
					{/* Adjusted marginTop */}
					<Grid item xs={6} sm={3}>
						{/*Sort widget*/}
						<TextField
							id="sort"
							select
							label="Sort"
							variant="filled"
							fullWidth
							value={sortValue}
							onChange={handleSortChange}
							size="small"
						>
							<MenuItem value="newest">Newest</MenuItem>
							<MenuItem value="descendant">Descendant</MenuItem>
							<MenuItem value="ascending">Ascending</MenuItem>
						</TextField>
					</Grid>
					{/*Above filter bar text*/}
					<Grid item xs={6} sm={3}>
						<TextField
							id="filter"
							select
							label="Filter"
							variant="filled"
							fullWidth
							value={filterValue}
							onChange={handleFilterChange}
							size="small"
						>
							{/*Filter Values | NOTE: these should be dynamic, right*/}
							<MenuItem value="all">All</MenuItem>
							<MenuItem value="category1">Category 1</MenuItem>
							<MenuItem value="category2">Category 2</MenuItem>
						</TextField>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<ProjectileList query={searchValue} siteId={siteID} />
			</Grid>
		</BaseLayout>
	);
};

export default Site;
