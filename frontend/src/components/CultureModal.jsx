/* eslint-disable react/prop-types */
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
/**
 * A modal for creating or editing cultural associations.
 * This modal allows users to associate a culture with a specific period.
 *
 * @param {Object} props - Component props for managing culture state and ID.
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

	// Handles the saving of culture
	const handleSave = () => {
		logger.debug(
			`Saving culture: ${cultureName} with period ID: ${selectedPeriodID}`,
		);
		if (!selectedPeriodID) {
			alert("Please select a period to proceed.");
			logger.warn("Attempted to save culture without selecting a period.");
			return;
		}

		const updatedCulture = {
			name: cultureName,
			periodId: selectedPeriodID,
		};

		// Decide endpoint and axiosCall based on whether it's an edit or add operation
		const endpoint = selectedCultureID
			? `http://localhost:3000/cultures/${selectedCultureID}`
			: "http://localhost:3000/cultures";

		const axiosCall = selectedCultureID
			? axios.put(endpoint, updatedCulture)
			: axios.post(endpoint, updatedCulture);

		axiosCall
			.then((response) => {
				logger.info(
					`Culture processed successfully: ${JSON.stringify(response.data)}`,
				);
				updateCulturesList(response.data);
				handleClose();
			})
			.catch((error) => {
				logger.error(`Error processing culture: ${error}`);
			});
	};

	// Close handlers
	const handleClose = () => {
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
