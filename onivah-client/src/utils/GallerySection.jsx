import React from "react";
import { Grid, Typography, Button, Box, useMediaQuery, Container, } from "@mui/material";
import { styled } from "@mui/system";

const CollageImage = styled("img")(({ theme }) => ({
    width: "100%",
    height: "300px",
    objectFit: "cover",
    borderRadius: "10px",
    [theme.breakpoints.down("sm")]: {
        height: "200px",
    },
}));

const GallerySection = () => {


    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const images = [
        "https://images.pexels.com/photos/14703707/pexels-photo-14703707.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/2544826/pexels-photo-2544826.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/844928/pexels-photo-844928.jpeg?auto=compress&cs=tinysrgb&w=600",
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 4, }}>
            <Grid container spacing={6} justifyContent="center" alignItems="stretch" sx={{ p: 2 }}>
                {/* Left - Collage of 4 Images */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "repeat(1, 1fr)" : "repeat(2, 1fr)",
                            gap: "15px",
                        }}
                    >
                        {images.map((src, index) => (
                            <CollageImage data-aos="fade-up" data-aos-delay={0 * index} data-aos-offset={200} key={index} src={src} alt={`Image ${index + 1}`} />
                        ))}
                    </Box>
                </Grid>

                {/* Right - Heading, Text, Image, Button */}
                <Grid item xs={12} md={5}>
                    <Box
                        sx={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            boxShadow: 0,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                        }}
                    >
                        <Typography variant="h4" fontWeight="700" color="#333" gutterBottom>
                            Discover Our Services
                        </Typography>
                        <Typography variant="body1" color="#555" sx={{ lineHeight: 1.8, fontSize: "1rem" }}>
                            Our wide range of services are designed to help you succeed in any project. We focus on quality and customer satisfaction, providing high-quality solutions with the best professionals.
                        </Typography>
                        <Typography variant="body1" color="#555" sx={{ lineHeight: 1.8, fontSize: "1rem" }}>
                            Our wide range of services are designed to help you succeed in any project. We focus on quality and customer satisfaction, providing high-quality solutions with the best professionals.
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                padding: "12px 30px",
                                borderRadius: "50px",
                                fontWeight: "bold",
                                fontSize: "18px",
                                marginTop: "20px",
                                alignSelf: "flex-start",
                            }}
                        >
                            Learn More
                        </Button>

                        {/* Responsive Image */}
                        <Box sx={{ marginTop: "20px" }}>
                            <CollageImage
                                src="https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=600"
                                alt="Event Image"
                                sx={{ height: isMobile ? "200px" : "250px" }}
                            />
                        </Box>


                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default GallerySection;
