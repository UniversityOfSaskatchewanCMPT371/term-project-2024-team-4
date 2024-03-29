/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import http from "../../http.js";
// import FileUpload from "./UploadPicture"; // for future uploading photo files implementation
import { useLocation } from "react-router-dom";
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

// Dropdown menu modal components
import PeriodModal from "./PeriodModal.jsx";
import CultureModal from "./CultureModal.jsx";
import MaterialModal from "./MaterialModal.jsx";
import BaseShapeModal from "./BaseShapeModal.jsx";
import CrossSectionModal from "./CrossSectionModal.jsx";
import BladeShapeModal from "./BladeShapeModal.jsx";
import HaftingShapeModal from "./HaftingShapeModal.jsx";

/**
 * Modal for adding a new projectile point to a site
 * @param {boolean} setOpenAdd
 * @pre A site should exist in database
 * @post Renders add projectile modal and saves submitted projectile point in database
 * @returns {JSX.Element} AddProjectile React component
 */
// eslint-disable-next-line no-unused-vars, react/prop-types
const AddProjectile = ({ setOpenAdd }) => {
	const inComingSiteInfo = useLocation();

	const siteID = inComingSiteInfo.state.info.id;
	const siteName = inComingSiteInfo.state.info.name;

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [dimensions, setDimensions] = useState("");
	const [photoFilePath, setPhotoFilePath] = useState("");
	const [artifactTypeID, setArtifactTypeID] = useState("");
	const [cultureID, setCultureID] = useState(0);
	const [bladeShapeID, setBladeShapeID] = useState(0);
	const [baseShapeID, setBaseShapeID] = useState(0);
	const [haftingShapeID, setHaftingShapeID] = useState(0);
	const [crossSectionID, setCrossSectionID] = useState(0);
	const [materialID, setMaterialID] = useState(0); // for future implementation of adding materials
	const [periodID, setPeriodID] = useState(0); // not needed for adding projectile point, for testing only

	// ------- For state variables for managing period dropdown and edit/delete functionalities -------
	const [anchorEl, setAnchorEl] = useState(null); // For the dropdown menu anchor
	const [currentPeriod, setCurrentPeriod] = useState(null); // The period currently selected in the dropdown

	// Function to open the dropdown menu (Edit/Delete options for periods)
	const handleOpenMenu = (event, period) => {
		setAnchorEl(event.currentTarget);
		setCurrentPeriod(period);
	};

	// Function to close the dropdown menu
	const handleCloseMenu = () => {
		setAnchorEl(null);
		setCurrentPeriod(null);
	};

	// ----------------------------------------------------------------------------------------

	// ------------ For state variables for editing periods through the PeriodModal ------------
	const [periods, setPeriods] = useState([]);
	const [selectedPeriod, setSelectedPeriod] = useState("");
	const [editPeriod, setEditPeriod] = useState(false);
	const [periodModalOpen, setPeriodModalOpen] = useState(false);
	const [selectedPeriodID, setSelectedPeriodID] = useState(null);
	// -----------------------------------------------------------------------------------------

	// ------------ For state variables for editing cultures through the CultureModal ----------
	const [cultures, setCultures] = useState([]);
	const [selectedCulture, setSelectedCulture] = useState("");
	const [cultureModalOpen, setCultureModalOpen] = useState(false);
	const [editCulture, setEditCulture] = useState(false);
	const [selectedCultureID, setSelectedCultureID] = useState(null);
	// -----------------------------------------------------------------------------------------

	// ---------- For state variables for editing BaseShapes through the BaseShapeModal --------
	const [baseShapes, setBaseShapes] = useState([]);
	const [selectedBaseShape, setSelectedBaseShape] = useState("");
	const [baseShapeModalOpen, setBaseShapeModalOpen] = useState(false);
	const [editBaseShape, setEditBaseShape] = useState(false);
	const [selectedBaseShapeID, setSelectedBaseShapeID] = useState(null);
	// -----------------------------------------------------------------------------------------

	// ---------- For state variables for editing CrossSections through the CrossSectionModal --------
	const [crossSections, setCrossSections] = useState([]);
	const [selectedCrossSection, setSelectedCrossSection] = useState("");
	const [crossSectionModalOpen, setCrossSectionModalOpen] = useState(false);
	const [editCrossSection, setEditCrossSection] = useState(false);
	const [selectedCrossSectionID, setSelectedCrossSectionID] = useState(null);
	// -----------------------------------------------------------------------------------------

	// ---------- For state variables for editing BladeShapes through the BladeShapeModal --------
	const [bladeShapes, setBladeShapes] = useState([]);
	const [selectedBladeShape, setSelectedBladeShape] = useState("");
	const [bladeShapeModalOpen, setBladeShapeModalOpen] = useState(false);
	const [editBladeShape, setEditBladeShape] = useState(false);
	const [selectedBladeShapeID, setSelectedBladeShapeID] = useState(null);
	// -----------------------------------------------------------------------------------------

	// ---------- For state variables for editing HaftingShapes through the HaftinfShapeModal --------
	const [haftingShapes, setHaftingShapes] = useState([]);
	const [selectedHaftingShape, setSelectedHaftingShape] = useState("");
	const [haftingShapeModalOpen, setHaftingShapeModalOpen] = useState(false);
	const [editHaftingShape, setEditHaftingShape] = useState(false);
	const [selectedHaftingShapeID, setSelectedHaftingShapeID] = useState(null);
	// -----------------------------------------------------------------------------------------

	// ---------- For state variables for editing Material through the MaterialModal --------
	const [materials, setMaterials] = useState([]);
	const [selectedMaterial, setSelectedMaterial] = useState("");
	const [materialModalOpen, setMaterialModalOpen] = useState(false);
	const [editMaterial, setEditMaterial] = useState(false);
	const [selectedMaterialID, setSelectedMaterialID] = useState(null);

	const [artifactTypes, setArtifactTypes] = useState([]);
	// -----------------------------------------------------------------------------------------

	const handleClose = () => {
		setOpenAdd(false);
	};

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};

	const handleLocationChange = (event) => {
		setLocation(event.target.value);
	};

	const handleDimensionsChange = (event) => {
		setDimensions(event.target.value);
	};

	const handlePhotoFilePathChange = (event) => {
		setPhotoFilePath(event.target.value);
	};

	const handleSubmit = () => {
		log.info("Adding new projectile");

		const newProjectilePoint = {
			name: siteID + "-" + name,
			location,
			description,
			dimensions,
			photo: photoFilePath,
			siteId: siteID,
			artifactTypeId: artifactTypeID,
			cultureId: cultureID,
			bladeShapeId: bladeShapeID,
			baseShapeId: baseShapeID,
			haftingShapeId: haftingShapeID,
			crossSectionId: crossSectionID,
		};

		http
			.post("/projectilePoints", newProjectilePoint)
			.then((response) => {
				console.log("New projectile point added successfully:", response.data);
				handleClose();
			})
			.catch((error) => {
				console.error("Error adding new  projectile point:", error);
			});
		//setOpen(true);
		console.log("Submitted:", newProjectilePoint);
	};

	// ------------ For EDIT Period Modal ------------
	// Load periods from the database on component mount
	useEffect(() => {
		http
			.get("/periods")
			.then((response) => {
				setPeriods(response.data);
				const filteredPeriod = response.data.find(
					(period) => period.name === selectedPeriod,
				);

				// Check if period with the provided name was found
				if (filteredPeriod) {
					log.info(filteredPeriod);
					setPeriodID(filteredPeriod.id);
				}
			})
			.catch((error) => {
				console.error("Error fetching periods:", error);
			});
	}, [selectedPeriod]);

	// Function to update the list of periods after an edit or addition
	const updatePeriodsList = (newPeriod) => {
		setPeriods((prevPeriods) => {
			// Check if the period already exists and update it
			const index = prevPeriods.findIndex(
				(period) => period.id === newPeriod.id,
			);
			if (index > -1) {
				// Update existing period
				const updatedPeriods = [...prevPeriods];
				updatedPeriods[index] = newPeriod;
				return updatedPeriods;
			} else {
				// Else, add the new period to the list
				return [...prevPeriods, newPeriod];
			}
		});
	};

	// Function to delete a period
	const handleDeletePeriod = () => {
		if (currentPeriod && currentPeriod.id) {
			http
				.delete(`/periods/${currentPeriod.id}`)
				.then(() => {
					setPeriods(periods.filter((p) => p.id !== currentPeriod.id));
					handleCloseMenu();
				})
				.catch((error) => {
					console.error("Error deleting period:", error);
				});
		}
	};

	const handlePeriodChange = (event) => {
		setSelectedPeriod(event.target.value);
	};

	const handleOpenPeriodModal = (periodId = null) => {
		setSelectedPeriodID(periodId);
		setEditPeriod(true);
		setPeriodModalOpen(true);
	};
	// ---------------- End of PeriodModal functions --------------------

	// ---------------- Start of CultureModal functions --------------------

	// This function fetches cultures when the component mounts. This ensures the dropdown for cultures is always up-to-date.
	useEffect(() => {
		http
			.get("/cultures")
			.then((response) => {
				setCultures(response.data);
				const filteredCulture = response.data.find(
					(culture) => culture.name === selectedCulture,
				);

				// Check if period with the provided name was found
				if (filteredCulture) {
					log.info(filteredCulture);
					setCultureID(filteredCulture.id);
				}
			})
			.catch((error) => {
				console.error("Error fetching cultures:", error);
			});
	}, [selectedCulture]);

	// This function opens the CultureModal for editing an existing culture or adding a new one.
	// If a cultureId is provided, the modal is configured for editing that culture.
	// If no cultureId is provided, the modal is configured for adding a new culture.
	const handleOpenCultureModal = (cultureId = null) => {
		setSelectedCultureID(cultureId);
		setEditCulture(true);
		setCultureModalOpen(true);
	};

	// This function handles the selection of a culture from the dropdown menu.
	// Also prepares to show options for editing or deleting the selected culture.
	const handleOpenEditCultureMenu = (event, culture) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setAnchorEl(event.currentTarget);
		setSelectedCultureID(culture.id);
	};

	// This function the selectedCulture state when a user selects a different culture from the dropdown
	const handleCultureChange = (event) => {
		setCultureID(event.target.id);
		setSelectedCulture(event.target.value);
	};

	// This function ensures the dropdown list reflects the most current data without needing to refetch from the server.
	const updateCulturesList = (newCulture) => {
		setCultures((prev) => {
			const index = prev.findIndex((c) => c.id === newCulture.id);
			if (index > -1) {
				return prev.map((c) => (c.id === newCulture.id ? newCulture : c));
			} else {
				return [...prev, newCulture];
			}
		});
	};
	// This function handles delete a culture from the server and updates the local list.
	const handleDeleteCulture = () => {
		http
			.delete(`/cultures/${selectedCultureID}`)
			.then(() => {
				setCultures(
					cultures.filter((culture) => culture.id !== selectedCultureID),
				);
				handleCloseMenu();
			})
			.catch((error) => {
				console.error("Error deleting culture:", error);
				handleCloseMenu();
			});
	};
	// ---------------- End of CultureModal functions --------------------

	// ---------------- Start of BaseShapeModal functions --------------------
	// This function fetches all base shapes from the server and updates the local state on mount.
	useEffect(() => {
		http
			.get("/baseShapes")
			.then((response) => {
				setBaseShapes(response.data);
				const filteredBaseShape = response.data.find(
					(baseShape) => baseShape.name === selectedBaseShape,
				);

				// Check if period with the provided name was found
				if (filteredBaseShape) {
					log.info(filteredBaseShape);
					setBaseShapeID(filteredBaseShape.id);
				}
			})
			.catch((error) => {
				console.error("Error fetching base shapes:", error);
			});
	}, [selectedBaseShape]);

	// This function opens the BaseShapeModal for editing an existing base shape or adding a new one.
	const handleOpenBaseShapeModal = (baseShapeId = null) => {
		setSelectedBaseShapeID(baseShapeId);
		setEditBaseShape(true);
		setBaseShapeModalOpen(true);
	};

	// This function handles the selection of a base shape for editing.
	const handleEditBaseShape = (event, baseShape) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setAnchorEl(event.currentTarget);
		setSelectedBaseShapeID(baseShape.id);
	};

	// This function updates the local list of base shapes after adding or editing a base shape.
	// If the base shape already exists in the list, it's updated.
	// Otherwise, the new base shape is added to the list.
	const updateBaseShapesList = (newBaseShape) => {
		setBaseShapes((prevBaseShapes) => {
			const index = prevBaseShapes.findIndex(
				(shape) => shape.id === newBaseShape.id,
			);
			if (index > -1) {
				const updatedBaseShapes = [...prevBaseShapes];
				updatedBaseShapes[index] = newBaseShape;
				return updatedBaseShapes;
			} else {
				return [...prevBaseShapes, newBaseShape];
			}
		});
	};

	// This function handles delete a base shape from the server and updates the local list.
	const handleDeleteBaseShape = () => {
		http
			.delete(`/baseShapes/${selectedBaseShapeID}`)
			.then(() => {
				setBaseShapes(
					baseShapes.filter((shape) => shape.id !== selectedBaseShapeID),
				);
				setBaseShapeModalOpen(false);
			})
			.catch((error) => {
				console.error("Error deleting base shape:", error);
			});
	};

	const handleBaseShapeChange = (event) => {
		setSelectedBaseShape(event.target.value);
	};

	// ----------------- End of BaseShapeModal functions ---------------------

	// ---------------- Start of CrossSectionModal functions --------------------
	// This function fetches all cross sections from the server and updates the local state on mount.
	useEffect(() => {
		http
			.get("/crossSections")
			.then((response) => {
				setCrossSections(response.data);
				const filteredCrossSection = response.data.find(
					(crossSection) => crossSection.name === selectedCrossSection,
				);

				// Check if period with the provided name was found
				if (filteredCrossSection) {
					log.info(filteredCrossSection);
					setCrossSectionID(filteredCrossSection.id);
				}
			})
			.catch((error) => {
				console.error("Error fetching cross sections:", error);
			});
	}, [selectedCrossSection]);

	// This function opens the CrossSectionModal for editing an existing cross sections or adding a new one.
	const handleOpenCrossSectionModal = (crossSectionId = null) => {
		setSelectedCrossSectionID(crossSectionId);
		setEditCrossSection(true);
		setCrossSectionModalOpen(true);
	};

	// This function handles the selection of a cross sections for editing.
	const handleEditCrossSection = (event, crossSection) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setAnchorEl(event.currentTarget);
		setSelectedCrossSectionID(crossSection.id);
	};

	// This function updates the local list of cross sections after adding or editing a cross sections.
	// If the cross sections already exists in the list, it's updated.
	// Otherwise, the new cross sections is added to the list.
	const updateCrossSectionList = (newCrossSection) => {
		setCrossSections((prevCrossSection) => {
			const index = prevCrossSection.findIndex(
				(shape) => shape.id === newCrossSection.id,
			);
			if (index > -1) {
				const updatedCrossSection = [...prevCrossSection];
				updatedCrossSection[index] = newCrossSection;
				return updatedCrossSection;
			} else {
				return [...prevCrossSection, newCrossSection];
			}
		});
	};

	// This function handles delete a cross section from the server and updates the local list.
	const handleDeleteCrossSection = () => {
		http
			.delete(`/crossSections/${selectedCrossSectionID}`)
			.then(() => {
				setCrossSections(
					crossSections.filter(
						(crossSect) => crossSect.id !== selectedCrossSectionID,
					),
				);
				setCrossSectionModalOpen(false);
			})
			.catch((error) => {
				console.error("Error deleting cross shape:", error);
			});
	};

	const handleCrossSectionChange = (event) => {
		setSelectedCrossSection(event.target.value);
	};
	// ---------------- End of CrossSectionModal functions ----------------------

	// ---------------- Start of BladeShapeModal functions --------------------
	// This function fetches all blade shapes from the server and updates the local state on mount.
	useEffect(() => {
		http
			.get("/bladeShapes")
			.then((response) => {
				setBladeShapes(response.data);
				const filteredBladeShape = response.data.find(
					(bladeShape) => bladeShape.name === selectedBladeShape,
				);

				// Check if period with the provided name was found
				if (filteredBladeShape) {
					log.info(filteredBladeShape);
					setBladeShapeID(filteredBladeShape.id);
				}
			})
			.catch((error) => {
				console.error("Error fetching blade shapes:", error);
			});
	}, [selectedBladeShape]);

	// This function opens the BladeShapeModal for editing an existing blade shape or adding a new one.
	const handleOpenBladeShapeModal = (bladeShapeId = null) => {
		setSelectedBladeShapeID(bladeShapeId);
		setEditBladeShape(true);
		setBladeShapeModalOpen(true);
	};

	// This function handles the selection of a blade shape for editing.
	const handleEditBladeShape = (event, bladeShape) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setAnchorEl(event.currentTarget);
		setSelectedBladeShapeID(bladeShape.id);
	};

	// This function updates the local list of blade shapes after adding or editing a blade shape.
	// If the blade shape already exists in the list, it's updated.
	// Otherwise, the new blade shape is added to the list.
	const updateBladeShapesList = (newBladeShape) => {
		setBladeShapes((prevBladeShapes) => {
			const index = prevBladeShapes.findIndex(
				(shape) => shape.id === newBladeShape.id,
			);
			if (index > -1) {
				const updatedBladeShapes = [...prevBladeShapes];
				updatedBladeShapes[index] = newBladeShape;
				return updatedBladeShapes;
			} else {
				return [...prevBladeShapes, newBladeShape];
			}
		});
	};

	// This function handles delete a blade shape from the server and updates the local list.
	const handleDeleteBladeShape = () => {
		http
			.delete(`/bladeShapes/${selectedBladeShapeID}`)
			.then(() => {
				setBladeShapes(
					bladeShapes.filter((shape) => shape.id !== selectedBladeShapeID),
				);
				setBladeShapeModalOpen(false);
			})
			.catch((error) => {
				console.error("Error deleting blade shape:", error);
			});
	};

	const handleBladeShapeChange = (event) => {
		setSelectedBladeShape(event.target.value);
	};

	// ----------------- End of BladeShapeModal functions ---------------------

	// ---------------- Start of HaftingShapeModal functions --------------------
	// This function fetches all hafting shapes from the server and updates the local state on mount.
	useEffect(() => {
		http
			.get("/haftingShapes")
			.then((response) => {
				setHaftingShapes(response.data);
				const filteredHaftingShape = response.data.find(
					(haftingShape) => haftingShape.name === selectedHaftingShape,
				);

				// Check if period with the provided name was found
				if (filteredHaftingShape) {
					log.info(filteredHaftingShape);
					setHaftingShapeID(filteredHaftingShape.id);
				}
			})
			.catch((error) => {
				console.error("Error fetching hafting shapes:", error);
			});
	}, [selectedHaftingShape]);

	// This function opens the HaftingShapeModal for editing an existing hafting shape or adding a new one.
	const handleOpenHaftingShapeModal = (haftingShapeID = null) => {
		setSelectedHaftingShapeID(haftingShapeID);
		setEditHaftingShape(true);
		setHaftingShapeModalOpen(true);
	};

	// This function handles the selection of a hafting shape for editing.
	const handleEditHaftingShape = (event, haftingShape) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setAnchorEl(event.currentTarget);
		setSelectedHaftingShapeID(haftingShape.id);
	};

	// This function updates the local list of hafting shapes after adding or editing a hafting shape.
	// If the hafting shape already exists in the list, it's updated.
	// Otherwise, the new hafting shape is added to the list.
	const updateHaftingShapeList = (newHaftingShape) => {
		setHaftingShapes((prevHaftingShapes) => {
			const index = prevHaftingShapes.findIndex(
				(shape) => shape.id === newHaftingShape.id,
			);
			if (index > -1) {
				const updatedHaftingShape = [...prevHaftingShapes];
				updateHaftingShapeList[index] = newHaftingShape;
				return updatedHaftingShape;
			} else {
				return [...prevHaftingShapes, newHaftingShape];
			}
		});
	};

	// This function handles delete a hafting shape from the server and updates the local list.
	const handleDeleteHaftingShape = () => {
		http
			.delete(`/haftingShapes/${selectedHaftingShapeID}`)
			.then(() => {
				setHaftingShapes(
					haftingShapes.filter((shape) => shape.id !== selectedHaftingShapeID),
				);
				setHaftingShapeModalOpen(false);
			})
			.catch((error) => {
				console.error("Error deleting hafting shape:", error);
			});
	};

	const handleHaftingShapeChange = (event) => {
		setSelectedHaftingShape(event.target.value);
	};

	// ----------------- End of HaftingShapeModalfunctions ---------------------

	// ---------------- Start of MaterialModal functions --------------------
	useEffect(() => {
		http
			.get("/materials")
			.then((response) => {
				setMaterials(response.data);
				const filteredMaterial = response.data.find(
					(material) => material.name === selectedMaterial,
				);

				// Check if artifactType with the provided name was found
				if (filteredMaterial) {
					log.info(filteredMaterial);
					setMaterialID(filteredMaterial.id);
				}
			})
			.catch((error) => {
				console.error("Error fetching material:", error);
			});

		http
			.get("/artifactTypes")
			.then((response) => {
				setArtifactTypes(response.data);
			})
			.catch((error) => {
				console.error("Error fetching artifact types:", error);
			});
	}, [selectedMaterial]);

	useEffect(() => {
		http
			.get("/materials")
			.then((response) => {
				setMaterials(response.data);
				const filteredMaterial = response.data.find(
					(material) => material.name === selectedMaterial,
				);

				// Check if artifactType with the provided name was found
				if (filteredMaterial) {
					log.info(filteredMaterial);
					setMaterialID(filteredMaterial.id);
				}
			})
			.catch((error) => {
				console.error("Error fetching material:", error);
			});
	}, [selectedMaterial]);

	const handleOpenMaterialModal = (materialID = null) => {
		setSelectedMaterialID(materialID);
		setEditMaterial(true);
		setMaterialModalOpen(true);
	};

	const handleOpenEditMaterialMenu = (event, material) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setAnchorEl(event.currentTarget);
		setSelectedMaterialID(material.id);
	};

	const handleMaterialChange = (event) => {
		// setMaterialID(event.target.id);
		setSelectedMaterial(event.target.value);
	};

	const updateMaterialList = (newMaterial) => {
		setMaterials((prev) => {
			const index = prev.findIndex((c) => c.id === newMaterial.id);
			if (index > -1) {
				return prev.map((c) => (c.id === newMaterial.id ? newMaterial : c));
			} else {
				return [...prev, newMaterial];
			}
		});
	};

	const handleDeleteMaterial = () => {
		http
			.delete(`/materials/${selectedMaterialID}`)
			.then(() => {
				setMaterials(
					materials.filter((material) => material.id !== selectedMaterialID),
				);
				handleCloseMenu();
			})
			.catch((error) => {
				console.error("Error deleting material:", error);
				handleCloseMenu();
			});
	};
	// ---------------- End of MaterialModal functions --------------------

	return (
		<div>
			<Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
				<DialogTitle>Add Projectile Point to {siteName}</DialogTitle>
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
								rows={4}
								fullWidth
								value={description}
								onChange={handleDescriptionChange}
							/>
							{/* ------------ Start of PeriodModal ------------- */}
							<TextField
								select
								label="Period"
								value={selectedPeriod}
								onChange={handlePeriodChange}
								fullWidth
								margin="dense"
							>
								{periods.map((period) => (
									<MenuItem key={period.id} value={period.name}>
										{period.name}
										<IconButton
											size="small"
											onClick={(event) => handleOpenMenu(event, period)}
											style={{ marginLeft: "auto" }}
										>
											<MoreHorizIcon />
										</IconButton>
									</MenuItem>
								))}
								<MenuItem onClick={() => handleOpenPeriodModal()}>
									+ Add New Period
								</MenuItem>
							</TextField>
							<Menu
								id="period-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleCloseMenu}
							>
								<MenuItem
									onClick={() => {
										handleOpenPeriodModal(currentPeriod.id);
										handleCloseMenu();
									}}
								>
									<EditIcon fontSize="small" /> Edit
								</MenuItem>
								<MenuItem onClick={handleDeletePeriod}>
									<DeleteIcon fontSize="small" /> Delete
								</MenuItem>
							</Menu>
							{/* ------------ End of PeriodModal  ------------- */}
							{/* ------------ Start of CultureModal  ------------- */}
							<TextField
								select
								label="Culture"
								value={selectedCulture}
								onChange={handleCultureChange}
								fullWidth
								margin="dense"
							>
								{cultures.map((culture) => (
									<MenuItem key={culture.id} value={culture.name}>
										{culture.name}
										<IconButton
											size="small"
											onClick={(event) =>
												handleOpenEditCultureMenu(event, culture)
											}
											style={{ marginLeft: "auto" }}
										>
											<MoreHorizIcon />
										</IconButton>
									</MenuItem>
								))}

								<MenuItem onClick={() => handleOpenCultureModal()}>
									+ Add New Culture
								</MenuItem>
								<Menu
									id="culture-menu"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={() => {
										setAnchorEl(null);
									}}
								>
									<MenuItem
										onClick={() => {
											setEditCulture(true);
											setCultureModalOpen(true);
											setAnchorEl(null);
										}}
									>
										<EditIcon fontSize="small" /> Edit
									</MenuItem>
									<MenuItem
										onClick={() => {
											handleDeleteCulture();
											setAnchorEl(null);
										}}
									>
										<DeleteIcon fontSize="small" /> Delete
									</MenuItem>
								</Menu>
							</TextField>
							{/* ------------ End of CultureModal  ------------- */}
							{/*Should be renamed(maybe just drop the ID?)  also, Menu items will need to be dynamic at some point*/}
							<TextField
								margin="dense"
								id="artifactTypeID"
								label="ArtifactTypeID"
								variant="outlined"
								fullWidth
								select
								value={artifactTypeID}
								onChange={(e) => setArtifactTypeID(e.target.value)}
							>
								<MenuItem value="Lithic">Lithic</MenuItem>
								<MenuItem value="Ceramic">Ceramic</MenuItem>
								<MenuItem value="Faunal">Faunal</MenuItem>
							</TextField>
							{/* ------------ Start of MaterialModal  ------------- */}
							<TextField
								select
								label="Material"
								value={selectedMaterial}
								onChange={handleMaterialChange}
								fullWidth
								margin="dense"
							>
								{materials.map((material) => (
									<MenuItem key={material.id} value={material.name}>
										{material.name}
										<IconButton
											size="small"
											onClick={(event) =>
												handleOpenEditMaterialMenu(event, material)
											}
											style={{ marginLeft: "auto" }}
										>
											<MoreHorizIcon />
										</IconButton>
									</MenuItem>
								))}

								<MenuItem onClick={() => handleOpenMaterialModal()}>
									+ Add New Material
								</MenuItem>
								<Menu
									id="material-menu"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={() => {
										setAnchorEl(null);
									}}
								>
									<MenuItem
										onClick={() => {
											setEditMaterial(true);
											setMaterialModalOpen(true);
											setAnchorEl(null);
										}}
									>
										<EditIcon fontSize="small" /> Edit
									</MenuItem>
									<MenuItem
										onClick={() => {
											handleDeleteMaterial();
											setAnchorEl(null);
										}}
									>
										<DeleteIcon fontSize="small" /> Delete
									</MenuItem>
								</Menu>
							</TextField>
							{/* ------------ End of MaterialModal  ------------- */}
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
							{/* ------------ Start of BaseShapeModal  ------------- */}
							<TextField
								select
								label="Base Shape"
								fullWidth
								margin="dense"
								value={selectedBaseShape}
								onChange={handleBaseShapeChange}
							>
								{baseShapes.map((shape) => (
									<MenuItem key={shape.id} value={shape.name}>
										{shape.name}
										<IconButton
											size="small"
											onClick={(event) => handleEditBaseShape(event, shape)}
											style={{ marginLeft: "auto" }}
										>
											<MoreHorizIcon />
										</IconButton>
									</MenuItem>
								))}
								<MenuItem onClick={() => handleOpenBaseShapeModal()}>
									+ Add New Base Shape
								</MenuItem>

								<Menu
									id="base-shape-menu"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={() => {
										setAnchorEl(null);
									}}
								>
									<MenuItem
										onClick={() => {
											setEditBaseShape(true);
											setBaseShapeModalOpen(true);
											setAnchorEl(null);
										}}
									>
										<EditIcon fontSize="small" /> Edit
									</MenuItem>
									<MenuItem
										onClick={() => {
											handleDeleteBaseShape();
											setAnchorEl(null);
										}}
									>
										<DeleteIcon fontSize="small" /> Delete
									</MenuItem>
								</Menu>
							</TextField>
							{/* ------------ End of BaseShapeModal  ------------- */}
							{/* ------------ Start of CrossSectionModal  ------------- */}
							<TextField
								select
								label="Cross Section"
								fullWidth
								margin="dense"
								value={selectedCrossSection}
								onChange={handleCrossSectionChange}
							>
								{crossSections.map((crossSect) => (
									<MenuItem key={crossSect.id} value={crossSect.name}>
										{crossSect.name}
										<IconButton
											size="small"
											onClick={(event) =>
												handleEditCrossSection(event, crossSect)
											}
											style={{ marginLeft: "auto" }}
										>
											<MoreHorizIcon />
										</IconButton>
									</MenuItem>
								))}
								<MenuItem onClick={() => handleOpenCrossSectionModal()}>
									+ Add New Cross Section
								</MenuItem>

								<Menu
									id="cross-section-menu"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={() => {
										setAnchorEl(null);
									}}
								>
									<MenuItem
										onClick={() => {
											setEditCrossSection(true);
											setCrossSectionModalOpen(true);
											setAnchorEl(null);
										}}
									>
										<EditIcon fontSize="small" /> Edit
									</MenuItem>
									<MenuItem
										onClick={() => {
											handleDeleteCrossSection();
											setAnchorEl(null);
										}}
									>
										<DeleteIcon fontSize="small" /> Delete
									</MenuItem>
								</Menu>
							</TextField>
							{/* ------------ End of CrossSectionModal  ------------- */}
							{/* ------------ Start of BladeShapeModal  ------------- */}
							<TextField
								select
								label="Blade Shape"
								fullWidth
								margin="dense"
								value={selectedBladeShape}
								onChange={handleBladeShapeChange}
							>
								{bladeShapes.map((shape) => (
									<MenuItem key={shape.id} value={shape.name}>
										{shape.name}
										<IconButton
											size="small"
											onClick={(event) => handleEditBladeShape(event, shape)}
											style={{ marginLeft: "auto" }}
										>
											<MoreHorizIcon />
										</IconButton>
									</MenuItem>
								))}
								<MenuItem onClick={() => handleOpenBladeShapeModal()}>
									+ Add New Blade Shape
								</MenuItem>

								<Menu
									id="blade-shape-menu"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={() => {
										setAnchorEl(null);
									}}
								>
									<MenuItem
										onClick={() => {
											setEditBladeShape(true);
											setBladeShapeModalOpen(true);
											setAnchorEl(null);
										}}
									>
										<EditIcon fontSize="small" /> Edit
									</MenuItem>
									<MenuItem
										onClick={() => {
											handleDeleteBladeShape();
											setAnchorEl(null);
										}}
									>
										<DeleteIcon fontSize="small" /> Delete
									</MenuItem>
								</Menu>
							</TextField>
							{/* ------------ End of BladeShapeModal  ------------- */}
							{/* ------------ Start of HaftingShapeModal  ------------- */}
							<TextField
								select
								label="Hafting Shape"
								fullWidth
								margin="dense"
								value={selectedHaftingShape}
								onChange={handleHaftingShapeChange}
							>
								{haftingShapes.map((shape) => (
									<MenuItem key={shape.id} value={shape.name}>
										{shape.name}
										<IconButton
											size="small"
											onClick={(event) => handleEditHaftingShape(event, shape)}
											style={{ marginLeft: "auto" }}
										>
											<MoreHorizIcon />
										</IconButton>
									</MenuItem>
								))}
								<MenuItem onClick={() => handleOpenHaftingShapeModal()}>
									+ Add New Hafting Shape
								</MenuItem>

								<Menu
									id="hafting-shape-menu"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={() => {
										setAnchorEl(null);
									}}
								>
									<MenuItem
										onClick={() => {
											setEditHaftingShape(true);
											setHaftingShapeModalOpen(true);
											setAnchorEl(null);
										}}
									>
										<EditIcon fontSize="small" /> Edit
									</MenuItem>
									<MenuItem
										onClick={() => {
											handleDeleteHaftingShape();
											setAnchorEl(null);
										}}
									>
										<DeleteIcon fontSize="small" /> Delete
									</MenuItem>
								</Menu>
							</TextField>
							{/* ------------ End of HaftingShapeModal  ------------- */}
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
			{editPeriod && (
				<PeriodModal
					setEditPeriod={setEditPeriod}
					selectedPeriod={selectedPeriod}
					selectedPeriodID={selectedPeriodID}
					periods={periods}
					setPeriods={setPeriods}
					updatePeriodsList={updatePeriodsList}
					periodModalOpen={periodModalOpen}
					setPeriodModalOpen={setPeriodModalOpen}
				/>
			)}
			{editCulture && (
				<CultureModal
					setEditCulture={setEditCulture}
					selectedCulture={selectedCulture}
					selectedCultureID={selectedCultureID}
					updateCulturesList={updateCulturesList}
					periods={periods}
					cultureModalOpen={cultureModalOpen}
					setCultureModalOpen={setCultureModalOpen}
				/>
			)}
			{editMaterial && (
				<MaterialModal
					setEditMaterial={setEditMaterial}
					selectedMaterial={selectedMaterial}
					selectedMaterialID={selectedMaterialID}
					updateMaterialList={updateMaterialList}
					artifactTypes={artifactTypes}
				/>
			)}
			{editBaseShape && (
				<BaseShapeModal
					setEditBaseShape={setEditBaseShape}
					selectedBaseShape={selectedBaseShape}
					selectedBaseShapeID={selectedBaseShapeID}
					updateBaseShapesList={updateBaseShapesList}
				/>
			)}
			{editCrossSection && (
				<CrossSectionModal
					setEditCrossSection={setEditCrossSection}
					selectedCrossSection={selectedCrossSection}
					selectedCrossSectionID={selectedCrossSectionID}
					updateCrossSectionsList={updateCrossSectionList}
				/>
			)}
			{editBladeShape && (
				<BladeShapeModal
					setEditBladeShape={setEditBladeShape}
					selectedBladeShape={selectedBladeShape}
					selectedBladeShapeID={selectedBladeShapeID}
					updateBladeShapesList={updateBladeShapesList}
				/>
			)}
			{editHaftingShape && (
				<HaftingShapeModal
					setEditHaftingShape={setEditHaftingShape}
					selectedHaftingShape={selectedHaftingShape}
					selectedHaftingShapeID={selectedHaftingShapeID}
					updateHaftingShapeList={updateHaftingShapeList}
				/>
			)}
		</div>
	);
};

export default AddProjectile;
