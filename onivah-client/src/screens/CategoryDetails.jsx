import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Grid, Card, CardMedia, Typography, Container, Box, Button } from '@mui/material';
import axios from 'axios';
import apiUrl from '../Api/Api';
import withLoadingAndError from '../hoc/withLoadingAndError';
import FooterComponent from '../components/FooterComponent';
import LocationOn from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import Header from '../components/Header';
import { EventAvailable, LocalParking, Settings } from '@mui/icons-material';

import {
    TextField, Paper, CardContent, Rating,
    FormControlLabel, Checkbox, Divider, Avatar, Dialog, DialogTitle, IconButton, DialogContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { CloseFullscreen } from '@mui/icons-material';


const CategoryDetails = ({ loading, setLoading, error, setError }) => {

    const navigate = useNavigate();
    const { service, serviceId } = useParams();  // Destructure the params

    const serviceName = service;  // Extract 'photography' part

    const [service_details, setService] = useState(null);


    useEffect(() => {
        const fetchvenueDetails = async () => {
            setLoading(true)
            if (serviceId) {
                try {
                    const response = await axios.get(`${apiUrl}/category/${serviceName}/${serviceId}`);
                    setService(response.data);
                    setLoading(false)
                } catch (err) {
                    if (err.response) {
                        setError(err.response.data.error); // Access the error message from the response
                    } else {
                        setError('An unexpected error occurred'); // Generic error message
                    } console.error('Error fetching service_details details', err);
                }
            }
        };

        fetchvenueDetails();
    }, [serviceId]);


    const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to current date using dayjs
    const [isChecked, setIsChecked] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = () => {
        alert(`Selected Date: ${selectedDate.format('YYYY-MM-DD')}\nReport Venue: ${isChecked}\nvenue:${service_details[`${serviceName}_id`]}`);

        const queryParams = new URLSearchParams({
            capacity: service_details.capacity,
            description: service_details.description,
            location: service_details.location,
            name: service_details.name,
            price: service_details.price,
            service_Id: service_details[`${serviceName}_id`],
            _id: service_details._id,
            selectedDate: selectedDate.format('YYYY-MM-DD'),
            isChecked: isChecked,
            imageUrls: service_details.imageUrls.join(',') // Join images into a single string
        }).toString();
        navigate(`/checkout/${service_details[`${serviceName}_id`]}?${queryParams}`);
    };




    return (
        <Box>
            <Header />
            {loading && <Typography variant="h6">Loading...</Typography>}
            {error && <Typography variant="body2" color="error">{error}</Typography>} {/* Changed to show error message properly */}

            {
                service_details &&
                <>


                    <Container maxWidth="lg" sx={{ mt: 10 }}>
                        <Paper sx={{ padding: 3, borderRadius: 2, marginTop: 2 }}>
                            <Grid container spacing={3}>
                                {/* Wedding Venue Information */}
                                <Grid item xs={12} md={12}>
                                    <Typography variant="h4" gutterBottom>
                                        {service_details.name}
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {/* Left: Images */}
                                        <Grid item xs={12} md={6}>
                                            {/* Main Image */}
                                            <CardMedia
                                                component="img"
                                                alt="Wedding Hall"
                                                height="250"
                                                image={service_details?.imageUrls?.[0] || "/images/mandapam-main.jpg"} // Dynamic or static fallback
                                                sx={{ borderRadius: 2 }}
                                            />

                                            {/* Additional Images */}
                                            <Box
                                                mt={2}
                                                sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    alt="Additional Image 1"
                                                    height="100"
                                                    image={service_details?.imageUrls[1]}
                                                    sx={{ borderRadius: 2, flex: 1 }}
                                                />
                                                <CardMedia
                                                    component="img"
                                                    alt="Additional Image 2"
                                                    height="100"
                                                    image={service_details?.imageUrls[2]}
                                                    sx={{ borderRadius: 2, flex: 1 }}
                                                />
                                                <Box
                                                    sx={{
                                                        borderRadius: 2,
                                                        flex: 1,
                                                        height: 100,
                                                        backgroundColor: "#4b769f",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        cursor: "pointer",
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                    }}
                                                    onClick={handleOpen}
                                                >
                                                    View All Photos
                                                </Box>
                                            </Box>

                                            {/* Dialog for All Photos */}
                                            <Dialog
                                                open={open}
                                                onClose={handleClose}
                                                fullScreen
                                                sx={{
                                                    "& .MuiDialog-container": {
                                                        p: 5,
                                                        m: 0,
                                                    },
                                                    // "& .MuiPaper-root": {
                                                    //     bgcolor: "transparent", // Makes the dialog content background transparent
                                                    //     boxShadow: "none", // Removes the shadow for a cleaner transparent look
                                                    // },
                                                }}
                                            // BackdropProps={{
                                            //     style: { backgroundColor: "rgba(0, 0, 0, 0)" },
                                            // }}
                                            >
                                                <DialogTitle
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        backgroundColor: "#f5f5f5",
                                                        px: 2,
                                                    }}
                                                >
                                                    All Photos
                                                    <IconButton
                                                        onClick={handleClose}
                                                        sx={{ position: "absolute", right: 16, top: 16 }}
                                                    >
                                                        <CloseFullscreen />
                                                    </IconButton>
                                                </DialogTitle>
                                                <DialogContent sx={{ p: 2, }}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        {/* Display Current Image */}
                                                        {service_details?.imageUrls.length > 0 && (
                                                            <>
                                                                <CardMedia
                                                                    component="img"
                                                                    alt={`Image ${currentIndex + 1}`}
                                                                    image={service_details?.imageUrls[currentIndex]}
                                                                    sx={{
                                                                        width: "100%",
                                                                        maxWidth: 600,
                                                                        borderRadius: 2,
                                                                        boxShadow: 1,
                                                                        mb: 2,
                                                                    }}
                                                                />
                                                                {/* Navigation Buttons */}
                                                                <Box
                                                                    display="flex"
                                                                    justifyContent="space-between"
                                                                    width="100%"
                                                                    maxWidth={600}
                                                                >
                                                                    <Button
                                                                        variant="outlined"
                                                                        disabled={currentIndex === 0}
                                                                        onClick={() => setCurrentIndex(currentIndex - 1)}
                                                                    >
                                                                        Previous
                                                                    </Button>
                                                                    <Button
                                                                        variant="outlined"
                                                                        disabled={currentIndex === service_details?.imageUrls.length - 1}
                                                                        onClick={() => setCurrentIndex(currentIndex + 1)}
                                                                    >
                                                                        Next
                                                                    </Button>
                                                                </Box>
                                                            </>
                                                        )}
                                                    </Box>
                                                </DialogContent>
                                            </Dialog>

                                        </Grid>


                                        {/* Right: Description */}
                                        <Grid item xs={12} md={6}>
                                            <CardContent>
                                                <Typography variant="h6" color="primary"> {service_details.name} Details</Typography>
                                                <Typography variant="body1" paragraph>
                                                    Our Wedding Hall offers a luxurious setting for your special day. Located in the heart of the city, with ample parking and exquisite decor, it’s the perfect place for your wedding. We cater to a variety of events, from intimate ceremonies to grand receptions.
                                                </Typography>
                                                <Divider sx={{ margin: '10px 0' }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    <strong>Capacity:</strong> 300 guests | <strong>Available:</strong> 8 AM to 10 PM | <strong>Catering:</strong> Available | <strong>Parking:</strong> Ample parking space
                                                </Typography>
                                                <Typography variant="h6" color="primary" sx={{ marginTop: 2 }}>Pricing Information</Typography>
                                                <Typography variant="body1" paragraph>
                                                    <strong>Basic Package:</strong> $3000 for 6 hours of rental, including setup and basic catering services. Additional services and extended hours can be arranged.
                                                </Typography>

                                                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ textAlign: "center" }}>
                                                    Confirm Booking
                                                </Button>
                                            </CardContent>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Date Picker and Availability */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>View Availability</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <StaticDatePicker
                                            sx={{ bgcolor: "#eeee" }}
                                            displayStaticWrapperAs="desktop" // Ensures the layout is fixed and inline
                                            label="Choose Date"
                                            value={selectedDate}
                                            onChange={(newDate) => setSelectedDate(newDate)}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </LocalizationProvider>
                                </Grid>


                                {/* Customer Reviews */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Customer Reviews
                                    </Typography>
                                    <Box>
                                        {[
                                            {
                                                name: "Joe",
                                                rating: 4,
                                                comment: "A beautiful service_details! My wedding was a dream come true!",
                                            },
                                            {
                                                name: "Adam",
                                                rating: 5,
                                                comment: "Amazing serviceDetails and breathtaking decor. Highly recommend!",
                                            },
                                            {
                                                name: "Lile",
                                                rating: 5,
                                                comment: "The best wedding service_details in the city. Elegant, spacious, and unforgettable!",
                                            },
                                        ].map((review, index) => (
                                            <Card
                                                key={index}
                                                sx={{
                                                    mb: 2,
                                                    backgroundColor: "#ffffff",
                                                    border: "1px solid #e0e0e0",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                                }}
                                            >
                                                <CardContent>
                                                    <Box display="flex" alignItems="center" mb={2}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: "#4b769f",
                                                                color: "#fff",
                                                                width: 40,
                                                                height: 40,
                                                                fontSize: "1rem",
                                                            }}
                                                        >
                                                            {review.name[0].toUpperCase()}
                                                        </Avatar>
                                                        <Box ml={2}>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{ fontWeight: "bold", color: "#333" }}
                                                            >
                                                                {review.name}
                                                            </Typography>
                                                            <Rating
                                                                name="read-only"
                                                                value={review.rating}
                                                                readOnly
                                                                sx={{ fontSize: "1.2rem" }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        fontStyle="italic"
                                                        sx={{ color: "#555", lineHeight: 1.6 }}
                                                    >
                                                        "{review.comment}"
                                                    </Typography>
                                                </CardContent>
                                                {index < 2 && <Divider sx={{ bgcolor: "#e0e0e0" }} />}
                                            </Card>
                                        ))}
                                    </Box>
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
                                        Why Choose {service_details?.name || "Sri Lakshmi Narayana Mandapam"}?
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



                                {/* Additional Information */}
                                <Grid item xs={12} md={12}>
                                    <Typography variant="h6" gutterBottom>Additional Information</Typography>
                                    <TextField label="Special Requests (Optional)" fullWidth multiline rows={4} variant="outlined" />
                                </Grid>

                                {/* Confirmation Button */}
                                <Grid item xs={4}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                                        Confirm Booking
                                    </Button>
                                </Grid>


                                {/* Report Venue */}
                                <Grid item xs={12} >
                                    <Typography variant="subtitle1" gutterBottom>Report Venue</Typography>
                                    <FormControlLabel
                                        control={<Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />}
                                        label="I want to report an issue with this service_details"
                                    />
                                    {
                                        isChecked && (
                                            <Grid item xs={4} >
                                                <TextField rows={3} multiline label="Write your feedback" sx={{ width: "100%", mb: 2 }} />
                                                <Button variant="contained" color="inherit" onClick={handleSubmit} fullWidth>
                                                    Report
                                                </Button>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </Paper>
                    </Container>

                </>



            }
            <FooterComponent />

        </Box>
    );
};

export default withLoadingAndError(CategoryDetails);
