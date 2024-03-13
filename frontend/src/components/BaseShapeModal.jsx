/* eslint-disable react/prop-types */
import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import logger from "../logger";

/**
 * Component for editing or adding a new base shape.
 *
 * Pre-conditions:
 *   - setEditBaseShape: Function to toggle edit mode in the parent component.
 *   - selectedBaseShape: The currently selected base shape's name (if editing).
 *   - selectedBaseShapeID: The ID of the currently selected base shape (if editing).
 *   - updateBaseShapesList: Function to update the base shapes list in the parent component.
 *
 * Post-conditions:
 *   - A new base shape is created or an existing one is updated upon form submission.
 *   - The parent component's list of base shapes is updated.
 *   - Modal is closed after submission or cancellation.
 *
 * @param {Function} setEditBaseShape Function to control the editing state.
 * @param {string} selectedBaseShape Name of the base shape currently being edited or added.
 * @param {string} selectedBaseShapeID ID of the base shape being edited, null if adding.
 * @param {Function} updateBaseShapesList Function to update the list of base shapes in the parent component.
 */
export default function BaseShapeModal({
	setEditBaseShape,
	selectedBaseShape,
	selectedBaseShapeID,
	updateBaseShapesList,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [baseShape, setbaseShape] = useState(selectedBaseShape);

	/**
	 * Handles the save action for the modal form. Sends a PUT request if editing, POST if adding.
	 * Updates the base shape list in the parent component on success.
	 */
	const handleSave = () => {
		const baseShapeData = { name: baseShape };

		const apiCall = selectedBaseShapeID
			? axios.put(
					`http://localhost:3000/baseShapes/${selectedBaseShapeID}`,
					baseShapeData,
				)
			: axios.post("http://localhost:3000/baseShapes", baseShapeData);

		apiCall
			.then((response) => {
				logger.info(
					`Base shape ${selectedBaseShapeID ? "updated" : "created"} successfully: `,
					response.data,
				);
				updateBaseShapesList(response.data);
				handleClose();
			})
			.catch((error) => {
				logger.error("Error saving Base Shape: ", error);
			});
	};

	/**
	 * Closes the modal and resets the editing state in the parent component.
	 */
	const handleClose = () => {
		setOpen(false);
		if (setEditBaseShape) setEditBaseShape(false);
		logger.debug(
			`BaseShapeModal closed, mode: ${selectedBaseShapeID ? "edit" : "add"}.`,
		);
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
						value={baseShape}
						onChange={(e) => setbaseShape(e.target.value)}
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
