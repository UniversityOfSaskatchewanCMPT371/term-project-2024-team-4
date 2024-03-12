/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import SearchArtifactResult from "./SearchArtfacts";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import logger from "../logger.js";

const Site = (props) => {
	const [searchValue, setSearchValue] = useState("");
	const [sortValue, setSortValue] = useState("newest");
	const [filterValue, setFilterValue] = useState("");

	//This has all the information about the site that was clicked on in the catalogue
	// which are name, location and id
	// Need to use 'inComingInfo.state.info.<item>' to get a value out of this
	const inComingInfo = useLocation();

	const handleSearch = (event) => {
		setSearchValue(event.target.value);
	};

	useEffect(() => {
		// console.log(inComingInfo.state.name);

		//Not sure what this is for, because this file should only be used for sites, right? | Jorden
		if (props.props === "catalogue") {
			console.log("Searching Catalogue for:", searchValue);
		} else if (props.props === "site") {
			console.log("Searching Site for:", searchValue);
		}

		// This is a test to see if the props are being passed correctly
		if (inComingInfo != null) {
			//console.log(locationx.state);
			//console.log(locationx.state.name);
			logger.info(inComingInfo.state.info);
		} else {
			logger.warn("Site information null");
		}
	}, [searchValue, props.props]);

	const handleSortChange = (event) => {
		setSortValue(event.target.value);
	};

	const handleFilterChange = (event) => {
		setFilterValue(event.target.value);
	};

	//Used to refresh the page after a new artifact is added
	const refreshPage = () => {
		console.info("Site page refreshed");
		window.location.reload();
	};

	const sendInfo = () => {
		return inComingInfo.state.info;
	};

	return (
		<Box marginLeft={40} marginTop={5} container spacing={5}>
			<Sidebar />
			{/*Above search bar text*/}
			<Grid item xs={12}>
				<Grid>
					<Typography variant="h4" gutterBottom>
						{props.props}
					</Typography>
					<Typography variant="body1" gutterBottom>
						This is a short description of Sites.
					</Typography>
					<Typography>
						The site name is {inComingInfo.state.info.name}
					</Typography>
					{/*Used as a test to see the current Site, if you can read this please remove this line*/}
				</Grid>
				{/*Search bar*/}
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
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
					{/*Sort drop down menu*/}
					{/* Adjusted marginTop */}
					<Grid item xs={6} sm={3}>
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
							<MenuItem value="all">All</MenuItem>
							<MenuItem value="category1">Category 1</MenuItem>
							<MenuItem value="category2">Category 2</MenuItem>
						</TextField>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<SearchArtifactResult
					query={searchValue}
					siteId={inComingInfo.state.info.id}
				/>
			</Grid>
		</Box>
	);
};

export default Site;
