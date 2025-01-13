import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Box } from '@mui/material';
import CategoryForm from '../vendorUtils/CategoryForm'; // Make sure the path is correct
import VendorHeader from './VendorHeader';
import withLoadingAndError from '../hoc/withLoadingAndError';
import axios from 'axios';
import apiUrl from '../Api/Api';

// Mock function to simulate an API call based on servicename (profileForm)
const getServiceData = async (profileForm) => {
    const data = {
        // photography
        photography: {
            image: 'https://img.freepik.com/premium-photo/photographer-capturing-moments-wedding-ceremony_1158260-58631.jpg?w=1060',
            bio: 'Capture beautiful moments with our professional photography services.',
            fields: [
                {
                    name: 'servicesOffered',
                    label: 'Services Offered',
                    type: 'checkbox',
                    options: [
                        { label: 'Pre-Wedding', value: 'Pre-Wedding' },
                        { label: 'Wedding Photography', value: 'Wedding Photography' },
                        { label: 'Album & Print', value: 'Album & Print' },
                        { label: 'Maternity Photoshoot', value: 'Maternity Photoshoot' },
                        { label: 'Candid', value: 'Candid' },
                        { label: 'Indoor & Outdoor', value: 'Indoor & Outdoor' },
                    ]
                },
                {
                    name: 'priceRange',
                    label: 'Price Range/ hr',
                    type: 'number'
                }
            ]
        },
        // catering
        catering: {
            image: 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            bio: 'Good food to live good life.',
            fields: [
                {
                    name: 'servicesOffered',
                    label: 'Services Offered',
                    type: 'checkbox',
                    options: [
                        { label: 'Full Services Catering', value: 'Full Services Catering' },
                        { label: 'Wedding Catering', value: 'Wedding Catering' },
                        { label: 'Buffet Catering', value: 'Buffet Catering' },
                        { label: 'Corporate Event Catering', value: 'Corporate Event Catering' },
                        { label: 'Social Event Catering', value: 'Social Event Catering' },
                        { label: 'Cocktail Party Catering', value: 'Cocktail Party Catering' }
                    ]
                },
                {
                    name: 'foodType',
                    label: 'Food Type',
                    type: 'checkbox',
                    options: [
                        { label: 'Veg', value: 'Veg' },
                        { label: 'Non-veg', value: 'Non-veg' },
                        { label: 'Vegan', value: 'Vegan' },
                        { label: 'Brahmin', value: 'Brahmin' },
                        { label: 'Jain', value: 'Jain' },
                    ]
                },
                {
                    name: 'minOrders',
                    label: 'Minimum Orders',
                    type: 'number'
                },
                {
                    name: 'maxOrders',
                    label: 'Maximum Orders',
                    type: 'number'
                }
            ]
        },
        // decors
        decors: {
            image: 'https://images.pexels.com/photos/169196/pexels-photo-169196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            bio: 'Capture beautiful moments with our colorful decorations.',
            fields: [
                {
                    name: 'servicesOffered',
                    label: 'Services Offered',
                    type: 'checkbox',
                    options: [
                        { label: 'Stage Decorations', value: 'Stage Decorations' },
                        { label: 'Royal Decorations', value: 'Royal Decorations' },
                        { label: 'Floral Decorations', value: 'Floral Decorations' },
                    ]
                },
                {
                    name: 'priceRange',
                    label: 'Price Range/ hr',
                    type: 'number'
                }
            ]
        },
        // event- planner
        event_planners: {
            image: 'https://images.pexels.com/photos/169196/pexels-photo-169196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            bio: 'We plan to make your day a memorable.',
            fields: [
                {
                    name: 'servicesOffered',
                    label: 'Services Offered',
                    type: 'checkbox',
                    options: [
                        { label: 'Themed Wedding', value: 'Themed Wedding' },
                        { label: 'Destination Wedding', value: 'Destination Wedding' },
                        { label: 'Beach Wedding', value: 'Beach Wedding' },
                    ]
                },
                {
                    name: 'priceRange',
                    label: 'Price Range/day',
                    type: 'number'
                }
            ]
        },

    };
    return data[profileForm] || {
        image: 'path/to/default-image.jpg',
        bio: 'Service not found. Please select a valid service.',
        fields: []
    };
};

const VendorformLayout = ({ setLoading, setError, loading, error }) => {
    const { profileForm } = useParams();  // Get the dynamic parameter from the URL
    const [fields, setFields] = useState([]);
    const [serviceInfo, setServiceInfo] = useState(null);

    useEffect(() => {
        // Fetch service data based on profileForm (e.g., photography)
        const fetchServiceData = async () => {
            const service = await getServiceData(profileForm);
            setServiceInfo(service);
            setFields(service.fields);
        };

        fetchServiceData();
    }, [profileForm]);

    const handleFormSubmit = async (formData) => {
        console.log('Form submitted:', formData);

        try {
            const response = await axios.post(`${apiUrl}/venue-submission`, formData);
            console.log('API Response:', response.data);

            // Show success feedback to the user
            alert('Form submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            // Show error feedback to the user
            alert('There was an error submitting the form. Please try again.');
        }
    };


    return (
        <Box>
            <VendorHeader />
            <Box padding={4} >

                {/* Display service image */}
                {serviceInfo && (
                    <Box mb={3}>
                        <img
                            src={serviceInfo.image}
                            alt={`${profileForm} service`}
                            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                        />
                    </Box>
                )}


                <Typography variant="h4" gutterBottom align='center' color='primary'>
                    {`${profileForm?.charAt(0).toUpperCase() + profileForm.slice(1)}`}
                </Typography>

                {/* Display bio */}
                {/* {serviceInfo && (
                    <Typography variant="body1" paragraph>
                        {serviceInfo.bio}
                    </Typography>
                )} */}

                {
                    loading ? <Typography>Loading...</Typography>
                        :
                        // Render dynamic form 
                        < CategoryForm fields={fields} onSubmit={handleFormSubmit} />
                }
            </Box>
        </Box>
    );
};

export default withLoadingAndError(VendorformLayout);
