import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Grid, Card, CardMedia, Typography, Container, Box, Button } from '@mui/material';
import axios from 'axios';
import apiUrl from '../Api/Api';
import withLoadingAndError from '../hoc/withLoadingAndError';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import LocationOn from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import Header from '../components/Header';

const VenueDetails = ({ loading, setLoading, error, setError }) => {


    const venueId = useParams();  // Get venue ID from route params
    const [venue, setvenue] = useState(null);

    const location = useLocation();
    const { customerChoice } = location.state || {};  // Access state safely


    useEffect(() => {
        const fetchvenueDetails = async () => {
            setLoading(true)
            if (venueId) {
                try {
                    const response = await axios.get(`${apiUrl}/venue/${venueId.venueid}`);
                    setvenue(response.data[0]);
                    setLoading(false)
                } catch (err) {
                    if (err.response) {
                        setError(err.response.data.error); // Access the error message from the response
                    } else {
                        setError('An unexpected error occurred'); // Generic error message
                    } console.error('Error fetching venue details', err);
                }
            }
        };

        fetchvenueDetails();
    }, [venueId]);


    const handleReserve = (venueId) => {
        // Redirect to booking page or open a modal
        console.log(`Reserve button clicked for venue ID: ${venueId}`);
        // Implement your booking logic here
    };


    return (
        <Box>
            <Header />
            {loading && <Typography variant="h6">Loading...</Typography>}
            {error && <Typography variant="body2" color="error">{error}</Typography>} {/* Changed to show error message properly */}

            {
                venue &&
                <Container sx={{ p: 2, mt: 10 }}>
                    <Grid container spacing={3}>
                        {/* Left Section: Main Image and Additional Images */}
                        <Grid item xs={12} md={6}>
                            {/* Main Image */}
                            <Card>
                                <CardMedia
                                    component="img"
                                    image={venue.imageUrls[0]}  // Use first image as the main image
                                    alt={venue.name}
                                    sx={{ maxHeight: 300, width: '100%', objectFit: 'cover' }} // Ensuring the image covers the area
                                />
                            </Card>

                            {/* Additional Images Below */}
                            <Grid container spacing={2} mt={2}>
                                {venue.imageUrls.slice(1).map((url, index) => (  // Skip the first image
                                    <Grid item xs={6} sm={4} key={index}>
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                image={url}
                                                alt={`venue image ${index + 1}`}
                                                sx={{
                                                    height: 150, // Fixed height for uniformity
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        {/* Right Section: Venue Details */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    bgcolor: 'background.paper',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {/* Venue Name */}
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {venue.name}
                                </Typography>

                                {/* Price */}
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Price: ₹{venue.price}
                                </Typography>

                                {/* Description */}
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {venue.description}
                                </Typography>

                                {/* Location */}
                                <Box display="flex" alignItems="center" mb={1}>
                                    <LocationOn color="info" />
                                    <Typography variant="body2" color="text.secondary" ml={1}>
                                        {venue.location}
                                    </Typography>
                                </Box>

                                {/* Ratings */}
                                <Box display="flex" alignItems="center" mb={2}>
                                    <StarIcon color="inherit" />
                                    <Typography variant="body2" color="text.secondary" ml={1}>
                                        Ratings: {venue.ratings}
                                    </Typography>
                                </Box>

                                {/* Additional Booking Details */}
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                    Capacity: {venue.capacity} people
                                </Typography>

                                {/* Reserve Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => handleReserve(venue.id)}
                                    sx={{ borderRadius: 2, maxWidth: 300 }}
                                >
                                    Reserve This Venue
                                </Button>
                            </Box>
                        </Grid>


                    </Grid>

                </Container>
            }
            <FooterComponent />

        </Box>
    );
};

export default withLoadingAndError(VenueDetails);
