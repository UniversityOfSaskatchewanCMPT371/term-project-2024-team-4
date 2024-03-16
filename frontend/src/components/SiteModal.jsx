import { useEffect, useState } from "react";
import axios from "axios";
import log from "../logger.js";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
	Grid,
	IconButton,
	Menu,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RegionModal from "./RegionModal";

// eslint-disable-next-line react/prop-types
const SiteModal = ({ setOpen }) => {
	const [name, setSiteName] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [regionID, setRegionID] = useState(0);

	const handleClose = () => {
		setOpen(false);
	};

	const handleNameChange = (event) => {
		setSiteName(event.target.value);
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};

	const handleLocationChange = (event) => {
		setLocation(event.target.value);
	};

	const handleSubmit = () => {
		const newSite = {
			name,
			description,
			location,
			catalogueId: 1,
			regionId: regionID,
		};

		axios
			.post("http://localhost:3000/sites", newSite)
			.then((response) => {
				console.log("New site added successfully:", response.data);
				handleClose();
			})
			.catch((error) => {
				console.error("Error adding new site:", error);
			});
		setOpen(true);
		console.log("Submitted:", newSite);
		handleClose();
	};

	// ------- For state variables for managing period dropdown and edit/delete functionalities -------
	const [anchorEl, setAnchorEl] = useState(null);
	const [currentRegion, setCurrentRegion] = useState(null); // The period currently selected in the dropdown

	// ------------ For state variables for editing periods through the PeriodModal ------------
	const [regions, setRegions] = useState([]);
	const [selectedRegion, setSelectedRegion] = useState("");
	const [editRegion, setEditRegion] = useState(false);
	const [regionModalOpen, setRegionModalOpen] = useState(false);
	const [selectedRegionID, setSelectedRegionID] = useState(null);
	// -----------------------------------------------------------------------------------------

	// ---------------- Start of RegionModal functions --------------------

	// This function fetches cultures when the component mounts. This ensures the dropdown for cultures is always up-to-date.
	useEffect(() => {
		axios
			.get("http://localhost:3000/regions")
			.then((response) => {
				setRegions(response.data);
				const filteredRegion = response.data.find(
					(region) => region.name === selectedRegion,
				);

				// Check if period with the provided name was found
				if (filteredRegion) {
					log.info(filteredRegion);
					setRegionID(filteredRegion.id);
				}
			})
			.catch((error) => {
				console.error("Error fetching cultures:", error);
			});
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
			axios
				.delete(`http://localhost:3000/regions/${currentRegion.id}`)
				.then(() => {
					setRegions(regions.filter((r) => r.id !== currentRegion.id));
					handleCloseMenu();
				})
				.catch((error) => {
					console.error("Error deleting region:", error);
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
							<TextField
								select
								label="Region"
								value={selectedRegion}
								onChange={handleRegionChange}
								fullWidth
								margin="dense"
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
							</TextField>
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
							{/* ------------ End of PeriodModal  ------------- */}
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
