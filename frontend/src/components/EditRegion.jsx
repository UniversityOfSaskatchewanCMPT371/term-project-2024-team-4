import { TextField, Button, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function EditRegion({
  setEditRegion,
  selectedRegion,
  selectedDescription,
  setOpen1,
}) {
  const [open, setOpen] = useState(true); // State to manage the dialog open/close
  const [name, setName] = useState(selectedRegion); // Initialize name state with selectedRegion
  const [description, setDescription] = useState(selectedDescription); // Initialize description state with selectedDescription

  const handleSave = () => {
    const updatedRegion = {
      name,
      description,
    };

    if (selectedRegion) {
      axios
        .put(`http://localhost:8000/regions/${selectedRegion}`, updatedRegion)
        .then((response) => {
          console.log("Region updated successfully:", response.data);
          setOpen1(true);
        })
        .catch((error) => {
          console.error("Error updating region:", error);
        });
    }

    setOpen(false); // Close the dialog
    setEditRegion(false);

    if (!selectedRegion) {
      axios
        .post("http://localhost:8000/regions", updatedRegion)
        .then((response) => {
          console.log("Region created successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error updating region:", error);
        });
    }
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
    setEditRegion(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <TextField
            id="name"
            label="Region"
            variant="outlined"
            fullWidth
            value={name} // Use value instead of defaultValue
            onChange={(e) => setName(e.target.value)} // Handle change in name field
            style={{ marginBottom: "15px" }}
          />
          <br />
          <TextField
            id="description"
            label="Description"
            multiline
            minRows={4}
            maxRows={10}
            variant="outlined"
            fullWidth
            value={description} // Use value instead of defaultValue
            onChange={(e) => setDescription(e.target.value)} // Handle change in description field
            style={{ marginBottom: "15px" }}
          />
          <br />
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
