/* eslint-disable indent */
/* eslint-disable react/jsx-key */
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext.jsx";
import http from "../../http.js";
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
import RelationsCultureDialog from "./RelationsCultureDialog.jsx";

const apiUrlCultures = "/cultures"; // API endpoint for fetching and deleting cultures

export default function ManagementCultures() {
	// State management for the component
	const [rows, setRows] = useState([]); // Cultures data for the grid
	const [dialogOpen, setDialogOpen] = useState(false); // State for opening/closing the AddCultureDialog
	const [alert, setAlert] = useState({ open: false, message: "" }); // State for showing alerts
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		open: false,
		culture: null,
	}); // State for managing delete confirmation dialog

	const { user } = useContext(UserContext);

	// Fetch cultures from the server when the component mounts
	useEffect(() => {
		const fetchCultures = async () => {
			try {
				const response = await http.get(apiUrlCultures);
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
				await http.delete(`${apiUrlCultures}/${cultureId}`);
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
					message: "Failed to delete culture. Please log in or try again.",
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
			const response = await http.post(apiUrlCultures, newCulture);
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

	// For displaying Cultures relations, if any
	const [relationsDialogOpen, setRelationsDialogOpen] = useState(false);
	const [selectedCulture, setSelectedCulture] = useState(null);

	const handleViewRelationsClick = (culture) => {
		setSelectedCulture(culture);
		setRelationsDialogOpen(true);
	};
	// Configuration for the columns in the data grid
	const columns = [
		{ field: "id", headerName: "ID", flex: 1 },
		{ field: "name", headerName: "Name", flex: 2 },
		{
			field: "period",
			headerName: "Period",
			flex: 2,
			valueGetter: (params) => {
				return params.row.period
					? `${params.row.period.name} (${params.row.period.start}-${params.row.period.end})`
					: "No associated period";
			},
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

	return (
		<Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
			{user && (
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
			)}
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
					{user && (
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => setDialogOpen(true)}
							sx={{ mb: 2 }}
						>
							Add Culture
						</Button>
					)}
				</Box>

				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					autoHeight
					components={{
						toolbar: user ? GridToolbar : undefined,
					}}
				/>
				<AddCultureDialog
					open={dialogOpen}
					onClose={() => setDialogOpen(false)}
					onSave={handleSaveNewCulture}
				/>
				<RelationsCultureDialog
					open={relationsDialogOpen}
					onClose={() => setRelationsDialogOpen(false)}
					culture={selectedCulture}
				/>
			</Box>
		</Box>
	);
}
