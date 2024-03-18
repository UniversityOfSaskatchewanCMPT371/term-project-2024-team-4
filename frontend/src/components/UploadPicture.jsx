import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Paper, Typography } from "@mui/material";

/**
 * FileUpload functional component for handling file uploads through a drag-and-drop interface.
 *
 * @pre None
 * @post Renders a dropzone area where users can drag and drop files or click to browse and select files.
 *       The component is configured to accept any file types by default but should be restricted to images for practical uses.
 * @returns {JSX.Element} The rendered dropzone component.
 */
const FileUpload = () => {
	const [uploadedFiles, setUploadedFiles] = useState([]);

	// Configuring the dropzone hook
	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => {
			setUploadedFiles(acceptedFiles);
			// This is where you could integrate a backend API call to upload the accepted files
			// NOTE: As of now, no backend upload functionality is implemented here.
		},
		// TODO: Modify this to restrict to image files only (e.g., accept: 'image/*')
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
				height: "300px",
				width: "500px",
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
