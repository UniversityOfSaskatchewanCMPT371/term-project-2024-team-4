import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import Sidebar from "./Sidebar";
import FileUpload from "./UploadPicture";

export default function AddProjectile() {
	// handle add new material
	const handleAddNewMaterial = () => {};

	// handle add new period
	const handleAddNewPeriod = () => {};

	// handle add new dimension
	const handleAddNewDimension = () => {};

	// handle add new location
	const handleAddNewLocation = () => {};

	// handle add new culture
	const handleAddNewCulture = () => {};

	return (
		<Box container spacing={5} style={{ marginLeft: 300, marginTop: 2 }}>
			<Sidebar />

			<Grid container spacing={5} marginTop={5}>
				<Grid>
					<Grid item marginBottom={3}>
						<FileUpload />
					</Grid>
					<Grid item marginBottom={5}>
						<TextField
							id="description"
							label="Description"
							variant="outlined"
							multiline
							rows={10}
							fullWidth // Ensure TextField takes full width of the grid item
						/>
					</Grid>
				</Grid>

				<Grid item xs={12} sm={6}>
					<Box marginBottom={10} width={350}>
						<TextField
							id="period"
							label="Period"
							variant="outlined"
							fullWidth
							select
							size="small"
						>
							<MenuItem value="period1">Period 1</MenuItem>
							<MenuItem value="period2">Period 2</MenuItem>
							<MenuItem>
								<IconButton
									aria-label="more"
									aria-controls="edit-menu"
									aria-haspopup="true"
									onClick={handleAddNewPeriod}
									style={{ marginLeft: "0", fontSize: "12pt" }}
								>
									+ Add more
								</IconButton>
							</MenuItem>
							{/* Add map call back function to get all items from database*/}
						</TextField>
					</Box>
					<Box marginBottom={10} width={350}>
						<TextField
							id="material"
							label="Material"
							variant="outlined"
							fullWidth
							select
							size="small"
						>
							{/* Add map call back function to get all items from database*/}
							<MenuItem value="material1">Material 1</MenuItem>
							<MenuItem value="material2">Material 2</MenuItem>
							<MenuItem>
								<IconButton
									aria-label="more"
									aria-controls="edit-menu"
									aria-haspopup="true"
									onClick={handleAddNewMaterial}
									style={{ marginLeft: "0", fontSize: "12pt" }}
								>
									+ Add more
								</IconButton>
							</MenuItem>
						</TextField>
					</Box>
					<Box marginBottom={10} width={350}>
						<TextField
							id="dimensions"
							label="Dimensions"
							variant="outlined"
							fullWidth
							select
							size="small"
						>
							{/* Add map call back function to get all items from database*/}
							<MenuItem value="dimension1">Dimension 1</MenuItem>
							<MenuItem value="dimension2">Dimension 2</MenuItem>
							<MenuItem>
								<IconButton
									aria-label="more"
									aria-controls="edit-menu"
									aria-haspopup="true"
									onClick={handleAddNewDimension}
									style={{ marginLeft: "0", fontSize: "12pt" }}
								>
									+ Add more
								</IconButton>
							</MenuItem>
						</TextField>
					</Box>
					<Box marginBottom={10} width={350}>
						<TextField
							id="location-found"
							label="Location Found"
							variant="outlined"
							fullWidth
							select
							size="small"
						>
							{/* Add map call back function to get all items from database*/}
							<MenuItem value="location1">Location 1</MenuItem>
							<MenuItem value="location2">location 2</MenuItem>
							<MenuItem>
								<IconButton
									aria-label="more"
									aria-controls="edit-menu"
									aria-haspopup="true"
									onClick={handleAddNewLocation}
									style={{ marginLeft: "0", fontSize: "12pt" }}
								>
									+ Add more
								</IconButton>
							</MenuItem>
						</TextField>
					</Box>
					<Box marginBottom={10} width={350}>
						<TextField
							id="culture"
							label="Culture"
							variant="outlined"
							fullWidth
							select
							size="small"
						>
							{/* Add map call back function to get all items from database*/}
							<MenuItem value="culture1">Culture 1</MenuItem>
							<MenuItem value="culture2">Culture 2</MenuItem>
							<MenuItem>
								<IconButton
									aria-label="more"
									aria-controls="edit-menu"
									aria-haspopup="true"
									onClick={handleAddNewCulture}
									style={{ marginLeft: "0", fontSize: "12pt" }}
								>
									+ Add more
								</IconButton>
							</MenuItem>
						</TextField>
					</Box>
				</Grid>
			</Grid>

			<Grid item xs={12}>
				<Button variant="contained" color="primary" sx={{ marginRight: 2 }}>
					Submit
				</Button>
				<Button variant="contained" color="secondary">
					Cancel
				</Button>
			</Grid>
		</Box>
	);
}
