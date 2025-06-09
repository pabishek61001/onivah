import React, { useEffect, useRef, useState } from "react";
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
    CircularProgress,
    Alert,
    Divider,
    Card,
    CardMedia,
    CardContent,
    Stack,
    ListItem,
    ListItemIcon,
    ListItemText,
    List,
    Radio,
    FormControl,
    RadioGroup
} from "@mui/material";
import {
    Phone,
    Email,
    LocationOn,
    Business,
    AccountBox,
    Shield,
    AddCircleOutline,
    Description,
    Add,
    NavigateBefore,
    NavigateNext,
    FiberManualRecord,
    ShoppingBag,
} from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import withLoadingAndError from "../hoc/withLoadingAndError";
import { styled } from "@mui/material/styles";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from '@mui/material';
import axios from "axios";
import { apiUrl } from "../Api/Api";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import ImageUploader from "./ImageUploader";
import ReusableSnackbar from "../utils/ReusableSnackbar";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import WhyChooseUsGenerator from "./WhyChooseUsGenerator";

const Input = styled("input")({
    display: "none",
});

const lightBackgrounds = [
    '#f9f9f9',
    '#f4f8fb',
    '#fef7f1',
    '#f5f5f5',
    '#f0f9f4',
    '#fff8e1',
    '#f3e5f5',
];



