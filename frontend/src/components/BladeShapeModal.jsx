/* eslint-disable react/prop-types */
import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function RegionModal({
	setEditBladeShape,
	selectedBladeShape,
	selectedBladeShapeID,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [bladeShape, setbladeShape] = useState(selectedBladeShape);

	const handleSave = () => {
		const updatedBladeShape = {
			bladeShape,
		};

		if (selectedBladeShape) {
			axios
				.put(
					`http://localhost:3000/bladeShapes/${selectedBladeShapeID}`,
					updatedBladeShape,
				)
				.then((response) => {
					console.log("BladeShape updated successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating BladeShape:", error);
				});
		}

		setOpen(false); // Close the dialog
		setEditBladeShape(false);

		if (!selectedBladeShape) {
			axios
				.post("http://localhost:3000/bladeShapes", updatedBladeShape)
				.then((response) => {
					console.log("BladeShape created successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating BladeShape:", error);
				});
		}
	};

	const handleClose = () => {
		setOpen(false); // Close the dialog
		setEditBladeShape(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<TextField
						id="bladeShape"
						label="Blade Shape"
						variant="outlined"
						fullWidth
						value={bladeShape} // Use value instead of defaultValue
						onChange={(e) => setbladeShape(e.target.value)} // Handle change in name field
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
