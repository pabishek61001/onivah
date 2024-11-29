import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS

const WelcomeSection = () => {
    useEffect(() => {
        // Initialize AOS after the component mounts
        AOS.init({
            duration: 1200,  // Animation duration
            easing: 'ease-in-out',
            once: true, // Whether animation should happen once
        });
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                padding: { xs: '20px', md: '50px' },
                overflow: 'hidden',
                flexDirection: { xs: 'column', md: 'row' },
                position: 'relative',
            }}
        >
            {/* Overlay Section */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "#faf4fe",
                    zIndex: 1, // Keeps overlay behind content
                }}
            />

            {/* Content Section (Left) */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    maxWidth: { xs: '100%', md: '50%' },
                    zIndex: 2, // Keeps content above overlay
                    padding: { xs: '20px', md: '40px' },
                    color: 'white',
                }}
                data-aos="fade-right"  // AOS animation for fade-in from right
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        fontSize: { xs: '2rem', md: '3.5rem' },
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: "#5c3d77"
                    }}
                >
                    Welcome to Your Dream Occasions
                </Typography>
                <Typography
                    variant="h6"
                    color='text.secondary'
                    sx={{
                        marginBottom: '30px',
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        lineHeight: '1.8',
                        opacity: 0.85,
                    }}
                >
                    Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
                </Typography>
                <Button
                    variant='contained'
                    sx={{
                        padding: '12px 24px',
                        fontSize: { xs: '1rem', md: '1.2rem' },
                        borderRadius: '30px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                    }}
                    data-aos="zoom-in"  // AOS animation for zoom-in effect
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    Book Now
                </Button>
            </Box>

            {/* Image Section (Right) */}
            <Box
                sx={{
                    width: { xs: '100%', md: '50%' },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row', // For horizontal arrangement, change to 'column' for vertical
                    gap: '10px', // Adjust gap as needed
                    position: 'relative',
                    zIndex: 2,
                }}
                data-aos="fade-left" // AOS animation for fade-in from left
            >
                <Box
                    sx={{
                        width: '100%', // Adjust width to fit layout
                        height: '100%',
                        backgroundImage: 'url("https://img.freepik.com/free-photo/luxurious-dinner-hall-with-large-crystal-chandelier_8353-565.jpg?t=st=1731220319~exp=1731223919~hmac=9d841dc38acb4b7918597cbe2bd9c9d878bbc9c43fd39ee74c996cd0002482a6&w=900")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '15px',
                    }}
                />
                <Box
                    sx={{
                        width: '100%', // Adjust width to fit layout
                        height: '100%',
                        backgroundImage: 'url("https://images.pexels.com/photos/1949698/pexels-photo-1949698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', // URL for second image
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '15px',
                    }}
                />
            </Box>

        </Box>
    );
};

export default WelcomeSection;
