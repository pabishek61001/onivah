import React, { useEffect, useState } from "react";
import {
    Card, CardContent, Typography, Grid, CircularProgress, Box,
    FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip
} from "@mui/material";
import axios from "axios";

const ApprovedServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const fetchApprovedServices = async () => {
            try {
                const response = await axios.get("http://localhost:4000/admin/approved-services");
                setServices(response.data);
            } catch (error) {
                console.error("Error fetching approved services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedServices();
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

    // Get unique categories
    const categories = ["All", ...new Set(services.map(service => service.category))];

    // Filter services based on category selection
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
                    Approved Services
                </Typography>

                {/* Category Filter */}
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Category</InputLabel>
                    <Select label="Filter by Category" value={selectedCategory} onChange={handleCategoryChange}>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Services List */}
            <Grid container spacing={3}>
                {filteredServices.length === 0 ? (
                    <Typography>No approved services available.</Typography>
                ) : (
                    filteredServices.map((service) => (
                        <Grid item key={service._id} xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    minHeight: 250,
                                    cursor: "pointer",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    bgcolor: "#f5e9ff",
                                    transition: "0.3s",
                                    "&:hover": {
                                        boxShadow: 6,
                                        transform: "translateY(-5px)",
                                    },
                                }}
                                onClick={() => handleOpenDialog(service)}
                            >
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

                                    {/* Category Chip */}
                                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                                        <Chip
                                            color="primary"
                                            variant="filled"
                                            label={service.category}
                                            sx={{
                                                textTransform: "capitalize",
                                                fontWeight: "bold",
                                                color: "white",
                                                fontSize: "0.85rem",
                                                padding: "5px 10px"
                                            }}
                                        />
                                    </Box>

                                    {/* Full Name */}
                                    <Typography variant="body1" sx={{ fontWeight: "medium", mt: 1 }}>
                                        {service.additionalFields.businessName}
                                    </Typography>

                                    {/* Email */}
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                        ₹  {service.additionalFields.priceRange}
                                    </Typography>
                                </CardContent>

                            </Card>

                        </Grid>
                    ))
                )}
            </Grid>

            {/* Service Details Dialog */}
            <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
                {selectedService && (
                    <>
                        {/* Header Section with Background */}
                        <DialogTitle
                            sx={{
                                background: "#212121",
                                color: "white",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "16px 24px"
                            }}
                        >
                            {selectedService.category} - Service Details
                            <Button onClick={handleCloseDialog} sx={{ color: "white" }}>✖</Button>
                        </DialogTitle>

                        <DialogContent sx={{ padding: 3, mt: 3 }}>
                            {/* User Info Section */}
                            <Paper sx={{ padding: 2, mb: 2, boxShadow: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>Service Information</Typography>
                                <Typography><strong>Name:</strong> {selectedService.fullName}</Typography>
                                <Typography><strong>Email:</strong> {selectedService.email}</Typography>
                                <Typography><strong>Category:</strong> {selectedService.category}</Typography>
                            </Paper>

                            {/* Additional Details Section */}
                            {selectedService.additionalFields && (
                                <Paper sx={{ padding: 2, mb: 2, boxShadow: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                                        Additional Details
                                    </Typography>

                                    <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ background: "#f5f5f5" }}>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Field</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Object.entries(selectedService.additionalFields).map(([key, value]) => (
                                                    key !== "images" && (
                                                        <TableRow key={key}>
                                                            <TableCell sx={{ textTransform: "capitalize" }}>{key}</TableCell>
                                                            <TableCell>{value}</TableCell>
                                                        </TableRow>
                                                    )
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            )}


                            {/* Service Images Section */}
                            {selectedService.additionalFields.images?.length > 0 && (
                                <Paper elevation={0} sx={{ padding: 2, boxShadow: 0, borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>Images</Typography>
                                    <Grid container spacing={2}>
                                        {selectedService.additionalFields.images.map((img, index) => (
                                            <Grid item key={index} xs={6} sm={4}>
                                                <Box
                                                    component="img"
                                                    src={`data:image/jpeg;base64,${img.base64}`}
                                                    alt={`Service ${index + 1}`}
                                                    sx={{
                                                        width: "100%",
                                                        height: 120,
                                                        objectFit: "cover",
                                                        borderRadius: 2,
                                                        transition: "transform 0.3s",
                                                        "&:hover": { transform: "scale(1.05)" }
                                                    }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ padding: 2 }}>
                            <Button onClick={handleCloseDialog} variant="contained" color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

        </Box>
    );
};

export default ApprovedServices;
