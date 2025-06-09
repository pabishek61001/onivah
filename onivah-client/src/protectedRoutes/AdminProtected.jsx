import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import adminAxios from '../Api/Api';

const AdminProtected = ({ children }) => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('admin_token');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminData, setAdminData] = useState(null);

    const fetchAdminData = async () => {
        try {
            const res = await adminAxios.get("/admin-protected");
            return res.data;
        } catch (err) {
            console.log("Access denied or session expired", err);
            throw err;
        }
    };
    console.log(adminData);

    useEffect(() => {
        if (!token) {
            navigate("/admin-login");
        } else {
            fetchAdminData()
                .then((data) => {
                    setAdminData(data.data.admin); // admin object
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    sessionStorage.removeItem('admin_token');
                    navigate("/admin-login");
                });
        }
    }, [token, navigate]);

    if (!isAuthenticated) return null;

    return React.cloneElement(children, { adminData }); // ✅ Pass adminData as prop
};

export default AdminProtected;
