/* eslint-disable react/prop-types */
import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function RegionModal({
	setEditBaseShape,
	selectedBaseShape,
	selectedBaseShapeID,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [baseShape, setbaseShape] = useState(selectedBaseShape);

	const handleSave = () => {
		const updatedBaseShape = {
			baseShape,
		};

		if (selectedBaseShape) {
			axios
				.put(
					`http://localhost:3000/baseShapes/${selectedBaseShapeID}`,
					updatedBaseShape,
				)
				.then((response) => {
					console.log("BaseShape updated successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating BaseShape:", error);
				});
		}

		setOpen(false); // Close the dialog
		setEditBaseShape(false);

		if (!selectedBaseShape) {
			axios
				.post("http://localhost:3000/baseShapes", updatedBaseShape)
				.then((response) => {
					console.log("BaseShape created successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating BaseShape:", error);
				});
		}
	};

	const handleClose = () => {
		setOpen(false); // Close the dialog
		setEditBaseShape(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<TextField
						id="baseShape"
						label="Base Shape"
						variant="outlined"
						fullWidth
						value={baseShape} // Use value instead of defaultValue
						onChange={(e) => setbaseShape(e.target.value)} // Handle change in name field
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
