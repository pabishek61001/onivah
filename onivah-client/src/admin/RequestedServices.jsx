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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import apiUrl from '../Api/Api';

const RequestedServices = () => {
    const [requestedServices, setRequestedServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequestedServices = async () => {
            try {
                const response = await axios.get(`${apiUrl}/admin/requested-services`);
                setRequestedServices(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching requested services:', error);
                setLoading(false);
            }
        };

        fetchRequestedServices();
    }, []);

    const handleApprove = (id) => {
        // Approve logic here
        console.log('Approved service with ID:', id);
        // Example: Send approve status to backend
        axios.post(`/api/admin/approve-request`, { id })
            .then(() => {
                alert('Service approved successfully!');
            })
            .catch((error) => {
                console.error('Error approving service:', error);
            });
    };

    if (loading) {
        return <Typography variant="h6" align="center">Loading...</Typography>;
    }

    return (
        <Box sx={{ marginTop: 5, padding: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Requested Services
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: 5, padding: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>S.No</strong></TableCell>
                            <TableCell><strong>Full Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requestedServices.map((service, index) => (
                            <>
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{service.fullName}</TableCell>
                                    <TableCell>{service.email}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleApprove(service._id)}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                padding: '6px 12px',
                                                backgroundColor: '#4caf50',
                                                '&:hover': {
                                                    backgroundColor: '#45a045',
                                                },
                                            }}
                                        >
                                            Approve
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={4} sx={{ padding: 0 }}>
                                        <Accordion
                                            sx={{
                                                marginBottom: 0,
                                                boxShadow: 'none',
                                                borderTop: '1px solid #e0e0e0',
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`panel${index}-content`}
                                                id={`panel${index}-header`}
                                                sx={{
                                                    padding: '0 16px',
                                                    backgroundColor: '#f9f9f9',
                                                }}
                                            >
                                                <Typography variant="subtitle1" >
                                                    View Additional Fields
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{ padding: '16px 24px' }}>
                                                {Object.entries(service.additionalFields || {}).length > 0 ? (
                                                    <Grid container spacing={2}>
                                                        {Object.entries(service.additionalFields).map(([key, value]) => (
                                                            <Grid item xs={12} sm={6} key={key}>
                                                                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                                                    <strong style={{ textTransform: "capitalize", fontWeight: "500", color: "gray" }}>
                                                                        {key}:
                                                                    </strong> {value}
                                                                </Typography>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                ) : (
                                                    <Typography variant="body2" sx={{ color: '#757575' }}>
                                                        No additional fields provided.
                                                    </Typography>
                                                )}
                                            </AccordionDetails>

                                        </Accordion>
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


        </Box>
    );
};

export default RequestedServices;
