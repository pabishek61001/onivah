import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Stack,
    DialogActions,
    TextField, Drawer, Slide, useTheme, useMediaQuery, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import apiUrl from '../Api/Api';
import { NavigateNext } from '@mui/icons-material';

const RequestedServices = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect small screens

    const [requestedServices, setRequestedServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentImages, setCurrentImages] = useState([]);

    useEffect(() => {
        const fetchRequestedServices = async () => {
            try {
                const response = await axios.get(`${apiUrl}/admin/requested-services`);
                console.log(response.data);
                setRequestedServices(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching requested services:', error);
                setLoading(false);
            }
        };

        fetchRequestedServices();
    }, []);

    // Approve a service
    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:4000/admin/approve-service/${id}`);
            setDrawerOpen(false);
            setRequestedServices(requestedServices.filter((service) => service._id !== id)); // Remove from UI
            alert("Service approved successfully!");
        } catch (error) {
            console.error("Error approving service:", error);
            alert("Failed to approve service.");
        }
    };


    const handleImageClick = (images, index) => {
        setCurrentImages(images);
        setCurrentImageIndex(index);
        setCurrentImage(images[index].base64);
        setOpenDialog(true);
    };

    const handleNextImage = () => {
        if (currentImageIndex < currentImages.length - 1) {
            setCurrentImageIndex((prev) => prev + 1);
            setCurrentImage(currentImages[currentImageIndex + 1].base64);
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex((prev) => prev - 1);
            setCurrentImage(currentImages[currentImageIndex - 1].base64);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentImage(null);
        setCurrentImageIndex(0);
    };


    const [open, setOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [reason, setReason] = useState("");



    const [selectedService, setSelectedService] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleViewDetails = (service) => {
        setSelectedService(service);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedService(null);
    };

    const handleDeclineDialog = (email) => {
        setSelectedEmail(email);
        setOpen(true);
    };

    const handleCloseDeclineDialog = () => {
        setOpen(false);
        setReason("");
    };

    const handleConfirmDecline = async (id) => {
        if (!reason.trim()) {
            alert("Please provide a reason for declining.");
            return;
        }

        try {
            await axios.put(`http://localhost:4000/admin/decline-service/${id}`, { reason });
            alert("Service request declined successfully.");
            handleCloseDrawer();
            handleCloseDeclineDialog(); // Close the dialog
            setRequestedServices(requestedServices.filter((service) => service._id !== id)); // Remove from UI
        } catch (error) {
            console.error("Error declining request:", error);
            alert("Failed to decline the request.");
        }
    };


    if (loading) {
        return <Typography variant="h6" align="center">Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Requested Services
            </Typography>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
                <TableContainer elevation={0} component={Paper} sx={{ boxShadow: "none", borderRadius: "12px", maxWidth: 900, margin: "auto" }}>
                    <Table>
                        <TableBody>
                            {requestedServices.map((service, index) => (
                                <TableRow key={index} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}>
                                    {/* Index Column */}
                                    <TableCell sx={{ fontWeight: "bold", color: "#333", width: "5%" }}>{index + 1}</TableCell>

                                    {/* Name Column */}
                                    <TableCell sx={{ width: { xs: "30%", sm: "15%" } }}>{service.fullName}</TableCell>

                                    {/* Email Column (Hidden on very small screens) */}
                                    <TableCell sx={{ width: "25%", display: { xs: "none", sm: "table-cell" } }}>
                                        {service.email}
                                    </TableCell>

                                    {/* Services Offered */}
                                    <TableCell sx={{ width: { xs: "30%", sm: "25%" }, color: "#555" }}>
                                        <Chip
                                            label={service.category}
                                            color="primary" // You can change the color
                                            variant="outlined" // Options: "filled" or "outlined"
                                            sx={{ fontWeight: "bold", fontSize: "0.9rem", padding: "5px 10px" }}
                                        />
                                    </TableCell>
                                    {/* Action Buttons */}
                                    <TableCell sx={{ width: { xs: "30%", sm: "25%" }, color: "#555" }}>
                                        <Button
                                            endIcon={<NavigateNext />}
                                            size="small"
                                            variant="contained"
                                            sx={{
                                                textTransform: "none",
                                                fontWeight: "bold",
                                                color: "white",
                                                bgcolor: "#1976d2",
                                                minWidth: isMobile ? "100%" : "100px",
                                            }}
                                            onClick={() => handleViewDetails(service)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Slide Drawer for Details */}
            <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
                <Slide direction="left" in={drawerOpen} mountOnEnter unmountOnExit>
                    <Box sx={{ width: '100%', padding: "20px", mt: 10 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                            Service Details
                        </Typography>
                        {selectedService ? (
                            <>
                                <Typography variant="body1"><strong>Name:</strong> {selectedService.fullName}</Typography>
                                <Typography variant="body1"><strong>Email:</strong> {selectedService.email}</Typography>

                                {selectedService.additionalFields && Object.keys(selectedService.additionalFields).length > 0 && (
                                    <TableContainer elevation={0} component={Paper} sx={{ marginTop: 2, borderRadius: "8px" }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: "#eeeeee" }}>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Field</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Object.entries(selectedService.additionalFields).map(([key, value]) => (
                                                    <TableRow key={key}>
                                                        <TableCell sx={{ textTransform: "capitalize", fontWeight: "500", color: "gray" }}>
                                                            {key}
                                                        </TableCell>
                                                        <TableCell>
                                                            {key === "images" && Array.isArray(value) ? (
                                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "5px" }}>
                                                                    {value.map((img, imgIndex) => (
                                                                        <img
                                                                            onClick={() => handleImageClick(value, imgIndex)}
                                                                            key={imgIndex}
                                                                            src={`data:image/jpeg;base64,${img.base64}`}
                                                                            alt={`Uploaded ${imgIndex}`}
                                                                            style={{
                                                                                width: "80px",
                                                                                height: "80px",
                                                                                objectFit: "cover",
                                                                                borderRadius: "8px",
                                                                                cursor: "pointer",
                                                                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                                                                transition: "transform 0.2s",
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            ) : (
                                                                <Typography variant="body2">{value}</Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}


                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                                <Stack
                                    sx={{ width: "100%", p: 3 }}
                                    direction={isMobile ? "column" : "row"}
                                    spacing={1}
                                    justifyContent="center"
                                    alignItems={isMobile ? "stretch" : "center"}
                                >
                                    <Button
                                        size="small"
                                        variant="contained"
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            backgroundColor: "#4caf50",
                                            "&:hover": { backgroundColor: "#388e3c" },
                                            borderRadius: "8px",
                                            minWidth: isMobile ? "100%" : "100px",
                                        }}
                                        onClick={() => handleApprove(selectedService._id)}
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="warning"
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            borderRadius: "8px",
                                            borderColor: "#d32f2f",
                                            "&:hover": { backgroundColor: "#ffebee", borderColor: "#b71c1c" },
                                            minWidth: isMobile ? "100%" : "100px",
                                        }}
                                        onClick={() => handleDeclineDialog(selectedService.email)}
                                    >
                                        Decline
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            borderRadius: "8px",
                                            minWidth: isMobile ? "100%" : "100px",
                                        }}
                                        onClick={handleCloseDrawer}
                                    >
                                        Close
                                    </Button>
                                </Stack>




                            </>
                        ) : (
                            <Typography variant="body2">No details available.</Typography>
                        )}
                    </Box>
                </Slide>
            </Drawer>


            {/* Image Preview Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
                <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <IconButton onClick={handlePrevImage} disabled={currentImageIndex === 0} sx={{ position: 'absolute', left: 8 }}>
                        <ArrowBackIosIcon />
                    </IconButton>

                    <img
                        src={`data:image/jpeg;base64,${currentImage}`}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: "10px" }}
                    />

                    <IconButton onClick={handleNextImage} disabled={currentImageIndex === currentImages.length - 1} sx={{ position: 'absolute', right: 8 }}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </DialogContent>
            </Dialog>

            {/* Decline Confirmation Dialog */}
            <Dialog open={open} onClose={handleCloseDeclineDialog} maxWidth="xl">
                <DialogTitle sx={{ bgcolor: "#dddd" }}>Decline Request</DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    <Typography variant='body5' sx={{ mt: 2 }} component="div" color='textSecondary'>Write a detailed description for declining the request.</Typography>
                    <p><strong>To :</strong> {selectedEmail}</p>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Reason for Declining"
                        variant="outlined"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        sx={{ marginTop: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeclineDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleConfirmDecline(selectedService._id)} variant="contained" color="error">
                        Confirm Decline
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>
    );
};

export default RequestedServices;
