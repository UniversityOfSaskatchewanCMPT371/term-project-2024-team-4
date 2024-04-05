/* eslint-disable react/prop-types */
import {
	TextField,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
} from "@mui/material";
import { useState } from "react";
import http from "../../http";
import log from "../logger";

/**
 * RegionModal Component
 * A modal component used to add a new region or edit an existing one.
 *
 * @pre
 * - Props `setEditRegion`, `updateRegionsList` must be provided and be functions.
 * - Props `selectedRegion`, `selectedRegionDescription`, and `selectedRegionID` must be strings or null.
 *
 * @post
 * - Upon successful save, the regions list in the parent component is updated.
 * - The modal will close and the editing state will reset.
 *
 * @param {Object} props - Component props:
 *   - setEditRegion: Function to update the edit state of the region.
 *   - selectedRegion: The current name of the region being edited (if any).
 *   - selectedRegionDescription: The current description of the region being edited.
 *   - selectedRegionID: The ID of the region being edited, if applicable.
 *   - updateRegionsList: Function to update the list of regions after adding/editing.
 * @returns {JSX.Element} A rendered modal component for region addition or editing.
 */
export default function RegionModal({
	setEditRegion,
	selectedRegion,
	setSelectedRegion,
	selectedRegionID,
	updateRegionsList,
}) {
	const [open, setOpen] = useState(true);
	const [regionName, setRegionName] = useState(selectedRegion.name || "");
	const [description, setDescription] = useState(
		selectedRegion ? selectedRegion.description : "",
	);
	const [errors, setErrors] = useState({
		regionName: "",
	});

	const validateForm = () => {
		let isValid = true;
		const newErrors = {
			regionName: "",
		};

		// Validate Region Name
		if (!regionName.trim()) {
			newErrors.regionName = "Region name is required.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	/**
	 * handleSave function
	 * Handles the save action when the 'Save' button is clicked.
	 *
	 * @pre
	 * - `regionName` and `description` states must be initialized.
	 *
	 * @post
	 * - Makes a PUT or POST HTTP request to save the region data.
	 * - Updates the region list in the parent component on success.
	 * - Closes the modal and resets the editing state.
	 */
	const handleSave = () => {
		if (!validateForm()) {
			log.debug("Region Form fails frontend validation");
			return;
		}

		const updatedRegion = { name: regionName, description };
		const requestUrl = `/regions/${selectedRegionID || ""}`;
		const requestMethod = selectedRegionID ? http.put : http.post;

		requestMethod(requestUrl, updatedRegion)
			.then((response) => {
				log.info("Region saved successfully: ", response.data);
				updateRegionsList(response.data);
				handleClose();
			})
			.catch((error) => {
				log.error("Error saving region: ", error);
				alert("Error saving region. See console for details.");
			});
	};

	/**
	 * handleClose function
	 * Closes the modal and resets the region editing state.
	 *
	 * @post
	 * - The `open` state is set to false.
	 * - The `setEditRegion` prop function is called with false.
	 */
	const handleClose = () => {
		setOpen(false);
		setSelectedRegion("");
		setEditRegion(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>
					{selectedRegionID ? "Edit Region" : "Add New Region"}
				</DialogTitle>
				<DialogContent>
					<TextField
						id="name"
						label="Region Name"
						variant="outlined"
						fullWidth
						value={regionName}
						onChange={(e) => setRegionName(e.target.value)}
						margin="normal"
						error={!!errors.regionName}
						helperText={errors.regionName}
					/>
					<TextField
						id="description"
						label="Description"
						multiline
						minRows={4}
						maxRows={10}
						variant="outlined"
						fullWidth
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						margin="normal"
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
