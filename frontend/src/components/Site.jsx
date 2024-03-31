/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ProjectileList from "./ProjectileList";
import BaseLayout from "./BaseLayout";
import axios from "../../http.js";
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

/**
 * Site component displays detailed information about a site and allows searching, sorting,
 * and filtering of related data entries (projectiles).
 *
 * @pre The component expects site information to be passed via the URL's state (from React Router).
 * @post Renders site information, a search bar, sorting, and filtering widgets.
 * @returns {JSX.Element} The rendered component with site details and interactive elements.
 */
const Site = () => {
	const [siteName, setSiteName] = useState("");
	const [siteDescription, setSiteDescription] = useState("");

	const [searchValue, setSearchValue] = useState("");
	const [sortValue, setSortValue] = useState("newest");
	const [filterValue, setFilterValue] = useState(""); // @TODO remove filter?

	const inComingInfo = useLocation();
	const siteID = inComingInfo.state.info.id;

	/**
	 * Fetches detailed information about the site using its ID.
	 *
	 * @pre Axios must be configured correctly and siteID should be valid.
	 * @post Updates state with the fetched site name and description.
	 */
	useEffect(() => {
		async function fetchSite() {
			try {
				const response = await axios.get(`/sites/${siteID}`);
				setSiteName(response.data.name);
				setSiteDescription(response.data.description);
			} catch (error) {
				log.error("Error fetching site:", error);
			}
		}

		fetchSite();
	}, [siteID]);

	/**
	 * Updates the search value based on user input.
	 *
	 * @param {Event} event - The change event from the search input field.
	 * @pre None
	 * @post Updates the searchValue state with the new input.
	 */
	const handleSearch = (event) => {
		setSearchValue(event.target.value);
	};

	/**
	 * Updates the sort value based on user selection.
	 *
	 * @param {Event} event - The change event from the sort selection field.
	 * @pre None
	 * @post Updates the sortValue state with the new selection.
	 */
	const handleSortChange = (event) => {
		setSortValue(event.target.value);
	};

	/**
	 * Updates the filter value based on user selection.
	 *
	 * @param {Event} event - The change event from the filter selection field.
	 * @pre None
	 * @post Updates the filterValue state with the new selection.
	 */
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

				{/* Search and filter UI */}
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
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
							<MenuItem value="oldest">Oldest</MenuItem>
							<MenuItem value="alphabetical_ascending">
								Alphabetical Ascending
							</MenuItem>
							<MenuItem value="alphabetical_descending">
								Alphabetical Descending
							</MenuItem>
						</TextField>
					</Grid>
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
				<ProjectileList
					query={searchValue}
					siteId={siteID}
					sortValue={sortValue}
				/>
			</Grid>
		</BaseLayout>
	);
};

export default Site;
