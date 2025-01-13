import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiUrl from "../Api/Api";

const ProtectedRoute = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("onivah_token");

        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Access Denied",
                text: "Kindly login again."
            });
            navigate("/");
            return;
        }

        const fetchProtectedData = async () => {
            try {
                const response = await fetch(`${apiUrl}/protected-route`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json(); // Capture the error message from response
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Token Expired !Login Again"
                    });
                    navigate("/");
                    return;
                }

                const data = await response.json();
                setUserData(data.user);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Token Expired !Login Again"
                });
                navigate("/"); // Redirect to login if token validation fails
            }
        };

        fetchProtectedData();
    }, [navigate]);

    return userData ? React.cloneElement(children, { userData }) : null;
};

export default ProtectedRoute;
