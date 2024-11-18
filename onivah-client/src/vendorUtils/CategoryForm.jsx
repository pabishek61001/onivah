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

const DynamicForm = ({ fields, onSubmit }) => {
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

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
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
                    <Box>
                        <Typography variant="h6">Confirm Details:</Typography>
                        <pre>{JSON.stringify(formData, null, 2)}</pre>
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
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        )}
                    </Box>
                </form>
            </Grid>
        </Box>
    );
};

export default DynamicForm;
