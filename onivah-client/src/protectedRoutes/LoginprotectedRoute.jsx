import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiUrl } from "../Api/Api";
import axios from "axios";
import ReusableSnackbar from "../utils/ReusableSnackbar";
import { Box, CircularProgress } from "@mui/material"; // Optional loading spinner

const ProtectedRoute = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    console.log(document.cookie);

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/protected-route`, {
                    withCredentials: true,
                    validateStatus: status => status === 200 || status === 401,
                });

                if (response.status === 401) {
                    setSnackbar({
                        open: true,
                        message: "Kindly Login to continue!.",
                        severity: "warning",
                    });
                    navigate("/")
                    return;
                }

                setUserData(response.data.user);
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: "Unexpected error occurred. Please try again.",
                    severity: "warning",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProtectedData();
    }, [navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {userData ? React.cloneElement(children, { userData }) : null}
            <ReusableSnackbar
                open={snackbar.open}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </>
    );
};

export default ProtectedRoute;
