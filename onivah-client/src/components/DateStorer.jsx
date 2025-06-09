import { Box, useMediaQuery } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { addDays, eachDayOfInterval, format } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateStorer = ({ onDateChange, bookedDates }) => {

    const disabledDates = bookedDates.map(date => new Date(date));

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))

    // Get existing customerChoice data from localStorage
    const customerChoiceRaw = localStorage.getItem('customerChoice');
    let parsedChoice = { location: '', category: '', datesChoosed: [] };

    try {
        if (customerChoiceRaw) {
            parsedChoice = JSON.parse(customerChoiceRaw);
        }
    } catch (error) {
        console.error("Failed to parse localStorage data:", error);
    }


    // Setup default dates
    const defaultStartDate = parsedChoice.datesChoosed?.[0]
        ? new Date(parsedChoice.datesChoosed[0])
        : new Date();

    const defaultEndDate = parsedChoice.datesChoosed?.[1]
        ? new Date(parsedChoice.datesChoosed?.[parsedChoice.datesChoosed.length - 1])
        : new Date();

    const [state, setState] = useState([
        {
            startDate: defaultStartDate,
            endDate: defaultEndDate,
            key: 'selection',
        }
    ]);


    // Handle date selection change
    const handleDateChange = (item) => {
        const newSelection = item.selection;
        setState([newSelection]);

        // Create array of all selected dates between start and end
        const fullDateRange = eachDayOfInterval({
            start: newSelection.startDate,
            end: newSelection.endDate,
        }).map(date => format(date, 'yyyy-MM-dd'));

        // Update only datesChoosed in localStorage
        const updatedChoice = {
            ...parsedChoice,
            datesChoosed: fullDateRange,
        };

        onDateChange(updatedChoice)
        localStorage.setItem('customerChoice', JSON.stringify(updatedChoice));
    };

    const notedDates = [
        { date: '2025-04-25', note: 'Special Day' },
        { date: '2025-04-28', note: 'Offer Ends' }
    ];


    return (
        <Box
            sx={{
                p: { xs: 3, md: 0 },
                borderRadius: 2,
            }}
        >
            <DateRange
                editableDateInputs={true}
                showSelectionPreview={true}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                ranges={state}
                months={isMobile ? 1 : 2}
                minDate={new Date()} // ✅ This disables past dates
                direction="horizontal"
                disabledDates={disabledDates}
                rangeColors={[deepPurple[400]]} // 🔵 Set your highlight color

            />
        </Box>
    );
};

export default DateStorer;
