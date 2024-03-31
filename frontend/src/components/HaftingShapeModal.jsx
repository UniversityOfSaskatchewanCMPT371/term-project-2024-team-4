/* eslint-disable indent */
/* eslint-disable react/prop-types */
import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import http from "../../http";
import log from "../logger";

export default function HaftingShapeModal({
	setEditHaftingShape,
	selectedHaftingShape,
	selectedHaftingShapeID,
	updateHaftingShapeList,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [haftingShape, setHaftingShape] = useState(selectedHaftingShape || "");
	const [errors, setErrors] = useState({
		haftingShape: "",
	});

	const validateForm = () => {
		let isValid = true;
		const newErrors = {
			haftingShape: "",
		};

		// Validate Hafting Shape name
		if (!haftingShape.trim()) {
			newErrors.haftingShape = "Hafting Shape name is required.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	/**
	 * Handles the save action when the form is submitted.
	 * Validates the form, updates the blade shape, and closes the modal.
	 */
	const handleSave = () => {
		const haftingShapeData = { name: haftingShape };

		if (!validateForm()) {
			log.debug("Hafting Shape Form fails frontend validation");
			return;
		}

		const apiCall = selectedHaftingShapeID
			? http.put(`/haftingShapes/${selectedHaftingShapeID}`, haftingShapeData)
			: http.post("/haftingShapes", haftingShapeData);

		apiCall
			.then((response) => {
				log.info(
					`Hafting shape ${selectedHaftingShapeID ? "updated" : "created"} successfully: `,
					response.data,
				);
				updateHaftingShapeList(response.data);
				handleClose();
			})
			.catch((error) => {
				log.error("Error saving Hafting Shape: ", error);
			});
	};

	/**
	 * Closes the modal and resets the blade shape editing state.
	 */
	const handleClose = () => {
		setOpen(false);
		if (setEditHaftingShape) setEditHaftingShape(false);
		log.debug(
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
						error={!!errors.haftingShape}
						helperText={errors.haftingShape}
					/>
					<Button onClick={handleSave} variant="contained" color="primary">
						Save
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}
