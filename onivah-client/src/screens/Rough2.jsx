import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const Rough2 = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (newDate) => {
        if (endDate && newDate.isAfter(endDate)) {
            alert('Start date must be before End date.');
            return;
        }
        setStartDate(newDate);
        console.log('Start Date:', newDate?.format('YYYY-MM-DD'));
    };

    const handleEndDateChange = (newDate) => {
        if (startDate && newDate.isBefore(startDate)) {
            alert('End date must be after Start date.');
            return;
        }
        setEndDate(newDate);
        console.log('End Date:', newDate?.format('YYYY-MM-DD'));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    disableFuture
                />
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    disableFuture
                    minDate={startDate} // End date should be greater than or equal to start date
                />
            </Box>
        </LocalizationProvider>
    );
};

export default Rough2;
