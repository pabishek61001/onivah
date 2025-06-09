import React, { useEffect, useState } from 'react';
import { Box, IconButton, Stack, Typography, Tooltip, Select, MenuItem, ListItemIcon, Divider, InputLabel, FormControl, ListItemText } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import EventIcon from '@mui/icons-material/Event';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import BusinessIcon from '@mui/icons-material/Business';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PaletteIcon from '@mui/icons-material/Palette';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from 'react-router-dom';
import { FoodBank } from '@mui/icons-material';

const CategoryMenu = ({ onCategorySelect, defaultCategory }) => {

    const navigate = useNavigate();

    useEffect(() => {
        setselectedCategory(defaultCategory);
    }, [defaultCategory]);

    const [selectedCategory, setselectedCategory] = useState(defaultCategory); // State to store the selected location

    const handleChange = (event) => {
        const category = event.target.value;
        setselectedCategory(category); // Set the selected category
        onCategorySelect(category); // Call the provided function with the new category
    };

    const menuItems = [
        { text: 'wedding_hall', icon: <HomeWorkIcon fontSize="small" /> },
        { text: 'party_hall', icon: <EventIcon fontSize="small" /> },
        { text: 'beach_wedding', icon: <BeachAccessIcon fontSize="small" /> },
        { text: 'farm_land', icon: <AgricultureIcon fontSize="small" /> },
        { text: 'convention_center', icon: <BusinessIcon fontSize="small" /> },
        { text: 'mandabam', icon: <TempleHinduIcon fontSize="small" /> },
        { text: 'photography', icon: <CameraAltIcon fontSize="small" /> },
        { text: 'catering', icon: <FoodBank fontSize="small" /> },
        { text: 'decors', icon: <PaletteIcon fontSize="small" /> },
        { text: 'event_planners', icon: <GroupIcon fontSize="small" /> }
    ];



    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', backgroundColor: "white", borderRadius: 6 }}>
            <FormControl fullWidth variant="outlined" sx={{ borderRadius: '12px' }}>
                <InputLabel>Choose your event</InputLabel>
                <Select
                    label="Choose your event"
                    value={selectedCategory || ''}
                    onChange={handleChange}
                    sx={{
                        borderRadius: 6,

                        '& .MuiSelect-select': {
                            display: 'flex',
                            borderRadius: 6,
                            alignItems: 'center',
                        },
                    }}
                >
                    {menuItems.map((item, index) => (
                        <MenuItem
                            key={index}
                            value={item.text}
                            // onClick={() => navigate(`/service${item.link}`)} // Navigate to /service/menulink
                            sx={{ display: "flex", alignItems: "center", gap: 1 }} // Ensures proper alignment
                        >
                            <ListItemIcon sx={{ minWidth: "30px", color: "primary.main" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())} />

                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CategoryMenu;
