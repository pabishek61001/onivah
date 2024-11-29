import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Tooltip, CircularProgress } from "@mui/material";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import axios from "axios"; // Import Axios
import apiUrl from "../Api/Api";

// Function to ensure a minimum of 10 products
const ensureMinimumProducts = (filteredData) => {
    const minProducts = 10;
    if (filteredData.length >= minProducts) return filteredData;

    // Repeat existing items to reach the minimum count
    const repeatedItems = [...filteredData];
    while (repeatedItems.length < minProducts) {
        repeatedItems.push(...filteredData);
    }
    return repeatedItems.slice(0, minProducts);
};

const ServiceListings = () => {
    const { service } = useParams(); // Extract the service title from the URL
    const [data, setData] = useState([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                // Fetch data based on the service from the backend
                const response = await axios.get(`${apiUrl}/${service}`);
                const filteredData = response.data; // Assuming the backend returns an array of products

                // Ensure a minimum of 10 products
                setData(ensureMinimumProducts(filteredData));
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
        <Box sx={{ py: 6, px: 4, backgroundColor: "#f9f9f9" }}>
            <Typography
                variant="h3"
                textAlign="center"
                fontWeight="bold"
                gutterBottom
                sx={{ textTransform: "capitalize", color: "#333" }}
            >
                {service || "Our Services"}
            </Typography>

            <Grid container spacing={4}>
                {data.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: 5,
                                overflow: "hidden",
                                transition: "transform 0.3s ease",
                                backgroundColor: "#fff",
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.image}
                                alt={item.title}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    textAlign="center"
                                    gutterBottom
                                    sx={{ color: "#555" }}
                                >
                                    {item.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="textSecondary"
                                    textAlign="center"
                                    sx={{ fontSize: "1.2rem", marginBottom: 2 }}
                                >
                                    ₹{item.price.toLocaleString()}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    textAlign="center"
                                    sx={{ fontStyle: "italic", color: "#888" }}
                                >
                                    All inclusive prices
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                                <Tooltip title="Add to cart" arrow>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            textTransform: "none",
                                            borderRadius: 20,
                                            boxShadow: 2,
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={() => alert(`You selected: ${item.title}`)}
                                    >
                                        Book Now
                                    </Button>
                                </Tooltip>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ServiceListings;
