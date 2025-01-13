import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Box, Radio } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import PaletteIcon from '@mui/icons-material/Palette';
import FaceIcon from '@mui/icons-material/Face';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EventIcon from '@mui/icons-material/Event';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import DiamondIcon from '@mui/icons-material/Diamond';
import FavoriteIcon from '@mui/icons-material/Favorite';
import theme from '../Themes/theme';
import { Agriculture, BeachAccess, Celebration, Hotel, LocationCity, LocationCitySharp, NavigateNext, Sailing, } from '@mui/icons-material';
import Aos from 'aos';
import "aos/dist/aos.css"; // AOS styles
import Header from '../components/Header';


const venueCategory = [
    { name: 'Mandabam', route: 'mandabam', icon: <LocationCity fontSize="large" sx={{ color: '#FF5733' }} /> },
    { name: 'Party Hall', route: 'party-hall', icon: <Celebration fontSize="large" sx={{ color: '#C70039' }} /> },
    { name: 'Convention Center', route: 'convention-center', icon: <LocationCityIcon fontSize="large" sx={{ color: '#900C3F' }} /> },
    { name: 'Hotels', route: 'hotels', icon: <Hotel fontSize="large" sx={{ color: '#581845' }} /> },
    { name: 'Resort', route: 'resort', icon: <Sailing fontSize="large" sx={{ color: '#FFC300' }} /> },
    { name: 'Beach Wedding', route: 'beach-wedding', icon: <BeachAccess fontSize="large" sx={{ color: '#FF5733' }} /> },
    { name: 'Farm Land', route: 'farm-land', icon: <Agriculture fontSize="large" sx={{ color: '#DAF7A6' }} /> },
];

const otherServices = [
    { name: 'Catering', route: 'catering', icon: <RestaurantIcon fontSize="large" sx={{ color: '#4CAF50' }} /> },
    { name: 'Photography', route: 'photography', icon: <CameraAltIcon fontSize="large" sx={{ color: '#3F51B5' }} /> },
    { name: 'Decors', route: 'decors', icon: <EventIcon fontSize="large" sx={{ color: '#E91E63' }} /> },
    { name: 'Event Planners', route: 'event_planners', icon: <EventIcon fontSize="large" sx={{ color: '#FF9800' }} /> },
    { name: 'Makeup Artist', route: 'makeup-artist', icon: <FaceIcon fontSize="large" sx={{ color: '#9C27B0' }} /> },
    { name: 'Wedding Attire', route: 'wedding-attire', icon: <CheckroomIcon fontSize="large" sx={{ color: '#673AB7' }} /> },
    { name: 'Jewelry', route: 'jewelry', icon: <DiamondIcon fontSize="large" sx={{ color: '#FFC107' }} /> },
    { name: 'Personal Care - Brides/Groom', route: 'personal-care/brides', icon: <FavoriteIcon fontSize="large" sx={{ color: '#F44336' }} /> },
    { name: 'Nail Artist', route: 'nail-artist', icon: <SpaIcon fontSize="large" sx={{ color: '#4A90E2' }} /> },
    { name: 'Mehandi', route: 'mehandi', icon: <PaletteIcon fontSize="large" sx={{ color: '#8BC34A' }} /> },
];




