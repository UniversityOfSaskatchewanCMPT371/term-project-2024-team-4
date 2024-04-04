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
/**
 * Create styled Item component, based on Paper MUI component
 */
const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
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
export default function ProjectileList({ query, siteId }) {
	const [openAdd, setOpenAdd] = useState(false);
	const [openView, setOpenView] = useState(false);
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

	useEffect(() => {
		async function fetchprojectilePoints() {
			try {
				const response = await http.get("/projectilePoints");
				log.info("Projectile points: ", response.data);
				setData(response.data);
			} catch (error) {
				log.error("Error fetching projectile points:", error);
			}
		}

		fetchprojectilePoints();
	}, [openAdd]);

	// Filter projectile points to current selected site
	const siteData = data?.filter((item) => item.site.id == siteId);

	// Filter data based on search query (mock)
	const filteredData = siteData?.filter((item) =>
		// eslint-disable-next-line react/prop-types
		item.name.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div>
			<Item variant="outlined" sx={{ mt: "40px", minHeight: "500px" }}>
				<Grid maxWidth="md" style={{ padding: 30 }}>
					<Box display="flex">
						<Grid container spacing={5}>
							{user && (
								<Grid item xs={12} sm={6} md={3}>
									<ButtonBase onClick={handleClick1}>
										<Card sx={{ minWidth: 170, minHeight: 150 }}>
											<CardContent style={{ textAlign: "center" }}>
												<AddIcon style={{ fontSize: 80, color: "lightgrey" }} />
												{/*<CreateArtifact style={{ fontSize: 80, color: "lightgrey" }} />*/}
											</CardContent>
										</Card>
									</ButtonBase>
								</Grid>
							)}
							{filteredData &&
								filteredData.map((item) => (
									<Grid item xs={12} sm={6} md={3} key={item.id}>
										{/*This section is for displaying all the found artifacts*/}
										<ButtonBase onClick={handleClick2(item)}>
											<Card sx={{ minWidth: 170, minHeight: 150 }}>
												<CardContent>
													<Typography variant="h5" component="h3">
														{item.name}
													</Typography>
													<Typography variant="body2" component="p">
														{item.description}
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
			<Typography>
				{openAdd && <ProjectileModal setOpenAdd={setOpenAdd} />}
			</Typography>
			<Typography>
				{openView && (
					<Projectile
						setOpen={setOpenView}
						projectilePointId={projectilePointId}
					/>
				)}
			</Typography>
		</div>
	);
}
