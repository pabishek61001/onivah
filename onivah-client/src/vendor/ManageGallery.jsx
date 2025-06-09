import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { apiUrl } from '../Api/Api';
import { useOutletContext } from 'react-router-dom';
import {
    Box, Radio, RadioGroup, FormControlLabel, Typography,
    Grid, Card, CardMedia, Divider, Button, TextField,
    IconButton, CardActions, Dialog, DialogTitle, DialogActions, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageManager from '../vendorUtils/ImageManager';

const ManageGallery = () => {
    const { vendor } = useOutletContext();
    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [selectedService, setSelectedService] = useState(null);

    console.log(selectedService);
    const [imageFolders, setImageFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });
    const [deletedImages, setDeletedImages] = useState([]);
    const formDataRef = useRef(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get(`${apiUrl}/vendor/fetch/${vendor.email}/images`);
                if (res.data.success) {
                    console.log(res.data.services);
                    setServices(res.data.services);
                }
            } catch (error) {
                console.log('Failed to fetch gallery images', error);
            }
        };

        if (vendor?.vendorId) fetchImages();
    }, [vendor]);

    useEffect(() => {
        const savedFolders = localStorage.getItem("vendorImageFolders");
        if (savedFolders) {
            setImageFolders(JSON.parse(savedFolders));
        }
    }, []);

    const handleRadioChange = (e) => {
        const selectedId = e.target.value;
        setSelectedServiceId(selectedId);
        const service = services.find(s => s._id === selectedId);
        setSelectedService(service);
        setImageFolders([]);
        setDeletedImages([]);
        formDataRef.current = null;
        localStorage.removeItem("vendorImageFolders");
    };


    return (
        <Box>
            <Paper elevation={0} sx={{ p: 2, mt: 3, textAlign: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">Manage Gallery</Typography>
                <Typography variant="body1" color="text.secondary">
                    Select a service to manage gallery.
                </Typography>
            </Paper>
            <RadioGroup value={selectedServiceId} onChange={handleRadioChange} sx={{ p: 2 }}>
                {services.map((service) => {
                    if (typeof service.category !== "string") return null; // Handle unexpected data

                    const formattedCategory = service.category
                        .replace(/_/g, " ") // Replace underscores with spaces
                        .replace(/\b\w/g, (char) => char.toUpperCase()); // Convert to Pascal Case


                    return (
                        <FormControlLabel
                            key={service._id}
                            value={service._id}
                            control={<Radio />}
                            label={`${formattedCategory} (${service.additionalFields.businessName || "N/A"})`}
                        // label={service.additionalFields.businessName || 'Unnamed Service'}
                        />
                    )
                })}
            </RadioGroup>

            {selectedService && (

                <ImageManager initialImagesFromDB={selectedService.images} vendor={vendor} category={selectedService.category} categoryId={selectedServiceId} />


            )}

        </Box>
    );
};

export default ManageGallery;
