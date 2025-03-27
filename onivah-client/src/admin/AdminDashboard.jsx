import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    CssBaseline,
    useMediaQuery,
    Collapse,
    Grid,
    Card,
    Avatar,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Settings as SettingsIcon,
    Inbox,
    RequestPage,
    Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon,
    Email,
    ExpandLess,
    ExpandMore,
    Inventory,
    PendingActions,
    CheckCircle,
    People,
    Cancel,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Outlet, useNavigate } from "react-router-dom";
import apiUrl from "../Api/Api";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

    const [isOpen, setIsOpen] = useState(isLargeScreen);
    const [isDarkMode, setIsDarkMode] = useState(false);
    // Track dropdown open states by menu id
    const [openDropdown, setOpenDropdown] = useState({});

    useEffect(() => {
        if (isLargeScreen) setIsOpen(true);
    }, [isLargeScreen]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Define menu items, with some containing children (sub-dropdown items)
    const menuItems = [
        { id: "home", label: "Home", icon: <HomeIcon />, path: "/admin-dashboard" },
        {
            id: "settings",
            label: "Settings",
            icon: <SettingsIcon />,
            // Parent item does not have a direct path; its children provide paths
            children: [
                { id: "profile", label: "Profile", path: "/admin-dashboard/settings/profile" },
                { id: "account", label: "Account", path: "/admin-dashboard/settings/account" },
            ],
        },
        { id: "inbox", label: "Inbox", icon: <Inbox />, path: "/admin-dashboard/inbox" },
        { id: "compose", label: "Compose Email", icon: <Email />, path: "/admin-dashboard/compose" },
        {
            id: "Services",
            label: "Services",
            icon: <RequestPage />,
            children: [
                { id: "requests", label: "Requests", path: "/admin-dashboard/requests" },
                { id: "approved", label: "Approved", path: "/admin-dashboard/requests/approved" },
                { id: "declined", label: "Declined", path: "/admin-dashboard/requests/declined" },
                { id: "delete", label: "Delete Services", path: "/admin-dashboard/requests/delete" },

            ],
        },
    ];

    // Render a single menu item; if it has children, render a nested dropdown
    const renderMenuItem = (item) => {
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;

        return (
            <React.Fragment key={item.id}>
                <ListItem
                    button
                    onClick={() => {
                        if (hasChildren) {
                            // Toggle dropdown open state for this item
                            setOpenDropdown((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                        } else {
                            // Navigate if there is a direct path
                            navigate(item.path);
                        }
                    }}
                    sx={{
                        cursor: "pointer",
                        "&:hover": { bgcolor: "primary.dark", color: "white" },
                        justifyContent: isOpen ? "flex-start" : "center",
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: isOpen ? 2 : 0,
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    {isOpen && <ListItemText primary={item.label} />}
                    {hasChildren && isOpen && (openDropdown[item.id] ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>
                {hasChildren && (
                    <Collapse in={openDropdown[item.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children.map((child) => (
                                <ListItem
                                    button
                                    key={child.id}
                                    onClick={() => navigate(child.path)}
                                    sx={{
                                        pl: 4,
                                        "&:hover": { bgcolor: "primary.dark", color: "white" },
                                    }}
                                >
                                    <ListItemText primary={child.label} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        );
    };



    const drawerContent = <List>{menuItems.map((item) => renderMenuItem(item))}</List>;

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: isDarkMode ? "grey.900" : "grey.100",
                color: isDarkMode ? "grey.100" : "grey.900",
            }}
        >
            <CssBaseline />

            {/* AppBar */}
            <AppBar
                elevation={0}
                position="fixed"
                sx={{
                    bgcolor: isDarkMode ? "grey.800" : "primary.main",
                    zIndex: theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <IconButton color="inherit" onClick={() => setIsOpen(!isOpen)} edge="start" sx={{ marginRight: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Onivah Admin
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                variant={isLargeScreen ? "permanent" : "temporary"}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                sx={{
                    "& .MuiDrawer-paper": {
                        mt: 8,
                        width: isOpen ? 250 : 70,
                        transition: "width 0.3s",
                        overflowX: "hidden",
                        bgcolor: isDarkMode ? "grey.800" : "white",
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: isLargeScreen ? (isOpen ? "250px" : "70px") : 0,
                    transition: "margin-left 0.3s",
                }}
            >
                <Toolbar />




                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminDashboard;
