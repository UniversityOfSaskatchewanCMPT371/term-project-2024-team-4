/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import SearchSites from "./SearchSites";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";

const Catalogue1 = (props) => {
	const [searchValue, setSearchValue] = useState("");
	const [sortValue, setSortValue] = useState("newest");
	const [filterValue, setFilterValue] = useState("");

	const handleSearch = (event) => {
		setSearchValue(event.target.value);
	};

	useEffect(() => {
		console.log(props.props);

		if (props.props === "catalogue") {
			console.log("Searching Catalogue for:", searchValue);
		} else if (props.props === "site") {
			console.log("Searching Site for:", searchValue);
		}
	}, [searchValue, props.props]);

	const handleSortChange = (event) => {
		setSortValue(event.target.value);
	};

	const handleFilterChange = (event) => {
		setFilterValue(event.target.value);
	};

	return (
		<Box marginLeft={40} marginTop={5}  container spacing={5}>
			<Sidebar />
			<Grid item xs={12}>
				<Grid>
					<Typography variant="h4" gutterBottom>
						{props.props}
					</Typography>
					<Typography variant="body1" gutterBottom>
						This is a short description of Catalogue.
					</Typography>
				</Grid>

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
				<SearchSites query={searchValue} />
			</Grid>
		</Box>
	);
};

export default Catalogue1;
