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
	}, [siteID]);

	const handleSearch = (event) => {
		setSearchValue(event.target.value);
	};

	const handleSortChange = (event) => {
		setSortValue(event.target.value);
	};

	const handleFilterChange = (event) => {
		setFilterValue(event.target.value);
	};

	return (
		<BaseLayout>
			<Grid item xs={12}>
				<Grid>
					<Typography variant="h4" sx={{ marginBottom: 2 }}>
						{siteName}
					</Typography>
					<Typography sx={{ marginBottom: 4 }}>{siteDescription}</Typography>
				</Grid>

				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						{/*Search Bar*/}
						<form noValidate autoComplete="off">
							<TextField
								sx={{ marginBottom: 2 }}
								id="search"
								label="Search"
								variant="standard"
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
				<Grid container spacing={2} sx={{ marginBottom: 4 }}>
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
