import React, { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Select, MenuItem, InputLabel, FormControl, Paper } from '@mui/material';

const Rough3 = () => {
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('');

    const handleLocationChange = (event) => setLocation(event.target.value);
    const handleCheckInChange = (event) => setCheckIn(event.target.value);
    const handleCheckOutChange = (event) => setCheckOut(event.target.value);
    const handleGuestsChange = (event) => setGuests(event.target.value);

    return (
        <Box
            sx={{
                backgroundImage: 'url(https://placehold.co/1200x800)', // Replace with your image URL
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
            }}
        >
            {/* Overlay for better text visibility */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.9)', // Dark overlay to improve text visibility
                zIndex: 1
            }} />

            <Container sx={{ position: 'relative', zIndex: 2 }}>
                <Grid container justifyContent="center" spacing={4}>
                    {/* Left Section: Hero Content */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                color: '#fff',
                                textShadow: '2px 2px 6px rgba(0, 0, 0, 0.6)',
                            }}
                        >
                            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', sm: '3rem' }, fontWeight: 'bold', mb: 3 }}>
                                Your Dream Vacation Awaits
                            </Typography>
                            <Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' }, mb: 4 }}>
                                Find the perfect hotel for your getaway.
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    fontSize: '1.2rem',
                                    backgroundColor: (theme) => theme.palette.primary.main,
                                    color: '#fff',
                                    py: 1.5,
                                    px: 5,
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: (theme) => theme.palette.primary.dark,
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                                href="#bookingForm"
                            >
                                Book Now
                            </Button>
                        </Box>
                    </Grid>

                    {/* Right Section: Booking Dropdowns */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: 3 }}>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="location-label">Location</InputLabel>
                                        <Select
                                            labelId="location-label"
                                            value={location}
                                            onChange={handleLocationChange}
                                            label="Location"
                                            sx={{ '& .MuiSelect-root': { fontSize: '1rem', padding: '8px' } }}
                                        >
                                            <MenuItem value="New York">New York</MenuItem>
                                            <MenuItem value="Paris">Paris</MenuItem>
                                            <MenuItem value="Tokyo">Tokyo</MenuItem>
                                            <MenuItem value="London">London</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="checkin-label">Check-in Date</InputLabel>
                                        <Select
                                            labelId="checkin-label"
                                            value={checkIn}
                                            onChange={handleCheckInChange}
                                            label="Check-in Date"
                                        >
                                            <MenuItem value="2025-01-15">January 15, 2025</MenuItem>
                                            <MenuItem value="2025-02-01">February 1, 2025</MenuItem>
                                            <MenuItem value="2025-03-10">March 10, 2025</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="checkout-label">Check-out Date</InputLabel>
                                        <Select
                                            labelId="checkout-label"
                                            value={checkOut}
                                            onChange={handleCheckOutChange}
                                            label="Check-out Date"
                                        >
                                            <MenuItem value="2025-01-20">January 20, 2025</MenuItem>
                                            <MenuItem value="2025-02-10">February 10, 2025</MenuItem>
                                            <MenuItem value="2025-03-15">March 15, 2025</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="guests-label">Guests</InputLabel>
                                        <Select
                                            labelId="guests-label"
                                            value={guests}
                                            onChange={handleGuestsChange}
                                            label="Guests"
                                        >
                                            <MenuItem value={1}>1 Guest</MenuItem>
                                            <MenuItem value={2}>2 Guests</MenuItem>
                                            <MenuItem value={3}>3 Guests</MenuItem>
                                            <MenuItem value={4}>4 Guests</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Rough3;
