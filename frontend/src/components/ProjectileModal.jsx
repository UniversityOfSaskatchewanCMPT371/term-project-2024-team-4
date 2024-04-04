/* eslint-disable react/prop-types */
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
	FormControl,
	InputLabel,
	TextField,
	Select,
	MenuItem,
	Grid,
	IconButton,
	Menu,
	FormLabel,
	InputAdornment,
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
const AddProjectile = ({
	openAdd,
	setOpenAdd,
	setOpenView,
	openEdit,
	setOpenEdit,
	projectilePointId,
}) => {
	const inComingSiteInfo = useLocation();

	const siteID = inComingSiteInfo.state.info.id;
	const siteName = inComingSiteInfo.state.info.name;

	/**
	 * Check if modal is being used for add or edit projectile points
	 */
	useEffect(() => {
		if (openAdd) {
			log.info("Adding new projectile point");
		}
		if (openEdit) {
			log.info("Updating a projectile point");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [name, setName] = useState(""); // remove once PP name column is removed in database
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [height, setHeight] = useState("");
	const [width, setWidth] = useState("");
	const [length, setLength] = useState("");
	const [photoFilePath, setPhotoFilePath] = useState(null);
	const [artifactTypeID, setArtifactTypeID] = useState("");
	const [cultureID, setCultureID] = useState(0);
	const [bladeShapeID, setBladeShapeID] = useState(0);
	const [baseShapeID, setBaseShapeID] = useState(0);
	const [haftingShapeID, setHaftingShapeID] = useState(0);
	const [crossSectionID, setCrossSectionID] = useState(0);

	const [artifactTypeError, setArtifactTypeError] = useState(false); // for artifact type dropdown error handling

	// for dimension fields validation
	const [lengthError, setLengthError] = useState(false);
	const [widthError, setWidthError] = useState(false);
	const [heightError, setHeightError] = useState(false);

	const [materialID, setMaterialID] = useState(0); // for future implementation of adding materials
	const [periodID, setPeriodID] = useState(0); // not needed for adding projectile point, for testing only

	const [currentPeriod, setCurrentPeriod] = useState(null); // The period currently selected in the dropdown

	// ------- For state variables for managing period dropdown and edit/delete functionalities -------
	const [periodAnchorEl, setPeriodAnchorEl] = useState(null); // For the dropdown menu anchor
	const [cultureAanchorEl, setCultureAnchorEl] = useState(null); // For the dropdown menu anchor
	const [materialAnchorEl, setMaterialAnchorEl] = useState(null); // For the dropdown menu anchor
	const [baseShapeAnchorEl, setBaseShapeAnchorEl] = useState(null); // For the dropdown menu anchor
	const [crossSectionAnchorEl, setCrossSectionAnchorEl] = useState(null); // For the dropdown menu anchor
	const [bladeShapeAnchorEl, setBladeShapeAnchorEl] = useState(null); // For the dropdown menu anchor
	const [haftingShapeAnchorEl, setHaftingShapeAnchorEl] = useState(null); // For the dropdown menu anchor

	// Function to open the dropdown menu (Edit/Delete options for periods)
	const handleOpenMenu = (event, period) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setPeriodAnchorEl(event.currentTarget);
		setCurrentPeriod(period);
		setEditingPeriod(period); // temp fix
	};

	// Function to close the dropdown menu
	const handleCloseMenu = () => {
		setPeriodAnchorEl(null);
		setCurrentPeriod(null);
	};

	// ----------------------------------------------------------------------------------------

	// ------------ For state variables for editing periods through the PeriodModal ------------
	const [periods, setPeriods] = useState([]);
	const [selectedPeriod, setSelectedPeriod] = useState("");
	const [editPeriod, setEditPeriod] = useState(false);
	const [periodModalOpen, setPeriodModalOpen] = useState(false);
	const [selectedPeriodID, setSelectedPeriodID] = useState(null);
	const [editingPeriod, setEditingPeriod] = useState("");

	// -----------------------------------------------------------------------------------------

	// ------------ For state variables for editing cultures through the CultureModal ----------
	const [cultures, setCultures] = useState([]);
	const [selectedCulture, setSelectedCulture] = useState("");
	const [cultureModalOpen, setCultureModalOpen] = useState(false);
	const [editCulture, setEditCulture] = useState(false);
	const [selectedCultureID, setSelectedCultureID] = useState(null);
	const [editingCulture, setEditingCulture] = useState("");
	// -----------------------------------------------------------------------------------------

	// ---------- For state variables for editing BaseShapes through the BaseShapeModal --------
	const [baseShapes, setBaseShapes] = useState([]);
	const [selectedBaseShape, setSelectedBaseShape] = useState("");
	const [baseShapeModalOpen, setBaseShapeModalOpen] = useState(false);
	const [editBaseShape, setEditBaseShape] = useState(false);
	const [selectedBaseShapeID, setSelectedBaseShapeID] = useState(null);
	const [editingBaseShape, setEditingBaseShape] = useState("");
	// -----------------------------------------------------------------------------------------

	// ---------- For state variables for editing CrossSections through the CrossSectionModal --------
	const [crossSections, setCrossSections] = useState([]);
	const [selectedCrossSection, setSelectedCrossSection] = useState("");
	const [crossSectionModalOpen, setCrossSectionModalOpen] = useState(false);
	const [editCrossSection, setEditCrossSection] = useState(false);
	const [selectedCrossSectionID, setSelectedCrossSectionID] = useState(null);
	const [editingCrossSection, setEditingCrossSection] = useState("");

	// -----------------------------------------------------------------------------------------

	// ---------- For state variables for editing BladeShapes through the BladeShapeModal --------
	const [bladeShapes, setBladeShapes] = useState([]);
	const [selectedBladeShape, setSelectedBladeShape] = useState("");
	const [bladeShapeModalOpen, setBladeShapeModalOpen] = useState(false);
	const [editBladeShape, setEditBladeShape] = useState(false);
	const [selectedBladeShapeID, setSelectedBladeShapeID] = useState(null);
	const [editingBladeShape, setEditingBladeShape] = useState("");
	// -----------------------------------------------------------------------------------------

	// ---------- For state variables for editing HaftingShapes through the HaftinfShapeModal --------
	const [haftingShapes, setHaftingShapes] = useState([]);
	const [selectedHaftingShape, setSelectedHaftingShape] = useState("");
	const [haftingShapeModalOpen, setHaftingShapeModalOpen] = useState(false);
	const [editHaftingShape, setEditHaftingShape] = useState(false);
	const [selectedHaftingShapeID, setSelectedHaftingShapeID] = useState(null);
	const [editingHaftingShape, setEditingHaftingShape] = useState("");
	// -----------------------------------------------------------------------------------------

	// ---------- For state variables for editing Material through the MaterialModal --------
	const [materials, setMaterials] = useState([]);
	const [selectedMaterial, setSelectedMaterial] = useState("");
	const [materialModalOpen, setMaterialModalOpen] = useState(false);
	const [editMaterial, setEditMaterial] = useState(false);
	const [selectedMaterialID, setSelectedMaterialID] = useState(null);
	const [editingMaterial, setEditingMaterial] = useState("");

	const [artifactTypes, setArtifactTypes] = useState([]);
	// -----------------------------------------------------------------------------------------

	/**
	 * Handle modal visibility depending if being used for add or edit
	 */
	const handleClose = () => {
		if (openAdd) {
			setOpenAdd(false);
		} else {
			setOpenEdit(false);
			setOpenView(true);
		}
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};

	const handleLocationChange = (event) => {
		setLocation(event.target.value);
	};

	/**
	 * Validation of length, width, and height input values to only accept float values
	 * everytime length, width, or height values change
	 */
	useEffect(() => {
		const isFloatRegExp = new RegExp("^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");

		if (
			(isFloatRegExp.test(length) && parseFloat(length) > 0.0) ||
			length.length === 0
		) {
			setLengthError(false);
		} else {
			setLengthError(true);
		}

		if (
			(isFloatRegExp.test(width) && parseFloat(width) > 0.0) ||
			width.length === 0
		) {
			setWidthError(false);
		} else {
			setWidthError(true);
		}

		if (
			(isFloatRegExp.test(height) && parseFloat(height) > 0.0) ||
			height.length === 0
		) {
			setHeightError(false);
		} else {
			setHeightError(true);
		}
	}, [length, width, height]);

	const handleLengthChange = (event) => {
		setLength(event.target.value);
	};

	const handleWidthChange = (event) => {
		setWidth(event.target.value);
	};

	const handleHeightChange = (event) => {
		setHeight(event.target.value);
	};

	const handleArtifactTypeChange = (event) => {
		if (event.target.value.trim() === "") {
			setArtifactTypeError(true);
		} else {
			setArtifactTypeError(false);
			setArtifactTypeID(event.target.value);
		}
	};

	const handlePhotoFilePathChange = (event) => {
		const file = event.target.files[0];
		const allowedTypes = ["image/jpeg", "image/png", "image/gif"]; // Add more if needed
		if (file && allowedTypes.includes(file.type)) {
			log.info(file.name);
			setPhotoFilePath(file);
		} else {
			// Handle invalid file type
			alert("Please select a valid image file (JPEG, PNG, GIF).");
			// Clear the input field if necessary
			event.target.value = "";
		}
	};

	const handleSubmit = () => {
		if (artifactTypeID.trim() === "") {
			setArtifactTypeError(true);
		} else if (!lengthError && !widthError && !heightError) {
			log.info("Adding new projectile");

			const formData = new FormData();
			formData.append("name", name); // remove once PP name column is removed in database
			formData.append("location", location);
			formData.append("description", description);

			if (length.trim()) {
				setLength(length.replace(/[^0-9.]/g, ""));
			}

			if (width.trim()) {
				setWidth(width.replace(/[^0-9.]/g, ""));
			}

			if (height.trim()) {
				setHeight(height.replace(/[^0-9.]/g, ""));
			}

			formData.append(
				"dimensions",
				new Array(parseFloat(length), parseFloat(width), parseFloat(height)),
			);
			formData.append("photo", photoFilePath);
			formData.append("siteId", siteID);
			formData.append("artifactTypeId", artifactTypeID);
			formData.append("cultureId", cultureID);
			formData.append("bladeShapeId", bladeShapeID);
			formData.append("baseShapeId", baseShapeID);
			formData.append("haftingShapeId", haftingShapeID);
			formData.append("crossSectionId", crossSectionID);
			formData.append("materialId", materialID);

			// set up API endpoint depending if modal is being used for add or edit
			const requestUrl = `/projectilePoints/${projectilePointId || ""}`;
			const requestMethod = openAdd ? http.post : http.put;

			requestMethod(requestUrl, formData)
				.then((response) => {
					if (openAdd) {
						log.info("New projectile point added successfully:", response.data);
					} else {
						log.info("Updated projectile point successfully:", response.data);
					}
				})
				.catch((error) => {
					if (openAdd) {
						log.error("Error adding new  projectile point:", error);
					} else {
						log.error("Error updating projectile point:", error);
					}
				});

			log.info("Submitted:", ...formData);

			//Add Base/Blade/Hafting shape and cross section to selected culture.
			//first, if the currently selected Base/Blade/Hafting shape and cross sections are not in the current culture, add them

			http
				.get(`/cultures/${cultureID}`)
				.then((response) => {
					console.log(
						"New projectile point added successfully:",
						response.data,
					);
					let cultureToUpdate = response.data;
					//check if the selected base shape is in the selected culture.
					if (
						!cultureToUpdate.baseShapes.find(
							(baseShapeObj) => baseShapeObj.id === baseShapeID,
						)
					) {
						cultureToUpdate.baseShapes.push(baseShapeID);
					}
					//check if the selected hafting shape is in the selected culture.
					if (
						!cultureToUpdate.haftingShapes.find(
							(haftingShapeObj) => haftingShapeObj.id === haftingShapeID,
						)
					) {
						cultureToUpdate.haftingShapes.push(haftingShapeID);
					}
					//check if the selected blade shape is in the selected culture.
					if (
						!cultureToUpdate.bladeShapes.find(
							(bladeShapeObj) => bladeShapeObj.id === bladeShapeID,
						)
					) {
						cultureToUpdate.bladeShapes.push(bladeShapeID);
					}
					//check if the selected cross section is in the selected culture.
					if (
						!cultureToUpdate.crossSections.find(
							(crossSectionObj) => crossSectionObj.id === crossSectionID,
						)
					) {
						cultureToUpdate.crossSections.push(crossSectionID);
					}
					//check if the selected material is in the selected culture.
					if (
						!cultureToUpdate.materials.find(
							(materialObj) => materialObj.id === materialID,
						)
					) {
						cultureToUpdate.materials.push(materialID);
					}
					const updatedCulture = {
						name: cultureToUpdate.name,
						periodId: cultureToUpdate.periodId,
						baseShapes: cultureToUpdate.baseShapes,
						bladeShapes: cultureToUpdate.bladeShapes,
						haftingShapes: cultureToUpdate.haftingShapes,
						crossSections: cultureToUpdate.crossSections,
						materials: cultureToUpdate.materials,
					};
					log.info("PM 231: " + updatedCulture);

					http
						.put(`/cultures/${cultureID}`, updatedCulture)
						.then((response) => {
							handleClose();
							log.info(
								`Culture processed successfully: ${JSON.stringify(response.data)}`,
							);
						})
						.catch((error) => {
							handleClose();
							log.error(`Error processing culture: ${error}`);
						});
				})
				.catch((error) => {
					handleClose();
					console.error("Error fetching all cultures:", error);
				});
		}
	};

	/**
	 * Pre-populate input fields for editing projectile point
	 */
	useEffect(() => {
		if (openEdit) {
			http
				.get(`/projectilePoints/${projectilePointId}`)
				.then((response) => {
					log.info("Editing projectile point: ", response.data);
					setName(response.data.site.name + "-" + response.data.id);
					setDescription(response.data.description);
					setLocation(response.data.location);

					const dimensions = response.data.dimensions.split(",");

					setLength(dimensions[0].trim().replace(/[^0-9.]/g, ""));
					setWidth(dimensions[1].trim().replace(/[^0-9.]/g, ""));
					setHeight(dimensions[2].trim().replace(/[^0-9.]/g, ""));

					// setPhotoFilePath(response.data.photo);
					setArtifactTypeID(response.data.artifactType.id);

					if (response.data.culture !== null) {
						setSelectedPeriod(response.data.culture.period.name);
						setSelectedCulture(response.data.culture.name);
					}

					if (response.data.bladeShape !== null) {
						setSelectedBladeShape(response.data.bladeShape.name);
					}

					if (response.data.baseShape !== null) {
						setSelectedBaseShape(response.data.baseShape.name);
					}

					if (response.data.haftingShape !== null) {
						setSelectedHaftingShape(response.data.haftingShape.name);
					}

					if (response.data.crossSection !== null) {
						setSelectedCrossSection(response.data.crossSection.name);
					}

					if (response.data.material !== null) {
						setSelectedMaterial(response.data.material.name);
					}
				})
				.catch((error) => {
					log.error("Error fetching projectile point: ", error);
				});
		}
	}, [openEdit, projectilePointId]);

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
	}, [selectedPeriod, editingPeriod]);

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

	const handlePeriodChange = async (event) => {
		const selectedPeriodName = event.target.value;
		setSelectedPeriod(selectedPeriodName);

		const selectedPeriod = periods.find(
			(period) => period.name === selectedPeriodName,
		);

		if (selectedPeriod) {
			// If there are cultures associated with the selected period, update the cultures state
			if (selectedPeriod.cultures.length > 0) {
				setCultures(selectedPeriod.cultures);
				// Optionally, automatically select the first culture
				setSelectedCulture(selectedPeriod.cultures[0].name);
				setSelectedCultureID(selectedPeriod.cultures[0].id);
			} else {
				// If there are no cultures associated with the selected period, clear the cultures
				setCultures([]);
				setSelectedCulture("");
				setSelectedCultureID(null);
			}
		} else {
			console.error("Selected period not found.");
			setCultures([]);
			setSelectedCulture("");
			setSelectedCultureID(null);
		}

		if (selectedPeriod?.cultures?.length > 0) {
			const relatedCulture = selectedPeriod.cultures[0];
			setSelectedCulture(relatedCulture.name.trim());

			//get all of the blade/base/hafting shapes and cross sections.
			const bladeShapesResponse = await http.get("/bladeShapes");
			const baseShapesResponse = await http.get("/baseShapes");
			const haftingShapesResponse = await http.get("/haftingShapes");
			const crossSectionsResponse = await http.get("/crossSections");
			const materialsResponse = await http.get("/materials");

			//add the other options to the end, placing the shapes associated with the culture first.
			setBladeShapes(
				mergeArrays(relatedCulture.bladeShapes, bladeShapesResponse.data),
			);
			if (relatedCulture.bladeShapes.length > 0) {
				setSelectedBladeShape(relatedCulture.bladeShapes[0].name);
				setSelectedBladeShapeID(relatedCulture.bladeShapes[0].id);
			} else {
				setSelectedBladeShape("");
				setSelectedBladeShapeID(null);
			}

			//add the other options to the end, placing the shapes associated with the culture first.
			setBaseShapes(
				mergeArrays(relatedCulture.baseShapes, baseShapesResponse.data),
			);
			if (relatedCulture.baseShapes.length > 0) {
				setSelectedBaseShape(relatedCulture.baseShapes[0].name);
				setSelectedBaseShapeID(relatedCulture.baseShapes[0].id);
			} else {
				setSelectedBaseShape("");
				setSelectedBaseShapeID(null);
			}
			//add the other options to the end, placing the shapes associated with the culture first.
			setCrossSections(
				mergeArrays(relatedCulture.crossSections, crossSectionsResponse.data),
			);
			if (relatedCulture.crossSections.length > 0) {
				setSelectedCrossSection(relatedCulture.crossSections[0].name);
				setSelectedCrossSectionID(relatedCulture.crossSections[0].id);
			} else {
				setSelectedCrossSection("");
				setSelectedCrossSectionID(null);
			}
			//add the other options to the end, placing the shapes associated with the culture first.
			setHaftingShapes(
				mergeArrays(relatedCulture.haftingShapes, haftingShapesResponse.data),
			);
			if (relatedCulture.haftingShapes.length > 0) {
				setSelectedHaftingShape(relatedCulture.haftingShapes[0].name);
				setSelectedHaftingShapeID(relatedCulture.haftingShapes[0].id);
			} else {
				setSelectedHaftingShape("");
				setSelectedHaftingShapeID(null);
			}
			setMaterials(
				mergeArrays(relatedCulture.materials, materialsResponse.data),
			);
			if (relatedCulture.materials.length > 0) {
				setSelectedMaterial(relatedCulture.materials[0].name);
				setSelectedMaterialID(relatedCulture.materials[0].id);
			} else {
				setSelectedMaterial("");
				setSelectedMaterialID(null);
			}
		} else {
			resetShapeSelections();
		}
	};

	//Helper function for merging two arrays without duplicates
	const mergeArrays = (
		array1,
		array2,
		predicate = (array1, array2) => array1 === array2,
	) => {
		const array1Copy = [...array1]; // copy to avoid side effects
		// add all items from B to copy C if they're not already present
		array2.forEach((array2Item) =>
			array1Copy.some((array1CopyItem) =>
				predicate(array2Item.id, array1CopyItem.id),
			)
				? null
				: array1Copy.push(array2Item),
		);
		return array1Copy;
	};

	// Helper function to fetch shape data and update state
	const fetchShapeData = async (
		endpoint,
		shapeType,
		setShapes,
		setSelectedShape,
		setSelectedShapeID,
	) => {
		try {
			const response = await http.get(endpoint);
			const culture = response.data;
			setShapes(culture[shapeType]);
			// Optionally set the selected shape to the first item in the response
			if (culture[shapeType].length > 0) {
				setSelectedShape(culture[shapeType][0].name);
				setSelectedShapeID(culture[shapeType][0].id);
			} else {
				setSelectedShape("");
				setSelectedShapeID(null);
			}
		} catch (error) {
			console.error(`Error fetching data from ${endpoint}:`, error);
		}
	};

	// Helper function to reset all shape-related selections to default values
	const resetShapeSelections = () => {
		setSelectedBladeShape("");
		setSelectedBladeShapeID(null);
		setBladeShapes([]);

		setSelectedBaseShape("");
		setSelectedBaseShapeID(null);
		setBaseShapes([]);

		setSelectedCrossSection("");
		setSelectedCrossSectionID(null);
		setCrossSections([]);

		setSelectedHaftingShape("");
		setSelectedHaftingShapeID(null);
		setHaftingShapes([]);
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
				//when a period is selected, this stops the culture dropdown from being constantly overwritten
				if (!selectedPeriod) {
					setCultures(response.data);
				}
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
	}, [selectedCulture, selectedPeriod, editingCulture]);

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
		setCultureAnchorEl(event.currentTarget);
		setSelectedCultureID(culture.id);
		setEditingCulture(culture); // temp fix
	};

	// This function the selectedCulture state when a user selects a different culture from the dropdown
	const handleCultureChange = async (event) => {
		const selectedCultureName = event.target.value;
		const selectedCultureId = event.target.id;
		setCultureID(event.target.id);
		setSelectedCulture(event.target.value);

		// Find the selected culture object based on the selected name
		const selectedCulture = cultures.find(
			(culture) => culture.name === selectedCultureName,
		);

		if (selectedPeriod) {
			if (selectedCulture.cultures.length > 1) {
				setSelectedPeriod("");
			}
		} else {
			setSelectedPeriod(selectedCulture.period.name);
			const selectedPeriod = periods.find(
				(period) => period.name === selectedCulture.period.name,
			);

			setCultures(selectedPeriod.cultures);
		}

		//get all of the blade/base/hafting shapes and cross sections.
		const bladeShapesResponse = await http.get("/bladeShapes");
		const baseShapesResponse = await http.get("/baseShapes");
		const haftingShapesResponse = await http.get("/haftingShapes");
		const crossSectionsResponse = await http.get("/crossSections");
		const materialsResponse = await http.get("/materials");

		//add the other options to the end, placing the shapes associated with the culture first.
		setBladeShapes(
			mergeArrays(selectedCulture.bladeShapes, bladeShapesResponse.data),
		);
		if (selectedCulture.bladeShapes.length > 0) {
			setSelectedBladeShape(selectedCulture.bladeShapes[0].name);
			setSelectedBladeShapeID(selectedCulture.bladeShapes[0].id);
		} else {
			setSelectedBladeShape("");
			setSelectedBladeShapeID(null);
		}

		//add the other options to the end, placing the shapes associated with the culture first.
		setBaseShapes(
			mergeArrays(selectedCulture.baseShapes, baseShapesResponse.data),
		);
		if (selectedCulture.baseShapes.length > 0) {
			setSelectedBaseShape(selectedCulture.baseShapes[0].name);
			setSelectedBaseShapeID(selectedCulture.baseShapes[0].id);
		} else {
			setSelectedBaseShape("");
			setSelectedBaseShapeID(null);
		}
		//add the other options to the end, placing the shapes associated with the culture first.
		setCrossSections(
			mergeArrays(selectedCulture.crossSections, crossSectionsResponse.data),
		);
		if (selectedCulture.crossSections.length > 0) {
			setSelectedCrossSection(selectedCulture.crossSections[0].name);
			setSelectedCrossSectionID(selectedCulture.crossSections[0].id);
		} else {
			setSelectedCrossSection("");
			setSelectedCrossSectionID(null);
		}
		//add the other options to the end, placing the shapes associated with the culture first.
		setHaftingShapes(
			mergeArrays(selectedCulture.haftingShapes, haftingShapesResponse.data),
		);
		if (selectedCulture.haftingShapes.length > 0) {
			setSelectedHaftingShape(selectedCulture.haftingShapes[0].name);
			setSelectedHaftingShapeID(selectedCulture.haftingShapes[0].id);
		} else {
			setSelectedHaftingShape("");
			setSelectedHaftingShapeID(null);
		}
		//add the other options to the end, placing the materials associated with the culture first.
		setMaterials(
			mergeArrays(selectedCulture.materials, materialsResponse.data),
		);
		if (selectedCulture.materials.length > 0) {
			setSelectedMaterial(selectedCulture.materials[0].name);
			setSelectedMaterialID(selectedCulture.materials[0].id);
		} else {
			setSelectedMaterial("");
			setSelectedMaterialID(null);
		}
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
				//stops the set from overwriting changes to drop down once a culture is selected.
				if (!selectedCulture) {
					setBaseShapes(response.data);
				}

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
	}, [selectedBaseShape, selectedCulture, editingBaseShape]);

	// This function opens the BaseShapeModal for editing an existing base shape or adding a new one.
	const handleOpenBaseShapeModal = (baseShapeId = null) => {
		setSelectedBaseShapeID(baseShapeId);
		setEditBaseShape(true);
		setBaseShapeModalOpen(true);
	};

	// This function handles the selection of a base shape for editing.
	const handleEditBaseShape = (event, baseShape) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setBaseShapeAnchorEl(event.currentTarget);
		setSelectedBaseShapeID(baseShape.id);
		setEditingBaseShape(baseShape.name); // temp fix
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
				//stops the set from overwriting changes to drop down once a culture is selected.
				if (!selectedCulture) {
					setCrossSections(response.data);
				}
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
	}, [selectedCrossSection, selectedCulture, editingCrossSection]);

	// This function opens the CrossSectionModal for editing an existing cross sections or adding a new one.
	const handleOpenCrossSectionModal = (crossSectionId = null) => {
		setSelectedCrossSectionID(crossSectionId);
		setEditCrossSection(true);
		setCrossSectionModalOpen(true);
	};

	// This function handles the selection of a cross sections for editing.
	const handleEditCrossSection = (event, crossSection) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setCrossSectionAnchorEl(event.currentTarget);
		setSelectedCrossSectionID(crossSection.id);
		setEditingCrossSection(crossSection.name); // temp fix
	};

	// This function updates the local list of cross sections after adding or editing a cross sections.
	// If the cross sections already exists in the list, it's updated.
	// Otherwise, the new cross sections is added to the list.
	const updateCrossSectionList = (newCrossSection) => {
		setCrossSections((prevCrossSection) => {
			console.log("what the id:" + newCrossSection.id);
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
				//stops the set from overwriting changes to drop down once a culture is selected.
				if (!selectedCulture) {
					setBladeShapes(response.data);
				}
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
	}, [selectedBladeShape, selectedCulture, editingBladeShape]);

	// This function opens the BladeShapeModal for editing an existing blade shape or adding a new one.
	const handleOpenBladeShapeModal = (bladeShapeId = null) => {
		setSelectedBladeShapeID(bladeShapeId);
		setEditBladeShape(true);
		setBladeShapeModalOpen(true);
	};

	// This function handles the selection of a blade shape for editing.
	const handleEditBladeShape = (event, bladeShape) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setBladeShapeAnchorEl(event.currentTarget);
		setSelectedBladeShapeID(bladeShape.id);
		setEditingBladeShape(bladeShape.name); // temp fix
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
				//stops the set from overwriting changes to drop down once a culture is selected.
				if (!selectedCulture) {
					setHaftingShapes(response.data);
				}
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
	}, [selectedCulture, selectedHaftingShape, editingHaftingShape]);

	// This function opens the HaftingShapeModal for editing an existing hafting shape or adding a new one.
	const handleOpenHaftingShapeModal = (haftingShapeID = null) => {
		setSelectedHaftingShapeID(haftingShapeID);
		setEditHaftingShape(true);
		setHaftingShapeModalOpen(true);
	};

	// This function handles the selection of a hafting shape for editing.
	const handleEditHaftingShape = (event, haftingShape) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setHaftingShapeAnchorEl(event.currentTarget);
		setSelectedHaftingShapeID(haftingShape.id);
		setEditingHaftingShape(haftingShape.name); // temp fix
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
				updatedHaftingShape[index] = newHaftingShape;
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
				//stops the set from overwriting changes to drop down once a culture is selected.
				if (!selectedCulture) {
					setMaterials(response.data);
				}
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
	}, [selectedCulture, selectedMaterial, editingMaterial]);

	// ---------------------------- DUPLICATE USE EFFECT ---------------------------------
	useEffect(() => {
		http
			.get("/materials")
			.then((response) => {
				//stops the set from overwriting changes to drop down once a culture is selected.
				if (!selectedCulture) {
					setMaterials(response.data);
				}
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
	}, [selectedCulture, selectedMaterial, editingMaterial]);

	const handleOpenMaterialModal = (materialID = null) => {
		setSelectedMaterialID(materialID);
		setEditMaterial(true);
		setMaterialModalOpen(true);
	};

	const handleOpenEditMaterialMenu = (event, material) => {
		event.stopPropagation(); // To prevent the dropdown menu from closing when clicking the icon.
		setMaterialAnchorEl(event.currentTarget);
		setSelectedMaterialID(material.id);
		setEditingMaterial(material);
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
		<>
			<Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
				{openAdd && (
					<DialogTitle>Add Projectile Point to {siteName}</DialogTitle>
				)}
				{openEdit && (
					<DialogTitle>
						Update {siteName}-{projectilePointId} Projectile Point
					</DialogTitle>
				)}
				<DialogContent style={{ minHeight: "300px" }}>
					<Grid container spacing={2} sx={{ paddingTop: 0 }}>
						<Grid item xs={6}>
							{/* ------------ Description ------------- */}
							<TextField
								margin="dense"
								id="description"
								label="Description"
								multiline
								rows={4}
								fullWidth
								value={description || ""}
								onChange={handleDescriptionChange}
							/>
							{/* ------------ Upload Photo ------------- */}
							<FormControl sx={{ my: 3.4 }}>
								<FormLabel sx={{ mb: 1.5 }}>
									Upload {photoFilePath && "New"} Photo
								</FormLabel>
								<input type="file" onChange={handlePhotoFilePathChange} />
							</FormControl>
							{/* ------------ Dimensions ------------- */}
							<div>
								<FormLabel id="dimensions-label">Dimensions</FormLabel>
								<Grid
									container
									sx={{
										mt: 1,
										"& .MuiTextField-root": { width: "14.5ch" },
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<Grid item>
										<TextField
											id="lengthdimension"
											label="Length"
											value={length || ""}
											InputProps={{
												endAdornment: (
													<InputAdornment disableTypography position="end">
														mm
													</InputAdornment>
												),
											}}
											error={Boolean(lengthError)}
											helperText={lengthError && "Invalid length"}
											onChange={handleLengthChange}
										/>
									</Grid>
									<Grid item>
										<TextField
											id="widthdimension"
											label="Width"
											value={width || ""}
											InputProps={{
												endAdornment: (
													<InputAdornment disableTypography position="end">
														mm
													</InputAdornment>
												),
											}}
											error={Boolean(widthError)}
											helperText={widthError && "Invalid width"}
											onChange={handleWidthChange}
										/>
									</Grid>
									<Grid item>
										<TextField
											id="heightdimension"
											label="Height"
											value={height || ""}
											InputProps={{
												endAdornment: (
													<InputAdornment disableTypography position="end">
														mm
													</InputAdornment>
												),
											}}
											error={Boolean(heightError)}
											helperText={heightError && "Invalid height"}
											onChange={handleHeightChange}
										/>
									</Grid>
								</Grid>
							</div>
							{/* ------------ Location ------------- */}
							<TextField
								sx={{ mt: 1.5, width: "100%" }}
								margin="dense"
								id="location"
								label="Location"
								fullWidth
								value={location || ""}
								onChange={handleLocationChange}
							/>
							{/* ------------ Artifact Type ------------- */}
							<TextField
								sx={{ mt: 1, width: "100%" }}
								id="artifactTypeID"
								label="Artifact Type"
								variant="outlined"
								fullWidth
								select
								required
								error={Boolean(artifactTypeError)}
								helperText={
									artifactTypeError && "Please select an Artifact Type"
								}
								value={artifactTypeID || ""}
								onChange={handleArtifactTypeChange}
							>
								<MenuItem value="Lithic">Lithic</MenuItem>
								<MenuItem value="Ceramic">Ceramic</MenuItem>
								<MenuItem value="Faunal">Faunal</MenuItem>
							</TextField>
						</Grid>
						<Grid item xs={6}>
							{/* ------------ Start of PeriodModal ------------- */}
							<FormControl sx={{ mt: 1, width: "100%" }}>
								<InputLabel id="period-label">Period</InputLabel>
								<Select
									id="period"
									label="Period"
									labelId="period-label"
									value={selectedPeriod}
									onChange={handlePeriodChange}
									renderValue={(selected) => selected}
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
								</Select>
							</FormControl>
							<Menu
								id="period-menu"
								anchorEl={periodAnchorEl}
								open={Boolean(periodAnchorEl)}
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
							<FormControl sx={{ mt: 1.5, width: "100%" }}>
								<InputLabel id="culture-label">Culture</InputLabel>
								<Select
									id="culture"
									label="Culture"
									labelId="culture-label"
									value={selectedCulture}
									onChange={handleCultureChange}
									renderValue={(selected) => selected}
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
								</Select>
							</FormControl>
							<Menu
								id="culture-menu"
								anchorEl={cultureAanchorEl}
								open={Boolean(cultureAanchorEl)}
								onClose={() => {
									setCultureAnchorEl(null);
								}}
							>
								<MenuItem
									onClick={() => {
										setEditCulture(true);
										setCultureModalOpen(true);
										setCultureAnchorEl(null);
									}}
								>
									<EditIcon fontSize="small" /> Edit
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleDeleteCulture();
										setCultureAnchorEl(null);
									}}
								>
									<DeleteIcon fontSize="small" /> Delete
								</MenuItem>
							</Menu>
							{/* ------------ End of CultureModal  ------------- */}
							{/* ------------ Start of MaterialModal  ------------- */}
							<FormControl sx={{ mt: 1.5, width: "100%" }}>
								<InputLabel id="material-label">Material</InputLabel>
								<Select
									id="material"
									label="Material"
									labelId="material-label"
									value={selectedMaterial}
									onChange={handleMaterialChange}
									renderValue={(selected) => selected}
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
								</Select>
							</FormControl>
							<Menu
								id="material-menu"
								anchorEl={materialAnchorEl}
								open={Boolean(materialAnchorEl)}
								onClose={() => {
									setMaterialAnchorEl(null);
								}}
							>
								<MenuItem
									onClick={() => {
										setEditMaterial(true);
										setMaterialModalOpen(true);
										setMaterialAnchorEl(null);
									}}
								>
									<EditIcon fontSize="small" /> Edit
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleDeleteMaterial();
										setMaterialAnchorEl(null);
									}}
								>
									<DeleteIcon fontSize="small" /> Delete
								</MenuItem>
							</Menu>
							{/* ------------ End of MaterialModal  ------------- */}
							{/* ------------ Start of BaseShapeModal  ------------- */}
							<FormControl sx={{ mt: 1.5, width: "100%" }}>
								<InputLabel id="baseshape-label">Base Shape</InputLabel>
								<Select
									id="baseshape"
									label="Base Shape"
									labelId="baseshape-label"
									value={selectedBaseShape}
									onChange={handleBaseShapeChange}
									renderValue={(selected) => selected}
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
								</Select>
							</FormControl>
							<Menu
								id="base-shape-menu"
								anchorEl={baseShapeAnchorEl}
								open={Boolean(baseShapeAnchorEl)}
								onClose={() => {
									setBaseShapeAnchorEl(null);
								}}
							>
								<MenuItem
									onClick={() => {
										setEditBaseShape(true);
										setBaseShapeModalOpen(true);
										setBaseShapeAnchorEl(null);
									}}
								>
									<EditIcon fontSize="small" /> Edit
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleDeleteBaseShape();
										setBaseShapeAnchorEl(null);
									}}
								>
									<DeleteIcon fontSize="small" /> Delete
								</MenuItem>
							</Menu>
							{/* ------------ End of BaseShapeModal  ------------- */}
							{/* ------------ Start of CrossSectionModal  ------------- */}
							<FormControl sx={{ mt: 1.5, width: "100%" }}>
								<InputLabel id="crosssection-label">Cross Section</InputLabel>
								<Select
									id="crosssection"
									label="Cross Section"
									labelId="crosssection-label"
									value={selectedCrossSection}
									onChange={handleCrossSectionChange}
									renderValue={(selected) => selected}
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
								</Select>
							</FormControl>
							<Menu
								id="cross-section-menu"
								anchorEl={crossSectionAnchorEl}
								open={Boolean(crossSectionAnchorEl)}
								onClose={() => {
									setCrossSectionAnchorEl(null);
								}}
							>
								<MenuItem
									onClick={() => {
										setEditCrossSection(true);
										setCrossSectionModalOpen(true);
										setCrossSectionAnchorEl(null);
									}}
								>
									<EditIcon fontSize="small" /> Edit
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleDeleteCrossSection();
										setCrossSectionAnchorEl(null);
									}}
								>
									<DeleteIcon fontSize="small" /> Delete
								</MenuItem>
							</Menu>
							{/* ------------ End of CrossSectionModal  ------------- */}
							{/* ------------ Start of BladeShapeModal  ------------- */}
							<FormControl sx={{ mt: 1.5, width: "100%" }}>
								<InputLabel id="blaseshape-label">Blade Shape</InputLabel>
								<Select
									id="bladeshape"
									label="Blade Shape"
									labelId="bladeshape-label"
									value={selectedBladeShape}
									onChange={handleBladeShapeChange}
									renderValue={(selected) => selected}
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
								</Select>
							</FormControl>
							<Menu
								id="blade-shape-menu"
								anchorEl={bladeShapeAnchorEl}
								open={Boolean(bladeShapeAnchorEl)}
								onClose={() => {
									setBladeShapeAnchorEl(null);
								}}
							>
								<MenuItem
									onClick={() => {
										setEditBladeShape(true);
										setBladeShapeModalOpen(true);
										setBladeShapeAnchorEl(null);
									}}
								>
									<EditIcon fontSize="small" /> Edit
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleDeleteBladeShape();
										setBladeShapeAnchorEl(null);
									}}
								>
									<DeleteIcon fontSize="small" /> Delete
								</MenuItem>
							</Menu>
							{/* ------------ End of BladeShapeModal  ------------- */}
							{/* ------------ Start of HaftingShapeModal  ------------- */}
							<FormControl sx={{ mt: 1.5, width: "100%" }}>
								<InputLabel id="haftingshape-label">Hafting Shape</InputLabel>
								<Select
									id="haftingshape"
									label="Hafting Shape"
									labelId="haftingshape-label"
									value={selectedHaftingShape}
									onChange={handleHaftingShapeChange}
									renderValue={(selected) => selected}
								>
									{haftingShapes.map((shape) => (
										<MenuItem key={shape.id} value={shape.name}>
											{shape.name}
											<IconButton
												size="small"
												onClick={(event) =>
													handleEditHaftingShape(event, shape)
												}
												style={{ marginLeft: "auto" }}
											>
												<MoreHorizIcon />
											</IconButton>
										</MenuItem>
									))}
									<MenuItem onClick={() => handleOpenHaftingShapeModal()}>
										+ Add New Hafting Shape
									</MenuItem>
								</Select>
							</FormControl>
							<Menu
								id="hafting-shape-menu"
								anchorEl={haftingShapeAnchorEl}
								open={Boolean(haftingShapeAnchorEl)}
								onClose={() => {
									setHaftingShapeAnchorEl(null);
								}}
							>
								<MenuItem
									onClick={() => {
										setEditHaftingShape(true);
										setHaftingShapeModalOpen(true);
										setHaftingShapeAnchorEl(null);
									}}
								>
									<EditIcon fontSize="small" /> Edit
								</MenuItem>
								<MenuItem
									onClick={() => {
										handleDeleteHaftingShape();
										setHaftingShapeAnchorEl(null);
									}}
								>
									<DeleteIcon fontSize="small" /> Delete
								</MenuItem>
							</Menu>
							{/* ------------ End of HaftingShapeModal  ------------- */}
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					{openAdd && (
						<Button onClick={handleSubmit} color="primary">
							Add
						</Button>
					)}
					{openEdit && (
						<Button onClick={handleSubmit} color="primary">
							Save Changes
						</Button>
					)}
				</DialogActions>
			</Dialog>
			{editPeriod && (
				<PeriodModal
					setEditPeriod={setEditPeriod}
					selectedPeriod={editingPeriod.name}
					setSelectedPeriod={setEditingPeriod}
					selectedPeriodID={selectedPeriodID}
					periods={periods}
					setPeriods={setPeriods}
					updatePeriodsList={updatePeriodsList}
					periodModalOpen={periodModalOpen}
					setPeriodModalOpen={setPeriodModalOpen}
					selectedPeriodStartDate={editingPeriod.start}
					selectedPeriodEndDate={editingPeriod.end}
				/>
			)}
			{editCulture && (
				<CultureModal
					setEditCulture={setEditCulture}
					selectedCulture={editingCulture}
					setSelectedCulture={setEditingCulture}
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
					selectedMaterial={editingMaterial}
					setSelectedMaterial={setEditingMaterial}
					selectedMaterialID={selectedMaterialID}
					updateMaterialList={updateMaterialList}
					artifactTypes={artifactTypes}
				/>
			)}
			{editBaseShape && (
				<BaseShapeModal
					setEditBaseShape={setEditBaseShape}
					selectedBaseShape={editingBaseShape}
					setSelectedBaseShape={setEditingBaseShape}
					selectedBaseShapeID={selectedBaseShapeID}
					updateBaseShapesList={updateBaseShapesList}
				/>
			)}
			{editCrossSection && (
				<CrossSectionModal
					setEditCrossSection={setEditCrossSection}
					selectedCrossSection={editingCrossSection} //temp fix
					setSelectedCrossSection={setEditingCrossSection}
					selectedCrossSectionID={selectedCrossSectionID}
					updateCrossSectionsList={updateCrossSectionList}
				/>
			)}
			{editBladeShape && (
				<BladeShapeModal
					setEditBladeShape={setEditBladeShape}
					selectedBladeShape={editingBladeShape}
					setSelectedBladeShape={setEditingBladeShape}
					selectedBladeShapeID={selectedBladeShapeID}
					updateBladeShapesList={updateBladeShapesList}
				/>
			)}
			{editHaftingShape && (
				<HaftingShapeModal
					setEditHaftingShape={setEditHaftingShape}
					selectedHaftingShape={editingHaftingShape}
					setSelectedHaftingShape={setEditingHaftingShape}
					selectedHaftingShapeID={selectedHaftingShapeID}
					updateHaftingShapeList={updateHaftingShapeList}
				/>
			)}
		</>
	);
};

export default AddProjectile;
