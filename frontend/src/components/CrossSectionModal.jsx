/* eslint-disable react/prop-types */
import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function RegionModal({
	setEditCrossSection,
	selectedCrossSection,
	selectedCrossSectionID,
}) {
	const [open, setOpen] = useState(true); // State to manage the dialog open/close
	const [crossSection, setCrossSection] = useState(selectedCrossSection);

	const handleSave = () => {
		const updatedCrossSection = {
			crossSection,
		};

		if (selectedCrossSection) {
			axios
				.put(
					`http://localhost:3000/crossSections/${selectedCrossSectionID}`,
					updatedCrossSection,
				)
				.then((response) => {
					console.log("CrossSection updated successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating CrossSection:", error);
				});
		}

		setOpen(false); // Close the dialog
		setEditCrossSection(false);

		if (!selectedCrossSection) {
			axios
				.post("http://localhost:3000/crossSections", updatedCrossSection)
				.then((response) => {
					console.log("CrossSection created successfully:", response.data);
				})
				.catch((error) => {
					console.error("Error updating CrossSection:", error);
				});
		}
	};

	const handleClose = () => {
		setOpen(false); // Close the dialog
		setEditCrossSection(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogContent>
					<TextField
						id="crossSection"
						label="Cross Section"
						variant="outlined"
						fullWidth
						value={crossSection} // Use value instead of defaultValue
						onChange={(e) => setCrossSection(e.target.value)} // Handle change in name field
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
