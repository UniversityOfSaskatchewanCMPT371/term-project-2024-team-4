import { useEffect, useState } from "react";
import http from "../../http.js";
import ProjectileModal from "./ProjectileModal";
import log from "../logger.js";
import {
	Button,
	Dialog,
	DialogContent,
	DialogActions,
	Grid,
	Typography,
} from "@mui/material";

/**
 * Modal for viewing projectile point details
 * @param {function} setOpen toggle modal visibility
 * @param {integer} projectilePointId ID of projectile point to be viewed
 * @pre None
 * @post Renders modal with projectile point details
 * @returns {JSX.Element} ViewProjectile React component
 */
// eslint-disable-next-line no-unused-vars, react/prop-types
const ViewProjectile = ({ setOpen, projectilePointId, siteName }) => {
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

	const [openAdd, setOpenAdd] = useState(false);

	/**
	 * Set modal visibility to false
	 */
	const handleClose = () => {
		setOpen(false);
	};

	/**
	 *
	 */
	const handleEdit = () => {
		setOpenAdd(true);
	};

	/**
	 *
	 */
	const handleDelete = () => {
		setOpen(false);
	};

	/**
	 * Fetch projectile point using ID
	 */
	useEffect(() => {
		http
			.get(`/projectilePoints/${projectilePointId}`)
			.then((response) => {
				log.info("Projectile point: ", response.data);
				setName(siteName + "-" + projectilePointId);
				setDescription(response.data.description);
				setLocation(response.data.location);
				setDimensions(response.data.dimensions);
				setPhotoFilePath(response.data.photo);
				setArtifactTypeID(response.data.artifactType.id);

				if (response.data.culture !== null) {
					setCultureName(response.data.culture.name);
				}

				if (response.data.bladeShape !== null) {
					setBladeShapeName(response.data.bladeShape.name);
				}

				if (response.data.baseShape !== null) {
					setBaseShapeName(response.data.baseShape.name);
				}

				if (response.data.haftingShape !== null) {
					setHaftingShapeName(response.data.haftingShape.name);
				}

				if (response.data.crossSection !== null) {
					setCrossSectionName(response.data.crossSection.name);
				}
			})
			.catch((error) => {
				log.error("Error fetching projectile point: ", error);
			});
	}, [siteName, projectilePointId]);

	return (
		<>
			<Dialog
				open={true}
				onClose={handleClose}
				maxWidth="lg"
				fullWidth
				PaperProps={{ style: { maxHeight: "90vh" } }}
			>
				<DialogContent style={{ minHeight: "600px" }}>
					<Grid container spacing={6} sx={{ paddingTop: 0 }}>
						<Grid item xs={6}>
							<div>
								{photoFilePath && (
									<a
										href={`http://localhost:3000/${photoFilePath}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<img
											src={`http://localhost:3000/${photoFilePath}`}
											alt="Projectile Point"
											style={{
												width: "100%",
												minHeight: "450px",
												borderRadius: "20px",
												objectFit: "cover",
											}}
										/>
									</a>
								)}
								{!photoFilePath && (
									<Typography
										variant="body1"
										sx={{
											width: "100%",
											minHeight: "450px",
											borderRadius: "20px",
											textAlign: "center",
											alignContent: "center",
										}}
									>
										No Image
										{/* <IconButton size="small">
							<MoreHorizIcon />
						</IconButton> */}
									</Typography>
								)}
								{/* {photoFilePath && <img src={`http://localhost:3000/${photoFilePath}`} alt="Projectile Point" style={{ maxWidth: "40%", cursor: "pointer" }} />} */}
							</div>
							<Typography variant="h6">
								Description
								{/* <IconButton size="small">
								<MoreHorizIcon />
							</IconButton> */}
							</Typography>
							<Typography variant="body1">{description}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography sx={{ fontWeight: "bold" }} variant="h4">
								{name}
							</Typography>
							<Typography sx={{ mt: 2 }} variant="h6">
								Dimensions
							</Typography>
							<Typography variant="body1">{dimensions}</Typography>
							<Typography sx={{ mt: 2 }} variant="h6">
								Location
							</Typography>
							<Typography variant="body1">{location}</Typography>
							<Typography sx={{ mt: 2 }} variant="h6">
								Artifact Type
							</Typography>
							<Typography variant="body1">{artifactTypeID}</Typography>
							<Typography sx={{ mt: 2 }} variant="h6">
								Culture
							</Typography>
							<Typography variant="body1">{cultureName}</Typography>
							<Typography sx={{ mt: 2 }} variant="h6">
								Base Shape
							</Typography>
							<Typography variant="body1">{baseShapeName}</Typography>
							<Typography sx={{ mt: 2 }} variant="h6">
								Cross Section
							</Typography>
							<Typography variant="body1">{crossSectionName}</Typography>
							<Typography sx={{ mt: 2 }} variant="h6">
								Blade Shape
							</Typography>
							<Typography variant="body1">{bladeShapeName}</Typography>
							<Typography sx={{ mt: 2 }} variant="h6">
								Hafting Shape
							</Typography>
							<Typography variant="body1">{haftingShapeName}</Typography>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Close
					</Button>
					<Button onClick={handleDelete} color="primary">
						Delete
					</Button>
					<Button onClick={handleEdit} color="primary">
						Edit
					</Button>
				</DialogActions>
			</Dialog>
			<Typography>
				{openAdd && (
					<ProjectileModal
						setOpenAdd={setOpenAdd}
						projectilePointId={projectilePointId}
					/>
				)}
			</Typography>
		</>
	);
};

export default ViewProjectile;
