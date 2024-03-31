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
	FormControl,
	InputLabel,
	TextField,
	Select,
	MenuItem,
	Grid,
	IconButton,
	Menu,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RegionModal from "./RegionModal";

/**
 * SiteModal functional component for creating and editing site information.
 *
 * @param {Object} props - The component props.
 * @param {function} props.setOpen - Function to control the modal visibility.
 * @pre None
 * @post Renders a form allowing users to create or edit site details. Communicates with backend services to update site information.
 * @returns {JSX.Element} The rendered modal component.
 */
const SiteModal = ({ setOpen }) => {
	const [name, setSiteName] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [regionID, setRegionID] = useState(0);
	const [errors, setErrors] = useState({
		name: "",
		regionID: "",
	});

	const validateForm = () => {
		let isValid = true;
		const newErrors = {
			name: "",
			regionID: "",
		};

		// Validate Site Name
		if (!name.trim()) {
			newErrors.name = "Site name is required.";
			isValid = false;
		}

		// Validate region selection
		if (!regionID) {
			newErrors.regionID = "Region is required.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	/**
	 * Closes the modal and resets the parent's state.
	 *
	 * @pre None
	 * @post Sets the parent component's open state to false.
	 */
	const handleClose = () => {
		setOpen(false);
	};

	// Handlers for updating state based on form input
	const handleNameChange = (event) => setSiteName(event.target.value);
	const handleDescriptionChange = (event) => setDescription(event.target.value);
	const handleLocationChange = (event) => setLocation(event.target.value);

	/**
	 * Submits the new or edited site information to the backend.
	 *
	 * @pre Form data (name, description, location) must be filled out.
	 * @post Sends the site data to the backend and closes the modal if successful. Logs the action. Handles any errors.
	 */
	const handleSubmit = () => {
		if (!validateForm()) {
			log.debug("Site Form fails frontend validation");
			return;
		}
		const newSite = {
			name,
			description,
			location,
			catalogueId: 1,
			regionId: regionID,
		};

		http
			.post("/sites", newSite)
			.then((response) => {
				log.info("New site added successfully:", response.data);
				handleClose();
			})
			.catch((error) => {
				log.error("Error adding new site:", error);
			});
	};

	// Site selection and menu functionality
	const [anchorEl, setAnchorEl] = useState(null);
	const [currentRegion, setCurrentRegion] = useState(null);
	const [regions, setRegions] = useState([]);
	const [selectedRegion, setSelectedRegion] = useState("");
	const [editRegion, setEditRegion] = useState(false);
	const [regionModalOpen, setRegionModalOpen] = useState(false);
	const [selectedRegionID, setSelectedRegionID] = useState(null);
	const [regionError, setRegionError] = useState("");

	/**
	 * Fetches Site information from the backend when the component mounts.
	 *
	 * @pre http must be configured correctly.
	 * @post Updates the regions state with the fetched data and selects the current region if matched.
	 */
	useEffect(() => {
		http
			.get("/regions")
			.then((response) => {
				setRegions(response.data);
				const filteredRegion = response.data.find(
					(region) => region.name === selectedRegion,
				);
				if (filteredRegion) {
					log.info(filteredRegion);
					setRegionID(filteredRegion.id);
				}
			})
			.catch((error) => log.error("Error fetching regions:", error));
	}, [selectedRegion]);

	// This function opens the CultureModal for editing an existing culture or adding a new one.
	// If a cultureId is provided, the modal is configured for editing that culture.
	// If no cultureId is provided, the modal is configured for adding a new culture.
	const handleOpenRegionModal = (regionId = null) => {
		setSelectedRegionID(regionId);
		setEditRegion(true);
		setRegionModalOpen(true);
	};

	// This function handles the selection of a culture from the dropdown menu.
	// Also prepares to show options for editing or deleting the selected culture.
	const handleOpenMenu = (event, region) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setAnchorEl(event.currentTarget);
		setCurrentRegion(region);
	};

	// Function to close the dropdown menu
	const handleCloseMenu = () => {
		setAnchorEl(null);
		setCurrentRegion(null);
	};

	// This function the selectedCulture state when a user selects a different culture from the dropdown
	const handleRegionChange = (event) => {
		setSelectedRegion(event.target.value);
	};

	// This function ensures the dropdown list reflects the most current data without needing to refetch from the server.
	const updateRegionsList = (newRegion) => {
		setRegions((prevRegions) => {
			const index = prevRegions.findIndex(
				(region) => region.id === newRegion.id,
			);
			if (index > -1) {
				// Update existing region
				const updatedRegions = [...prevRegions];
				updatedRegions[index] = newRegion;
				return updatedRegions;
			} else {
				// Else, add the new region to the list
				return [...prevRegions, newRegion];
			}
		});
	};
	// This function handles delete a culture from the server and updates the local list.
	const handleDeleteRegion = () => {
		if (currentRegion && currentRegion.id) {
			http
				.delete(`/regions/${currentRegion.id}`)
				.then(() => {
					setRegions(regions.filter((r) => r.id !== currentRegion.id));
					handleCloseMenu();
				})
				.catch((error) => {
					log.error("Error deleting region:", error);
				});
		}
	};
	// ---------------- End of RegionModal functions --------------------

	return (
		<div>
			<Dialog
				open={true}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
				PaperProps={{ style: { maxHeight: "80vh" } }}
			>
				<DialogTitle>Create a Site</DialogTitle>
				<DialogContent style={{ minHeight: "300px" }}>
					<TextField
						autoFocus
						margin="dense"
						id="siteName"
						label="Site Name"
						fullWidth
						value={name}
						onChange={handleNameChange}
						error={!!errors.name}
						helperText={errors.name}
					/>
					<TextField
						margin="dense"
						id="description"
						label="Site Description"
						fullWidth
						multiline
						rows={10}
						value={description}
						onChange={handleDescriptionChange}
					/>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<TextField
								margin="dense"
								id="location"
								label="Location"
								fullWidth
								value={location}
								onChange={handleLocationChange}
							/>
						</Grid>
						<Grid item xs={6}>
							{/* ------------ Start of RegionModal ------------- */}
							<FormControl sx={{ mt: 1, width: "100%" }}>
								<InputLabel id="region-label">Region</InputLabel>
								<Select
									id="region"
									label="Region"
									labelId="region-label"
									value={selectedRegion}
									onChange={handleRegionChange}
									renderValue={(selected) => selected}
									error={!!errors.regionID}
								>
									{regions.map((region) => (
										<MenuItem key={region.id} value={region.name}>
											{region.name}
											<IconButton
												size="small"
												onClick={(event) => handleOpenMenu(event, region)}
												style={{ marginLeft: "auto" }}
											>
												<MoreHorizIcon />
											</IconButton>
										</MenuItem>
									))}
									<MenuItem onClick={() => handleOpenRegionModal()}>
										+ Add New Region
									</MenuItem>
								</Select>
								{errors.regionID && (
									<p style={{ color: "red", margin: "8px 14px 0" }}>
										{errors.regionID}
									</p>
								)}
							</FormControl>
							<Menu
								id="region-menu"
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleCloseMenu}
							>
								<MenuItem
									onClick={() => {
										handleOpenRegionModal(currentRegion.id);
										handleCloseMenu();
									}}
								>
									<EditIcon fontSize="small" /> Edit
								</MenuItem>
								<MenuItem onClick={handleDeleteRegion}>
									<DeleteIcon fontSize="small" /> Delete
								</MenuItem>
							</Menu>
							{/* ------------ End of SiteModal  ------------- */}
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						Add
					</Button>
				</DialogActions>
			</Dialog>
			{editRegion && (
				<RegionModal
					setEditRegion={setEditRegion}
					selectedRegion={selectedRegion}
					selectedRegionID={selectedRegionID}
					regions={regions}
					setRegions={setRegions}
					updateRegionsList={updateRegionsList}
					regionModalOpen={regionModalOpen}
					setRegionModalOpen={setRegionModalOpen}
				/>
			)}
		</div>
	);
};

export default SiteModal;
