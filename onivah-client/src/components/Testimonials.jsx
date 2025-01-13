import React, { useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Card,
    CardMedia,
    CardContent,
    Avatar,
    Grid,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const testimonials = [
    {
        id: 1,
        name: "Jim Corner",
        role: "CEO, Victonary Co.",
        message:
            "I would like to say a big Thank you for your immense effort and support.  I have a feeling that our further events are going to be Great as well, good luck to the team.",
        image:
            "https://storage.googleapis.com/a1aa/image/laV6XOFWZf3TIij2aq9r1f066uNV4uRv2f8wAomJCTbX8EtnA.jpg",
    },
    {
        id: 2,
        name: "Jane Doe",
        role: "Manager, XYZ Inc.",
        message:
            "The team exceeded our expectations in every way. Their dedication and hard work ensured the success of our event!",
        image:
            "https://storage.googleapis.com/a1aa/image/Cz0hnNoO7eUkJ69OyvDqoWNSZJhYPqVXG08qFk77QtyEPR7JA.jpg",
    },
    {
        id: 3,
        name: "Sam Smith",
        role: "Director, ABC Ltd.",
        message:
            "Exceptional service and support. We’re thrilled with the outcome and look forward to future collaborations.",
        image:
            "https://storage.googleapis.com/a1aa/image/1XMayPwbVkr8IZeiT1ELXe4tZGeQuUTAEV3nrcYxMA4a8EtnA.jpg",
    },
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + testimonials.length) % testimonials.length
        );
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <Box
            sx={{
                // backgroundColor: "#f5f5f5",
                color: "gray.800",
                fontFamily: "sans-serif",
                py: 8,
                px: 4,
                minHeight: "100vh",
            }}
        >
            <Box textAlign="center" mb={3}>
                <Typography variant='h4' color='primary' gutterBottom sx={{ fontWeight: 700, textAlign: 'center', }} >
                    What our customers says
                </Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">

                {/* Avatars and Pagination */}
                <Box display="flex" alignItems="center" mb={4} >
                    <Box display="flex" gap={2}>
                        {testimonials.map((testimonial, index) => (
                            <Avatar
                                key={testimonial.id}
                                alt={`Portrait of ${testimonial.name}`}
                                src={testimonial.image}
                                sx={{
                                    width: 50,
                                    height: 50,
                                    border: index === currentIndex ? "3px solid purple" : "3px solid transparent",
                                    transition: "border 0.3s ease",
                                }}
                            />
                        ))}
                    </Box>
                    <Typography
                        ml={2}
                        fontWeight="bold"
                        color="purple"
                        fontSize="1.2rem"
                    >
                        {currentIndex + 1}/{testimonials.length}
                    </Typography>
                </Box>

                {/* Testimonial Content */}
                <Grid container spacing={4} justifyContent="center" alignItems="center">
                    <Grid item>
                        <Card
                            sx={{
                                background: "linear-gradient(135deg, #f8e9ff, #e0cfff)",
                                p: 2,
                                borderRadius: 3,
                                boxShadow: "0px 8px 15px rgba(0,0,0,0.1)",
                            }}
                        >
                            <CardMedia
                                component="img"
                                alt={`Portrait of ${currentTestimonial.name}`}
                                image={currentTestimonial.image}
                                height="100"
                                sx={{ borderRadius: 2, mb: 2 }}
                            />
                            <Typography align="center" fontWeight="bold" color="purple.700">
                                {currentTestimonial.name}
                            </Typography>
                            <Typography align="center" color="gray.500">
                                {currentTestimonial.role}
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card
                            sx={{
                                maxWidth: "400px",
                                backgroundColor: "white",
                                p: 3,
                                borderRadius: 3,
                                boxShadow: "0px 8px 15px rgba(0,0,0,0.1)",
                            }}
                        >
                            <CardContent>
                                <Typography color="gray.800" fontStyle="italic">
                                    “{currentTestimonial.message}”
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Navigation Buttons */}
                <Box display="flex" alignItems="center" mt={4}>
                    <IconButton
                        sx={{
                            backgroundColor: "purple.50",
                            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                            "&:hover": {
                                backgroundColor: "purple.100",
                            },
                        }}
                        onClick={handlePrev}
                    >
                        <ArrowBack sx={{ color: "purple" }} />
                    </IconButton>
                    <IconButton
                        sx={{
                            backgroundColor: "purple",
                            ml: 2,
                            color: "white",
                            boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
                            "&:hover": {
                                backgroundColor: "purple.700",
                            },
                        }}
                        onClick={handleNext}
                    >
                        <ArrowForward />
                    </IconButton>
                </Box>

            </Box>
        </Box>
    );
};

export default Testimonials;
