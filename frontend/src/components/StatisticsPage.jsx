import { useState } from "react";
import logger from "../logger.js";
// import axios from "axios";
import Sidebar from "./Sidebar.jsx";
import StatisticsModal from "./StatisticsModal.jsx";
// import {
// 	aggregateSiteStatistics,
// 	aggregateCatalogueStatistics,
// 	aggregatePointTypeStatistics,
// } from "../../../backend/controllers/aggregateStatisticsController.js";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
// import PropTypes from "prop-types";
import Box from "@mui/material/Box";
// import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
// import TableSortLabel from "@mui/material/TableSortLabel";
// import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
import FormControl from "@mui/material/FormControl";
// import { styled } from "@mui/material/styles";

function StatisticsPage() {
	const [checked, setChecked] = useState(false);
	const [sortValue, setSortValue] = useState("newest");
	const [filterValue, setFilterValue] = useState("");
	const [modalOpen, setModalOpen] = useState(false);

	//Holds all the information for the header rows of the table
	const tableHeads = [
		{
			id: "name",
			numeric: false,
			Padding: "normal",
			label: "Point name",
			Width: "25%",
		},
		{
			id: "location",
			numeric: false,
			Padding: "normal",
			label: "Location",
			Width: "25%",
		},
		{
			id: "period",
			numeric: false,
			Padding: "normal",
			label: "Period",
			Width: "15%",
		},
		{
			id: "site",
			numeric: false,
			Padding: "normal",
			label: "Site",
			Width: "35%",
		},
	];

	//Used to switch checkboxes when clicked
	const CheckboxClick = (event) => {
		logger.info("Checkbox " + event.target.id + "clicked");
		setChecked(event.target.checked);
	};

	const handleSortChange = (event) => {
		setSortValue(event.target.value);
	};

	const handleFilterChange = (event) => {
		setFilterValue(event.target.value);
	};

	const openModal = () => {
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	return (
		<>
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<Sidebar />
				<Box
					sx={{
						flexGrow: 1,
						padding: "30px",
					}}
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography color="text.primary">
								Breadcrumbs / Navigation / Component / Placeholder
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="standard-basic"
								sx={{ minWidth: 500 }}
								label="Search"
								variant="standard"
							/>
							<Button variant="contained" onClick={openModal}>
								Generate Statistics
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12}>
							<FormControl variant="standard" sx={{ minWidth: 200 }}>
								<InputLabel id="demo-simple-select-standard-label">
									Sort
								</InputLabel>
								<Select
									labelId="demo-simple-select-standard-label"
									id="demo-simple-select-standard"
									label="Sort"
									onChange={handleSortChange}
								>
									<MenuItem value="" Name="sorts">
										<em>None</em>
									</MenuItem>
									<MenuItem value={1} Name="sorts">
										Name
									</MenuItem>
									<MenuItem value={2}>Type</MenuItem>
								</Select>
							</FormControl>
							<FormControl
								variant="standard"
								sx={{ ml: "20px", minWidth: 200 }}
							>
								<InputLabel id="demo-simple-select-standard-label">
									Filter
								</InputLabel>
								<Select
									labelId="demo-simple-select-standard-label"
									id="demo-simple-select-standard"
									label="Filter"
									onChange={handleFilterChange}
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value={1}>Name</MenuItem>
									<MenuItem value={2}>Description</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>
					<TableContainer>
						<TableHead>
							<TableRow>
								<TableCell padding="checkbox">
									<Checkbox
										color="primary"
										checked={checked}
										onChange={CheckboxClick}
										inputProps={{ "aria-label": "Select all" }}
									/>
								</TableCell>
								{tableHeads.map((tableHead) => (
									<TableCell
										key={tableHead.id}
										align={tableHead.numeric ? "right" : "left"}
										padding={tableHead.Padding}
										width={tableHead.Width}
									>
										{tableHead.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
					</TableContainer>
				</Box>
			</Box>
			<StatisticsModal modalOpen={modalOpen} closeModal={closeModal} />
		</>
	);
}

export default StatisticsPage;
