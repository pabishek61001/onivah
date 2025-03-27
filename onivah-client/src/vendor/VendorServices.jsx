import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Box, Radio, Slide } from '@mui/material';
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
    {
        name: 'Mandabam',
        route: 'mandabam',
        icon: <LocationCity fontSize="large" sx={{ color: '#FF5733' }} />,
        image: 'https://picsum.photos/200/300?random=1'
    },
    {
        name: 'Party Hall',
        route: 'party_hall',
        icon: <Celebration fontSize="large" sx={{ color: '#C70039' }} />,
        image: 'https://picsum.photos/200/300?random=2'
    },
    {
        name: 'Convention Center',
        route: 'convention_center',
        icon: <LocationCityIcon fontSize="large" sx={{ color: '#900C3F' }} />,
        image: 'https://picsum.photos/200/300?random=3'
    },
    // {
    //     name: 'Hotels',
    //     route: 'hotels',
    //     icon: <Hotel fontSize="large" sx={{ color: '#581845' }} />,
    //     image: 'https://picsum.photos/200/300?random=4'
    // },
    {
        name: 'Resort',
        route: 'resort',
        icon: <Sailing fontSize="large" sx={{ color: '#FFC300' }} />,
        image: 'https://picsum.photos/200/300?random=5'
    },
    {
        name: 'Beach Wedding',
        route: 'beach_wedding',
        icon: <BeachAccess fontSize="large" sx={{ color: '#FF5733' }} />,
        image: 'https://picsum.photos/200/300?random=6'
    },
    {
        name: 'Farm Land',
        route: 'farm_land',
        icon: <Agriculture fontSize="large" sx={{ color: '#DAF7A6' }} />,
        image: 'https://picsum.photos/200/300?random=7'
    },
    {
        name: 'Catering',
        route: 'catering',
        icon: <RestaurantIcon fontSize="large" sx={{ color: '#4CAF50' }} />,
        image: 'https://picsum.photos/200/300?random=8'
    },
    {
        name: 'Photography',
        route: 'photography',
        icon: <CameraAltIcon fontSize="large" sx={{ color: '#3F51B5' }} />,
        image: 'https://picsum.photos/200/300?random=9'
    },
    {
        name: 'Decors',
        route: 'decors',
        icon: <EventIcon fontSize="large" sx={{ color: '#E91E63' }} />,
        image: 'https://picsum.photos/200/300?random=10'
    },
    {
        name: 'Event Planners',
        route: 'event_planners',
        icon: <EventIcon fontSize="large" sx={{ color: '#FF9800' }} />,
        image: 'https://picsum.photos/200/300?random=11'
    },
    {
        name: 'Makeup Artist',
        route: 'makeup_artist',
        icon: <FaceIcon fontSize="large" sx={{ color: '#9C27B0' }} />,
        image: 'https://picsum.photos/200/300?random=12'
    },
    {
        name: 'Wedding Attire',
        route: 'wedding_attire',
        icon: <CheckroomIcon fontSize="large" sx={{ color: '#673AB7' }} />,
        image: 'https://picsum.photos/200/300?random=13'
    },
    {
        name: 'Jewelry',
        route: 'jewelry',
        icon: <DiamondIcon fontSize="large" sx={{ color: '#FFC107' }} />,
        image: 'https://picsum.photos/200/300?random=14'
    },
    {
        name: 'Personal Care - Brides/Groom',
        route: 'personal_care/brides',
        icon: <FavoriteIcon fontSize="large" sx={{ color: '#F44336' }} />,
        image: 'https://picsum.photos/200/300?random=15'
    },
    {
        name: 'Nail Artist',
        route: 'nail_artist',
        icon: <SpaIcon fontSize="large" sx={{ color: '#4A90E2' }} />,
        image: 'https://picsum.photos/200/300?random=16'
    },
    {
        name: 'Mehandi',
        route: 'mehandi',
        icon: <PaletteIcon fontSize="large" sx={{ color: '#8BC34A' }} />,
        image: 'https://picsum.photos/200/300?random=17'
    },
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
            <Header />
            <Grid container spacing={1} sx={{ mt: 10 }}>

                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            width: '100%',  // Ensures full width inside the Grid item
                            height: { xs: 200, sm: 250, md: '100%' },  // Different heights for different screen sizes
                            backgroundImage: 'url("https://images.unsplash.com/photo-1596457221755-b96bc3a6df18?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHdlZGRpbmd8ZW58MHx8MHx8fDA%3D")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            borderRadius: 2,
                        }}
                    />
                </Grid>



                <Grid item xs={12} md={8} sx={{ bgcolor: "#f3f3f369" }}>

                    <Typography
                        variant="h5"
                        color="text.secondary"
                        gutterBottom
                        sx={{ textAlign: 'center', }}
                    >
                        Please Select Your Profile
                    </Typography>

                    <Grid
                        container
                        spacing={2}
                        sx={{
                            mt: 1,
                            // maxHeight: { xs: "50vh", md: "70vh" },
                            overflowY: 'auto',
                            padding: 1,
                        }}
                    >

                        <Grid container spacing={3} sx={{ p: 1 }}>

                            {/* Venue Categories Section */}


                            {venueCategory.map((category) => (
                                <Grid item xs={6} sm={6} md={3} key={category.name}>
                                    <Box
                                        onClick={() => handleSelect(category)}
                                        sx={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            padding: 1,
                                            borderRadius: 10,
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                            opacity: selectedCategory?.name === category.name
                                                ? 1
                                                : 1,
                                            border: selectedCategory?.name === category.name
                                                ? `1px solid ${theme.palette.primary.main}`
                                                : '1px solid transparent',
                                            bgcolor: selectedCategory?.name === category.name
                                                ? "#eeee"
                                                : 'primary',
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={category.image}
                                            alt={category.name}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                objectFit: 'cover',
                                                borderRadius: 20,
                                                border: selectedCategory?.name === category.name
                                                    ? `3px solid ${theme.palette.primary.main}`
                                                    : '3px solid transparent',
                                                transition: 'border-color 0.3s ease',
                                            }}
                                        />

                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontSize: '1.1rem',
                                                color: selectedCategory?.name === category.name
                                                    ? theme.palette.primary.dark
                                                    : '#444',
                                                transition: 'color 0.3s ease',
                                                marginTop: 1.5,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {category.name}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}

                        </Grid>

                    </Grid>


                    {/* Slide-in "Next" Button */}
                    <Box
                        sx={{
                            position: "fixed",  // Keep the button fixed at a position
                            bottom: "1%",         // Position it in the center vertically
                            left: { xs: "50%", md: "90%" },        // Center it horizontally
                            transform: "translate(-50%, -50%)", // Ensure exact center positioning
                            zIndex: 9999,       // High zIndex to overlay everything else
                            width: "100%",      // Full width to cover all content
                            display: "flex",
                            justifyContent: "center",  // Center the button
                            pointerEvents: "none",     // Disable interaction on overlaying element
                        }}
                    >
                        <Slide direction="up" in={Boolean(selectedCategory)} mountOnEnter unmountOnExit timeout={300}>
                            <Box display="flex" justifyContent="center">
                                <Button
                                    endIcon={<NavigateNext />}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        p: 1.5,
                                        width: "200px",
                                        fontWeight: "bold",
                                        pointerEvents: "all", // Enable interaction for the button
                                    }}
                                    onClick={handleNext}
                                >
                                    Next
                                </Button>
                            </Box>
                        </Slide>
                    </Box>
                </Grid>
            </Grid>
        </Box >


    );
};

export default VendorServices;
