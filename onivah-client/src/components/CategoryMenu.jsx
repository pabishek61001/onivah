import React, { useEffect, useState } from 'react';
import { Box, IconButton, Stack, Typography, Tooltip, Select, MenuItem, ListItemIcon, Divider, InputLabel, FormControl } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';

const CategoryMenu = ({ onCategorySelect, defaultCategory }) => {
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
        { text: 'Wedding Hall', icon: null },
        { text: 'Party Hall', icon: null },
    ];

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', backgroundColor: "white", p: 0.5, borderRadius: 2 }}>
            <FormControl fullWidth variant="outlined" sx={{ borderRadius: '12px' }}>
                <InputLabel>Choose your event</InputLabel>
                <Select
                    label="Choose your event"
                    value={selectedCategory || ''}
                    onChange={handleChange}
                    sx={{
                        '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'center',
                        },
                    }}
                >
                    {menuItems.map((item, index) => (
                        <MenuItem key={index} value={item.text}>
                            {item.text}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CategoryMenu;
