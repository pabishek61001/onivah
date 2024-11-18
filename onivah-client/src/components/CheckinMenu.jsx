import React, { useEffect, useState } from 'react';
import { Box, IconButton, Stack, Typography, Button, Tooltip, Menu, useMediaQuery, Chip, TextField, InputAdornment } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const CheckinMenu = ({ onDateSelect, defaultDates }) => {

    useEffect(() => {
        setSelectedDate(defaultDates)
    }, [defaultDates])

    const isMobile = useMediaQuery('(max-width:600px)');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState([]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDelete = (dateToDelete) => {
        setSelectedDate((dates) => dates.filter((date) => date !== dateToDelete));
    };

    const handleClose = () => {
        setAnchorEl(null);
        onDateSelect(selectedDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(newDate);
    };

    const handlePrevious = () => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(newDate);
    };

    const handleDateChange = (date) => {
        const dateString = date.toDateString();
        setSelectedDate((prevSelectedDates) => {
            if (prevSelectedDates.includes(dateString)) {
                return prevSelectedDates.filter(d => d !== dateString);
            } else {
                return [...prevSelectedDates, dateString];
            }
        });

    };

    // Function to set the tile class based on selected dates
    const tileClassName = ({ date }) => {
        const dateString = date.toDateString();
        return selectedDate.includes(dateString) ? 'selected-date' : '';
    };

    const dateHandling = () => {
        onDateSelect(selectedDate);
        setAnchorEl(null);
    }

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', backgroundColor: "white", p: 0.5, borderRadius: 2 }}>
                <Tooltip title="Open Calendar">
                    <TextField
                        variant="outlined"
                        onClick={handleClick}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    {
                                        selectedDate.length > 0 ? <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 400 }}>
                                            Total Days: {selectedDate && selectedDate.length > 0 ? selectedDate.length : "0"}
                                        </Typography> : <Typography variant="body5" sx={{ color: '#666', fontWeight: 400 }}>
                                            Book your dates
                                        </Typography>
                                    }

                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <CalendarTodayIcon sx={{ color: '#007BFF' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-root': {
                                paddingRight: '10px', // Adjust for icon padding
                            },
                        }}
                    />
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{
                    '& .MuiPaper-root': {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        overflowY: "auto"
                    },
                }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 2 }}>
                    <Calendar
                        value={selectedDate.length > 0 ? new Date(selectedDate[selectedDate.length - 1]) : currentDate}
                        onChange={handleDateChange}
                        view="month"
                        maxDetail="month"
                        showNeighboringMonth={false}
                        activeStartDate={currentDate}
                        showDoubleView={!isMobile}
                        tileClassName={tileClassName} // Set the tile class name
                    />
                    <Typography variant='subtitle2' sx={{ color: '#888', fontWeight: "300" }}>
                        Selected Dates :
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 1 }}>
                        {selectedDate.length > 0 ? (
                            selectedDate.map((date, index) => (
                                <Chip
                                    key={index}
                                    label={date}
                                    onDelete={() => handleDelete(date)} // Allows removing a date by clicking the delete icon
                                    color="primary"
                                />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Add dates
                            </Typography>
                        )}
                    </Stack>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Box>
                            <Button onClick={handlePrevious} variant="outlined" size="small">Previous</Button>
                            <Button onClick={handleNext} variant="outlined" size="small">Next</Button>
                        </Box>
                        <Box>
                            <Button onClick={() => dateHandling()} variant="outlined" size="medium">Continue</Button>
                        </Box>
                    </Box>
                </Box>
            </Menu>

        </>
    );
};

export default CheckinMenu;
