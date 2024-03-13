/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ProjectileModal from "./ProjectileModal";
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

export default function ProjectileList({ query, siteId }) {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState([]);

	const inComingSiteInfo = useLocation();

	// the action to take when the new site button is pressed
	const handleClick1 = () => {
		setOpen(true);
		console.log("Add card clicked!");
	};

	const handleClick2 = (item) => () => {
		// event handler
		console.log("Card clicked! ID:", item.id);

		//Site.refreshPage(); // Tell the Catalogue1 to refresh
	};

	useEffect(() => {
		// Fetch data from JSON server on component mount
		fetch("http://localhost:3000/projectilePoints")
			.then((response) => response.json())
			.then((json) => setData(json))
			.catch((error) => console.error("Error fetching data:", error));
	}, [open]);

	const siteData = data?.filter((item) => item.site.id == siteId);

	//Filter data based on search query (mock)
	const filteredData = siteData?.filter((item) =>
		item.name.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div>
			<Grid maxWidth="md" style={{ marginTop: 20, marginLeft: -10 }}>
				<Box display="flex">
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={3}>
							<ButtonBase onClick={handleClick1}>
								<Card>
									<CardContent style={{ textAlign: "center" }}>
										<AddIcon style={{ fontSize: 80, color: "lightgrey" }} />
										{/*<CreateArtifact style={{ fontSize: 80, color: "lightgrey" }} />*/}
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
											<Typography variant="h5" component="h3">
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
			<Typography>{open && <ProjectileModal setOpen={setOpen} />}</Typography>
		</div>
	);
}

//