const DynamicForm = ({ fields, onSubmit, setLoading, setError, loading, error }) => {

    const formDataRef = useRef(null);

    const { vendor } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Read the `tab` query param from URL
    const searchParams = new URLSearchParams(location.search);
    const initialTab = parseInt(searchParams.get('tab')) || 0;

    const [imageFolders, setImageFolders] = useState([
        {
            id: Date.now(), // unique id for this folder
            folderName: "CoverImage",
            images: [],
        },
    ]);
    const [locations, setLocations] = useState([]); // Store fetched locations

    const [isCoverImageValid, setIsCoverImageValid] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

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
    const [isCoverImageEmpty, setIsCoverImageEmpty] = useState(false);


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
        description: "",
        gstNumber: "",
        aadharNumber: "",
        availableLocations: [], // Change from "" to []
    });

    useEffect(() => {
        const savedPreferences = localStorage.getItem("vd_preferences");
        if (savedPreferences) {
            const prefs = JSON.parse(savedPreferences);

            const getValidValue = (prefVal, currentVal) => {
                return prefVal && prefVal.trim() !== "" ? prefVal : currentVal;
            };

            setFormData((prev) => ({
                ...prev,
                fullName: getValidValue(prefs.firstName, prev.fullName),
                lastName: getValidValue(prefs.lastName, prev.lastName),
                addressLine1: getValidValue(prefs.addressLine1, prev.addressLine1),
                addressLine2: getValidValue(prefs.addressLine2, prev.addressLine2),
                city: getValidValue(prefs.city, prev.city),
                state: getValidValue(prefs.state, prev.state),
                country: getValidValue(prefs.country, prev.country),
                pincode: getValidValue(prefs.pincode, prev.pincode),
                // you can also initialize other fields if stored in prefs
            }));
        } else {
            console.warn("No preferences found in localStorage.");
        }
    }, []); // run only once on mount

    // Populate formData when vendor loads
    useEffect(() => {
        if (vendor) {
            setFormData((prev) => ({
                ...prev,
                email: vendor.email || "",
                phone: vendor.phone ? String(vendor.phone) : "",
            }));
        }
    }, [vendor]);


    const [customFields, setCustomFields] = useState([]);
    const [customPricing, setCustomPricing] = useState([{ name: "", value: null }]);
    const [generatedWhyUs, setGeneratedWhyUs] = useState([]);

    const [activeStep, setActiveStep] = useState(initialTab);

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

    const handleAddCustomField = () => {
        setCustomFields([...customFields, { name: "", value: "" }]);
    };

    const handleAddCustomPricingField = () => {
        setCustomPricing([...customPricing, { name: "", value: null }]);
    };

    const handleCustomFieldChange = (index, key, newValue) => {
        const updatedFields = [...customFields];
        updatedFields[index][key] = newValue;
        setCustomFields(updatedFields);
    };

    const handleCustomPricingChange = (index, key, newValue) => {
        setCustomPricing((prev) => {
            const updatedFields = [...prev];
            updatedFields[index] = {
                ...updatedFields[index],
                [key]: key === "value" ? Number(newValue) : newValue
            };
            return updatedFields;
        });
    };

    const [selectedOption, setSelectedOption] = useState("");

    const handlePricingCheckBox = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleNext = () => {
        if (validateFields(activeStep)) {
            if (activeStep < steps.length - 1) {
                const nextStep = activeStep + 1;
                setActiveStep(nextStep);

                // ✅ Update URL with new tab step
                const newSearchParams = new URLSearchParams(location.search);
                newSearchParams.set('tab', nextStep);
                navigate({ search: newSearchParams.toString() }, { replace: true });
            }
        }
    };

    const handleBack = () => {
        const prevStep = activeStep - 1;
        setActiveStep(prevStep);

        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.set('tab', prevStep);
        navigate({ search: newSearchParams.toString() }, { replace: true });
    };

    let isValid = true;
    const errorMessages = [];

    const validateFields = (step) => {

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
                "description",
                "aadharNumber",
                "availableLocations",
            ];
            requiredFields.forEach((field) => {
                if (!formData[field] ||
                    (typeof formData[field] === "string" && formData[field].trim() === "") ||
                    (Array.isArray(formData[field]) && formData[field].length === 0)) {
                    isValid = false;
                    errorMessages.push(`${field.replace(/([A-Z])/g, ' $1')} is required`);
                }
            });
            if (!isCoverImageEmpty) {
                isValid = false;
                errorMessages.push(`Upload Cover Image!`);
            }

            const isCustomPricingEmpty = customPricing.some((item) => {
                const nameEmpty = typeof item.name !== "string" || item.name.trim() === "";
                const valueEmpty =
                    item.value === null ||
                    (typeof item.value === "string" && item.value.trim() === "") ||
                    (typeof item.value === "number" && item.value === 0);

                // console.log("Incomplete entry:", nameEmpty || valueEmpty);
                return nameEmpty || valueEmpty;
            });

            if (isCustomPricingEmpty) {
                isValid = false;
                errorMessages.push("Pricing must be filled!");
            }


        }
        if (!isValid) {
            setSnackbar({
                open: true,
                message: errorMessages[0],  // show only the first error
                severity: 'error',
            });

        }
        return isValid;
    };




    const handleSubmit = async (e) => {

        if (activeStep === steps.length - 1) {
            const data = formDataRef.current;

            if (!data) {
                alert("No form data to upload. Please upload images first.");
                return;
            }

            try {
                // 🔥 Upload images first
                const response = await axios.post(
                    "http://localhost:4000/api/s3/upload-images",
                    data,
                    {
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );

                const { groupedUrls } = response.data; // ✅ Get uploaded image URLs

                const finalData = {
                    ...formData,
                    customPricing,
                    customFields,
                    generatedWhyUs,
                    file, // raw file object
                    groupedUrls
                };
                console.log(finalData);
                onSubmit(finalData);

            } catch (error) {
                console.error("Upload error:", error);
                alert("Error uploading images: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const MAX_KB = 10;

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            const fileSizeKB = selected.size / 1024;
            if (fileSizeKB < MAX_KB) {
                setError(`File must be at least ${MAX_KB}KB.`);
                setFile(null);
                setPreviewUrl('');
            } else {
                setError('');
                setFile(selected);
                const fileURL = URL.createObjectURL(selected);
                setPreviewUrl(fileURL);
            }
        }
    };


    const handleImageUploadFormData = (formData) => {
        formDataRef.current = formData;

        let folderMap = null;

        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
            if (key === "folderMap") {
                try {
                    folderMap = JSON.parse(value);

                } catch (err) {
                    console.error("Invalid folderMap JSON:", err);
                }
            }
        }

        // Validate CoverImage folder
        const hasCoverImage = folderMap?.some(
            item => item.folderName === "CoverImage"
        );

        setIsCoverImageValid(!!hasCoverImage); // true if found, false if not
    };

    const handleFolderReceive = (folders) => {
        setImages(folders)
        if (folders.length > 0 && folders[0].images.length === 0) {
            setIsCoverImageEmpty(false);
        } else {
            setIsCoverImageEmpty(true);
        }
    };

    const [showAll, setShowAll] = useState(false);
    const detailsRef = useRef(null);

    const scrollToDetails = () => {
        setShowAll(true);
        setTimeout(() => {
            detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // slight delay to allow render
    };

    const handleGeneratedReasons = (reasons) => {
        console.log('Generated Reasons:', reasons);
        setGeneratedWhyUs(reasons); // Store in state
    };


    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <Grid container spacing={3} sx={{ p: 2 }}>
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
                            {/* <Grid item xs={12} md={4}>
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
                            </Grid> */}
                            {/* <Grid item xs={12} md={4}>
                                <PhoneInput
                                    country="in"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    inputStyle={{ width: "100%" }}
                                />
                            </Grid> */}
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

                            <Grid item xs={12} md={12}>

                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    align="left"
                                    color="textSecondary"
                                    sx={{
                                        borderLeft: 4,
                                        borderColor: "purple",
                                        bgcolor: "#fcfaff",
                                        px: 2,
                                        py: 1,
                                        fontSize: "0.8rem",
                                        borderRadius: 1,
                                        fontStyle: "italic",
                                        userSelect: "none",
                                        width: "fit-content"
                                    }}
                                >
                                    Note: The above details are business holders current info (such as location, address and name as in id proof). *
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
                );
            case 1:
                return (
                    <Box sx={{ p: 4, mx: "auto", bgcolor: "background.paper", borderRadius: 2, boxShadow: 0 }}>

                        <Grid container spacing={3}>

                            <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>Business Info</Typography>

                            {/* Business Proof */}

                            <Grid container spacing={3} sx={{ mb: 2, p: 2 }}>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="gstNumber"
                                        label="GST Number"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        fullWidth
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

                                {/* doc upload */}
                                <Grid item xs={12} md={4} display='flex' justifyContent='center' alignItems='center'>
                                    <Button variant="outlined" component="label">
                                        Upload Adhaar
                                        <input type="file" required hidden onChange={handleFileChange} />
                                    </Button>
                                    {file && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Selected: {file.name}
                                        </Typography>
                                    )}
                                </Grid>
                                {error && (
                                    <Grid item>
                                        <Alert severity="error">{error}</Alert>
                                    </Grid>
                                )}
                                {previewUrl && (
                                    <Grid item>
                                        {file?.type.includes('image') ? (
                                            <img src={previewUrl} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }} />
                                        ) : file?.type === 'application/pdf' ? (
                                            <iframe
                                                src={previewUrl}
                                                title="PDF Preview"
                                                width="100%"
                                                height="200"
                                                style={{ border: '1px solid #ccc' }}
                                            />
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">No preview available</Typography>
                                        )}
                                    </Grid>
                                )}

                            </Grid>

                            <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>Business details</Typography>

                            {/* Business details */}

                            <Grid container spacing={3} sx={{ mb: 2, p: 2 }}>

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

                                <Grid item xs={12} md={8} >
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

                                <Grid item xs={12} >
                                    <TextField
                                        name="description"
                                        label="Business Description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        fullWidth
                                        multiline
                                        rows={5}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Description />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>



                                {/* Additional Fields */}
                                {/* {fields.map((field) => (
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
                                ))} */}

                            </Grid>

                            {/* custom pricing */}
                            <Grid item xs={12} >

                                <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f8f8", width: "100%", }}>

                                    <Stack direction={{ xs: "column", sm: "row", bgcolor: "#f8f8f8", }} justifyContent='space-between' alignItems={{ xs: 'end', md: 'center' }} spacing={2}>

                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                                Add Custom Pricing
                                            </Typography>
                                            <Typography variant="body5" component='div' color="textSecondary" sx={{ maxWidth: 600 }} gutterBottom>
                                                This is the field where you can showcase your pricing and you can give the descriptions of the pricings in the below section
                                            </Typography>
                                        </Box>

                                        <Button
                                            startIcon={<Add />}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddCustomPricingField}
                                            sx={{ mb: 2 }}
                                        >
                                            Add
                                        </Button>
                                    </Stack>


                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        {customPricing.map((field, index) => (
                                            <React.Fragment key={index}>
                                                <Grid item xs={12} sm={5}>
                                                    <TextField
                                                        sx={{ bgcolor: "white" }}
                                                        label={`Pricing ${index + 1}`}
                                                        value={field.name}
                                                        fullWidth
                                                        placeholder=' Basic Plan'
                                                        onChange={(e) =>
                                                            handleCustomPricingChange(index, "name", e.target.value)
                                                        }
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={5}>
                                                    <TextField
                                                        sx={{ bgcolor: "white" }}
                                                        label={`Amount ${index + 1}`}
                                                        value={field.value}
                                                        fullWidth
                                                        placeholder='4000'
                                                        type="number"
                                                        onChange={(e) =>
                                                            handleCustomPricingChange(index, "value", e.target.value)
                                                        }
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2} sx={{ display: "flex", alignItems: "center" }}>
                                                    <IconButton
                                                        onClick={() => {
                                                            const updated = [...customPricing];
                                                            updated.splice(index, 1);
                                                            setCustomPricing(updated);
                                                        }}
                                                        color="grey"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                    </Grid>
                                </Paper>
                            </Grid>


                            {/* custom fields */}
                            <Grid item xs={12} >

                                <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f8f8", width: "100%", }}>

                                    <Stack direction={{ xs: "column", sm: "row", bgcolor: "#f8f8f8", }} justifyContent='space-between' alignItems={{ xs: 'end', md: 'center' }} spacing={2}>

                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                                Add Custom Fields
                                            </Typography>
                                            <Typography variant="body5" color="textSecondary" gutterBottom>
                                                Add fields with custom values to boost your profile
                                            </Typography>
                                        </Box>

                                        <Button
                                            startIcon={<Add />}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddCustomField}
                                            sx={{ mb: 2 }}
                                        >
                                            Add
                                        </Button>
                                    </Stack>


                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        {customFields.map((field, index) => (
                                            <React.Fragment key={index}>
                                                <Grid item xs={12} sm={5}>
                                                    <TextField
                                                        sx={{ bgcolor: "white" }}
                                                        label="Field Name"
                                                        value={field.name}
                                                        fullWidth
                                                        placeholder=' Ex . Wedding Cost'
                                                        onChange={(e) =>
                                                            handleCustomFieldChange(index, "name", e.target.value)
                                                        }
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={5}>
                                                    <TextField
                                                        sx={{ bgcolor: "white" }}
                                                        label="Field Value"
                                                        value={field.value}
                                                        fullWidth
                                                        placeholder='Ex . ₹4000'
                                                        multiline
                                                        onChange={(e) =>
                                                            handleCustomFieldChange(index, "value", e.target.value)
                                                        }
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={2} sx={{ display: "flex", alignItems: "center" }}>
                                                    <IconButton
                                                        onClick={() => {
                                                            const updated = [...customFields];
                                                            updated.splice(index, 1);
                                                            setCustomFields(updated);
                                                        }}
                                                        color="grey"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* why us generator */}
                            <Grid item xs={12} >
                                <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f8f8", width: "100%", }}>

                                    <Stack direction={{ xs: "column", sm: "column", bgcolor: "#f8f8f8", }} justifyContent='space-between' alignItems={{ xs: 'end', md: 'self-start' }} spacing={2}>

                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                                Generate Why Us
                                            </Typography>
                                            <Typography variant="body5" color="textSecondary" gutterBottom>
                                                Add fields with custom values to boost your profile
                                            </Typography>
                                        </Box>

                                        {/* <Grid container spacing={2} sx={{ mt: 2 }}> */}
                                        {/* Generator Component */}
                                        <WhyChooseUsGenerator
                                            description={formData?.description || "We offer professional wedding services tailored to your special day."}
                                            customPricing={customPricing}
                                            customFields={customFields}
                                            onGenerate={handleGeneratedReasons}
                                        />
                                        {/* </Grid> */}
                                    </Stack>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} >
                                <ImageUploader onFormDataReady={handleImageUploadFormData} sendFoldersToParent={handleFolderReceive} imageFolders={imageFolders} setImageFolders={setImageFolders} />
                            </Grid>

                        </Grid>
                    </Box >

                );

            case 2:
                return (

                    < Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f9fafb', // Light background for contrast
                            minHeight: '100vh', // Full-screen height for centering
                            padding: 2,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                width: '100%',
                                // maxWidth: 1200, // Restrict width for better readability
                                p: { xs: 1, md: 3 },
                                borderRadius: 4,
                                backgroundColor: '#fff',
                            }}
                        >
                            {/* Product Title */}
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#4b769f',
                                    textAlign: 'left',
                                    marginBottom: 3,
                                }}
                            >
                                {formData?.businessName || 'Product Name'}
                            </Typography>

                            {/* Product Images Section */}
                            <Grid container spacing={3} justifyContent="center">
                                <Grid item xs={12} lg={6}>
                                    <Grid container spacing={2}> {/* This is needed! */}
                                        {/* Render CoverImage first */}
                                        {imageFolders
                                            .filter(folder => folder.folderName === "CoverImage" && folder.images.length > 0)
                                            .map(folder => (
                                                <Grid item xs={12} key={`cover-${folder.id}`}>
                                                    <Box sx={{ position: "relative" }}>
                                                        <img
                                                            src={folder.images[0].base64Preview}
                                                            alt="Cover"
                                                            style={{
                                                                width: "100%",
                                                                height: "350px",
                                                                objectFit: "cover",
                                                                borderRadius: "8px",
                                                            }}
                                                        />
                                                    </Box>
                                                </Grid>
                                            ))}

                                        {/* Render other folders */}
                                        {imageFolders
                                            .filter(folder => folder.folderName !== "CoverImage")
                                            .flatMap(folder =>
                                                folder.images.slice(0, 2).map((img, idx) => (
                                                    <Grid item xs={6} sm={4} md={3} key={`${folder.id}-${idx}`}>
                                                        <Box
                                                            sx={{
                                                                borderRadius: 2,
                                                                overflow: "hidden",
                                                                boxShadow: 1,
                                                                height: "100px",
                                                            }}
                                                        >
                                                            <img
                                                                src={img.base64Preview}
                                                                alt={`img-${idx}`}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                ))
                                            )}

                                    </Grid>
                                </Grid>


                                {/* Product Details */}
                                <Grid item xs={12} lg={6}>
                                    <CardContent>
                                        {/* Product Description */}
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4b769f' }}>
                                            Description
                                        </Typography>
                                        <Typography variant="subtitle2" color="textSecondary" sx={{ marginBottom: 2 }}>
                                            {formData?.description || 'This is a placeholder description for the product.'}
                                        </Typography>


                                        {/* Custom Fields Section */}
                                        {/* {customFields.length > 0 && (
                                            <>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: '#4b769f',
                                                        mb: 2,
                                                    }}
                                                >
                                                    Additional Information
                                                </Typography>

                                                <Box sx={{ display: 'grid', gap: 2 }}>
                                                    {customFields.map((field, index) => (
                                                        <Paper
                                                            key={index}
                                                            elevation={0}
                                                            sx={{
                                                                backgroundColor: lightBackgrounds[index % lightBackgrounds.length],
                                                                p: 2,
                                                                borderRadius: 2,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 'bold',
                                                                    color: 'text.primary',
                                                                    mb: 1,
                                                                }}
                                                            >
                                                                {field?.name || `Custom Field ${index + 1}`}
                                                            </Typography>

                                                            {field?.value?.split('.').filter(point => point.trim()).length > 1 ? (
                                                                <List
                                                                    dense
                                                                    sx={{
                                                                        pl: 2,
                                                                        '& .MuiListItem-root': { py: 0.5 },
                                                                    }}
                                                                >
                                                                    {field.value.split('.').map((point, idx) =>
                                                                        point.trim() ? (
                                                                            <ListItem key={idx} disableGutters>
                                                                                <ListItemIcon sx={{ minWidth: 24 }}>
                                                                                    <FiberManualRecord sx={{ fontSize: '0.5rem', color: 'primary.main' }} />
                                                                                </ListItemIcon>
                                                                                <ListItemText
                                                                                    primary={point.trim()}
                                                                                    primaryTypographyProps={{
                                                                                        fontStyle: 'italic',
                                                                                        fontSize: '0.9rem',
                                                                                        color: 'text.secondary',
                                                                                    }}
                                                                                />
                                                                            </ListItem>
                                                                        ) : null
                                                                    )}
                                                                </List>
                                                            ) : (
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: 'text.secondary',
                                                                        fontSize: '0.9rem',
                                                                        fontStyle: 'italic',
                                                                        ml: 1,
                                                                    }}
                                                                >
                                                                    {field?.value || 'N/A'}
                                                                </Typography>
                                                            )}
                                                        </Paper>
                                                    ))}
                                                </Box>
                                            </>
                                        )} */}

                                        {customFields.length > 0 && (
                                            <Box sx={{ display: 'grid', gap: 2 }}>
                                                {/* Show only the first custom field */}
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        backgroundColor: lightBackgrounds[0],
                                                        // p: 2,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}
                                                    >
                                                        {customFields[0]?.name || 'Custom Field 1'}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            fontSize: '0.9rem',
                                                            fontStyle: 'italic',
                                                            ml: 1,
                                                        }}
                                                    >
                                                        {truncateValue(customFields[0]?.value)}

                                                        {customFields.length > 1 && (
                                                            // <Box sx={{ textAlign: 'center' }}>
                                                            <Button variant="text" sx={{ ml: 3 }} size="small" onClick={scrollToDetails}>
                                                                View More
                                                            </Button>
                                                            // </Bsox>
                                                        )}
                                                    </Typography>


                                                </Paper>

                                                {/* View More Button */}

                                            </Box>
                                        )}


                                        {/* Action Buttons */}
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                                            <Button startIcon={<ShoppingBag />} variant="outlined" color="primary">
                                                Add to Cart
                                            </Button>
                                            <Button endIcon={<ShoppingCart />} variant="contained" color="primary">
                                                Book Now
                                            </Button>
                                        </Box>

                                        {/* Product Price */}
                                        {/* <Box sx={{ my: 4 }}>
                                            <Typography variant="caption" color="textSecondary" component='div' gutterBottom sx={{ fontWeight: 600, textAlign: "left", mb: 3 }}>
                                                Choose Your Package
                                            </Typography>

                                            <FormControl component="fieldset" fullWidth>
                                                <RadioGroup value={selectedOption} onChange={handlePricingCheckBox}>
                                                    <Box
                                                        sx={{
                                                            display: "grid",
                                                            // gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                                                            gap: 2,
                                                        }}
                                                    >
                                                        {customPricing.map((option, index) => (
                                                            <Card
                                                                key={index}
                                                                variant="outlined"
                                                                sx={{
                                                                    backgroundColor: lightBackgrounds[index % lightBackgrounds.length], // Cycle through the soft colors
                                                                    borderColor: selectedOption === option.value ? "primary.main" : "grey.300",
                                                                    boxShadow: selectedOption === option.value ? 4 : 0,
                                                                    transition: "0.3s",
                                                                    borderRadius: 3,
                                                                    "&:hover": {
                                                                        boxShadow: 3,
                                                                        cursor: "pointer",
                                                                    },
                                                                }}
                                                            >
                                                                <CardContent
                                                                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                                                                    onClick={() => setSelectedOption(option.value)}
                                                                >
                                                                    <Radio
                                                                        value={option.value}
                                                                        checked={selectedOption === option.value}
                                                                        onChange={handlePricingCheckBox}
                                                                        sx={{
                                                                            color: "primary.main",
                                                                            "&.Mui-checked": {
                                                                                color: "#D88B7D", // Rose gold accent
                                                                            },
                                                                        }}
                                                                    />
                                                                    <Box>
                                                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                                            {option.name}
                                                                        </Typography>
                                                                        {option.amount && (
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                ₹{option.amount}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </Box>
                                                </RadioGroup>
                                            </FormControl>
                                        </Box> */}





                                    </CardContent>
                                </Grid>
                            </Grid>

                            <Box sx={{ my: 4 }}>
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    component="div"
                                    gutterBottom
                                    sx={{ fontWeight: 600, textAlign: "left", mb: 3 }}
                                >
                                    Choose Your Package
                                </Typography>

                                <Box
                                    sx={{
                                        width: "100%",
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",       // 1 column on mobile
                                            sm: "1fr 1fr",   // 2 columns on small screens
                                            md: "1fr 1fr 1fr" // 3 columns on medium and larger
                                        },
                                        gap: 2,
                                    }}
                                >
                                    {customPricing.map((option, index) => {
                                        const isSelected = selectedOption === option.value;
                                        return (
                                            <Card
                                                key={index}
                                                onClick={() => setSelectedOption(option.value)}
                                                sx={{
                                                    backgroundColor: lightBackgrounds[index % lightBackgrounds.length],
                                                    border: isSelected ? "2px solid #D88B7D" : "1px solid #ccc",
                                                    boxShadow: isSelected ? 6 : 1,
                                                    transition: "0.3s",
                                                    borderRadius: 3,
                                                    cursor: "pointer",
                                                    position: "relative",
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                        {option.name}
                                                    </Typography>
                                                    {option.value && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            ₹{option.value}
                                                        </Typography>
                                                    )}

                                                    {isSelected && (
                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                top: 12,
                                                                right: 12,
                                                                width: 24,
                                                                height: 24,
                                                                bgcolor: "#D88B7D",
                                                                color: "#fff",
                                                                borderRadius: "50%",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                fontSize: "1rem",
                                                            }}
                                                        >
                                                            ✓
                                                        </Box>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </Box>
                            </Box>


                            {customFields.length > 0 && (
                                <Grid container spacing={3} ref={detailsRef} sx={{ mt: 4 }}>
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 'bold', color: '#4b769f', }}
                                        >
                                            Additional Information
                                        </Typography>
                                    </Grid>

                                    {customFields.map((field, index) => (
                                        <Grid item xs={12} md={6} key={index}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    backgroundColor: lightBackgrounds[index % lightBackgrounds.length],
                                                    p: 2,
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}
                                                >
                                                    {field?.name || `Custom Field ${index + 1}`}
                                                </Typography>

                                                {field?.value?.split('.').filter(v => v.trim()).length > 1 ? (
                                                    <List dense sx={{ pl: 2 }}>
                                                        {field.value.split('.').map((point, idx) =>
                                                            point.trim() ? (
                                                                <ListItem key={idx} disableGutters>
                                                                    <ListItemIcon sx={{ minWidth: 24 }}>
                                                                        <FiberManualRecord sx={{ fontSize: '0.5rem', color: 'primary.main' }} />
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary={point.trim()}
                                                                        primaryTypographyProps={{
                                                                            fontStyle: 'italic',
                                                                            fontSize: '0.9rem',
                                                                            color: 'text.secondary',
                                                                        }}
                                                                    />
                                                                </ListItem>
                                                            ) : null
                                                        )}
                                                    </List>
                                                ) : (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            fontSize: '0.9rem',
                                                            fontStyle: 'italic',
                                                            ml: 1,
                                                        }}
                                                    >
                                                        {field?.value || 'N/A'}
                                                    </Typography>
                                                )}
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}


                            {/* Product Category */}
                            <Divider sx={{ marginY: 3 }} />
                            {/* <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4b769f' }}>
                                Category
                            </Typography>
                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                {formData?.category || 'Default Category'}
                            </Typography> */}
                        </Paper>
                    </Box >
                );
            default:
                return null;
        }
    };


    const truncateValue = (text) => {
        if (!text) return 'N/A';
        const firstSentence = text.split('.')[0];
        return firstSentence.length > 100 ? firstSentence.slice(0, 100) + '...' : firstSentence + '...';
    };


    return (
        <Box>


            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>
                            <Typography
                                sx={{
                                    typography: {
                                        xs: 'caption',   // Smaller text on mobile
                                        md: 'body2',     // Default size on tablets and up
                                    },
                                    textAlign: 'center',
                                }}
                            >
                                {label}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            {
                loading ? (
                    <Typography variant="body1" align="center" sx={{ p: 3 }}>Loading ...</Typography>
                )
                    :

                    <Grid sx={{ mt: 5 }}>

                        <Grid item sx={{ display: activeStep === 0 ? 'flex' : "none" }} xs={12} mb={4} display='flex' alignItems='end' justifyContent='end'>

                            <Button
                                size="small"
                                sx={{ textAlign: "end", mr: 2 }}
                                variant="outlined"
                                onClick={() => navigate('/vendor-dashboard/settings')}
                            >
                                Add Address
                            </Button>


                            <Button
                                size="small"
                                sx={{ textAlign: "end", boxShadow: 0 }}
                                variant="contained"
                                onClick={() => {
                                    const savedPreferences = localStorage.getItem('vd_preferences');
                                    if (savedPreferences) {
                                        const prefs = JSON.parse(savedPreferences);

                                        const getValidValue = (prefVal, currentVal) => {
                                            return prefVal && prefVal.trim() !== '' ? prefVal : currentVal;
                                        };

                                        setFormData(prev => ({
                                            ...prev,
                                            fullName: getValidValue(prefs.firstName, prev.fullName),
                                            lastName: getValidValue(prefs.lastName, prev.lastName),
                                            addressLine1: getValidValue(prefs.addressLine1, prev.addressLine1),
                                            addressLine2: getValidValue(prefs.addressLine2, prev.addressLine2),
                                            city: getValidValue(prefs.city, prev.city),
                                            state: getValidValue(prefs.state, prev.state),
                                            country: getValidValue(prefs.country, prev.country),
                                            pincode: getValidValue(prefs.pincode, prev.pincode),
                                        }));

                                    } else {
                                        console.warn('No preferences found in localStorage.');
                                    }
                                }}
                            >
                                Use Existing Address
                            </Button>
                        </Grid>


                        <form >
                            {renderStepContent(activeStep)}
                            <Box display="flex" justifyContent={activeStep === 0 ? "end" : "space-between"} mt={3}>
                                {activeStep > 0 && (
                                    <Button startIcon={<NavigateBefore />} size="medium" variant="outlined" onClick={handleBack}>
                                        Back
                                    </Button>
                                )}
                                {activeStep === 0 ? (
                                    <Button endIcon={<NavigateNext />} size="medium" variant="contained" color="primary" onClick={handleNext}>
                                        Next
                                    </Button>
                                ) : activeStep === 1 ? (
                                    <Button size="medium" variant="contained" color="primary" onClick={handleNext}>
                                        Preview
                                    </Button>
                                ) : (
                                    <Button size="medium" variant="contained" color="primary" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                )}

                            </Box>
                        </form>
                    </Grid>

            }

            <ReusableSnackbar
                open={snackbar.open}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </Box >
    );
};

export default withLoadingAndError(DynamicForm);
