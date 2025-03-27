import React, { useState } from "react";
import { AppBar, Toolbar, Box, Button, IconButton, Slide, useScrollTrigger, Badge, Tooltip } from "@mui/material";
import { FavoriteBorderOutlined, Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";

function HideOnScroll({ children }) {
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const favorites = []; // Replace with actual favorite items

    const handleToggleMenu = () => setOpenMenu(!openMenu);
    const handleSearchBox = () => console.log("Open Search Box");

    return (
        <>
            <HideOnScroll>
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        backgroundColor: "#704d8f",
                        transition: "background-color 0.3s ease",
                    }}
                >
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        {/* Logo */}
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFBCKKoXbIB9s3zg54yK7f9H2-dol0FfULvA&s"
                                alt="ONIVAH Logo"
                                style={{ height: 50, width: "fit-content" }}
                            />
                        </Box>

                        {/* Navigation & Buttons */}
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {/* Book Now Button */}
                            <Button
                                color="inherit"
                                sx={{
                                    backgroundColor: "#a871d9",
                                    color: "white",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    "&:hover": { backgroundColor: "#6d3f96" },
                                }}
                                onClick={handleSearchBox}
                            >
                                Book Now
                            </Button>

                            {/* Favorites Button */}
                            <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
                                <Badge badgeContent={favorites.length} color="error">
                                    <FavoriteBorderOutlined sx={{ color: "white" }} />
                                </Badge>
                            </IconButton>

                            {/* Menu Button */}
                            <Tooltip arrow>
                                <IconButton onClick={handleToggleMenu} size="small" sx={{ color: "white" }}>
                                    {openMenu ? <CloseIcon /> : <MenuIcon />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Box sx={{ height: 10000 }}>

            </Box>
        </>

    );
};

export default Navbar;
