import React, { useState } from 'react';
import { Box, Button, Card, Container, TextField, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { apiUrl } from '../Api/Api';
import { Snackbar, Alert } from '@mui/material'; // Material UI Snackbar and Alert component
import Header from '../components/Header';
import FooterComponent from '../components/FooterComponent';
import PhoneInput from 'react-phone-input-2';

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

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success or error


    const sendOtp = async (type) => {
        let endpoint = '/send-otp';
        let payload;

        if (type === 'email') {
            payload = { type, email };  // Send email field
        } else if (type === 'phone') {
            payload = { type, phone };  // Send phone field
        }

        try {

            const response = await axios.post(`${apiUrl}/vendor${endpoint}`, payload);
            console.log(response.data.message);
            if (type === 'email') {
                setIsEmailOtpSent(true);
            } else if (type === 'phone') {
                setIsPhoneOtpSent(true);
            }

        } catch (error) {
            alert(error.response ? error.response.data.message : error)
            console.log('Error sending OTP:', error.response ? error.response.data.message : error);
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
            const response = await axios.post(`${apiUrl}/vendor/${endpoint}`, payload);

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




    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSignup) {
            if (isEmailVerified && isPhoneVerified) {
                // Enable password set and navigate
                navigate('/vendor/password_setup', {
                    state: { email, phone }
                });
            }
        } else {

            if ((!email && !phone) || !password) {
                setSnackbarMessage('Please fill the missing fields');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                return;
            }

            let payload = {};

            if (contactType === 'email' && email) {
                payload = { email, password };
            } else if (contactType === 'phone' && phone) {
                payload = { phone, password };
            }

            try {
                const response = await axios.post(`${apiUrl}/vendor/vendor-login`, payload, { withCredentials: true });

                if (response.data.success) {
                    // localStorage.setItem('vendor_token', response.data.token);
                    setSnackbarMessage('Login successful');
                    setSnackbarSeverity('success');
                    navigate(`/vendor-dashboard`)

                } else {
                    setSnackbarMessage(response.data.message);
                    setSnackbarSeverity('error');
                }
                setOpenSnackbar(true);
            } catch (error) {
                console.log('Error during login:', error);
                setSnackbarMessage('Failed to login. Please try again.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        }
    };


    return (

        <Box sx={{ bgcolor: "#f5f5f5", }}>
            <Header />

            <Grid maxWidth='xl' container sx={{ mt: 10, p: { xs: 1, md: 5 }, placeSelf: "center" }}>
                {/* Left Section: Image */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        height: { xs: 200, md: 'auto' },
                        backgroundImage: 'url("https://img.freepik.com/free-photo/look-from-afar-backyard-decorated-with-flowers-wedding-dinner_1304-3758.jpg?uid=R133306793&ga=GA1.1.1773690977.1730112906&semt=ais_hybrid&w=740")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 5,
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
                        alignItems: { xs: 'left', md: 'center' }
                    }}
                >
                    {/* <CardContent sx={{ textAlign: { xs: 'left', md: 'center' } }}> */}


                    {/* Login Dialog */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: "center"
                    }}>



                        <Container maxWidth="xs">

                            {/* Heading */}
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    mt: 2,
                                    fontWeight: 'bold',
                                    color: 'primary.main',
                                    letterSpacing: '1px',
                                    mb: 2
                                }}
                            >
                                Become a Vendor
                            </Typography>

                            {/* Subheading */}
                            <Typography
                                variant="caption"
                                color='textSecondary'
                                sx={{
                                    mb: 1,
                                    lineHeight: 1.6,
                                    maxWidth: 400,
                                }}
                            >
                                Welcome back! Access your dashboard to manage bookings, view inquiries,
                                and enhance your services to provide the perfect wedding experience.
                            </Typography>

                            <Typography variant="subtitle2" color='primary' mt={2} mb={2} align="left" gutterBottom>
                                {isSignup ? 'Sign Up' : 'Log In'}
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container >
                                    {isSignup ? (
                                        <>
                                            <Grid container spacing={3}>
                                                {/* Email Field */}
                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="Email"
                                                        variant="outlined"
                                                        fullWidth
                                                        sx={{ bgcolor: "#fff" }}
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </Grid>

                                                {/* Email OTP Actions */}
                                                {email && !isEmailOtpSent && (
                                                    <Grid item xs={12} container spacing={2} direction="row" alignItems="center" sx={{ display: isEmailVerified ? "none" : "block" }}>
                                                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                sx={{
                                                                    maxWidth: 150,
                                                                }}
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
                                                    {/* <TextField
                                                        label="Phone"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        required
                                                    /> */}
                                                    <PhoneInput
                                                        country={'in'}
                                                        value={phone}
                                                        onChange={(phone) => setPhone(phone)}
                                                        inputStyle={{
                                                            width: '100%',
                                                            height: '56px', // match MUI TextField height
                                                            fontSize: '16px'
                                                        }}
                                                        containerStyle={{ width: '100%' }}
                                                        specialLabel="Phone"
                                                        inputProps={{
                                                            required: true,
                                                            name: 'phone',
                                                        }}
                                                    />
                                                </Grid>

                                                {/* Phone OTP Actions */}
                                                {phone && !isPhoneOtpSent && (
                                                    <Grid item xs={12} container spacing={2} direction="row" alignItems="center" sx={{ display: isPhoneVerified ? "none" : "flex" }}>
                                                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                sx={{
                                                                    maxWidth: 150,
                                                                }}
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
                                            <Grid item xs={12} mb={2}>
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
                                                <Grid item xs={12} mb={2}>
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
                                                <Grid item xs={12} mb={2}>
                                                    {/* <TextField
                                                        label="Phone"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        required
                                                    /> */}
                                                    <PhoneInput
                                                        country={'in'}
                                                        value={phone}
                                                        onChange={(phone) => setPhone(phone)}
                                                        inputStyle={{
                                                            width: '100%',
                                                            height: '56px', // match MUI TextField height
                                                            fontSize: '16px'
                                                        }}
                                                        containerStyle={{ width: '100%' }}
                                                        specialLabel="Phone"
                                                        inputProps={{
                                                            required: true,
                                                            name: 'phone',
                                                        }}
                                                    />
                                                </Grid>
                                            )}
                                            <Grid item xs={12} mb={2}>
                                                <TextField
                                                    label="Password"
                                                    type="password"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={password}
                                                    sx={{ bgcolor: "#ffff" }}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </Grid>
                                        </>
                                    )}


                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 4, p: '12px 0px' }}
                                        fullWidth
                                        disabled={
                                            isSignup
                                                ? !isEmailVerified || !isPhoneVerified  // Disable if email or phone are not verified
                                                : (!email && !phone) || !password // Disable if neither email nor phone are filled, or password is not filled
                                        }
                                    >
                                        {isSignup ? 'Set Password' : 'Log In'}
                                    </Button>
                                </Grid>
                            </form>
                            {error && <Typography color="error" variant="body2">{error}</Typography>}
                            {success && <Typography color="primary" variant="body2">{success}</Typography>}
                            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                <Button onClick={() => setIsSignup(!isSignup)} sx={{ color: "grey" }}>
                                    {isSignup ? (
                                        <>
                                            Already have an account?&nbsp;
                                            <Typography component="span" variant='subtitle2' color="primary" sx={{ textDecoration: "underline" }} >
                                                Login
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            Need an account?&nbsp;
                                            <Typography component="span" variant='subtitle2' color="primary" sx={{ textDecoration: "underline" }} >
                                                Sign up
                                            </Typography>
                                        </>
                                    )}
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
                    {/* </CardContent> */}
                </Grid>



                {/* Snackbar to display messages */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{
                        vertical: 'top', // Position the Snackbar at the top
                        horizontal: 'right', // Position the Snackbar at the right
                    }}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

            </Grid>

            <FooterComponent />

        </Box>
    );
};

export default VendorLogin;
