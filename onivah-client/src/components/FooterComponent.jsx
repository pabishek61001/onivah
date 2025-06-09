import React from 'react';
import { Avatar, Box, Button, Container, Grid, Link, TextField, ThemeProvider, Typography } from '@mui/material';
import theme from '../Themes/theme';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const FooterComponent = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box component="footer" sx={{ backgroundColor: 'black', padding: '3rem 0', color: 'white' }}>
                <Container sx={{ width: "100%" }}>
                    <Grid container spacing={6} justifyContent="center">
                        {/* Logo & Description */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Box display="flex" flexDirection="column" alignItems={{ xs: 'center', md: 'flex-start' }}>
                                <img src='https://via.placeholder.com/100' alt="Company Logo" width={100} style={{ marginBottom: '1rem' }} />
                                <Typography variant="body1" textAlign={{ xs: 'center', md: 'left' }}>
                                    Your one-stop destination for the best deals on fashion, electronics, and more.
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Customer Service */}
                        <Grid item xs={12} sm={6} md={2}>
                            <Typography variant="h6" gutterBottom sx={{ color: "lightblue" }}>
                                Customer Service
                            </Typography>
                            {['Help Center', 'Returns & Refunds', 'Shipping Policy', 'Privacy Policy'].map((item, index) => (
                                <Link key={index} href="#" variant="body1" underline="hover" display="block" sx={{ color: "white" }}>
                                    {item}
                                </Link>
                            ))}
                        </Grid>

                        {/* Shop Categories */}
                        <Grid item xs={12} sm={6} md={2}>
                            <Typography variant="h6" gutterBottom sx={{ color: "lightblue" }}>
                                Shop Categories
                            </Typography>
                            {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Health'].map((item, index) => (
                                <Link key={index} href="#" variant="body1" underline="hover" display="block" sx={{ color: "white" }}>
                                    {item}
                                </Link>
                            ))}
                        </Grid>

                        {/* Stay Connected & Newsletter */}
                        <Grid item xs={12} sm={6} md={2}>
                            <Typography variant="h6" gutterBottom sx={{ color: "lightblue" }}>
                                Stay Connected
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, index) => (
                                    <Link key={index} href="#" color="inherit"><Icon /></Link>
                                ))}
                            </Box>
                            <Typography variant="body2" gutterBottom>
                                Subscribe to our newsletter for exclusive offers and updates.
                            </Typography>
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Enter your email"
                                sx={{ input: { color: 'white' }, bgcolor: '#333', borderRadius: 1, width: '100%' }}
                            />
                            <Button variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
                                Subscribe
                            </Button>
                        </Grid>

                        {/* Payment Methods */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom sx={{ color: "lightblue" }}>
                                Payment Methods
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CreditCardIcon />
                                <Typography variant="body2">Visa, Mastercard, PayPal</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Bottom Footer */}
                    <Box textAlign="center" sx={{ marginTop: '2rem' }}>
                        <Typography variant="body2">
                            &copy; {new Date().getFullYear()} Your Store. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default FooterComponent;