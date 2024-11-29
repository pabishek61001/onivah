import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Grid, Card, CardMedia, Typography, Container, Box, Button } from '@mui/material';
import axios from 'axios';
import apiUrl from '../Api/Api';
import withLoadingAndError from '../hoc/withLoadingAndError';
import FooterComponent from '../components/FooterComponent';
import LocationOn from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import Header from '../components/Header';
import { EventAvailable, LocalParking, Settings } from '@mui/icons-material';

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
                        {/* Left Section: Images */}
                        <Grid item xs={12} md={6}>
                            {/* Main Image */}
                            <Card>
                                <CardMedia
                                    component="img"
                                    image={venue?.imageUrls?.[0] || "/images/mandapam-main.jpg"} // Dynamic or static fallback
                                    alt={venue?.name || "Sri Lakshmi Narayana Mandapam"}
                                    sx={{
                                        maxHeight: 400,
                                        width: '100%',
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                    }}
                                />
                            </Card>

                            {/* Additional Images */}
                            <Grid container spacing={2} mt={2}>
                                {(venue?.imageUrls?.slice(1) || [
                                    "/images/mandapam-dining.jpg",
                                    "/images/mandapam-stage.jpg",
                                    "/images/mandapam-parking.jpg",
                                ]).map((url, index) => (
                                    <Grid item xs={6} sm={4} key={index}>
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                image={url}
                                                alt={`Image ${index + 1}`}
                                                sx={{
                                                    height: 150,
                                                    objectFit: 'cover',
                                                    borderRadius: 2,
                                                }}
                                            />
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        {/* Right Section: Mandapam Details */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 4,
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    bgcolor: 'background.paper',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {/* Name */}
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {venue?.name || "Sri Lakshmi Narayana Mandapam"}
                                </Typography>

                                {/* Price */}
                                <Typography variant="h6" color="primary" gutterBottom>
                                    {venue?.price
                                        ? `Rent: ₹${venue.price} per day`
                                        : "Rent: ₹50,000 per day"}
                                </Typography>

                                {/* Description */}
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    {venue?.description ||
                                        "Sri Lakshmi Narayana Mandapam is a spacious and elegant venue, perfect for weddings, receptions, and other ceremonies. It features a large stage, a separate dining hall, and ample parking space for guests."}
                                </Typography>

                                {/* Location */}
                                <Box display="flex" alignItems="center" mb={1}>
                                    <LocationOn color="info" />
                                    <Typography variant="body2" color="text.secondary" ml={1}>
                                        {venue?.location ||
                                            "No. 12, Temple Road, Chennai, Tamil Nadu, 600001"}
                                    </Typography>
                                </Box>

                                {/* Ratings */}
                                <Box display="flex" alignItems="center" mb={2}>
                                    <StarIcon sx={{ color: '#f4c542' }} />
                                    <Typography variant="body2" color="text.secondary" ml={1}>
                                        Ratings: {venue?.ratings || "4.5/5 (200 reviews)"}
                                    </Typography>
                                </Box>

                                {/* Key Details */}
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                    Capacity: {venue?.capacity || "500 people"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                    Dining Hall Capacity: {venue?.diningCapacity || "200 people"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                    Parking: {venue?.parking || "50 vehicles"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={3}>
                                    Additional Amenities:{" "}
                                    {venue?.amenities ||
                                        "AC, Generator Backup, Decoration Services"}
                                </Typography>

                                {/* Reserve Button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() =>
                                        venue?.id
                                            ? handleReserve(venue.id)
                                            : console.log("Reservation initiated")
                                    }
                                    sx={{
                                        borderRadius: 2,
                                        maxWidth: 300,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Reserve Now
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Additional Section: Why Choose This Venue */}
                    <Box sx={{ mt: 5, bgcolor: '#f7f9fc', p: 4, borderRadius: 2 }}>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            mb={3}
                            textAlign="center"
                            color="primary.main"
                            sx={{
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            Why Choose {venue?.name || "Sri Lakshmi Narayana Mandapam"}?
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Card
                                    sx={{
                                        p: 3,
                                        boxShadow: 3,
                                        borderRadius: 3,
                                        bgcolor: 'background.paper',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <EventAvailable color="success" fontSize="large" />
                                        <Typography
                                            variant="h6"
                                            ml={2}
                                            fontWeight="bold"
                                            color="text.primary"
                                        >
                                            Perfect for All Occasions
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Ideal for weddings, receptions, corporate events, and cultural programs.
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card
                                    sx={{
                                        p: 3,
                                        boxShadow: 3,
                                        borderRadius: 3,
                                        bgcolor: 'background.paper',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <Settings color="info" fontSize="large" />
                                        <Typography
                                            variant="h6"
                                            ml={2}
                                            fontWeight="bold"
                                            color="text.primary"
                                        >
                                            Modern Amenities
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Equipped with AC, generator backup, and decorative services to enhance your experience.
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card
                                    sx={{
                                        p: 3,
                                        boxShadow: 3,
                                        borderRadius: 3,
                                        bgcolor: 'background.paper',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <LocalParking color="secondary" fontSize="large" />
                                        <Typography
                                            variant="h6"
                                            ml={2}
                                            fontWeight="bold"
                                            color="text.primary"
                                        >
                                            Ample Parking
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Parking space for up to 50 vehicles ensures convenience for your guests.
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card
                                    sx={{
                                        p: 3,
                                        boxShadow: 3,
                                        borderRadius: 3,
                                        bgcolor: 'background.paper',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <LocationOn color="error" fontSize="large" />
                                        <Typography
                                            variant="h6"
                                            ml={2}
                                            fontWeight="bold"
                                            color="text.primary"
                                        >
                                            Prime Location
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Located at the heart of Chennai with easy access to public transport.
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>

                </Container>

            }
            <FooterComponent />

        </Box>
    );
};

export default withLoadingAndError(VenueDetails);
