import React from 'react';
import { Box, Grid, Typography, Avatar, Card, CardContent, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import StarIcon from '@mui/icons-material/Star';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css'; // Import Splide CSS


const Testimonials = () => {

    const isMobile = useMediaQuery('(max-width:600px)');

    // Styled components for the testimonial section
    const TestimonialContainer = styled(Box)(({ theme }) => ({
        // padding: theme.spacing(8),
        background: '#fafafa',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', // Soft shadow
        marginTop: theme.spacing(6),
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
    }));

    const TestimonialCard = styled(Card)(({ theme }) => ({
        background: '#fff',
        borderRadius: '15px',
        padding: theme.spacing(3),
        textAlign: 'center',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)', // Soft shadow for card
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)', // Stronger shadow on hover
        },
    }));

    const StyledAvatar = styled(Avatar)(({ theme, backgroundImage }) => ({
        width: 'auto',
        height: '300px',
        margin: '0 auto',
        // border: '5px solid #fff',
        marginBottom: theme.spacing(2),
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)', // Shadow for prominence
        borderRadius: '0%', // Make it a square
        position: 'relative', // Position the element for applying the mask
        overflow: 'hidden', // Hide anything outside the bounds of the image
        backgroundColor: "#f6f6f6",
        // Masking effect using ::before
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${backgroundImage})`, // Use dynamic background image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: 'url(https://static.vecteezy.com/system/resources/previews/012/173/999/non_2x/black-transparent-paint-splash-free-png.png)', // Apply splash mask image
            maskSize: 'cover',
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
            zIndex: 1, // Ensure it overlays the image
            pointerEvents: 'none', // Prevent the mask from being interactive
        },
    }));


    const StarRating = styled(Box)(({ theme }) => ({
        display: 'flex',
        justifyContent: 'center',
        marginBottom: theme.spacing(2),
    }));

    const Star = styled(StarIcon)(({ theme }) => ({
        color: '#ffcc00',
        fontSize: '1.6rem', // Larger stars for more impact
        margin: '0 3px',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'scale(1.3)', // Slight zoom on hover
        },
    }));

    const TestimonialText = styled(Typography)(({ theme }) => ({
        fontStyle: 'italic',
        color: theme.palette.text.secondary,
        fontSize: '1.15rem',
        marginBottom: theme.spacing(2),
        maxWidth: '90%',
        margin: '0 auto',
    }));

    const Name = styled(Typography)(({ theme }) => ({
        fontWeight: '600',
        color: '#333',
        fontSize: '1.1rem',
        marginBottom: theme.spacing(0.5),
    }));

    const Position = styled(Typography)(({ theme }) => ({
        color: '#888',
        fontSize: '1rem',
    }));


    return (
        <TestimonialContainer>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: '#6d75bf', fontWeight: '600', p: 2 }} data-aos='fade-up'>
                What Our Clients Say
            </Typography>

            {/* Splide Slider for Testimonials */}
            <Splide options={{
                type: 'fade',
                perPage: 1,
                autoplay: false,
                pauseOnHover: true,
                arrows: true,
                pagination: true,
                gap: '2rem',
            }} data-aos='fade-up'>
                {/* Testimonial 1 */}
                <SplideSlide>
                    <TestimonialCard>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item xs={12} sm={4}>
                                <StyledAvatar
                                    alt="John Doe"
                                    backgroundImage="https://images.squarespace-cdn.com/content/v1/6564afb4f0851760cfcdde58/65d81608-1723-4239-aee5-a7e166ff0fb1/Zahan-Rida-Reception-ITC-Chennai-0735.jpg"
                                />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <CardContent>
                                    <TestimonialText variant="h6">
                                        "The wedding hall was absolutely perfect for our big day. The staff were incredibly helpful, and the ambiance was just magical!"
                                    </TestimonialText>
                                    <StarRating>
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                    </StarRating>
                                    <Name variant="body1">John & Jane Doe</Name>
                                    <Position variant="body2">Wedding Couple</Position>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </TestimonialCard>
                </SplideSlide>

                {/* Testimonial 2 */}
                <SplideSlide>
                    <TestimonialCard>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item xs={12} sm={4}>
                                <StyledAvatar alt="Robert Brown" backgroundImage="https://imgmedia.lbb.in/media/2024/09/66dec952f2518a751e3b7161_1725876562466.jpg?w=1200&h=628&fill=blur&fit=fill" />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <CardContent>
                                    <TestimonialText variant="h6">
                                        "The venue provided a stunning backdrop for our wedding photos. Highly recommend this place for any event!"
                                    </TestimonialText>
                                    <StarRating>
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                    </StarRating>
                                    <Name variant="body1">Robert Brown</Name>
                                    <Position variant="body2">Groom</Position>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </TestimonialCard>
                </SplideSlide>

                {/* Testimonial 3 */}
                <SplideSlide>
                    <TestimonialCard>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item xs={12} sm={4}>
                                <StyledAvatar alt="Alice Smith" backgroundImage="https://media.istockphoto.com/id/1380516073/photo/female-party-planner-arranging-decorations-for-a-child-birthday-party.jpg?s=612x612&w=0&k=20&c=7LWTCxgrl-8VmX8J0YToQU69_HJeBhj47ufevbxQtFU=" />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <CardContent>
                                    <TestimonialText variant="h6">
                                        "We had an unforgettable experience. The decor, the food, and the overall atmosphere were perfect for our celebration."
                                    </TestimonialText>
                                    <StarRating>
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                        <Star />
                                    </StarRating>
                                    <Name variant="body1">Alice Smith</Name>
                                    <Position variant="body2">Event Planner</Position>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </TestimonialCard>
                </SplideSlide>
            </Splide>
        </TestimonialContainer>
    );
};

export default Testimonials;
