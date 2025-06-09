import React, { useState, useEffect } from "react";
import {
    Typography,
    Box,
    Grid,
    Card,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import {
    Inventory,
    PendingActions,
    CheckCircle,
    People,
} from "@mui/icons-material";
import adminAxios from "../Api/Api";

const AdminHome = () => {
    const [servicesData, setServicesData] = useState({
        approved: {},
        pending: {},
        declined: {},
        categories: [],
    });

    useEffect(() => {
        adminAxios.get(`/fetch/dashboard-details`)
            .then(response => setServicesData(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            {/* Welcome Section */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Welcome to Onivah Admin Dashboard 👋
            </Typography>
            <Typography variant="body1" color="textSecondary">
                Manage your services, requests, and user interactions efficiently.
            </Typography>

            {/* Quick Stats Cards */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                {[
                    { title: "Approved Services", key: "approved", color: "#673AB7", icon: <Inventory /> },
                    { title: "Pending Requests", key: "pending", color: "#FF9800", icon: <PendingActions /> },
                    { title: "Declined Requests", key: "declined", color: "#d83f01", icon: <CheckCircle /> },
                    { title: "Active Users", color: "#4CAF50", icon: <People /> }
                ].map((status, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                p: 3,
                                textAlign: "center",
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${status.color} 90%, #fff 90%)`,
                                bgcolor: status.color,
                                color: "#fff",
                                height: 200,
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                transition: "box-shadow 0.3s",
                                "&:hover": {
                                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                                }
                            }}
                        >
                            <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                                <Avatar sx={{ bgcolor: "#ffffff40", p: 1, width: 48, height: 48 }}>
                                    {status.icon}
                                </Avatar>
                            </Box>
                            <Typography variant="h6" fontWeight="bold">{status.title}</Typography>
                            <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                                {servicesData[status.key]?.count || 0}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Services Category Details */}
            <Grid container spacing={3} sx={{ mt: 3 }}>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Service Details by Category
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "primary.main" }}>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Category Name</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">Total Services</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {servicesData.categories.length > 0 ? (
                                    servicesData.categories.map((category, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {category.name
                                                    .replace(/([a-z])([A-Z])/g, "$1 $2") // Split PascalCase
                                                    .replace(/_/g, " ") // Replace underscores
                                                    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize words
                                                }
                                            </TableCell>
                                            <TableCell align="right">{category.count}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} align="center">
                                            No category data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    );
};

export default AdminHome;
