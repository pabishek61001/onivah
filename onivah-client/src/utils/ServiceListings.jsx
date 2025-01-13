import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Tooltip, CircularProgress } from "@mui/material";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import axios from "axios"; // Import Axios
import apiUrl from "../Api/Api";
import Header from "../components/Header";
import theme from "../Themes/theme";
import FooterComponent from "../components/FooterComponent";

const ServiceListings = () => {

    const navigate = useNavigate()

    const { service } = useParams(); // Extract the service title from the URL
    const [data, setData] = useState([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                // Fetch data based on the service from the backend
                const response = await axios.get(`${apiUrl}/services/${service}`);
                const filteredData = response.data; // Assuming the backend returns an array of products
                setData(filteredData);
            } catch (err) {
                setError("Failed to fetch data");
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

    if (error) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Header />
            <Box sx={{ py: 8, px: 4, backgroundColor: "#fafafa" }}>
                <Box sx={{ textAlign: "center", mb: 6, mt: 2 }}>
                    {/* Main Heading */}
                    <Typography
                        variant="h4"
                        textAlign="center"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            textTransform: "capitalize",
                            color: "#333",
                            mb: 2, // Space between heading and subtext
                        }}
                    >
                        {service || "Our Services"}
                    </Typography>

                    {/* Subheading/Description */}
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{
                            fontSize: "1.1rem",
                            fontWeight: 400,
                            color: "#555",
                            lineHeight: 1.5,
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}
                    >
                        Discover a variety of services tailored to meet your needs. Browse through our offerings to find the best options available for you.
                    </Typography>
                </Box>


                <Grid container spacing={4}>
                    {data.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                    overflow: "hidden",
                                    backgroundColor: "#faf4fe",
                                    cursor: "pointer",
                                    "&:hover": {
                                        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.3)',
                                    },
                                }}
                                onClick={() => navigate(`/category/${service}/${item[`${service}_id`]}`)}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={item.imageUrls[0]} // Assuming the first image is the primary one
                                    alt={item.name}
                                    sx={{
                                        objectFit: "cover",
                                        transition: "transform 0.3s ease-in-out",
                                        "&:hover": {
                                            transform: "scale(1.02)",
                                        },
                                    }}
                                />
                                <CardContent sx={{ ml: 1, borderRadius: 2, p: 1 }}>
                                    {/* Name of the Item */}
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        textAlign="left"
                                        sx={{ color: "#333", }}
                                    >
                                        {item.name}, {item.location}
                                    </Typography>

                                    {/* Price */}
                                    <Typography
                                        variant="subtitle1"
                                        color="textSecondary"
                                        textAlign="left"
                                    >
                                        Price:  ₹{item.price.toLocaleString()}
                                    </Typography>
                                </CardContent>

                                <CardActions sx={{ justifyContent: "start", ml: 1, mb: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{
                                            textTransform: "none",
                                            borderRadius: 2,
                                            fontSize: "1rem",
                                            display: "flex",
                                            alignItems: "center",
                                            "&:hover": {
                                                backgroundColor: theme.palette.primary.dark,
                                            },
                                        }}
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={() => navigate(`/category/${service}/${item[`${service}_id`]}`)}
                                    >
                                        View Service
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <FooterComponent />
        </Box >
    );
};

export default ServiceListings;
