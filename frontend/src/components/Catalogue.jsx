/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import SiteList from "./SiteList";
import CatalogueModal from "./CatalogueModal";
import BaseLayout from "./BaseLayout";
import http from "../../http";
import SearchIcon from "@mui/icons-material/Search";
import log from "../logger";
import {
	Button,
	TextField,
	IconButton,
	Typography,
	Grid,
	MenuItem,
} from "@mui/material";

import { UserContext } from "../context/userContext.jsx";

/**
 * Default catalogue main page for viewing and adding sites
 * @pre A default catalogue should be inialized in database with ID 1
 * @post Renders default catalogue page
 * @returns {JSX.Element} Catalogue React component
 */
const Catalogue = () => {
	const [catalogueName, setCatalogueName] = useState("");
	const [catalogueDescription, setCatalogueDescription] = useState("");

	const [searchValue, setSearchValue] = useState("");
	const [sortValue, setSortValue] = useState("newest");
	const [filterValue, setFilterValue] = useState(""); // @TODO remove filter?

	const [openEdit, setOpenEdit] = useState(false);

	const { user } = useContext(UserContext);

	/**
	 * Fetch default catalogue initialized in database
	 */
	useEffect(() => {
		async function fetchCatalogue() {
			try {
				const response = await http.get("/catalogues/1");
				log.info("Default catalogue: ", response.data);
				setCatalogueName(response.data.name);
				setCatalogueDescription(response.data.description);
			} catch (error) {
				log.error("Error fetching default catalogue: ", error);
			}
		}

		fetchCatalogue();
	}, [openEdit]);

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

	/**
	 * Set edit catalogue modal visibility to true
	 */
	const handleEdit = () => {
		setOpenEdit(true);
	};

	return (
		<BaseLayout>
			<Grid item xs={12}>
				{/* Default catalogue labels */}
				<Grid sx={{ marginBottom: 4 }}>
					<Typography variant="h4">
						{catalogueName || "Base Catalogue"}
					</Typography>
					<Typography
						sx={{ marginBottom: 0, fontWeight: "regular" }}
						variant="h6"
					>
						{catalogueDescription}
					</Typography>
					{user && (
						<Button
							sx={{ paddingLeft: 0, minWidth: 0, justifyContent: "flex-start" }}
							onClick={handleEdit}
							color="primary"
						>
							Edit
						</Button>
					)}
				</Grid>
				<Grid container>
					<Grid item>
						{/*Search bar*/}
						<form noValidate autoComplete="off">
							<TextField
								sx={{ marginBottom: 4, minWidth: "300px" }}
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
					<Grid item>
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
							sx={{ minWidth: "250px" }}
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
					<Grid item>
						{/*
							<TextField
							id="filter"
							select
							label="Filter"
							variant="filled"
							fullWidth
							value={filterValue}
							onChange={handleFilterChange}
							size="small"
							sx={{ minWidth: "250px" }}
						>
							<MenuItem value="all">All</MenuItem>
							<MenuItem value="category1">Category 1</MenuItem>
							<MenuItem value="category2">Category 2</MenuItem>
						</TextField>
						*/}
					</Grid>
				</Grid>
			</Grid>
			{openEdit && (
				<CatalogueModal
					openEdit={openEdit}
					setOpenEdit={setOpenEdit}
					catalogueId={1}
					catalogueName={catalogueName}
				/>
			)}
			<Grid item xs={12}>
				<Typography variant="body1" sx={{ fontWeight: "medium" }}>
					Sites
				</Typography>
				{/* Note: this shows all the sites attached to the catalogue oldest first(as of March 9th, 2023) */}
				<SiteList query={searchValue} sortValue={sortValue} />
			</Grid>
		</BaseLayout>
	);
};

export default Catalogue;
