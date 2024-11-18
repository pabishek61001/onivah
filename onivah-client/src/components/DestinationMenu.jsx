import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Select, MenuItem, FormControl, InputLabel, ThemeProvider } from '@mui/material';
import theme from '../Themes/theme';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Import your desired icon

const DestinationMenu = ({ onLocationSelect, defaultLocation }) => {
    const [selectedLocation, setSelectedLocation] = useState(defaultLocation);

    useEffect(() => {
        setSelectedLocation(defaultLocation);
    }, [defaultLocation]);

    const handleMenuItemClick = (event) => {
        const location = event.target.value;
        setSelectedLocation(location);
        onLocationSelect(location);
    };

    const menuItems = [
        'Chennai',
        'Coimbatore',
        'Madurai',
        'Tiruchirappalli',
        'Salem',
        'Erode',
        'Tirunelveli',
        'Thoothukudi',
        'Vellore',
        'Kanchipuram',
        'Thanjavur',
        'Dindigul',
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                display: 'flex', alignItems: 'center', textAlign: 'center', width: '100%', backgroundColor: "white", borderRadius: 2, p: 0.5
            }}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="location-select-label">Choose your location</InputLabel>
                    <Select
                        labelId="location-select-label"
                        id="location-select"
                        value={selectedLocation || ''}
                        onChange={handleMenuItemClick}
                        label="Choose your location"
                        sx={{
                            '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                            },
                        }}

                    >
                        {menuItems.map((location, index) => (
                            <MenuItem key={index} value={location}>
                                {location}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </ThemeProvider>
    );
};

export default DestinationMenu;
