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

import AddMaterialDialog from "./AddMaterialDialog";
import Sidebar from "./Sidebar";
import RelationsMaterialsDialog from "./RelationsMaterialsDialog.jsx";

// URL to fetch materials
const apiUrlMaterials = "/materials";

/**
 * ManagementMaterials component is responsible for fetching, displaying, adding, and deleting materials.
 * @returns
 */
export default function ManagementMaterials() {
	const [rows, setRows] = useState([]); // State for storing fetched materials
	const [dialogOpen, setDialogOpen] = useState(false); // State for controlling the visibility of the add dialog
	const [alert, setAlert] = useState({ open: false, message: "" }); // State for showing alert messages
	const materialNames = rows.map((material) => material.name); // Derived state for material names, used for validation
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		open: false,
		material: null,
	}); // State for managing delete confirmation dialog

	const { user } = useContext(UserContext);

	// Fetch materials from the server and update the state.
	useEffect(() => {
		const fetchMaterials = async () => {
			try {
				const response = await http.get(apiUrlMaterials);
				setRows(response.data); // Populate materials data into rows
			} catch (error) {
				log.error("Failed to fetch materials:", error);
			}
		};
		fetchMaterials();
	}, []);

	// Handler for delete button click, sets up delete confirmation.
	const handleDeleteClick = (material) => () => {
		setDeleteConfirmation({ open: true, material }); // Show confirmation with material details
	};

	// Confirms deletion of a material and updates the UI.
	const handleConfirmDelete = async () => {
		if (deleteConfirmation.material) {
			try {
				await http.delete(
					`${apiUrlMaterials}/${deleteConfirmation.material.id}`,
				);
				setRows(
					rows.filter((row) => row.id !== deleteConfirmation.material.id),
				);
				setAlert({
					open: true,
					type: "success",
					message: "Material successfully deleted.",
				});
			} catch (error) {
				log.error("Error deleting material:", error);
				setAlert({
					open: true,
					type: "error",
					message: "Failed to delete material. Please log in or try again.",
				});
			}
		}
		setDeleteConfirmation({ open: false, material: null }); // Close confirmation dialog
	};

	// Handle closing of the delete confirmation dialog
	const handleCancelDelete = () => {
		setDeleteConfirmation({ open: false, material: null });
	};

	// Handle saving of a new material
	const handleSaveNewMaterial = async (newMaterial) => {
		const nameExists = rows.some(
			(material) =>
				material.name.toLowerCase() === newMaterial.name.toLowerCase(),
		);

		if (nameExists) {
			// If the name already exists, display an error alert and stop the save operation
			setAlert({
				open: true,
				type: "error",
				message:
					"A material with this name already exists. Please use a different name.",
			});
			return; // Stop the save operation
		}

		try {
			const response = await http.post(apiUrlMaterials, newMaterial);
			setRows([...rows, response.data]); // Add the new material to the UI
			setAlert({
				open: true,
				type: "success",
				message: "Material successfully added.",
			});
		} catch (error) {
			log.error("Error adding new material:", error);
			setAlert({
				open: true,
				type: "error",
				message: "Failed to add new material. Please try again.",
			});
		}
	};

	// For displaying Material's relations, if any
	const [relationsDialogOpen, setRelationsDialogOpen] = useState(false);
	const [selectedMaterial, setSelectedMaterial] = useState(null);

	const handleViewRelationsClick = (material) => {
		setSelectedMaterial(material);
		setRelationsDialogOpen(true);
	};
	// DataGrid columns configuration
	const columns = [
		{ field: "id", headerName: "ID", flex: 1 },
		{ field: "name", headerName: "Name", flex: 1 },
		{ field: "description", headerName: "Description", flex: 3 },
		{
			field: "artifactType",
			headerName: "Artifact Type",
			width: 200,
			valueGetter: (params) =>
				params.row.artifactType ? params.row.artifactType.id : "Indeterminate",
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
					<DialogTitle>Delete Material</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Are you sure you want to delete this material:{" "}
							{deleteConfirmation.material?.name}?
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
						Materials Management
					</Typography>
					{user && (
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => setDialogOpen(true)}
						>
							Add Material
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
				<AddMaterialDialog
					open={dialogOpen}
					onClose={() => setDialogOpen(false)}
					onSave={handleSaveNewMaterial}
					materialNames={materialNames}
				/>
				<RelationsMaterialsDialog
					open={relationsDialogOpen}
					onClose={() => setRelationsDialogOpen(false)}
					materials={selectedMaterial}
				/>
			</Box>
		</Box>
	);
}
