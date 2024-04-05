/* eslint-disable react/prop-types */
import {
	TextField,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
} from "@mui/material";
import { useState } from "react";
import http from "../../http";
import log from "../logger";

export default function MaterialModal({
	setEditMaterial,
	selectedMaterial,
	setSelectedMaterial,
	selectedMaterialID,
	updateMaterialList,
	artifactTypes,
}) {
	const [open, setOpen] = useState(true);
	const [materialName, setMaterialName] = useState(selectedMaterial.name || "");
	const [materialDescription, setMaterialDescription] = useState(
		selectedMaterial.name ? selectedMaterial.description : "",
	);
	const [selectedArtifactTypeID, setSelectedArtifactTypeID] = useState(
		selectedMaterial.name ? selectedMaterial.artifactType.id : "",
	);
	const [errors, setErrors] = useState({
		materialName: "",
		selectedArtifactTypeID: "",
	});

	const validateForm = () => {
		let isValid = true;
		const newErrors = {
			materialName: "",
			selectedArtifactTypeID: "",
		};

		// Validate name
		if (!materialName.trim()) {
			newErrors.materialName = "Material name is required.";
			isValid = false;
		}

		// Validate Artifact Type ID
		if (!selectedArtifactTypeID) {
			newErrors.selectedArtifactTypeID = "Must select an Artifact Type";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	/**
	 * Handles the save action when the form is submitted.
	 * Validates the form, updates the material, and closes the modal.
	 */ const handleSave = () => {
		log.debug(
			`Saving culture: ${materialName} with artifact type ID: ${selectedArtifactTypeID}`,
		);
		if (!validateForm()) {
			log.debug("Region Form fails frontend validation");
			return;
		}
		const updatedMaterial = {
			name: materialName,
			description: materialDescription,
			artifactTypeId: selectedArtifactTypeID,
		};

		// Decide endpoint and axiosCall based on whether it's an edit or add operation
		const endpoint = selectedMaterialID
			? `/materials/${selectedMaterialID}`
			: "/materials";

		const axiosCall = selectedMaterialID
			? http.put(endpoint, updatedMaterial)
			: http.post(endpoint, updatedMaterial);

		axiosCall
			.then((response) => {
				log.info(
					`Material processed successfully: ${JSON.stringify(response.data)}`,
				);
				updateMaterialList(response.data);
				handleClose();
			})
			.catch((error) => {
				log.error(`Error processing material: ${error}`);
			});
	};

	/**
	 * Closes the modal and resets the culture editing state.
	 */ const handleClose = () => {
		setOpen(false);
		setSelectedMaterial("");
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
						style={{ marginBottom: "15px", marginTop: "15px" }}
						error={!!errors.materialName}
						helperText={errors.materialName}
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
						style={{ marginBottom: "15px" }}
						error={!!errors.selectedArtifactTypeID}
						helperText={errors.selectedArtifactTypeID}
					>
						<option value=""></option>
						{artifactTypes.map((artifact) => (
							<option key={artifact.id} value={artifact.id}>
								{artifact.id}
							</option>
						))}
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSave} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
