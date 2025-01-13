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
    Slider,
    Typography,
    Box,
    CssBaseline,
    useMediaQuery,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Settings as SettingsIcon,
    Person as PersonIcon,
    HelpOutline as HelpOutlineIcon,
    Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon,
    Inbox,
    RequestPage,
} from "@mui/icons-material";
import { AccountCircle as AccountCircleIcon, TrendingUp as TrendingUpIcon, PlaylistAddCheck as PlaylistAddCheckIcon } from '@mui/icons-material';
import { Grid, Card, CardContent, } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import InboxPage from "../admin/InboxPage";
import ComposeMail from "../admin/ComposeMail";
import Email from "@mui/icons-material/Email";
import RequestedServices from "../admin/RequestedServices";
import axios from "axios";
import apiUrl from "../Api/Api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

    const navigate = useNavigate();
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

    const [isOpen, setIsOpen] = useState(isLargeScreen);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(300);
    const [activeItem, setActiveItem] = useState("home");
    const [userCount, setUserCount] = useState(0); // State to store user count
    const [vendorCount, setVendorCount] = useState(0); // State to store user count

    useEffect(() => {
        // Fetch the user count from the backend when the component mounts
        const fetchUserCount = async () => {
            try {
                const response = await axios.get(`${apiUrl}/admin/users/count`); // Replace with your server URL
                setUserCount(response.data.userCount); // Set the user count in the state
                setVendorCount(response.data.vendorCount); // Set the vendor count in the state

            } catch (error) {
                console.error('Error fetching user count:', error);
            }
        };

        fetchUserCount();
    }, []); // Empty dependency array to run this effect only once on component mount


    const HomePage = () => {

        return (
            <Box>
                <Typography variant="h5" gutterBottom>
                    Admin Dashboard
                </Typography>

                {/* Admin Dashboard Grid */}
                <Grid container spacing={3}>
                    {/* Dashboard Card 1 - Users */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent >
                                <Box onClick={() => navigate("/admin-users")} display="flex" alignItems="center" sx={{ cursor: "pointer" }}>
                                    <AccountCircleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                                    <Typography variant="h6">Total Users</Typography>
                                </Box>
                                <Typography variant="h4" color="primary">
                                    {userCount}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Dashboard Card 2 - Revenue */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                                    <Typography variant="h6">Vendors</Typography>
                                </Box>
                                <Typography variant="h4" color="success">
                                    {vendorCount}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Dashboard Card 3 - Pending Tasks */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <PlaylistAddCheckIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                                    <Typography variant="h6">Pending Tasks</Typography>
                                </Box>
                                <Typography variant="h4" color="warning">
                                    45
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Quick Actions Section */}
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        Quick Actions
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Create New Post</Typography>
                                    {/* Add button or link to create new post */}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Manage Users</Typography>
                                    {/* Add button or link to manage users */}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">View Reports</Typography>
                                    {/* Add button or link to view reports */}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Settings</Typography>
                                    {/* Add button or link to settings */}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        )
    }
    const SettingsPage = () => <Typography variant="h4">Adjust your settings here.</Typography>;


    const menuItems = [
        { id: "home", label: "Home", icon: <HomeIcon />, component: <HomePage /> },
        { id: "settings", label: "Settings", icon: <SettingsIcon />, component: <SettingsPage /> },
        { id: "Inbox", label: "Inbox", icon: <Inbox />, component: <InboxPage /> },
        { id: "Compose Email", label: "Compose Email", icon: <Email />, component: <ComposeMail /> },
        { id: "Venues Requested", label: "Venues Requested", icon: <RequestPage />, component: <RequestedServices /> },
    ];


    useEffect(() => {
        // Keep drawer open in desktop mode
        if (isLargeScreen) setIsOpen(true);
    }, [isLargeScreen]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleMenuItemClick = (itemId) => {
        setActiveItem(itemId);
    };

    const drawerContent = (
        <List>
            {menuItems.map((item) => (
                <ListItem
                    button
                    key={item.id}
                    selected={activeItem === item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    sx={{
                        cursor: "pointer",
                        bgcolor: activeItem === item.id ? "primary.main" : "transparent",
                        color: activeItem === item.id ? "white" : isDarkMode ? "grey.300" : "grey.800",
                        "&:hover": { bgcolor: "primary.light", color: "white" },
                        justifyContent: isOpen ? "flex-start" : "center",
                    }}
                >
                    <ListItemIcon
                        sx={{
                            color: activeItem === item.id ? "white" : isDarkMode ? "grey.300" : "grey.800",
                            minWidth: 0,
                            mr: isOpen ? 2 : 0,
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    {isOpen && <ListItemText primary={item.label} />}
                </ListItem>
            ))}
        </List>
    );

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
                position="fixed"
                sx={{ bgcolor: isDarkMode ? "grey.800" : "primary.main", zIndex: theme.zIndex.drawer + 1, }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={() => setIsOpen(!isOpen)}
                        edge="start"
                        sx={{ marginRight: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Onivah Admin
                    </Typography>
                    <IconButton color="inherit" onClick={toggleTheme}>
                        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
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
                    ml: isLargeScreen ? (isOpen ? "250px" : "70px") : 0, // Adjust main content based on drawer width
                    transition: "margin-left 0.3s",
                }}
            >
                <Toolbar />
                <Typography variant="h4" gutterBottom>
                    {menuItems.find((item) => item.id === activeItem)?.component}
                </Typography>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
