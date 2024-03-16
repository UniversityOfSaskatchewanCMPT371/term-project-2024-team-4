/* eslint-disable react/prop-types */
import {
	TextField,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import log from "../logger";

export default function RegionModal({
	setEditRegion,
	selectedRegion,
	selectedRegionDescription,
	selectedRegionID,
	updateRegionsList,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [regionName, setRegionName] = useState(selectedRegion || ""); // Initialize name state with selectedRegion
	const [description, setDescription] = useState(
		selectedRegionDescription || "",
	);

	const handleSave = () => {
		const updatedRegion = {
			name: regionName,
			description,
		};

		const requestUrl = `http://localhost:3000/regions/${
			selectedRegionID || ""
		}`;
		const requestMethod = selectedRegionID ? axios.put : axios.post;

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

	const handleClose = () => {
		setOpen(false); // Close the dialog
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
						value={regionName} // Use value instead of defaultValue
						onChange={(e) => setRegionName(e.target.value)} // Handle change in name field
						margin="normal"
					/>
					<TextField
						id="description"
						label="Description"
						multiline
						minRows={4}
						maxRows={10}
						variant="outlined"
						fullWidth
						value={description} // Use value instead of defaultValue
						onChange={(e) => setDescription(e.target.value)} // Handle change in description field
						margin="normal"
					/>
					<br />
					<Button
						onClick={handleSave}
						variant="contained"
						color="primary"
						style={{ marginTop: "20px" }}
					>
						Save
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
}
