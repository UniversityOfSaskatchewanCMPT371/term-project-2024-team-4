import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  ButtonBase,
  Typography,
  Box,
} from "@mui/material";


export default function SearchResult({ query }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  // const handleClick1 = () => {
  //   setOpen(true);
  //   console.log("Add card clicked!");
  // };

 
  const handleClick2 = (id) => () => {
    // event handler
    console.log("Card clicked! ID:", id);
  };

  useEffect(() => {
    // Fetch data from JSON server on component mount
    fetch("http://localhost:3000/artifacts")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  //Filter data based on search query (mock)
  const filteredData = data?.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return (
    <div>
      <Grid maxWidth="md" style={{ marginTop: 20, marginLeft: -10 }}>
        <Box display="flex">
          <Grid container spacing={2}>
          
            {filteredData &&
              filteredData.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.id}>
                  <ButtonBase onClick={handleClick2(item.id)}>
             
                    <Card>
                      <CardContent>
                        <Typography variant="h5" component="h3">
                          {item.name}
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                          {item.location}
                        </Typography>
                        <Typography variant="body2" component="p">
                          {item.id}
                        </Typography>
                      </CardContent>
                    </Card>
                   
                  </ButtonBase>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Grid>

    </div>
  );
}
