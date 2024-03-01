import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Sidebar from "./Sidebar";
import FileUpload from "./UploadPicture";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AddProjectile(props) {
    const [siteID, setSiteID] = useState(0);
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [dimension, setDimension] = useState("");
    const [location, setLocation] = useState("");
    const [selectedType, setSelectedType] = useState("");
    

    const locationx = useLocation();
    const {some} = locationx.state;
    console.log(some.id);


    useEffect(() => {
        console.log(dimension);
        console.log(name);
        console.log(location);
        console.log(selectedType);
        setSiteID(some.id);
    }, [dimension,name,location,selectedType]);
   
    
    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleDimensionChange = (event) => {
        setDimension(event.target.value);
        console.log(dimension)

    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = () => {

        const newArtifacts = {
            name,
            location,
            description,
            dimensions: dimension,
            photo:"photo1",
            siteId: siteID,
            artifactTypeId: selectedType,
        };

        axios
            .post("http://localhost:3000/artifacts", newArtifacts)
            .then((response) => {
                console.log("New artifacts added successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error adding new site:", error);
            });


    };

    
    return (
        <Box container spacing={5} style={{ marginLeft: 300, marginTop: 2 }}>
            <h1>{some.name}</h1>
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
                            fullWidth
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box marginBottom={10} width={350}>
                        <TextField
                            margin="dense"
                            id="name"
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Box>
                    <Box marginBottom={10} width={350}>
                        <TextField
                            margin="dense"
                            id="location"
                            label="Location"
                            fullWidth
                            value={location}
                            onChange={handleLocationChange}
                        />
                    </Box>
                    <Box marginBottom={10} width={350}>
                        <TextField
                            margin="dense"
                            id="dimension"
                            label="Dimension"
                            fullWidth
                            value={dimension}
                            onChange={handleDimensionChange}
                        />
                    </Box>
                    <Box marginBottom={10} width={350}>
                        <TextField
                            id="artifactTypeID"
                            label="ArtifactTypeID"
                            variant="outlined"
                            fullWidth
                            select
                            size="small"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <MenuItem value="Lithic">Lithic</MenuItem>
                            <MenuItem value="Ceramic">Ceramic</MenuItem>
                            <MenuItem value="Faunal">Faunal</MenuItem>

                        </TextField>
                    </Box>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Button variant="contained" color="primary" sx={{ marginRight: 2 }} onClick={handleSubmit}>
                    
               
                    <Link to="/sites">Submit</Link> 

                </Button>
                <Button variant="contained" color="secondary">
                    <Link to="/sites">Cancel</Link>
                </Button>
            </Grid>
        </Box>
    );
}

