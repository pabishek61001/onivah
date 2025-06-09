import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AOS from "aos";
import "aos/dist/aos.css";
import { deepPurple } from "@mui/material/colors";

const HeroVideo = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <Box
            sx={{
                position: "relative",
                height: "100vh",
                overflow: "hidden",
                width: "100%",
            }}
        >
            {/* Fullscreen Background Video */}
            {/* <video
                autoPlay
                muted
                loop
                playsInline
                src={isMobile ? 'https://videos.pexels.com/video-files/17926846/17926846-sd_360_640_25fps.mp4' : "https://cdn.pixabay.com/video/2019/07/30/25640-351374271_large.mp4"}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: -1,
                }}
            /> */}


            {/* Fullscreen Background Image */}
            <img
                src="https://cdn.pixabay.com/photo/2022/11/22/02/52/wedding-7608613_1280.jpg"
                alt="Background"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: -1,
                }}
            />


            {/* Overlay Content */}
            {/* <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                sx={{
                    height: "100%",
                    px: 2,
                    color: "#fff",
                    background: isMobile ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.3)", // optional dark overlay
                }}
            >
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    gutterBottom
                    data-aos="fade-up"
                >
                    Where <span style={{ color: deepPurple[200] }}>Dream Weddings</span> Begin
                </Typography>
                <Typography
                    variant="h6"
                    sx={{ maxWidth: "700px", mb: 4 }}
                    data-aos="fade-up"
                    data-aos-delay="300"
                >
                    Simple, <strong>emotional</strong>, and <strong>powerful</strong>.
                    Let your big day be magical and unforgettable.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: deepPurple[500],
                        },
                    }}
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
                >
                    Book Now
                </Button>
            </Box> */}
        </Box>
    );
};

export default HeroVideo;
