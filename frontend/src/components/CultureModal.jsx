/* eslint-disable react/prop-types */
import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function RegionModal({
	setEditCulture,
	selectedCulture,
	selectedCultureID,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [culture, setCulture] = useState(selectedCulture);

	const handleSave = () => {
		const updatedCulture = {
			culture,
		};

		if (selectedCulture) {
			axios
				.put(
					`http://localhost:3000/regions/${selectedCultureID}`,
					updatedCulture,
				)
				.then((response) => {
					console.log("Culture updated successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating culture:", error);
				});
		}

		setOpen(false); // Close the dialog
		setEditCulture(false);

		if (!selectedCulture) {
			axios
				.post("http://localhost:3000/cultures", updatedCulture)
				.then((response) => {
					console.log("Culture created successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating culture:", error);
				});
		}
	};

	const handleClose = () => {
		setOpen(false); // Close the dialog
		setEditCulture(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<TextField
						id="name"
						label="Culture"
						variant="outlined"
						fullWidth
						value={culture} // Use value instead of defaultValue
						onChange={(e) => setCulture(e.target.value)} // Handle change in name field
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
