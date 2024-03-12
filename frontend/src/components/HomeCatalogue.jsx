import React from "react";
import BaseLayout from "./BaseLayout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState, useEffect } from "react";

// this was just for testing purposes
function HomeCatalogue() {
	const [catalogueName, setCatalogueName] = useState("");
	const [catalogueDescription, setCatalogueDescription] = useState("");

	useEffect(() => {
		async function fetchCatalogue() {
			try {
				const response = await axios.get("http://localhost:3000/catalogues/1");
				setCatalogueName(response.data.name);
				setCatalogueDescription(response.data.description);
			} catch (error) {
				console.error("Error fetching catalogue:", error);
				// Handle the error state appropriately
			}
		}

		fetchCatalogue();
	}, []);

	return (
		<BaseLayout>
			<Typography variant="h4">{catalogueName || "Base Catalogue"}</Typography>
			<Typography>{catalogueDescription}</Typography>
			{/* Add your new page content here */}
		</BaseLayout>
	);
}

export default HomeCatalogue;
