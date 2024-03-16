/* eslint-disable react/prop-types */
import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import axios from "axios";
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
	selectedCrossSectionID,
	updateCrossSectionsList,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [crossSection, setCrossSection] = useState(selectedCrossSection);

	/**
	 * Handles the save action when the form is submitted.
	 * Validates the form, updates the cross section, and closes the modal.
	 */
	const handleSave = () => {
		const crossSectionData = { name: crossSection };

		const apiCall = selectedCrossSectionID
			? axios.put(
					`http://localhost:3000/crossSections/${selectedCrossSectionID}`,
					crossSectionData,
				)
			: axios.post("http://localhost:3000/crossSections", crossSectionData);

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
		if (setEditCrossSection) setEditCrossSection(false);
		log.debug(
			`BaseShapeModal closed, mode: ${selectedCrossSectionID ? "edit" : "add"}.`,
		);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<TextField
						id="crossSection"
						label="Cross Section"
						variant="outlined"
						fullWidth
						value={crossSection} // Use value instead of defaultValue
						onChange={(e) => setCrossSection(e.target.value)} // Handle change in name field
						style={{ marginBottom: "15px" }}
					/>
					<Button onClick={handleSave} variant="contained" color="primary">
						Save
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}
