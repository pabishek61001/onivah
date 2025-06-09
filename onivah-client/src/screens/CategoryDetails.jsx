import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Grid, Card, CardMedia, Typography, Container, Box, Button, Skeleton, Collapse, Accordion, AccordionSummary, AccordionDetails, InputLabel, Select, MenuItem, FormControl, Modal, Tabs, Tab, LinearProgress, Chip, Stack } from '@mui/material';
import axios from 'axios';
import { apiUrl } from '../Api/Api';
import withLoadingAndError from '../hoc/withLoadingAndError';
import FooterComponent from '../components/FooterComponent';
import LocationOn from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import Header from '../components/Header';
import { CalendarMonth, CheckCircle, EventAvailable, ExpandMore, Favorite, FavoriteBorder, FiberManualRecord, LocalParking, NavigateNext, Settings, StarHalf } from '@mui/icons-material';

import {
    TextField, Paper, CardContent, Rating,
    FormControlLabel, Checkbox, Divider, Avatar, Dialog, DialogTitle, IconButton, DialogContent, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { CloseFullscreen, } from '@mui/icons-material';
import { useMediaQuery, useTheme } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import DateStorer from '../components/DateStorer';
import { format, parseISO } from 'date-fns';
import Star from '@mui/icons-material/Star';
import { useFavorites } from '../Favourites/FavoritesContext';
import FeedbackSection from '../utils/FeedbackSection';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Close from '@mui/icons-material/Close';

const lightBackgrounds = [
    '#f9f9f9',
    '#f4f8fb',
    '#fef7f1',
    '#f5f5f5',
    '#f0f9f4',
    '#fff8e1',
    '#f3e5f5',
];


const CategoryDetails = ({ loading, setLoading, error, setError }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const bookingRef = useRef(null);

    const { favorites, toggleFavorite } = useFavorites(); // Use global favorites context



    // Get existing customerChoice data from localStorage
    const customerChoiceRaw = localStorage.getItem('customerChoice');
    const [parsedChoice, setParsedChoice] = useState({ location: '', category: '', datesChoosed: [] });

    useEffect(() => {
        if (customerChoiceRaw) {
            try {
                setParsedChoice(JSON.parse(customerChoiceRaw));
            } catch (error) {
                console.error("Failed to parse localStorage data:", error);
            }
        }
    }, [customerChoiceRaw]);

    const navigate = useNavigate();
    const { service, serviceId } = useParams();  // Destructure the params
    const serviceName = service;  // Extract 'photography' part

    const [serviceDetails, setService] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);


    useEffect(() => {
        const fetchvenueDetails = async () => {

            if (serviceId) {
                try {
                    setLoading(true)
                    const response = await axios.get(`${apiUrl}/category/${serviceName}/${serviceId}`);
                    setService(response.data);
                    setLoading(false)
                } catch (err) {
                    setLoading(false)
                    setService(null)
                    if (err.response) {
                        setError(err.response.data.error); // Access the error message from the response
                    } else {
                        setError('An unexpected error occurred'); // Generic error message
                    }
                }
            }
        };

        fetchvenueDetails();
    }, [serviceId]);


    const [selectedDate, setSelectedDate] = useState([]);

    const handleDateClick = (info) => {
        const clickedDate = info.dateStr;

        // Check if the clicked date is already in the selected dates
        if (!selectedDate.includes(clickedDate)) {
            // If not, add the clicked date to the selectedDates array
            setSelectedDate([...selectedDate, clickedDate]);

            // Optionally, mark the clicked date in green
            const clickedDayElement = document.querySelector(`[data-date="${clickedDate}"]`);
            if (clickedDayElement) {
                clickedDayElement.style.backgroundColor = "green"; // Mark as green
                clickedDayElement.style.color = "#fff"; // Change text color to white
            }
        }
    };

    const handleScroll = () => {
        if (bookingRef.current) {
            bookingRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [isChecked, setIsChecked] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState("CoverImage");

    const handleTabChange = (event, newValue) => setTab(newValue);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = () => {

        // const queryParams = new URLSearchParams({
        //     capacity: "100 people",
        //     description: "Spacious banquet hall suitable for weddings.",
        //     location: serviceDetails.additionalFields.location,
        //     name: serviceDetails.additionalFields.businessName,
        //     price: serviceDetails.additionalFields.priceRange,
        //     // service_Id: "wedding123",
        //     _id: serviceDetails._id,
        //     selectedDate: parsedChoice.datesChoosed, // can also use .join(',') if needed
        //     isChecked: true,
        //     imageUrls: serviceDetails.additionalFields.images.map(img => img.base64).join(",")
        // }).toString();

        navigate(`/checkout/${serviceDetails._id}`, {
            state: {
                capacity: "100 people",
                description: "Spacious banquet hall suitable for weddings.",
                location: serviceDetails.additionalFields.availableLocations,
                name: serviceDetails.additionalFields.businessName,
                price: serviceDetails.additionalFields.priceRange,
                _id: serviceDetails._id,
                selectedDate: parsedChoice.datesChoosed,
                isChecked: true,
                imageUrls: serviceDetails.images.CoverImage[0],
            }
        });

        // const queryParams = new URLSearchParams({
        //     capacity: serviceDetails.capacity,
        //     description: serviceDetails.description,
        //     location: serviceDetails.location,
        //     name: serviceDetails.name,
        //     price: serviceDetails.price,
        //     service_Id: serviceDetails[`${serviceName}_id`],
        //     _id: serviceDetails._id,
        //     selectedDate: parsedChoice.datesChoosed,
        //     //  selectedDate.format('YYYY-MM-DD'),
        //     isChecked: isChecked,
        //     imageUrls: serviceDetails.imageUrls.join(',') // Join images into a single string
        // }).toString();
        // navigate(`/checkout/${serviceDetails[`${serviceName}_id`]}?${queryParams}`); 
    };

    const faqs = [
        {
            question: "How do I book a service on this platform?",
            answer: "You can check availability and confirm your booking by selecting a date and completing the inquiry or payment form.",
        },
        {
            question: "Can I check availability before booking?",
            answer: "Yes, most services have a real-time calendar. You can also chat with vendors to double-check availability.",
        },
        {
            question: "What is the cancellation and refund policy?",
            answer: "Cancellation policies differ by vendor. Most offer full refunds up to a certain period. Please check the policy listed on each service page.",
        },
        {
            question: "Are the prices final or negotiable?",
            answer: "The listed price is usually the base rate. You can request a custom quote or chat with the vendor to negotiate.",
        },
        {
            question: "Can I customize the service package?",
            answer: "Absolutely! You can choose add-ons like drone shots, special decor, or theme-based customization when available.",
        },
        {
            question: "How do payments work?",
            answer: "Payments can be made online securely. Vendors may accept full payment upfront or partial payments based on their policy.",
        },
    ];

    const reviews = [
        {
            name: "Obayedul",
            rating: 4,
            date: "13 Oct 2024",
            comment: `"Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette."`
        },
        {
            name: "Rashmi",
            rating: 5,
            date: "20 Oct 2024",
            comment: `"Absolutely loved the service, the team was super supportive and everything was well organized!"`
        },
        {
            name: "Arun",
            rating: 4.5,
            date: "18 Oct 2024",
            comment: `"Very professional and responsive. The decor looked stunning!"`
        },
    ];

    const handleDateChange = (updatedChoice) => {
        const newChoice = { ...parsedChoice, ...updatedChoice };
        setParsedChoice(newChoice); // ✅ This triggers re-render
        // localStorage.setItem('customerChoice', JSON.stringify(newChoice));
    };


    const truncateValue = (text) => {
        if (!text) return 'N/A';
        const firstSentence = text.split('.')[0];
        return firstSentence.length > 100 ? firstSentence.slice(0, 100) + '...' : firstSentence + '...';
    };

    const images = serviceDetails?.images;

    const detailsRef = useRef(null);

    const scrollToDetails = () => {
        // setShowAll(true);
        setTimeout(() => {
            detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // slight delay to allow render
    };


    const DummyCard = () => {
        return (
            <Card
                sx={{
                    minWidth: 200,
                    maxWidth: 220,
                    borderRadius: 4,
                    boxShadow: 0,
                    cursor: "pointer",
                    position: "relative",
                    "&:hover": { boxShadow: "0px 6px 5px rgba(0, 0, 0, 0.2)" },
                }}
            >
                <CardMedia
                    component="img"
                    image={`https://picsum.photos/200/${Math.floor(100 + Math.random() * 900)}`}
                    alt="Dummy Service"
                    sx={{
                        maxHeight: 150,
                        objectFit: "cover",
                        width: "100%",
                        borderRadius: 3,
                    }}
                />

                <CardContent sx={{ ml: 1, p: 1 }}>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            mb: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        Dummy Business Name
                    </Typography>

                    {/* Location */}
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <Chip label="Chennai" size="small" sx={{ fontSize: "0.65rem" }} />
                        <Chip label="Bangalore" size="small" sx={{ fontSize: "0.65rem" }} />
                    </Box>

                    {/* Price & Rating */}
                    <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                            From ₹5000
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarHalf sx={{ fontSize: 14, color: '#666', ml: 2 }} />
                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
                                4.5
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };


    return (
        <Box>
            <Header />
            {loading && <Typography variant="h6">Loading...</Typography>}
            {error && <Typography variant="body2" color="error">{error}</Typography>} {/* Changed to show error message properly */}

            {
                loading && <Container maxWidth="lg">
                    <Grid container spacing={4} sx={{ mt: 5 }}>
                        {/* Left Side - Product Image */}
                        <Grid item xs={12} md={6}>
                            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
                        </Grid>

                        {/* Right Side - Product Details */}
                        <Grid item xs={12} md={6}>
                            <Box>
                                {/* Product Title Skeleton */}
                                <Skeleton variant="text" width="80%" height={40} />

                                {/* Price Skeleton */}
                                <Skeleton variant="text" width="30%" height={30} sx={{ mt: 1 }} />

                                {/* Description Skeleton */}
                                <Skeleton variant="text" width="100%" height={20} />
                                <Skeleton variant="text" width="95%" height={20} />
                                <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />

                                {/* Rating Skeleton */}
                                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} variant="circular" width={24} height={24} />
                                    ))}
                                </Box>

                                {/* Buttons Skeleton */}
                                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                                    <Skeleton variant="rectangular" width={140} height={50} sx={{ borderRadius: 2 }} />
                                    <Skeleton variant="rectangular" width={140} height={50} sx={{ borderRadius: 2 }} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            }

            {
                serviceDetails ?

                    <Box sx={{ display: "flex", justifyContent: "center" }}>

                        <Grid container sx={{ mt: 7, p: { xs: 2, md: 5 } }} maxWidth='lg'>
                            {/* Wedding Venue Information */}
                            <Grid item xs={12} md={12} sx={{ mb: 2, p: { xs: 1, md: 4 } }}>


                                <Grid container spacing={4}>
                                    {/* Left: Images */}
                                    <Grid item xs={12} md={6} lg={6}>

                                        <Grid container alignItems="center" justifyContent="space-between" sx={{ position: 'relative' }}>
                                            {/* <Grid item> */}
                                            <Typography variant="h6" color="primary" gutterBottom fontWeight={500}>
                                                {serviceDetails.additionalFields.businessName}
                                            </Typography>
                                            {/* </Grid> */}

                                            {/* <Grid item> */}
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent card click
                                                    toggleFavorite(serviceDetails);
                                                }}
                                                sx={{
                                                    zIndex: 2,
                                                }}
                                            >
                                                {favorites.some((item) => item._id === serviceDetails._id) ? (
                                                    <Favorite sx={{ fontSize: 24 }} color="error" />
                                                ) : (
                                                    <FavoriteBorder sx={{ fontSize: 24, color: "gray" }} />
                                                )}
                                            </IconButton>
                                            {/* </Grid> */}
                                        </Grid>

                                        {/* Main Image */}
                                        <CardMedia
                                            component="img"
                                            alt="Wedding Hall"
                                            height="250"
                                            image={images.CoverImage?.[0]}
                                            sx={{ borderRadius: 3 }}
                                        />

                                        {/* Additional Images */}
                                        <Box
                                            mt={2}
                                            sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                justifyContent: isMobile ? "flex-start" : "flex-start",
                                                gap: 1,
                                            }}
                                        >
                                            {images.wedding?.slice(0, 3).map((imgUrl, index) => (
                                                <CardMedia
                                                    key={index}
                                                    component="img"
                                                    alt={`Wedding Image ${index + 1}`}
                                                    height="80"
                                                    image={imgUrl}
                                                    sx={{
                                                        borderRadius: 3,
                                                        width: { xs: "100px", sm: "90px", md: "100px" },
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ))}

                                            <Box
                                                sx={{
                                                    borderRadius: 2,
                                                    height: 80,
                                                    backgroundColor: "#4b769f",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    cursor: "pointer",
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    width: { xs: "100px", sm: "90px", md: "100px" },
                                                }}
                                                onClick={handleOpen}
                                            >
                                                View All
                                            </Box>
                                        </Box>




                                        {/* Dialog for All Photos */}
                                        <Modal open={open} onClose={handleClose}>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    width: { xs: "95%", sm: "90%", md: "70%" },
                                                    maxHeight: "90vh",
                                                    bgcolor: "background.paper",
                                                    borderRadius: 3,
                                                    boxShadow: 24,
                                                    p: { xs: 2, sm: 3 },
                                                }}
                                            >
                                                {/* Modal Title */}
                                                <Stack direction='row' justifyContent='space-between'>
                                                    <Typography
                                                        variant="h6"
                                                        gutterBottom
                                                        sx={{ fontWeight: "bold", textAlign: "center" }}
                                                    >
                                                        Image Gallery
                                                    </Typography>
                                                    <IconButton onClick={() => setOpen(false)}>
                                                        <Close />
                                                    </IconButton>
                                                </Stack>

                                                {/* Tabs */}
                                                <Tabs
                                                    value={tab}
                                                    onChange={handleTabChange}
                                                    variant="scrollable"
                                                    scrollButtons="auto"
                                                    sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
                                                >
                                                    {Object.keys(images).map((key) => (
                                                        <Tab key={key} label={key} value={key} />
                                                    ))}
                                                </Tabs>

                                                {/* Scrollable Grid Area */}
                                                <Box
                                                    sx={{
                                                        maxHeight: "60vh", // Adjust this as needed
                                                        overflowY: "auto",
                                                        pr: 1, // Prevent right-side scrollbar from cutting content
                                                    }}
                                                >
                                                    <Grid container spacing={2}>
                                                        {images[tab]?.map((img, idx) => (
                                                            <Grid item xs={6} sm={4} md={3} key={idx}>
                                                                <CardMedia
                                                                    component="img"
                                                                    image={img}
                                                                    alt={`Image ${idx}`}
                                                                    sx={{
                                                                        width: "100%",
                                                                        height: 150,
                                                                        borderRadius: 2,
                                                                        objectFit: "cover",
                                                                        boxShadow: 2,
                                                                        transition: "transform 0.3s ease",
                                                                        '&:hover': {
                                                                            transform: "scale(1.05)",
                                                                        },
                                                                    }}
                                                                />
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Modal>





                                    </Grid>

                                    {/* Right: Description */}
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Typography variant="subtitle1"
                                            color='primary'>  Description</Typography>
                                        <Typography variant="body2" paragraph>
                                            {serviceDetails.additionalFields.description}
                                        </Typography>

                                        <Grid container justifyContent='space-evenly' sx={{ backgroundColor: "#f6f3ff", maxWidth: 400, placeSelf: "flex-start", borderRadius: 3 }} >

                                            {/* Block 1 */}
                                            <Grid item xs={3} sx={{
                                                borderRadius: 0,
                                                m: 2,
                                                borderRight: '1px solid purple'
                                            }}>
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    flexDirection="column"
                                                >
                                                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 500 }}>
                                                        4.9
                                                    </Typography>
                                                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 500 }}>
                                                        Ratings
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            {/* Block 2 */}
                                            <Grid item xs={3} sx={{
                                                borderRadius: 0,
                                                m: 2,
                                                pr: 4,
                                                borderRight: '1px solid purple'
                                            }}>

                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent='center'
                                                    flexDirection="column"
                                                >
                                                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 500 }}>
                                                        Excellent
                                                    </Typography>
                                                    <Rating
                                                        name="rating-2"
                                                        value={4.5}
                                                        precision={0.1}
                                                        readOnly
                                                        icon={<Star sx={{ color: "gold", fontSize: "20px" }} />}
                                                        emptyIcon={<Star sx={{ color: "grey", fontSize: "20px" }} />}
                                                    />
                                                </Box>
                                            </Grid>

                                            {/* Block 3 */}
                                            <Grid item xs={3} >
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    flexDirection="column"
                                                    sx={{
                                                        borderRadius: 2,
                                                        padding: 2,
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 500 }}>
                                                        4.9
                                                    </Typography>
                                                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 500 }}>
                                                        Reviews
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                        </Grid>


                                        <Divider sx={{ margin: '10px 0' }} />

                                        {/* {serviceDetails.additionalFields.customFields.length > 0 && (
                                            <Box sx={{ display: 'grid', gap: 2 }}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        backgroundColor: lightBackgrounds[0],
                                                        // p: 2,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        color='primary'
                                                        sx={{ mb: 1 }}
                                                    >
                                                        {serviceDetails.additionalFields.customFields[0]?.name || 'Custom Field 1'}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            fontSize: '0.9rem',
                                                            fontStyle: 'italic',
                                                            ml: 1,
                                                        }}
                                                    >
                                                        {truncateValue(serviceDetails.additionalFields.customFields[0]?.value)}

                                                        {serviceDetails.additionalFields.customFields.length > 1 && (
                                                            <Button variant="text" sx={{ ml: 3 }} size="small" onClick={scrollToDetails}>
                                                                View More
                                                            </Button>
                                                        )}
                                                    </Typography>


                                                </Paper>

                                            </Box>
                                        )} */}
                                        {serviceDetails.additionalFields.customFields.length > 0 && (
                                            <Grid container spacing={2} alignItems="center" mt={1}>
                                                {serviceDetails.additionalFields.customFields.slice(0, 3).map((field, index) => (
                                                    <Grid item xs={6} sm={6} md={6} key={index}>
                                                        <Box
                                                            sx={{
                                                                backgroundColor: lightBackgrounds[index % lightBackgrounds.length],
                                                                px: 2,
                                                                py: 1,
                                                                borderRadius: 2,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    fontSize: '0.875rem',
                                                                    color: 'primary.main',
                                                                }}
                                                            >
                                                                {field.name || `Custom Field ${index + 1}`}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}

                                                {serviceDetails.additionalFields.customFields.length > 0 && (
                                                    <Grid item xs={12} md={6} display='flex' justifyContent='flex-end'>
                                                        <Button
                                                            endIcon={<NavigateNext />}
                                                            variant="text"
                                                            size="small"
                                                            onClick={scrollToDetails}
                                                            sx={{
                                                                px: 2,
                                                                py: 1,
                                                                color: "royalblue",
                                                                borderRadius: 2,
                                                                fontSize: '0.75rem',
                                                                textTransform: 'none',
                                                                height: '100%',
                                                                minWidth: 120,
                                                            }}
                                                        >
                                                            View Additional Details
                                                        </Button>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        )}


                                        <Grid container sx={{
                                            display: "flex",
                                            flexDirection: { xs: "row", md: "row" },
                                            justifyContent: { xs: "space-around", md: "end" },
                                            alignItems: "start",
                                            gap: 2,
                                            mt: 3,
                                        }}>

                                            {/* FullCalendar (Compact & Responsive) */}
                                            <Button
                                                onClick={handleScroll}
                                                variant="outlined"
                                                color="inherit"
                                                fullWidth
                                                sx={{
                                                    mb: 2,
                                                    textTransform: "none",
                                                    fontWeight: 500,
                                                    // width: "50%",
                                                    width: 'fit-content',
                                                    borderColor: "#6d4d94",
                                                    color: "#6d4d94",
                                                    borderRadius: 2,
                                                    '&:hover': {
                                                        backgroundColor: "#f3e8ff",
                                                        borderColor: "#6d4d94",
                                                    },
                                                }}
                                            // onClick={() => setShowCalendar(prev => !prev)}
                                            >
                                                View Availability
                                                {/* {showCalendar ? "Hide Availability" : "View Availability"} */}
                                            </Button>

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSubmit}
                                                startIcon={<CheckCircle />}
                                                sx={{
                                                    // maxWidth: 300,
                                                    height: "50%",
                                                    borderRadius: "10px",
                                                    // width: 'fit-content',
                                                    fontWeight: 600,
                                                    background: "linear-gradient(45deg, #6d4d94, #9b59b6)",
                                                    color: "#fff",
                                                    transition: "0.3s ease",
                                                    '&:hover': {
                                                        background: "linear-gradient(45deg, #5a3e7b, #884ea0)",
                                                        transform: "scale(1.02)",
                                                    },
                                                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                                                }}
                                            >
                                                Book Now
                                            </Button>

                                            {/* <style>
                                                {`
.fc .fc-button-primary {
background-color: #6d4d94 !important;
color: #ffffff !important;
border: none !important;
padding: 0.4rem 1rem;
border-radius: 6px;
}
.fc .fc-toolbar-title {
font-size: 1.2rem !important;
font-weight: 500 !important;
}
.fc .fc-daygrid-body-natural .fc-daygrid-day-events {
margin-bottom: 0 !important;
}
.fc .fc-daygrid-day.fc-day-today {
background-color: #f0f7ff !important;
}
`}
                                            </style> */}

                                        </Grid>


                                        {/* <Collapse in={showCalendar}>
                                            <FullCalendar
                                                plugins={[dayGridPlugin, interactionPlugin]}
                                                initialView="dayGridMonth"
                                                headerToolbar={{
                                                    start: "prev,next",
                                                    center: "title",
                                                    end: "",
                                                }}
                                                dateClick={handleDateClick}  // Handle date click
                                                showNonCurrentDates={false} // <-- This hides neighbor month days
                                                fixedWeekCount={false} // Optional: adjusts the number of weeks shown
                                                events={
                                                    serviceDetails?.dates
                                                        ? [
                                                            ...(serviceDetails.dates.booked || []).map((date) => ({
                                                                title: "Booked",
                                                                start: date,
                                                                color: "lightpink",
                                                            })),
                                                            ...(serviceDetails.dates.waiting || []).map((date) => ({
                                                                title: "Waiting",
                                                                start: date,
                                                                color: "orange",
                                                            })),
                                                            ...(serviceDetails.dates.available || []).map((date) => ({
                                                                title: "Available",
                                                                start: date,
                                                                color: "green",
                                                            })),
                                                        ]
                                                        : []
                                                }
                                                height="auto" // Smaller height for compact design
                                                aspectRatio={1.5} // More compact size
                                                contentHeight="auto"
                                            />


                                        </Collapse> */}
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* show custom fields */}
                            {serviceDetails.additionalFields.customFields.length > 0 && (
                                <Grid container spacing={3} ref={detailsRef} sx={{ mt: { xs: 0, md: 1 }, mb: 6 }}>
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 'bold', color: '#4b769f', }}
                                        >
                                            Additional Information
                                        </Typography>
                                    </Grid>

                                    {serviceDetails.additionalFields.customFields.map((field, index) => (
                                        <Grid item xs={12} md={6} key={index}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    backgroundColor: lightBackgrounds[index % lightBackgrounds.length],
                                                    p: 2,
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}
                                                >
                                                    {field?.name || `Custom Field ${index + 1}`}
                                                </Typography>

                                                {field?.value?.split('.').filter(v => v.trim()).length > 1 ? (
                                                    <List dense sx={{ pl: 2 }}>
                                                        {field.value.split('.').map((point, idx) =>
                                                            point.trim() ? (
                                                                <ListItem key={idx} disableGutters>
                                                                    <ListItemIcon sx={{ minWidth: 24 }}>
                                                                        🗸
                                                                        {/* <FiberManualRecord sx={{ fontSize: '0.5rem', color: 'primary.main' }} /> */}
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary={point.trim()}
                                                                        primaryTypographyProps={{
                                                                            fontStyle: 'italic',
                                                                            fontSize: '0.9rem',
                                                                            color: 'text.secondary',
                                                                        }}
                                                                    />
                                                                </ListItem>
                                                            ) : null
                                                        )}
                                                    </List>
                                                ) : (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            fontSize: '0.9rem',
                                                            fontStyle: 'italic',
                                                            ml: 1,
                                                        }}
                                                    >
                                                        {field?.value || 'N/A'}
                                                    </Typography>
                                                )}
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* view availablity */}
                            <Grid item xs={12} sm={6} md={8} lg={8} ref={bookingRef}
                            >
                                <DateStorer onDateChange={handleDateChange}
                                    // bookedDates={serviceDetails?.dates.booked}
                                    bookedDates={serviceDetails?.dates?.booked ?? []}

                                />
                            </Grid>

                            {/* booking summary */}
                            <Grid item xs={12} sm={6} md={4} lg={4}>
                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        backgroundColor: '#f9f6ff',
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom color="primary">
                                        Booking Summary
                                    </Typography>

                                    <Grid container spacing={2} sx={{ my: 1 }}>
                                        <img src='https://img.freepik.com/free-vector/gradient-hotel-banner-with-photo_23-2148917529.jpg?uid=R133306793&ga=GA1.1.1773690977.1730112906&semt=ais_hybrid&w=740' style={{ width: "100%", height: "200px", objectFit: "contain" }} />
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {parsedChoice?.datesChoosed?.[0]
                                                    ? format(parseISO(parsedChoice.datesChoosed[0]), 'dd MMM yyyy')
                                                    : 'Choose Date'}
                                            </Typography>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {parsedChoice.datesChoosed?.at(-1)
                                                    ? format(parseISO(parsedChoice.datesChoosed.at(-1)), 'dd MMM yyyy')
                                                    : 'Choose Date'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Days</Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {parsedChoice.datesChoosed.length}</Typography>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Price/Day</Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                ₹{serviceDetails.additionalFields.priceRange}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth size="small" sx={{ my: 1 }}>
                                                <InputLabel id="location-label">Select Location</InputLabel>
                                                <Select
                                                    labelId="location-label"
                                                    label="Select Location"
                                                    defaultValue={parsedChoice.location?.[0] || ""}
                                                    onChange={(e) => {
                                                        const selectedLocation = e.target.value;

                                                        // Get current customerChoice
                                                        const currentChoice = JSON.parse(localStorage.getItem("customerChoice")) || {};

                                                        // Update location field with selected value in an array
                                                        const updatedChoice = {
                                                            ...currentChoice,
                                                            location: [selectedLocation],
                                                        };

                                                        localStorage.setItem("customerChoice", JSON.stringify(updatedChoice));
                                                    }}
                                                >
                                                    {serviceDetails.additionalFields.availableLocations?.map((loc, index) => (
                                                        <MenuItem key={index} value={loc}>
                                                            {loc}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                    </Grid>



                                    <Box
                                        sx={{
                                            mt: 3,
                                            p: 2,
                                            backgroundColor: '#795cab17',
                                            borderRadius: 1,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                            startIcon={<CheckCircle />}
                                            sx={{
                                                // maxWidth: 300,
                                                height: "50%",
                                                borderRadius: "10px",
                                                // width: 'fit-content',
                                                fontWeight: 600,
                                                background: "linear-gradient(45deg, #6d4d94, #9b59b6)",
                                                color: "#fff",
                                                transition: "0.3s ease",
                                                '&:hover': {
                                                    background: "linear-gradient(45deg, #5a3e7b, #884ea0)",
                                                    transform: "scale(1.02)",
                                                },
                                                boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                                            }}
                                        >
                                            Confirm Booking
                                        </Button>

                                    </Box>
                                </Box>
                            </Grid>

                            {/* Additional Information */}
                            <Grid item xs={12} md={12} sx={{ mt: 5, mb: 2 }}>
                                <Typography variant="h6" gutterBottom>Additional Information</Typography>
                                <TextField label="Special Requests (Optional)" fullWidth multiline rows={4} variant="outlined" />
                            </Grid>

                            {/* Additional Section: Why Choose This Venue */}
                            <Box sx={{ mb: 5, mt: 5, bgcolor: '#f4f6f9', p: { xs: 3, md: 5 }, borderRadius: 2 }}>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    mb={4}
                                    textAlign="center"
                                    color="primary.main"
                                    sx={{ letterSpacing: "0.5px" }}
                                >
                                    Why Choose {serviceDetails.additionalFields.businessName}
                                    ?
                                </Typography>

                                <Grid container spacing={3} alignItems="stretch">
                                    {[
                                        {
                                            icon: <EventAvailable color="success" fontSize="large" />,
                                            title: "Perfect for All Occasions",
                                            description: "Ideal for weddings, receptions, corporate events, and cultural programs."
                                        },
                                        {
                                            icon: <Settings color="info" fontSize="large" />,
                                            title: "Modern Amenities",
                                            description: "Equipped with AC, generator backup, and decorative services to enhance your experience."
                                        },
                                        {
                                            icon: <LocalParking color="secondary" fontSize="large" />,
                                            title: "Ample Parking",
                                            description: "Parking space for up to 50 vehicles ensures convenience for your guests."
                                        },
                                        {
                                            icon: <LocationOn color="error" fontSize="large" />,
                                            title: "Prime Location",
                                            description: "Located at the heart of Chennai with easy access to public transport."
                                        },
                                    ].map((item, index) => (
                                        <Grid item xs={12} sm={6} key={index}>
                                            <Card
                                                sx={{
                                                    boxShadow: 0,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    height: "100%", // Ensures all cards are of equal height
                                                    p: 3,
                                                    borderRadius: 3,
                                                    bgcolor: '#ffffff',
                                                    border: "1px solid #e0e0e0",
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    {item.icon}
                                                    <Typography
                                                        variant="h6"
                                                        ml={2}
                                                        fontWeight="bold"
                                                        color="text.primary"
                                                    >
                                                        {item.title}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                                                    {item.description}
                                                </Typography>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            {/* review and rating */}
                            <Grid container spacing={4} sx={{ mb: 5 }}>
                                <Grid item xs={12} >
                                    <Typography variant="body5" color='textSecondary' gutterBottom sx={{ fontWeight: "bold", }}>
                                        Rating & Reviews
                                    </Typography>
                                </Grid>
                                {/* Rating Summary */}
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ p: 2, borderRadius: 2, }}>

                                        <Grid container spacing={2} alignItems="center" sx={{ p: 4 }}>
                                            {/* LEFT: Average Rating */}
                                            <Grid item xs={12} md={4}>
                                                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ fontWeight: 'bold', fontSize: '3rem', lineHeight: 1 }}
                                                    >
                                                        4.5
                                                        <Typography color='textSecondary' variant="span" sx={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1 }}>/5</Typography>

                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                                        (50 New Reviews)
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            {/* RIGHT: Star Distribution */}
                                            <Grid item xs={12} md={8}>
                                                {[5, 4, 3, 2, 1].map((star) => {
                                                    const count = {
                                                        5: 30,
                                                        4: 12,
                                                        3: 5,
                                                        2: 2,
                                                        1: 1,
                                                    }[star];
                                                    const total = 50;
                                                    const percentage = (count / total) * 100;

                                                    return (
                                                        <Box
                                                            key={star}
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                mb: 1,
                                                            }}
                                                        >
                                                            {/* Star Number */}
                                                            <Box sx={{ minWidth: 30 }}>
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {star} ★
                                                                </Typography>
                                                            </Box>

                                                            {/* Progress Bar */}
                                                            <Box sx={{ flex: 1, mx: 2 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={percentage}
                                                                    sx={{
                                                                        height: 10,
                                                                        borderRadius: 5,
                                                                        backgroundColor: "#e0e0e0",
                                                                        "& .MuiLinearProgress-bar": {
                                                                            backgroundColor: "#fbc02d",
                                                                        },
                                                                    }}
                                                                />
                                                            </Box>

                                                            {/* Count */}
                                                            <Box sx={{ minWidth: 30 }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {count}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Box>

                                </Grid>

                                {/* Review Carousel */}
                                <Grid item xs={12} sm={6}>
                                    <Splide
                                        options={{
                                            type: "loop",
                                            perPage: 1,
                                            gap: "1rem",
                                            arrows: false,
                                            autoplay: false,
                                            breakpoints: {
                                                960: { perPage: 1 },
                                            },
                                        }}
                                        aria-label="User Reviews"
                                    >
                                        {reviews.map((review, index) => (
                                            <SplideSlide key={index}>
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                        p: 4,
                                                        borderRadius: "10px",
                                                        bgcolor: "#f9f9f9",
                                                        position: "relative",
                                                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                                                        "&::before": {
                                                            content: '""',
                                                            position: "absolute",
                                                            left: 10,
                                                            top: "50%",
                                                            width: "4px",
                                                            height: "80%",
                                                            bgcolor: "#ff7e5f",
                                                            transform: "translateY(-50%)",
                                                            borderRadius: "4px",
                                                        },
                                                    }}
                                                >
                                                    <Avatar
                                                        src={review.img}
                                                        alt={review.name}
                                                        sx={{
                                                            width: 50,
                                                            height: 50,
                                                            borderRadius: "50%", // Ensures it's always circular
                                                        }}
                                                    />


                                                    <Box>
                                                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
                                                                {review.name}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: "#333" }}>
                                                                {review.date}
                                                            </Typography>
                                                        </Box>

                                                        <Rating name="read-only" value={review.rating} readOnly size="small" />


                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: "#555", lineHeight: 1.5, fontStyle: "italic", mt: 0.5, mt: 5 }}
                                                        >
                                                            {review.comment}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </SplideSlide>
                                        ))}
                                    </Splide>
                                </Grid>
                            </Grid>


                            {/* Confirmation Button */}
                            {/* <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
                                <Button variant="contained" sx={{ maxWidth: 250, textAlign: "end" }} color="primary" onClick={handleSubmit} >
                                    Book Now
                                </Button>
                            </Grid> */}


                            {/* faq */}
                            <Grid item xs={12} md={6}>

                                <Typography variant="body5" color='textSecondary' gutterBottom sx={{ fontWeight: "bold", }}>
                                    Frequently Asked Questions
                                </Typography>

                                {faqs.map((faq, index) => (
                                    <Accordion key={index} sx={{
                                        backgroundColor: "#fafafa",
                                        borderRadius: "8px",
                                        mb: 2,
                                        mt: 2,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                    }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                            aria-controls={`faq-content-${index}`}
                                            id={`faq-header-${index}`}
                                            sx={{
                                                fontWeight: 600,
                                                color: "#4b2a72",
                                            }}
                                        >
                                            {faq.question}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography color="textSecondary">{faq.answer}</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Grid>

                            {/* feedback */}
                            <Grid item xs={12} md={6} sx={{ mt: { xs: 4, md: 0 } }}>

                                <Typography variant="body5" color='textSecondary' gutterBottom sx={{ fontWeight: "bold", }}>
                                    Rate {serviceDetails.additionalFields.businessName}
                                </Typography>

                                <FeedbackSection />
                            </Grid>

                            {/* Report Venue */}
                            <Grid item xs={12} sx={{ mt: 4 }} >
                                <Typography variant="body5" color='textSecondary' component='div' gutterBottom sx={{ fontWeight: "bold", }}>
                                    Report Venue
                                </Typography>
                                <FormControlLabel
                                    control={<Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />}
                                    label="I want to report an issue with this service"
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

                            <Box sx={{ mt: 4, width: "100%" }}>
                                <Typography variant='h6' gutterBottom >
                                    You May Also Like
                                </Typography>

                                <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: "space-evenly", flexDirection: "row", mt: 4 }}>

                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <DummyCard key={i} />
                                    ))}
                                </Grid>
                            </Box>
                        </Grid >
                    </Box >
                    :
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 10, minHeight: '10vh' }}>
                        <Typography color='textSecondary' sx={{ p: 2, }}> The Service is currently unavailable</Typography>
                    </Box>
            }



            <FooterComponent />
        </Box >
    );
};

export default withLoadingAndError(CategoryDetails);
