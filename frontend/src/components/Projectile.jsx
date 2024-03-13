import { useEffect, useState } from "react";
import axios from "axios";
import log from "../logger.js";
import {
	Button,
	Dialog,
	DialogContent,
	DialogActions,
	Grid,
	Typography,
} from "@mui/material";

// eslint-disable-next-line no-unused-vars
const AddProjectile = ({ setOpen, projectilePointId }) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [dimensions, setDimensions] = useState("");
	const [photoFilePath, setPhotoFilePath] = useState("");
	const [artifactTypeID, setArtifactTypeID] = useState(0);
	const [cultureName, setCultureName] = useState("");
	const [bladeShapeName, setBladeShapeName] = useState("");
	const [baseShapeName, setBaseShapeName] = useState("");
	const [haftingShapeName, setHaftingShapeName] = useState("");
	const [crossSectionName, setCrossSectionName] = useState("");

	const handleClose = () => {
		setOpen(false);
		// window.location.reload();
	};

	useEffect(() => {
		axios
			.get(`http://localhost:3000/projectilePoints/${projectilePointId}`)
			.then((response) => {
				setName(response.data.name);
				setDescription(response.data.description);
				setLocation(response.data.location);
				setDimensions(response.data.dimensions);
				setPhotoFilePath(response.data.photo);
				setArtifactTypeID(response.data.artifactType.id);
				setCultureName(response.data.culture.name);
				setBladeShapeName(response.data.bladeShape.name);
				setBaseShapeName(response.data.baseShape.name);
				setHaftingShapeName(response.data.haftingShape.name);
				setCrossSectionName(response.data.crossSection.name);
			})
			.catch((error) => {
				console.error("Error fetching projectile point:", error);
			});
	}, []);

	return (
		<Dialog
			open={true}
			onClose={handleClose}
			maxWidth="md"
			fullWidth
			PaperProps={{ style: { maxHeight: "80vh" } }}
		>
			<DialogContent style={{ minHeight: "300px" }}>
				<Grid container spacing={2} sx={{ paddingTop: 0 }}>
					<Grid item xs={6}>
						<Typography variant="h4" component="h2">
							{name}
						</Typography>
						<Typography variant="h4" component="h2">
							{description}
						</Typography>
						<Typography variant="h4" component="h2">
							{location}
						</Typography>
						<Typography variant="h4" component="h2">
							{dimensions}
						</Typography>
						<Typography variant="h4" component="h2">
							{photoFilePath}
						</Typography>
						<Typography variant="h4" component="h2">
							{artifactTypeID}
						</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h4" component="h2">
							{cultureName}
						</Typography>
						<Typography variant="h4" component="h2">
							{bladeShapeName}
						</Typography>
						<Typography variant="h4" component="h2">
							{baseShapeName}
						</Typography>
						<Typography variant="h4" component="h2">
							{haftingShapeName}
						</Typography>
						<Typography variant="h4" component="h2">
							{crossSectionName}
						</Typography>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Close
				</Button>
				{/* <Button onClick={handleSubmit} color="primary">
						Add
					</Button> */}
			</DialogActions>
		</Dialog>
	);
};

export default AddProjectile;
