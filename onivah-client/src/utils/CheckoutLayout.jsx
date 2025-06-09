import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import {
    Box,
    Button,
    Grid,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    Typography,
    Paper,
    FormControl,
} from "@mui/material";
import { Lock, ArrowDropDown, } from "@mui/icons-material";
import Header from "../components/Header";
import FooterComponent from "../components/FooterComponent";
import Swal from "sweetalert2";
import { apiUrl } from "../Api/Api";
import RazorpayPayment from "./RazorpayPayment";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import UserLogin from "./UserLogin";
import { Country, State, City } from "country-state-city";

const CheckoutLayout = () => {


    const { state } = useLocation();

    const serviceDetails = {
        capacity: state.capacity,
        description: state.description,
        location: state.location,
        name: state.name,
        price: state.price,
        venue_id: state.venue_id,
        selectedDate: state.selectedDate,
        isChecked: state.isChecked,
        imageUrls: state.imageUrls,
    };
    console.log(state);

    // Get existing customerChoice data from localStorage
    const customerChoiceRaw = localStorage.getItem('customerChoice');
    const [parsedChoice, setParsedChoice] = useState({ location: '', category: '', datesChoosed: [] });
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    useEffect(() => {
        if (customerChoiceRaw) {
            try {
                setParsedChoice(JSON.parse(customerChoiceRaw));
            } catch (error) {
                console.error("Failed to parse localStorage data:", error);
            }
        }
    }, [customerChoiceRaw]);


    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("onivah_token");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {

        if (!token) {
            setSnackbarMessage(" Login / Sign up to continue further!");
            setSnackbarOpen(true);
            setIsButtonDisabled(true);
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

                const backendLocation = {
                    country: data.user.country,
                    state: data.user.state,
                    city: data.user.city,
                };

                // Load all countries
                const countryList = Country.getAllCountries();
                setCountries(countryList);

                const country = countryList.find(
                    (c) => c.name?.toLowerCase() === backendLocation.country?.toLowerCase()
                );
                if (country) {
                    setSelectedCountry(country);
                    const stateList = State.getStatesOfCountry(country.isoCode);
                    setStates(stateList);

                    const state = stateList.find(
                        (s) => s.name?.toLowerCase() === backendLocation.state.toLowerCase()
                    );
                    if (state) {
                        setSelectedState(state);
                        const cityList = City.getCitiesOfState(country.isoCode, state.isoCode);
                        setCities(cityList);

                        const city = cityList.find(
                            (c) => c.name?.toLowerCase() === backendLocation.city?.toLowerCase()
                        );
                        if (city) {
                            setSelectedCity(city);
                        }
                    }
                }
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

            // Define the keys you want to validate
            const keysToValidate = ["firstname", "email", "phone", "country", "state", "city", "zipcode"];

            const allValuesValid = keysToValidate.every((key) => {
                const value = userData[key];
                let isValid = true; // Track if the current value is valid


                if (typeof value !== "string") {
                    if (key === "phone") {
                        isValid = /^[0-9]{10}$/.test(value);
                        if (!isValid) {
                            // console.log(`Invalid phone number: ${value}`);
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
                                // console.log(`Invalid first name: ${value}`);
                            }
                            break;
                        case "country":
                            isValid = value.trim().length > 0;
                            if (!isValid) {
                                isValid = selectedCountry !== null;
                                if (!isValid) {
                                    console.log(`Invalid ${key}: ${value}`);
                                }
                            }
                            break;

                        case "state":
                            isValid = value.trim().length > 0;
                            if (!isValid) {
                                isValid = selectedState !== null;
                                if (!isValid) {
                                    console.log(`Invalid ${key}: ${value}`);
                                }
                            }
                            break;

                        case "city":
                            isValid = value.trim().length > 0;
                            if (!isValid) {
                                isValid = selectedCity !== null;
                                if (!isValid) {
                                    console.log(`Invalid ${key}: ${value}`);
                                }
                            }
                            break;
                        case "email":
                            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                            if (!isValid) {
                                // console.log(`Invalid email: ${value}`);
                            }
                            break;
                        case "zipcode":
                            isValid = /^[0-9]+$/.test(value.trim());
                            if (!isValid) {
                                // console.log(`Invalid zip code: ${value}`);
                            }
                            break;
                        default:
                            isValid = value.trim().length > 0;
                            if (!isValid) {
                                // console.log(`Invalid value for key ${key}: ${value}`);
                            }
                            break;
                    }
                }

                return isValid; // Return the validity status of the current key-value pair
            });

            // console.log("All values valid:", allValuesValid); // Log the final result
            setIsButtonDisabled(!allValuesValid); // Disable button if not all values are valid
        }
    }, [userData, selectedCountry, selectedState, selectedCity]);

    const handleCountryChange = (e) => {
        const country = countries.find((c) => c.isoCode === e.target.value);
        setSelectedCountry(country);
        setStates(State.getStatesOfCountry(country.isoCode));
        setSelectedState(null);
        setCities([]);
        setSelectedCity(null);
    };

    const handleStateChange = (e) => {
        const state = states.find((s) => s.isoCode === e.target.value);
        setSelectedState(state);
        const cityList = City.getCitiesOfState(selectedCountry.isoCode, state.isoCode);
        setCities(cityList);
        setSelectedCity(null);
    };

    const handleCityChange = (e) => {
        const city = cities.find((c) => c.name === e.target.value);
        setSelectedCity(city);
    };

    const calculateDays = (dates) => {
        const start = new Date(dates[0]);
        const end = new Date(dates[dates.length - 1]);
        const diff = Math.abs(end - start);
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    };


    return (
        <Box >
            <Header />

            {/* Main Content */}
            <Grid container spacing={4} sx={{ px: { xs: 0, md: 10 }, mt: 10 }}>
                {/* Checkout Section */}
                <Grid item xs={12} lg={6}>
                    <Typography variant="h4" fontWeight="bold" mb={2}>
                        Checkout
                    </Typography>
                    <Paper elevation={0} sx={{ p: 4 }}>
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
                                        value={
                                            userData?.phone}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                            </Box>

                            <Box mb={2}>
                                <InputLabel>
                                    Country <span style={{ color: "red" }}>*</span>
                                </InputLabel>
                                <FormControl fullWidth>
                                    <Select
                                        size="small"
                                        IconComponent={() => <ArrowDropDown />}
                                        value={selectedCountry?.isoCode || ""}
                                        onChange={handleCountryChange}
                                        error={!selectedCountry?.isoCode}
                                    >
                                        <MenuItem value="" disabled>
                                            Select Country
                                        </MenuItem>
                                        {countries.map((country) => (
                                            <MenuItem key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box mb={2}>
                                <InputLabel>
                                    State <span style={{ color: "red" }}>*</span>
                                </InputLabel>
                                <FormControl fullWidth disabled={!states.length}>
                                    <Select
                                        size="small"
                                        IconComponent={() => <ArrowDropDown />}
                                        value={selectedState?.isoCode || ""}
                                        onChange={handleStateChange}
                                        error={!selectedState?.isoCode}
                                    >
                                        <MenuItem value="" disabled>
                                            Select State
                                        </MenuItem>
                                        {states.map((state) => (
                                            <MenuItem key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box mb={2}>

                            </Box>



                            <Box mb={2} display="flex" gap={2}>
                                <Box flex={1}>
                                    <InputLabel>
                                        City <span style={{ color: "red" }}>*</span>
                                    </InputLabel>
                                    <FormControl fullWidth disabled={!cities.length}>
                                        <Select
                                            size="small"
                                            IconComponent={() => <ArrowDropDown />}
                                            labelId="city-label"
                                            value={selectedCity?.name || ""}
                                            onChange={handleCityChange}
                                            error={!selectedCity?.name}

                                        >
                                            <MenuItem value="" disabled>
                                                Select City
                                            </MenuItem>
                                            {cities.map((city, idx) => (
                                                <MenuItem key={idx} value={city.name}>
                                                    {city.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
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
                    <Paper elevation={0} sx={{ p: 4, border: "1px solid lightgrey", borderRadius: 3 }}>
                        {/* Product Item */}
                        <Box display="flex" alignItems="center" mb={2}>

                            <img
                                width="80px"
                                height="80px"
                                style={{ borderRadius: '10px' }}
                                src={serviceDetails.imageUrls}
                                alt={"Service Image"}
                            />

                            <Box
                                sx={{
                                    ml: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    boxShadow: 0,
                                    backgroundColor: "#f9f9f9",
                                    minWidth: 250,
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {serviceDetails.name}
                                </Typography>

                                <Typography variant="body2" color="textSecondary">
                                    📍 {parsedChoice.location}
                                </Typography>

                                {/* <Typography variant="body2" color="textSecondary">
                                    📅 {Array.isArray(serviceDetails.selectedDate) ? serviceDetails.selectedDate.join(", ") : serviceDetails.selectedDate} - {`(${serviceDetails.selectedDate.length} days)`}
                                </Typography> */}

                                {Array.isArray(serviceDetails.selectedDate) && serviceDetails.selectedDate.length > 0 && (
                                    <Typography variant="body2" color="textSecondary">
                                        📅 {serviceDetails.selectedDate[0]} to {serviceDetails.selectedDate[serviceDetails.selectedDate.length - 1]}
                                        {` (${calculateDays(serviceDetails.selectedDate)} day ${serviceDetails.selectedDate.length > 1 ? 's' : ''})`}
                                    </Typography>
                                )}

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
                                // sx={{ borderRadius: "4px 0 0 4px" }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ borderRadius: "0 10px 10px 0" }}
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

                        <RazorpayPayment amount={serviceDetails.price} buttonAction={isButtonDisabled} />
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

                        <UserLogin buttonAction={!token} />
                    </Paper>
                </Grid>
            </Grid>
            <FooterComponent />

            {/* <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="warning"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar> */}

        </Box >
    );
};

export default CheckoutLayout;
