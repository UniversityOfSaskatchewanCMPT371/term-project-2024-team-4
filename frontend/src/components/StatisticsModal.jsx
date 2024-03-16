import log from "../logger.js";
import { useState, useEffect } from "react";
import axios from "axios";

import { PieChart } from "@mui/x-charts/PieChart";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

//eslint-disable-next-line react/prop-types
function StatisticsModal({ modalOpen, closeModal }) {
	const [stats, setStats] = useState({});

	useEffect(() => {
		/**
		 * Gets statistics from aggregateStatisticsController.js and places in the state for the component
		 */
		async function statsGetter() {
			try {
				const response = await axios.get(
					"http://localhost:3000/aggregateStatisticsGenerators/catalogue/1",
				);
				log.debug("Response data before setStats(): " + response.data);
				setStats(response.data);
				log.debug(
					"stats variable after setState(response.data) is called: " + stats,
				);
			} catch (error) {
				log.error("Error fetching statistics: ", error);
			}
		}
		statsGetter();
	}, [stats]);

	return (
		<>
			<Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="lg">
				<DialogTitle>Statistics</DialogTitle>
				<DialogContent style={{ height: "800px" }}>
					<Grid container spacing={1}>
						<Grid item xs={6}>
							<Box height={730} sx={{ border: "1px solid black" }}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Material Statistics
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={6}>
							<Box height={730} sx={{ border: "1px solid black" }}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Point Statistics
									<PieChart
										series={[
											{
												//TODO: Make this so that it grabs all of the points and makes a section for all of them

												//TODO: Add more pie charts for different things (cultures, dimensions, sites point numbers, etc.)
												data: [
													{
														id: 1,
														value:
															stats?.["Projectile Data"]?.["Projectile Count"],
														label: "point2",
													},
												],
											},
										]}
										width={400}
										height={200}
									/>
								</Typography>
							</Box>
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
