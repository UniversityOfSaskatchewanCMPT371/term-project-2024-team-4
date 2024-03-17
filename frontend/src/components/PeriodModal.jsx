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
 * Represents a modal dialog for adding or editing a period.
 *
 * Pre-conditions:
 * - The modal receives all necessary props for either adding a new period or editing an existing one.
 * - Axios and logger are configured correctly for HTTP requests and logging.
 *
 * Post-conditions:
 * - If input validation passes, a period is either created or updated via an HTTP request.
 * - Appropriate log messages are generated based on the operation's outcome.
 * - Modal is closed upon successful operation or when the user decides to cancel.
 *
 * @param {Object} props - Component props containing functions for modal state management and period list update, and optionally, an existing period's data for editing.
 * @returns {JSX.Element} A rendered modal component for period addition or editing.
 */
export default function PeriodModal({
	setEditPeriod,
	selectedPeriod,
	selectedPeriodStartDate,
	selectedPeriodEndDate,
	selectedPeriodID,
	updatePeriodsList,
}) {
	// State setup for period name, start and end dates, and validation errors
	const [open, setOpen] = useState(true);
	const [periodName, setPeriodName] = useState(selectedPeriod || "");
	const [startDate, setStartDate] = useState(selectedPeriodStartDate || "");
	const [endDate, setEndDate] = useState(selectedPeriodEndDate || "");
	const [errors, setErrors] = useState({ startDate: "", endDate: "" });

	/**
	 * This funciton validates the start and end dates to ensure they are integers.
	 * Logs an error and throws an exception if validation fails.
	 *
	 * @returns {boolean} The result of the validation check.
	 */
	const validateDates = () => {
		let isValid = true;
		const newErrors = { startDate: "", endDate: "" };

		if (!/^\d+$/.test(startDate)) {
			newErrors.startDate = "Start date must be an integer.";
			isValid = false;
		}

		if (!/^\d+$/.test(endDate)) {
			newErrors.endDate = "End date must be an integer.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid; // Return the validation result instead of throwing an error
	};

	/**
	 * This function handles the save action for both adding a new period and editing an existing one.
	 * Makes an HTTP request based on the provided period data and updates the period list accordingly.
	 */
	const handleSave = () => {
		if (!validateDates()) {
			return; // Stop the save process if validation fails
		}

		const updatedPeriod = {
			name: periodName,
			start: parseInt(startDate, 10),
			end: parseInt(endDate, 10),
		};

		const requestUrl = `http://localhost:3000/periods/${selectedPeriodID || ""}`;
		const requestMethod = selectedPeriodID ? axios.put : axios.post;

		requestMethod(requestUrl, updatedPeriod)
			.then((response) => {
				logger.info("Period saved successfully: ", response.data);
				updatePeriodsList(response.data);
				handleClose();
			})
			.catch((error) => {
				logger.error("Error saving period: ", error);
				alert("Error saving period. See console for details.");
			});
	};

	/**
	 * Closes the modal and resets edit mode.
	 */
	const handleClose = () => {
		setOpen(false);
		setEditPeriod(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>
					{selectedPeriodID ? "Edit Period" : "Add New Period"}
				</DialogTitle>
				<DialogContent>
					<TextField
						id="name"
						label="Period Name"
						variant="outlined"
						fullWidth
						value={periodName}
						onChange={(e) => setPeriodName(e.target.value)}
						margin="normal"
					/>
					<TextField
						id="startDate"
						label="Start Year"
						type="number"
						variant="outlined"
						fullWidth
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						error={!!errors.startDate}
						helperText={errors.startDate}
						margin="normal"
					/>
					<TextField
						id="endDate"
						label="End Year"
						type="number"
						variant="outlined"
						fullWidth
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						error={!!errors.endDate}
						helperText={errors.endDate}
						margin="normal"
					/>
					<Button
						onClick={handleSave}
						variant="contained"
						color="primary"
						style={{ marginTop: "20px" }}
					>
						Save
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}
