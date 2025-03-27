import React, { useEffect, useState } from "react";
import {
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    Container,
    InputAdornment,
    Checkbox,
    Paper,
    IconButton,
    Autocomplete,
    CircularProgress
} from "@mui/material";
import {
    Phone,
    Email,
    LocationOn,
    Business,
    AccountBox,
    Shield,
    AddCircleOutline,
} from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import withLoadingAndError from "../hoc/withLoadingAndError";
import { styled } from "@mui/material/styles";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from '@mui/material';
import axios from "axios";

const Input = styled("input")({
    display: "none",
});


const DynamicForm = ({ fields, onSubmit, setLoading, setError, loading, error }) => {

    const [locations, setLocations] = useState([]); // Store fetched locations

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
                    country: 'India',
                    state: 'Tamil Nadu'
                });
                setLocations(response.data.data || []);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchCities();
    }, []);
    const [images, setImages] = useState([]);


    const [formData, setFormData] = useState({
        fullName: "",
        lastName: "",
        email: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        businessName: "",
        gstNumber: "",
        aadharNumber: "",
        availableLocations: [], // Change from "" to []
    });
    console.log(formData);

    const [activeStep, setActiveStep] = useState(0);

    const steps = ["Personal Information", "Business Details", "Confirmation"];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle location selection
    const handleLocationChange = (event, newValue) => {
        setFormData({ ...formData, availableLocations: newValue }); // Store as an array
    };

    const handleAadharChange = (e) => {
        let value = e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
        setFormData({ ...formData, aadharNumber: value });
    };

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phone: value });
    };

    const handleCheckbox = (e) => {
        const { name, value, checked } = e.target;
        const options = formData[name] || [];
        setFormData({
            ...formData,
            [name]: checked
                ? [...options, value]
                : options.filter((option) => option !== value),
        });
    };

    const handleNext = () => {
        if (validateFields(activeStep)) {
            if (activeStep < steps.length - 1) {
                setActiveStep((prevStep) => prevStep + 1);
            }
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const validateFields = (step) => {
        let isValid = true;
        const errorMessages = [];

        if (step === 0) {
            // Validate fields for Step 0
            const requiredFields = [
                "fullName",
                "lastName",
                "email",
                "phone",
                "addressLine1",
                "country",
                "city",
                "state",
                "pincode",
            ];
            requiredFields.forEach((field) => {
                if (!formData[field] || formData[field].trim() === "") {
                    isValid = false;
                    errorMessages.push(`${field} is required`);
                }
            });
        } else if (step === 1) {
            // Validate fields for Step 1
            const requiredFields = [
                "businessName",
                "gstNumber",
                "aadharNumber",
                "availableLocations",
            ];

            requiredFields.forEach((field) => {
                if (!formData[field] ||
                    (typeof formData[field] === "string" && formData[field].trim() === "") ||
                    (Array.isArray(formData[field]) && formData[field].length === 0)) {
                    isValid = false;
                    errorMessages.push(`${field} is required`);
                }
            });

            if (!images || images.length === 0) {
                isValid = false;
                errorMessages.push(`Upload Images!`);
            }
        }


        if (!isValid) {
            alert(errorMessages.join("\n")); // Show all errors in an alert box
        }
        return isValid;
    };


    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = [];
        const formData = new FormData();

        files.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert to Base64

            reader.onload = () => {
                const base64Data = reader.result.split(",")[1]; // Extract Base64 data

                const imageObject = {
                    file,
                    preview: URL.createObjectURL(file),
                    base64: base64Data, // Store Base64 string
                };

                newImages.push(imageObject);

                // Store images in FormData
                formData.append("images", file);
                formData.append("base64Images", base64Data);

                // Update state only after processing all files
                if (newImages.length === files.length) {
                    setImages((prevImages) => [...prevImages, ...newImages]);

                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        images: [...(prevFormData.images || []), ...newImages],
                    }));
                }
            };
        });
    };


    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));

        // Remove the image from formData as well
        setFormData((prevFormData) => ({
            ...prevFormData,
            images: prevFormData.images?.filter((_, i) => i !== index) || [],
        }));
    };



    const handleSubmit = (e) => {
        if (activeStep === steps.length - 1) {
            onSubmit(formData);
        }
    };


    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="fullName"
                                    label="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountBox />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="lastName"
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="email"
                                    label="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <PhoneInput
                                    country="in"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    inputStyle={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="addressLine1"
                                    label="Address Line 1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOn />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="addressLine2"
                                    label="Address Line 2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="country"
                                    label="Country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="city"
                                    label="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="state"
                                    label="State"
                                    value={formData.state}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="pincode"
                                    label="Pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                    </>
                );
            case 1:
                return (
                    <Box sx={{ p: 4, mx: "auto", bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>

                        <Grid container spacing={3}>
                            {/* Business Details */}
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="businessName"
                                    label="Business Name"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Business />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="gstNumber"
                                    label="GST Number"
                                    value={formData.gstNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Shield />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="aadharNumber"
                                    label="Aadhar Number"
                                    value={formData.aadharNumber}
                                    onChange={handleAadharChange}
                                    fullWidth
                                    required
                                    inputProps={{ maxLength: 14 }}
                                />
                            </Grid>

                            <Grid item xs={12} >
                                <Autocomplete
                                    multiple
                                    options={locations}
                                    getOptionLabel={(option) => option}
                                    value={formData.availableLocations} // Now it's an array
                                    onChange={handleLocationChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Available Locations" placeholder="Select locations..." fullWidth required />
                                    )}
                                />
                            </Grid>

                            {/* Additional Fields */}
                            {fields.map((field) => (
                                <Grid item xs={12} sm={field.type === "textarea" ? 6 : 6} key={field.name}>
                                    {field.type === "checkbox" ? (
                                        <Box sx={{ p: 1, border: "1px solid #ddd", borderRadius: 2 }}>
                                            <Typography variant="body1" fontWeight="bold">
                                                {field.label}
                                            </Typography>
                                            {field.options.map((option) => (

                                                <Box key={option.value} sx={{ display: "flex", alignItems: "center", }}>
                                                    <Checkbox
                                                        name={field.name}
                                                        value={option.value}
                                                        onChange={handleCheckbox}
                                                        required
                                                    />
                                                    <Typography variant="body2">{option.label}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <TextField
                                            name={field.name}
                                            label={field.label}
                                            type={field.type === "textarea" ? "text" : field.type}
                                            multiline={field.type === "textarea"}
                                            rows={field.type === "textarea" ? 4 : 1}
                                            fullWidth
                                            required
                                            onChange={handleChange}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </Grid>

                        {/* Image Upload Section */}
                        <Box sx={{ mt: 4, p: 3, bgcolor: "#f7f9fc", borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Upload Images
                            </Typography>

                            <Grid container spacing={2} alignItems="center">
                                {/* Show uploaded images first */}
                                {images.map((image, index) => (
                                    <Grid item xs={6} sm={4} md={3} key={index}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                position: "relative",
                                                overflow: "hidden",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            <img
                                                src={image.preview}
                                                alt={`Uploaded ${index}`}
                                                style={{
                                                    width: "100%",
                                                    height: 120,
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            {/* Delete Button */}
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    position: "absolute",
                                                    top: 5,
                                                    right: 5,
                                                    backgroundColor: "rgba(0,0,0,0.5)",
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                                                }}
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Paper>
                                    </Grid>
                                ))}

                                {/* Add Image Button should always be last */}
                                <Grid item xs={6} sm={4} md={3}>
                                    <label htmlFor="image-upload">
                                        <Input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                        />
                                        <Paper
                                            elevation={4}
                                            sx={{
                                                width: 150,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                height: 120,
                                                borderRadius: "12px",
                                                border: "2px dashed #bbb",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease-in-out",
                                                backgroundColor: "#f9f9f9",
                                                "&:hover": {
                                                    borderColor: "#007bff",
                                                    backgroundColor: "#f1f7ff",
                                                },
                                                "&:active": {
                                                    backgroundColor: "#e0ebff",
                                                },
                                            }}
                                        >
                                            <AddCircleOutline fontSize="large" color="primary" />
                                        </Paper>
                                    </label>
                                </Grid>
                            </Grid>
                        </Box>


                    </Box>

                );

            case 2:
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // p: 2,
                            backgroundColor: '#f9fafb', // Light background for contrast
                            minHeight: '100vh', // Full-screen height for centering
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                width: '100%',
                                maxWidth: 900, // Restrict width for better readability
                                p: 2,
                                borderRadius: 4,
                            }}
                        >
                            {/* <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    color: '#4b769f',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    textTransform: 'capitalize',
                                }}
                            >
                                Confirm Details
                            </Typography> */}

                            {/* <Grid container spacing={3}>
                                {Object.entries(formData).map(([key, value]) => (
                                    <Grid item xs={12} sm={4} key={key}>
                                        <Box
                                            sx={{
                                                backgroundColor: '#f8f8f8', // Light background for contrast
                                                borderRadius: 2,
                                                p: 2,
                                                boxShadow: 0, // Subtle card effect
                                                border: '1px solid #ddd',
                                            }}
                                        >
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: '#4b769f',
                                                    mb: 0.5,
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                                            </Typography>

                                            {key === "images" && Array.isArray(value) ? (
                                                <Grid container spacing={1}>
                                                    {value.map((image, index) => (
                                                        <Grid item xs={6} sm={4} key={index}>
                                                            <Box
                                                                component="img"
                                                                src={image.preview}
                                                                alt={`Uploaded ${index}`}
                                                                sx={{
                                                                    width: '100%',
                                                                    height: '100px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: 1,
                                                                    border: '1px solid #ddd',
                                                                }}
                                                            />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: value ? '#333' : '#999',
                                                        fontStyle: value ? 'normal' : 'italic',
                                                    }}
                                                >
                                                    {value ? value.toString() : 'N/A'}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid> */}

                            <TableContainer elevation={0} component={Paper} >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#4b769f' }}>Field</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#4b769f' }}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.entries(formData).map(([key, value]) => (
                                            <TableRow key={key}>
                                                <TableCell sx={{ textTransform: 'capitalize', fontWeight: 700 }}>
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </TableCell>
                                                <TableCell>
                                                    {key === "images" && Array.isArray(value) ? (
                                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                            {value.map((image, index) => (
                                                                <Box
                                                                    component="img"
                                                                    key={index}
                                                                    src={image.preview}
                                                                    alt={`Uploaded ${index}`}
                                                                    sx={{
                                                                        width: 60,
                                                                        height: 60,
                                                                        objectFit: 'cover',
                                                                        borderRadius: 1,
                                                                        border: '1px solid #ddd',
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    ) : (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: value ? '#333' : '#999',
                                                                fontStyle: value ? 'normal' : 'italic',
                                                            }}
                                                        >
                                                            {value ? value.toString() : 'N/A'}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>


                        </Paper>
                    </Box>

                );
            default:
                return null;
        }
    };

    return (
        <Box>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {
                loading ? (
                    <Typography variant="body1" align="center" sx={{ p: 3 }}>Loading ...</Typography>
                )
                    :

                    <Grid sx={{ mt: 5 }}>
                        <form >
                            {renderStepContent(activeStep)}
                            <Box display="flex" justifyContent="space-between" mt={3}>
                                {activeStep > 0 && (
                                    <Button variant="contained" onClick={handleBack}>
                                        Back
                                    </Button>
                                )}
                                {activeStep < steps.length - 1 ? (
                                    <Button variant="contained" color="primary" onClick={handleNext}>
                                        Next
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
                                        Submit
                                    </Button>
                                )}
                            </Box>
                        </form>
                    </Grid>

            }
        </Box>
    );
};

export default withLoadingAndError(DynamicForm);
