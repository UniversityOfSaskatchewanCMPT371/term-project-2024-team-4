import { useState, useEffect } from "react";
import http from "../../http.js";
import ProjectileModal from "./ProjectileModal";
import Projectile from "./Projectile";
import log from "../logger.js";
import {
	styled,
	Grid,
	Card,
	CardContent,
	ButtonBase,
	Typography,
	Box,
	Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

import { sortData } from "../sortUtils.js";
/**
 * Create styled Item component, based on Paper MUI component
 */
const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
	minHeight: "700px !important",
}));

/**
 * Displays all projectiles for a selected site
 * @param {string} query projectile name for searching
 * @param {integer} siteId ID of site to view projectiles
 * @pre Site should exist in database
 * @post Renders projectile points cards
 * @returns {JSX.Element} ProjectileList React component
 */
// eslint-disable-next-line react/prop-types
export default function ProjectileList({ query, siteId, siteName, sortValue }) {
	const [openAdd, setOpenAdd] = useState(false);
	const [openView, setOpenView] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [projectilePointId, setProjectilePointId] = useState(0);
	const [data, setData] = useState([]);
	const { user } = useContext(UserContext);
	/**
	 * Toggle add projectile modal visibility to true
	 */
	const handleClick1 = () => {
		setOpenAdd(true);
		log.info("Add card clicked!");
	};

	/**
	 * Toggle view projectile modal visibility to true
	 */
	const handleClick2 = (item) => () => {
		setProjectilePointId(item.id);
		setOpenView(true);
		log.info("Card clicked! ID:", item.id);
	};

	/**
	 * Fetch and update projectile points list/cards with latest list of projectile points
	 * every state change of add the edit proejctile point modals
	 */
	useEffect(() => {
		async function fetchprojectilePoints() {
			try {
				const response = await http.get("/projectilePoints");
				log.info("Projectile points: ", response.data);

				// Sort JSON
				const sortedData = sortData(response.data, sortValue);
				setData(sortedData);
			} catch (error) {
				log.error("Error fetching projectile points:", error);
			}
		}

		fetchprojectilePoints();
	}, [openAdd, openView, sortValue]);

	// Filter projectile points to current selected site
	const siteData = data?.filter((item) => item.site.id == siteId);

	// Filter data based on search query (mock)
	const filteredData = siteData?.filter((item) =>
		// eslint-disable-next-line react/prop-types
		item.name.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div>
			<Item variant="outlined" sx={{ mb: "40px" }}>
				<Grid style={{ padding: 30 }}>
					<Box display="flex">
						<Grid container spacing={5}>
							{user && (
								<Grid item xs={12} sm={6} md={3}>
									<ButtonBase onClick={handleClick1}>
										<Card
											sx={{
												minWidth: "12rem",
												minHeight: "12rem",
												alignContent: "center",
											}}
										>
											<CardContent style={{ textAlign: "center" }}>
												<AddIcon style={{ fontSize: 80, color: "lightgrey" }} />
												<Typography variant="body2">
													Add Projectile Point
												</Typography>
												{/*<CreateArtifact style={{ fontSize: 80, color: "lightgrey" }} />*/}
											</CardContent>
										</Card>
									</ButtonBase>
								</Grid>
							)}
							{filteredData &&
								filteredData.map((item) => (
									<Grid item xl={2} key={item.id}>
										{/*This section is for displaying all the found artifacts*/}
										<ButtonBase onClick={handleClick2(item)}>
											<Card
												sx={{
													minWidth: "12rem",
													minHeight: "12rem",
													alignContent: "center",
												}}
											>
												<CardContent>
													<Typography variant="h5" component="h3">
														{siteName + "-" + item.id}
													</Typography>
													<Typography variant="body2" component="p">
														{/* Limit description characters to prevent text overflow */}
														{item.description.length <= 15
															? item.description
															: item.description.substr(0, 15) + "..."}
													</Typography>
												</CardContent>
											</Card>
										</ButtonBase>
									</Grid>
								))}
						</Grid>
					</Box>
				</Grid>
			</Item>
			<div>
				{openAdd && (
					<ProjectileModal openAdd={openAdd} setOpenAdd={setOpenAdd} />
				)}
			</div>
			<div>
				{openView && (
					<Projectile
						setOpenView={setOpenView}
						setOpenEdit={setOpenEdit}
						projectilePointId={projectilePointId}
						siteName={siteName}
					/>
				)}
			</div>
			<div>
				{openEdit && (
					<ProjectileModal
						setOpenView={setOpenView}
						openEdit={openEdit}
						setOpenEdit={setOpenEdit}
						projectilePointId={projectilePointId}
					/>
				)}
			</div>
		</div>
	);
}
