import log from "../logger.js";
import { useState, useEffect } from "react";
import http from "../../http.js";

import { PieChart } from "@mui/x-charts/PieChart";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Stack } from "@mui/system";

//eslint-disable-next-line react/prop-types
function StatisticsModal({ modalOpen, closeModal }) {
	// const [stats, setStats] = useState({});
	// const [siteStatistics, setSiteStatistics] = useState({});
	const [sites, setSites] = useState({});
	const [sitePointCount, setSitePointCount] = useState({});
	const [catalogueMaterialPercentages, setCatalogueMaterialPercentages] =
		useState({});

	useEffect(() => {
		/**
		 * Gets statistics from aggregateStatisticsController.js and places in the state for the component
		 */

		http
			.get("/aggregateStatisticsGenerators/catalogue/1")
			.then((response) => {
				const catalogueStatistics = response.data;
				let catalogueMaterialPercentagesStorage = new Array();
				let count = 0;
				for (const [key, value] of Object.entries(
					catalogueStatistics["Material Data"]["Material Percentages"],
				)) {
					log.info("SM 40 Percentage: " + value);
					log.info("SM 41 Percentage: " + key);
					const newDataPoint = {
						id: count,
						value: value,
						label: key,
					};
					count++;
					catalogueMaterialPercentagesStorage.push(newDataPoint);
				}
				setCatalogueMaterialPercentages(catalogueMaterialPercentagesStorage);
			})
			.catch((error) => {
				log.error("Error fetching site statistics:", error);
			});

		http
			.get("/sites")
			.then((response) => {
				const sitesResponse = response.data;
				setSites(sitesResponse);
				let sitePointCounts = new Array();
				sites.forEach((currentSite) => {
					const newDataPoint = {
						id: currentSite.id,
						value: currentSite.artifacts.length,
						label: currentSite.name,
					};
					sitePointCounts.push(newDataPoint);
				});
				setSitePointCount(sitePointCounts);
			})
			.catch((error) => {
				log.error("Error fetching all sites.", error);
			});
	}, [catalogueMaterialPercentages, sites]);

	return (
		<>
			<Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="lg">
				<DialogTitle>Catalogue Statistics</DialogTitle>
				<DialogContent style={{ height: "800px" }}>
					<Grid container spacing={1}>
						<Grid item xs={6}>
							{catalogueMaterialPercentages.length > 0 ? (
								<Stack
									direction="column"
									width="100%"
									textAlign="center"
									spacing={2}
								>
									<Box alignItems="center">
										<Typography
											id="modal-modal-title"
											variant="h6"
											component="h2"
										>
											Material Percentage by Catalogue
											<PieChart
												series={[
													{
														data: catalogueMaterialPercentages,
														highlightScope: {
															faded: "global",
															highlighted: "item",
														},
														faded: {
															innerRadius: 30,
															additionalRadius: -30,
															color: "grey",
														},
													},
												]}
												width={400}
												height={200}
											/>
										</Typography>
									</Box>
									<Box alignItems="center">
										<Typography
											id="modal-modal-title"
											variant="h6"
											component="h2"
										>
											Point Count by Site
											<PieChart
												series={[
													{
														data: sitePointCount,
														highlightScope: {
															faded: "global",
															highlighted: "item",
														},
														faded: {
															innerRadius: 30,
															additionalRadius: -30,
															color: "grey",
														},
													},
												]}
												width={400}
												height={200}
											/>
										</Typography>
									</Box>
								</Stack>
							) : (
								<Typography>Loading</Typography>
							)}
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={closeModal}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default StatisticsModal;
