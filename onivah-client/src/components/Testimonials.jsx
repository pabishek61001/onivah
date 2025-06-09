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
    Rating,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const testimonials = [
    {
        id: 1,
        name: "Jim Corner",
        role: "CEO, Victonary Co.",
        rating: 5,
        message:
            "I would like to say a big Thank you for your immense effort and support. Our future events will be even better!",
        image:
            "https://storage.googleapis.com/a1aa/image/laV6XOFWZf3TIij2aq9r1f066uNV4uRv2f8wAomJCTbX8EtnA.jpg",
    },
    {
        id: 2,
        name: "Jane Doe",
        role: "Manager, XYZ Inc.",
        rating: 4.5,
        message:
            "The team exceeded our expectations in every way. Their dedication ensured the success of our event!",
        image:
            "https://storage.googleapis.com/a1aa/image/Cz0hnNoO7eUkJ69OyvDqoWNSZJhYPqVXG08qFk77QtyEPR7JA.jpg",
    },
    {
        id: 3,
        name: "Sam Smith",
        role: "Director, ABC Ltd.",
        rating: 4,
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
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <Box sx={{
            py: 8, px: 4, textAlign: "center", backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1011%26quot%3b)' fill='none'%3e%3cpath d='M1488 560L0 560 L0 320.12Q75.12 275.24%2c 120 350.36Q153.04 263.4%2c 240 296.44Q311.39 247.83%2c 360 319.22Q407.42 294.64%2c 432 342.06Q443.93 281.99%2c 504 293.92Q545.33 263.25%2c 576 304.57Q661.87 270.44%2c 696 356.31Q722.88 263.19%2c 816 290.07Q861.16 263.23%2c 888 308.39Q976.57 276.96%2c 1008 365.53Q1062.6 300.13%2c 1128 354.73Q1165.65 272.38%2c 1248 310.03Q1315.75 257.78%2c 1368 325.53Q1441.71 279.24%2c 1488 352.95z' fill='rgba(67%2c 24%2c 93%2c 1)'%3e%3c/path%3e%3cpath d='M1512 560L0 560 L0 352.85Q42.91 323.76%2c 72 366.67Q121.43 344.1%2c 144 393.52Q184.25 313.77%2c 264 354.03Q312.9 330.93%2c 336 379.83Q396.8 368.63%2c 408 429.42Q427.01 376.44%2c 480 395.45Q502.56 346%2c 552 368.56Q594.19 338.75%2c 624 380.95Q710.15 347.1%2c 744 433.25Q765.52 334.77%2c 864 356.3Q908.69 328.99%2c 936 373.68Q1027.8 345.48%2c 1056 437.28Q1066.43 375.71%2c 1128 386.15Q1200.03 338.17%2c 1248 410.2Q1301.87 392.07%2c 1320 445.94Q1369.18 375.13%2c 1440 424.31Q1449.01 361.32%2c 1512 370.33z' fill='rgba(103%2c 37%2c 125%2c 1)'%3e%3c/path%3e%3cpath d='M1488 560L0 560 L0 503.64Q10 441.64%2c 72 451.65Q123.9 383.55%2c 192 435.45Q252.61 424.06%2c 264 484.66Q293.19 441.85%2c 336 471.03Q418.59 433.62%2c 456 516.21Q468.53 408.75%2c 576 421.28Q619.18 392.46%2c 648 435.64Q706.63 422.26%2c 720 480.89Q764.07 404.95%2c 840 449.02Q868.82 405.83%2c 912 434.65Q1010.98 413.63%2c 1032 512.61Q1052.03 460.64%2c 1104 480.67Q1126.04 430.71%2c 1176 452.74Q1200.63 405.37%2c 1248 430Q1334.03 396.03%2c 1368 482.06Q1434.5 428.56%2c 1488 495.07z' fill='rgba(130%2c 53%2c 177%2c 1)'%3e%3c/path%3e%3cpath d='M1488 560L0 560 L0 497.7Q84.9 462.6%2c 120 547.49Q167.1 522.59%2c 192 569.68Q193.88 499.55%2c 264 501.43Q330.56 448%2c 384 514.56Q453.63 464.18%2c 504 533.81Q524.6 482.4%2c 576 503Q619.25 474.25%2c 648 517.51Q725.66 475.17%2c 768 552.84Q838.47 503.31%2c 888 573.78Q923.38 489.15%2c 1008 524.53Q1084.84 481.37%2c 1128 558.21Q1200.89 511.1%2c 1248 583.99Q1271.32 487.31%2c 1368 510.63Q1434.86 457.49%2c 1488 524.35z' fill='white'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1011'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>

            <Typography variant="h4" fontWeight="bold" color="#5c3d77" mb={2}>
                What our customers say
            </Typography>

            <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
                {testimonials.map((testimonial, index) => (
                    <Avatar
                        key={testimonial.id}
                        src={testimonial.image}
                        sx={{
                            width: 50,
                            height: 50,
                            mx: 0.5,
                            border: index === currentIndex ? "3px solid purple" : "3px solid transparent",
                            transition: "border 0.3s ease",
                            cursor: "pointer",
                            '&:hover': { transform: "scale(1.1)" }
                        }}
                    />
                ))}
            </Box>

            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item>
                    <Card sx={{ p: 2, borderRadius: 3, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)", textAlign: "center" }}>
                        <CardMedia
                            component="img"
                            image={currentTestimonial.image}
                            sx={{ width: 80, height: 80, borderRadius: "50%", mx: "auto", mb: 1 }}
                        />
                        <CardContent>
                            <Typography fontWeight="bold" color="#5c3d77">
                                {currentTestimonial.name}
                            </Typography>
                            <Typography variant="subtitle2" color="gray">
                                {currentTestimonial.role}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card sx={{ maxWidth: 450, p: 3, borderRadius: 3, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)", backgroundColor: "white" }}>
                        <CardContent>
                            <Rating value={currentTestimonial.rating} precision={0.5} readOnly />
                            <Typography fontStyle="italic" mt={1}>
                                “{currentTestimonial.message}”
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
                <IconButton onClick={handlePrev} sx={{ bgcolor: "white", '&:hover': { transform: "scale(1.1)", bgcolor: "white", } }}>
                    <ArrowBack />
                </IconButton>
                <IconButton onClick={handleNext} sx={{ bgcolor: "white", '&:hover': { transform: "scale(1.1)", bgcolor: "white", } }}>
                    <ArrowForward />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Testimonials;