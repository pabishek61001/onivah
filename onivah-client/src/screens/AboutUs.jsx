import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Container, CardMedia, Button, CardActions } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Header from '../components/Header';
import FooterComponent from '../components/FooterComponent';
import Showcases from '../components/Showcases';
import Aos from 'aos';

const AboutUs = () => {

    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        Aos.init({
            duration: 1500, // You can customize this and other options here
            easing: 'ease-in-out-cubic', // Optional easing
        });

        // Cleanup AOS when the component unmounts
        return () => {
            Aos.refresh(); // To reset AOS on component unmount if needed
        };
    }, []); //

    const buttonStyle = {
        mt: 1,
        alignSelf: 'end',
        color: 'white',
        bgcolor: '#704d8f',  // Blue background on hover
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            bgcolor: 'royalblue',
            width: '100%',
            height: '100%',
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

    return (
        <Box>
            <Header />

            <Container sx={{ mt: 15 }}>
                {/* About Us Section */}
                <Box textAlign="center" mb={5} >
                    <Typography variant="h4" gutterBottom color="black">
                        About Us
                    </Typography>
                    <Typography variant="h6" color="textSecondary" sx={{ mx: 'auto', }}>
                        We help make your dream events come to life. From finding the perfect venue to connecting you with talented photographers, caterers, and planners, we provide everything you need for a flawless celebration.
                    </Typography>
                </Box>

                {/* Our Mission Section */}

                <Grid
                    container
                    // spacing={2}
                    alignItems="stretch" // #452558 Ensures both sides have equal height
                    sx={{
                        backgroundColor: '#faf4fe',
                        // backgroundColor: '#dedede69',
                        borderRadius: 3,
                        padding: isMobile ? 2 : 4,
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                        overflow: "hidden"
                    }}
                >
                    <Grid
                        item
                        xs={12} // Full width on mobile, or adjust based on the screen size
                        md={6}  // Half width on medium screens and above
                        sx={{
                            padding: isMobile ? 2 : 3,
                            borderRadius: 2,
                            // boxShadow: isMobile ? 'none' : '0px 4px 12px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',  // Centers the content vertically
                        }}
                        data-aos="fade-right"
                    >
                        <Typography variant="h4" component="h3" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                            Our Mission
                        </Typography>
                        <Typography variant="text" color="textSecondary" sx={{ lineHeight: 1.8, mt: 1 }}>
                            At Dream Occasions, our mission is to make event planning simple, enjoyable, and stress-free.
                            We connect you with top-rated professionals and venues to ensure your special moments are unforgettable.
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                marginTop: 3,
                                padding: '12px 24px',
                                borderRadius: 2,
                                alignSelf: 'flex-start',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                transition: "transform 0.2s ease",
                                '&:hover': {
                                    transform: "scale(1.1)",
                                    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            Book Now
                        </Button>
                    </Grid>

                    <Grid
                        item
                        xs={12} // Full width on mobile, or adjust based on the screen size
                        md={6}  // Half width on medium screens and above
                        sx={{ display: 'flex', justifyContent: 'center' }}
                        data-aos="fade-left"
                    >
                        <CardMedia
                            component="img"
                            height="100%"  // Ensures the image stretches to the full height of the box
                            image="https://img.freepik.com/free-photo/decorated-hall-wedding-is-ready-celebration_8353-10236.jpg?t=st=1731154168~exp=1731157768~hmac=e3b1c36ac17f7608b7ce69da47d19a163e0087f8caa3f8d119eb08054bbacfd7&w=900"
                            alt="Our mission image"
                            sx={{
                                borderRadius: 3,
                                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
                                transition: 'transform 0.3s ease',
                                objectFit: 'cover',  // Ensures the image covers the entire height
                            }}
                        />
                    </Grid>
                </Grid>





                {/* Services Section */}
                <Box mb={3} p={3} mt={4}>
                    <Typography variant="h4" gutterBottom color="primary" sx={{ textAlign: "center", p: 2, fontWeight: 700 }} data-aos="fade-up">
                        What We Offer
                    </Typography>
                    <Typography variant="h6" color="textSecondary" gutterBottom sx={{ textAlign: "center", mb: 4, }} data-aos="fade-up">
                        We help make your dream events come to life.
                    </Typography>
                    <Grid container spacing={4}>
                        {[
                            { title: 'Venue Selection', description: 'Find the perfect venue for weddings, parties, and more.', img: 'https://img.freepik.com/free-photo/restaurant-hall-with-round-square-tables-some-chairs-plants_140725-8033.jpg?t=st=1731154126~exp=1731157726~hmac=0b8625f4c643335ed2e92e00c4c2546bf4909f2956e2458d989f63bfcec6d19c&w=740', link: "/wedding hall" },
                            { title: 'Photographers', description: 'Capture your moments with professional photographers.', img: 'https://img.freepik.com/free-photo/man-with-camera-world-photographer-day_1150-23278.jpg?t=st=1731154202~exp=1731157802~hmac=34bd643fd040ea3fcf6770fb0c8dacff5df893ce7d1ec1e061b5a30f85ceabd7&w=900', link: "/phtographers" },
                            { title: 'Catering', description: 'Choose from a variety of catering options to suit your taste.', img: 'https://img.freepik.com/free-photo/banquet-table-with-snacks_144627-18359.jpg?ga=GA1.1.1773690977.1730112906&semt=ais_hybrid', link: "/catering" },
                            { title: 'Event Planning', description: 'Personalized planning to make every event seamless.', img: 'https://img.freepik.com/free-photo/female-wedding-planner-working-ceremony_23-2150167258.jpg?t=st=1731154253~exp=1731157853~hmac=3489738dbc8dd87ac23bcd17c13ba59c37e1a4bf324716973effe33afe0b51c1&w=900', link: "/event planners" }
                        ].map((service, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                }} data-aos="fade-up"  // Adds the fade-up animation
                                    data-aos-delay={`${index * 200}`}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={service.img}
                                        alt={service.title}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" color="black" gutterBottom>
                                            {service.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {service.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button variant='contained' sx={buttonStyle} >
                                            <Box sx={{ position: "relative", zIndex: 1, }}>
                                                Book Now
                                            </Box>

                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Meet Our Team Section */}
                <Box mb={5} p={3}>
                    <Typography variant="h4" gutterBottom color="primary" sx={{ textAlign: "center", p: 4, fontWeight: 700 }} data-aos="fade-up">
                        Meet Our Team
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { name: 'Emily Johnson', role: 'Founder & CEO', img: 'https://images.pexels.com/photos/8528852/pexels-photo-8528852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
                            { name: 'John Doe', role: 'Founder & CEO', img: 'https://images.pexels.com/photos/17049832/pexels-photo-17049832/free-photo-of-elegant-man-in-armchair.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
                            { name: 'Jane Smith', role: 'Developer', img: 'https://images.pexels.com/photos/2102415/pexels-photo-2102415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
                        ].map((teamMember, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    }} data-aos="fade-up"  // Adds the fade-up animation
                                    data-aos-delay={`${index * 200}`}
                                >
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Avatar
                                            alt={teamMember.name}
                                            src={teamMember.img}
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                margin: '0 auto',
                                                mb: 2,
                                            }}
                                        />
                                        <Typography variant="h6" gutterBottom color="black">
                                            {teamMember.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {teamMember.role}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>


                {/* Call to Action Section */}
                <Box textAlign="center" mt={5}>
                    <Typography variant="h5" color="#4169E1" gutterBottom>
                        Ready to Plan Your Event?
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mb={3}>
                        Contact us today to make your dream occasion a reality.
                    </Typography>
                    <Button variant="contained" color="primary" sx={buttonStyle}>
                        <Box sx={{ position: "relative", zIndex: 1, p: 1 }}>
                            Get in Touch
                        </Box>
                    </Button>
                </Box>
            </Container >

            <FooterComponent />
        </Box >
    );
};

export default AboutUs;
