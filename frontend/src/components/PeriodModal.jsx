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
import logger from "../logger";

/**
 * Represents a modal dialog for adding or editing a period.
 *
 * Pre-conditions:
 * - The modal receives all necessary props for either adding a new period or editing an existing one.
 * - http and logger are configured correctly for HTTP requests and logging.
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
	setSelectedPeriod,
	selectedPeriodStartDate,
	selectedPeriodEndDate,
	selectedPeriodID,
	updatePeriodsList,
}) {
	const [open, setOpen] = useState(true);
	const [periodName, setPeriodName] = useState(selectedPeriod || "");
	const [startDate, setStartDate] = useState(selectedPeriodStartDate || "");
	const [endDate, setEndDate] = useState(selectedPeriodEndDate || "");
	const [errors, setErrors] = useState({
		periodName: "",
		startDate: "",
		endDate: "",
		dateRange: "",
	});

	const validateDates = () => {
		let isValid = true;
		const newErrors = {
			periodName: "",
			startDate: "",
			endDate: "",
			dateRange: "",
		};

		if (!periodName) {
			newErrors.periodName = "Period name is required.";
			isValid = false;
		}

		if (!startDate) {
			newErrors.startDate = "Start date is required.";
			isValid = false;
		} else if (!/^\d+$/.test(startDate)) {
			newErrors.startDate = "Start year must be a positive integer.";
			isValid = false;
		} else if (parseInt(startDate, 10) < 0) {
			newErrors.startDate = "Start year must be greater than or equal to 0.";
			isValid = false;
		}

		if (!endDate) {
			newErrors.endDate = "End date is required.";
			isValid = false;
		} else if (!/^\d+$/.test(endDate)) {
			newErrors.endDate = "End year must be a positive integer.";
			isValid = false;
		} else if (parseInt(endDate, 10) < 0) {
			newErrors.endDate = "End year must be greater than or equal to 0.";
			isValid = false;
		}

		if (parseInt(startDate, 10) > parseInt(endDate, 10)) {
			newErrors.dateRange = "End year must be greater than start year.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSave = () => {
		if (!validateDates()) {
			return;
		}

		const updatedPeriod = {
			name: periodName,
			start: parseInt(startDate, 10),
			end: parseInt(endDate, 10),
		};

		const requestUrl = `/periods/${selectedPeriodID || ""}`;
		const requestMethod = selectedPeriodID ? http.put : http.post;

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

	const handleClose = () => {
		setOpen(false);
		setSelectedPeriod("");
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
						error={!!errors.periodName}
						helperText={errors.periodName}
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
						error={!!errors.startDate || !!errors.dateRange}
						helperText={errors.startDate || errors.dateRange}
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
						error={!!errors.endDate || !!errors.dateRange}
						helperText={errors.endDate || errors.dateRange}
						margin="normal"
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
