import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, Grid, useMediaQuery, Badge, ListItem, ListItemAvatar, Avatar, Drawer, List, ListItemText, Divider, Paper, } from '@mui/material';

import { IconButton, Stack, Dialog, DialogTitle, DialogContent, useScrollTrigger, Slide } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import { apiUrl } from '../Api/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin/GoogleLogin';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon

import Settings from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import HomeIcon from '@mui/icons-material/Home'; // Using a home icon for Home
import InfoIcon from '@mui/icons-material/Info'; // Using an info icon for About
import ArticleIcon from '@mui/icons-material/Article'; // Using an article icon for Blogs
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SearchPopup from './SearchPopup';
import { FavoriteBorderOutlined, Phone, SupportAgentTwoTone, Visibility, Delete, ShoppingBag, FavoriteSharp, Apps, Widgets } from '@mui/icons-material';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useFavorites } from '../Favourites/FavoritesContext';
import Close from '@mui/icons-material/Close';
import ListingServiceCount from './ListingServiceCount';
import withLoadingAndError from '../hoc/withLoadingAndError';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Event, AccountCircle } from '@mui/icons-material'; // You can add more icons as needed
import Home from '@mui/icons-material/Home';
import BrightServiceGrid from '../screens/Rough2';


const services = [
    { text: "Venues", link: "/", image: 'https://cdn.pixabay.com/photo/2025/05/02/15/58/flower-girl-9574211_1280.jpg' },
    { text: "Photography", link: "/about", image: 'https://cdn.pixabay.com/photo/2016/01/09/18/27/camera-1130731_1280.jpg' },
    { text: "Catering", link: "/blogs", image: 'https://cdn.pixabay.com/photo/2019/09/28/17/25/food-4511335_1280.jpg' },
    { text: "Decors", link: "/contact", image: 'https://cdn.pixabay.com/photo/2022/12/16/16/28/flowers-7660120_1280.jpg' },
    { text: "Makeup Artist", link: "/contact", image: 'https://cdn.pixabay.com/photo/2023/10/24/21/15/nature-8339115_1280.jpg' },
    { text: "Wedding Attire", link: "/contact", image: 'https://cdn.pixabay.com/photo/2025/05/02/15/58/flower-girl-9574211_1280.jpg' },
    { text: "Jewelry", link: "/contact", image: 'https://cdn.pixabay.com/photo/2016/02/12/14/05/rings-1196145_1280.jpg' },
    { text: "Personal Care", link: "/contact", image: 'https://cdn.pixabay.com/photo/2023/10/24/21/15/nature-8339115_1280.jpg' },
    { text: "Mehandi", link: "/contact", image: 'https://cdn.pixabay.com/photo/2019/01/21/15/06/blueberries-3946230_1280.jpg' },
    { text: "Garlands", link: "/contact", image: 'https://cdn.pixabay.com/photo/2017/08/02/01/01/living-room-2569325_1280.jpg' },
    { text: "Customized Gifts", link: "/contact", image: 'https://cdn.pixabay.com/photo/2025/05/02/15/58/flower-girl-9574211_1280.jpg' },
    { text: "Wedding Cakes", link: "/contact", image: 'https://cdn.pixabay.com/photo/2025/05/02/15/58/flower-girl-9574211_1280.jpg' },
    { text: "Music / DJ", link: "/contact", image: 'https://cdn.pixabay.com/photo/2019/09/28/17/25/food-4511335_1280.jpg' },
];

