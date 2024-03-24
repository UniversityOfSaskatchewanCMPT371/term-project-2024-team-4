/* eslint-disable react/prop-types */
import {
	TextField,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useState } from "react";
import http from "../../http";
import log from "../logger";

/**
 * Modal component for adding or editing cultures.
 * Allows association of a culture with a specific period.
 *
 * Pre-conditions:
 * - `setEditCulture`: Function to update the editing state in the parent component.
 * - `selectedCulture`: String representing the name of the culture being edited, if any.
 * - `selectedCultureID`: ID of the culture being edited, null if adding a new culture.
 * - `updateCulturesList`: Function to update the list of cultures in the parent component.
 * - `periods`: Array of available periods for association.
 *
 * Post-conditions:
 * - If a period is not selected, alerts the user and prevents form submission.
 * - On successful submission, updates the culture list in the parent component.
 * - Closes the modal upon successful submission or cancellation.
 *
 * @param {Object} props Component props including functions and state for managing culture data.
 */
export default function CultureModal({
	setEditCulture,
	selectedCulture,
	selectedCultureID,
	updateCulturesList,
	periods,
}) {
	const [open, setOpen] = useState(true);
	const [cultureName, setCultureName] = useState(selectedCulture || "");
	const [selectedPeriodID, setSelectedPeriodID] = useState("");

	/**
	 * Handles the save action when the form is submitted.
	 * Validates the form, updates the culture, and closes the modal.
	 */ const handleSave = () => {
		log.debug(
			`Saving culture: ${cultureName} with period ID: ${selectedPeriodID}`,
		);
		if (!selectedPeriodID) {
			alert("Please select a period to proceed.");
			log.warn("Attempted to save culture without selecting a period.");
			return;
		}

		const updatedCulture = {
			name: cultureName,
			periodId: selectedPeriodID,
		};

		// Decide endpoint and axiosCall based on whether it's an edit or add operation
		const endpoint = selectedCultureID
			? `/cultures/${selectedCultureID}`
			: "/cultures";

		const axiosCall = selectedCultureID
			? http.put(endpoint, updatedCulture)
			: http.post(endpoint, updatedCulture);

		axiosCall
			.then((response) => {
				log.info(
					`Culture processed successfully: ${JSON.stringify(response.data)}`,
				);
				updateCulturesList(response.data);
				handleClose();
			})
			.catch((error) => {
				log.error(`Error processing culture: ${error}`);
			});
	};

	/**
	 * Closes the modal and resets the culture editing state.
	 */ const handleClose = () => {
		setOpen(false);
		setEditCulture(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>
					{selectedCultureID ? "Edit Culture" : "Add New Culture"}
				</DialogTitle>
				<DialogContent>
					<TextField
						id="name"
						label="Culture Name"
						variant="outlined"
						fullWidth
						value={cultureName}
						onChange={(e) => setCultureName(e.target.value)}
						style={{ marginBottom: "15px" }}
					/>
					<TextField
						select
						label="Associated Period"
						variant="outlined"
						fullWidth
						value={selectedPeriodID}
						onChange={(e) => setSelectedPeriodID(e.target.value)}
						SelectProps={{
							native: true,
						}}
						helperText="Please select the period this culture belongs to"
						style={{ marginBottom: "15px" }}
					>
						<option value=""></option>
						{periods.map((period) => (
							<option key={period.id} value={period.id}>
								{period.name}
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
