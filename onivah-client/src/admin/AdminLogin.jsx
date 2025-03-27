import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import apiUrl from '../Api/Api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AdminLogin = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        console.log("API URL:", `${apiUrl}/admin/login`);

        try {
            const response = await axios.post(`${apiUrl}/admin/login`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Axios parses the response for you
            const data = response.data;

            if (data.success) {
                // Store the token in sessionStorage
                sessionStorage.setItem('admin_token', data.token);

                alert('Login Successful!');
                navigate("/admin-dashboard");
            } else {
                alert('Login Failed!');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };



    return (
        <Grid container sx={{ minHeight: '100vh' }} spacing={2}>
            {/* Left Side: Login Form */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: 6 }}>
                <Box mb={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                        <Person fontSize="large" />
                    </Typography>
                </Box>
                <Box sx={{ width: '100%', maxWidth: 360 }}>
                    {/* Username Input */}
                    <Box mb={3}>
                        <TextField
                            label="Your UserName"
                            variant="outlined"
                            fullWidth
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <Person />,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 20,
                                },
                            }}
                        />
                    </Box>
                    {/* Password Input */}
                    <Box mb={4}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: <Lock />,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 20,
                                },
                            }}
                        />
                    </Box>
                    {/* Sign In Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            onClick={() => handleSubmit()}
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ borderRadius: 20, padding: '12px 0' }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Grid>

            {/* Right Side: Image & Info */}
            <Grid item xs={12} md={6} sx={{ position: 'relative', display: { xs: 'none', md: 'block' } }}>
                <img
                    src="https://img.freepik.com/free-photo/view-boat-water_23-2150785120.jpg?uid=R133306793&ga=GA1.1.1773690977.1730112906&semt=ais_hybrid"
                    alt="A person in red jacket climbing a snowy mountain"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.6,
                    }}
                />
                <Box sx={{ position: 'absolute', inset: 0, backgroundColor: 'blue', opacity: 0.5 }} />
                <Box sx={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white', padding: 8 }}>
                    <Typography variant="body2" mb={2} fontWeight="bold" textAlign="center">
                        Start planning your
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" mb={3} textAlign="center">
                        Occassions
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
                        <Box sx={{ ml: 4 }}>
                            <Typography variant="body2" textAlign="center">Reaching the top</Typography>
                            <Typography variant="h6" fontWeight="bold" textAlign="center">
                                John Doe
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default AdminLogin;
