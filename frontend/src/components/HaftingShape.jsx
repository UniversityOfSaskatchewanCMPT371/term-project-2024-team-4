/* eslint-disable react/prop-types */
import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function RegionModal({
	setEditHaftingShape,
	selectedHaftingShape,
	selectedHaftingShapeID,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [haftingShape, setHaftingShape] = useState(selectedHaftingShape);

	const handleSave = () => {
		const updatedHaftingShape = {
			haftingShape,
		};

		if (selectedHaftingShape) {
			axios
				.put(
					`http://localhost:3000/haftingShapes/${selectedHaftingShapeID}`,
					updatedHaftingShape,
				)
				.then((response) => {
					console.log("HaftingShape updated successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating HaftingShape:", error);
				});
		}

		setOpen(false); // Close the dialog
		setEditHaftingShape(false);

		if (!selectedHaftingShape) {
			axios
				.post("http://localhost:3000/haftingShapes", updatedHaftingShape)
				.then((response) => {
					console.log("HaftingShape created successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating HaftingShape:", error);
				});
		}
	};

	const handleClose = () => {
		setOpen(false); // Close the dialog
		setEditHaftingShape(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<TextField
						id="haftingShape"
						label="Hafting Shape"
						variant="outlined"
						fullWidth
						value={haftingShape} // Use value instead of defaultValue
						onChange={(e) => setHaftingShape(e.target.value)} // Handle change in name field
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
