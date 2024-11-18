import React from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Header from '../components/Header';
import FooterComponent from '../components/FooterComponent';

const ContactForm = () => {
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
        <Box>
            <Header />
            <Box sx={{ margin: 'auto', mt: 10 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Left-side image */}
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src="https://img.freepik.com/free-vector/customer-support-illustration_23-2148903319.jpg?t=st=1731152865~exp=1731156465~hmac=db72f92d85351e09dd8b76ad183d3c59ae856a5e8668531a406b7ad5f65a7953&w=740" // Replace with the path to your image
                            alt="Wedding Hall"
                            sx={{
                                p: 8,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    </Grid>

                    {/* Right-side contact form */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                backgroundColor: '#f9f9f9',
                                padding: 3,
                                borderRadius: '8px',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography variant="h4" align="center" color="#4169E1" gutterBottom>
                                Contact Us
                            </Typography>
                            <Typography variant="subtitle1" align="center" mb={3}>
                                Fill out the form to book your dream occasions
                            </Typography>
                            <form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="Full Name" variant="outlined" fullWidth required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="Email" type="email" variant="outlined" fullWidth required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="Phone Number" type="tel" variant="outlined" fullWidth required />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Event Date"
                                            type="date"
                                            variant="outlined"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField label="Number of Guests" type="number" variant="outlined" fullWidth required />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField label="Message" variant="outlined" multiline rows={4} fullWidth />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            sx={{
                                                color: "white",
                                                padding: isMobile ? '10px' : '15px',
                                                fontSize: isMobile ? '1rem' : '1.1rem',
                                                backgroundColor: '#4169E1',
                                                ':hover': {
                                                    backgroundColor: '#2a82c7',
                                                },
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <FooterComponent />
        </Box>
    );
};

export default ContactForm;
