import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Grid,
    Paper,
    Typography
} from '@mui/material';

const galleryData = {
    All: [
        'https://cdn.pixabay.com/photo/2023/09/26/06/45/bride-8276620_1280.jpg',
        'https://cdn.pixabay.com/photo/2024/04/27/01/12/couple-8722786_1280.jpg',
        'https://cdn.pixabay.com/photo/2016/12/01/08/19/bride-1874655_1280.jpg',
    ],
    Party: [
        'https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg',
        'https://cdn.pixabay.com/photo/2021/12/11/07/59/hotel-6862159_1280.jpg',
    ],
    Reception: [
        'https://cdn.pixabay.com/photo/2016/11/23/17/56/beach-1854076_1280.jpg',
        'https://cdn.pixabay.com/photo/2022/01/10/04/37/event-6927353_1280.jpg',
    ],
    Cakes: [
        'https://cdn.pixabay.com/photo/2025/03/06/08/25/blueberries-9450130_1280.jpg',
        'https://cdn.pixabay.com/photo/2020/12/09/04/07/wedding-5816361_1280.jpg',
    ],
    Decor: [
        'https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg',
        'https://cdn.pixabay.com/photo/2022/11/18/14/00/christmas-tree-7600201_1280.jpg',
    ],
};

const GallerySection = () => {
    const [tab, setTab] = useState('All');

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Box sx={{ py: 6, px: 2 }}>
            <Box
                sx={{
                    backgroundColor: '#f3eaff',
                    px: 3,
                    py: 6,
                    maxWidth: '1280px',
                    mx: 'auto',
                    borderRadius: 3,
                    gap: { xs: 5, md: 10 },
                }}
            >

                <Typography
                    textAlign="center"
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: 4,
                        color: '#5c3d77'
                    }}
                    data-aos='fade-up'
                >
                    Wedding Gallery
                </Typography>

                <Box data-aos='fade-up' sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        textColor="primary"
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile // <- Important for mobile
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 2,
                            boxShadow: 2,
                            overflow: 'auto', // ensures scroll works
                            '& .MuiTabs-scrollButtons': {
                                display: 'flex', // ensures arrows are shown
                            },
                        }}
                    >
                        {Object.keys(galleryData).map((category) => (
                            <Tab key={category} label={category} value={category} />
                        ))}
                    </Tabs>

                </Box>

                <Grid data-aos='fade-up' container spacing={3} justifyContent="center">
                    {galleryData[tab].map((img, index) => (
                        <Grid item xs={6} sm={6} md={4} key={index}>

                            <img
                                src={img}
                                alt={`gallery-img-${index}`}
                                style={{
                                    height: { xs: 200, md: 200 },
                                    width: '100%',
                                    objectFit: 'cover',
                                    borderRadius: 10,
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default GallerySection;
