import React, { useEffect, useState } from "react";
import {
    Card, CardContent, Typography, Grid, CircularProgress, Box,
    FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip
} from "@mui/material";
import axios from "axios";
import adminAxios from "../Api/Api";

const DeclinedServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const fetchDeclinedServices = async () => {
            try {
                const response = await adminAxios.get(`/declined-services`);
                setServices(response.data);
            } catch (error) {
                console.error("Error fetching declined services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeclinedServices();
    }, []);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleOpenDialog = (service) => {
        setSelectedService(service);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedService(null);
    };

    const categories = ["All", ...new Set(services.map(service => service.category))];
    const filteredServices = selectedCategory === "All"
        ? services
        : services.filter(service => service.category === selectedCategory);

    if (loading) {
        return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Declined Services
                </Typography>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Category</InputLabel>
                    <Select label="Filter by Category" value={selectedCategory} onChange={handleCategoryChange}>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {filteredServices.length === 0 ? (
                    <Typography>No declined services available.</Typography>
                ) : (
                    filteredServices.map((service) => (
                        <Grid item key={service._id} xs={12} sm={6} md={4}>
                            <Card sx={{
                                minHeight: 250,
                                cursor: "pointer",
                                borderRadius: 3,
                                boxShadow: 3,
                                bgcolor: "#ffebee",
                                transition: "0.3s",
                                "&:hover": {
                                    boxShadow: 6,
                                    transform: "translateY(-5px)",
                                },
                            }} onClick={() => handleOpenDialog(service)}>
                                <CardContent sx={{ textAlign: "center" }}>
                                    {/* Service Image */}
                                    {service.additionalFields.images?.length > 0 && (
                                        <Box
                                            sx={{
                                                mt: 1,
                                                borderRadius: 2,
                                                overflow: "hidden",
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <img
                                                src={`data:image/jpeg;base64,${service.additionalFields.images[0].base64}`}
                                                alt="Service"
                                                style={{
                                                    width: "100%",
                                                    height: "180px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </Box>
                                    )}
                                    <Chip color="error" variant="filled" label={service.category} sx={{ mt: 1, fontWeight: "bold", color: "white" }} />
                                    {/* Full Name */}
                                    <Typography variant="body1" sx={{ fontWeight: "medium", mt: 1 }}>
                                        {service.additionalFields.businessName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: "bold", color: "error.main" }}>
                                        Declined due to:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{
                                            mt: 0.5,
                                            fontStyle: "italic",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            display: "block",
                                            maxWidth: "100%", // Ensure it applies correctly
                                        }}
                                    >
                                        {service.declineReason}
                                    </Typography>



                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
                {selectedService && (
                    <>
                        <DialogTitle sx={{ background: "#b71c1c", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
                            {selectedService.category} - Service Details
                            <Button onClick={handleCloseDialog} sx={{ color: "white" }}>✖</Button>
                        </DialogTitle>

                        <DialogContent sx={{ padding: 3, mt: 3 }}>
                            <Paper sx={{ padding: 2, mb: 2, boxShadow: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>Service Information</Typography>
                                <Typography><strong>Name:</strong> {selectedService.fullName}</Typography>
                                <Typography><strong>Email:</strong> {selectedService.email}</Typography>
                                <Typography><strong>Category:</strong> {selectedService.category}</Typography>
                                <Typography color="error"><strong>Decline Reason:</strong> {selectedService.declineReason}</Typography>
                            </Paper>
                        </DialogContent>

                        <DialogActions sx={{ padding: 2 }}>
                            <Button onClick={handleCloseDialog} variant="contained" color="primary">Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default DeclinedServices;