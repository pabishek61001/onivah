import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Select, MenuItem, FormControl, InputLabel, ThemeProvider, Autocomplete, TextField } from '@mui/material';
import theme from '../Themes/theme';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Import your desired icon
import axios from 'axios';

const DestinationMenu = ({ onLocationSelect, defaultLocation }) => {
    const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        setSelectedLocation(defaultLocation);
    }, [defaultLocation]);

    const handleMenuItemClick = (event) => {
        const location = event.target.value;
        setSelectedLocation(location);
        onLocationSelect(location);
    };

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", {
                    country: "India",
                    state: "Tamil Nadu"
                });
                if (response.data && response.data.data) {
                    setMenuItems(response.data.data); // Set districts (cities) of Tamil Nadu
                } else {
                    console.error("No data found for Tamil Nadu");
                }
            } catch (error) {
                console.error("Error fetching Tamil Nadu districts:", error);
            }
        };

        fetchDistricts();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    width: "100%",
                    // backgroundColor: "white",
                    borderRadius: 6,
                    // p: 0.5,
                }}
            >

                <FormControl fullWidth variant="outlined" sx={{ border: "none" }}>
                    <Autocomplete
                        id="location-select"
                        options={menuItems}
                        value={selectedLocation || ''}
                        onChange={(event, newValue) => handleMenuItemClick({ target: { value: newValue } })}
                        renderInput={(params) => (
                            <TextField {...params} label="Choose your location" variant="outlined" />
                        )}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 6,
                            '& .MuiAutocomplete-inputRoot': {
                                borderRadius: 6,
                            },
                        }}
                    />
                </FormControl>


            </Box>
        </ThemeProvider>

    );
};

export default DestinationMenu;
