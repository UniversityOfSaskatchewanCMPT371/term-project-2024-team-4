import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Paper, Typography } from "@mui/material";

// When used this component will allow any file type, it should be modified to only allow images
const FileUpload = () => {
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => {
			setUploadedFiles(acceptedFiles);
			// Call the backend API endpoint here to upload files
		},
	});

	return (
		<Paper
			variant="outlined"
			sx={{
				padding: "20px",
				textAlign: "center",
				cursor: "pointer",
				"&:hover": {
					backgroundColor: "#f5f5f5",
				},
				height: "300px", // Adjust the height here
				width: "500px", // Adjust the width here
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
			{...getRootProps()}
		>
			<input {...getInputProps()} />
			<Typography variant="body1">
				Drag and drop files here or click to browse.
			</Typography>
			<ul>
				{uploadedFiles.map((file) => (
					<li key={file.name}>{file.name}</li>
				))}
			</ul>
		</Paper>
	);
};

export default FileUpload;
