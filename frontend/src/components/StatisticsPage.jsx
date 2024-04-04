import { useState, useEffect, useContext } from "react";
import log from "../logger.js";
import http from "../../http.js";
import Sidebar from "./Sidebar.jsx";
import StatisticsModal from "./StatisticsModal.jsx";
import { UserContext } from "../context/userContext.jsx";
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

	const { user } = useContext(UserContext);
	useEffect(() => {
		/**
		 * Gets all projectile points in the catalogue for display and places them in the state of the component
		 */
		async function pointsGetter() {
			try {
				const response = await http.get("/projectilePoints");
				setData(response.data);
			} catch (error) {
				log.error("Error fetching projectile points: ", error);
			}
		}
		pointsGetter();
	}, []);

	//Converts all the points into objects with fields for every column in the data grid
	const rows1 = data.map((item) => ({
		id: item.id,
		site: item.site.name,
		location: item.location,
		culture: item.culture.name,
		bladeShape: item.bladeShape.name,
		baseShape: item.baseShape.name,
		haftingShape: item.haftingShape.name,
		crossSection: item.crossSection.name,
	}));

	//Holds all the information for the header row of the table and defines the fields for the data from projectile points.
	const columns = [
		{ field: "id", headerName: "ID", width: 10 },
		{
			field: "site",
			headerName: "Site",
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
			field: "culture",
			headerName: "Culture",
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

	const openModal = () => {
		setModalOpen(true);
		log.info("Statistics Modal opened");
	};

	const closeModal = () => {
		setModalOpen(false);
		log.info("Statistics Modal closed");
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
							slots={{
								toolbar: user && user.userName ? GridToolbar : undefined,
							}}
						/>
					</Box>
				</Box>
			</Box>
			<StatisticsModal modalOpen={modalOpen} closeModal={closeModal} />
		</>
	);
}

export default StatisticsPage;
