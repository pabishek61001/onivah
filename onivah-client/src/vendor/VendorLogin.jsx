import React, { useState } from 'react';
import { Box, Button, Card, Container, TextField, CardContent, Grid, Stack, Typography, Alert } from '@mui/material';
import LoginDialog from '../components/loginDialog/LoginDialog';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import apiUrl from '../Api/Api';

const VendorLogin = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(true);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [contactType, setContactType] = useState('email');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // State variables for OTP inputs
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');

    // Flags to track if OTP is sent
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
    const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);

    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);


    const sendOtp = async (type) => {
        let endpoint = '/send-otp';
        let payload;

        if (type === 'email') {
            payload = { type, email };  // Send email field
        } else if (type === 'phone') {
            payload = { type, phone };  // Send phone field
        }
        console.log(email);
        try {
            const response = await axios.post(`${apiUrl}/vendor/${endpoint}`, payload);
            console.log(response.data.message);
            if (type === 'email') {
                setIsEmailOtpSent(true);
            } else if (type === 'phone') {
                setIsPhoneOtpSent(true);
            }
        } catch (error) {
            console.error('Error sending OTP:', error.response ? error.response.data.message : error);
        }
    };


    // Function to verify OTP (email or phone)
    const verifyOtp = async (type) => {
        let otp;
        let endpoint;
        let payload;

        // Determine which OTP to verify based on the type (email or phone)
        if (type === 'email') {
            otp = emailOtp;  // OTP entered by the user for email
            endpoint = '/verify-email-otp';
            payload = { otp, email };  // Send OTP and email to backend
        } else if (type === 'phone') {
            otp = phoneOtp;  // OTP entered by the user for phone
            endpoint = '/verify-phone-otp';
            payload = { otp, phone };  // Send OTP and phone to backend
        }

        try {
            // Send the OTP to the backend for verification
            const response = await axios.post(`${apiUrl}/vendor${endpoint}`, payload);

            // Handle success: OTP verified
            console.log(response.data.message);
            if (type === 'email') {
                setIsEmailVerified(true);
            } else if (type === 'phone') {
                setIsPhoneVerified(true);
            }
        } catch (error) {
            // Handle error: Invalid OTP or network error
            if (error.response) {
                console.error(error.response.data.message);
            } else {
                console.error('Error verifying OTP:', error.message);
            }
        }
    };




    const handleSubmit = (event) => {
        event.preventDefault();
        if (isEmailVerified && isPhoneVerified) {
            // Enable password set and navigate
            navigate(`/vendor/set-password?email=${email}&phone=${phone}`);
        } else {
            setError('Please verify both email and phone.');
        }
    };


    return (
        <>


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




                                    <Container maxWidth="xs">
                                        <Typography variant="h6" mb={5} align="center" gutterBottom>
                                            {isSignup ? 'Signup' : 'Login'}
                                        </Typography>
                                        <form onSubmit={handleSubmit}>
                                            <Grid container spacing={3}>
                                                {isSignup ? (
                                                    <>
                                                        <Grid container spacing={3}>
                                                            {/* Email Field */}
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    label="Email"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                    required
                                                                />
                                                            </Grid>

                                                            {/* Email OTP Actions */}
                                                            {email && !isEmailOtpSent && (
                                                                <Grid item xs={12} container spacing={2} direction="row" alignItems="center" sx={{ display: isEmailVerified ? "none" : "block" }}>
                                                                    <Grid item xs={6}>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="primary"
                                                                            onClick={() => sendOtp('email')}
                                                                            fullWidth
                                                                        >
                                                                            Verify Email
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            )}

                                                            {isEmailOtpSent && (
                                                                <Grid item xs={12} sx={{ display: isEmailVerified ? "none" : "block" }}>
                                                                    <TextField
                                                                        label="Enter Email OTP"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        value={emailOtp}
                                                                        type='tel'
                                                                        onChange={(e) => setEmailOtp(e.target.value)}
                                                                        required
                                                                    />
                                                                </Grid>
                                                            )}

                                                            {isEmailOtpSent && (
                                                                <Grid item xs={12} container spacing={2} direction="row" alignItems="center" sx={{ display: isEmailVerified ? "none" : "flex" }}>
                                                                    <Grid item xs={6}>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="primary"
                                                                            onClick={() => verifyOtp('email')}
                                                                            fullWidth
                                                                            disabled={!emailOtp}
                                                                        >
                                                                            Verify OTP
                                                                        </Button>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="secondary"
                                                                            onClick={() => sendOtp('email')}
                                                                            fullWidth
                                                                        >
                                                                            Resend OTP
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            )}

                                                            {isEmailVerified && (
                                                                <Grid item xs={12}>
                                                                    <Alert severity="success" icon={false}>
                                                                        <span style={{ fontSize: '16px', marginRight: '10px' }}>✔</span> Email Verified
                                                                    </Alert>
                                                                </Grid>
                                                            )}

                                                            {/* Phone Field */}
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    label="Phone"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    value={phone}
                                                                    onChange={(e) => setPhone(e.target.value)}
                                                                    required
                                                                />
                                                            </Grid>

                                                            {/* Phone OTP Actions */}
                                                            {phone && !isPhoneOtpSent && (
                                                                <Grid item xs={12} container spacing={2} direction="row" alignItems="center" sx={{ display: isPhoneVerified ? "none" : "flex" }}>
                                                                    <Grid item xs={6}>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="primary"
                                                                            onClick={() => sendOtp('phone')}
                                                                            fullWidth
                                                                        >
                                                                            Verify Phone
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            )}

                                                            {isPhoneOtpSent && (
                                                                <Grid item xs={12} sx={{ display: isPhoneVerified ? "none" : "flex" }}>
                                                                    <TextField
                                                                        label="Enter Phone OTP"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        value={phoneOtp}
                                                                        onChange={(e) => setPhoneOtp(e.target.value)}
                                                                        required
                                                                    />
                                                                </Grid>
                                                            )}

                                                            {isPhoneOtpSent && (
                                                                <Grid item xs={12} container spacing={2} direction="row" alignItems="center" sx={{ display: isPhoneVerified ? "none" : "flex" }}>
                                                                    <Grid item xs={6}>
                                                                        <Button
                                                                            variant="contained"
                                                                            color="primary"
                                                                            onClick={() => verifyOtp('phone')}
                                                                            fullWidth
                                                                            disabled={!phoneOtp}
                                                                        >
                                                                            Verify OTP
                                                                        </Button>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Button
                                                                            variant="outlined"
                                                                            color="secondary"
                                                                            onClick={() => sendOtp('phone')}
                                                                            fullWidth
                                                                        >
                                                                            Resend OTP
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            )}

                                                            {isPhoneVerified && (
                                                                <Grid item xs={12}>
                                                                    <Alert severity="success" icon={false}>
                                                                        <span style={{ fontSize: '16px', marginRight: '10px' }}>✔</span> Phone Verified
                                                                    </Alert>
                                                                </Grid>
                                                            )}

                                                            {/* Set Password Button (enabled after both OTPs are verified) */}
                                                            {/* {isEmailVerified && isPhoneVerified && (
                                                                <Grid item xs={12}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        fullWidth
                                                                        onClick={() => console.log('Setting password')}
                                                                    >
                                                                        Set Password
                                                                    </Button>
                                                                </Grid>
                                                            )} */}
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Grid item xs={12}>
                                                            <FormControl component="fieldset">
                                                                <FormLabel component="legend">Choose Login Method</FormLabel>
                                                                <RadioGroup
                                                                    row
                                                                    value={contactType}
                                                                    onChange={(e) => setContactType(e.target.value)}
                                                                >
                                                                    <FormControlLabel value="email" control={<Radio />} label="Email" />
                                                                    <FormControlLabel value="phone" control={<Radio />} label="Phone" />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                        {contactType === 'email' && (
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    label="Email"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                    required
                                                                />
                                                            </Grid>
                                                        )}
                                                        {contactType === 'phone' && (
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    label="Phone"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    value={phone}
                                                                    onChange={(e) => setPhone(e.target.value)}
                                                                    required
                                                                />
                                                            </Grid>
                                                        )}
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                label="Password"
                                                                type="password"
                                                                variant="outlined"
                                                                fullWidth
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                required
                                                            />
                                                        </Grid>
                                                    </>
                                                )}

                                                <Grid item xs={12}>
                                                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={!isEmailVerified || !isPhoneVerified}>
                                                        {isSignup ? 'Set Password' : 'Log In'}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                        {error && <Typography color="error" variant="body2">{error}</Typography>}
                                        {success && <Typography color="primary" variant="body2">{success}</Typography>}
                                        <Grid container justifyContent="center">
                                            <Button onClick={() => setIsSignup(!isSignup)} color="secondary">
                                                {isSignup ? 'Already have an account? Login' : 'Need an account? Sign up'}
                                            </Button>
                                        </Grid>
                                    </Container>





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

        </>
    );
};

export default VendorLogin;
