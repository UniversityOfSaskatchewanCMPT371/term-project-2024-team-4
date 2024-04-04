/* eslint-disable quotes */
/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import http from "../../http.js";
import log from "../logger.js";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Grid,
	Typography,
} from "@mui/material";
import { UserContext } from "../context/userContext.jsx";
/**
 * Modal for viewing projectile point details
 * @param {function} setOpenView function to toggle view projectile point modal visibility
 * @param {function} setOpenEdit function to toggle edit projectile point modal visibility
 * @param {integer} projectilePointId current selected projectile point ID
 * @param {string} siteName site name of current selected projectile point
 * @pre None
 * @post Renders modal with projectile point details
 * @returns {JSX.Element} ViewProjectile React component
 */
// eslint-disable-next-line no-unused-vars, react/prop-types
const ViewProjectile = ({
	setOpenView,
	setOpenEdit,
	projectilePointId,
	siteName,
}) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [height, setHeight] = useState("");
	const [width, setWidth] = useState("");
	const [length, setLength] = useState("");
	const [photoFilePath, setPhotoFilePath] = useState("");
	const [artifactTypeID, setArtifactTypeID] = useState(0);
	const [periodName, setPeriodName] = useState("");
	const [cultureName, setCultureName] = useState("");
	const [bladeShapeName, setBladeShapeName] = useState("");
	const [baseShapeName, setBaseShapeName] = useState("");
	const [haftingShapeName, setHaftingShapeName] = useState("");
	const [crossSectionName, setCrossSectionName] = useState("");
	const [materialName, setMaterialName] = useState("");
	const [openAlertDelete, setOpenAlertDelete] = useState(false);
	const { user } = useContext(UserContext);
	/**
	 * Set current modal visibility to false
	 */
	const handleClose = () => {
		setOpenView(false);
	};

	/**
	 * Set edit projectile point modal visibility to true
	 */
	const handleEdit = () => {
		setOpenEdit(true);
	};

	/**
	 * Set delete projectile point alert modal visibility to true
	 * for confirming deletion of projectile points
	 */
	const handleOpenAlertDelete = () => {
		setOpenAlertDelete(true);
	};

	/**
	 * Set delete projectile point alert modal visibility to false
	 */
	const handleCloseAlertDelete = () => {
		setOpenAlertDelete(false);
	};

	/**
	 * Handles deletion of projectile point on click event
	 */
	const handleDelete = () => {
		http
			.delete(`projectilePoints/${projectilePointId}`)
			.then(() => {
				log.info("Successfully deleted projectile point");
				handleCloseAlertDelete();
				handleClose();
			})
			.catch((error) => {
				log.error("Error deleting projectile point:", error);
				handleCloseAlertDelete();
				handleClose();
			});
	};
	/**
	 * Fetch projectile point using ID and set state values for viewing projectile point details
	 */
	useEffect(() => {
		http
			.get(`/projectilePoints/${projectilePointId}`)
			.then((response) => {
				log.info("Projectile point: ", response.data);
				setName(siteName + "-" + projectilePointId);
				setDescription(response.data.description);
				setLocation(response.data.location);

				const dimensions = response.data.dimensions.split(",");
				var lengthDimension = dimensions[0].replace("{", "");
				lengthDimension = lengthDimension.replace('"', "");
				var widthDimension = dimensions[1].replace('"', "");
				var heightDimension = dimensions[2].replace("}", "");
				heightDimension = heightDimension.replace('"', "");

				setLength(lengthDimension.trim() ? parseFloat(lengthDimension) : "");
				setWidth(widthDimension.trim() ? parseFloat(widthDimension) : "");
				setHeight(heightDimension.trim() ? parseFloat(heightDimension) : "");

				setPhotoFilePath(response.data.photo);
				setArtifactTypeID(response.data.artifactType.id);

				if (response.data.culture !== null) {
					setCultureName(response.data.culture.name);
					setPeriodName(response.data.culture.period.name);
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
				if (response.data.material !== null) {
					setMaterialName(response.data.material.name);
				}
			})
			.catch((error) => {
				log.error("Error fetching projectile point: ", error);
			});
	}, [siteName, projectilePointId, height, width, length]);

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
							{/* ------------ Photo ------------- */}
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
												maxHeight: "450px",
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
											maxHeight: "450px",
											borderRadius: "20px",
											textAlign: "center",
											alignContent: "center",
										}}
									>
										No Image
									</Typography>
								)}
							</div>
							{/* ------------ Description ------------- */}
							<Typography variant="h6">Description</Typography>
							<Typography variant="body1">
								{description || "No description"}
							</Typography>
						</Grid>
						<Grid item xs={6}>
							{/* ------------ Name ------------- */}
							<Typography sx={{ fontWeight: "bold" }} variant="h4">
								{name}
							</Typography>
							{/* ------------ Dimensions ------------- */}
							<div>
								<Typography sx={{ mt: 2 }} variant="h6">
									Dimensions
								</Typography>
								<Typography variant="body1">
									{"L: " + (length || 0) + "mm"}
								</Typography>
								<Typography variant="body1">
									{"W: " + (width || 0) + "mm"}
								</Typography>
								<Typography variant="body1">
									{"H: " + (height || 0) + "mm"}
								</Typography>
							</div>
							{/* ------------ Location ------------- */}
							<Typography sx={{ mt: 2 }} variant="h6">
								Location
							</Typography>
							<Typography variant="body1">
								{location || "Indeterminate"}
							</Typography>
							{/* ------------ Artifact Type ------------- */}
							<Typography sx={{ mt: 2 }} variant="h6">
								Artifact Type
							</Typography>
							<Typography variant="body1">{artifactTypeID}</Typography>
							{/* ------------ Period ------------- */}
							<Typography sx={{ mt: 2 }} variant="h6">
								Period
							</Typography>
							<Typography variant="body1">
								{periodName || "Indeterminate"}
							</Typography>
							{/* ------------ Culture ------------- */}
							<Typography sx={{ mt: 2 }} variant="h6">
								Culture
							</Typography>
							<Typography variant="body1">
								{cultureName || "Indeterminate"}
							</Typography>
							{/* ------------  Material ------------- */}
							<Typography sx={{ mt: 2 }} variant="h6">
								Material
							</Typography>
							<Typography variant="body1">
								{materialName || "Indeterminate"}
							</Typography>
							{/* ------------ Base Shape ------------- */}
							{baseShapeName && (
								<div>
									<Typography sx={{ mt: 2 }} variant="h6">
										Base Shape
									</Typography>
									<Typography variant="body1">{baseShapeName}</Typography>
								</div>
							)}
							{/* ------------ Cross Section ------------- */}
							{crossSectionName && (
								<div>
									<Typography sx={{ mt: 2 }} variant="h6">
										Cross Section
									</Typography>
									<Typography variant="body1">{crossSectionName}</Typography>
								</div>
							)}
							{/* ------------ Blade Shape ------------- */}
							{bladeShapeName && (
								<div>
									<Typography sx={{ mt: 2 }} variant="h6">
										Blade Shape
									</Typography>
									<Typography variant="body1">{bladeShapeName}</Typography>
								</div>
							)}
							{/* ------------ Hafting Shape ------------- */}
							{haftingShapeName && (
								<div>
									<Typography sx={{ mt: 2 }} variant="h6">
										Hafting Shape
									</Typography>
									<Typography variant="body1">{haftingShapeName}</Typography>
								</div>
							)}
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Close
					</Button>
					{user && (
						<Button onClick={handleOpenAlertDelete} color="primary">
							Delete
						</Button>
					)}
					{user && (
						<Button
							onClick={() => {
								handleEdit();
								handleClose();
							}}
							color="primary"
						>
							Edit
						</Button>
					)}
				</DialogActions>
			</Dialog>
			<div>
				<Dialog open={openAlertDelete}>
					<DialogTitle id="alert-dialog-title">
						{"Delete Projectile Point " + name}
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Are you sure you want to delete projectile point?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseAlertDelete}>No</Button>
						<Button onClick={handleDelete} autoFocus>
							Yes
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</>
	);
};

export default ViewProjectile;
