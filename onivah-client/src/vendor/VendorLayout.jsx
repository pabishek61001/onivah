import React, { useState } from 'react';
import {
    Box, Drawer, List, ListItem, ListItemText, IconButton, AppBar, Toolbar,
    Typography, ListItemIcon, ThemeProvider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VenueIcon from '@mui/icons-material/LocationOn';
import ViewIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import { Outlet, Link } from 'react-router-dom';
import theme from '../Themes/theme';

const VendorLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Options for the sidebar
    const menuItems = [
        { text: 'Dashboard', path: '/vendor/:id/dashboard', icon: <DashboardIcon /> },
        { text: 'Add Venue', path: '/vendor/:id/add-venue', icon: <VenueIcon /> },
        { text: 'View Venues', path: '/vendor/:id/view-venues', icon: <ViewIcon /> },
        { text: 'Settings', path: '/vendor/:id/settings', icon: <SettingsIcon /> },
    ];

    // Drawer content
    const drawer = (
        <Box sx={{ overflow: 'auto' }}>
            <List>
                {menuItems.map((item, index) => (
                    <ListItem
                        sx={{ color: "darkcyan" }}
                        button
                        key={index}
                        component={Link}
                        to={item.path}  // Link to the corresponding route
                    >
                        <ListItemIcon sx={{ color: "darkcyan" }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }} >
                {/* AppBar for mobile menu button */}
                < AppBar position="fixed" sx={{ display: { sm: 'none' } }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' }, color: "white" }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Submit Venue
                        </Typography>
                    </Toolbar>
                </AppBar >

                {/* Drawer for sidebar */}
                < Box
                    component="nav"
                    sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
                    aria-label="menu items"
                >
                    {/* Mobile drawer */}
                    < Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,  // Better open performance on mobile
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                        }}
                    >
                        {drawer}
                    </Drawer >

                    {/* Desktop drawer */}
                    < Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer >
                </Box >

                {/* Main content */}
                < Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
                >
                    <Toolbar /> {/* Add Toolbar to push content below AppBar */}

                    {/* Render child components here */}
                    <Outlet /> {/* Outlet will render the nested routes */}
                </Box >
            </Box >
        </ThemeProvider>
    );
}


export default VendorLayout;