/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
	MenuItem,
} from "@mui/material";
import http from "../../http.js";

/**
 * The AddCultureDialog component allows users to add a new culture.
 * It requires three props:
 * @param open (boolean): Whether the dialog is open.
 * @param onClose (function): Function to call when the dialog should be closed.
 * @param onSave (function): Function to call when a new culture is saved.
 */
export default function AddCultureDialog({ open, onClose, onSave }) {
	const [name, setName] = useState(""); // Stores the name of the new culture
	const [periodId, setPeriodId] = useState(""); // Stores the selected period's ID
	const [periods, setPeriods] = useState([]); // Stores the list of available periods
	const [error, setError] = useState(""); // Stores the error message, if any

	// Fetches available periods from the server when the component mounts
	useEffect(() => {
		const fetchPeriods = async () => {
			try {
				const response = await http.get("/periods");
				setPeriods(response.data); // Update the periods state with the fetched data
			} catch (error) {
				console.error("Error fetching periods:", error);
			}
		};
		fetchPeriods();
	}, []);

	// Handles the save button click
	const handleSave = () => {
		setError(""); // Reset any existing errors

		// Pre-condition: Validate that name and periodId are not empty
		if (!name.trim() || !periodId) {
			setError("Both name and associated period are required.");
			return; // Stop the onSave callback if validation fails
		}

		// Post-condition: If validation passes, call the onSave prop
		onSave({ name, periodId: parseInt(periodId, 10) });

		// Close the dialog
		onClose();
	};

	// Render the dialog
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Add New Culture</DialogTitle>
			<DialogContent>
				{error && (
					<Typography color="error" style={{ marginBottom: "10px" }}>
						{error}
					</Typography>
				)}
				<TextField
					autoFocus
					margin="dense"
					label="Culture Name"
					type="text"
					fullWidth
					variant="outlined"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<TextField
					select
					label="Associated Period"
					value={periodId}
					onChange={(e) => setPeriodId(e.target.value)}
					fullWidth
					margin="dense"
				>
					{periods.length > 0 ? (
						periods.map((option) => (
							<MenuItem key={option.id} value={option.id}>
								{option.name} ({option.start} - {option.end})
							</MenuItem>
						))
					) : (
						<Typography variant="body2" color="textSecondary">
							No periods available. Please create a Period first through the
							Manage Periods Tab.
						</Typography>
					)}
				</TextField>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave}>Save</Button>
			</DialogActions>
		</Dialog>
	);
}
