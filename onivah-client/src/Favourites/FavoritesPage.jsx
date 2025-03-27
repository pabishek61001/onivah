import { Typography, Card, CardContent, CardActions, Grid, IconButton, Button, CardMedia, Container } from "@mui/material";
import { Favorite, FavoriteBorder, NavigateNext } from "@mui/icons-material";
import { useFavorites } from "./FavoritesContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FooterComponent from "../components/FooterComponent";

const FavoritesPage = () => {
    const { favorites, toggleFavorite } = useFavorites(); // Get global favorites
    const navigate = useNavigate();

    // Function to format category name for URL
    const formatCategory = (category) => {
        return category
            ?.replace(/_/g, " ") // Replace underscores with spaces
            .split(" ") // Split into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Convert to Pascal Case
            .join(""); // Remove spaces for a cleaner URL
    };

    return (
        <div>
            <Header />
            <Container sx={{ mt: 10 }}>

                <Typography variant="h5" align="center" color="primary" fontWeight="bold" gutterBottom>
                    My Favorites
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
                    Here are the services you've marked as favorites. Explore and manage your saved selections easily.
                </Typography>


                <Grid container spacing={4} sx={{ py: 5 }}>
                    {favorites.length === 0 ? (
                        <Typography align="center" gutterBottom p={2} color="grey">
                            No services available currently.
                        </Typography>
                    ) : (
                        favorites.map((product) => {
                            const formattedCategory = formatCategory(product.category); // Convert category name for URL
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id} sx={{ mb: 2 }}>
                                    <Card
                                        sx={{
                                            borderRadius: 4,
                                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                                            backgroundColor: "#faf4fe",
                                            cursor: "pointer",
                                            "&:hover": { boxShadow: "0px 6px 5px rgba(0, 0, 0, 0.2)" },
                                        }}
                                    >
                                        {/* Service Image */}
                                        {product.image && (
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={`data:image/jpeg;base64,${product.image}`}
                                                alt={product.businessName || "Service Image"}
                                                sx={{ objectFit: "cover", transition: "transform 0.3s", "&:hover": { transform: "scale(1.02)" } }}
                                            />
                                        )}

                                        {/* Service Details */}
                                        <CardContent sx={{ ml: 1, borderRadius: 2, p: 1 }}>
                                            <Typography variant="h6" fontWeight="bold" textAlign="left" sx={{ color: "#333" }}>
                                                {product.businessName}
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary" textAlign="left">
                                                {formattedCategory}
                                            </Typography>
                                        </CardContent>

                                        {/* Actions */}
                                        <CardActions sx={{ justifyContent: "space-between", ml: 1, mb: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                sx={{ textTransform: "none", borderRadius: 2 }}
                                                endIcon={<NavigateNext />}
                                                onClick={() => navigate(`/category/${product.category}/${product._id}`)}
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
                            );
                        })
                    )}
                </Grid>

            </Container>
            <FooterComponent />
        </div>
    );
};

export default FavoritesPage;
