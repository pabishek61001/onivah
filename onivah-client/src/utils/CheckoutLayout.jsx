import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import {
    Box,
    Button,
    Container,
    Grid,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    Typography,
    Paper,
    IconButton,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import { CheckCircle, Lock, ArrowDropDown, Circle, RadioButtonUnchecked } from "@mui/icons-material";
import Header from "../components/Header";
import FooterComponent from "../components/FooterComponent";
import Swal from "sweetalert2";
import apiUrl from "../Api/Api";

const CheckoutLayout = () => {

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const serviceDetails = {
        capacity: queryParams.get('capacity'),
        description: queryParams.get('description'),
        location: queryParams.get('location'),
        name: queryParams.get('name'),
        price: queryParams.get('price'),
        venue_id: queryParams.get('venue_id'),
        _id: queryParams.get('_id'),
        selectedDate: queryParams.get('selectedDate'),
        isChecked: queryParams.get('isChecked') === 'true',
        imageUrls: queryParams.get('imageUrls')?.split(',') // Split the image URLs back into an array
    };

    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("onivah_token");

    useEffect(() => {

        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Login / Sign Up",
                text: "You are requested to login / sign up to continue further!"
            });
            setIsButtonDisabled(true)
            return;
        }

        const fetchProtectedData = async () => {
            try {
                const response = await fetch(`${apiUrl}/protected-route`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json(); // Capture the error message from response
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Token Expired !Login Again"
                    });
                }

                const data = await response.json();
                setUserData(data.user);
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Token Expired !Login Again"
                });
            }
        };

        fetchProtectedData();
    }, []);

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        if (userData) {
            console.log("User data:", userData); // Log the entire userData object

            // Define the keys you want to validate
            const keysToValidate = ["firstname", "email", "phone", "country", "state", "city", "zipcode"];

            const allValuesValid = keysToValidate.every((key) => {
                const value = userData[key];
                let isValid = true; // Track if the current value is valid

                console.log(`Validating key: ${key}, value: ${value}`); // Log each key-value pair

                if (typeof value !== "string") {
                    console.log(`Non-string value detected for key: ${key}`);
                    if (key === "phone") {
                        isValid = /^[0-9]{10}$/.test(value);
                        if (!isValid) {
                            console.log(`Invalid phone number: ${value}`);
                        }
                    } else {
                        isValid = value !== null && value !== undefined;
                        if (!isValid) {
                            console.log(`Invalid value for key ${key}: ${value}`);
                        }
                    }
                } else {
                    // Apply validation based on key
                    switch (key) {
                        case "firstname":
                            isValid = value.trim().length > 1;
                            if (!isValid) {
                                console.log(`Invalid first name: ${value}`);
                            }
                            break;
                        case "country":
                        case "state":
                        case "city":
                            isValid = value.trim().length > 0;
                            if (!isValid) {
                                console.log(`Invalid ${key}: ${value}`);
                            }
                            break;
                        case "email":
                            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                            if (!isValid) {
                                console.log(`Invalid email: ${value}`);
                            }
                            break;
                        case "zipcode":
                            isValid = /^[0-9]+$/.test(value.trim());
                            if (!isValid) {
                                console.log(`Invalid zip code: ${value}`);
                            }
                            break;
                        default:
                            isValid = value.trim().length > 0;
                            if (!isValid) {
                                console.log(`Invalid value for key ${key}: ${value}`);
                            }
                            break;
                    }
                }

                return isValid; // Return the validity status of the current key-value pair
            });

            console.log("All values valid:", allValuesValid); // Log the final result
            setIsButtonDisabled(!allValuesValid); // Disable button if not all values are valid
        }
    }, [userData]);


    return (
        <Box >
            <Header />
            <Container maxWidth="lg" sx={{ py: 4, backgroundColor: "gray.50", mt: 10 }}>

                {/* Main Content */}
                <Grid container spacing={4}>
                    {/* Checkout Section */}
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h4" fontWeight="bold" mb={2}>
                            Checkout
                        </Typography>
                        <Paper elevation={2} sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight="medium" mb={2}>
                                Personal Information
                            </Typography>
                            <Box component="form">
                                <Box mb={2}>
                                    <InputLabel>
                                        Full name <span style={{ color: "red" }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        value={userData?.firstname}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                                <Box mb={2}>
                                    <InputLabel>
                                        Email address <span style={{ color: "red" }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        value={userData?.email}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                                <Box mb={2}>
                                    <InputLabel>
                                        Phone number <span style={{ color: "red" }}>*</span>
                                    </InputLabel>
                                    <Box display="flex" alignItems="center">
                                        <img
                                            src="https://storage.googleapis.com/a1aa/image/t1D5u00Xex1rK6epxWUWWvLNINLu4CuazVpPiDeUuyGq9aunA.jpg"
                                            alt="Country flag"
                                            width="24"
                                            height="24"
                                            style={{ marginRight: 8 }}
                                        />
                                        <TextField
                                            fullWidth
                                            value={userData?.phone}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                                <Box mb={2}>
                                    <InputLabel>
                                        Country <span style={{ color: "red" }}>*</span>
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        defaultValue=""
                                        variant="outlined"
                                        size="small"
                                        IconComponent={() => <ArrowDropDown />}
                                    >
                                        <MenuItem value="">Choose country</MenuItem>
                                        <MenuItem value="US">United States</MenuItem>
                                        <MenuItem value="UK">United Kingdom</MenuItem>
                                        <MenuItem value="Italy">Italy</MenuItem>
                                    </Select>
                                </Box>
                                <Box mb={2}>
                                    <InputLabel>
                                        Address <span style={{ color: "red" }}>*</span>
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        value={userData?.country}
                                        placeholder="Street address"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                                <Box mb={2}>
                                    <InputLabel>
                                        City <span style={{ color: "red" }}>*</span>
                                    </InputLabel>
                                    <TextField fullWidth placeholder="City" value={userData?.city}
                                        variant="outlined" size="small" />
                                </Box>
                                <Box mb={2} display="flex" gap={2}>
                                    <Box flex={1}>
                                        <InputLabel>
                                            State <span style={{ color: "red" }}>*</span>
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            placeholder="State"
                                            variant="outlined"
                                            value={userData?.state}
                                            size="small"
                                        />
                                    </Box>
                                    <Box flex={1}>
                                        <InputLabel>
                                            Zip Code <span style={{ color: "red" }}>*</span>
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            value={userData?.zipcode}
                                            placeholder="Zip Code"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                                {/* <Box mb={2}>
                                    <InputLabel>Payment Method</InputLabel>
                                    <RadioGroup row>
                                        <FormControlLabel
                                            value="credit_card"
                                            control={<Radio />}
                                            label="Credit Card"
                                        />
                                        <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                                        <FormControlLabel
                                            value="cod"
                                            control={<Radio />}
                                            label="Cash on Delivery"
                                        />
                                    </RadioGroup>
                                </Box> */}
                                <Box mb={2}>
                                    <InputLabel>Additional Instructions</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter any special instructions here"
                                        variant="outlined"
                                        size="small"
                                        multiline
                                        rows={3}
                                    />
                                </Box>
                            </Box>
                        </Paper>

                    </Grid>

                    {/* Cart Review Section */}
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h6" fontWeight="medium" mb={2}>
                            Review your service
                        </Typography>
                        <Paper elevation={2} sx={{ p: 4 }}>
                            {/* Product Item */}
                            <Box display="flex" alignItems="center" mb={2}>
                                <img
                                    src={serviceDetails.imageUrls[0]}
                                    alt="venue"
                                    width="64"
                                    height="64"
                                    style={{ marginRight: 16 }}
                                />
                                <Box>
                                    <Typography variant="subtitle2">{serviceDetails.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {serviceDetails.location} | {serviceDetails.selectedDate}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                        ₹{serviceDetails.price} /-
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Discount Code */}
                            <Box mb={2}>
                                <InputLabel>Discount code</InputLabel>
                                <Box display="flex" mt={1}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{ borderRadius: "4px 0 0 4px" }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ borderRadius: "0 4px 4px 0" }}
                                    >
                                        Apply
                                    </Button>
                                </Box>
                            </Box>

                            {/* Summary */}
                            <Box mt={2}>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2">Subtotal</Typography>
                                    <Typography variant="body2">$45.00</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2">Shipping</Typography>
                                    <Typography variant="body2">$5.00</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2">Discount</Typography>
                                    <Typography variant="body2">-$10.00</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    <Typography variant="h6">Total</Typography>
                                    <Typography variant="h6">Rs. {serviceDetails.price}</Typography>
                                </Box>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isButtonDisabled}
                                sx={{ mt: 4, py: 1.5, fontWeight: "medium" }}
                            >
                                Pay Now
                            </Button>
                            <Box display="flex" alignItems="center" mt={2}>
                                <Lock fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="caption" color="textSecondary">
                                    Secure Checkout - SSL Encrypted
                                </Typography>
                            </Box>
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ mt: 1 }}
                            >
                                Ensuring your financial and personal details are secure during
                                every transaction.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <FooterComponent />
        </Box>
    );
};

export default CheckoutLayout;
