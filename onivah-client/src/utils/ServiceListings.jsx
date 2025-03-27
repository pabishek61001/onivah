import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Tooltip, CircularProgress, FormControl, Select, MenuItem, InputLabel, NativeSelect, ThemeProvider, IconButton } from "@mui/material";
import { Favorite, FavoriteBorder, NavigateNext, ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import axios from "axios"; // Import Axios
import apiUrl from "../Api/Api";
import Header from "../components/Header";
import theme from "../Themes/theme";
import FooterComponent from "../components/FooterComponent";
import { useFavorites } from "../Favourites/FavoritesContext";

const ServiceListings = () => {

    const navigate = useNavigate()
    const { favorites, toggleFavorite } = useFavorites(); // Use global favorites context

    const { service } = useParams(); // Extract the service title from the URL
    const [data, setData] = useState([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const [filterLocation, setFilterLocation] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [themeType, setThemeType] = useState("");

    const handleFilterChange = (event) => {
        setFilterLocation(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleThemeChange = (event) => {
        setThemeType(event.target.value);
    };


    let filteredData = [...data]; // Make a copy to prevent modifying the original array

    // Filter by location
    if (filterLocation) {
        filteredData = filteredData.filter((item) =>
            item.additionalFields?.availableLocations?.includes(filterLocation) // Check if array includes location
        );
    }


    // Filter by category/themeType
    if (themeType && themeType !== "") {
        filteredData = filteredData.filter((item) => item.additionalFields?.category === themeType);
    }



    // Sorting logic
    if (sortBy === "priceLow") {
        filteredData.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "priceHigh") {
        filteredData.sort((a, b) => Number(b.price) - Number(a.price));
    }


    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                // Fetch data based on the service from the backend
                const response = await axios.get(`${apiUrl}/services/${service}`);
                const filteredData = response.data; // Assuming the backend returns an array of products
                setData(filteredData);
            } catch (err) {
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceData();
    }, [service]); // Re-run effect if the service URL changes




    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }



    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Box sx={{ py: 8, px: 4, backgroundColor: "#fafafa" }}>
                <Box sx={{ textAlign: "center", mb: 6, mt: 4 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary.dark" gutterBottom sx={{ mb: 2, textTransform: "capitalize" }}>
                        {service || "Our Services"}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="grey"
                        sx={{ maxWidth: "600px", margin: "0 auto" }}
                    >
                        Discover a variety of services tailored to meet your needs.
                    </Typography>
                </Box>

                {/* Filter & Sort Controls */}

                <Grid container sx={{ mb: 8, }}>

                    <Grid item xs={6} sx={{ display: "flex", justifyContent: "start" }}>
                        {/* Filter by Location */}
                        <FormControl sx={{ minWidth: 220 }} size="small">
                            <InputLabel id="filter-location-label" shrink>
                                Filter by Location
                            </InputLabel>
                            <Select
                                labelId="filter-location-label"
                                value={filterLocation}
                                onChange={handleFilterChange}
                                displayEmpty
                                label="Filter by Location"
                                sx={{ borderRadius: 2, mr: 2 }}
                            >
                                <MenuItem value="">
                                    <em>All Locations</em>
                                </MenuItem>
                                {[...new Set(filteredData
                                    .flatMap((item) => item.additionalFields?.availableLocations || []) // Use array directly
                                )].map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                        {/* Sort by Price */}
                        <FormControl size="small" sx={{ minWidth: 220, backgroundColor: "#fff", borderRadius: 2, }}>
                            <InputLabel shrink>Sort by</InputLabel>
                            <Select
                                labelId="filter-location-label"

                                label="Sort By"
                                value={sortBy}
                                onChange={handleSortChange}
                                sx={{ borderRadius: 2 }}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Default</em>
                                </MenuItem>
                                <MenuItem value="priceLow">Price: Low to High</MenuItem>
                                <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sx={{ display: "flex", justifyContent: "end" }}>
                        <FormControl sx={{ minWidth: 220 }} size="small">
                            <InputLabel id="Categories" shrink>Categories</InputLabel>
                            <Select
                                labelId="Venue Type"
                                value={themeType}
                                onChange={handleThemeChange}
                                displayEmpty
                                label="Venue Type"
                                sx={{ borderRadius: 2 }}
                            >

                                <MenuItem value="">
                                    <em>All Themes</em>
                                </MenuItem>
                                {[...new Set(filteredData.map((item) => item.additionalFields?.category))].map((category) =>
                                    category ? (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ) : null
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>

                <Grid container spacing={4}>
                    {filteredData.length < 1 ? (
                        <Typography align="center" gutterBottom p={2} color="grey">No services available currently.</Typography>
                    ) : (
                        filteredData.map((product, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{ mb: 2 }}>
                                <Card
                                    sx={{
                                        borderRadius: 4,
                                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: "#faf4fe",
                                        cursor: "pointer",
                                        "&:hover": { boxShadow: "0px 6px 5px rgba(0, 0, 0, 0.2)" },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`data:image/jpeg;base64,${product.additionalFields.images?.[0]?.base64}`}
                                        alt={product.additionalFields.businessName || "Service Image"}
                                        sx={{ objectFit: "cover", transition: "transform 0.3s", "&:hover": { transform: "scale(1.02)" } }}
                                    />
                                    <CardContent sx={{ ml: 1, borderRadius: 2, p: 1 }}>
                                        <Typography variant="h6" fontWeight="bold" textAlign="left" sx={{ color: "#333" }}>
                                            {product.additionalFields.businessName}
                                        </Typography>
                                        <Typography variant="subtitle1" color="primary" textAlign="left">
                                            {product.additionalFields.availableLocations || "N/A"}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary" textAlign="left">
                                            Price: ₹{product.additionalFields.priceRange || "N/A"}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: "space-between", ml: 1, mb: 1 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            sx={{ textTransform: "none", borderRadius: 2 }}
                                            endIcon={<NavigateNext />}
                                            onClick={() => navigate(`/category/${service}/${product._id}`)}
                                        >
                                            View Details
                                        </Button>
                                        <IconButton onClick={() => toggleFavorite(product)}>
                                            {favorites.some(item => item._id === product._id) ? (
                                                <Favorite color="error" />
                                            ) : (
                                                <FavoriteBorder />
                                            )}
                                        </IconButton>

                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
            <FooterComponent />
        </ThemeProvider >
    );
};

export default ServiceListings;
