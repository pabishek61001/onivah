import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { Box, Typography, Button, useMediaQuery } from '@mui/material';
import '@splidejs/react-splide/css'; // Import Splide CSS

const HeroVideo = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
            <Splide
                options={{
                    type: 'loop',
                    height: '100vh',
                    pagination: true,
                    arrows: false,
                    autoplay: false,
                    interval: 5000,
                }}
            >
                <SplideSlide>
                    {/* <SplideSlide>
                        <img src="https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }} />
                    </SplideSlide> */}

                    <video
                        src="https://videos.pexels.com/video-files/1739010/1739010-hd_1920_1080_30fps.mp4"
                        autoPlay
                        loop
                        muted
                        preload="none"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </SplideSlide>
                <SplideSlide>
                    <video
                        src={require("../videos/vecteezy_food-appetizer-for-party-with-friends_20724772.mp4")}
                        autoPlay
                        loop
                        muted
                        preload="none"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </SplideSlide>
                <SplideSlide>
                    <video
                        src={require("../videos/1470995_People_Fashion_1280x720.mp4")}
                        autoPlay
                        loop
                        muted
                        preload="none"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </SplideSlide>
            </Splide>

            {/* Overlay with text content */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dark overlay for text readability
                    // backgroundColor: '#0000',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    textAlign: 'center',
                    paddingBottom: isMobile ? 35 : 2,
                    transform: 'translateY(-50%)',
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Celebrate Your <span style={{ color: '#8e5fbc', fontSize: '3rem', }}>Dream Occasions</span>
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, color: 'white' }}>
                    From stunning venues to seamless planning, let us make your special day unforgettable.
                </Typography>
            </Box>
        </Box>
    );
};

export default HeroVideo;
