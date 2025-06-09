import React, { useState } from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    AppBar,
    Toolbar,
    Typography,
    Box,
    CssBaseline,
    Divider,
    Paper,
    Autocomplete,
    TextField,
    Menu,
    MenuItem
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";

const drawerWidth = 260; // Sidebar width

const navOptions = [
    { text: "Dashboard", path: "/vendor-dashboard" },
    { text: "Orders", path: "/vendor-dashboard/orders" },
    { text: "Manage Gallery", path: "/vendor-dashboard/manage-gallery" },
    { text: "Manage Dates", path: "/vendor-dashboard/available-dates" },
    { text: "Apply for service", path: "/vendor-dashboard/vendor-services" },
    { text: "Settings", path: "/vendor-dashboard/settings" },
    { text: "Log Out", path: "/" },
];

const VendorLayout = ({ vendor }) => {

    const navigate = useNavigate();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // You can handle each action individually
    const handleProfileClick = () => {
        console.log("Go to profile");
        handleMenuClose();
    };

    const handleLogout = () => {
        console.log("Logging out...");
        handleMenuClose();
    };



    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen); // Open/close sidebar for mobile
    };

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen); // Toggle sidebar for larger screens
    };

    const handleNavigation = (path) => {
        if (path === 'Log Out') {
            localStorage.removeItem('vendor_token');
        }
        navigate(path);
        setMobileOpen(false);
    };

    const handleSelect = (event, value) => {
        if (value?.path) {
            navigate(value.path);
        }
    };



    const drawer = (
        <Box sx={{ width: drawerWidth, bgcolor: "#", color: "#fff", height: "100vh", p: 2 }}>
            <Typography variant="h6" sx={{ textAlign: "start", mb: 2, fontWeight: "bold" }}>
                Vendor Panel
            </Typography>
            <Divider sx={{ bgcolor: "#444" }} />
            <List>
                {navOptions.map((item, index) => (
                    <ListItem key={index} onClick={() => handleNavigation(item.path)} sx={{ cursor: "pointer", "&:hover": { bgcolor: "#333" }, borderRadius: 2, my: 1 }}>
                        <ListItemText primary={item.text} sx={{ textAlign: "start" }} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#121212" }}>
            <CssBaseline />

            {/* Sidebar for larger screens (toggleable) */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    width: sidebarOpen ? drawerWidth : 0,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: sidebarOpen ? drawerWidth : 0,
                        transition: "width 0.3s ease-in-out",
                        overflowX: "hidden",
                        bgcolor: "#6D4D94",
                    },
                }}
                open={sidebarOpen}
            >
                {drawer}
            </Drawer>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        bgcolor: "#1E1E2F"
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    overflowX: "hidden", // Prevent overflow
                    width: {
                        xs: "100%",
                        md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
                    },
                    transition: "all 0.3s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <AppBar position="static" sx={{ bgcolor: { xs: "primary", md: "primary" } }}>
                    <Toolbar sx={{ display: "flex", gap: 2, alignItems: "center", }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleSidebarToggle}
                            sx={{ display: { xs: "none", md: "block" } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography
                            variant="h6"
                            sx={{
                                display: { xs: "block", md: sidebarOpen ? "none" : "block" },
                            }}
                        >
                            Vendor Dashboard
                        </Typography>

                        {/* Push remaining items to the right */}
                        <Box sx={{ flexGrow: 1 }} />

                        <Autocomplete
                            options={navOptions}
                            getOptionLabel={(option) => option.text}
                            filterOptions={(options, state) =>
                                state.inputValue === ""
                                    ? []
                                    : options.filter((option) =>
                                        option.text.toLowerCase().includes(state.inputValue.toLowerCase())
                                    )
                            }
                            sx={{
                                width: 250,
                                bgcolor: "#fff",
                                borderRadius: 3,
                                display: { xs: "none", md: "block" },
                            }}
                            value={null}
                            onChange={handleSelect}
                            inputValue={searchInput}
                            onInputChange={(e, value) => setSearchInput(value)}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" size="small" placeholder="Search..." />
                            )}
                        />

                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerToggle}
                            sx={{ display: { xs: "block", md: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleProfileMenuOpen}
                            sx={{ display: { xs: "none", md: "block" }, mt: 1 }}
                        >
                            <AccountCircle fontSize="large" />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={isMenuOpen}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                            <MenuItem onClick={handleProfileClick}>Settings</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>


                    </Toolbar>
                </AppBar>

                <Paper elevation={0} sx={{ p: { xs: 0, md: 1 }, minHeight: "calc(100vh - 64px)", borderRadius: 2, mx: { xs: 0, md: 2 }, mt: 2 }}>
                    <Outlet context={{ vendor }} /> {/* Using context to pass vendor */}
                </Paper>
            </Box>
        </Box>
    );
};

export default VendorLayout;