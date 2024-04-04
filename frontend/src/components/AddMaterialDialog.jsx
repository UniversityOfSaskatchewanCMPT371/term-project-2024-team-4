/* eslint-disable react/prop-types */
import { useState, useEffect, Fragment } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
	MenuItem,
} from "@mui/material";
import http from "../../http.js";
import log from "../logger.js";

/**
 * This component renders a dialog for adding a new material. It allows users to enter a material name, description, and select an associated artifact type.
 * @param open (boolean): Controls the visibility of the dialog.
 * @param onClose (function): Callback function to be called when the dialog is closed.
 * @param onSave (function): Callback function to be called with the new material data when the "Save" button is clicked.
 */
export default function AddMaterialDialog({ open, onClose, onSave }) {
	const [name, setName] = useState(""); // State to hold the material name input
	const [description, setDescription] = useState(""); // State to hold the material description input
	const [artifactTypeId, setArtifactTypeId] = useState(""); // State to hold the selected artifact type ID
	const [artifactTypes, setArtifactTypes] = useState([]); // State to hold the list of fetched artifact types
	const [error, setError] = useState(""); // State to hold any error message

	// Effect hook to fetch artifact types from the server when the dialog is opened.
	useEffect(() => {
		const fetchArtifactTypes = async () => {
			try {
				const response = await http.get("/artifactTypes");
				setArtifactTypes(response.data); // Update state with fetched artifact types
			} catch (error) {
				log.error("Failed to fetch artifact types:", error);
				setError("Failed to load artifact types. Please try again later."); // Set error message on fail
			}
		};

		if (open) {
			fetchArtifactTypes(); // Fetch artifact types only when the dialog is open
		}
	}, [open]); // Re-run when the `open` prop changes

	// Handles the "Save" button click event.
	// Validates the inputs and calls the onSave callback with the new material data.
	const handleSave = () => {
		setError(""); // Reset any existing error message

		// Validation: Ensure name and artifact type are selected
		if (!name.trim() || !artifactTypeId) {
			setError("Both name and associated artifact type are required."); // Set error message if validation fails
			return;
		}

		onSave({ name, description, artifactTypeId }); // Call onSave callback with the new material data
		onClose(); // Close the dialog
	};

	return (
		<Fragment>
			<Dialog open={open} onClose={onClose}>
				<DialogTitle>Add New Material</DialogTitle>
				<DialogContent>
					{/* Display any error message */}
					{error && (
						<Typography color="error" sx={{ mb: 2 }}>
							{error}
						</Typography>
					)}
					{/* Material name input field */}
					<TextField
						autoFocus
						margin="dense"
						label="Material Name"
						type="text"
						fullWidth
						variant="outlined"
						value={name}
						onChange={(e) => setName(e.target.value)} // Update description state on change
					/>
					{/* Material description input field */}
					<TextField
						margin="dense"
						label="Description"
						type="text"
						fullWidth
						variant="outlined"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					{/* Artifact type selection dropdown */}
					<TextField
						select
						label="Associated Artifact Type"
						fullWidth
						margin="dense"
						value={artifactTypeId}
						onChange={(e) => setArtifactTypeId(e.target.value)} // Update selected artifact type ID on change
						SelectProps={{
							native: false,
						}}
					>
						{/* Map through fetched artifact types and render options */}
						{artifactTypes.map((artifact) => (
							<MenuItem key={artifact.id} value={artifact.id}>
								{artifact.id}
							</MenuItem>
						))}
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Cancel</Button>
					<Button onClick={handleSave}>Save</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
