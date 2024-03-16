import {
	TextField,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import logger from "../logger";

export default function CultureModal({
	setEditMaterial,
	selectedMaterial,
	selectedMaterialDescription,
	selectedMaterialID,
	updateMaterialList,
	artifactTypes,
}) {
	const [open, setOpen] = useState(true);
	const [materialName, setMaterialName] = useState(selectedMaterial || "");
	const [materialDescription, setMaterialDescription] = useState(
		selectedMaterialDescription || "",
	);
	const [selectedArtifactTypeID, setSelectedArtifactTypeID] = useState("");

	/**
	 * Handles the save action when the form is submitted.
	 * Validates the form, updates the material, and closes the modal.
	 */ const handleSave = () => {
		logger.debug(
			`Saving culture: ${materialName} with artifact type ID: ${selectedArtifactTypeID}`,
		);
		if (!selectedArtifactTypeID) {
			alert("Please select an artifact type to proceed.");
			logger.warn(
				"Attempted to save material without selecting an artifact type.",
			);
			return;
		}
		const updatedMaterial = {
			name: materialName,
			description: materialDescription,
			artifactTypeId: selectedArtifactTypeID,
		};

		// Decide endpoint and axiosCall based on whether it's an edit or add operation
		const endpoint = selectedMaterialID
			? `http://localhost:3000/materials/${selectedMaterialID}`
			: "http://localhost:3000/materials";

		const axiosCall = selectedMaterialID
			? axios.put(endpoint, updatedMaterial)
			: axios.post(endpoint, updatedMaterial);

		axiosCall
			.then((response) => {
				logger.info(
					`Material processed successfully: ${JSON.stringify(response.data)}`,
				);
				updateMaterialList(response.data);
				handleClose();
			})
			.catch((error) => {
				logger.error(`Error processing material: ${error}`);
			});
	};

	/**
	 * Closes the modal and resets the culture editing state.
	 */ const handleClose = () => {
		setOpen(false);
		setEditMaterial(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>
					{selectedMaterialID ? "Edit Material" : "Add New Material"}
				</DialogTitle>
				<DialogContent>
					<TextField
						id="name"
						label="Material Name"
						variant="outlined"
						fullWidth
						value={materialName}
						onChange={(e) => setMaterialName(e.target.value)}
						style={{ marginBottom: "15px" }}
					/>
					<TextField
						id="description"
						label="Material Description"
						variant="outlined"
						fullWidth
						value={materialDescription}
						onChange={(e) => setMaterialDescription(e.target.value)}
						style={{ marginBottom: "15px" }}
					/>
					<TextField
						select
						label="Associated Artifact Type"
						variant="outlined"
						fullWidth
						value={selectedArtifactTypeID}
						onChange={(e) => setSelectedArtifactTypeID(e.target.value)}
						SelectProps={{
							native: true,
						}}
						helperText="Please select the artifact type this material belongs to"
						style={{ marginBottom: "15px" }}
					>
						<option value=""></option>
						{artifactTypes.map((artifact) => (
							<option key={artifact.id} value={artifact.id}>
								{artifact.id}
							</option>
						))}
					</TextField>
					<Button onClick={handleSave} variant="contained" color="primary">
						Save
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}
