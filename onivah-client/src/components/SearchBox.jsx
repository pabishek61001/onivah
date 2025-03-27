import React, { useState, useEffect, } from 'react';
import { Button, Box, Grid, Snackbar, Alert, } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import apiUrl from '../Api/Api';
import withLoadingAndError from "../hoc/withLoadingAndError"
import { useLocation, useNavigate } from 'react-router-dom';
import DestinationMenu from '../components/DestinationMenu';
import CheckinMenu from '../components/CheckinMenu';
import CategoryMenu from '../components/CategoryMenu';

const SearchBox = ({ setLoading, setError }) => {


    const location = useLocation();
    const navigate = useNavigate();


    const HeroContent = styled(Box)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center',
        // marginBottom: { xs: 0, md: 500 },
    }));

    const SearchBox = styled(Box)(({ theme }) => ({
        display: "flex",
        marginTop: theme.spacing(0),
        minWidth: "80%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "rgba(255, 255, 255, 0.6)", // Slight transparency
        // backdropFilter: "blur(10px)", // Blur effect
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        padding: theme.spacing(3), // Adds spacing inside the box for better appearance

        // Mobile (Default)
        position: "relative",
        top: "0%",
        left: "0%",
        transform: "none",

        // Desktop Overrides
        [theme.breakpoints.up("md")]: {
            marginTop: theme.spacing(4),
            position: "absolute",
            top: "90%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "90%", // Slightly smaller on larger screens for better design
        },
    }));





    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const defaultLocation = queryParams.get('location') || '';
        const defaultDates = queryParams.getAll('datesChoosed'); // Use getAll to retrieve all selected dates
        const defaultCategory = queryParams.get('category') || '';

        // Update the customerChoice state with default values from the query params
        setCustomerChoice({
            location: defaultLocation,
            datesChoosed: defaultDates,
            category: defaultCategory
        });
    }, [location.search]);


    const [customerChoice, setCustomerChoice] = useState({
        location: '',
        datesChoosed: [],
        category: ''
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // success, error, warning, info

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    // Function to update customerChoice
    const updateCustomerChoice = (newChoice) => {
        setCustomerChoice((prevChoice) => ({
            ...prevChoice,
            ...newChoice // Merge new values with the previous state
        }));
    };

    // Example of how you would handle selecting a location
    const locationHandler = (selectedLocation) => {
        updateCustomerChoice({ location: selectedLocation }); // Update only the location
    };

    // Example of how you would handle selecting dates
    const dateHandler = (selectedDates) => {
        updateCustomerChoice({ datesChoosed: selectedDates }); // Update only the dates
    };

    // Example of how you would handle selecting a category
    const categoryHandler = (selectedCategory) => {
        updateCustomerChoice({ category: selectedCategory }); // Update only the category
    };

    // Search handler
    const handleSearch = async () => {
        const { location, datesChoosed, category } = customerChoice;

        // // Check if at least one of the values is selected
        // if (!location && (!datesChoosed || datesChoosed.length === 0) && !category) {
        //     alert("Please select at least one event detail (location, dates, or category).");
        //     return;
        // }
        // Ensure category is always selected
        if (!category) {
            setSnackbarMessage("Please select a category.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }

        // Check if at least one other value (location or dates) is selected
        // if (!location && (!datesChoosed || datesChoosed.length === 0)) {
        //     setSnackbarMessage("Please select at least a location or dates.");
        //     setSnackbarSeverity("warning");
        //     setSnackbarOpen(true);
        //     return;
        // }



        // Construct query parameters dynamically based on which values are present
        const queryParams = new URLSearchParams();

        if (location) queryParams.append('location', location);
        if (Array.isArray(datesChoosed) && datesChoosed.length > 0) {
            datesChoosed.forEach(date => {
                queryParams.append('datesChoosed', date);
            });
        }
        if (category) queryParams.append('category', category);

        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/header/search?${queryParams.toString()}`);
            if (response.data.success && response.data.service.length > 0) {
                // Navigate only if venues exist
                navigate(`/?${queryParams.toString()}`);
            } else {
                setSnackbarMessage("No service found for the selected location or category.");
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setSnackbarMessage("An error occurred while searching. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            setLoading(false);
        }
    };



    return (
        < HeroContent >
            {/* #faf4fe */}
            <SearchBox sx={{
                p: { xs: 4, md: 3 }, borderRadius: '12px', border: "1px solid #ddd", boxShadow: 0, backgroundColor: '#f3e7fa',
            }}>
                < Grid container spacing={2} alignItems="center" direction={{ xs: 'column', sm: 'row' }}>
                    <Grid item xs={12} sm={4} md={3} sx={{ width: "100%" }}>

                        <DestinationMenu onLocationSelect={locationHandler} defaultLocation={customerChoice.location} />

                    </Grid>
                    <Grid item xs={12} sm={4} md={3} sx={{
                        width: "100%",
                        cursor: "pointer !important",
                    }}>
                        <CheckinMenu onDateSelect={dateHandler} defaultDates={customerChoice.datesChoosed} />

                    </Grid>
                    <Grid item xs={12} sm={4} md={3} sx={{ width: "100%", }}>
                        <CategoryMenu onCategorySelect={categoryHandler} defaultCategory={customerChoice.category} />

                    </Grid>
                    <Grid item xs={12} sm={12} md={3} sx={{ width: "100%" }}> {/* Keeping md={3} to ensure a single line */}
                        <Box sx={{ textAlign: 'center', cursor: 'pointer', borderRadius: '8px' }}>

                            <Button
                                sx={{ color: "white", p: 1.5, width: "100%", }}
                                variant='contained'
                                size='large'
                                startIcon={<SearchIcon fontSize='medium' />}
                                onClick={handleSearch}  // Add the onClick event to the Button itself
                            >
                                Search
                            </Button>

                        </Box>
                    </Grid>
                </Grid>
            </SearchBox >

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>;
        </HeroContent >
    )
}

export default withLoadingAndError(SearchBox);