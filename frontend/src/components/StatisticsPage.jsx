import { useState, useEffect } from "react";
import log from "../logger.js";
import axios from "axios";
import Sidebar from "./Sidebar.jsx";
import StatisticsModal from "./StatisticsModal.jsx";
// import {
// 	aggregateSiteStatistics,
// 	aggregateCatalogueStatistics,
// 	aggregatePointTypeStatistics,
// } from "../../../backend/controllers/aggregateStatisticsController.js";

import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

function StatisticsPage() {
	const [modalOpen, setModalOpen] = useState(false);

	const [data, setData] = useState([]);

	useEffect(() => {
		// Fetch data from JSON server on component mount

		//console.log("Fetching data from JSON server" + fetch("http://localhost:3000/artifacts")!=null); //debugging, should be removed

		fetch("http://localhost:3000/projectilePoints")
			.then((response) => response.json())
			.then((json) => setData(json))
			.catch((error) => console.error("Error fetching data:", error));
	}, [open]);

	const rows1 = data.map((item) => ({
		id: item.id,
		name: item.name,
		location: item.location,
		site: item.site.name,
		culture: item.culture.name,
		bladeShape: item.bladeShape.name,
		baseShape: item.baseShape.name,
		haftingShape: item.haftingShape.name,
		crossSection: item.crossSection.name,
	}));

	//Holds all the information for the header rows of the table
	const columns = [
		{ field: "id", headerName: "ID", width: 10 },
		{
			field: "name",
			headerName: "Point Name",
			width: 250,
		},
		{
			field: "location",
			headerName: "Location",
			width: 250,
		},
		{
			field: "period",
			headerName: "Period",
			width: 150,
		},
		{
			field: "site",
			headerName: "Site",
			width: 250,
		},
		{
			field: "culture",
			headerName: "Cuture",
			width: 150,
		},
		{
			field: "artifactType",
			headerName: "Artifact Type",
			width: 250,
		},
		{
			field: "bladeShape",
			headerName: "Blade Shape",
			width: 200,
		},
		{
			field: "baseShape",
			headerName: "Base Shape",
			width: 200,
		},
		{
			field: "haftingShape",
			headerName: "Hafting Shape",
			width: 200,
		},
		{
			field: "crossSection",
			headerName: "Cross Section",
			width: 200,
		},
	];
	const rows = [
		{
			id: 1,
			name: "Point 1",
			location: "Canada",
			period: "Early",
			site: "Site 1",
		},
	];

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
							<Button variant="contained" onClick={openModal}>
								Generate Statistics
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12}></Grid>
					</Grid>
					<Box sx={{ width: "100%" }}>
						<DataGrid
							columns={columns}
							rows={rows1}
							checkboxSelection
							slots={{ toolbar: GridToolbar }}
						/>
					</Box>
				</Box>
			</Box>
			<StatisticsModal modalOpen={modalOpen} closeModal={closeModal} />
		</>
	);
}

export default StatisticsPage;
