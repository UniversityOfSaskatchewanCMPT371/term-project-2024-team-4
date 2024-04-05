/* eslint-disable indent */
/* eslint-disable react/prop-types */
import {
	TextField,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { useState } from "react";
import http from "../../http";
import log from "../logger";

/**
 * Modal component for adding or editing cross sections.
 * Allows for the creation of new cross sections or editing existing ones.
 *
 * Pre-conditions:
 * - `setEditCrossSection`: Function to update editing state in the parent component.
 * - `selectedCrossSection`: String representing the name of the cross section being edited, if any.
 * - `selectedCrossSectionID`: ID of the cross section being edited, null if adding a new cross section.
 * - `updateCrossSectionsList`: Function to update the list of cross sections in the parent component.
 *
 * Post-conditions:
 * - On successful submission, updates the cross section list in the parent component.
 * - Closes the modal upon successful submission or cancellation.
 * - Logs the operation status and any errors encountered.
 *
 * @param {Object} props Component props including functions and state for managing cross section data.
 */
export default function CrossSectionModal({
	setEditCrossSection,
	selectedCrossSection,
	setSelectedCrossSection,
	selectedCrossSectionID,
	updateCrossSectionsList,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [crossSection, setCrossSection] = useState(selectedCrossSection);
	const [errors, setErrors] = useState({
		crossSection: "",
	});

	const validateForm = () => {
		let isValid = true;
		const newErrors = {
			crossSection: "",
		};

		// Validate Cross Section name
		if (!crossSection.trim()) {
			newErrors.crossSection = "Cross Section name is required.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	console.log("any id:" + selectedCrossSectionID);
	/**
	 * Handles the save action when the form is submitted.
	 * Validates the form, updates the cross section, and closes the modal.
	 */
	const handleSave = () => {
		const crossSectionData = { name: crossSection };

		if (!validateForm()) {
			log.debug("Cross Section Form fails frontend validation");
			return;
		}

		const apiCall = selectedCrossSectionID
			? http.put(`/crossSections/${selectedCrossSectionID}`, crossSectionData)
			: http.post("/crossSections", crossSectionData);

		apiCall
			.then((response) => {
				log.info(
					`Cross Section ${selectedCrossSection ? "updated" : "created"} successfully: `,
					response.data,
				);
				updateCrossSectionsList(response.data);
				handleClose();
			})
			.catch((error) => {
				log.error("Error saving Cross Section: ", error);
			});
	};

	/**
	 * Closes the modal and resets the cross section editing state.
	 */
	const handleClose = () => {
		setOpen(false);
		setSelectedCrossSection("");
		if (setEditCrossSection) setEditCrossSection(false);
		log.debug(
			`BaseShapeModal closed, mode: ${selectedCrossSectionID ? "edit" : "add"}.`,
		);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>
					{selectedCrossSectionID
						? "Edit Cross Section"
						: "Add New Cross Section"}
				</DialogTitle>
				<DialogContent>
					<TextField
						id="crossSection"
						label="Cross Section"
						variant="outlined"
						fullWidth
						value={crossSection}
						onChange={(e) => setCrossSection(e.target.value)} // Handle change in name field
						error={!!errors.crossSection}
						helperText={errors.crossSection}
					/>
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
