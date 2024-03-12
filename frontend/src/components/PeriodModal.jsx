/* eslint-disable react/prop-types */
import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function RegionModal({
	setEditPeriod,
	selectedPeroid,
	selectedPeriodStartDate,
	selectedPeriodEndDate,
	selectedPeriodID,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [periodName, setPeriodName] = useState(selectedPeroid);
	const [startDate, setStartDate] = useState(selectedPeriodStartDate);
	const [endDate, setEndDate] = useState(selectedPeriodEndDate);

	const handleSave = () => {
		const updatedPeriod = {
			periodName,
			startDate,
			endDate,
		};

		if (selectedPeroid) {
			axios
				.put(`http://localhost:3000/regions/${selectedPeriodID}`, updatedPeriod)
				.then((response) => {
					console.log("Period updated successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating period:", error);
				});
		}

		setOpen(false); // Close the dialog
		setEditPeriod(false);

		if (!selectedPeroid) {
			axios
				.post("http://localhost:3000/periods", updatedPeriod)
				.then((response) => {
					console.log("Period created successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating period:", error);
				});
		}
	};

	const handleClose = () => {
		setOpen(false); // Close the dialog
		setEditPeriod(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<TextField
						id="name"
						label="Period"
						variant="outlined"
						fullWidth
						value={periodName} // Use value instead of defaultValue
						onChange={(e) => setPeriodName(e.target.value)} // Handle change in name field
						style={{ marginBottom: "15px" }}
					/>
					<TextField
						id="startDate"
						label="Start Date"
						multiline
						minRows={4}
						maxRows={10}
						variant="outlined"
						fullWidth
						value={startDate} // Use value instead of defaultValue
						onChange={(e) => setStartDate(e.target.value)} // Handle change in description field
						style={{ marginBottom: "15px" }}
					/>
					<TextField
						id="endDate"
						label="End Date"
						multiline
						minRows={4}
						maxRows={10}
						variant="outlined"
						fullWidth
						value={endDate} // Use value instead of defaultValue
						onChange={(e) => setEndDate(e.target.value)} // Handle change in description field
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
