import React from "react";
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
} from "@mui/material";
import {
    Phone,
    Email,
    LocationOn,
    Business,
    AccountBox,
    Shield,
} from "@mui/icons-material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import withLoadingAndError from "../hoc/withLoadingAndError";

const DynamicForm = ({ fields, onSubmit, setLoading, setError, loading, error }) => {
    const [formData, setFormData] = React.useState({
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
        availableLocations: "",
    });

    const [activeStep, setActiveStep] = React.useState(0);

    const steps = ["Personal Information", "Business Details", "Confirmation"];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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
            setActiveStep((prevStep) => prevStep + 1);
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
                if (!formData[field] || formData[field].trim() === "") {
                    isValid = false;
                    errorMessages.push(`${field} is required`);
                }
            });
            // Validate dynamic fields
            // fields.forEach((field) => {
            //     if (!formData[field.name] || formData[field.name].trim() === "") {
            //         isValid = false;
            //         errorMessages.push(`${field.label} is required`);
            //     }
            // });
        }

        if (!isValid) {
            alert(errorMessages.join("\n")); // Show all errors in an alert box
        }
        return isValid;
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        // setLoading(true);
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
                    <>
                        <Grid container spacing={3}>
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
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="availableLocations"
                                    label="Available Locations"
                                    value={formData.availableLocations}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            {fields.map((field) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={field.type === "textarea" ? 12 : 4}
                                    key={field.name}
                                >
                                    {field.type === "checkbox" ? (
                                        <div>
                                            <label>{field.label}</label>
                                            {field.options.map((option) => (
                                                <div key={option.value}>
                                                    <Checkbox
                                                        name={field.name}
                                                        value={option.value}
                                                        onChange={handleCheckbox}
                                                        required
                                                    />
                                                    <label>{option.label}</label>
                                                </div>
                                            ))}
                                        </div>
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
                    </>
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
                                maxWidth: 1200, // Restrict width for better readability
                                p: 5,
                                borderRadius: 4,
                                boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.2)', // Softer shadow for depth
                                backgroundColor: '#ffffff',
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    color: '#4b769f',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Confirm Details
                            </Typography>
                            <Grid container spacing={3}>
                                {Object.entries(formData).map(([key, value]) => (
                                    <Grid item xs={12} sm={4} key={key}>
                                        <Box
                                            sx={{
                                                backgroundColor: '#f9f4f9', // Light background for contrast
                                                borderRadius: 2,
                                                p: 2,
                                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Subtle card effect
                                            }}
                                        >
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    // fontWeight: 'bold',
                                                    color: '#4b769f',
                                                    mb: 0.5,
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: value ? '#333' : '#999',
                                                    fontStyle: value ? 'normal' : 'italic',
                                                }}
                                            >
                                                {value ? value.toString() : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
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
                        <form onSubmit={handleSubmit}>
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
                                    <Button variant="contained" color="primary" type="submit" >
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
