import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Sidebar from "./Sidebar";
import FileUpload from "./UploadPicture";
import { Link, useLocation } from "react-router-dom";
import Site from "./Site";
import logger from "../logger.js";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import log from "../logger";
import { getLogger } from "loglevel";

// eslint-disable-next-line no-unused-vars
const AddProjectile = ({ setOpen }) => {
	const inComingSiteInfo = useLocation();

	const [siteID, setSiteID] = useState(inComingSiteInfo.state.info.id);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [dimensions, setDimensions] = useState("");
	const [photoFilePath, setPhotoFilePath] = useState("");
	const [subtype, setSubtype] = useState("");
	const [artifactType, setArtifactType] = useState(1);
	// const [cultureID, setCultureID] = useState(1);
	// const [bladeShapeID, setBladeShapeID] = useState(1);
	// const [baseShapeID, setBaseShapeID] = useState(1);
	// const [haftingShapeID, setHaftingShapeID] = useState(1);
	// const [crossSectionID, setCrossSectionID] = useState(1);

	const [currentProjectiles, setCurrentProjectiles] = useState([]);

	// const PlaceholderText = "Add Information";
	const handleClose = () => {
		setOpen(false);
		// window.location.reload();
	};

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handleLocationChange = (event) => {
		setLocation(event.target.value);
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};

	const handleDimensionsChange = (event) => {
		setDimensions(event.target.value);
	};

	const handlePhotoFilePathChange = (event) => {
		setPhotoFilePath(event.target.value);
	};

	const handleSubtypeChange = (event) => {
		setSubtype(event.target.value);
	};

	const handleSubmit = () => {
		logger.info("Adding new projectile");

		const newArtifact = {
			name,
			location,
			description,
			dimensions,
			photo: photoFilePath,
			siteId: siteID,
			artifactTypeId: artifactType,
			subtype,
			// cultureId,
			// bladeShapdeId,
			// baseShapeId,
			// haftingShapeId,
			// crossSectionId,
		};

		logger.debug(newArtifact);

		axios
			.post("http://localhost:3000/artifacts", newArtifact)
			.then((response) => {
				console.log("New artifact added successfully:", response.data);
			})
			.catch((error) => {
				console.error("Error adding new artifact:", error);
			});
		setOpen(true);
		console.log("Submitted:", newArtifact);
		handleClose();
	};

	// const handleClick = () => {
	// 	fetch("http://localhost:3000/sites")
	// 		.then((response) => response.json())
	// 		.then((json) => setCurrentProjectiles(json))
	// 		.catch((error) => console.error("Error fetching data:", error));
	// };

	// useEffect(() => {
	// 	handleClick();
	// }, [handleClick]);

	// useEffect(() => {
	// 	console.log(name);
	// 	console.log(location);
	// 	console.log(dimensions);
	// 	console.log(artifactType);
	// 	//setSiteID(some.id);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [dimensions, name, location, artifactType]);

	return (
		<div>
			<Dialog
				open={true}
				onClose={handleClose}
				maxWidth="md" //
				fullWidth
				PaperProps={{ style: { maxHeight: "80vh" } }}
			>
				<DialogTitle>
					Add Projectile to site {inComingSiteInfo.state.info.name}
				</DialogTitle>
				<DialogContent style={{ minHeight: "300px" }}>
					<Grid container spacing={2} sx={{ paddingTop: 0 }}>
						<Grid item xs={6}>
							<TextField
								margin="dense"
								id="name"
								label="Name"
								fullWidth
								value={name}
								onChange={handleNameChange}
							/>
							<TextField
								margin="dense"
								id="description"
								label="Description"
								multiline
								rows={10}
								fullWidth
								value={description}
								onChange={handleDescriptionChange}
							/>
						</Grid>
						<Grid item xs={6}>
							{/*This should removed, as the location is attached to the site*/}
							<TextField
								margin="dense"
								id="location"
								label="Location"
								fullWidth
								value={location}
								onChange={handleLocationChange}
							/>
							{/* The dimensions should be three different fields(length, width, height and )
						if you are making this change, make sure the database was changed to hold a list of
						float/double and not a string*/}
							<TextField
								margin="dense"
								id="dimensions"
								label="Dimensions"
								fullWidth
								value={dimensions}
								onChange={handleDimensionsChange}
							/>
							{/* <FileUpload margin="dense" /> */}
							<TextField
								margin="dense"
								id="photoFilePath"
								label="Photo File Path"
								fullWidth
								value={photoFilePath}
								onChange={handlePhotoFilePathChange}
							/>
							<TextField
								margin="dense"
								id="subtype"
								label="Subtype"
								fullWidth
								value={subtype}
								onChange={handleSubtypeChange}
							/>
							{/*Should be renamed(maybe just drop the ID?)  also, Menu items will need to be dynamic at some point*/}
							<TextField
								margin="dense"
								id="artifactTypeID"
								label="ArtifactTypeID"
								variant="outlined"
								fullWidth
								select
								value={artifactType}
								onChange={(e) => setArtifactType(e.target.value)}
							>
								<MenuItem value="1">Lithic</MenuItem>
								<MenuItem value="2">Ceramic</MenuItem>
								<MenuItem value="3">Faunal</MenuItem>
								<MenuItem value="4">Hello</MenuItem>
								<MenuItem value="5">Hi</MenuItem>
							</TextField>
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
		</div>
	);
};

export default AddProjectile;
