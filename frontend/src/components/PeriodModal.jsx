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

export default function PeriodModal({
	setEditPeriod,
	selectedPeriod,
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

		if (!periodName.trim()) {
			newErrors.periodName = "Period name is required.";
			isValid = false;
		}

		if (!startDate.trim()) {
			newErrors.startDate = "Start date is required.";
			isValid = false;
		} else if (!/^\d+$/.test(startDate)) {
			newErrors.startDate = "Start year must be a positive integer.";
			isValid = false;
		} else if (parseInt(startDate, 10) < 0) {
			newErrors.startDate = "Start year must be greater than or equal to 0.";
			isValid = false;
		}

		if (!endDate.trim()) {
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
					<Button
						onClick={handleSave}
						variant="contained"
						color="primary"
						style={{ marginTop: "20px" }}
					>
						Save
					</Button>
					<Button
						onClick={handleClose}
						variant="outlined"
						color="primary"
						style={{ marginTop: "20px", marginLeft: "10px" }}
					>
						Cancel
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}
