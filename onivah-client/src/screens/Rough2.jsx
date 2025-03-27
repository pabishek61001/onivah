import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Popover,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import theme from "../Themes/theme";

dayjs.extend(isBetween);

const RoughTwo = () => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectingCheckIn, setSelectingCheckIn] = useState(true);
    const [totalDates, setTotalDates] = useState([]);

    // Close popover when open becomes false
    useEffect(() => {
        if (!open) {
            setAnchorEl(null);
        }
    }, [open]);

    const handleDateChange = (date) => {
        if (selectingCheckIn) {
            setStartDate(date);
            setEndDate(null);
            setSelectingCheckIn(false);
        } else {
            setEndDate(date);

            let start = dayjs(startDate);
            let end = dayjs(date);
            let allDates = [];

            // Generate all dates including start and end
            let currentDate = start;
            while (
                currentDate.isBefore(end, "day") ||
                currentDate.isSame(end, "day")
            ) {
                allDates.push(currentDate.format("YYYY-MM-DD"));
                currentDate = currentDate.add(1, "day");
            }

            console.log("Selected Dates:", allDates);
            setTotalDates(allDates);
            setTimeout(() => setOpen(false), 400);
        }
    };

    const renderCustomDay = (date, selectedDates, pickersDayProps) => {
        const isStart = startDate && dayjs(date).isSame(startDate, "day");
        const isEnd = endDate && dayjs(date).isSame(endDate, "day");
        const isInBetween =
            startDate &&
            endDate &&
            dayjs(date).isBetween(startDate, endDate, "day", "[]");

        return (
            <PickersDay
                {...pickersDayProps}
                sx={{
                    backgroundColor: isStart
                        ? "#ff385c"
                        : isEnd
                            ? "#ff385c"
                            : isInBetween
                                ? "#fde4ea"
                                : "transparent",
                    color: isStart || isEnd ? "#fff" : "inherit",
                    fontWeight: isStart || isEnd ? "bold" : "normal",
                    borderRadius: "50%",
                    "&:hover": {
                        backgroundColor: isStart || isEnd ? "#e31c5f" : "#fde4ea",
                    },
                }}
            />
        );
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, "0")} - ${String(d.getMonth() + 1).padStart(2, "0")} - ${d.getFullYear()}`;
    };


    return (
        <ThemeProvider theme={theme}>
            <TextField
                variant="outlined"
                fullWidth
                label={totalDates.length > 1 ? `Total (${totalDates.length} Days)` : ""}
                value={
                    totalDates.length < 1
                        ? `Book your dates `
                        : ` ${formatDate(startDate)} ${" "} to ${" "} ${formatDate(endDate)} `
                }
                InputProps={{
                    readOnly: true,
                    sx: {
                        color: totalDates.length < 1 ? "grey.600" : "black", // Apply color only to input text
                        fontWeight: totalDates.length < 1 ? 400 : 500,
                    }
                }}
                onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    setOpen(true);
                    setSelectingCheckIn(true);
                }}
                sx={{
                    borderRadius: 5,
                    bgcolor: "white",
                    cursor: "pointer",
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "grey.400" },
                        "&.Mui-focused fieldset": { borderColor: "primary.main" }
                    }
                }}
            />


            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => {
                    setOpen(false);
                    setAnchorEl(null);
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Box sx={{ p: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Typography
                            variant="subtitle1"
                            textAlign="center"
                            fontWeight="bold"
                            gutterBottom
                            sx={{ p: 2 }}
                        >
                            {selectingCheckIn
                                ? "Select Check-in Date"
                                : "Select Check-out Date"}
                        </Typography>
                        <StaticDatePicker
                            displayStaticWrapperAs="desktop"
                            value={selectingCheckIn ? startDate : endDate}
                            onChange={handleDateChange}
                            defaultCalendarMonth={startDate ? dayjs(startDate) : dayjs()}
                            minDate={selectingCheckIn ? dayjs() : startDate}
                            slotProps={{ actionBar: { actions: [] } }}
                            renderDay={renderCustomDay}
                        />
                    </LocalizationProvider>
                    <Box textAlign="center" mt={2}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                setOpen(false);
                                setAnchorEl(null);
                            }}
                            sx={{ fontWeight: "bold" }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </ThemeProvider>
    );
};

export default RoughTwo;
