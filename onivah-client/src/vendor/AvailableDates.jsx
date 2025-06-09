import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
    Box, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Radio, RadioGroup, FormControlLabel, FormGroup, Checkbox, Stack, Grid
} from "@mui/material";
import { apiUrl } from "../Api/Api";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const statusColors = {
    available: "#4CAF50", // Green
    booked: "#F44336", // Red
    waiting: "#FF9800", // Orange
};

const AvailableDates = () => {

    const { vendor } = useOutletContext();
    const [events, setEvents] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBusinessName, setSelectedBusinessName] = useState(null);

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [pendingFinalSave, setPendingFinalSave] = useState(false);

    // Fetch requested services
    const fetchRequestedServices = async (email) => {
        try {
            const response = await fetch(`${apiUrl}/get/vendor-dashboard/services?email=${email}`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching requested services:", error);
        }
    };

    useEffect(() => {
        if (vendor) {
            fetchRequestedServices(vendor?.email);
        }
    }, [vendor]);

    useEffect(() => {
        if (pendingFinalSave) {
            // Delay slightly to ensure state is synced
            const timer = setTimeout(() => {
                handleFinalSave();
                setPendingFinalSave(false); // Reset
            }, 100); // Short timeout is usually enough

            return () => clearTimeout(timer); // Clean up on unmount
        }
    }, [pendingFinalSave, events]);


    // Handle checkbox selection
    // const handleCheckboxChange = async (category, businessName) => {
    //     setSelectedCategories((prev) => {
    //         const updatedCategories = prev.includes(category)
    //             ? prev.filter((item) => item !== category)
    //             : [...prev, category];

    //         // Open calendar and fetch events when selecting a new category
    //         if (!prev.includes(category)) {
    //             setSelectedCategory(category);
    //             setSelectedBusinessName(businessName);
    //             setOpenCalendar(true);
    //             fetchCategoryDates(category, businessName);
    //         }

    //         return updatedCategories;
    //     });
    // };
    const handleRadioChange = (category, businessName) => {
        setSelectedCategory(category);
        setSelectedBusinessName(businessName);
        setOpenCalendar(true);
        fetchCategoryDates(category, businessName);
    };


    const fetchCategoryDates = async (category, businessName) => {
        try {
            const response = await axios.get(`${apiUrl}/get-category-dates`, {
                params: { category, businessName, email: vendor?.email },
            });

            const { booked = [], waiting = [], available = [] } = response.data;

            const formattedEvents = [
                ...booked.map(date => ({ title: "Booked", start: date, color: "red" })),
                ...waiting.map(date => ({ title: "Waiting", start: date, color: "orange" })),
                // ...available.map(date => ({ title: "Available", start: date, color: "green" }))
            ];

            setEvents(prev => ({ ...prev, [category]: formattedEvents }));

        } catch (error) {
            console.error("Error fetching category dates:", error.response?.data || error.message);
        }
    };


    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
        setOpenDialog(true);
    };

    const handleSaveEvent = () => {
        if (!selectedStatus || !selectedCategory) return;

        setEvents((prevEvents) => {
            const updatedEvents = { ...prevEvents };
            updatedEvents[selectedCategory] = [
                ...(updatedEvents[selectedCategory] || []).filter(event => event.start !== selectedDate),
                {
                    title: selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1),
                    start: selectedDate,
                    businessName: selectedBusinessName,
                    email: vendor?.email
                },
            ];
            return updatedEvents;
        });

        setOpenDialog(false);
        setSelectedStatus("");
        setPendingFinalSave(true);  // ✅ Trigger save after state update
    };




    const handleFinalSave = async () => {

        // handleSaveEvent();

        if (!selectedCategory || !selectedBusinessName || !events[selectedCategory]?.length) {
            console.error("Missing required fields:", { selectedCategory, selectedBusinessName, events });
            return;
        }

        // Construct the categorized dates (booked, waiting, available)
        const categorizedDates = {
            booked: [],
            waiting: [],
            available: []
        };

        events[selectedCategory].forEach(event => {
            if (event.title.toLowerCase() === "booked") {
                categorizedDates.booked.push(event.start);
            } else if (event.title.toLowerCase() === "waiting") {
                categorizedDates.waiting.push(event.start);
            } else if (event.title.toLowerCase() === "available") {
                categorizedDates.available.push(event.start);
            }
        });

        console.log("Sending Data:", {
            category: selectedCategory,
            businessName: selectedBusinessName,
            dates: categorizedDates,
            email: vendor?.email
        });

        try {
            const response = await axios.put(`${apiUrl}/update-category-dates`, {
                category: selectedCategory,
                businessName: selectedBusinessName,
                dates: categorizedDates, // Sending categorized dates
                email: vendor?.email
            });


            setOpenCalendar(false);
            setSelectedCategory(null);
            setSelectedBusinessName(null);
        } catch (error) {
            console.error("Error updating category dates:", error.response?.data || error.message);
        }
    };




    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 3, p: { xs: 1, md: 2 } }}>
            <Paper elevation={0} sx={{ p: 2, textAlign: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">Manage Availability</Typography>
                <Typography variant="body1" color="text.secondary">
                    Select a category to schedule availability.
                </Typography>
            </Paper>

            {/* Category Selection */}
            <Stack direction='column' sx={{ width: "100%", justifyContent: "space-between" }}>
                <FormGroup>
                    {categories.map(({ category, businessName }, index) => {
                        if (typeof category !== "string") return null; // Handle unexpected data

                        const formattedCategory = category
                            .replace(/_/g, " ") // Replace underscores with spaces
                            .replace(/\b\w/g, (char) => char.toUpperCase()); // Convert to Pascal Case

                        return (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Radio
                                        checked={selectedCategory === category}
                                        onChange={() => handleRadioChange(category, businessName)}
                                    />
                                }
                                label={`${formattedCategory} (${businessName || "N/A"})`}
                            />

                        );
                    })}
                </FormGroup>

                {/* <Grid item xs={12} display='flex' justifyContent='flex-end'>
                    <Button size="small" variant="contained" sx={{ mt: 2, display: openCalendar ? 'block' : 'none' }} onClick={handleFinalSave}>
                        Save and Return
                    </Button>
                </Grid> */}
            </Stack>

            {/* Show Calendar When Category is Selected */}
            {openCalendar && selectedCategory && (
                <>
                    <Typography variant="body5" component='div' sx={{ mt: 2, p: 3 }}>
                        Schedule for: {selectedCategory}
                    </Typography>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            start: "prev,next",
                            center: "title",
                            end: "dayGridMonth,dayGridWeek",
                        }}
                        dateClick={handleDateClick}
                        events={events[selectedCategory] || []} // Pass category-specific events
                        height="auto"
                    />
                </>
            )}



            {/* Dialog for Selecting Status */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle>Select Status for {selectedDate}</DialogTitle>
                <DialogContent>
                    <RadioGroup value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        {Object.keys(statusColors).map((status) => (
                            <FormControlLabel
                                key={status}
                                value={status}
                                control={<Radio sx={{ color: statusColors[status] }} />}
                                label={status.charAt(0).toUpperCase() + status.slice(1)}
                            />
                        ))}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleSaveEvent} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AvailableDates;
