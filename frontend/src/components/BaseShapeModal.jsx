/* eslint-disable indent */
/* eslint-disable react/prop-types */
import {
	TextField,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { useState } from "react";
import http from "../../http";
import log from "../logger";

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
	setSelectedBaseShape,
	selectedBaseShapeID,
	updateBaseShapesList,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [baseShape, setBaseShape] = useState(selectedBaseShape || "");
	const [errors, setErrors] = useState({
		baseShape: "",
	});

	const validateForm = () => {
		let isValid = true;
		const newErrors = {
			baseShape: "",
		};

		// Validate Base Shape Name
		if (!baseShape.trim()) {
			newErrors.baseShape = "Base Shape name is required.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	/**
	 * Handles the save action for the modal form. Sends a PUT request if editing, POST if adding.
	 * Updates the base shape list in the parent component on success.
	 */
	const handleSave = () => {
		const baseShapeData = { name: baseShape };

		if (!validateForm()) {
			log.debug("Base Shape Form fails frontend validation");
			return;
		}

		const apiCall = selectedBaseShapeID
			? http.put(`/baseShapes/${selectedBaseShapeID}`, baseShapeData)
			: http.post("/baseShapes", baseShapeData);

		apiCall
			.then((response) => {
				log.info(
					`Base shape ${selectedBaseShapeID ? "updated" : "created"} successfully: `,
					response.data,
				);
				updateBaseShapesList(response.data);
				handleClose();
			})
			.catch((error) => {
				log.error("Error saving Base Shape: ", error);
			});
	};

	/**
	 * Closes the modal and resets the editing state in the parent component.
	 */
	const handleClose = () => {
		setOpen(false);
		setSelectedBaseShape("");
		if (setEditBaseShape) setEditBaseShape(false);
		log.debug(
			`BaseShapeModal closed, mode: ${selectedBaseShapeID ? "edit" : "add"}.`,
		);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>
					{selectedBaseShapeID ? "Edit Base Shape" : "Add New Base Shape"}
				</DialogTitle>
				<DialogContent>
					<TextField
						id="baseShape"
						label="Base Shape"
						variant="outlined"
						fullWidth
						value={baseShape}
						onChange={(e) => setBaseShape(e.target.value)}
						error={!!errors.baseShape}
						helperText={errors.baseShape}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSave} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
