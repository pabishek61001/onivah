import React, { useRef } from 'react';
import ImageUploader from '../../vendorUtils/ImageUploader';
import axios from 'axios';
import { Button } from '@mui/material';

const Rough3 = () => {
    const formDataRef = useRef(null);

    const handleImageUploadFormData = (formData) => {
        formDataRef.current = formData;

        // Debug: Log FormData contents
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    };

    const handleUploadImagesToServer = async () => {
        const data = formDataRef.current;

        if (!data) {
            alert("No form data to upload. Please upload images first.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:4000/api/s3/upload-images",
                data,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
            alert("All folders uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Error uploading images: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <ImageUploader onFormDataReady={handleImageUploadFormData} />
            <Button
                variant="contained"
                color="success"
                onClick={handleUploadImagesToServer}
                sx={{ ml: 2, mt: 2 }}
            >
                Upload All Images to Server
            </Button>
        </div>
    );
};

export default Rough3;
