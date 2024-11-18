import React, { useState, useEffect, useRef } from 'react';
import { Typography, Button, Box, TextField, Grid, } from '@mui/material';

import { DialogTitle, } from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import apiUrl from '../../Api/Api';
import GoogleLogin from '../GoogleLogin/GoogleLogin';
import { Phone } from '@mui/icons-material';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'



const LoginDialog = ({ handleLogin }) => {


    const [loginType, setLoginType] = useState('phone'); // 'phone' or 'email'
    const [loginInput, setLoginInput] = useState(''); // Store phone or email input
    const [showOTPField, setShowOTPField] = useState(false); // Display OTP field after request
    const [otp, setOtp] = useState('');


    const toggleLoginType = () => {
        setLoginType(prevType => (prevType === 'phone' ? 'email' : 'phone'));
        setLoginInput('');
        setShowOTPField(false);
    };

    // phone handler
    const handlePhoneChange = (value, country) => {
        console.log(country.dialCode);

        // setFormData({
        //     ...formData,
        //     phone: value, // Store only the phone number
        //     dialCode: country.dialCode,
        // });
        // setLoginInput(e.target.value) // Handle phone input


    };

    // Handle OTP request
    const handleSendOtp = async () => {

        handleLogin();

        if (loginInput.trim() === "") {
            return alert(`Please fill the ${loginType} field !`)
        }

        try {
            const response = await axios.post(`${apiUrl}/login/send-otp`, {
                [loginType === 'phone' ? 'phone' : 'email']: loginInput,
                userType: loginType // Send userType as 'phone' or 'email'
            });
            if (response.data.success) {
                setShowOTPField(true); // Display OTP field if request is successful
                alert(response.data.message);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert(error.response.data.message);
            console.log('Error sending OTP:', error);
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post(`${apiUrl}/login/verify-otp`, {
                loginInput, otp
            });
            if (response.data.success) {
                const token = response.data.token;
                alert('Verification successful!');
                localStorage.setItem("loginToken", token);
            } else {
                alert('Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };



    return (
        <Grid item xs={12} md={6} sx={{ m: 2 }}>
            <Box sx={{ p: 2 }}>
                {/* <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    Log In / Sign Up
                </DialogTitle> */}

                {loginType === 'phone' ? (
                    <Grid item xs={12} sm={12}>
                        <PhoneInput
                            country={'in'} // Default country set to India (IN)
                            // value={formData.phone}  // Bind value to the state
                            onChange={handlePhoneChange}
                            inputStyle={{
                                padding: "auto 300px !important"
                            }}
                            inputMode="numeric"
                            inputProps={{
                                required: true,
                                autoFocus: true
                            }}

                        />

                    </Grid>
                ) : (
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="userEmail"
                            type="email"
                            onChange={(e) => setLoginInput(e.target.value)}  // Handle email input
                        />
                    </Grid>
                )}

                <Typography variant='subtitle2' color='text.secondary' sx={{ p: 1 }}> We will send you a verification code.</Typography>
                {!showOTPField ? (
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ color: 'white', p: 1, fontSize: "1rem" }}
                        onClick={handleSendOtp}
                    >
                        Continue
                    </Button>
                ) : (
                    <Box>
                        <TextField
                            label="Enter OTP"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ color: 'white', p: 1, fontSize: "1rem", mb: 1 }}
                            onClick={handleVerifyOtp}
                        >
                            Verify OTP
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{ p: 1, fontSize: "1rem" }}
                            onClick={handleSendOtp}
                        >
                            Resend OTP
                        </Button>
                    </Box>
                )}

                <Typography sx={{ textAlign: "center", marginTop: 2 }}> OR</Typography>

                <Grid container spacing={2} sx={{ marginTop: 1 }}>
                    {/* <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<FacebookIcon />}
                                        sx={{ backgroundColor: '#3b5998', color: 'white' }}
                                    >
                                        Continue with Facebook
                                    </Button>
                                </Grid> */}
                    <Grid item xs={12}>
                        <GoogleLogin />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={loginType === 'phone' ? <EmailIcon /> : <Phone />}
                            sx={{
                                backgroundColor: '#c74040', // Google Green
                                color: 'white',
                                borderRadius: 2, // Rounded edges for a modern look
                                padding: '12px 0', // More padding for a larger feel
                                fontSize: '1rem', // Larger text for prominence
                                // boxShadow: '0px 8px 16px rgba(199, 64, 64, 0.3)', // Soft shadow for depth
                                transition: 'all 0.3s ease', // Smooth transition for hover effects
                                '&:hover': {
                                    backgroundColor: '#9d3535', // Darker red on hover
                                    boxShadow: '0px 10px 20px rgba(158, 49, 49, 0.4)', // Enhanced shadow on hover
                                    transform: 'translateY(-2px)', // Slight lift effect
                                },
                                '&:active': {
                                    transform: 'translateY(1px)', // Button presses down slightly on click
                                    boxShadow: '0px 6px 12px rgba(158, 49, 49, 0.3)', // Subtle shadow on click
                                },
                            }}
                            onClick={toggleLoginType}
                        >
                            {`Continue with ${loginType === 'phone' ? 'Email' : 'Phone'}`}
                        </Button>

                    </Grid>
                </Grid>
            </Box>
        </Grid>

    )
}

export default LoginDialog;