const VendorServices = () => {

    useEffect(() => {
        // Initialize AOS with custom settings
        Aos.init({
            duration: 1000, // Duration of the animation
            easing: "ease-out", // Easing function
            once: false, // Animations repeat on scrolling again
            offset: 200, // Offset, triggers animation when 200px away from viewport
            delay: 100, // Delay between animations if needed
        });

        // Re-initialize AOS on every render, which can be useful for dynamic content
        Aos.refresh();
    }, []);

    const [showVenues, setShowVenues] = useState(false)

    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    const handleSelect = (category) => {
        setSelectedCategory(category);
    };

    const handleNext = () => {
        if (selectedCategory) {
            navigate(`/vendor-services/${selectedCategory.route}`);
        }
    };

    const handleVenueCategory = () => {
        setShowVenues(!showVenues)
    }

    return (
        <Box>
            {/* <Header /> */}
            <Grid container spacing={3} sx={{ height: "100vh", }}>

                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            height: { xs: '100px', md: '100%' },  // Adjust height for mobile and larger screens
                            backgroundImage: 'url("https://img.freepik.com/free-photo/luxurious-dinner-hall-with-large-crystal-chandelier_8353-565.jpg?t=st=1731681900~exp=1731685500~hmac=8e972a1fd2c617c6d115affe0ed37b05d5824a5c5987cd281f1e0d60fe713615&w=900")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                </Grid>


                <Grid item xs={12} md={8} sx={{ bgcolor: "#f3f3f369" }}>
                    <Box sx={{ p: 3 }}>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            gutterBottom
                            sx={{ textAlign: 'center', fontWeight: 700 }}
                        >
                            Please Select Your Profile
                        </Typography>

                        <Grid
                            container
                            spacing={2}
                            sx={{
                                mt: 3,
                                maxHeight: { xs: "50vh", md: "60vh" },
                                overflowY: 'auto',
                                padding: 1,
                            }}
                        >


                            {/* Other Services Section */}
                            <div>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{
                                        p: 3,
                                        letterSpacing: 1,
                                        textAlign: { xs: 'left' },
                                        fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                    }}
                                >
                                    Services
                                </Typography>
                                <Button
                                    endIcon={<LocationCity />}
                                    onClick={handleVenueCategory}
                                    sx={{
                                        p: 5,
                                        m: 1,
                                        maxWidth: 250,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 2,
                                        bgcolor: "white",
                                        boxShadow: 2,
                                        color: "black"
                                    }}
                                >
                                    {showVenues ? "Hide Venues services" : "Show Venues services"}
                                </Button>
                                {/* <Button
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        m: 2,
                                        maxWidth: 250,
                                        textTransform: 'none', // Prevent uppercase text
                                        borderRadius: 2,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                </Button> */}


                                <Grid container spacing={3} sx={{ p: 1 }}>

                                    {/* Venue Categories Section */}
                                    {
                                        showVenues &&
                                        <div>
                                            <Grid container spacing={3} sx={{ p: 3 }}>
                                                {venueCategory.map((category, index) => (
                                                    <Grid item xs={6} sm={6} md={4} key={category.name}>
                                                        <Card
                                                            onClick={() => handleSelect(category)}
                                                            sx={{
                                                                p: 1,
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderRadius: 2,
                                                                border: selectedCategory?.name === category.name
                                                                    ? `2px solid ${theme.palette.primary.main}`
                                                                    : '1px solid #ddd',
                                                                boxShadow: selectedCategory?.name === category.name
                                                                    ? `0 4px 12px rgba(${theme.palette.primary.main}, 0.3)`
                                                                    : 1,
                                                                backgroundColor: selectedCategory?.name === category.name
                                                                    ? theme.palette.action.hover
                                                                    : '#fff',
                                                                transition: 'all ease',
                                                                '&:hover': {
                                                                    boxShadow: `0 6px 18px rgba(0, 0, 0, 0.15)`,
                                                                    transform: 'scale(1.02)',
                                                                    borderColor: theme.palette.primary.main,
                                                                },
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    color: selectedCategory?.name === category.name
                                                                        ? theme.palette.primary.main
                                                                        : '#555',
                                                                    p: 1,
                                                                    transition: 'color 0.3s ease',
                                                                }}
                                                            >
                                                                {category.icon}
                                                            </Box>
                                                            <CardContent sx={{ padding: 0, textAlign: 'center' }}>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    sx={{
                                                                        fontSize: '1rem',
                                                                        fontWeight: 500,
                                                                        color: selectedCategory?.name === category.name
                                                                            ? theme.palette.primary.main
                                                                            : '#333',
                                                                        transition: 'color 0.3s ease',
                                                                    }}
                                                                >
                                                                    {category.name}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </div>
                                    }


                                    {otherServices.map((category, index) => (
                                        <Grid item xs={6} sm={6} md={4} key={category.name}>
                                            <Card
                                                onClick={() => handleSelect(category)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 2,
                                                    border: selectedCategory?.name === category.name
                                                        ? `2px solid ${theme.palette.primary.main}`
                                                        : '1px solid #ddd',
                                                    boxShadow: selectedCategory?.name === category.name
                                                        ? `0 4px 12px rgba(${theme.palette.primary.main}, 0.3)`
                                                        : 1,
                                                    backgroundColor: selectedCategory?.name === category.name
                                                        ? theme.palette.action.hover
                                                        : '#fff',
                                                    transition: 'all ease',
                                                    '&:hover': {
                                                        boxShadow: `0 6px 18px rgba(0, 0, 0, 0.15)`,
                                                        transform: 'scale(1.02)',
                                                        borderColor: theme.palette.primary.main,
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        color: selectedCategory?.name === category.name
                                                            ? theme.palette.primary.main
                                                            : '#555',
                                                        p: 1,
                                                        transition: 'color 0.3s ease',
                                                    }}
                                                >
                                                    {category.icon}
                                                </Box>
                                                <CardContent sx={{ padding: 0, textAlign: 'center' }}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontSize: '1rem',
                                                            fontWeight: 500,
                                                            color: selectedCategory?.name === category.name
                                                                ? theme.palette.primary.main
                                                                : '#333',
                                                            transition: 'color 0.3s ease',
                                                        }}
                                                    >
                                                        {category.name}
                                                    </Typography>
                                                </CardContent>
                                            </Card>


                                        </Grid>
                                    ))}
                                </Grid>
                            </div>
                        </Grid>


                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "end", p: 1 }}>

                            <Button
                                endIcon={
                                    <NavigateNext />
                                }
                                variant="contained"
                                color="primary"
                                sx={{ mt: 4, p: 1.5, width: "200px", fontWeight: 'bold', }}
                                disabled={!selectedCategory}
                                onClick={handleNext}
                            >
                                Next
                            </Button>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>


    );
};

export default VendorServices;
