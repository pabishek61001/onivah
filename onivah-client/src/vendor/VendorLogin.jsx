import React from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import LoginDialog from '../components/loginDialog/LoginDialog';
import { useNavigate } from 'react-router-dom';

const VendorLogin = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/vendor-services');
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(to bottom right, #f4f4f9, #eaeaea)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: 3,
                }}
            >
                <Grid container>
                    {/* Left Section: Image */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            height: { xs: 200, md: 'auto' },
                            backgroundImage: 'url("https://img.freepik.com/premium-photo/wedding-stage-indian-marriage_747653-13698.jpg?w=1060")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    {/* Right Section: Content */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: "center"
                        }}
                    >
                        <CardContent sx={{ textAlign: { xs: 'left', md: 'center' } }}>
                            {/* Heading */}
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    mt: 2,
                                    fontWeight: 'bold',
                                    color: 'primary.main',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    mb: 2
                                }}
                            >
                                Become a Vendor
                            </Typography>

                            {/* Subheading */}
                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 1,
                                    color: 'text.secondary',
                                    lineHeight: 1.6,
                                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                                }}
                            >
                                Welcome back! Access your dashboard to manage bookings, view inquiries,
                                and enhance your services to provide the perfect wedding experience.
                            </Typography>

                            {/* Login Dialog */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: "center"
                            }}>
                                <LoginDialog handleLogin={handleLogin} />
                            </Box>



                            {/* Extra Details */}
                            <Box mt={4}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.85rem',
                                        display: 'block',
                                        mb: 1,
                                    }}
                                >
                                    Trouble logging in?
                                </Typography>
                                <Typography
                                    variant="caption"
                                    component="a"
                                    href="#contact-support"
                                    sx={{
                                        textDecoration: 'none',
                                        color: 'primary.main',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    Contact our support team
                                </Typography>
                            </Box>

                            {/* Decorative Divider */}
                            <Box
                                sx={{
                                    width: '50%',
                                    height: '2px',
                                    backgroundColor: 'primary.main',
                                    mx: 'auto',
                                    mt: 5,
                                }}
                            />
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
};

export default VendorLogin;
