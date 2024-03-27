/* eslint-disable react/jsx-key */
import { useState, useEffect } from "react";
import axios from "axios";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	DialogContentText,
	Typography,
	Alert,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import log from "../logger.js";

import AddCultureDialog from "./AddCultureDialog";
import Sidebar from "./Sidebar";

const apiUrlCultures = "http://localhost:3000/cultures"; // API endpoint for fetching and deleting cultures

export default function ManagementCultures() {
	// State management for the component
	const [rows, setRows] = useState([]); // Cultures data for the grid
	const [dialogOpen, setDialogOpen] = useState(false); // State for opening/closing the AddCultureDialog
	const [alert, setAlert] = useState({ open: false, message: "" }); // State for showing alerts
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		open: false,
		culture: null,
	}); // State for managing delete confirmation dialog

	// Fetch cultures from the server when the component mounts
	useEffect(() => {
		const fetchCultures = async () => {
			try {
				const response = await axios.get(apiUrlCultures);
				setRows(response.data); // Set fetched cultures to the grid
			} catch (error) {
				log.error("Error fetching cultures:", error);
			}
		};
		fetchCultures();
	}, []);

	// Handler for delete button clicks. Opens confirmation dialog.
	const handleDeleteClick = (culture) => () => {
		setDeleteConfirmation({ open: true, culture }); // Set which culture to potentially delete and open dialog
	};

	// Handler for confirming culture deletion
	const handleConfirmDelete = async () => {
		if (deleteConfirmation.culture) {
			const cultureId = deleteConfirmation.culture.id;
			log.info(`Attempting to delete culture with ID: ${cultureId}`);
			try {
				await axios.delete(`${apiUrlCultures}/${cultureId}`);
				setRows(rows.filter((row) => row.id !== cultureId)); // Remove deleted culture from state
				setAlert({
					open: true,
					type: "success",
					message: "Culture successfully deleted.",
				});
			} catch (error) {
				log.error("Error deleting culture:", error);
				setAlert({
					open: true,
					type: "error",
					message: "Failed to delete culture. Please try again.",
				});
			}
		}
		setDeleteConfirmation({ open: false, culture: null }); // Close the confirmation dialog
	};

	// Handler for canceling the deletion process
	const handleCancelDelete = () => {
		setDeleteConfirmation({ open: false, culture: null }); // Close the confirmation dialog without deleting
	};

	// Handler for adding a new culture
	const handleSaveNewCulture = async (newCulture) => {
		const existingCulture = rows.find(
			(row) => row.name.toLowerCase() === newCulture.name.toLowerCase(),
		);
		if (existingCulture) {
			setAlert({
				open: true,
				type: "error",
				message:
					"A culture with this name already exists. Please choose a different name.",
			});
			return;
		}

		try {
			const response = await axios.post(apiUrlCultures, newCulture);
			setRows([...rows, response.data]); // Add the new culture to the grid
			setAlert({
				open: true,
				type: "success",
				message: "Culture successfully added.",
			});
		} catch (error) {
			log.error("Error adding new culture:", error);
			setAlert({
				open: true,
				type: "error",
				message: "Failed to add new culture. Please try again.",
			});
		}
	};

	// Configuration for the columns in the data grid
	const columns = [
		{ field: "id", headerName: "ID", width: 90 },
		{ field: "name", headerName: "Name", width: 180 },
		{
			field: "period",
			headerName: "Period",
			width: 200,
			valueGetter: (params) => {
				return params.row.period
					? `${params.row.period.name} (${params.row.period.start}-${params.row.period.end})`
					: "No associated period";
			},
		},
		{
			field: "actions",
			type: "actions",
			headerName: "Actions",
			width: 150,
			getActions: (params) => [
				<GridActionsCellItem
					icon={<DeleteIcon />}
					label="Delete"
					onClick={handleDeleteClick(rows.find((row) => row.id === params.id))}
					color="inherit"
				/>,
			],
		},
	];

	return (
		<Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
			<Dialog open={deleteConfirmation.open} onClose={handleCancelDelete}>
				<DialogTitle>Delete Culture</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{deleteConfirmation.culture
							? `Are you sure you want to delete the culture with the following details: ${JSON.stringify(deleteConfirmation.culture, null, 2)}?`
							: "Loading..."}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelDelete}>No</Button>
					<Button onClick={handleConfirmDelete} color="primary">
						Yes
					</Button>
				</DialogActions>
			</Dialog>
			<Sidebar sx={{ width: 240, flexShrink: 0 }} />
			<Box sx={{ flexGrow: 1, p: 3 }}>
				{alert.open && (
					<Alert
						severity={alert.type || "error"}
						onClose={() => setAlert({ ...alert, open: false })}
						sx={{ mb: 2 }}
					>
						{alert.message}
					</Alert>
				)}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 2,
					}}
				>
					<Typography variant="h6" sx={{ mb: 2 }}>
						Cultures Management
					</Typography>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => setDialogOpen(true)}
						sx={{ mb: 2 }}
					>
						Add Culture
					</Button>
				</Box>

				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					autoHeight
					components={{ Toolbar: GridToolbar }}
				/>
				<AddCultureDialog
					open={dialogOpen}
					onClose={() => setDialogOpen(false)}
					onSave={handleSaveNewCulture}
				/>
			</Box>
		</Box>
	);
}
