import React from "react";
import BaseLayout from "./BaseLayout";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// this was just for testing purposes
function NewPage() {
	return (
		<BaseLayout>
			<Typography variant="h4">New Page Title</Typography>
			{/* Add your new page content here */}
		</BaseLayout>
	);
}

export default NewPage;
