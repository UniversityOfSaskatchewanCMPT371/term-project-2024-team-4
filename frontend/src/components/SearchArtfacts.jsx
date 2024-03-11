/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Site from "./Site";
import AddProjectile from "./AddProjectile";
import { useState, useEffect } from "react";
import {
	Grid,
	Card,
	CardContent,
	ButtonBase,
	Typography,
	Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLocation } from "react-router-dom";

export default function SearchResult(query) {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState([]);
	const inComingSiteInfo = useLocation();
	//Used for opening the create new artifact page
	const createArtifactClick = () => {
	  setOpen(true);
	  console.info("Create Artifact button clicked!");
	};

	const handleClick2 = (id) => () => {
		// event handler
		console.log("Card clicked! ID:", id);
		Site.refreshPage(); // Tell the Site page to refresh
	};

	useEffect(() => {
		// Fetch data from JSON server on component mount

		//console.log("Fetching data from JSON server" + fetch("http://localhost:3000/artifacts")!=null); //debugging, should be removed 

		fetch("http://localhost:3000/artifacts")
			.then((response) => response.json())
			.then((json) => setData(json))
			.catch((error) => console.error("Error fetching data:", error));
;
	}, []);

	//Filter data based on search query (mock)
	const filteredData = data?.filter((item) =>
		item.name.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div>
			<Grid maxWidth="md" style={{ marginTop: 20, marginLeft: -10 }}>
				<Box display="flex">
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={3}>
							{/*This Button is for the creation of new artifacts*/}
							<ButtonBase onClick={createArtifactClick}>
								<Card>
									<CardContent style={{ textAlign: "center" }}>
										<AddIcon style={{fontSize: 80, color:"lightgrey"}}/>
										{/*<AddProjectile style={{ fontSize: 80, color: "lightgrey" }} />*/}
									</CardContent>
								</Card>
							</ButtonBase>
						</Grid>
						{filteredData &&
							filteredData.map((item) => (
								<Grid item xs={12} sm={6} md={3} key={item.id}>
									{/*This section is for displaying all the found artifacts*/}
									<Card onClick={handleClick2(item.id)}>
										<CardContent>
											<Typography variant="h5" component="div">
												{item.name}
											</Typography>
											<Typography variant="body2" component="p">
												{item.description}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							))}
					</Grid>
				</Box>
			</Grid>
			<Typography>{open && <AddProjectile setOpen={setOpen} />}</Typography>
		</div>
	);
}


// 
