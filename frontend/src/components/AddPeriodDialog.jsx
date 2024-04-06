/* eslint-disable react/prop-types */
import { useState, Fragment } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
	DialogContentText,
} from "@mui/material";

/**
 * Component for adding a new historical period.
 * Preconditions: 'periodNames' should be an array containing the names of all existing periods to check for duplicates.
 * Postconditions: If the user fills in valid data and confirms, a new period is saved. If the name exists, the user is prompted to confirm.
 *
 * @param {boolean} open Controls the visibility of the dialog.
 * @param {function} onClose Function to be called to close the dialog.
 * @param {function} onSave Function to be called to save the new period data.
 * @param {array} periodNames Array containing names of all existing periods to avoid duplicates.
 */
export default function AddPeriodDialog({
	open,
	onClose,
	onSave,
	periodNames,
}) {
	const [name, setName] = useState("");
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");
	const [error, setError] = useState(""); // Holds the error message for input validation.
	const [confirmOpen, setConfirmOpen] = useState(false); // Controls visibility of the confirmation dialog.

	/**
	 * Handles the saving of a new period.
	 * Checks for empty fields, validates year range, and checks for duplicate names.
	 * If a duplicate name is found, triggers confirmation dialog.
	 */
	const handleSave = () => {
		setError(""); // Clear existing errors.

		// Validate input fields are filled.
		if (!name.trim() || !start.trim() || !end.trim()) {
			setError("All fields are required.");
			return;
		}

		const startYear = parseInt(start, 10); // Convert start year from string to integer.
		const endYear = parseInt(end, 10); // Convert end year from string to integer.

		// Validate the start and end years.
		if (startYear > endYear || startYear <= 0 || endYear <= 0) {
			setError("Please enter a valid start and end year.");
			return;
		}

		// Check for duplicate period names.
		if (periodNames.includes(name)) {
			setConfirmOpen(true); // If duplicate, request confirmation.
		} else {
			// If not a duplicate, save the period and close dialog.
			onSave({ name, start: startYear, end: endYear });
			onClose();
		}
	};

	/**
	 * Handles the confirmation action when a duplicate name is detected.
	 * Saves the new period regardless of the duplicate and closes the dialog.
	 */
	const handleConfirmSave = () => {
		onSave({ name, start: parseInt(start, 10), end: parseInt(end, 10) });
		onClose();
		setConfirmOpen(false); // Close the confirmation dialog.
	};

	return (
		<Fragment>
			{/* Main dialog for adding a new period */}
			<Dialog open={open} onClose={onClose}>
				<DialogTitle>Add New Period</DialogTitle>
				<DialogContent>
					{error && (
						<Typography color="error" style={{ marginBottom: "10px" }}>
							{error} {/* Display validation error message */}
						</Typography>
					)}
					{/* Input fields for period details */}
					<TextField
						autoFocus
						margin="dense"
						label="Name"
						type="text"
						fullWidth
						variant="outlined"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Start Year"
						type="number"
						fullWidth
						variant="outlined"
						value={start}
						onChange={(e) => setStart(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="End Year"
						type="number"
						fullWidth
						variant="outlined"
						value={end}
						onChange={(e) => setEnd(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Cancel</Button>
					<Button onClick={handleSave}>Save</Button>
				</DialogActions>
			</Dialog>

			{/* Confirmation dialog for duplicate period names */}
			<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
				<DialogTitle>Confirm</DialogTitle>
				<DialogContent>
					<DialogContentText>
						A period with this name already exists. Would you like to proceed?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmOpen(false)}>No</Button>
					<Button onClick={handleConfirmSave} color="primary">
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
