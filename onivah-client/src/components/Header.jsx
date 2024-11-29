import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, CssBaseline, Box, Container, TextField, Grid, InputAdornment, useMediaQuery, DialogActions } from '@mui/material';

import { Avatar, IconButton, Stack, ThemeProvider, Dialog, DialogTitle, DialogContent, } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import apiUrl from '../Api/Api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin/GoogleLogin';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon

import Settings from '@mui/icons-material/Settings';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import HomeIcon from '@mui/icons-material/Home'; // Using a home icon for Home
import InfoIcon from '@mui/icons-material/Info'; // Using an info icon for About
import ArticleIcon from '@mui/icons-material/Article'; // Using an article icon for Blogs
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SearchPopup from './SearchPopup';
import { Phone } from '@mui/icons-material';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const Header = () => {


    const isMobile = useMediaQuery('(max-width:600px)'); // Adjust the breakpoint as needed

    const token = localStorage.getItem('loginToken'); // Check for token in local storage

    const location = useLocation();
    const navigate = useNavigate();


    const [anchorEl, setAnchorEl] = React.useState(null);

    const [serachBoxOpen, setSearchBoxOpen] = useState(false);

    const open = Boolean(anchorEl);

    const handleSearchBox = () => {
        setSearchBoxOpen(true);
    };

    const handleCloseSearchBox = () => {
        setSearchBoxOpen(false);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuItems = [
        { text: 'Home', icon: <HomeIcon fontSize="small" color='white' />, visible: isMobile }, // Always show
        { text: 'About', icon: <InfoIcon fontSize="small" color='white' />, visible: isMobile }, // Always show
        { text: 'Blogs', icon: <ArticleIcon fontSize="small" color='white' />, visible: isMobile }, // Always show
        { text: 'Contact', icon: <ContactMailIcon fontSize="small" color='white' />, visible: isMobile }, // Always show
        { text: 'Log In', icon: null, visible: !token }, // Show only if no token
        { text: 'Sign Up', icon: null, visible: !token }, // Show only if no token
        { text: 'Profile', icon: <AccountCircleIcon fontSize="small" color='white' />, visible: !!token },
        { text: 'Become a Vendor', icon: <Settings fontSize="small" color='white' />, visible: true }, // Always show
        { text: 'Help Center', icon: <HelpCenterIcon fontSize="small" color='white' />, visible: true }, // Always show
        { text: 'Log Out', icon: <LogoutOutlined fontSize='small' color='white' />, visible: !!token }, // Show only if token exists
    ];

    const [loginType, setLoginType] = useState('email'); // 'phone' or 'email'
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
                window.location.href = "/vendor-login";
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
            case 'Home':
                window.location.href = "/";
                break;
            case 'About':
                window.location.href = "/about";
                break;
            case 'Contact':
                window.location.href = "/contact";
                break;
            case 'Blogs':
                window.location.href = "/blogs";
                break;
            default:
                console.log('Unknown action');
        }
    };

    const toggleLoginType = () => {
        setLoginType(prevType => (prevType === 'phone' ? 'email' : 'phone'));
        setLoginInput('');
        setShowOTPField(false);
    };

    // phone handler
    const handlePhoneChange = (value, country) => {
        console.log(country.dialCode);

        // setFormData({
        //     ...formData,
        //     phone: value, // Store only the phone number
        //     dialCode: country.dialCode,
        // });
        // setLoginInput(e.target.value) // Handle phone input


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
            });
            if (response.data.success) {
                const token = response.data.token;
                alert('Verification successful!');
                localStorage.setItem("loginToken", token);
                setLoginOpen(false)
            } else {
                alert('Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };


    const [openMenu, setOpenMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false); // State to track scroll
    const menuRef = useRef(null); // Create a ref for the dropdown menu

    const handleToggleMenu = () => {
        setOpenMenu((prev) => !prev); // Toggle the menu open state
    };

    // Close the menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        };

        // Attach event listener for clicks outside
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Track scrolling to change AppBar color
    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => {
                setScrolled(window.scrollY > 300);
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    // #38a1f7


    return (
        <Box>
            {/* App Bar */}


            <AppBar
                position={scrolled ? 'fixed' : 'absolute'}
                elevation={0}
                sx={{
                    top: scrolled ? '0' : isMobile ? '56px' : '60px',
                    backgroundColor: scrolled || location.pathname !== '/' || location.search ? '#704d8f' : 'transparent',
                    transition: 'transform 0.3s ease', // Smooth transition
                    transform: scrolled ? 'translateY(0)' : 'translateY(-100%)', // Slide down effect #4169E1
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ color: 'white', marginLeft: '16px', mr: 10 }}>
                        ONIVAH
                    </Typography>

                    {
                        !isMobile && (
                            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                                {[
                                    { text: 'Home', link: '/' },
                                    { text: 'About', link: '/about' },
                                    { text: 'Blogs', link: '/blogs' },
                                    { text: 'Contact', link: '/contact' }
                                ].map(({ text, link }) => (
                                    <Button
                                        key={link}
                                        href={link}
                                        sx={{
                                            color: "white",
                                            '&:hover': {
                                                backgroundColor: '#a871d9',
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        {text}
                                    </Button>
                                ))}
                            </Stack>
                        )
                    }


                    {/* Login Button */}
                    <Button color="inherit" sx={{
                        marginLeft: isMobile ? 7 : 0,
                        marginRight: isMobile ? 0 : 2,
                        visible: !token,
                        backgroundColor: scrolled || location.pathname !== '/' || location.search ? '#a871d9' : '#704d8f',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: "#6d3f96"
                        }
                    }} onClick={handleSearchBox}>Book Now</Button>

                    {/* search pop ups #007BFF */}
                    <Dialog open={serachBoxOpen} onClose={handleCloseSearchBox} >
                        <DialogTitle>Book Now</DialogTitle>
                        <DialogContent sx={{ overflow: "auto" }}>
                            <SearchPopup oncloseSearchPop={handleCloseSearchBox} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseSearchBox} color="primary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Menu Icon Button */}
                    <Box sx={{
                        color: 'white', backgroundColor: scrolled || location.pathname !== '/' || location.search ? '#a871d9' : '#704d8f', ml: 1,
                    }}>
                        <Tooltip arrow>

                            <IconButton onClick={handleToggleMenu} size="small" sx={{ color: 'white', marginLeft: 'auto', }}>
                                {openMenu ? <CloseIcon /> : <MenuIcon />} {/* Toggle between Menu and Close icon */}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Dropdown Menu */}
            <Box
                ref={menuRef} // Attach ref to the menu
                sx={{
                    position: isMobile ? 'fixed' : 'fixed',
                    top: '59px', // Adjust this if AppBar height changes
                    right: 0,
                    left: isMobile ? 0 : "80%",
                    backgroundColor: '#704d8f',
                    zIndex: 1000,
                    transition: 'transform 0.3s ease', // Add transition for transform
                    transform: openMenu ? 'translateY(0)' : 'translateY(-100%)', // Slide down when open
                    height: openMenu ? 'auto' : '0', // Set height to auto when open, otherwise 0
                    overflow: 'hidden',
                }}
            >
                <Stack direction="column" sx={{ display: openMenu ? 'block' : 'none' }}>
                    {menuItems.filter(item => item.visible).map((item, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => { handleMenuItemClick(item.text); handleClose(); }}
                            sx={{
                                justifyContent: 'space-between', '&:hover': {
                                    backgroundColor: '#a478cb',
                                    color: 'white',
                                },
                            }} // Space items between
                        >
                            <Typography variant="body1" sx={{ color: "white", ml: 2 }}>
                                {item.text}
                            </Typography>
                            {item.icon && (
                                <ListItemIcon sx={{ justifySelf: 'flex-end', color: "white" }}>
                                    {item.icon}
                                </ListItemIcon>
                            )}
                        </MenuItem>
                    ))}
                </Stack>
            </Box>

            {/* login dialog */}
            <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} maxWidth={false}>
                <DialogContent sx={{ padding: 0, maxWidth: 900 }} fullWidth>

                    <Grid container spacing={2}>

                        {/* Left Side Image */}

                        <Grid
                            item
                            xs={6}
                            sm
                            sx={{
                                display: { xs: 'none', md: 'block' }, // Hide on mobile, show on medium and larger screens
                                justifyContent: 'center',
                                alignItems: 'center',
                                m: 2
                            }}
                        >
                            <img
                                src="https://img.freepik.com/free-photo/mobile-app-location-digital-art_23-2151762857.jpg?t=st=1731165213~exp=1731168813~hmac=3ef1f8cafe29752d4b2b853ff55a50762ac0eeee6cc11a248244953d01552852&w=360"
                                alt="Login Illustration"
                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                            />
                        </Grid>

                        {/* Right Side Content */}
                        <Grid item xs={12} md={6} sx={{ m: 2 }}>
                            <Box sx={{ p: 2 }}>
                                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                                    Log In
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        size='small'
                                        onClick={() => setLoginOpen(false)} // Close the dialog when clicked
                                        aria-label="close"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 20,
                                            backgroundColor: "lightgray",
                                            '&:hover': {
                                                backgroundColor: "#cccc"
                                            }
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </DialogTitle>

                                {loginType === 'phone' ? (
                                    <Grid item xs={12} sm={12}>
                                        <PhoneInput
                                            country={'in'} // Default country set to India (IN)
                                            // value={formData.phone}  // Bind value to the state
                                            onChange={handlePhoneChange}
                                            inputStyle={{
                                                padding: "auto 300px !important"
                                            }}
                                            inputMode="numeric"
                                            inputProps={{
                                                required: true,
                                                autoFocus: true
                                            }}

                                        />

                                    </Grid>
                                ) : (
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            label="Email"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            name="userEmail"
                                            type="email"
                                            onChange={(e) => setLoginInput(e.target.value)}  // Handle email input
                                        />
                                    </Grid>
                                )}

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
                            </Box>
                        </Grid>


                    </Grid>
                </DialogContent>
            </Dialog>
        </Box >
    )
}

export default Header;