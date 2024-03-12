import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Sidebar from "./Sidebar";
import FileUpload from "./UploadPicture";
import { Link, useLocation } from "react-router-dom";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import log from "../logger";

// eslint-disable-next-line no-unused-vars
const AddProjectile = ({ setOpen }) => {
	const [siteID, setSiteID] = useState(0);
	const [description, setDescription] = useState("");
	const [name, setName] = useState("");
	const [dimension, setDimension] = useState("");
	const [location, setLocation] = useState("");
	const [selectedType, setSelectedType] = useState("");
	const [currentProjectiles, setCurrentProjectiles] = useState([]);

	const inComingSiteInfo = useLocation();

	// const PlaceholderText = "Add Information";
	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		console.log(dimension);
		console.log(name);
		console.log(location);
		console.log(selectedType);
		//setSiteID(some.id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dimension, name, location, selectedType]);

	const handleClicks = () => {
		fetch("http://localhost:3000/sites")
			.then((response) => response.json())
			.then((json) => setCurrentProjectiles(json))
			.catch((error) =>
				console.error("Error fetching Projectile data:", error),
			);
	};

	useEffect(() => {
		handleClicks();
	}, [handleClicks]);

	const handleLocationChange = (event) => {
		setLocation(event.target.value);
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};

	const handleDimensionChange = (event) => {
		setDimension(event.target.value);
		console.log(dimension);
	};

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handleSubmit = () => {
		log.info("Adding new projectile");
		const newArtifacts = {
			name,
			location,
			description,
			dimensions: dimension,
			photo: "photo1",
			siteId: siteID,
			artifactTypeId: selectedType,
		};

		axios
			.post("http://localhost:3000/artifacts", newArtifacts)
			.then((response) => {
				console.log("New artifacts added successfully:", response.data);
			})
			.catch((error) => {
				console.error("Error adding new site:", error);
			});
		handleClose();
	};

	return (
		<div>
			<Dialog
				open={true}
				onClose={handleClose}
				maxWidth="lg" //
				fullWidth
				PaperProps={{ style: { maxHeight: "80vh" } }}
			>
				<DialogTitle>
					Add Projectile to site {inComingSiteInfo.state.info.name}
				</DialogTitle>
				<Box container spacing={5} style={{ marginLeft: 100, marginTop: 2 }}>
					<Grid container spacing={5} marginTop={5}>
						<Grid>
							<Grid item marginBottom={3}>
								<FileUpload />
							</Grid>
							<Grid item marginBottom={5}>
								<TextField
									id="description"
									label="Description"
									variant="outlined"
									multiline
									rows={10}
									fullWidth
									value={description}
									onChange={handleDescriptionChange}
								/>
							</Grid>
						</Grid>

						<Grid item xs={12} sm={6}>
							<Box marginBottom={10} width={350}>
								<TextField
									margin="dense"
									id="name"
									label="Name"
									fullWidth
									value={name}
									onChange={handleNameChange}
								/>
							</Box>
							{/*This should removed, as the location is attached to the site*/}
							<Box marginBottom={10} width={350}>
								<TextField
									margin="dense"
									id="location"
									label="Location"
									fullWidth
									value={location}
									onChange={handleLocationChange}
								/>
							</Box>
							{/* The dimenisons should be three different fields(legnth, width, height and )
						if you are making this change, make sure the database was changed to hold a list of
						float/double and not a string*/}
							<Box marginBottom={10} width={350}>
								<TextField
									margin="dense"
									id="dimension"
									label="Dimension"
									fullWidth
									value={dimension}
									onChange={handleDimensionChange}
								/>
							</Box>
							{/*Should be renamed(maybe just drop the ID?)  also, Menu items will need to be dynamic at some point*/}
							<Box marginBottom={10} width={350}>
								<TextField
									id="artifactTypeID"
									label="ArtifactTypeID"
									variant="outlined"
									fullWidth
									select
									size="small"
									value={selectedType}
									onChange={(e) => setSelectedType(e.target.value)}
								>
									<MenuItem value="Lithic">Lithic</MenuItem>
									<MenuItem value="Ceramic">Ceramic</MenuItem>
									<MenuItem value="Faunal">Faunal</MenuItem>
								</TextField>
							</Box>
						</Grid>
					</Grid>

					<Grid item xs={12}>
						<Button
							variant="contained"
							color="primary"
							sx={{ marginRight: 2 }}
							onClick={handleSubmit}
						>
							Submit
						</Button>
						<Button variant="contained" color="secondary" onClick={handleClose}>
							Close
						</Button>
					</Grid>
				</Box>
			</Dialog>
		</div>
	);
};

export default AddProjectile;
