import React from 'react';
import { Box, Typography, Avatar, Card } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css'; // Import Splide CSS

const Testimonials = () => {
    const testimonials = [
        {
            avatar: 'https://images.squarespace-cdn.com/content/v1/6564afb4f0851760cfcdde58/65d81608-1723-4239-aee5-a7e166ff0fb1/Zahan-Rida-Reception-ITC-Chennai-0735.jpg',
            name: 'John & Jane Doe',
            role: 'Wedding Couple',
            message: 'The wedding hall was absolutely perfect for our big day. The staff were incredibly helpful, and the ambiance was just magical!',
            rating: 5,
        },
        {
            avatar: 'https://imgmedia.lbb.in/media/2024/09/66dec952f2518a751e3b7161_1725876562466.jpg?w=1200&h=628&fill=blur&fit=fill',
            name: 'Robert Brown',
            role: 'Groom',
            message: 'The venue provided a stunning backdrop for our wedding photos. Highly recommend this place for any event!',
            rating: 5,
        },
        {
            avatar: 'https://media.istockphoto.com/id/1380516073/photo/female-party-planner-arranging-decorations-for-a-child-birthday-party.jpg?s=612x612&w=0&k=20&c=7LWTCxgrl-8VmX8J0YToQU69_HJeBhj47ufevbxQtFU=',
            name: 'Alice Smith',
            role: 'Event Planner',
            message: 'We had an unforgettable experience. The decor, the food, and the overall atmosphere were perfect for our celebration.',
            rating: 5,
        },
    ];

    return (
        <Box sx={{ py: 10, }}>
            <Typography variant="h4" color="primary" align="center" gutterBottom sx={{ fontWeight: '600', mb: 6 }}>
                What Our Clients Say
            </Typography>

            <Splide
                options={{
                    type: 'loop', // Infinite loop
                    perPage: 3, // Number of slides visible at once
                    autoplay: true,
                    pauseOnHover: true,
                    arrows: true,
                    pagination: true,
                    gap: '2rem',
                    focus: 'center', // Centers the current slide
                    breakpoints: {
                        600: {
                            perPage: 1, // For mobile devices, show 1 slide at a time
                        },
                    },
                }}
                className="testimonial-slider"
            >
                {testimonials.map((testimonial, index) => (
                    <SplideSlide key={index}>
                        <Card
                            sx={{
                                bgcolor: "aliceblue",
                                textAlign: 'center',
                                p: 3,
                                borderRadius: '20px',
                                boxShadow: 3,
                                position: 'relative',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            <Avatar
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                sx={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto',
                                    mb: 2,
                                    border: '3px solid #8d65b1',
                                }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: '600', mb: 1 }}>
                                {testimonial.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                {testimonial.role}
                            </Typography>
                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                "{testimonial.message}"
                            </Typography>
                        </Card>
                    </SplideSlide>
                ))}
            </Splide>

            {/* Custom CSS */}
            <style>{`
               .testimonial-slider .splide__slide {
                    opacity: 0.3; /* Default opacity for non-active slides */
                    transition: opacity 0.3s ease;
                }

                .testimonial-slider .splide__slide.is-active {
                    opacity: 1 !important; /* Full opacity for active (centered) slide */
                }
            `}</style>
        </Box>
    );
};

export default Testimonials;
