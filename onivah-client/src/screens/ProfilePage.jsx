import React, { useState, useEffect } from "react";
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
    Badge,
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
    ErrorOutline,
    Edit,
    CheckCircle,
} from "@mui/icons-material";
import { Country, State, City } from "country-state-city";
import { InputLabel, FormControl } from '@mui/material';
import axios from "axios";


const ProfilePage = ({ userData }) => {

    console.log(userData);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
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


    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [isEditable, setIsEditable] = useState(false); // State to toggle edit mode
    const [incompleteFields, setIncompleteFields] = useState([]);

    useEffect(() => {
        const fields = [];

        // Check if the fields in userData are missing and push to the incomplete fields array
        if (!userData.firstname) fields.push("First Name");
        if (!userData.lastname) fields.push("Last Name");
        if (!userData.email) fields.push("Email Address");
        if (!userData.phone) fields.push("Phone Number");
        if (!userData.country) fields.push("Country");
        if (!userData.state) fields.push("State");
        if (!userData.city) fields.push("City");
        if (!userData.zipcode) fields.push("Zip Code");

        // Update the incomplete fields state
        setIncompleteFields(fields);

        // If the country has a value, find and set the isoCode in selectedCountry
        if (userData.country) {
            const selectedCountryObj = countries.find(country => country.name === userData.country);
            if (selectedCountryObj) {
                setSelectedCountry(selectedCountryObj.isoCode);
            }
        }

        // If the state has a value, find and set the isoCode in selectedState
        if (userData.state) {
            const selectedStateObj = states.find(state => state.name === userData.state);
            if (selectedStateObj) {
                setSelectedState(selectedStateObj.isoCode);
            }
        }

        // If the city has a value, set the city name in selectedCity
        if (userData.city) {
            setSelectedCity(userData.city);
        }
    }, [userData, countries, states]); // Dependencies include userData, countries, and states


    const [profileDetails, setProfileDetails] = useState({
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        phone: userData.phone,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        zipcode: userData.zipcode,
        userId: userData._id
    });

    console.log(profileDetails);

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            const statesList = State.getStatesOfCountry(selectedCountry); // Get states of selected country
            setStates(statesList);
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedState) {
            const citiesList = City.getCitiesOfState(selectedCountry, selectedState); // Get cities of selected state
            setCities(citiesList);
        } else {
            setCities([]);
        }
    }, [selectedState, selectedCountry]);

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

    // Toggle edit mode

    const toggleEdit = () => {
        setIsEditable((prev) => !prev);
    };

    // profile handling
    const handleInputChange = (field, value) => {
        setProfileDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    // Function to handle the country change
    const handleCountryChange = (e) => {
        const selectedCountryCode = e.target.value; // Get the selected country code
        setSelectedCountry(selectedCountryCode);  // Update selectedCountry state

        // Find the country name by code (you need an array of country objects)
        const selectedCountry = countries.find(country => country.isoCode === selectedCountryCode);

        setProfileDetails({
            ...profileDetails,
            country: selectedCountry.name, // Store the country code
            state: '', // Reset state and city when country changes
            city: ''
        });
    };

    // Function to handle the state change
    const handleStateChange = (e) => {
        const selectedStateCode = e.target.value; // Get the selected state code
        setSelectedState(selectedStateCode);  // Update selectedState state

        // Find the state name by code (you need an array of state objects)
        const selectedState = states.find(state => state.isoCode === selectedStateCode);
        console.log(selectedState);
        setProfileDetails({
            ...profileDetails,
            state: selectedState.name, // Store the state code
            city: '' // Reset city when state changes
        });
    };


    // Function to handle the city change
    const handleCityChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedCity(selectedValue);  // Update selectedCity state
        setProfileDetails({
            ...profileDetails,
            city: selectedValue
        });
    };


    const renderContent = (userData) => {
        if (!userData) {
            return <Typography>Loading...</Typography>;
        }
        switch (activeItem) {
            case "Personal Info":
                return (
                    <Box>
                        <Typography variant="h6" mb={2}>
                            Personal Information
                        </Typography>
                        <Paper elevation={1} sx={{ p: 1, mb: 4, boxShadow: 0 }}>
                            <Box
                                display="flex"
                                flexDirection="row"
                                alignItems="flex-start"
                                mb={3}
                            >
                                <Avatar
                                    src="https://placehold.co/100x100"
                                    alt="User profile picture"
                                    sx={{ width: 96, height: 96, mr: 2 }}
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

                            {/* Edit Button */}

                            <Grid container spacing={2} justifyContent="end">
                                {/* Edit/Cancel Button */}
                                <Grid item>
                                    <Button
                                        endIcon={!isEditable && <Edit />}
                                        variant="contained"
                                        onClick={toggleEdit}
                                        sx={{
                                            backgroundColor: isEditable ? '#cccc' : 'primary', // Red for cancel, green for edit
                                            // '&:hover': {
                                            //     backgroundColor: isEditable ? '#d32f2f' : '#388e3c', // Hover effect
                                            // },
                                            color: isEditable ? 'black' : 'white',
                                            fontWeight: 'bold',
                                            padding: '8px 16px',
                                            mb: 2, // Margin-bottom for spacing between buttons
                                        }}
                                    >
                                        {isEditable ? "Cancel" : "Edit"}
                                    </Button>
                                </Grid>

                                {/* Save Profile Button */}
                                {isEditable && (
                                    <Grid item>
                                        <Button
                                            endIcon={isEditable && <CheckCircle />}
                                            variant="contained"
                                            sx={{
                                                fontWeight: 'bold',
                                                padding: '8px 16px',
                                                borderRadius: '8px', // Rounded corners
                                                width: '150px', // Fixed width for alignment
                                                mb: 2,
                                            }}
                                            onClick={handleSubmit}
                                        >
                                            Save Profile
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="First Name"
                                        fullWidth
                                        value={userData.firstname || profileDetails.firstname}
                                        onChange={(e) => handleInputChange('firstname', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Last Name"
                                        fullWidth
                                        value={userData.lastname || profileDetails.lastname}
                                        onChange={(e) => handleInputChange('lastname', e.target.value)}
                                        disabled={!isEditable}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        label="Email Address"
                                        fullWidth
                                        value={userData.email || profileDetails.email}
                                        disabled
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Phone Number"
                                        fullWidth
                                        value={userData.phone || profileDetails.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        disabled
                                    />
                                </Grid>

                                {/* Country Dropdown */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Select Country</InputLabel>
                                        <Select
                                            value={selectedCountry}  // Bind selectedCountry from state
                                            onChange={(e) => handleCountryChange(e)}   // Use the handleCountryChange function
                                            label="Select Country"
                                            disabled={!isEditable}
                                        >
                                            <MenuItem value="">
                                                <em>Select Country</em>
                                            </MenuItem>
                                            {countries.map((country) => (
                                                <MenuItem key={country.isoCode} value={country.isoCode}>
                                                    {country.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* State Dropdown */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Select State</InputLabel>
                                        <Select
                                            value={selectedState}  // Bind selectedState from state
                                            onChange={(e) => handleStateChange(e)}   // Use the handleStateChange function
                                            label="Select State"
                                            disabled={!selectedCountry || !isEditable}
                                        >
                                            <MenuItem value="">
                                                <em>Select State</em>
                                            </MenuItem>
                                            {states.map((state) => (
                                                <MenuItem key={state.isoCode} value={state.isoCode}>
                                                    {state.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* City Dropdown */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Select City</InputLabel>
                                        <Select
                                            value={selectedCity}  // Bind selectedCity from state
                                            onChange={handleCityChange}   // Use the handleCityChange function
                                            label="Select City"
                                            disabled={!selectedState || !isEditable}
                                        >
                                            <MenuItem value="">
                                                <em>Select City</em>
                                            </MenuItem>
                                            {cities.map((city) => (
                                                <MenuItem key={city.name} value={city.name}>
                                                    {city.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>


                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Zip Code"
                                        fullWidth
                                        value={userData.zipcode || profileDetails.zipcode}
                                        onChange={(e) => handleInputChange('zipcode', e.target.value)}
                                        disabled={!isEditable}
                                    />
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
                return (
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            mb={3}
                            textAlign="center"
                            color="primary"
                        >
                            Notifications Center
                        </Typography>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                                maxWidth: "600px",
                                margin: "0 auto",
                                textAlign: "center",
                            }}
                        >
                            {incompleteFields.length > 0 ? (
                                <>
                                    <Typography variant="h6" color="error" mb={2}>
                                        Missing Information
                                    </Typography>
                                    <Alert severity="warning" sx={{ mb: 3 }}>
                                        Please complete the following fields to ensure your profile is up-to-date:
                                    </Alert>
                                    <List
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            gap: 1,
                                        }}
                                    >
                                        {incompleteFields.map((field, index) => (
                                            <ListItem key={index} sx={{ p: 0 }}>
                                                <ListItemIcon>
                                                    <ErrorOutline color="error" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={field}
                                                    primaryTypographyProps={{ fontWeight: "bold" }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Box textAlign="center" mt={4}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={() => setActiveItem("Personal Info")}
                                            sx={{
                                                textTransform: "capitalize",
                                                borderRadius: "8px",
                                                px: 4,
                                                py: 1,
                                            }}
                                        >
                                            Complete Profile Now
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6" color="success.main" textAlign="center">
                                        🎉 All information is complete!
                                    </Typography>
                                    <Typography variant="body1" textAlign="center" mt={2}>
                                        Your profile is up-to-date. No further action is required.
                                    </Typography>
                                </>
                            )}
                        </Paper>
                    </Box>

                );
            default:
                return <Typography variant="h6">Select an option to view details</Typography>;
        }
    };


    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:4000/profile_save', profileDetails);
            console.log('Profile saved successfully:', response.data);
            toggleEdit()
            alert('Profile saved successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving profile');
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
                    {
                        text: "Notifications",
                        icon: (
                            <Badge
                                color="error"
                                badgeContent={incompleteFields?.length || 0}
                                invisible={!incompleteFields || incompleteFields.length === 0}
                            >
                                <Notifications />
                            </Badge>
                        ),
                    },
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
                    {
                        userData ?
                            <>
                                {renderContent(userData)}
                            </>

                            :
                            <Typography>Loading...</Typography>
                    }
                </Paper>
            </Box>
        </Box>
    );
};

export default ProfilePage;
