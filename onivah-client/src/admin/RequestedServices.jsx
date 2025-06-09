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
    TextField, Drawer, Slide, useTheme, useMediaQuery, Chip, Divider, Card, CardMedia
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { apiUrl } from '../Api/Api';
import { NavigateNext } from '@mui/icons-material';
import adminAxios from '../Api/Api';
import Close from '@mui/icons-material/Close';

const RequestedServices = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect small screens

    const [requestedServices, setRequestedServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [currentImages, setCurrentImages] = React.useState([]); // array of image URLs
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [currentImage, setCurrentImage] = React.useState(null);


    useEffect(() => {
        const fetchRequestedServices = async () => {
            try {
                const response = await adminAxios.get(`/requested-services`);
                console.log(response.data);
                setRequestedServices(response.data);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching requested services:', error);
                setLoading(false);
            }
        };

        fetchRequestedServices();
    }, []);

    // Approve a service
    const handleApprove = async (id) => {

        try {
            await adminAxios.post(`/approve-service/${id}`);
            setDrawerOpen(false);
            setRequestedServices(requestedServices.filter((service) => service._id !== id)); // Remove from UI
            alert("Service approved successfully!");
        } catch (error) {
            console.log("Error approving service:", error);
            alert("Failed to approve service.");
        }
    };


    const handleImageClick = (images, index) => {
        setCurrentImages(images);
        setCurrentImageIndex(index);
        setCurrentImage(images[index]);
        setOpenDialog(true);
    };

    const handleNextImage = () => {
        if (currentImageIndex < currentImages.length - 1) {
            const newIndex = currentImageIndex + 1;
            setCurrentImageIndex(newIndex);
            setCurrentImage(currentImages[newIndex]);
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            const newIndex = currentImageIndex - 1;
            setCurrentImageIndex(newIndex);
            setCurrentImage(currentImages[newIndex]);
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

    const handleViewDetails = async (service) => {
        try {
            const response = await adminAxios.get(`/get-file/${service._id}`);
            const fileUrl = response.data.fileUrl;

            setSelectedService({ ...service, fileUrl });
            setDrawerOpen(true);
        } catch (err) {
            console.log('Error fetching service:', err);
        }
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
            await adminAxios.put(`/decline-service/${id}`, { reason });
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
            <Drawer anchor="bottom" open={drawerOpen} onClose={handleCloseDrawer}>
                <Slide direction="up" in={drawerOpen} mountOnEnter unmountOnExit>
                    <Box sx={{ width: '100%', padding: "20px", mt: 10 }}>
                        <Stack direction='row' justifyContent='space-between'>
                            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                                Service Details
                            </Typography>
                            <IconButton sx={{ p: 1, bgcolor: "#f5f5f5" }} onClick={handleCloseDrawer}>
                                <Close sx={{ fontSize: 20, color: "#000" }} />
                            </IconButton>
                        </Stack>

                        {selectedService ? (
                            <>
                                {/* <Typography variant="body1"><strong>Name:</strong> {selectedService.fullName}</Typography>
                                <Typography variant="body1"><strong>Email:</strong> {selectedService.email}</Typography> */}

                                {selectedService.additionalFields && Object.keys(selectedService.additionalFields).length > 0 && (
                                    <TableContainer elevation={0} component={Paper} sx={{ marginTop: 2, borderRadius: "8px", maxWidth: 900, placeSelf: "center" }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: "#eeeeee" }}>
                                                    <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>Field</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                <TableRow >
                                                    <TableCell colSpan={2} sx={{ textTransform: "capitalize", fontWeight: "500", color: "gray" }}>
                                                        Name
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedService.fullName}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow >
                                                    <TableCell colSpan={2} sx={{ textTransform: "capitalize", fontWeight: "500", color: "gray" }}>
                                                        Email
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedService.email}
                                                    </TableCell>
                                                </TableRow>

                                                {Object.entries(selectedService.additionalFields).filter(([key]) => key !== "groupedUrls").map(([key, value]) => (


                                                    <TableRow key={key}>
                                                        <TableCell colSpan={2} sx={{ textTransform: "capitalize", fontWeight: "500", color: "gray" }}>
                                                            {key.replace(/([A-Z])/g, ' $1')}
                                                        </TableCell>
                                                        <TableCell>

                                                            {

                                                                key === "customFields" && (value) ? (
                                                                    <Box sx={{ marginTop: "5px" }}>
                                                                        {Array.isArray(value) ? (
                                                                            <Table sx={{ minWidth: 450, maxWidth: 900 }} aria-label="custom fields table">

                                                                                <TableBody>
                                                                                    {value.map((item, index) => (
                                                                                        <TableRow key={index}>
                                                                                            <TableCell sx={{ color: "#333", fontWeight: 500 }}> {index + 1}. {' '} {item.name}</TableCell>
                                                                                            <TableCell sx={{ textAlign: "left", color: "#333", whiteSpace: "pre-line", }}>
                                                                                                {item.value}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        ) : (
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                No service details available.
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                )
                                                                    :
                                                                    Array.isArray(value) && value.every(item => typeof item === "object") ? (
                                                                        value.map((obj, idx) => (
                                                                            <Box key={idx} sx={{ mb: 1 }}>
                                                                                {Object.entries(obj).map(([k, v]) => (
                                                                                    <Typography key={k} variant="body2">
                                                                                        <strong>{k}:</strong> {v?.toString?.() || "N/A"}
                                                                                    </Typography>
                                                                                ))}
                                                                                <Divider sx={{ my: 1 }} />
                                                                            </Box>
                                                                        ))
                                                                    ) :
                                                                        typeof value === "object" ? (
                                                                            <Box>
                                                                                {Object.entries(value).map(([subKey, subVal]) => (
                                                                                    <Typography key={subKey} variant="body2">
                                                                                        <strong>{subKey}:</strong> {subVal?.toString?.() || "N/A"}
                                                                                    </Typography>
                                                                                ))}
                                                                            </Box>
                                                                        ) :
                                                                            (
                                                                                <Typography variant="body2">{value?.toString?.() || "N/A"}</Typography>
                                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}


                                                {Object.entries(selectedService.images).map(([folder, urls], folderIdx) => (
                                                    <TableRow key={urls}>
                                                        <TableCell colSpan={2}>Images</TableCell>
                                                        <TableCell>
                                                            <Box key={folderIdx} sx={{ bgcolor: "#f8f8f8", mb: 2, width: "100%", p: 2 }}>
                                                                <Typography variant="subtitle2" gutterBottom>
                                                                    {folder.replace(/([A-Z])/g, ' $1').trim()}
                                                                </Typography>
                                                                <Grid container spacing={2} sx={{ width: "100%" }}>
                                                                    {urls.map((url, idx) => (
                                                                        <Grid item key={idx} xs={4} sm={3} md={4}>
                                                                            <CardMedia
                                                                                onClick={() => handleImageClick(urls, idx)}  // pass full array + index
                                                                                component="img"
                                                                                height="140"
                                                                                image={url}
                                                                                alt={`${folder} image ${idx + 1}`}
                                                                                sx={{ objectFit: 'cover', width: '100%', borderRadius: 1, cursor: 'pointer' }}
                                                                            />
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}


                                                <TableRow >
                                                    <TableCell colSpan={2}>Adhaar</TableCell>
                                                    <TableCell>
                                                        {selectedService?.fileUrl && (
                                                            <Box sx={{ mt: 2 }}>
                                                                <Typography variant="subtitle2">Attached File</Typography>

                                                                {selectedService?.file?.mimeType === 'application/pdf' ? (
                                                                    <iframe
                                                                        src={selectedService.fileUrl}
                                                                        style={{ width: '100%', height: 400, border: 'none' }}
                                                                        title="PDF Preview"
                                                                    />
                                                                ) : (
                                                                    <a href={selectedService.fileUrl} target="_blank" rel="noopener noreferrer">
                                                                        Download File
                                                                    </a>
                                                                )}
                                                            </Box>
                                                        )}
                                                    </TableCell>
                                                </TableRow>





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
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        boxShadow: 24,
                        borderRadius: 2,
                        overflow: 'hidden',
                    },
                }}
            >
                <DialogContent
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        minHeight: '60vh',
                        padding: 4,
                    }}
                >
                    {/* Close Button */}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Prev Arrow */}
                    <IconButton
                        onClick={handlePrevImage}
                        disabled={currentImageIndex === 0}
                        sx={{
                            position: 'absolute',
                            left: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
                        }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>

                    {/* Image */}
                    {currentImage ? (
                        <img
                            src={currentImage}
                            alt="Preview"
                            style={{
                                height: 400,
                                width: 500,
                                maxHeight: '400px',
                                maxWidth: '100%',
                                borderRadius: '10px',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <Typography color="white">No Image</Typography>
                    )}

                    {/* Next Arrow */}
                    <IconButton
                        onClick={handleNextImage}
                        disabled={currentImageIndex === currentImages.length - 1}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
                        }}
                    >
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


        </Box >
    );
};

export default RequestedServices;
