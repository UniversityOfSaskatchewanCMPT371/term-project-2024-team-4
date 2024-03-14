import log from "../logger.js";
import { useState, useEffect } from "react";
import axios from "axios";

import { PieChart } from "@mui/x-charts/PieChart";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

//eslint-disable-next-line react/prop-types
function StatisticsModal({ modalOpen, closeModal }) {
	const [stats, setStats] = useState([]);

	useEffect(() => {
		async function statsGetter() {
			try {
				const response = await axios.get(
					"http://localhost:3000/aggregateStatisticsGenerators/catalogue/1",
				);
				setStats(response.data);
				log.info(stats);
				console.log(stats);
			} catch (error) {
				log.error("Error fetching statistics: ", error);
			}
		}
		statsGetter();
	}, [open]);

	return (
		<>
			<Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="lx">
				<DialogTitle>Statistics</DialogTitle>
				<DialogContent style={{ height: "800px" }}>
					<Grid container spacing={1}>
						<Grid item xs={6}>
							<Box height={730} sx={{ border: "2px solid black" }}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Material Statistics
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={6}>
							<Box height={730} sx={{ border: "2px solid black" }}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Point Statistics
									<PieChart
										series={[
											{
												data: [
													{
														id: stats
															.get("materialDataMap")
															.get("Material Types")[0],
														value: stats
															.get("materialDataMap")
															.get("Projectile Percentages")[0],
														label: stats
															.get("materialDataMap")
															.get("Material Types")[0],
													},
												],
											},
										]}
									/>
								</Typography>
								<PieChart
									series={[
										{
											data: [
												{ id: 0, value: 10, label: "AAAAA" },
												{ id: 1, value: 15, label: "Kill me" },
												{ id: 2, value: 20, label: "Yes" },
											],
										},
									]}
									width={400}
									height={200}
								/>
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
