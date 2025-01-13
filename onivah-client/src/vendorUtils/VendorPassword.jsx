import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    Button,
    Snackbar,
    FormHelperText,
    Paper,
    Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Header from '../components/Header';
import FooterComponent from '../components/FooterComponent';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiUrl from '../Api/Api';
import axios from 'axios';

const VendorPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setOpenSnackbar(true);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setOpenSnackbar(true);
            return;
        }

        try {
            // Make API call to backend to save the password
            const response = await axios.post(`${apiUrl}/vendor/set-password`, {
                email,
                password,
            });

            if (response.data.success) {
                setSuccessMessage('Password successfully set');
                setOpenSnackbar(true);

                // Navigate to vendor-services page
                setTimeout(() => navigate('/vendor-services'), 2000);
            } else {
                setError(response.data.message || 'An error occurred');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setError('Failed to set password. Please try again.');
            setOpenSnackbar(true);
        }
    };
    // Toggle password visibility
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    // Close the Snackbar
    const handleSnackbarClose = () => setOpenSnackbar(false);

    return (
        <Box>
            <Header />
            <Grid container spacing={3} sx={{
                height: '100vh',
                backgroundColor: '#f7f9fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
                mt: 5
            }}>
                {/* Left Side - Image */}
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        src="https://img.freepik.com/free-photo/decorated-banquet-hall-with-flowers_8353-10058.jpg?t=st=1732529789~exp=1732533389~hmac=629e29da7b8b56a162d460fa716c37c7e6f20b078dec7b6a6b98d41c695e8c17&w=900" // Replace with your actual image URL
                        alt="Password Setup Illustration"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                </Grid>

                {/* Right Side - Form */}
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Typography variant="h5" align="center" gutterBottom>
                            Set Your Password
                        </Typography>
                        <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
                            Create a strong password to secure your account.
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal" error={Boolean(error)}>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>

                            <FormControl fullWidth margin="normal" error={Boolean(error)}>
                                <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowConfirmPassword}>
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {error && <FormHelperText>{error}</FormHelperText>}
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{
                                    marginTop: 3,
                                    paddingY: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                }}
                            >
                                Set Password
                            </Button>
                        </form>

                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}
                            onClose={handleSnackbarClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position it at the top right
                            message={successMessage || error}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <FooterComponent />
        </Box>
    );
};

export default VendorPassword;
