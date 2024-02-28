import { useState } from "react";
import axios from "axios";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
	Grid,
	FormControl,
	IconButton,
	Menu,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditRegion from "./EditRegion";

// eslint-disable-next-line react/prop-types
const CreateNewSite = ({ setOpen }) => {
	const [name, setSiteName] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [selectedRegion, setSelectedRegion] = useState(null);
	const [regions1, setRegions1] = useState([
		"region 1",
		"region 2",
		"region 3",
	]);
	const [editMenuAnchor, setEditMenuAnchor] = useState(null);
	const [editRegion, setEditRegion] = useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const handleAddmore = () => {
		console.log("Add more");
		setEditRegion(true);
	};

	const handleSiteNameChange = (e) => {
		setSiteName(e.target.value);
		console.log("Site name is: " + e.target.value);
	};

	const handleDescriptionChange = (e) => {
		setDescription(e.target.value);
		console.log("Description is: " + e.target.value);
	};

	const handleLocationChange = (e) => {
		setLocation(e.target.value);
		console.log("Location is: " + e.target.value);
	};

	const handleRegionChange = (e) => {
		const regionValue = e.target.value;

		fetch("http://localhost:8000/regions")
			.then((response) => response.json())
			.then((json) => setRegions1(json))
			.then(console.log(regions1))
			.catch((error) => console.error("Error fetching data:", error));

		setSelectedRegion(regionValue);
		axios
			.get(`http://localhost:8000/sites/${regionValue}`)
			.then((response) => {
				// Assuming response.data contains the description of the selected region
				setDescription(response.data.description);
				console.log(response.data);
			})
			.catch((error) => {
				console.error("Error fetching region description:", error);
			});

		console.log("Region is: " + regionValue);
	};

	const handleEditMenuOpen = (event) => {
		setEditMenuAnchor(event.currentTarget);
	};

	const handleEditMenuClose = () => {
		setEditMenuAnchor(null);
	};

	const handleEditRegion = () => {
		// Implement edit region functionality here
		setEditRegion(true);
		handleEditMenuClose();
	};

	const handleDeleteRegion = () => {
		// Implement delete region functionality here
		handleEditMenuClose();
	};

	const handleSubmit = () => {
		const newSite = {
			name,
			description,
			location,
			region: selectedRegion,
		};

		axios
			.post("http://localhost:8000/sites", newSite)
			.then((response) => {
				console.log("New site added successfully:", response.data);
				handleClose();
			})
			.catch((error) => {
				console.error("Error adding new site:", error);
			});

		console.log("Submitted:", newSite);
		handleClose();
	};

	const handleClick = () => {
		fetch("http://localhost:8000/regions")
			.then((response) => response.json())
			.then((json) => setRegions1(json))
			.then(console.log(regions1))
			.catch((error) => console.error("Error fetching data:", error));
	};

	return (
		<div>
			<Dialog
				open={true}
				onClose={handleClose}
				maxWidth="md"
				fullWidth
				PaperProps={{ style: { maxHeight: "80vh" } }}
			>
				<DialogTitle>Create a site</DialogTitle>
				<DialogContent style={{ minHeight: "300px" }}>
					<TextField
						autoFocus
						margin="dense"
						id="siteName"
						label="Site Name"
						fullWidth
						value={name}
						onChange={handleSiteNameChange}
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

					<Grid
						container
						spacing={2}
						style={{ marginTop: 10, height: "100pt" }}
					>
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

						<Grid
							item
							xs={6}
							style={{ maxHeight: "100pt" }}
							onClick={handleClick}
						>
							<FormControl fullWidth onClick={handleClick}>
								<TextField
									onClick={handleClick}
									margin="dense"
									label="Region"
									id="region"
									fullWidth
									select
									value={selectedRegion}
									onChange={handleRegionChange}
									sx={{
										display: "flex",
										alignItems: "center",
									}}
								>
									{regions1.map((region) => (
										<MenuItem key={region.name} value={region.name}>
											{region.name}
											<IconButton
												aria-label="more"
												aria-controls="edit-menu"
												aria-haspopup="true"
												onClick={handleEditMenuOpen}
												style={{ marginLeft: "auto" }}
											>
												<MoreHorizIcon />
											</IconButton>
										</MenuItem>
									))}
									<MenuItem onClick={handleAddmore}>+ Add More</MenuItem>
								</TextField>
							</FormControl>
						</Grid>
					</Grid>

					<Menu
						id="edit-menu"
						anchorEl={editMenuAnchor}
						open={Boolean(editMenuAnchor)}
						onClose={handleEditMenuClose}
					>
						<MenuItem onClick={handleEditRegion}>
							<ListItemIcon>
								<EditIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText>Edit</ListItemText>
						</MenuItem>
						<MenuItem onClick={handleDeleteRegion}>
							<ListItemIcon>
								<DeleteIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText>Delete</ListItemText>
						</MenuItem>
					</Menu>
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
				<EditRegion
					setEditRegion={setEditRegion}
					selectedRegion={selectedRegion}
				/>
			)}
		</div>
	);
};

export default CreateNewSite;
