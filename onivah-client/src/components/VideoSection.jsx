import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Button,
    Stack,
    IconButton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const VideoSection = () => {

    return (
        <Box>

            <Box
                sx={{
                    backgroundColor: '#fff',
                    px: 3,
                    py: 6,
                    maxWidth: '1280px',
                    mx: 'auto',
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'center' },
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'center', md: 'center' },
                    gap: { xs: 5, md: 10 },
                }}
            >


                {/* Image & Play Button */}
                <Box
                    onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                    sx={{
                        position: 'relative',
                        borderRadius: 6,
                        overflow: 'hidden',
                        flexShrink: 0,
                        width: '100%',
                        maxWidth: { xs: '100%', md: 600 },
                    }}
                    data-aos='fade-up'
                >
                    <Box
                        component="img"
                        src="https://cdn.pixabay.com/photo/2020/09/19/09/40/sunset-5584004_1280.jpg"
                        alt="Abstract red and blue crystals and flowers floating in dark space"
                        sx={{
                            width: '100%',
                            height: 400,
                            borderRadius: 6,
                            objectFit: 'cover',
                        }}
                    />
                    <IconButton
                        aria-label="Play video"
                        onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: 16,
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                            width: 56,
                            height: 56,
                            boxShadow: 3,
                        }}
                    >
                        <PlayArrowIcon sx={{ fontSize: 28, color: '#111', ml: 0.5 }} />
                    </IconButton>

                </Box>

                {/* Right Section */}
                <Box data-aos='fade-up' sx={{ maxWidth: 400, mt: { xs: 2, md: 0 } }} display='flex' flexDirection='column' justifyContent='center' alignItems="center">
                    {/* Avatars */}
                    <Stack direction="row" spacing={-1}>
                        {[
                            'https://storage.googleapis.com/a1aa/image/3c549ab9-e62a-4376-376d-956ab1111df3.jpg',
                            'https://storage.googleapis.com/a1aa/image/482bd16c-9cd6-4489-5ad8-0eacd061b6bb.jpg',
                            'https://storage.googleapis.com/a1aa/image/c998180a-da08-4614-8fa1-0a6955c9cce6.jpg',
                        ].map((src, index) => (
                            <Avatar
                                key={index}
                                src={src}
                                alt={`Avatar ${index + 1}`}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    border: '2px solid white',
                                }}
                            />
                        ))}
                        <Typography
                            variant="body2"
                            sx={{ p: 2, color: '#111' }}
                        >
                            More than <strong>20</strong> professional designers
                        </Typography>
                    </Stack>

                    {/* Description */}
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 2, display: 'block', lineHeight: 1.7 }}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua iusmod tempor incididunt ut labore et dolore magna aliqua
                    </Typography>

                    {/* Buttons */}
                    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            sx={{
                                textTransform: 'none',
                                fontSize: 12,
                                borderRadius: 999,
                                px: 3,
                                py: 1,
                            }}
                        >
                            Get Started
                        </Button>
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                textTransform: 'none',
                                fontSize: 12,
                                borderRadius: 999,
                                px: 3,
                                py: 1,
                            }}
                        >
                            Get Started
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default VideoSection;
