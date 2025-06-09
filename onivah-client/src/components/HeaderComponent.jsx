import React, { useEffect, useState } from 'react';
import { Avatar, Box, IconButton, Stack, Typography, AppBar, Toolbar, Button, useMediaQuery, ThemeProvider, Dialog, DialogTitle, DialogContent, TextField, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import DestinationMenu from './DestinationMenu';
import CheckinMenu from './CheckinMenu';
import GuestsMenu from './CategoryMenu';
import theme from "../Themes/theme"
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import GoogleLogin from './GoogleLogin/GoogleLogin';
import CategoryMenu from './CategoryMenu';
import axios from 'axios';
import { apiUrl } from '../Api/Api';
import withLoadingAndError from "../hoc/withLoadingAndError"
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoutOutlined, Phone } from '@mui/icons-material';


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ mt: 1 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const HeaderComponent = ({ loading, setLoading, error, setError }) => {


    const token = localStorage.getItem('onivah_token'); // Check for token in local storage

    const isMobile = useMediaQuery('(max-width:600px)'); // Adjust the breakpoint as needed

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const defaultLocation = queryParams.get('location') || '';
        const defaultDates = queryParams.getAll('datesChoosed'); // Use getAll to retrieve all selected dates
        const defaultCategory = queryParams.get('category') || '';

        // Update the customerChoice state with default values from the query params
        setCustomerChoice({
            location: defaultLocation,
            datesChoosed: defaultDates,
            category: defaultCategory
        });
    }, [location.search]);

    const [value, setValue] = useState(0);

    const [customerChoice, setCustomerChoice] = useState({
        location: '',
        datesChoosed: [],
        category: ''
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuItems = [
        { text: 'Log In', icon: null, visible: !token }, // Show only if no token
        { text: 'Sign Up', icon: null, visible: !token }, // Show only if no token
        { text: 'Profile', icon: <AccountCircleIcon fontSize="small" color='primary' />, visible: !!token },
        { text: 'Become a Vendor', icon: <Settings fontSize="small" color='primary' />, visible: true }, // Always show
        { text: 'Help Center', icon: <HelpCenterIcon fontSize="small" color='primary' />, visible: true }, // Always show
        { text: 'Log Out', icon: <LogoutOutlined fontSize='small' color='primary' />, visible: !!token } // Show only if token exists
    ];


    const [loginType, setLoginType] = useState('phone'); // 'phone' or 'email'
    const [loginOpen, setLoginOpen] = useState(false);
    const [loginInput, setLoginInput] = useState(''); // Store phone or email input
    const [showOTPField, setShowOTPField] = useState(false); // Display OTP field after request
    const [otp, setOtp] = useState('');




    const handleMenuItemClick = (text) => {
        switch (text) {
            case 'Log In':
                setLoginOpen(true)
                console.log('Log In clicked');
                break;
            case 'Sign Up':
                console.log('Sign Up clicked');
                break;
            case 'Become a Vendor':
                console.log('Become a Vendor clicked');
                break;
            case 'Help center':
                console.log('Help center clicked');
                break;
            case 'Profile':
                console.log('profile');
                break;
            case 'Logout':
                localStorage.removeItem("token");
                navigate("/")
                break;
            default:
                console.log('Unknown action');
        }
    };

    // Function to update customerChoice
    const updateCustomerChoice = (newChoice) => {
        setCustomerChoice((prevChoice) => ({
            ...prevChoice,
            ...newChoice // Merge new values with the previous state
        }));
    };

    // Example of how you would handle selecting a location
    const locationHandler = (selectedLocation) => {
        updateCustomerChoice({ location: selectedLocation }); // Update only the location
    };

    // Example of how you would handle selecting dates
    const dateHandler = (selectedDates) => {
        updateCustomerChoice({ datesChoosed: selectedDates }); // Update only the dates
    };

    // Example of how you would handle selecting a category
    const categoryHandler = (selectedCategory) => {
        updateCustomerChoice({ category: selectedCategory }); // Update only the category
    };


    const toggleLoginType = () => {
        setLoginType(prevType => (prevType === 'phone' ? 'email' : 'phone'));
        setLoginInput('');
        setShowOTPField(false);
    };

    // Search handler
    const handleSearch = async () => {
        const { location, datesChoosed, category } = customerChoice;

        // Check if at least one of the values is selected
        if (!location && (!datesChoosed || datesChoosed.length === 0) && !category) {
            alert("Please select at least one event detail (location, dates, or category).");
            return;
        }

        // Construct query parameters dynamically based on which values are present
        const queryParams = new URLSearchParams();

        if (location) queryParams.append('location', location);
        if (Array.isArray(datesChoosed) && datesChoosed.length > 0) {
            datesChoosed.forEach(date => {
                queryParams.append('datesChoosed', date);
            });
        }
        if (category) queryParams.append('category', category);

        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/header/search?${queryParams.toString()}`);
            setLoading(false);
            navigate(`/?${queryParams.toString()}`); // Updated to include all query params

            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };



    // Handle OTP request
    const handleSendOtp = async () => {

        if (loginInput.trim() === "") {
            return alert(`Please fill the ${loginType} field !`)
        }

        try {
            const response = await axios.post(`${apiUrl}/login/send-otp`, {
                [loginType === 'phone' ? 'phone' : 'email']: loginInput,
                userType: loginType // Send userType as 'phone' or 'email'
            });
            if (response.data.success) {
                setShowOTPField(true); // Display OTP field if request is successful
                alert(response.data.message);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert(error.response.data.message);
            console.log('Error sending OTP:', error);
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post(`${apiUrl}/login/verify-otp`, {
                loginInput, otp
            }, { withCredentials: true });
            if (response.data.success) {
                const token = response.data.token;
                alert('Verification successful!');
                localStorage.setItem("token", token);
                setLoginOpen(false)
            } else {
                alert('Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };



    return (
        <div className='header'>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

                {/* account settings */}
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', }}>

                    <Tooltip title="Account settings">
                        <IconButton
                            sx={{
                                '&:hover': {
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Box shadow on hover
                                },
                                borderRadius: "10px",
                                border: "1px solid #e1e1e1",
                                padding: "10px 20px",
                                backgroundColor: "white"
                            }}
                            onClick={handleClick}
                            size="small"
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <MenuIcon sx={{ color: 'black' }} />
                                <AccountCircleIcon sx={{ color: 'black' }} />
                            </Stack>
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* menu settings */}
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                >
                    {menuItems.filter(item => item.visible).map((item, index) => (
                        <MenuItem key={index} onClick={() => { handleMenuItemClick(item.text); handleClose(); }}>
                            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                            <Typography variant="body1" sx={{}}>
                                {item.text}
                            </Typography>
                        </MenuItem>
                    ))}
                </Menu>

                {/* login dialog */}
                <Dialog open={loginOpen} onClose={() => setLoginOpen(false)}>
                    <DialogTitle>Log In</DialogTitle>
                    <DialogContent sx={{ maxWidth: 400 }}>
                        {/* Toggle between Phone Number and Email */}
                        <TextField
                            label={`Login with ${loginType === 'phone' ? 'Phone Number' : 'Email'}`}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name={loginType === 'phone' ? 'userPhone' : 'userEmail'}
                            type={loginType === 'phone' ? 'tel' : 'email'} // Set input type to tel or email
                            onChange={(e) => setLoginInput(e.target.value)}

                        />
                        <Typography variant='subtitle2' color='text.secondary' sx={{ p: 1 }}> We will send you a verification code.</Typography>
                        {!showOTPField ? (
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ color: 'white', p: 1, fontSize: "1rem" }}
                                onClick={handleSendOtp}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Box>
                                <TextField
                                    label="Enter OTP"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ color: 'white', p: 1, fontSize: "1rem", mb: 1 }}
                                    onClick={handleVerifyOtp}
                                >
                                    Verify OTP
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ p: 1, fontSize: "1rem" }}
                                    onClick={handleSendOtp}
                                >
                                    Resend OTP
                                </Button>
                            </Box>
                        )}

                        <Typography sx={{ textAlign: "center", marginTop: 2 }}> OR</Typography>

                        <Grid container spacing={2} sx={{ marginTop: 1 }}>
                            {/* <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<FacebookIcon />}
                                        sx={{ backgroundColor: '#3b5998', color: 'white' }}
                                    >
                                        Continue with Facebook
                                    </Button>
                                </Grid> */}
                            <Grid item xs={12}>
                                <GoogleLogin />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={loginType === 'phone' ? <EmailIcon /> : <Phone />}
                                    sx={{
                                        backgroundColor: '#c74040', // Google Green
                                        color: 'white',
                                        borderRadius: 2, // Rounded edges for a modern look
                                        padding: '12px 0', // More padding for a larger feel
                                        fontSize: '1rem', // Larger text for prominence
                                        // boxShadow: '0px 8px 16px rgba(199, 64, 64, 0.3)', // Soft shadow for depth
                                        transition: 'all 0.3s ease', // Smooth transition for hover effects
                                        '&:hover': {
                                            backgroundColor: '#9d3535', // Darker red on hover
                                            boxShadow: '0px 10px 20px rgba(158, 49, 49, 0.4)', // Enhanced shadow on hover
                                            transform: 'translateY(-2px)', // Slight lift effect
                                        },
                                        '&:active': {
                                            transform: 'translateY(1px)', // Button presses down slightly on click
                                            boxShadow: '0px 6px 12px rgba(158, 49, 49, 0.3)', // Subtle shadow on click
                                        },
                                    }}
                                    onClick={toggleLoginType}
                                >
                                    {`Continue with ${loginType === 'phone' ? 'Email' : 'Phone'}`}
                                </Button>

                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>

            </Toolbar>


            {/* destination,category,date */}
            {/* <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 1 }}>
                <Box sx={{ borderRadius: '10px', width: '100%', maxWidth: 600, boxShadow: "2px 2px 6px 3px #9e9e9e69", backgroundColor: "white" }}>
                    <Stack direction="row" spacing={{ xs: 0, md: 2 }} justifyContent="space-between" alignItems="center" sx={{ ml: { xs: 0, md: 2 }, }}>

                        <DestinationMenu onLocationSelect={locationHandler} defaultLocation={customerChoice.location} />

                        <CheckinMenu onDateSelect={dateHandler} defaultDates={customerChoice.datesChoosed} />

                        <CategoryMenu onCategorySelect={categoryHandler} defaultCategory={customerChoice.category} />

                        <Box sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: '8px' }}>
                            {
                                isMobile ?
                                    <IconButton
                                        sx={{ backgroundColor: "#1a84932b" }}
                                        onClick={handleSearch}  // Move the onClick event to the IconButton
                                    >
                                        <SearchIcon fontSize='medium' sx={{ color: "black" }} />
                                    </IconButton>
                                    :
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        startIcon={<SearchIcon fontSize='medium' />}
                                        onClick={handleSearch}  // Add the onClick event to the Button itself
                                    >
                                        Search
                                    </Button>
                            }
                        </Box>

                    </Stack>
                </Box>

            </Box > */}

            {error && <Typography variant='body2' color='textSecondary' sx={{ p: 2 }} textAlign="center">{error}</Typography>}
            {loading && <Typography variant='body2' color='textSecondary' sx={{ p: 2 }} textAlign="center">Loading ...</Typography>}

        </div >
    );
};

export default withLoadingAndError(HeaderComponent);
