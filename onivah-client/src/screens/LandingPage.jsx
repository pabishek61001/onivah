import React, { useEffect, useState, useMemo } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import Showcases from '../components/Showcases';
import TopPicks from '../components/TopPicks';
import { Box, Card, CardContent, CardMedia, Container, Grid, IconButton, Typography } from '@mui/material';
import FooterComponent from '../components/FooterComponent';
import { Link, useLocation } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import apiUrl from '../Api/Api';
import HeroVideo from '../components/HeroVideo';
import GallerySection from '../utils/GallerySection';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import WelcomeSection from '../components/WelcomeSection';
import Testimonials from '../components/Testimonials';
import Rough2 from './Rough2';


const LandingPage = ({ setLoading, setError }) => {
    const [topPicksData, setTopPicksData] = useState([]);
    const [customerChoice, setCustomerChoice] = useState({
        location: '',
        datesChoosed: '',
        category: '',
    });



    const location = useLocation();

    // Extract URL parameters when location changes
    useEffect(() => {
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

        // Fetch data if a location is provided
        const fetchVenueData = async () => {
            if (locationParam || categoryParam) {
                try {
                    // setLoading(true);
                    const response = await axios.get(
                        `${apiUrl}/header/search?location=${locationParam}&category=${categoryParam}`
                    );
                    console.log(response.data);
                    setTopPicksData(response.data);
                } catch (error) {
                    console.error('Error fetching venue data:', error);
                    setError(true);
                } finally {
                    // setLoading(false);
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

    return (
        <div className='overall-container'>
            <Header />
            {/* <video autoPlay muted loop className="background-video">
                <source src="https://videocdn.cdnpk.net/videos/d21eafb4-aff4-4b85-b1d9-099292d460ed/horizontal/previews/clear/large.mp4?token=exp=1729354916~hmac=4d828198ba3217e60a1b3646dece46e37285c3b3b297b58b8ac56246de3f74c5" type="video/mp4" />
            </video> */}
            {hasSearchResults ? (
                <Container sx={{ mt: 10 }}>
                    <h3>Search Results</h3>
                    {/* <pre>{JSON.stringify(customerChoice, null, 2)}</pre> */}
                    <Grid container spacing={2}>
                        {topPicksData.map(pick => (
                            <Grid item xs={12} sm={6} md={4} key={pick._id}>
                                <Link
                                    to={`/category/${pick.venue_id}${createQueryString(customerChoice)}`}
                                    target='_blank'
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Card
                                        sx={{
                                            position: 'relative',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={pick.imageUrls.length > 0 ? pick.imageUrls[0] : 'https://via.placeholder.com/140'} // Use the first image in the array or fallback
                                            alt={pick.name}
                                        />
                                        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Typography variant="body5" sx={{ fontWeight: "500" }} gutterBottom>{pick.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">Price: {pick.price}</Typography>
                                            <Typography variant="body2" color="text.secondary">Ratings: {pick.ratings} <StarIcon fontSize="small" sx={{ color: "black", }} /></Typography>
                                            <IconButton aria-label="add to favorites" color="error" sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                                                <FavoriteIcon sx={{ color: "white" }} />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
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
                    <Rough2 />
                    {/* <Testimonials /> */}
                </>
            )}

            <FooterComponent />
        </div>
    );
};

export default LandingPage;
