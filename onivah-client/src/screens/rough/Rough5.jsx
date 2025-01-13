import React, { useState } from "react";
import {
    Box,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    TextField,
    Select,
    MenuItem,
    IconButton,
    InputAdornment,
    useMediaQuery,
    useTheme,
    Drawer,
    AppBar,
    Toolbar,
    IconButton as AppBarIconButton,
    Paper,
    Button,
    Divider,
    Alert,
    Tabs,
    Tab,
} from "@mui/material";
import {
    Person,
    Email,
    Notifications,
    Business,
    Link,
    CameraAlt,
    Menu as MenuIcon,
    Close as CloseIcon,
} from "@mui/icons-material";

const Rough5 = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("Personal Info");

    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false); // Flag to track OTP sent status
    const [otpSentError, setOtpSentError] = useState(''); // Error message for OTP sending failure
    const [isUpdating, setIsUpdating] = useState(false); // Loading state for email update
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [tabIndex, setTabIndex] = useState(0); // State to track selected tab

    // Function to simulate API call for email and password verification
    const verifyEmailPassword = async (email, password) => {
        // Replace with actual API call for verifying email and password
        if (email === 'user@example.com' && password === 'password123') {
            return true;
        }
        return false;
    };

    // Function to simulate sending OTP to new email
    const sendOtpToNewEmail = async (email) => {
        // Replace with actual API call to send OTP
        if (email === 'new@example.com') {
            return { success: true };
        }
        return { success: false, error: 'Failed to send OTP' };
    };

    // Function to handle updating email
    const handleUpdateEmail = async () => {
        // Verify current email and password
        const isValidUser = await verifyEmailPassword(currentEmail, emailPassword);
        if (isValidUser) {
            const otpResponse = await sendOtpToNewEmail(newEmail);
            if (otpResponse.success) {
                setIsOtpSent(true); // Show OTP input field
                setOtpSentError(''); // Reset error message
            } else {
                setOtpSentError(otpResponse.error);
            }
        } else {
            setOtpSentError('Invalid email or password.');
        }
    };

    // Function to handle OTP verification
    const handleVerifyOtp = () => {
        // Replace with actual OTP verification logic
        if (otp === '123456') {
            alert('Email updated successfully!');
            setIsOtpSent('');
            setCurrentEmail('');
            setNewEmail('');
            setEmailPassword('')
        } else {
            alert('Invalid OTP.');
        }
    };
    const toggleDrawer = () => setDrawerOpen((prev) => !prev);

    const handleListItemClick = (text) => {
        setActiveItem(text);
        if (isSmallScreen) {
            toggleDrawer(); // Close the drawer on small screens after selection
        }
    };

    // Handle tab change
    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };


    const renderContent = () => {
        switch (activeItem) {
            case "Personal Info":
                return (
                    <Box>
                        <Typography variant="h6" mb={2}>
                            Personal Information
                        </Typography>
                        <Typography variant="body1" mb={4}>
                            Update your personal details here.
                        </Typography>
                        <Paper elevation={1} sx={{ p: 1, mb: 4, boxShadow: 0 }}>
                            <Box
                                display="flex"
                                flexDirection={isSmallScreen ? "column" : "row"}
                                alignItems={isSmallScreen ? "center" : "flex-start"}
                                mb={3}
                            >
                                <Avatar
                                    src="https://placehold.co/100x100"
                                    alt="User profile picture"
                                    sx={{ width: 96, height: 96, mr: isSmallScreen ? 0 : 2, mb: isSmallScreen ? 2 : 0 }}
                                />
                                <IconButton
                                    sx={{
                                        bgcolor: "primary.main",
                                        color: "white",
                                        "&:hover": {
                                            bgcolor: "primary.dark",
                                        },
                                    }}
                                >
                                    <CameraAlt />
                                </IconButton>
                            </Box>
                            <Grid container spacing={isSmallScreen ? 1 : 2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="First Name" defaultValue="Arafat" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Last Name" defaultValue="Nayeem" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Email Address" defaultValue="hello@fillo.co" fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Phone Number"
                                        defaultValue="1681 788 203"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">+880</InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select label="Country" defaultValue="Bangladesh" fullWidth>
                                        <MenuItem value="Bangladesh">Bangladesh</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select label="City" defaultValue="Sylhet" fullWidth>
                                        <MenuItem value="Sylhet">Sylhet</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Zip Code" defaultValue="3100" fullWidth />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                );
            case "Emails & Password":
                return (
                    <Box
                        elevation={3}
                        sx={{
                            p: 4,
                            borderRadius: 2,
                            mx: 'auto',
                            mt: 5,
                            backgroundColor: 'white',
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold" mb={3} color="primary" textAlign="center">
                            Update Account Information
                        </Typography>

                        {/* Tabs for Update Email and Update Password */}
                        <Tabs value={tabIndex} onChange={handleTabChange} centered>
                            <Tab label="Update Email" />
                            <Tab label="Update Password" />
                        </Tabs>

                        <Divider sx={{ mb: 3 }} />

                        {tabIndex === 0 && (
                            <Box >
                                {/* Update Email Section */}
                                <Typography variant="h6" fontWeight="bold" mb={2}>
                                    Update Email
                                </Typography>
                                <Grid container spacing={2} mb={4} justifyContent="center">
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            label="Current Email"
                                            fullWidth
                                            variant="outlined"
                                            type="email"
                                            value={currentEmail}
                                            onChange={(e) => setCurrentEmail(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            label="New Email"
                                            fullWidth
                                            variant="outlined"
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            label="Password for Verification"
                                            fullWidth
                                            variant="outlined"
                                            type="password"
                                            value={emailPassword}
                                            onChange={(e) => setEmailPassword(e.target.value)}
                                        />
                                    </Grid>

                                    {/* Error or Success Message */}
                                    {otpSentError && <Alert severity="error">{otpSentError}</Alert>}

                                    <Grid item xs={12} textAlign="right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={handleUpdateEmail}
                                            sx={{
                                                px: 3,
                                                py: 1,
                                                fontSize: '1rem',
                                                textTransform: 'capitalize',
                                                borderRadius: '8px',
                                            }}
                                        >
                                            {isUpdating ? 'Updating...' : 'Update Email'}
                                        </Button>
                                    </Grid>
                                </Grid>

                                {isOtpSent && (
                                    <>
                                        <Divider sx={{ mb: 3 }} />
                                        <Typography variant="h6" fontWeight="bold" mb={2}>
                                            Enter OTP
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="OTP Sent to New Email"
                                                    fullWidth
                                                    variant="outlined"
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} textAlign="right">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="large"
                                                    onClick={handleVerifyOtp}
                                                    sx={{
                                                        px: 3,
                                                        py: 1,
                                                        fontSize: '1rem',
                                                        textTransform: 'capitalize',
                                                        borderRadius: '8px',
                                                    }}
                                                >
                                                    Verify OTP
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </Box>
                        )}

                        {tabIndex === 1 && (
                            <Box>
                                {/* Update Password Section */}
                                <Typography variant="h6" fontWeight="bold" mb={2}>
                                    Update Password
                                </Typography>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            label="Current Password"
                                            fullWidth
                                            variant="outlined"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            label="New Password"
                                            fullWidth
                                            variant="outlined"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={8} textAlign="right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={() => alert('Password updated successfully!')}
                                            sx={{
                                                px: 3,
                                                py: 1,
                                                fontSize: '1rem',
                                                textTransform: 'capitalize',
                                                borderRadius: '8px',
                                            }}
                                        >
                                            Update Password
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                );
            case "Notifications":
                return <Typography variant="h6">Manage Notifications</Typography>;
            default:
                return <Typography variant="h6">Select an option to view details</Typography>;
        }
    };

    const SidebarContent = (
        <Box
            width={isSmallScreen ? 250 : "100%"}
            bgcolor="primary.main"
            color="white"
            p={2}
        >
            <Typography variant="h6" fontWeight="bold" mb={2}>
                Manage Profile
            </Typography>
            <List sx={{ cursor: "pointer" }}>
                {[
                    { text: "Personal Info", icon: <Person /> },
                    { text: "Emails & Password", icon: <Email /> },
                    { text: "Notifications", icon: <Notifications /> },
                ].map((item, index) => (
                    <ListItem
                        button
                        key={index}
                        onClick={() => handleListItemClick(item.text)}
                        sx={{
                            bgcolor: activeItem === item.text ? "primary.dark" : "transparent",
                            "&:hover": {
                                bgcolor: "primary.light",
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"}>
            {/* AppBar for mobile */}
            {isSmallScreen && (
                <AppBar position="sticky" sx={{ bgcolor: "primary.main" }}>
                    <Toolbar>
                        <AppBarIconButton edge="start" color="inherit" onClick={toggleDrawer}>
                            <MenuIcon />
                        </AppBarIconButton>
                        <Typography variant="h6" ml={2}>
                            User Profile
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* Sidebar */}
            {!isSmallScreen && (
                <Box width="20%" bgcolor="primary.main" color="white" minHeight="100vh">
                    {SidebarContent}
                </Box>
            )}
            {isSmallScreen && (
                <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                    <Box display="flex" justifyContent="flex-end" p={2}>
                        <IconButton onClick={toggleDrawer}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {SidebarContent}
                </Drawer>
            )}

            {/* Main Content */}
            <Box flex={1} bgcolor="grey.100" p={isSmallScreen ? 2 : 3}>
                <Paper elevation={3} sx={{ p: 1 }}>
                    {renderContent()}
                </Paper>
            </Box>
        </Box>
    );
};

export default Rough5;
