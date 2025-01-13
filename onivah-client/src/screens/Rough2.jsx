import React from 'react';
import { Box, Typography, Button, Avatar, Paper, Grid } from '@mui/material';

const Rough2 = () => {
    return (
        <Box
            maxWidth="lg"
            sx={{
                backgroundColor: 'white',
                borderRadius: 4,
                boxShadow: 5,
                p: 4,
                position: 'relative',
                overflow: 'hidden',
                // maxWidth: '1200px',
                margin: 'auto',
            }}
        >
            {/* Gradient Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: 4,
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 100%)',
                    zIndex: 1,
                }}
            ></Box>

            {/* Main Content */}
            <Box sx={{ position: 'relative', zIndex: 10 }}>
                <Grid container spacing={4} justifyContent="space-between" alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
                            What Our Happy Customers Say
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph>
                            Our community development efforts help bring together stakeholders and
                            foundations to create impactful projects and services.
                        </Typography>
                        <Button variant="contained" color="primary" sx={{ borderRadius: 20, boxShadow: 2 }}>
                            See All Testimonials
                        </Button>
                    </Grid>

                    {/* Customer Testimonials */}
                    <Grid item xs={12} md={6}>
                        <Box display="flex" flexDirection="column" gap={2}>
                            {/* James Adam */}
                            <Paper
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    p: 3,
                                    borderRadius: 3,
                                    boxShadow: 4,
                                    '&:hover': {
                                        boxShadow: 8,
                                        transform: 'scale(1.05)',
                                        transition: '0.3s ease-in-out',
                                    },
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar
                                        src="https://placehold.co/40x40"
                                        alt="James Adam"
                                        sx={{ width: 60, height: 60, mr: 2 }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">James Adam</Typography>
                                        <Typography variant="body2" color="textSecondary">CTO of JamsosTech</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2">
                                    "File storage made easy – including powerful features you won't find anywhere else. Whether you are looking for scalability or security, this is the tool for you."
                                </Typography>
                            </Paper>

                            {/* Luis Maradona */}
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    '&:hover': {
                                        boxShadow: 8,
                                        transform: 'scale(1.05)',
                                        transition: '0.3s ease-in-out',
                                    },
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar
                                        src="https://placehold.co/40x40"
                                        alt="Luis Maradona"
                                        sx={{ width: 60, height: 60, mr: 2 }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">Luis Maradona</Typography>
                                        <Typography variant="body2" color="textSecondary">CEO of Maradocamp</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="textPrimary">
                                    "A fantastic platform! It has been a game-changer for us. We now have all the tools we need to grow our business and stay organized."
                                </Typography>
                            </Paper>

                            {/* Aaron Aldrich */}
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    '&:hover': {
                                        boxShadow: 8,
                                        transform: 'scale(1.05)',
                                        transition: '0.3s ease-in-out',
                                    },
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar
                                        src="https://placehold.co/40x40"
                                        alt="Aaron Aldrich"
                                        sx={{ width: 60, height: 60, mr: 2 }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">Aaron Aldrich</Typography>
                                        <Typography variant="body2" color="textSecondary">Product Engineer at Techin</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="textPrimary">
                                    "This is a must-have tool for business owners. It helps me manage my operations more effectively and proactively."
                                </Typography>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Decorative Circles */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 4, pointerEvents: 'none' }}>
                <Box sx={{ position: 'absolute', top: 16, left: 16, width: 16, height: 16, backgroundColor: 'orange', borderRadius: '50%' }}></Box>
                <Box sx={{ position: 'absolute', bottom: 16, left: 16, width: 16, height: 16, backgroundColor: 'blue', borderRadius: '50%' }}></Box>
                <Box sx={{ position: 'absolute', top: 16, right: 16, width: 16, height: 16, backgroundColor: 'purple', borderRadius: '50%' }}></Box>
                <Box sx={{ position: 'absolute', bottom: 16, right: 16, width: 16, height: 16, backgroundColor: 'green', borderRadius: '50%' }}></Box>
            </Box>
        </Box>
    );
};

export default Rough2;
