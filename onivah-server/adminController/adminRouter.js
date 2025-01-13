import express from "express";
import nodemailer from "nodemailer"
import vendor from "../database/vendors.js";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import ContactForm from "../database/contactForm.js";
import RequestedService from "../database/requestedService.js";
import userTable from "../database/userTable.js";
import VendorsTable from "../database/VendorTable.js";
import AdminTable from "../database/adminTable.js";
import bcrypt from "bcrypt";



const adminRouter = express.Router();

const transporter = nodemailer.createTransport({
    service: "Gmail", // Replace with your email service provider, or use custom SMTP settings
    tls: {
        rejectUnauthorized: false,
    },
    auth: {
        user: "pabishek61001@gmail.com", // Replace with your email address
        pass: "frau isgz jtkt gebe", // Replace with your email password or use environment variables
    },
});


// user contact form retrieve in admin
adminRouter.get('/get/contacts', async (req, res) => {
    try {
        const contacts = await ContactForm.find();
        res.json(contacts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

// admin inbox mark as read
adminRouter.put('/contacts/:id/mark-read', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const contact = await ContactForm.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true } // Return the updated contact
        );
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating contact' });
    }
});

// admin compose email
adminRouter.post('/send-email', async (req, res) => {
    const { recipient, subject, message } = req.body;

    try {
        const mailOptions = {
            from: 'pabishek61001@gmail.com',   // Sender address
            to: recipient,                  // List of receivers
            subject: subject,               // Subject line
            html: message                   // HTML body content
        };

        // Send mail using the transporter
        const info = await transporter.sendMail(mailOptions);

        // Success response
        res.status(200).json({
            message: 'Email sent successfully!',
            info
        });
    } catch (error) {
        // Error response
        res.status(500).json({
            message: 'Failed to send email.',
            error
        });
    }
});

// fetch venue request
adminRouter.get('/requested-services', async (req, res) => {
    try {
        // Fetch all records from the collection
        const requestedServices = await RequestedService.find();
        res.status(200).json(requestedServices);
    } catch (error) {
        console.error('Error fetching requested services:', error);
        res.status(500).json({ message: 'Failed to fetch data.' });
    }
});

// admin page customer count
adminRouter.get('/users/count', async (req, res) => {
    try {
        const userCount = await userTable.countDocuments(); // Get the count of users in the userTable
        const vendorCount = await VendorsTable.countDocuments(); // Get the count of users in the userTable

        res.json({ userCount: userCount, vendorCount: vendorCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Endpoint (to check the credentials)
adminRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await AdminTable.findOne({ userName: username });

        if (!admin) {
            return res.status(400).send({ success: false, message: 'Admin not found.' });
        }

        const isMatch = await bcrypt.compare(password, admin.userPassword);

        if (isMatch) {
            res.status(200).send({ success: true, message: 'Login successful!' });
        } else {
            res.status(400).send({ success: false, message: 'Invalid password.' });
        }
    } catch (err) {
        res.status(500).send({ success: false, message: 'Error during login.' });
    }
});

// admin fetch users
adminRouter.get('/users', async (req, res) => {
    try {
        const users = await userTable.find(); // Fetch all users
        res.json(users); // Send response as JSON
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




export default adminRouter;
