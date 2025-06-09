import React, { useEffect, useState, useMemo } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import Showcases from '../components/Showcases';
import TopPicks from '../components/TopPicks';
import { Box, Card, CardContent, CardMedia, CardActions, Container, Grid, IconButton, Typography, Button, Skeleton, Stack, Chip, Pagination, Accordion, AccordionSummary, AccordionDetails, List, ListItemButton, ListItemIcon, Radio, ListItemText, Drawer } from '@mui/material';
import FooterComponent from '../components/FooterComponent';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Favorite from '@mui/icons-material/Favorite';
import axios from 'axios';
import { apiUrl } from '../Api/Api';
import HeroVideo from '../components/HeroVideo';
import GallerySection from '../utils/GallerySection';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import WelcomeSection from '../components/WelcomeSection';
import Testimonials from '../components/Testimonials';
import { useFavorites } from '../Favourites/FavoritesContext';
import { ExpandMore, FavoriteBorder, FilterList, NavigateNext, StarBorder, StarHalf } from '@mui/icons-material';
import VideoSection from '../components/VideoSection';
import { FormControl, Select, MenuItem, InputLabel, } from "@mui/material";

const LandingPage = ({ setLoading, setError }) => {

    const navigate = useNavigate();
    const { favorites, toggleFavorite } = useFavorites();

    const [searchData, SetSearchData] = useState([]);
    const [customerChoice, setCustomerChoice] = useState({
        location: '',
        datesChoosed: '',
        category: '',
    });

    const itemsPerPage = 4;  // Number of products per page
    const [page, setPage] = useState(1);

    const [filterLocation, setFilterLocation] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [themeType, setThemeType] = useState("");

    const [mobileOpen, setMobileOpen] = useState(false);
    const [expanded, setExpanded] = useState(null); // Tracks open accordion


    const location = useLocation();

    // Extract URL parameters when location changes
    useEffect(() => {

        window.scroll(0, 0);

        const params = new URLSearchParams(location.search);
        const locationParam = params.get('location') || '';
        const datesChoosedParam = params.getAll('datesChoosed') || [];
        const categoryParam = params.get('category') || '';

        // Update customerChoice based on URL parameters
        const newChoice = {
            location: locationParam,
            datesChoosed: datesChoosedParam,
            category: categoryParam,
        };

        // Update state
        setCustomerChoice(newChoice);

        // ✅ Store in localStorage
        localStorage.setItem('customerChoice', JSON.stringify(newChoice));


        const fetchVenueData = async () => {
            if (locationParam || categoryParam) {
                try {
                    const response = await axios.get(
                        `${apiUrl}/header/search?location=${locationParam}&category=${categoryParam}`
                    );
                    console.log(response);

                    if (response.data.success) {
                        SetSearchData(response.data.service);
                    } else {
                        SetSearchData([]); // No venues found
                    }
                } catch (error) {
                    SetSearchData([]);
                    console.error("Error fetching venue data:", error);
                }
            }
        };

        fetchVenueData();
    }, [location]);

    const hasSearchResults = useMemo(
        () => customerChoice.location || customerChoice.datesChoosed.length > 0 || customerChoice.category,
        [customerChoice]
    );

    // Slice products to show based on the current page
    const paginatedProducts = searchData.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleFilterChange = (event) => {
        setFilterLocation(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleThemeChange = (event) => {
        setThemeType(event.target.value);
    };


    let filteredData = [...searchData]; // Make a copy to prevent modifying the original array

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


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleAccordionChange = (panel) => (_, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };


    const formatText = (text) => {
        return text
            ? text
                .replace(/_/g, " ") // Replace underscores with spaces
                .replace(/([a-z])([A-Z])/g, "$1 $2") // Split PascalCase
                .toLowerCase() // Convert everything to lowercase first
                .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
            : "All Locations";
    };


    return (
        <div className='overall-container'>
            <Header />
            {hasSearchResults ? (
                <Container sx={{ mt: 10, py: 4 }}>

                    <Typography variant="body5" component='div' fontWeight="bold" color='inherit' gutterBottom>
                        Search Results for{" "}
                        <Box component="span" sx={{ color: "secondary.main", fontWeight: "bold" }}>
                            {formatText(customerChoice.category) || "All Categories"}
                        </Box>{" "}
                        in{" "}
                        <Box component="span" sx={{ color: "secondary.main", fontWeight: "bold" }}>
                            {formatText(customerChoice.location) || "All Locations"}
                        </Box>
                    </Typography>

                    <Typography variant="body5" color="textSecondary">
                        Here are the results matching your query. Refine your search for more accuracy.
                    </Typography>

                    {/* Desktop View - Normal Layout */}
                    <Grid container spacing={2} sx={{ display: { xs: "none", sm: "flex" }, py: 6 }}>
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

                    <Grid container spacing={2} sx={{ mt: 4, display: { xs: "flex", sm: "none" }, justifyContent: "end" }}>
                        <Button size='small' variant="outlined" onClick={handleDrawerToggle} startIcon={<FilterList fontSize="small" />}>Filter</Button>
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

                    <Grid container spacing={2} sx={{ mt: 1 }}>

                        {searchData.length === 0 ? (
                            // Show Skeleton Loader when loading or no data
                            [...Array(4)].map((_, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <Card sx={{ borderRadius: 4, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" }}>
                                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "4px 4px 0 0" }} />
                                        <CardContent>
                                            <Skeleton variant="text" width="80%" height={24} />
                                            <Skeleton variant="text" width="60%" height={20} />
                                            <Skeleton variant="text" width="50%" height={20} />
                                        </CardContent>
                                        <CardActions>
                                            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
                                            <Skeleton variant="circular" width={36} height={36} />
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            // Show actual data when available
                            paginatedProducts.map((product, index) => (
                                <Grid item xs={6} sm={6} md={4} lg={3} key={index} sx={{ mb: 3 }}>
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
                                                navigate(`/category/${product.category}/${product._id}`);
                                            } catch (err) {
                                                console.error("Error updating customerChoice:", err);
                                                navigate(`/category/${product.category}/${product._id}`);
                                            }
                                        }}
                                        sx={{
                                            borderRadius: 4,
                                            position: "relative",
                                            overflow: "hidden",
                                            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",
                                            backgroundColor: "#ffffff",
                                            cursor: "pointer",
                                            transition: "transform 0.2s, box-shadow 0.3s",
                                            "&:hover": {
                                                transform: "scale(1.01)",
                                                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
                                            },
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

                                        {/* Product Image */}
                                        <CardMedia
                                            component="img"
                                            image={product?.images?.CoverImage?.[0]}
                                            alt={product.additionalFields.businessName || "Service Image"}
                                            sx={{
                                                // height: "auto",
                                                // minHeight: 100,
                                                maxHeight: 150,
                                                objectFit: "cover",
                                                width: "100%",
                                                borderRadius: 3
                                            }}
                                        />

                                        {/* Content */}
                                        <CardContent sx={{ p: 2 }}>
                                            {/* Business Name */}
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
                    {searchData.length > 0 && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                            <Pagination
                                count={Math.ceil(searchData.length / itemsPerPage)}
                                page={page}
                                onChange={(e, value) => setPage(value)}
                                color="primary"
                                shape="rounded"
                            />
                        </Box>
                    )}
                </Container>

            ) : (
                <>
                    <HeroVideo />
                    <WelcomeSection />
                    <SearchBox />
                    <Showcases />
                    <VideoSection />
                    <GallerySection />
                    <TopPicks />
                    <Testimonials />
                </>

            )}

            <Box sx={{ p: 3 }} />
            <FooterComponent />
        </div>
    );
};

export default LandingPage;
