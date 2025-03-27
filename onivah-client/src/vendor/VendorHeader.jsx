import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Box,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";

const VendorHeader = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const menuItems = [
        { label: "Take a Tour", action: () => alert("Take a Tour") },
        { label: "Add Your Services", action: () => alert("Add Your Services") },
        { label: "Manage Services", action: () => alert("Manage Services") },
        { label: "View Bookings", action: () => alert("View Bookings") },
    ];

    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/014/321/611/non_2x/abstract-star-law-logo-designs-law-white-star-logo-vector.jpg" // Replace with your actual image path
                        alt="Logo"
                        style={{ width: "100px", height: "auto" }}
                    />
                </Box>

                {isMobile ? (
                    <>
                        <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>

                        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                            <Box
                                sx={{ width: 250 }}
                                role="presentation"
                                onClick={toggleDrawer(false)}
                                onKeyDown={toggleDrawer(false)}
                            >
                                <Box sx={{ flexGrow: 1 }}>
                                    <img
                                        src="https://static.vecteezy.com/system/resources/previews/014/321/611/non_2x/abstract-star-law-logo-designs-law-white-star-logo-vector.jpg" // Replace with your actual image path
                                        alt="Logo"
                                        style={{ width: "250px", height: "100px" }}
                                    />
                                </Box>
                                <List>
                                    {menuItems.map((item, index) => (
                                        <ListItem key={index} onClick={item.action}>
                                            <ListItemText primary={item.label} />
                                        </ListItem>
                                    ))}
                                </List>

                                {/* Profile and Logout options */}
                                <List>
                                    <ListItem onClick={handleMenuClick}>
                                        <ListItemText primary="Profile" />
                                    </ListItem>
                                    <ListItem onClick={() => alert("Logout")}>
                                        <ListItemText primary="Logout" />
                                    </ListItem>
                                </List>
                            </Box>
                        </Drawer>
                    </>
                ) : (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {menuItems.map((item, index) => (
                            <Button
                                key={index}
                                color="inherit"
                                onClick={item.action}
                            >
                                {item.label}
                            </Button>
                        ))}

                        {/* Account Circle Icon for Profile Menu */}
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton color="inherit" onClick={handleMenuClick}>
                                <AccountCircleIcon sx={{ fontSize: 28 }} />
                            </IconButton>

                            {/* Profile Menu */}
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                PaperProps={{
                                    sx: {
                                        borderRadius: "8px", // Rounded corners
                                        boxShadow: theme.shadows[3], // Subtle shadow
                                        width: 200, // Adjust width if needed
                                    },
                                }}
                            >
                                {/* Title */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        padding: "8px 16px",
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                    }}
                                >
                                    Settings
                                </Typography>
                                <Divider sx={{ margin: "0" }} />
                                {/* Menu Items */}
                                <MenuItem
                                    onClick={() => alert("Go to Profile")}
                                    sx={{
                                        padding: "10px 20px",
                                        "&:hover": {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    }}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    onClick={() => alert("Logout")}
                                    sx={{
                                        padding: "10px 20px",
                                        "&:hover": {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default VendorHeader;
