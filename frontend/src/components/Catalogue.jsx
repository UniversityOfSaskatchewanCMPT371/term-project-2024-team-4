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

const Catalogue = () => {
	const [catalogueName, setCatalogueName] = useState("");
	const [catalogueDescription, setCatalogueDescription] = useState("");

	const [searchValue, setSearchValue] = useState("");
	const [sortValue, setSortValue] = useState("newest"); // does nothing atm
	const [filterValue, setFilterValue] = useState(""); // does nothing atm

	useEffect(() => {
		async function fetchCatalogue() {
			try {
				const response = await axios.get("http://localhost:3000/catalogues/1");
				setCatalogueName(response.data.name);
				setCatalogueDescription(response.data.description);
			} catch (error) {
				log.error("Error fetching catalogue:", error);
			}
		}

		fetchCatalogue();
	}, []);

	const handleSearch = (event) => {
		setSearchValue(event.target.value);
	};

	// useEffect(() => {
	// 	console.log(props.props);

	// 	if (props.props === "catalogue") {
	// 		console.log("Searching Catalogue for:", searchValue);
	// 	} else if (props.props === "site") {
	// 		console.log("Searching Site for:", searchValue);
	// 	}
	// }, [searchValue, props.props]);

	const handleSortChange = (event) => {
		setSortValue(event.target.value);
	};

	const handleFilterChange = (event) => {
		setFilterValue(event.target.value);
	};

	//This function is here to refresh the page after a new site is added
	// const refreshPage = () => {
	// 	console.info("Catalogue1 page refreshed");
	// 	window.location.reload();
	// };

	return (
		<BaseLayout>
			<Grid item xs={12}>
				<Grid>
					<Typography variant="h4">
						{catalogueName || "Base Catalogue"}
					</Typography>
					<Typography>{catalogueDescription}</Typography>
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