function HideOnScroll({ children }) {
    const trigger = useScrollTrigger({ threshold: 0 }); // More responsive to slight scrolls
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

function HideOnScrollBottomNav({ children }) {
    const trigger = useScrollTrigger({ threshold: 0 }); // More responsive to slight scrolls
    return (
        <Slide appear={false} direction="up" in={!trigger}>
            {children}
        </Slide>
    );
}






const Header = ({ loading, setLoading, error, setError }) => {



    const isMobile = useMediaQuery('(max-width:600px)'); // Adjust the breakpoint as needed

    const token = localStorage.getItem('onivah_token'); // Check for token in local storage

    const location = useLocation();
    const navigate = useNavigate();

    const { favorites, toggleFavorite } = useFavorites(); // Get global favorites
    const [drawerOpen, setDrawerOpen] = useState(false);

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
        setOpenMenu(false)
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
        { text: 'Help Center', icon: <SupportAgentTwoTone fontSize="small" color='white' />, visible: true }, // Always show
        { text: 'Log Out', icon: <LogoutOutlined fontSize='small' color='white' />, visible: !!token }, // Show only if token exists
    ];

    const bottomNav = [
        {
            label: 'Favorites',
            icon: <FavoriteSharp fontSize='small' />,
            onClick: () => navigate('/favorites'),
        },
        {
            label: 'Home',
            icon: <Home fontSize='small' />,
            onClick: () => navigate('/'),
        },
        {
            label: 'Book Now',
            icon: <Widgets fontSize='small' />,
            onClick: () => setSearchBoxOpen(!serachBoxOpen),
        },
        {
            label: !!token ? 'Profile' : 'Log In',
            icon: <AccountCircle fontSize='small' />,
            onClick: () => setLoginOpen(!loginOpen),
        },
    ];

    const [loginType, setLoginType] = useState('email'); // 'phone' or 'email'
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [loginInput, setLoginInput] = useState(''); // Store phone or email input
    const [showOTPField, setShowOTPField] = useState(false); // Display OTP field after request
    const [otp, setOtp] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'

    const handleMenuItemClick = (text) => {
        switch (text) {
            case 'Log In':
                setLoginOpen(true)
                console.log('Log In clicked');
                break;
            case 'Sign Up':
                setSignupOpen(true)
                console.log('Sign Up clicked');
                break;
            case 'Become a Vendor':
                window.location.href = "/become-a-vendor";
                break;
            case 'Help center':
                console.log('Help center clicked');
                break;
            case 'Profile':
                navigate("/profile")
                break;
            case 'Log Out':
                localStorage.removeItem("onivah_token");
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
        console.log(value);
        const formattedPhone = `+${value.replace(/^(\+)?/, '')}`; // Add '+' if not already there

        // setFormData({
        //     ...formData,
        //     phone: value, // Store only the phone number
        //     dialCode: country.dialCode,
        // });
        setLoginInput(formattedPhone) // Handle phone input


    };

    // Handle OTP request
    const handleSendOtp = async () => {
        if (loginInput.trim() === "") {
            return alert(`Please fill the ${loginType} field !`)
        }
        setLoading(true)

        try {
            const response = await axios.post(`${apiUrl}/${loginOpen ? "login" : "signup"}/send-otp`, {
                [loginType === 'phone' ? 'phone' : 'email']: loginInput,
                userType: loginType // Send userType as 'phone' or 'email'
            });
            if (response.data.success) {
                setLoading(false)
                setShowOTPField(true); // Display OTP field if request is successful
                setSnackbarSeverity('success');
                setSnackbarMessage(response.data.message);
                setSnackbarOpen(true);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            setLoading(false)
            alert(error.response.data.message);
            console.log('Error sending OTP:', error);
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${apiUrl}/login/verify-otp`, {
                loginInput, otp, signUp: !loginOpen,
            }, { withCredentials: true });
            if (response.data.success) {
                const token = response.data.token;

                setSnackbarSeverity('success');
                setSnackbarMessage('Verification successful!');
                setSnackbarOpen(true);

                // Close the appropriate modal based on the flow
                if (loginOpen) {
                    setLoginOpen(false);
                } else {
                    setSignupOpen(false);
                }
                setLoading(false)
                localStorage.setItem("onivah_token", token);
                setLoginOpen(false)
            } else {
                setLoading(false)
                setSnackbarSeverity('error');
                setSnackbarMessage(response.data.message || 'Invalid OTP');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setLoading(false)
            console.error('Error verifying OTP:', error);
            setSnackbarOpen(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('An error occurred while verifying the OTP. Please try again.');
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
                setScrolled(window.scrollY > 70);
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [value, setValue] = useState(null);

    // Handler for changing the selected menu
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const handleNavigate = (category, productId) => {
        navigate(`/category/${category}/${productId}`);
    };

    const handleViewAll = () => {
        navigate(`/favorites`);
    };

    // #38a1f7


    return (
        <Box >
            {/* App Bar */}

            <HideOnScroll>

                <AppBar
                    position='fixed'
                    elevation={0}
                    sx={{
                        top: scrolled || location.pathname !== '/' || location.search ? 0 : 10,
                        // top: scrolled ? '0' : isMobile ? '56px' : '60px',
                        backgroundColor: scrolled || location.pathname !== '/' || location.search ? '#704d8f' : 'transparent',
                        borderBottomRightRadius: scrolled || location.search ? 3 : 0,
                        borderBottomLeftRadius: scrolled || location.search ? 3 : 0,
                        transition: 'transform 0.3s ease', // Smooth transition
                        // transform: scrolled ? 'translateY(0)' : 'translateY(-100%)', // Slide down effect #4169E1
                    }}
                >
                    <Toolbar sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <img
                                src={require("../images/logo/onivah_logo2.png")}
                                alt="ONIVAH Logo"
                                style={{ height: 30, width: 100, borderRadius: 5 }} // Adjust size as needed
                            />
                        </Box>

                        <Box>
                            {
                                !isMobile && (
                                    <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                                        {[
                                            { text: 'Home', link: '/' },
                                            { text: 'About', link: '/about' },
                                            { text: 'Blogs', link: '/blogs' },
                                            { text: 'Contact', link: '/contact' },
                                            // { text: 'Gallery', link: '/contact' }
                                        ].map(({ text, link }) => (
                                            <Button
                                                key={link}
                                                href={link}
                                                sx={{
                                                    color: scrolled || location.pathname !== '/' || location.search ? 'white' : 'black',
                                                    textTransform: "none",
                                                    fontSize: "medium",
                                                    // fontWeight: "bold",
                                                    '&:hover': {
                                                        backgroundColor: 'primary.light',
                                                        color: 'white',
                                                    },
                                                }}
                                            >
                                                {text}
                                            </Button>
                                        ))}

                                        {/* <BrightServiceGrid /> */}

                                        <div className="dropdown">
                                            <button className="dropdown-button" style={{ color: scrolled || location.pathname !== '/' || location.search ? 'white' : 'black', }}>Services ▾</button>
                                            {/* <div className="dropdown-content"> */}
                                            <Box className="dropdown-content" sx={{
                                                px: { xs: 1, sm: 3 },
                                                py: 3,
                                                bgcolor: '#f3eaff',
                                                borderRadius: 2,
                                                maxWidth: 1000,
                                                mx: 'auto',
                                                maxHeight: "auto",
                                                overflow: "auto",
                                                zIndex: 999999,  // Ensure this is above all other content
                                            }}>
                                                <Grid container spacing={3}>
                                                    {services.map((service, index) => (
                                                        <Grid item xs={6} sm={6} md={3} key={index}>
                                                            <Paper
                                                                elevation={5}
                                                                sx={{
                                                                    height: 80,
                                                                    cursor: "pointer",
                                                                    mb: 2,
                                                                    borderRadius: 3,
                                                                    bgcolor: '#1E1E2F',
                                                                    color: '#fff',
                                                                    transition: 'transform 0.2s ease-in-out',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    '&:hover': {
                                                                        transform: 'scale(1.04)',
                                                                        boxShadow: 12,
                                                                    },
                                                                }}
                                                            >
                                                                {/* Left Image */}
                                                                <Box
                                                                    sx={{
                                                                        width: '30%',
                                                                        height: '100%',
                                                                        borderTopRightRadius: '50%',
                                                                        borderBottomRightRadius: '50%',
                                                                        overflow: 'hidden',
                                                                        mr: 2,
                                                                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={service.image}
                                                                        alt={service.name}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'cover',
                                                                        }}
                                                                    />
                                                                </Box>

                                                                {/* Right Text */}
                                                                <Typography variant="subtitle2" sx={{ color: "white" }}>
                                                                    {service.text}
                                                                </Typography>
                                                            </Paper>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>

                                            {/* </div> */}
                                        </div>
                                    </Stack>
                                )
                            }

                        </Box>

                        {/* search pop ups #007BFF */}
                        <Dialog
                            open={serachBoxOpen}
                            onClose={handleCloseSearchBox}
                            maxWidth="md"
                            fullWidth
                            sx={{
                                '& .MuiDialog-paper': {
                                    borderRadius: 3,
                                    boxShadow: 6,
                                }
                            }}
                        >

                            <DialogContent
                                sx={{
                                    overflowY: "auto",
                                    maxHeight: "70vh",
                                    bgcolor: "#f7eeff",
                                    p: { xs: 0, md: 1 },
                                }}
                            >
                                <Grid
                                    container
                                    alignItems="center"
                                    direction={{ xs: "column", md: "row" }} // Column for xs, Row for md
                                >
                                    {/* Image: Appears below content in xs, first in md */}
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        sx={{
                                            textAlign: "center",
                                            order: { xs: 2, md: 1 }, // Image below content for xs, first for md
                                        }}
                                    >
                                        <img
                                            src="https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=600"
                                            alt="Popup Illustration"
                                            style={{
                                                width: "100%",
                                                maxWidth: "300px", // Adjust for larger screens
                                                height: 300,
                                                borderRadius: "8px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Grid>

                                    {/* Content: Appears first in xs, second in md */}
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        sx={{
                                            width: "100%",
                                            m: 0,
                                            p: 2,
                                            order: { xs: 1, md: 2 }, // Content first for xs, second for md
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                fontWeight: "bold",
                                                fontSize: "1.5rem",
                                                color: "primary.main",
                                                mb: 4
                                            }}
                                        >
                                            Book Now
                                            <IconButton onClick={handleCloseSearchBox} sx={{ color: "grey.600" }}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Typography>
                                        <SearchPopup oncloseSearchPop={handleCloseSearchBox} />
                                    </Grid>
                                </Grid>

                            </DialogContent>

                        </Dialog>


                        <Box sx={{ display: "flex", flexDirection: "row" }}>

                            {/* search */}
                            <ListingServiceCount color={scrolled || location.pathname !== '/' || location.search ? 'white' : "black"} />

                            {/* Login Button */}
                            <Button color="inherit" sx={{
                                display: { xs: 'none', md: 'flex' },
                                maxWidth: 200,
                                ml: 1,
                                mr: 1,
                                px: 2,
                                visible: !token,
                                backgroundColor: scrolled || location.pathname !== '/' || location.search ? '#a871d9' : '#704d8f',
                                color: 'white',
                                textTransform: "none",
                                fontWeight: "bold",
                                '&:hover': {
                                    transition: 'border 0.3s ease',
                                    border: "1px solid white",
                                    backgroundColor: "#6d3f96"
                                }
                            }} onClick={handleSearchBox}>Book Now</Button>

                            {/* Favorites Button with Count */}
                            <IconButton sx={{
                                marginRight: isMobile ? 0 : 0,
                            }} onClick={() => setDrawerOpen(true)} color="inherit">
                                <Badge badgeContent={favorites.length} color="error">
                                    <FavoriteBorderOutlined sx={{ color: scrolled || location.pathname !== '/' || location.search ? 'white' : "black", }} />
                                </Badge>
                            </IconButton>

                            {/* menu */}
                            <IconButton onClick={handleToggleMenu} size="small" sx={{ color: 'white', }}>
                                {openMenu ? <CloseIcon sx={{ color: scrolled || location.pathname !== '/' || location.search ? 'white' : "black", }} /> : <MenuIcon sx={{ color: scrolled || location.pathname !== '/' || location.search ? 'white' : "black", }} />} {/* Toggle between Menu and Close icon */}
                            </IconButton>

                        </Box>
                    </Toolbar>
                </AppBar>
            </HideOnScroll >

            {/* Dropdown Menu */}
            < Box
                ref={menuRef}
                sx={{
                    height: isMobile ? '100%' : 'auto',
                    position: 'fixed',
                    top: isMobile ? '0px' : '67px',
                    right: isMobile ? '0%' : '1%',
                    // left: isMobile ? '5%' : 'auto',
                    width: isMobile ? '100%' : '250px',
                    borderRadius: 3,
                    // backdropFilter: 'blur(20px)', // Enhanced blur effect
                    backgroundColor: '#000', // Glass effect
                    // backgroundColor: '#000000a3', // Glass effect
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                    zIndex: 9999,
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    transform: openMenu ? 'translateX(0)' : 'translateX(-20px)', // Slide from top
                    opacity: openMenu ? 1 : 0,
                    visibility: openMenu ? 'visible' : 'hidden',
                    transformOrigin: 'top center',
                    overflow: 'hidden',
                    padding: openMenu ? 0 : 0,
                }}
            >
                <Stack
                    direction="column" sx={{
                        display: openMenu ? 'block' : 'none',
                    }}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', padding: '8px', mb: isMobile ? 5 : '0px', }}>
                        {/* Logo on the left */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
                            <img src={require("../images/logo/onivah_logo2.png")}
                                alt="Logo" style={{ height: 30, borderRadius: 5 }} />
                        </Box>

                        {/* Close icon on the right */}
                        <IconButton size='small' sx={{ display: { xs: 'flex', md: 'none' }, bgcolor: "#73737338", mr: 1 }} onClick={() => setOpenMenu(false)}>
                            <CloseIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </Stack>
                    {menuItems.filter(item => item.visible).map((item, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => { handleMenuItemClick(item.text); handleClose(); }}
                            sx={{
                                justifyContent: 'space-between', mb: 1, '&:hover': {
                                    backgroundColor: 'darkgrey',
                                    borderRadius: 2,
                                    color: 'white',
                                },
                            }} // Space items between
                        >
                            <Typography variant="body1" sx={{ color: "white", ml: 2, borderBottom: "1px solid grey", }}>
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
            </Box >

            {/* login dialog */}
            < Dialog open={loginOpen || signupOpen}
                onClose={() => {
                    setLoginOpen(false);
                    setSignupOpen(false);
                }}
                maxWidth={false} >
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
                                    {loginOpen ? "Log In" : "Sign Up"}
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        size='small'
                                        onClick={() => {
                                            setLoginOpen(false);
                                            setSignupOpen(false);
                                        }} // Close the dialog when clicked
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
                                        disabled={loading}
                                        sx={{ color: 'white', p: 1, fontSize: "1rem" }}
                                        onClick={handleSendOtp}
                                    >
                                        {loading ? 'Sending OTP' : 'Continue'}
                                    </Button>
                                ) : (
                                    <Box>
                                        <TextField
                                            label="Enter OTP"
                                            variant="outlined"
                                            fullWidth
                                            disabled={loading}
                                            margin="normal"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                        <Stack direction='row' justifyContent='space-evenly' sx={{ mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                sx={{ color: 'white', p: 1, fontSize: "1rem", minWidth: 150 }}
                                                onClick={handleVerifyOtp}
                                            >
                                                {loading ? 'Verifying' : 'Verify'}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                disabled={loading}
                                                sx={{ p: 1, fontSize: "1rem", minWidth: 150 }}
                                                onClick={handleSendOtp}
                                            >
                                                {loading ? 'Resending' : 'Resend'}
                                            </Button>
                                        </Stack>
                                    </Box>
                                )}

                                <Typography sx={{ textAlign: "center", marginTop: 2 }}> OR</Typography>

                                <Grid container spacing={2} sx={{ marginTop: 1 }}>

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
            </Dialog >

            {/* Slide-in Drawer for Favorites */}
            < Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: { xs: "100vw", md: "50vw" }, // Half-screen width
                        maxWidth: "400px",
                        backgroundColor: "#f9f9f9", // Soft light background
                        color: "#333",
                        padding: "20px",
                    }
                }}
            >
                {/* Top Header with Close Icon */}
                < Box display="flex" alignItems="center" justifyContent="space-between" mb={2} >
                    <Typography variant="h5" color='primary' fontWeight={900}>
                        Favorites ({favorites.length})
                    </Typography>
                    <IconButton onClick={() => setDrawerOpen(false)}>
                        <Close />
                    </IconButton>
                </Box >
                <Typography
                    variant="caption"
                    color='grey'
                    sx={{ mb: 2, textAlign: "left", }} // Blue highlight
                >
                    Add items to your wishlist now so you don't forget to add to cart later
                </Typography>

                <List>
                    {favorites.length > 0 ? (
                        favorites.map((service) => (
                            <ListItem
                                key={service._id}
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: "10px",
                                    background: "#ffffff", // White card background
                                    padding: "12px",
                                    marginBottom: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                                    transition: "0.3s",
                                    "&:hover": { boxShadow: "0px 6px 12px rgba(0,0,0,0.15)" }
                                }}
                            >
                                {/* Service Image */}
                                {service.images && (
                                    <img
                                        src={service.images.CoverImage?.[0]}
                                        alt={service.businessName}
                                        width={60} height={60}
                                        style={{
                                            borderRadius: "8px",
                                            marginRight: "15px",
                                            objectFit: "cover",
                                            border: "2px solid #90caf9" // Light blue border
                                        }}
                                    />
                                )}

                                {/* Service Details */}
                                <ListItemText
                                    onClick={() => handleNavigate(service.category, service._id)}
                                    color='primary'
                                    sx={{ flexGrow: 1, }}
                                    primary={
                                        <Typography fontWeight="bold" color="#1976d2"> {/* Deep Blue */}
                                            {service.businessName}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="grey">
                                            Category: {service.category
                                                ?.replace(/_/g, " ") // Remove underscores
                                                .split(" ") // Split into words
                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Convert to Pascal Case
                                                .join(" ")}
                                        </Typography>
                                    }

                                />

                                {/* View & Delete Buttons */}
                                <Stack direction="row" spacing={1}>
                                    <IconButton
                                        onClick={() => navigate(`/category/${service.category}/${service._id}`)}
                                    >
                                        <ShoppingBag color='primary' />
                                    </IconButton>

                                    <IconButton
                                        onClick={() => toggleFavorite(service)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Stack>

                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ color: "grey", textAlign: "center" }}>No favorites added.</Typography>
                    )}
                </List>

                {/* Close Button */}
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent='space-evenly'>
                    {/* Close Button */}
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        sx={{ maxWidth: 150, mt: 2, borderRadius: "20px", fontWeight: "bold", fontSize: "16px" }}
                        onClick={() => setDrawerOpen(false)}
                    >
                        Close
                    </Button>

                    {/* View All Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ maxWidth: 150, mt: 2, borderRadius: "20px", fontWeight: "bold", fontSize: "16px", color: "white" }}
                        onClick={() => handleViewAll()}
                    >
                        View All
                    </Button>
                </Box>
            </Drawer >


            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <HideOnScrollBottomNav>
                <BottomNavigation
                    value={value}
                    onChange={handleChange}
                    showLabels
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        backgroundColor: '#f2e8ff',// '#f7f1ff',
                        color: 'white',
                        p: 1,
                        zIndex: 99999,
                        borderTop: '1px solid #ddd',
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20,
                        justifyContent: 'space-evenly',
                        // boxShadow: '0px -2px 15px rgba(0, 0, 0, 0.2)',
                        boxShadow: 0,
                    }}
                >
                    {bottomNav.map((item, index) => (
                        <BottomNavigationAction
                            key={index}
                            label={item.label}
                            icon={item.icon}
                            onClick={item.onClick}
                            sx={{
                                color: '#686868',
                                '&.Mui-selected': {
                                    color: 'darkpurple',
                                },
                                '& .MuiBottomNavigationAction-label': {
                                    fontSize: '0.65rem', // consistent font size
                                    fontWeight: 500,
                                    transition: 'none', // disables animation on selection
                                    '&.Mui-selected': {
                                        fontSize: '0.75rem', // override again for selected
                                        fontWeight: 500,
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        />
                    ))}

                </BottomNavigation>
            </HideOnScrollBottomNav>
        </Box >
    )
}

export default withLoadingAndError(Header);