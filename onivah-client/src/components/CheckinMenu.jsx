import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Divider,
    IconButton,
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
import Close from "@mui/icons-material/Close";

dayjs.extend(isBetween);

const CheckinMenu = ({ onDateSelect, defaultDates }) => {


    useEffect(() => {
        if (defaultDates && defaultDates.length > 0) {
            setStartDate(dayjs(defaultDates[0]));
            setEndDate(dayjs(defaultDates[defaultDates.length - 1]));
            setTotalDates(defaultDates);
        }
    }, [defaultDates]);



    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectingCheckIn, setSelectingCheckIn] = useState(true);
    const [totalDates, setTotalDates] = useState([]);

    const handleClose = () => {
        setAnchorEl(null);
        // onDateSelect(selectedDate);
    };



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

            let currentDate = start;
            while (currentDate.isBefore(end, "day") || currentDate.isSame(end, "day")) {
                allDates.push(currentDate.format("YYYY-MM-DD"));
                currentDate = currentDate.add(1, "day");
            }

            console.log("Selected Dates:", allDates);
            setTotalDates(allDates);

            // **Pass the selected dates back to the parent**
            onDateSelect(allDates);

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

    // const formatDate = (date) => {
    //     if (!date) return "";
    //     const d = new Date(date);
    //     return `${String(d.getDate()).padStart(2, "0")} - ${String(d.getMonth() + 1).padStart(2, "0")} - ${d.getFullYear()}`;
    // };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short", // gives 'Dec'
            year: "numeric",
        });
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
                        "&:hover": {
                            cursor: "pointer", // Pointer on hover
                        },
                        "& fieldset": { borderColor: "grey.400" },
                        "&.Mui-focused fieldset": { borderColor: "primary.main" }
                    }
                }}
            />

            {/* <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={2}
                sx={{ mb: 3 }}
            >
                <TextField
                    variant="outlined"
                    fullWidth
                    label="Check-in"
                    value={startDate ? formatDate(startDate) : "Select a date"}
                    InputProps={{
                        readOnly: true,
                        sx: {
                            color: startDate ? "black" : "grey.600",
                            fontWeight: startDate ? 500 : 400,
                        },
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
                            "&:hover": { cursor: "pointer" },
                            "& fieldset": { borderColor: "grey.400" },
                            "&.Mui-focused fieldset": { borderColor: "primary.main" },
                        },
                    }}
                />

                <TextField
                    variant="outlined"
                    fullWidth
                    label="Check-out"
                    value={endDate ? formatDate(endDate) : "Select a date"}
                    InputProps={{
                        readOnly: true,
                        sx: {
                            color: endDate ? "black" : "grey.600",
                            fontWeight: endDate ? 500 : 400,
                        },
                    }}
                    onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setOpen(true);
                        setSelectingCheckIn(false);
                    }}
                    sx={{
                        borderRadius: 5,
                        bgcolor: "white",
                        cursor: "pointer",
                        "& .MuiOutlinedInput-root": {
                            "&:hover": { cursor: "pointer" },
                            "& fieldset": { borderColor: "grey.400" },
                            "&.Mui-focused fieldset": { borderColor: "primary.main" },
                        },
                    }}
                />
            </Box> */}


            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => {
                    setOpen(false);
                    setAnchorEl(null);
                    onDateSelect(totalDates); // Ensure selected dates persist on close
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >

                {/* Close Icon at Top-Right */}
                <IconButton
                    onClick={() => {
                        setOpen(false);
                        setAnchorEl(null);
                    }}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "grey.700",
                    }}
                >
                    <Close />
                </IconButton>

                {/* Content Goes Here */}
                <Typography variant="subtitle1" textAlign="left" fontWeight="bold" gutterBottom sx={{ p: 2 }}>
                    {selectingCheckIn ? "Select Check-in Date" : "Select Check-out Date"}
                </Typography>

                <Box sx={{ p: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

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

                    {/* Display Selected Dates */}
                    <Box
                        textAlign="center"
                        mt={2}
                        p={2}
                        sx={{
                            backgroundColor: "#fcf7ff", // Light background
                            borderRadius: 4, // Rounded corners
                            border: `1px solid #dddd`,
                            display: "flex",
                            flexDirection: "row", // Arrange items in a row
                            alignItems: "center",
                            justifyContent: "space-around", // Space between check-in and check-out
                            gap: 3,
                        }}
                    >
                        {/* Check-in Section */}
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="body5" fontWeight="bold" color="primary">
                                🏨 Check-in
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                                {startDate ? dayjs(startDate).format("DD MMM YYYY") : " -- Select --"}
                            </Typography>
                        </Box>

                        {/* Divider */}
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "#ccc", height: "40px" }} />

                        {/* Check-out Section */}
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="body5" fontWeight="bold" color="secondary">
                                🏡 Check-out
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                                {endDate ? dayjs(endDate).format("DD MMM YYYY") : " -- Select --"}
                            </Typography>
                        </Box>
                    </Box>



                    {/* <Box textAlign="center" mt={2}>
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
                    </Box> */}
                </Box>
            </Popover>
        </ThemeProvider>
    );
};

export default CheckinMenu;
