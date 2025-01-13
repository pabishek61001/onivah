import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/system";

const CollageImage = styled("img")({
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "10px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    },
});

const GallerySection = () => {
    return (
        <section id="collage-section" style={{
            padding: "80px 0", backgroundColor: "#f5f5f5",
            backgroundImage: `url(https://images.pexels.com/photos/19027703/pexels-photo-19027703/free-photo-of-a-foggy-forest-with-trees-and-fog.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`
        }}>
            <div style={{ width: "90%", margin: "0 auto" }}>
                {/* Main Section Container */}
                <Grid container spacing={6} justifyContent="center" alignItems="stretch">
                    {/* Left - Collage of 4 Images */}
                    <Grid item xs={12} sm={6} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "15px",
                                width: "100%",
                                height: '100%', // Ensure full height
                            }}
                        >
                            <CollageImage
                                src="https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=600"
                                alt="Image 1"
                                style={{ height: "300px" }}
                            />
                            <CollageImage
                                src="https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=600"
                                alt="Image 2"
                                style={{ height: "250px" }}
                            />
                            <CollageImage
                                src="https://images.pexels.com/photos/29703684/pexels-photo-29703684/free-photo-of-elegant-banquet-hall-with-crystal-chandeliers.jpeg?auto=compress&cs=tinysrgb&w=600"
                                alt="Image 3"
                                style={{ height: "280px" }}
                            />
                            <CollageImage
                                src="https://images.pexels.com/photos/8819774/pexels-photo-8819774.jpeg?auto=compress&cs=tinysrgb&w=600"
                                alt="Image 4"
                                style={{ height: "350px" }}
                            />
                        </Box>
                    </Grid>

                    {/* Right - Heading, Subtexts, and Button with Image */}
                    <Grid item xs={12} sm={6} md={5}>
                        <Box
                            sx={{
                                padding: "40px",
                                backgroundColor: "white",
                                borderRadius: "8px",
                                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",
                                height: "100%", // Ensure full height
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}
                        >
                            <div>
                                <Typography variant="h3" gutterBottom sx={{ fontWeight: "700", color: "#333", fontSize: "2.5rem" }}>
                                    Discover Our Services
                                </Typography>
                                <Typography variant="body1" paragraph sx={{ color: "#555", lineHeight: 1.8, fontSize: "1rem" }}>
                                    Our wide range of services are designed to help you succeed in any project. We focus on quality and customer satisfaction. We guarantee to provide high-quality solutions with the best professionals.
                                </Typography>
                            </div>

                            {/* Add the Image */}
                            <Box sx={{ marginTop: "20px" }}>
                                <CollageImage
                                    src="https://images.pexels.com/photos/29703684/pexels-photo-29703684/free-photo-of-elegant-banquet-hall-with-crystal-chandeliers.jpeg?auto=compress&cs=tinysrgb&w=600"
                                    alt="Event Image"
                                    style={{ height: "250px", borderRadius: "8px" }}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    backgroundColor: "#38a1f7",
                                    '&:hover': { backgroundColor: "#1a7dc4" },
                                    padding: "12px 30px",
                                    borderRadius: "50px",
                                    fontWeight: "bold",
                                    fontSize: "18px",
                                    marginTop: "20px",
                                }}
                            >
                                Learn More
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </section>
    );
};

export default GallerySection;
