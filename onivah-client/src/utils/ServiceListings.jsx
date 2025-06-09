import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Tooltip, CircularProgress, FormControl, Select, MenuItem, InputLabel, NativeSelect, ThemeProvider, IconButton, Drawer, Accordion, AccordionSummary, AccordionDetails, List, ListItemButton, Radio, ListItemText, ListItemIcon, Pagination, Chip } from "@mui/material";
import { ExpandMore, Favorite, FavoriteBorder, FilterList, NavigateNext, ShoppingCart as ShoppingCartIcon, StarHalf } from "@mui/icons-material";
import axios from "axios"; // Import Axios
import { apiUrl } from "../Api/Api";
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

    const itemsPerPage = 4;  // Number of products per page
    const [page, setPage] = useState(1);


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
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expanded, setExpanded] = useState(null); // Tracks open accordion

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleAccordionChange = (panel) => (_, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                // Fetch data based on the service from the backend
                const response = await axios.get(`${apiUrl}/services/${service}`);
                console.log(response.data);
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

    // Slice products to show based on the current page
    const paginatedProducts = filteredData.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );


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
                <Box sx={{ textAlign: "center", mb: 6, mt: 2 }}>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary.dark"
                        gutterBottom
                        sx={{ mb: 2, textTransform: "capitalize" }}
                    >
                        {service
                            ? service
                                .split("_")
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" ")
                            : "Our Services"}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="grey"
                        sx={{ maxWidth: "600px", margin: "0 auto" }}
                    >
                        Discover a variety of services tailored to meet your needs.
                    </Typography>
                </Box>

                {/* Filter & Sort Controls */}

                {/* <Grid container sx={{ mb: 8, }}>

                    <Grid item xs={6} sx={{ display: "flex", justifyContent: "start" }}>
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

                   


                </Grid> */}

                {/* Filter Icon (Only on Mobile) */}
                <Grid container spacing={2} sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "end" }}>

                    <Button variant="outlined" onClick={handleDrawerToggle} startIcon={<FilterList fontSize="large" />}>Filter</Button>

                </Grid>

                {/* Sidebar for Mobile Filters */}
                <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
                    <Box sx={{ width: 300, height: "100vh", p: 3, overflowY: "auto" }}>
                        <Typography variant="h6" gutterBottom>
                            Filters
                        </Typography>

                        {/* Filter by Location */}
                        <Accordion sx={{ boxShadow: 0 }} expanded={expanded === "location"} onChange={handleAccordionChange("location")}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography> Location</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                                <List sx={{ p: 0 }}>
                                    <ListItemButton onClick={() => handleFilterChange({ target: { value: "" } })}>
                                        <ListItemIcon>
                                            <Radio size="small" checked={filterLocation === ""} />
                                        </ListItemIcon>
                                        <ListItemText primary={<em>All Locations</em>} />
                                    </ListItemButton>
                                    {[...new Set(filteredData.flatMap((item) => item.additionalFields?.availableLocations || []))].map((location) => (
                                        <ListItemButton key={location} onClick={() => handleFilterChange({ target: { value: location } })}>
                                            <ListItemIcon>
                                                <Radio size="small" checked={filterLocation === location} />
                                            </ListItemIcon>
                                            <ListItemText primary={location} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>

                        {/* Sort by Price */}
                        <Accordion sx={{ boxShadow: 0 }} expanded={expanded === "sort"} onChange={handleAccordionChange("sort")}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography>Sort by</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                                <List sx={{ p: 0 }}>
                                    <ListItemButton onClick={() => handleSortChange({ target: { value: "" } })}>
                                        <ListItemIcon>
                                            <Radio size="small" checked={sortBy === ""} />
                                        </ListItemIcon>
                                        <ListItemText primary={<em>Default</em>} />
                                    </ListItemButton>
                                    <ListItemButton onClick={() => handleSortChange({ target: { value: "priceLow" } })}>
                                        <ListItemIcon>
                                            <Radio size="small" checked={sortBy === "priceLow"} />
                                        </ListItemIcon>
                                        <ListItemText primary="Price: Low to High" />
                                    </ListItemButton>
                                    <ListItemButton onClick={() => handleSortChange({ target: { value: "priceHigh" } })}>
                                        <ListItemIcon>
                                            <Radio size="small" checked={sortBy === "priceHigh"} />
                                        </ListItemIcon>
                                        <ListItemText primary="Price: High to Low" />
                                    </ListItemButton>
                                </List>
                            </AccordionDetails>
                        </Accordion>

                        {/* Categories */}
                        <Accordion sx={{ boxShadow: 0 }} expanded={expanded === "categories"} onChange={handleAccordionChange("categories")}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography>Categories</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                                <List sx={{ p: 0 }}>
                                    <ListItemButton onClick={() => handleThemeChange({ target: { value: "" } })}>
                                        <ListItemIcon>
                                            <Radio size="small" checked={themeType === ""} />
                                        </ListItemIcon>
                                        <ListItemText primary={<em>All Themes</em>} />
                                    </ListItemButton>
                                    {[...new Set(filteredData.map((item) => item.additionalFields?.category))].map((category) =>
                                        category ? (
                                            <ListItemButton key={category} onClick={() => handleThemeChange({ target: { value: category } })}>
                                                <ListItemIcon>
                                                    <Radio size="small" checked={themeType === category} />
                                                </ListItemIcon>
                                                <ListItemText primary={category} />
                                            </ListItemButton>
                                        ) : null
                                    )}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Drawer>

                {/* Desktop View - Normal Layout */}
                <Grid container spacing={2} sx={{ display: { xs: "none", sm: "flex" } }}>
                    {/* Left Side - Filters */}
                    <Grid item xs={12} sm={6} sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "start", alignItems: "center" }}>
                        <FormControl size="small" sx={{ width: { xs: "100%", sm: 220 } }}>
                            <InputLabel shrink>Filter by Location</InputLabel>
                            <Select label='Filter by Location' value={filterLocation} onChange={handleFilterChange} displayEmpty>
                                <MenuItem value="">
                                    <em>All Locations</em>
                                </MenuItem>
                                {[...new Set(filteredData.flatMap((item) => item.additionalFields?.availableLocations || []))].map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ width: { xs: "100%", sm: 220 } }}>
                            <InputLabel shrink>Sort by</InputLabel>
                            <Select label='Sort by' value={sortBy} onChange={handleSortChange} displayEmpty>
                                <MenuItem value="">
                                    <em>Default</em>
                                </MenuItem>
                                <MenuItem value="priceLow">Price: Low to High</MenuItem>
                                <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Right Side - Categories */}
                    <Grid item xs={12} sm={6} sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "end", alignItems: "center" }}>
                        <FormControl size="small" sx={{ width: { xs: "100%", sm: 220 } }}>
                            <InputLabel shrink>Categories</InputLabel>
                            <Select label='Categories' value={themeType} onChange={handleThemeChange} displayEmpty>
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


                <Grid container spacing={4} sx={{ mt: 2 }}>
                    {filteredData.length < 1 ? (
                        <Typography align="center" gutterBottom p={2} mt={4} color="grey">No services available currently.</Typography>
                    ) : (
                        paginatedProducts.map((product, index) => (

                            <Grid item xs={6} sm={6} md={4} lg={3} key={index} sx={{ mb: 2 }}>
                                <Card
                                    onClick={() => {
                                        try {
                                            const customerChoice = JSON.parse(localStorage.getItem("customerChoice")) || {};

                                            const updatedChoice = {
                                                ...customerChoice,
                                                location: product.additionalFields.availableLocations
                                                    ? Array.isArray(product.additionalFields.availableLocations)
                                                        ? product.additionalFields.availableLocations
                                                        : [product.additionalFields.availableLocations]
                                                    : [],
                                            };

                                            localStorage.setItem("customerChoice", JSON.stringify(updatedChoice));
                                            navigate(`/category/${service}/${product._id}`);
                                        } catch (err) {
                                            console.error("Error updating customerChoice:", err);
                                            navigate(`/category/${service}/${product._id}`);
                                        }
                                    }}
                                    sx={{
                                        position: "relative",
                                        borderRadius: 4,
                                        boxShadow: 0,
                                        // boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: "#faf4fe",
                                        cursor: "pointer",
                                        "&:hover": { boxShadow: "0px 6px 5px rgba(0, 0, 0, 0.2)" },
                                    }}
                                >

                                    {/* Favorite Icon - Top Right */}
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent card click
                                            toggleFavorite(product);
                                        }}
                                        sx={{
                                            position: "absolute",
                                            top: 10,
                                            right: 10,
                                            zIndex: 2,
                                        }}
                                    >
                                        {favorites.some((item) => item._id === product._id) ? (
                                            <Favorite sx={{ fontSize: 24 }} color="error" />
                                        ) : (
                                            <FavoriteBorder sx={{ fontSize: 24, color: "white", }} />
                                        )}
                                    </IconButton>

                                    <CardMedia
                                        component="img"
                                        image={product?.images?.CoverImage?.[0]}
                                        alt={product?.additionalFields?.businessName || "Service Image"}
                                        sx={{
                                            maxHeight: 150,
                                            objectFit: "cover",
                                            width: "100%",
                                            borderRadius: 3
                                        }}
                                    />

                                    <CardContent sx={{ ml: 1, borderRadius: 2, p: 1 }}>
                                        <Typography textAlign="left" sx={{
                                            color: "#333",
                                            fontWeight: 600,
                                            fontSize: { xs: "0.8rem", md: "1rem" },
                                            mb: 1,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}>
                                            {product.additionalFields.businessName}
                                        </Typography>

                                        {/* Location Chips */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                                gap: 1,
                                                mb: 1,
                                            }}
                                        >
                                            {(product.additionalFields.availableLocations || []).map((location, i) => (
                                                <Chip
                                                    key={i}
                                                    label={location}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "#f0f0f0",
                                                        color: "#333",
                                                        fontSize: "0.65rem",
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            ))}
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', mt: 1 }}>
                                            {/* Price */}
                                            <Typography variant="caption" sx={{ color: "#666" }}>
                                                From ₹{product.additionalFields.priceRange || "N/A"}
                                            </Typography>

                                            {/* Rating */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', }}>
                                                <StarHalf sx={{ fontSize: 14, color: '#666', ml: 2 }} />
                                                <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
                                                    5.0
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>

                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>

                {/* Pagination */}
                {filteredData.length > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                        <Pagination
                            count={Math.ceil(filteredData.length / itemsPerPage)}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                            shape="rounded"
                        />
                    </Box>
                )}

            </Box>
            <FooterComponent />
        </ThemeProvider >
    );
};

export default ServiceListings;
