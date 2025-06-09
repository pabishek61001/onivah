// FeedbackSection.jsx
import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Rating,
    Paper,
    Snackbar,
    Alert,
} from "@mui/material";

export default function FeedbackSection() {
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (rating === 0) {
            setError("Please select a star rating before submitting.");
            return;
        }

        try {
            //     const response = await fetch("/api/feedback", {
            //         method: "POST",
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify({ rating, feedback: feedbackText }),
            //     });

            // if (response.ok) {
            setSubmitted(true);
            setRating(0);
            setFeedbackText("");
            // }
        } catch (err) {
            console.error("Error submitting feedback:", err);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                p: 4,
                maxWidth: 600,
                width: "100%"
            }}
        >
            <Typography variant="h5" fontWeight={600} mb={2}>
                We’d Love Your Feedback
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" mb={3}>
                How was your experience? Rate us and help improve our service.
            </Typography>

            <Box mb={2}>
                <Rating
                    name="feedback-rating"
                    value={rating}
                    size="large"
                    onChange={(_, newValue) => setRating(newValue)}
                />
            </Box>

            <TextField
                multiline
                rows={4}
                fullWidth
                placeholder="Leave your feedback here (optional)"
                variant="outlined"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                sx={{ mb: 3 }}
            />

            <Button
                variant="contained"
                size="small"
                onClick={handleSubmit}
                sx={{
                    display: "block",
                    borderRadius: 3,
                    textTransform: "none",
                    width: "100%",
                    maxWidth: 200,
                    placeSelf: "end",
                }}
            >
                Submit Feedback
            </Button>

            <Snackbar
                open={submitted}
                autoHideDuration={4000}
                onClose={() => setSubmitted(false)}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    Thank you for your feedback!
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!error}
                autoHideDuration={4000}
                onClose={() => setError("")}
            >
                <Alert severity="error" sx={{ width: "100%" }}>
                    {error}
                </Alert>
            </Snackbar>
        </Paper>
    );
}
