import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Paper,
    Fade,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { apiUrl } from "../Api/Api";

const RoughTwo = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async () => {
        if (!password || !confirmPassword) {
            return setMessage("Please fill in all fields.");
        }
        if (password !== confirmPassword) {
            return setMessage("Passwords do not match.");
        }

        try {
            const response = await axios.post(`${apiUrl}/auth/set-password`, {
                password,
            });
            setMessage(response.data.message || "Password updated successfully!");
        } catch (error) {
            setMessage(
                error.response?.data?.error || "Something went wrong. Try again."
            );
        }
    };

    return (
        <Box
            sx={{
                backgroundImage: `url(https://img.freepik.com/free-photo/beautiful-flowers-arrangement_23-2149347306.jpg?uid=R133306793&ga=GA1.1.1773690977.1730112906&semt=ais_hybrid&w=740)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
            }}
        >
            <Fade in timeout={1000}>
                <Paper
                    elevation={4}
                    sx={{
                        maxWidth: 420,
                        width: "100%",
                        borderRadius: 4,
                        p: 4,
                        backdropFilter: "blur(8px)",
                        backgroundColor: "rgba(255,255,255,0.85)",
                        textAlign: "center",
                    }}
                >
                    <Box mb={2}>
                        <Typography variant="h6" fontWeight={500} color="primary" mt={1}>
                            Set Your Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            For your elegant wedding journey with Onivah ✨
                        </Typography>
                    </Box>

                    <TextField
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword((show) => !show)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {message && (
                        <Typography
                            variant="body2"
                            mt={1}
                            color={
                                message.toLowerCase().includes("success")
                                    ? "green"
                                    : "error"
                            }
                        >
                            {message}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 3,
                            backgroundColor: "#b87d9c", // Wedding accent color
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                                backgroundColor: "#a96b8b",
                            },
                        }}
                        onClick={handleSubmit}
                    >
                        Save Password
                    </Button>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mt={2}
                    >
                        Need help? Contact support@onivah.com
                    </Typography>
                </Paper>
            </Fade>
        </Box>
    );
};

export default RoughTwo;
