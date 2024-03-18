/* eslint-disable indent */
/* eslint-disable react/prop-types */
import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import logger from "../logger";

export default function HaftingShapeModal({
	setEditHaftingShape,
	selectedHaftingShape,
	selectedHaftingShapeID,
	updateHaftingShapeList,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [haftingShape, setHaftingShape] = useState(selectedHaftingShape);

	/**
	 * Handles the save action when the form is submitted.
	 * Validates the form, updates the blade shape, and closes the modal.
	 */
	const handleSave = () => {
		const haftingShapeData = { name: haftingShape };

		const apiCall = selectedHaftingShapeID
			? axios.put(
					`http://localhost:3000/haftingShapes/${selectedHaftingShapeID}`,
					haftingShapeData,
				)
			: axios.post("http://localhost:3000/haftingShapes", haftingShapeData);

		apiCall
			.then((response) => {
				logger.info(
					`Hafting shape ${selectedHaftingShapeID ? "updated" : "created"} successfully: `,
					response.data,
				);
				updateHaftingShapeList(response.data);
				handleClose();
			})
			.catch((error) => {
				logger.error("Error saving Hafting Shape: ", error);
			});
	};

	/**
	 * Closes the modal and resets the blade shape editing state.
	 */
	const handleClose = () => {
		setOpen(false);
		if (setEditHaftingShape) setEditHaftingShape(false);
		logger.debug(
			`HaftingShapeModal closed, mode: ${selectedHaftingShape ? "edit" : "add"}.`,
		);
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
