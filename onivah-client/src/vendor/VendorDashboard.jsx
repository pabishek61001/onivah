import React from "react";
import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, IconButton, Button, Avatar } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { useOutletContext } from "react-router-dom";
import { AddBusiness, Edit, EmojiEvents } from "@mui/icons-material";
import { Splide, SplideSlide } from "@splidejs/react-splide";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VendorDashboard = () => {

    const { vendor } = useOutletContext();

    // Dummy data
    const stats = [
        {
            title: "Total Sales",
            value: "₹0",
            color: ["#E8F5E9", "#C8E6C9"], // Soft green
            icon: <TrendingUpIcon fontSize="medium" color="success" />,
        },
        {
            title: "Total Orders",
            value: "0",
            color: ["#E3F2FD", "#BBDEFB"], // Soft blue
            icon: <ShoppingCartIcon fontSize="medium" color="primary" />,
        },
        {
            title: "Revenue",
            value: "₹0",
            color: ["#FFF3E0", "#FFE0B2"], // Soft orange
            icon: <AttachMoneyIcon fontSize="medium" sx={{ color: "#FB8C00" }} />,
        },
        {
            title: "Pending Orders",
            value: "0",
            color: ["#FFEBEE", "#FFCDD2"], // Soft red
            icon: <HourglassBottomIcon fontSize="medium" sx={{ color: "grey" }} />,
        },
    ];


    const recentOrders = [
        { id: "#1234", customer: "John Doe", amount: "$250", status: "Completed" },
        { id: "#1235", customer: "Jane Smith", amount: "$150", status: "Pending" },
        { id: "#1236", customer: "Mark Johnson", amount: "$320", status: "Processing" }
    ];

    const salesData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Monthly Sales",
                data: [500, 800, 1200, 1500, 2000, 2500],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
                tension: 0.4
            }
        ]
    };

    const tutorials = [
        { src: "https://videocdn.cdnpk.net/videos/836eec7e-eacd-50b2-834b-ae768d922b0b/horizontal/previews/clear/small.mp4?token=exp=1748495508~hmac=aa3e0a34f9b63194c0663553f3889fe6399c190a20e7abdc2c1e5f19c75fc84b", title: "How to Add a Service" },
        { src: "https://videocdn.cdnpk.net/videos/836eec7e-eacd-50b2-834b-ae768d922b0b/horizontal/previews/clear/small.mp4?token=exp=1748495508~hmac=aa3e0a34f9b63194c0663553f3889fe6399c190a20e7abdc2c1e5f19c75fc84b", title: "Managing Bookings" },
        { src: "https://videocdn.cdnpk.net/videos/836eec7e-eacd-50b2-834b-ae768d922b0b/horizontal/previews/clear/small.mp4?token=exp=1748495508~hmac=aa3e0a34f9b63194c0663553f3889fe6399c190a20e7abdc2c1e5f19c75fc84b", title: "Respond to Leads" },
        { src: "https://videocdn.cdnpk.net/videos/836eec7e-eacd-50b2-834b-ae768d922b0b/horizontal/previews/clear/small.mp4?token=exp=1748495508~hmac=aa3e0a34f9b63194c0663553f3889fe6399c190a20e7abdc2c1e5f19c75fc84b", title: "Customize Your Profile" },
    ];

    const heroSlides = [
        {
            title: "Welcome to Your Vendor Hub",
            subtitle: "Manage your services efficiently and reach more customers.",
            image: "https://img.freepik.com/free-photo/wedding-archway-backyard-happy-wedding-couple-outdoors-before-wedding-ceremony_8353-11057.jpg?uid=R133306793&ga=GA1.1.1773690977.1730112906&semt=ais_hybrid&w=740",
        },
        {
            title: "Boost Your Visibility",
            subtitle: "Keep your listings updated to attract more bookings.",
            image: "https://img.freepik.com/free-photo/3d-black-friday-celebration_23-2151848871.jpg?uid=R133306793&ga=GA1.1.1773690977.1730112906&semt=ais_hybrid&w=740",
        },
        {
            title: "Need Help?",
            subtitle: "Check out our tutorial videos or reach support anytime.",
            image: "https://img.freepik.com/free-photo/portrait-man-working-as-telemarketer_23-2151230021.jpg?uid=R133306793&ga=GA1.1.1773690977.1730112906&semt=ais_hybrid&w=740",
        },
    ];

    return (

        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 } }}>
            <Box width="100%">
                {/* Dashboard Title */}
                <Typography
                    variant="body5"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                        display: { xs: "none", md: "block" },
                        textAlign: "left",
                        // fontSize: { xs: "1.5rem", md: "2rem" },
                        pl: { xs: 0, md: 1 },
                        // mb: 3
                    }}
                >
                    Welcome to Your Vendor Dashboard
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, pl: { xs: 0, md: 1 }, }}>
                    Manage your services, stay on top of bookings, and connect with customers like never before.
                </Typography>
                {/* <Grid item xs={12} sx={{ mb: 6 }}>
                    <img src="https://cdn.pixabay.com/photo/2016/06/29/04/39/bride-1486004_1280.jpg" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 10 }} />
                </Grid> */}

                {/* <Box
                    sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 3,
                        bgcolor: "black",
                        height: { xs: 300, md: 400 },
                        mb: 4,
                    }}
                >
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: "brightness(40%)",
                        }}
                        src="https://videos.pexels.com/video-files/3122106/3122106-sd_640_360_25fps.mp4"
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            color: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            px: 2,
                        }}
                    >
                        <Typography sx={{ fontSize: { xs: '1rem', sm: '2rem', md: '3rem' } }} fontWeight={700}>
                            Welcome to Your Vendor Dashboard
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, maxWidth: 600 }}>
                            Manage your services, stay on top of bookings, and connect with customers like never before.
                        </Typography>
                        <Button variant="contained" sx={{ mt: 3 }} color="warning">
                            Explore Dashboard
                        </Button>
                    </Box>
                </Box> */}

                <Box sx={{ py: 4 }}>
                    <Splide
                        options={{
                            type: 'loop',
                            perPage: 1,
                            arrows: true,
                            pagination: true,
                            autoplay: true,
                            interval: 5000,
                            speed: 800,
                        }}
                        aria-label="Vendor Dashboard Hero"
                    >
                        {heroSlides.map((slide, index) => (
                            <SplideSlide key={index}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        height: { xs: 200, sm: 200, md: 200 },
                                    }}
                                >
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            filter: "brightness(0.6)",
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            textAlign: "center",
                                            color: "#fff",
                                            px: 2,
                                        }}
                                    >
                                        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }} fontWeight={700} mb={1}>
                                            {slide.title}
                                        </Typography>
                                        <Typography variant="subtitle1" mb={2}>
                                            {slide.subtitle}
                                        </Typography>
                                        {index === 2 && (
                                            <Button variant="contained" color="secondary">
                                                Watch Tutorials
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </SplideSlide>
                        ))}
                    </Splide>
                </Box>

                {/* STATS GRID */}
                <Grid container spacing={2} sx={{ py: 4 }}>
                    {stats.map((stat, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                            <Card
                                sx={{
                                    cursor: "pointer",
                                    background: `linear-gradient(135deg, ${stat.color[0]}, ${stat.color[1]})`,
                                    borderRadius: 3,
                                    p: 3,
                                    boxShadow: '0px 0px 2px 2px #0000',
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textAlign: "center",
                                    gap: 1.5,
                                    height: "100%",
                                    transition: "transform 0.25s ease-in-out",
                                    "&:hover": { transform: "scale(1.02)", boxShadow: 4 },
                                }}
                            >
                                <IconButton sx={{ bgcolor: 'rgb(0 0 0 / 6%)' }} fontSize={{ xs: 28, sm: 32 }}>{stat.icon}</IconButton>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontSize: { xs: 12, sm: 14 }, fontWeight: 500, color: "text.secondary" }}
                                >
                                    {stat.title}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{ fontSize: { xs: 18, sm: 22, md: 24 }, color: "text.primary" }}
                                >
                                    {stat.value}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 5, py: 4 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        🎥 Vendor Tutorials
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Learn how to make the most of your dashboard with these quick walkthroughs.
                    </Typography>

                    <Splide
                        options={{
                            type: "loop",
                            perPage: 4,
                            gap: "1rem",
                            breakpoints: {
                                1200: { perPage: 3 },  // md
                                900: { perPage: 2 },  // sm
                                600: { perPage: 1 },  // xs
                            },
                            pagination: true,
                            arrows: true,
                        }}
                        aria-label="Vendor Tutorial Videos"
                    >
                        {tutorials.map((tutorial, index) => (
                            <SplideSlide key={index}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        boxShadow: 3,
                                        "&:hover video": { transform: "scale(1.05)" },
                                    }}
                                >
                                    <video
                                        src={tutorial.src}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                            objectFit: "cover",
                                            transition: "transform 0.4s ease-in-out",
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            bgcolor: "rgba(0,0,0,0.6)",
                                            px: 1.5,
                                            py: 0.5,
                                            borderBottomRightRadius: 12,
                                        }}
                                    >
                                        <Typography variant="caption" color="white" fontWeight={600}>
                                            Tutorial
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            width: "100%",
                                            bgcolor: "rgba(0,0,0,0.9)",
                                            px: 2,
                                            py: 1,
                                        }}
                                    >
                                        <Typography variant="body2" color="white" fontWeight={500}>
                                            {tutorial.title}
                                        </Typography>
                                    </Box>
                                </Box>
                            </SplideSlide>
                        ))}
                    </Splide>

                </Box>

                {/* RECENT ORDERS TABLE */}
                <Box mt={5} sx={{ py: 4 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Recent Orders</Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: "auto" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.customer}</TableCell>
                                        <TableCell>${order.amount}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* SALES CHART */}
                <Box mt={5}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Sales Overview</Typography>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                        <Box sx={{ width: "100%", height: { xs: 250, sm: 300, md: 400 } }}>
                            <Line
                                data={salesData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        x: { ticks: { font: { size: 12 } } },
                                        y: { ticks: { font: { size: 12 } } }
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Container>


    );
};

export default VendorDashboard;
