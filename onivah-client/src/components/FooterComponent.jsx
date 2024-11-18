import React from 'react'
import { Avatar, Box, Button, Container, Grid, Link, ThemeProvider, Typography } from '@mui/material';
import theme from '../Themes/theme';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const FooterComponent = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box
                component="footer"
                sx={{
                    backgroundColor: 'black',
                    padding: '2rem 0',
                    marginTop: 10,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4}>

                        {/* Logo Section */}
                        <Grid item xs={12} sx={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <img
                                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmFX8KnLgEJNSPmBnpEa0sY52gMgXoLIr6_A&s'
                                alt="Company Logo"
                                width={100}
                            />
                        </Grid>

                        {/* About Section */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
                                About Us
                            </Typography>
                            <Typography variant="body1" color="white">
                                We are a leading company in event management, providing top-notch services for various occasions.
                            </Typography>
                        </Grid>

                        {/* Quick Links Section */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom sx={{ color: "lightblue" }}>
                                Quick Links
                            </Typography>
                            <Link href="#" variant="body1" underline="hover" display="block" sx={{ color: "white" }}>
                                Home
                            </Link>
                            <Link href="#" variant="body1" underline="hover" display="block" sx={{ color: "white" }}>
                                Services
                            </Link>
                            <Link href="#" variant="body1" underline="hover" display="block" sx={{ color: "white" }}>
                                Contact Us
                            </Link>
                            <Link href="#" variant="body1" underline="hover" display="block" sx={{ color: "white" }}>
                                About Us
                            </Link>
                        </Grid>

                        {/* Services Section */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom sx={{ color: "lightblue" }}>
                                Services
                            </Typography>
                            <Link href="#" variant="body1" underline="hover" display="block" sx={{ color: "white" }}>
                                Event Planning
                            </Link>
                            <Link href="#" variant="body1" underline="hover" display="block" sx={{ color: "white" }}>
                                Venue Booking
                            </Link>
                            <Link href="#" variant="body1" underline="hover" display="block" sx={{ color: "white" }}>
                                Catering Services
                            </Link>
                            <Link href="#" variant="body1" underline="hover" display="block" sx={{ color: "white" }}>
                                Event Coordination
                            </Link>
                        </Grid>
                        {/* Contact Section */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom sx={{ color: "lightblue" }}>
                                Contact Us
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <EmailIcon sx={{ color: 'lightblue', mr: 1 }} />
                                <Typography variant="body1" sx={{ color: "white" }}>
                                    Email: info@eventcompany.com
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PhoneIcon sx={{ color: 'aliceblue', mr: 1 }} />
                                <Typography variant="body1" sx={{ color: "white" }}>
                                    Phone: +123 456 7890
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOnIcon sx={{ color: 'lightblue', mr: 1 }} />
                                <Typography variant="body1" sx={{ color: "white" }}>
                                    Address: 123 Event Street, City, Country
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Bottom Footer */}
                    <Box textAlign="center" sx={{ marginTop: '2rem' }}>
                        <Typography variant="body1" color='white' >
                            &copy; {new Date().getFullYear()} Event Company. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    )
}

export default FooterComponent