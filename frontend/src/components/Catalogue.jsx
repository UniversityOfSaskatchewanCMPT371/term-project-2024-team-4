/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import SiteList from "./SiteList";
import BaseLayout from "./BaseLayout";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import log from "../logger";
import {
	TextField,
	IconButton,
	Typography,
	Grid,
	MenuItem,
} from "@mui/material";

/**
 * Default catalogue main page for viewing and adding sites
 * @returns Catalogue React component
 */
const Catalogue = () => {
	const [catalogueName, setCatalogueName] = useState("");
	const [catalogueDescription, setCatalogueDescription] = useState("");

	const [searchValue, setSearchValue] = useState("");
	const [sortValue, setSortValue] = useState("newest"); // does nothing atm
	const [filterValue, setFilterValue] = useState(""); // does nothing atm

	/**
	 * Fetch default catalogue initialized in database
	 */
	useEffect(() => {
		async function fetchCatalogue() {
			try {
				const response = await axios.get("http://localhost:3000/catalogues/1");
				log.info("Default catalogue: ", response.data);
				setCatalogueName(response.data.name);
				setCatalogueDescription(response.data.description);
			} catch (error) {
				log.error("Error fetching default catalogue: ", error);
			}
		}

		fetchCatalogue();
	}, []);

	/**
	 * Set search value every textfield input change
	 * @param {object} event input textfield event object
	 */
	const handleSearch = (event) => {
		setSearchValue(event.target.value);
	};

	/**
	 * Set sort value every dropdown selection change
	 * @param {object} event dropwdown selected object value
	 */
	const handleSortChange = (event) => {
		setSortValue(event.target.value);
	};

	/**
	 * Set search value every dropdown selection change
	 * @param {object} event dropwdown selected object value
	 */
	const handleFilterChange = (event) => {
		setFilterValue(event.target.value);
	};

	return (
		<BaseLayout>
			<Grid item xs={12}>
				{/* Default catalogue labels */}
				<Grid>
					<Typography sx={{ marginBottom: 2 }} variant="h4">
						{catalogueName || "Base Catalogue"}
					</Typography>
					<Typography sx={{ marginBottom: 4 }}>
						{catalogueDescription}
					</Typography>
				</Grid>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						{/*Search bar*/}
						<form noValidate autoComplete="off">
							<TextField
								sx={{ marginBottom: 4 }}
								id="standard-basic"
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
					<Grid item xs={6} sm={3}>
						{/*Filter widget*/}
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
				{/* Note: this shows all the sites attached to the catalogue oldest first(as of March 9th, 2023) */}
				<SiteList query={searchValue} />
			</Grid>
		</BaseLayout>
	);
};

export default Catalogue;
