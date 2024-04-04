/* eslint-disable indent */
/* eslint-disable react/jsx-key */
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext.jsx";
import http from "../../http.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Alert } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import log from "../logger.js";
import Sidebar from "./Sidebar";
import AddPeriodDialog from "./AddPeriodDialog";
import RelationsPeriodsDialog from "./RelationsPeriodsDialog.jsx";
import {
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	DialogContentText,
} from "@mui/material";

// URL for backend API for period CRUD operations
const apiUrl = "/periods";

// ManagementPeriods is a functional component for managing historical periods
export default function ManagementPeriods() {
	// State variables to manage component data and UI state
	const [rows, setRows] = useState([]); // Rows for data grid, representing periods
	const [dialogOpen, setDialogOpen] = useState(false); // Controls visibility of the add dialog
	const [alert, setAlert] = useState({ open: false, message: "" }); // Controls visibility and message of alerts
	const [existingPeriodNames, setExistingPeriodNames] = useState([]); // Tracks names of all existing periods to prevent duplicates
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		open: false,
		period: null,
	});

	const { user } = useContext(UserContext);

	// useEffect to fetch period data from server when component mounts
	useEffect(() => {
		const fetchPeriods = async () => {
			try {
				const response = await http.get(apiUrl); // Fetch periods data
				setRows(response.data); // Set fetched periods to rows
				setExistingPeriodNames(response.data.map((period) => period.name)); // Extract names for duplicate checking
			} catch (error) {
				log.error("Error fetching periods:", error); // Log errors if request fails
			}
		};
		fetchPeriods();
	}, []);

	// Handler to open the add new period dialog
	const handleClickOpenDialog = () => {
		setDialogOpen(true);
	};

	// Handler to close alert messages
	const handleCloseAlert = () => {
		setAlert({ ...alert, open: false });
	};

	// Handler for delete button click, deletes a period
	const handleDeleteClick = (period) => () => {
		// Set the period to be deleted and open the confirmation dialog
		setDeleteConfirmation({ open: true, period });
	};

	// Handler for confirming the deletion
	const handleConfirmDelete = async () => {
		if (deleteConfirmation.period) {
			try {
				await http.delete(`${apiUrl}/${deleteConfirmation.period.id}`);
				setRows(rows.filter((row) => row.id !== deleteConfirmation.period.id));
				setAlert({
					open: true,
					type: "success",
					message: "Period successfully deleted.",
				});
			} catch (error) {
				log.error("Error deleting period:", error);
			}
		}
		setDeleteConfirmation({ open: false, period: null }); // Close the confirmation dialog
	};

	// Handler for canceling the deletion
	const handleCancelDelete = () => {
		setDeleteConfirmation({ open: false, period: null }); // Just close the confirmation dialog
	};

	// Handler for saving a new period
	const handleSaveNewPeriod = async (newPeriod) => {
		try {
			const response = await http.post(apiUrl, newPeriod); // Send post request to add new period
			setRows((oldRows) => [...oldRows, { ...response.data, isNew: true }]); // Add new period to local state
			setAlert({
				open: true,
				type: "success",
				message: "Period successfully added.",
			}); // Show success message
			setExistingPeriodNames([...existingPeriodNames, newPeriod.name]); // Update existing period names
		} catch (error) {
			log.error("Error adding new period:", error); // Log errors if request fails
		}
	};
	const formatPeriodDetails = (period) => {
		if (!period) return "Loading...";

		const { name, start, end, cultures } = period;
		let details = `Are you sure you want to delete the period "${name}" (Start: ${start}, End: ${end})?`;

		if (cultures && cultures.length > 0) {
			const cultureNames = cultures.map((culture) => culture.name).join(", ");
			details += ` This period is associated with the following cultures: ${cultureNames}.`;
		}

		return details;
	};

	// For displaying Period's relations, if any
	const [relationsDialogOpen, setRelationsDialogOpen] = useState(false);
	const [selectedPeriod, setSelectedPeriod] = useState(null);

	const handleViewRelationsClick = (period) => {
		setSelectedPeriod(period);
		setRelationsDialogOpen(true);
	};
	// Columns configuration for the data grid
	const columns = [
		{ field: "id", headerName: "ID", flex: 1, editable: false },
		{ field: "name", headerName: "Name", flex: 2, editable: false },
		{
			field: "start",
			headerName: "Start Year",
			type: "number",
			flex: 1,
			editable: false,
		},
		{
			field: "end",
			headerName: "End Year",
			type: "number",
			flex: 1,
			editable: false,
		},
		{
			field: "relations",
			headerName: "Relations",
			flex: 2,
			renderCell: (params) => (
				<Button
					variant="outlined"
					onClick={() => handleViewRelationsClick(params.row)}
				>
					View Relations
				</Button>
			),
		},

		{
			field: "actions",
			type: "actions",
			headerName: "Actions",
			flex: 1,
			cellClassName: "actions",
			getActions: (params) =>
				user
					? [
							<GridActionsCellItem
								icon={<DeleteIcon />}
								label="Delete"
								onClick={handleDeleteClick(
									rows.find((row) => row.id === params.id),
								)}
								color="inherit"
							/>,
						]
					: [],
		},
	];

	// Render the management periods UI layout
	return (
		<Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
			<Sidebar sx={{ width: 240, flexShrink: 0 }} />
			<Box sx={{ flexGrow: 1, p: 3 }}>
				<Box sx={{ flexGrow: 1, p: 3 }}>
					{alert.open && (
						<Alert
							severity={alert.type || "error"}
							onClose={handleCloseAlert}
							style={{ marginBottom: "20px" }}
						>
							{alert.message}
						</Alert>
					)}
				</Box>
				{/* Deletion confirmation dialog */}
				{user && (
					<Dialog open={deleteConfirmation.open} onClose={handleCancelDelete}>
						<DialogTitle>Delete Period</DialogTitle>
						<DialogContent>
							<DialogContentText>
								{formatPeriodDetails(deleteConfirmation.period)}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleCancelDelete}>No</Button>
							<Button onClick={handleConfirmDelete} color="primary">
								Yes
							</Button>
						</DialogActions>
					</Dialog>
				)}

				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 2,
					}}
				>
					<Typography variant="h6">Periods Management</Typography>
					{user && (
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={handleClickOpenDialog}
							color="primary"
						>
							Add Period
						</Button>
					)}
				</Box>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					autoHeight
					disableSelectionOnClick
					components={{
						toolbar: user ? GridToolbar : undefined,
					}}
				/>
				<AddPeriodDialog
					open={dialogOpen}
					onClose={() => setDialogOpen(false)}
					onSave={handleSaveNewPeriod}
					periodNames={existingPeriodNames}
				/>
				<RelationsPeriodsDialog
					open={relationsDialogOpen}
					onClose={() => setRelationsDialogOpen(false)}
					period={selectedPeriod}
				/>
			</Box>
		</Box>
	);
}
