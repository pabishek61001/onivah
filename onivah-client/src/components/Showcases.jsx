import React, { useState } from 'react';
import { Box, Button, Container, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import theme from '../Themes/theme';
import '@splidejs/react-splide/css';

const Showcases = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if it's mobile size

    const [hoveredIndex, setHoveredIndex] = useState(null);

    const slides = [
        {
            title: 'Party Hall',
            image: 'https://img.freepik.com/free-photo/new-clean-luxury-restaurant-european-style-amara-dolce-vita-luxury-hotel-resort-tekirova-kemer-turkey_146671-18744.jpg?ga=GA1.1.1773690977.1730112906&semt=ais_hybrid'
        },
        {
            title: 'Photography',
            image: 'https://img.freepik.com/free-photo/dslr-camera-with-strap-hanging-photographer-rsquo-s-shoulder_53876-123605.jpg?t=st=1730889799~exp=1730893399~hmac=1c80bf0441e2611d3d5a0ac97955538d0d2641903235a07d12bf3b164e73d5a9&w=1060'
        },
        {
            title: 'Catering',
            image: 'https://img.freepik.com/free-photo/waiter-keeps-salver-with-snacks_8353-9582.jpg?ga=GA1.1.1773690977.1730112906&semt=ais_hybrid'
        },
        {
            title: 'Decors',
            image: 'https://images.pexels.com/photos/6578458/pexels-photo-6578458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
            title: 'Event Planner',
            image: 'https://images.pexels.com/photos/7648306/pexels-photo-7648306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
            title: 'Makeup Artist',
            image: 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
            title: 'Wedding Attire',
            image: 'https://images.pexels.com/photos/27048277/pexels-photo-27048277/free-photo-of-woman-hands-holding-man-bow-tie.jpeg?auto=compress&cs=tinysrgb&w=600'
        },
        {
            title: 'Jewelry',
            image: 'https://images.pexels.com/photos/2106685/pexels-photo-2106685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
            title: 'Personal Care:Bride/Groom',
            image: 'https://images.pexels.com/photos/6764935/pexels-photo-6764935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
            title: 'Mehandi',
            image: 'https://images.pexels.com/photos/13102907/pexels-photo-13102907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
            title: 'Garlands',
            image: 'https://images.pexels.com/photos/13102907/pexels-photo-13102907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        ,
        {
            title: 'Customized return gifts',
            image: 'https://images.pexels.com/photos/2106685/pexels-photo-2106685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
            title: 'wedding cakes',
            image: 'https://images.pexels.com/photos/6764935/pexels-photo-6764935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
            title: 'Fun activities/ Music, DJ, Pattu Katcheri',
            image: 'https://images.pexels.com/photos/13102907/pexels-photo-13102907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
    ];

    const formatCategory = (str) => {
        return str
            .split(' ')  // Split the string into words
            .map((word, index) =>
                index === 0 ? word.toLowerCase() : word.charAt(0).toLowerCase() + word.slice(1).toLowerCase()
            )
            .join('_');  // Join the words using '_'
    };

    const handleRouting = (page) => {
        const pageTitle = formatCategory(page);  // Convert title to camel case
        navigate(`/service/${pageTitle}`);  // Use the camel case version for routing
    };

    const handlers = useSwipeable({
        trackMouse: true,
    });

    return (
        <Container sx={{ mb: 6, mt: 4 }}>
            <Box sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography
                    textAlign="center"
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: 1,
                        textTransform: 'none',
                        color: "#5c3d77"
                    }}
                >
                    Our Event Spaces
                </Typography>
                <Typography
                    variant="subtitle1"
                    color='text.secondary'
                    sx={{
                        fontSize: "1rem",
                        textAlign: "center",
                        marginBottom: '30px',
                    }}
                >
                    We all live in an age that belongs to the young at heart. Life that is becoming extremely fast,
                </Typography>
            </Box>

            <Splide options={{ perPage: 4, arrows: true, pagination: true, autoplay: false, gap: '1em', breakpoints: { 600: { perPage: 2 }, 900: { perPage: 2 }, 1200: { perPage: 3 }, 1800: { perPage: 4 }, 3000: { perPage: 5 } } }} aria-label="Splide carousel">

                {slides.map((slide, index) => (
                    <SplideSlide key={index}>
                        <Box
                            onClick={() => handleRouting(slide.title)}
                            sx={{
                                position: 'relative',
                                // minWidth: isMobile ? '80%' : '30%', // Adjust width based on screen size
                                height: 300,
                                borderRadius: 2,
                                boxShadow: 6,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: hoveredIndex === index ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
                                mb: 4,
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundImage: `url(${slide.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: hoveredIndex === index ? 'brightness(50%)' : 'brightness(100%)',
                                    transition: 'filter 0.3s ease',
                                }}
                            />
                            <Button
                                sx={{
                                    position: 'absolute',
                                    bottom: 20,
                                    left: 20,
                                    zIndex: 2,
                                    backgroundColor: hoveredIndex === index || isMobile ? '#8e5fbc' : 'black',
                                    color: 'white',
                                    padding: '8px 16px',
                                    fontWeight: 600,
                                    letterSpacing: 1,
                                    textAlign: 'center',
                                    width: 'calc(100% - 40px)',
                                }}
                            >
                                {slide.title}
                            </Button>
                        </Box>
                    </SplideSlide>
                ))}
            </Splide>
        </Container >
    );
};

export default Showcases;
