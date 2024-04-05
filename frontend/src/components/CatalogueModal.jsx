/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import http from "../../http.js";
import log from "../logger.js";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from "@mui/material";

/**
 * CatalogueModal functional component for creating and editing catalogue information.
 *
 * @param {Object} props - The component props.
 * @param {function} props.setOpen - Function to control the modal visibility.
 * @pre None
 * @post Renders a form allowing users to create or edit catalogue details. Communicates with backend services to update catalogue information.
 * @returns {JSX.Element} The rendered modal component.
 */
const CatalogueModal = ({
	openEdit,
	setOpenEdit,
	catalogueId,
	catalogueName,
}) => {
	const [name, setCatalogueName] = useState("");
	const [description, setDescription] = useState("");

	const [catalogueNameError, setCatalogueNameError] = useState(false); // for artifact type dropdown error handling

	/**
	 * Closes the modal and resets the parent's state.
	 *
	 * @pre None
	 * @post Sets the parent component's open state to false.
	 */
	const handleClose = () => {
		setOpenEdit(false);
	};

	// Handlers for updating state based on form input
	const handleNameChange = (event) => setCatalogueName(event.target.value);
	const handleDescriptionChange = (event) => setDescription(event.target.value);

	/**
	 * Submits the new or edited catalogue information to the backend.
	 *
	 * @pre Form data (name, description) must be filled out.
	 * @post Sends the catalogue data to the backend and closes the modal if successful. Logs the action. Handles any errors.
	 */
	const handleSubmit = () => {
		if (name.trim() === "") {
			setCatalogueNameError(true);

			return; // Prevent form submission
		} else {
			setCatalogueNameError(false);
		}

		const newCatalogue = {
			name,
			description,
		};

		// set up API endpoint
		const requestUrl = `/catalogues/${catalogueId}`;
		const requestMethod = http.put;

		requestMethod(requestUrl, newCatalogue)
			.then((response) => {
				log.info("Updated catalogue successfully:", response.data);
				handleClose();
			})
			.catch((error) => {
				log.error("Error updating site:", error);
				handleClose();
			});

		log.info("Submitted:", newCatalogue);
	};

	/**
	 * Pre-populate input fields for editing catalogue
	 */
	useEffect(() => {
		http
			.get(`/catalogues/${catalogueId}`)
			.then((response) => {
				log.info("Editing catalogue: ", response.data);
				setCatalogueName(response.data.name);
				setDescription(response.data.description);
			})
			.catch((error) => {
				log.error("Error fetching catalogue: ", error);
			});
	}, [openEdit, catalogueId]);

	return (
		<div>
			<Dialog
				open={true}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
				PaperProps={{ style: { maxHeight: "80vh" } }}
			>
				<DialogTitle>Update {catalogueName} Catalogue</DialogTitle>
				<DialogContent style={{ minHeight: "300px" }}>
					<TextField
						autoFocus
						margin="dense"
						id="catalogueName"
						label="Catalogue Name"
						fullWidth
						required
						error={Boolean(catalogueNameError)}
						helperText={catalogueNameError && "Please enter a Catalogue Name"}
						value={name}
						onChange={handleNameChange}
					/>
					<TextField
						margin="dense"
						id="description"
						label="Catalogue Description"
						fullWidth
						multiline
						rows={10}
						value={description}
						onChange={handleDescriptionChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						Save Changes
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default CatalogueModal;
