import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminProtected = ({ children }) => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('admin_token'); // Check for token in sessionStorage

    // If the token doesn't exist, redirect to the login page
    useEffect(() => {
        if (!token) {
            navigate("/admin-login"); // Navigate to login if token doesn't exist
        }
    }, [token, navigate]);

    // If the token exists, render the children (the component passed as a prop)
    return token ? children : null; // We return null until the redirect happens
};

export default AdminProtected;
