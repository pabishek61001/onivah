import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Header from '../components/Header';
import FooterComponent from '../components/FooterComponent';
import axios from 'axios';
import apiUrl from '../Api/Api';

const ContactForm = () => {
    const isMobile = useMediaQuery('(max-width:600px)');

    // State to manage form data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        eventType: '',
        message: '',
    });

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/user/contact`, formData);
            alert(response.data.message); // Show success message
            setFormData({
                fullName: '',
                email: '',
                phoneNumber: '',
                eventType: '',
                message: '',
            }); // Reset form
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong, please try again.');
        }
    };

    return (
        <Box>
            <Header />
            <Box sx={{ margin: 'auto', mt: 10 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Left-side image */}
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src="https://img.freepik.com/premium-vector/web-page-with-people-flat-style-white-background-subscribe-our-newsletter_123447-4725.jpg?w=740" // Replace with the path to your image
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
                                padding: 3,
                                borderRadius: '8px',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography variant="h4" align="center" color="primary" gutterBottom>
                                Contact Us
                            </Typography>
                            <Typography variant="subtitle1" align="center" mb={3}>
                                Fill out the form to book your dream occasions
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Full Name"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Email"
                                            type="email"
                                            variant="outlined"
                                            fullWidth
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Phone Number"
                                            type="tel"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                        />
                                    </Grid>

                                    {/* Dropdown for Event Type */}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined" required>
                                            <InputLabel>Event Type</InputLabel>
                                            <Select
                                                label="Event Type"
                                                name="eventType"
                                                value={formData.eventType}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="catering">Catering</MenuItem>
                                                <MenuItem value="mandapam">Mandapam</MenuItem>
                                                <MenuItem value="decors">Decors</MenuItem>
                                                <MenuItem value="mehendi">Mehendi</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            label="Message"
                                            variant="outlined"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} display="flex" justifyContent="center">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            sx={{
                                                maxWidth: 250,
                                                color: "white",
                                                padding: 1,
                                                fontSize: isMobile ? '1rem' : '1.1rem',
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
