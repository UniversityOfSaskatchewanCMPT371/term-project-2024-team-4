import logger from "../logger.js";

// import { BarChart } from "@mui/x-charts/BarChart";
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
