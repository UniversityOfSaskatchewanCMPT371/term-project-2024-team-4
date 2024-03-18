/* eslint-disable indent */
/* eslint-disable react/prop-types */
import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import log from "../logger";

/**
 * Modal component for adding or editing blade shapes.
 * Allows for the creation of new blade shapes or editing existing ones.
 *
 * Pre-conditions:
 * - `setEditBladeShape`: Function to update editing state in the parent component.
 * - `selectedBladeShape`: String representing the name of the blade shape being edited, if any.
 * - `selectedBladeShapeID`: ID of the blade shape being edited, null if adding a new blade shape.
 * - `updateBladeShapesList`: Function to update the list of blade shapes in the parent component.
 *
 * Post-conditions:
 * - On successful submission, updates the blade shape list in the parent component.
 * - Closes the modal upon successful submission or cancellation.
 * - Logs the operation status and any errors encountered.
 *
 * @param {Object} props Component props including functions and state for managing blade shape data.
 */
export default function BladeShapeModal({
	setEditBladeShape,
	selectedBladeShape,
	selectedBladeShapeID,
	updateBladeShapesList,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [bladeShape, setbladeShape] = useState(selectedBladeShape);

	/**
	 * Handles the save action when the form is submitted.
	 * Validates the form, updates the blade shape, and closes the modal.
	 */
	const handleSave = () => {
		const bladeShapeData = { name: bladeShape };

		const apiCall = selectedBladeShapeID
			? axios.put(
					`http://localhost:3000/bladeShapes/${selectedBladeShapeID}`,
					bladeShapeData,
				)
			: axios.post("http://localhost:3000/bladeShapes", bladeShapeData);

		apiCall
			.then((response) => {
				log.info(
					`Blade shape ${selectedBladeShapeID ? "updated" : "created"} successfully: `,
					response.data,
				);
				updateBladeShapesList(response.data);
				handleClose();
			})
			.catch((error) => {
				log.error("Error saving Base Shape: ", error);
			});
	};

	/**
	 * Closes the modal and resets the blade shape editing state.
	 */
	const handleClose = () => {
		setOpen(false);
		if (setEditBladeShape) setEditBladeShape(false);
		log.debug(
			`BladeShapeModal closed, mode: ${selectedBladeShapeID ? "edit" : "add"}.`,
		);
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
