import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Container, ThemeProvider, Tabs, Tab, useTheme, useMediaQuery } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import theme from "../Themes/theme";
import AOS from "aos";
import "aos/dist/aos.css";

const weddingSteps = [
    {
        title: "01. Choose Your Venue",
        description: "Explore a variety of stunning venues, from elegant banquet halls to dreamy outdoor settings. Choose the perfect place to say 'I do.'",
        video: "https://videos.pexels.com/video-files/2239242/2239242-sd_640_360_24fps.mp4", // Example video URL
    },
    {
        title: "02. Customize Your Package",
        description: "Customize every detail of your wedding package, including catering, décor, photography, and more. Your dream wedding, your way.",
        video: "https://videos.pexels.com/video-files/3722010/3722010-sd_640_360_24fps.mp4",
    },
    {
        title: "03. Enjoy Your Big Day",
        description: "Relax and cherish every moment while we handle the rest. Your big day will be stress-free, magical, and unforgettable.",
        video: "https://videos.pexels.com/video-files/3326573/3326573-sd_640_360_24fps.mp4",
    }
];


const HeroVideo = () => {

    const theme = useTheme();

    // Responsive Breakpoints
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Below 600px


    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        // Auto-play logic for Tabs & Image Slider
        const interval = setInterval(() => {
            setSelectedStep((prev) => (prev + 1) % weddingSteps.length);
        }, 10000); // Change tab every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const [selectedStep, setSelectedStep] = useState(0);




    return (
        <ThemeProvider theme={theme}>
            <Box
                display="flex"
                flexDirection={{ xs: "column", md: "row" }}
                bgcolor="#ffff"
                sx={{ height: { xs: "auto", md: "100vh" }, py: { xs: 4, md: 4 }, px: { xs: 2, md: 6 } }}
            >
                <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" sx={{ mt: { xs: 4, md: 0 } }}>
                    {/* Left Content */}
                    <Box display="flex" flexDirection="column" justifyContent="center" p={{ xs: 2, md: 6 }} sx={{ textAlign: { xs: "center", md: "left" }, }}>

                        <Box
                            textAlign={{ xs: "start", sm: "start" }}
                            sx={{
                                overflow: "hidden",
                                width: "100%",
                                py: { xs: 2, sm: 2, }
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight="500"
                                gutterBottom
                                sx={{
                                    lineHeight: 1.2,
                                    fontSize: { xs: "xx-large", md: "xxx-large" }
                                }}
                                data-aos="fade-up"
                                data-aos-delay="100"
                            >
                                Your dream wedding,
                            </Typography>
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    lineHeight: 1.2,
                                    fontSize: { xs: "24px", md: "32px" }
                                }}
                                data-aos="fade-up"
                                data-aos-delay="300"
                            >
                                Our expert planning,
                            </Typography>
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                    lineHeight: 1.2,
                                    fontSize: { xs: "24px", md: "32px" }
                                }}
                                data-aos="fade-up"
                                data-aos-delay="500"
                            >
                                A perfect day.
                            </Typography>
                        </Box>



                        <Button
                            variant="contained"
                            sx={{
                                color: "white",
                                px: 2,
                                py: 1,
                                maxWidth: 200,
                                fontWeight: "bold",
                                textTransform: "none",
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                                transition: "all 0.3s ease-in-out",
                            }}
                            onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
                            endIcon={<ArrowForwardIcon />}
                        >
                            Book Now
                        </Button>

                        <Box mt={3}>
                            <Tabs
                                value={selectedStep}
                                onChange={(e, newValue) => setSelectedStep(newValue)}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    maxWidth: 400,
                                    borderBottom: "2px solid #ddd",
                                    "& .MuiTabs-indicator": { backgroundColor: "black" },
                                }}
                            >
                                {weddingSteps.map((step, index) => (
                                    <Tab
                                        key={index}
                                        label={step.title}
                                        sx={{
                                            fontWeight: index === selectedStep ? "bold" : "normal",
                                            textTransform: "none",
                                            color: "gray",
                                            "&.Mui-selected": { color: "black" },
                                        }}
                                    />
                                ))}
                            </Tabs>



                            <Box mt={2}>
                                <Typography color="textSecondary" sx={{ maxWidth: 450, fontSize: "1rem", lineHeight: 1.6 }}>
                                    {weddingSteps[selectedStep].description}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Right Content (Video Slider - Changes Per Tab) */}
                    <Box flex={1} p={{ xs: 2, md: 4 }} display="flex" alignItems="center">
                        <Splide options={{ type: "fade", autoplay: false, interval: 10000, arrows: false, pagination: false }}>
                            <SplideSlide>
                                <video
                                    src={weddingSteps[selectedStep].video}
                                    style={{
                                        width: "100%",
                                        height: isMobile ? "auto" : "60vh",
                                        objectFit: "cover",
                                        borderRadius: 12,
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                        transition: "opacity 0.5s ease-in-out",
                                    }}
                                    autoPlay
                                    loop
                                    muted
                                />
                            </SplideSlide>
                        </Splide>
                    </Box>

                </Box>
            </Box>
        </ThemeProvider >

    );
};

export default HeroVideo;
