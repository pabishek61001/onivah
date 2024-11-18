import React from 'react';
import {
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    InputAdornment,
    Container,
} from '@mui/material';
import { Phone, Email, LocationOn, Business, AccountBox, Shield } from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const steps = ['Complete Your Bio', 'Profile', 'Final Stage'];

const Rough = ({ fields }) => {
    const [formData, setFormData] = React.useState({
        fullName: '',
        lastName: '',
        businessName: '',
        gstNumber: '',
        aadharNumber: '',
        email: '',
        phone: '',
        dialCode: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        availableLocations: '',
    });

    const [activeStep, setActiveStep] = React.useState(0);

    // Handle change in form fields
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAadharChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        setFormData({ ...formData, aadharNumber: value });
    };

    const handlePhoneChange = (value, country) => {
        setFormData({ ...formData, phone: value, dialCode: country.dialCode });
    };

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // onSubmit(formData);
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                name="fullName"
                                label="Full Name"
                                value={formData.fullName || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
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
                                value={formData.lastName || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                name="businessName"
                                label="Business Name"
                                value={formData.businessName || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
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
                                value={formData.gstNumber || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
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
                                value={formData.aadharNumber || ''}
                                onChange={(e) => handleAadharChange(e)}
                                fullWidth
                                inputProps={{
                                    maxLength: 14,
                                }}
                                inputMode='numeric'
                                variant="outlined"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                name="email"
                                label="Email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                type="email"
                                fullWidth
                                variant="outlined"
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

                        <Grid item xs={12} md={4} className='category-phone'>
                            <PhoneInput
                                country={'in'} // Default country set to India (IN)
                                value={formData.phone}  // Bind value to the state
                                onChange={handlePhoneChange}
                                inputStyle={{
                                    padding: "auto 300px !important"
                                }}
                                inputMode="numeric"
                                inputProps={{
                                    required: true,
                                    autoFocus: true
                                }}

                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                name="pincode"
                                label="Pincode"
                                value={formData.pincode || ''}
                                onChange={handleChange}
                                type="number"
                                fullWidth
                                variant="outlined"
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="addressLine1"
                                label="Address Line 1"
                                value={formData.addressLine1 || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
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

                        <Grid item xs={12}>
                            <TextField
                                name="addressLine2"
                                label="Address Line 2"
                                value={formData.addressLine2 || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                name="country"
                                label="Country"
                                value={formData.country || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                name="city"
                                label="City"
                                value={formData.city || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                name="state"
                                label="State"
                                value={formData.state || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                name="availableLocations"
                                label="Available Locations"
                                value={formData.availableLocations || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                name="businessName"
                                label="Business Name"
                                value={formData.businessName || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
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
                                value={formData.gstNumber || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
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
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3}>
                        {fields && fields.map((field) => (
                            <Grid item xs={12} sm={field.type === 'textarea' ? 12 : 4} key={field.name}>
                                <TextField
                                    name={field.name}
                                    label={field.label}
                                    type={field.type === 'textarea' ? 'text' : field.type}
                                    multiline={field.type === 'textarea'}
                                    rows={field.type === 'textarea' ? 4 : 1}
                                    fullWidth
                                    variant="outlined"
                                    onChange={handleChange}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md">
            <Box padding={3} boxShadow={3} borderRadius={3} bgcolor="background.paper">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <form onSubmit={handleSubmit}>
                    <Box mt={3}>{renderStepContent(activeStep)}</Box>
                    <Box mt={3} display="flex" justifyContent="space-between">
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            variant="outlined"
                            color="secondary"
                        >
                            Back
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Box mt={3} display="flex" justifyContent="center">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    sx={{
                                        borderRadius: 50,
                                        padding: '12px 24px',
                                        boxShadow: 3,
                                    }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        ) : (
                            <Button onClick={handleNext} variant="contained" color="primary">
                                Next
                            </Button>
                        )}
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default Rough;
