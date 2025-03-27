import React, { useEffect, useState, useMemo } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import Showcases from '../components/Showcases';
import TopPicks from '../components/TopPicks';
import { Box, Card, CardContent, CardMedia, CardActions, Container, Grid, IconButton, Typography, Button, Skeleton } from '@mui/material';
import FooterComponent from '../components/FooterComponent';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Favorite from '@mui/icons-material/Favorite';
import axios from 'axios';
import apiUrl from '../Api/Api';
import HeroVideo from '../components/HeroVideo';
import GallerySection from '../utils/GallerySection';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import WelcomeSection from '../components/WelcomeSection';
import Testimonials from '../components/Testimonials';
import { useFavorites } from '../Favourites/FavoritesContext';
import { FavoriteBorder, NavigateNext } from '@mui/icons-material';

const LandingPage = ({ setLoading, setError }) => {

    const navigate = useNavigate();

    const [searchData, SetSearchData] = useState([]);
    const [customerChoice, setCustomerChoice] = useState({
        location: '',
        datesChoosed: '',
        category: '',
    });

    const { favorites, toggleFavorite } = useFavorites();

    const location = useLocation();

    // Extract URL parameters when location changes
    useEffect(() => {

        window.scroll(0, 0);

        const params = new URLSearchParams(location.search);
        const locationParam = params.get('location') || '';
        const datesChoosedParam = params.getAll('datesChoosed') || [];
        const categoryParam = params.get('category') || '';

        // Update customerChoice based on URL parameters
        setCustomerChoice({
            location: locationParam,
            datesChoosed: datesChoosedParam,
            category: categoryParam,
        });

        const fetchVenueData = async () => {
            if (locationParam || categoryParam) {
                try {
                    const response = await axios.get(
                        `${apiUrl}/header/search?location=${locationParam}&category=${categoryParam}`
                    );

                    if (response.data.success) {
                        SetSearchData(response.data.service);
                    } else {
                        SetSearchData([]); // No venues found
                    }
                } catch (error) {
                    SetSearchData([]);
                    console.error("Error fetching venue data:", error);
                }
            }
        };

        fetchVenueData();
    }, [location]);


    const createQueryString = (choice) => {
        const { location, datesChoosed, category } = choice;
        // Encode each part to ensure valid URL format
        const dates = datesChoosed.join(','); // Convert array to string
        return `?location=${encodeURIComponent(location)}&datesChoosed=${encodeURIComponent(dates)}&category=${encodeURIComponent(category)}`;
    };

    const hasSearchResults = useMemo(
        () => customerChoice.location || customerChoice.datesChoosed.length > 0 || customerChoice.category,
        [customerChoice]
    );

    const formatText = (text) => {
        return text
            ? text
                .replace(/_/g, " ") // Replace underscores with spaces
                .replace(/([a-z])([A-Z])/g, "$1 $2") // Split PascalCase
                .toLowerCase() // Convert everything to lowercase first
                .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
            : "All Categories";
    };


    return (
        <div className='overall-container'>
            <Header />
            {hasSearchResults ? (
                <Container sx={{ mt: 10 }}>

                    <Typography variant="body5" component='div' fontWeight="bold" color='inherit' gutterBottom>
                        Search Results for{" "}
                        <Box component="span" sx={{ color: "secondary.main", fontWeight: "bold" }}>
                            {formatText(customerChoice.category) || "All Categories"}
                        </Box>{" "}
                        in{" "}
                        <Box component="span" sx={{ color: "secondary.main", fontWeight: "bold" }}>
                            {formatText(customerChoice.location) || "All Locations"}
                        </Box>
                    </Typography>



                    <Typography variant="body5" color="textSecondary">
                        Here are the results matching your query. Refine your search for more accuracy.
                    </Typography>

                    <Grid container spacing={2} sx={{ mt: 5 }}>

                        {searchData.length === 0 ? (
                            // Show Skeleton Loader when loading or no data
                            [...Array(4)].map((_, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <Card sx={{ borderRadius: 4, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" }}>
                                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "4px 4px 0 0" }} />
                                        <CardContent>
                                            <Skeleton variant="text" width="80%" height={24} />
                                            <Skeleton variant="text" width="60%" height={20} />
                                            <Skeleton variant="text" width="50%" height={20} />
                                        </CardContent>
                                        <CardActions>
                                            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
                                            <Skeleton variant="circular" width={36} height={36} />
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            // Show actual data when available
                            searchData.map((product, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{ mb: 2 }}>
                                    <Card
                                        sx={{
                                            borderRadius: 4,
                                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                                            backgroundColor: "#faf4fe",
                                            cursor: "pointer",
                                            "&:hover": { boxShadow: "0px 6px 5px rgba(0, 0, 0, 0.2)" },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={`data:image/jpeg;base64,${product.additionalFields.images?.[0]?.base64}`}
                                            alt={product.additionalFields.businessName || "Service Image"}
                                            sx={{ objectFit: "cover", transition: "transform 0.3s", "&:hover": { transform: "scale(1.02)" } }}
                                        />
                                        <CardContent sx={{ ml: 1, borderRadius: 2, p: 1 }}>
                                            <Typography variant="h6" fontWeight="bold" textAlign="left" sx={{ color: "#333" }}>
                                                {product.additionalFields.businessName}
                                            </Typography>
                                            <Typography variant="subtitle1" color="primary" textAlign="left">
                                                {product.additionalFields.availableLocations || "N/A"}
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary" textAlign="left">
                                                Price: ₹{product.additionalFields.priceRange || "N/A"}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: "space-between", ml: 1, mb: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                sx={{ textTransform: "none", borderRadius: 2 }}
                                                endIcon={<NavigateNext />}
                                                onClick={() => navigate(`/category/${product.category}/${product._id}`)}
                                            >
                                                View Details
                                            </Button>
                                            <IconButton onClick={() => toggleFavorite(product)}>
                                                {favorites.some(item => item._id === product._id) ? (
                                                    <Favorite color="error" />
                                                ) : (
                                                    <FavoriteBorder />
                                                )}
                                            </IconButton>

                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Container>

            ) : (
                <>
                    <HeroVideo />
                    <SearchBox />
                    <WelcomeSection />
                    <Showcases />
                    <GallerySection />
                    <TopPicks />
                    <Testimonials />
                </>
            )}

            <FooterComponent />
        </div>
    );
};

export default LandingPage;
