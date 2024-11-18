import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, Grid, Container, Box, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import withLoadingAndError from '../hoc/withLoadingAndError';
import apiUrl from '../Api/Api';
import { Link } from 'react-router-dom';
import { LocationCity } from '@mui/icons-material';

const TopPicks = ({ loading, setLoading, error, setError }) => {
    const [topPicksData, setTopPicksData] = useState([]);

    // Fetch top picks data from the API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${apiUrl}/landing/toppicks`);
                setTopPicksData(response.data.top_picks);
            } catch (err) {
                setError('Error fetching top picks');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setLoading, setError]);

    const buttonStyle = {
        mt: 1,
        alignSelf: 'end',
        color: 'white',
        bgcolor: '#f75858',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'black',  // Blue background on hover
            zIndex: 0,
            transition: 'transform 0.4s ease',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
        },
        '&:hover::before': {
            transform: 'scaleX(1)',
        },
        '&:hover': {
            // color: 'white',  // Ensure text color remains white on hover
        },
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    color: '#f73838c7',
                    p: 2,
                }}
                data-aos="fade-up"
            >
                Our Highlights
            </Typography>
            <Typography variant='h6' gutterBottom color='textSecondary' sx={{ p: 4, textAlign: 'center' }} data-aos="fade-up">
                Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
            </Typography>

            <Grid container spacing={5} sx={{ p: 2 }}>
                {topPicksData.map((pick, index) => (
                    <Grid item xs={12} sm={6} md={4} key={pick._id} data-aos="fade-up" data-aos-dalay="1200">
                        <Link to={`/venue/${pick.venue_id}`} style={{ textDecoration: 'none' }} target="_blank">
                            <Card
                                sx={{
                                    position: 'relative',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                    '&:hover': {
                                        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.3)',
                                    },
                                }}
                                data-aos="fade-up"  // Adds the fade-up animation
                                data-aos-delay={`${index * 200}`}
                            >
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={pick.imageUrl}
                                        alt={pick.name}
                                        sx={{
                                            filter: 'brightness(0.75)',
                                            transition: 'filter 0.3s ease',
                                            '&:hover': { filter: 'brightness(0.9)' },
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            p: 2,
                                            color: 'white',
                                            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))',
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {pick.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: '#FFD700' }}>
                                            {pick.ratings} <StarIcon fontSize="small" sx={{ color: '#FFD700', ml: 0.5 }} />
                                        </Typography>
                                    </Box>
                                </Box>

                                <CardContent sx={{ p: 2 }}>

                                    <Typography
                                        variant="body2"
                                        color="text.primary"
                                        sx={{ display: 'flex', alignItems: 'center', fontWeight: 'medium', fontSize: '1rem' }}
                                    >
                                        <LocationCity sx={{ mr: 0.5, color: 'secondary.main' }} />  {/* Add an icon if desired */}
                                        {pick.location}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ mt: 0.5 }}
                                    >
                                        Price: ₹{pick.price} / day
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={buttonStyle}
                                    >
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                zIndex: 1,  // Ensure text stays above the pseudo-element
                                            }}
                                        >
                                            Book Now
                                        </Box>
                                    </Button>

                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

// Enhance the TopPicks component with loading and error handling
export default withLoadingAndError(TopPicks);
