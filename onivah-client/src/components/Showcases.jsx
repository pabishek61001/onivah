import React, { useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Box, Button, Container, Typography, useMediaQuery } from '@mui/material';
import '@splidejs/react-splide/css';
import { useNavigate } from 'react-router-dom';

const Showcases = () => {
    const navigate = useNavigate()
    const isMobile = useMediaQuery('(max-width:600px)'); // Adjust the breakpoint as needed

    const [hoveredIndex, setHoveredIndex] = useState(null);

    const slides = [
        {
            title: 'venue',
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
            title: 'Event Planners',
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
    ];

    const handleRouting = (page) => {
        navigate(`/service/${page}`)
    }

    return (
        <Container sx={{ mt: 5, mb: 6 }} >
            <Box sx={{ p: 4 }}>
                <Typography variant='h4' color='primary' gutterBottom sx={{ fontWeight: 700, textAlign: 'center', }} data-aos="fade-up">
                    Our Event Spaces
                </Typography>
                <Typography variant='h6' gutterBottom color='textSecondary' sx={{ p: 2, textAlign: 'center' }} data-aos="fade-up">
                    We all live in an age that belongs to the young at heart. Life that is becoming extremely fast,
                </Typography>
            </Box>
            <Splide data-aos="fade-up" options={{
                type: 'loop',
                perPage: 4,
                perMove: 1,
                autoplay: true,
                pagination: false,
                arrows: true,
                gap: '1rem',
                breakpoints: {
                    1024: { perPage: 4 },
                    900: { perPage: 2 },
                    600: { perPage: 1 },
                },
            }}>
                {slides.map((slide, index) => (
                    <SplideSlide key={index}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: 300,
                                borderRadius: 2,
                                boxShadow: 6,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: hoveredIndex === index ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            onMouseEnter={() => setHoveredIndex(index)} // Set the hovered slide
                            onMouseLeave={() => setHoveredIndex(null)} // Reset the hovered slide
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
                                    filter: hoveredIndex === index ? 'brightness(100%)' : 'brightness(50%)',
                                    transition: 'filter 0.3s ease',
                                }}
                            />
                            <Button
                                sx={{
                                    position: 'absolute',
                                    bottom: 20,
                                    left: 20,
                                    zIndex: 2,
                                    backgroundColor: hoveredIndex === index || isMobile ? '#8e5fbc' : 'black', // Darker shade of blue on hover
                                    color: hoveredIndex === index ? 'white' : 'white',
                                    borderRadius: 1,
                                    padding: '8px 16px',
                                    fontWeight: 600,
                                    letterSpacing: 1,
                                    textAlign: 'center',
                                    width: 'calc(100% - 40px)',
                                }} onClick={() => handleRouting(slide.title)}
                            >
                                {slide.title}
                            </Button>
                        </Box>
                    </SplideSlide>
                ))}
            </Splide>
        </Container>
    );
};

export default Showcases;
