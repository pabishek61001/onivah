import express from "express";
import nodemailer from "nodemailer"
import vendor from "../database/vendors.js";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";
import fs from 'fs'
import twilio from 'twilio'; // Use ES6 import
import bcrypt from 'bcryptjs'; // To hash the password
import RequestedService from "../database/requestedService.js";
import mongoose from "mongoose";
import connectDB from "../database/mongodbConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vendorRouter = express.Router();

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

vendorRouter.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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


// store otp
let otpStore = {};

// sign up send otp
const verificationTokens = {}; // In-memory store for verification tokens

// console.log(crypto.randomBytes(64).toString('hex'));
const accountSid = 'AC93a660151416ae6a93f897f268970391';
const authToken = 'c1f6b8926ed0cc0ffbb9a23e603b281a';
const whatsappNumber = "+14067977741"; //14155238886  //sms -14067977741 Twilio WhatsApp sandbox number
const client = twilio(accountSid, authToken);



const vendorAuth = async (req, res, next) => {

    const token = req.cookies?.vd_token;

    if (!token) {
        // Clear cookie if no token found
        res.clearCookie('vd_token', {
            httpOnly: true,
            secure: false, // Set true if using HTTPS
            sameSite: 'Lax',
            path: '/', // important to match the cookie path
        });
        return res.status(401).json({ error: "Unauthorized: Token not provided." }); // Unauthorized

    }

    try {
        // Decode the JWT token
        const decoded = jwt.verify(token, process.env.VENDOR_SECRET_KEY);

        // Extract email and phone from the decoded token
        const { email, phone } = decoded;

        // Find the vendor using the decoded email and phone
        const vendorData = await vendor.findOne({ email, phone }).lean();

        if (!vendorData) {
            // Clear cookie if no token found
            res.clearCookie('vd_token', {
                httpOnly: true,
                secure: false, // Set true if using HTTPS
                sameSite: 'Lax',
                path: '/', // important to match the cookie path
            });
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        // Attach the vendor data to the request object
        req.vendor = vendorData;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
};

// protected-route
vendorRouter.get('/verify-token', vendorAuth, (req, res) => {
    const { password, ...vendorData } = req.vendor;  // Destructure to exclude the password
    res.status(200).json({ success: true, vendor: vendorData });
});

// vendorRouter.post('/api/upload', upload.single('document'), vendorAuth, (req, res) => {
//     if (!req.file) {
//         console.log(req.file);
//         return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const fileSizeKB = req.file.size / 1024;
//     const MAX_KB = 10;

//     if (fileSizeKB < MAX_KB) {
//         fs.unlinkSync(req.file.path); // delete small files
//         return res.status(400).json({ message: 'File too small. Must be at least 10KB.' });
//     }

//     res.json({ message: 'Upload successful', file: req.file.filename });
// });


// login send otp
// vendorRouter.post('/login/send-otp', async (req, res) => {

//     const { phone, email, userType } = req.body;
//     const userKey = phone || email;
//     const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

//     try {
//         // Check if user exists based on userType
//         let user;
//         if (userType === 'phone') {
//             user = await vendor.findOne({ phone }); // Assuming you're using a User model
//         } else if (userType === 'email') {
//             user = await vendor.findOne({ email });
//         } else if (userType === 'google') {
//             user = await vendor.findOne({ google });
//         } else {
//             return res.status(400).json({ success: false, message: 'Invalid userType' });
//         }

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'New to our website? Kindly sign up.' });
//         }

//         // Store OTP with timestamp
//         otpStore[userKey] = {
//             otp,
//             userType,
//             email,
//             phone,
//             createdAt: Date.now()
//         };

//         if (userType === 'phone') {
//             console.log(`OTP ${otp} sent to phone: ${phone}`);
//             // Implement SMS API logic here (e.g., Twilio)
//             return res.json({ success: true, message: `OTP sent to phone: ${phone}` });
//         } else if (userType === 'email') {
//             console.log(`OTP ${otp} sent to email: ${email}`);

//             const mailOptions = {
//                 from: 'pabishek61001@gmail.com', // Sender address
//                 to: email, // Recipient address
//                 subject: 'OTP for your login',
//                 text: `Your OTP code is ${otp}. It is valid for 5 minutes.`, // Email body
//             };

//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.error('Error sending email:', error);
//                     return res.status(500).json({ success: false, message: 'Error sending email' });
//                 }
//                 console.log('Email sent:', info.response);
//                 return res.status(200).json({ success: true, message: `OTP sent to email: ${email}` });
//             });


//         }
//     } catch (error) {
//         console.error('Error processing request:', error);
//         return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });

// login send otp
// vendorRouter.post('/signup/send-otp', async (req, res) => {
//     const { phone, email, userType } = req.body;
//     const userKey = phone || email;
//     const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
//     try {

//         // Store OTP with timestamp
//         otpStore[userKey] = {
//             otp,
//             userType,
//             email,
//             phone,
//             createdAt: Date.now()
//         };
//         console.log(otpStore);

//         if (userType === 'phone') {
//             console.log(`OTPp ${otp} sent to phone: ${phone}`);
//             // Implement SMS API logic here (e.g., Twilio)
//             return res.json({ success: true, message: `OTP sent to phone: ${phone}` });
//         }
//         else if (userType === 'email') {
//             console.log(`OTPp ${otp} sent to email: ${email}`);

//             try {
//                 // Create the JWT token
//                 const verificationToken = jwt.sign(
//                     { email },
//                     process.env.VENDOR_SECRET_KEY,
//                     { expiresIn: 30 * 24 * 60 * 60 * 1000 } // Token expires in 1 hour
//                 );

//                 setTimeout(() => {
//                     delete verificationTokens[email];
//                     console.log(`Token for email ${email} deleted after 10 minutes.`);
//                 }, 600000); // 600,000 ms = 10 minutes

//                 // Create the verification link
//                 const verificationLink = `http://localhost:3001/vendor/verify/${verificationToken}`;

//                 // Send email with the verification link
//                 const mailOptions = {
//                     from: 'pabishek61001@gmail.com',
//                     to: email,
//                     subject: 'Email Verification for Your Account',
//                     text: `Click the link to verify your account: ${verificationLink}`,
//                 };

//                 await transporter.sendMail(mailOptions);

//                 return res.json({ success: true, message: 'Verification link sent successfully.' });
//             } catch (error) {
//                 console.error('Error sending verification email:', error);
//                 return res.status(500).json({ success: false, message: 'Error sending verification link.' });
//             }


//         }
//     } catch (error) {
//         console.error('Error processing request:', error);
//         return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });

vendorRouter.get('/signup/verify/:token', (req, res) => {
    const { token } = req.params;

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.VENDOR_SECRET_KEY);
        const { email } = decoded;

        console.log(`Token verified for email: ${email}`);

        // Delete the token from the in-memory store after successful verification
        delete verificationTokens[email];

        // Send a JSON response indicating success
        return res.status(200).json({
            success: true,
            message: 'Email successfully verified. Please proceed to set your password.',
            redirectTo: '/vendor/password_setup', // Provide the next action or page
            userEmail: email
        });

    } catch (error) {
        console.error('Error verifying token:', error);

        // Check for token expiry
        if (error.name === 'TokenExpiredError') {
            const { email } = jwt.decode(token); // Decode to get the email even if expired
            delete verificationTokens[email]; // Remove expired token
            // Send a response indicating the token is expired
            return res.status(400).json({
                success: false,
                message: 'Verification link has expired. Please request a new one.',
                redirectTo: '/vendor-login', // URL to redirect if expired

            });
        }

        // If token is invalid (or any other error), remove it from the store
        const { email } = jwt.decode(token); // Decode to get the email
        delete verificationTokens[email]; // Remove invalid token
        // Send a response indicating the token is invalid
        return res.status(400).json({
            success: false,
            message: 'Invalid verification token. Please request a new one.',
            redirectTo: '/vendor-login', // URL to redirect if invalid,

        });
    }
});

// vendor login-verify otp
vendorRouter.post('/login/verify-otp', (req, res) => {
    const { loginInput, otp } = req.body;
    const storedOtpData = otpStore[loginInput];

    if (storedOtpData && storedOtpData.otp === parseInt(otp)) {
        const timeElapsed = Date.now() - storedOtpData.createdAt;
        if (timeElapsed < 5 * 60 * 1000) { // OTP valid for 5 mins
            // Generate JWT token
            const token = jwt.sign({ loginInput, userType: storedOtpData.userType }, process.env.JWT_SECRET_KEY, {
                expiresIn: 30 * 24 * 60 * 60 * 1000 // Token validity
            });

            res.cookie('vd_token', token, {
                httpOnly: true,
                secure: false, // Set to true if using HTTPS
                sameSite: 'Lax',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds,
                path: '/',

            });


            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "OTP expired" });
        }
    } else {
        res.json({ success: false, message: "Invalid OTP" });
    }
});

// Password setup API
vendorRouter.post('/set-password', async (req, res) => {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email or phone and password are required',
        });
    }

    try {
        // Check if user already exists
        const userExists = await vendor.findOne({
            $or: [{ email }, { phone }],
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already registered!',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new vendor({
            email,
            phone,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate JWT Token
        const tokenPayload = {
            email: newUser.email,
            phone: newUser.phone,
        };

        const token = jwt.sign(tokenPayload, process.env.VENDOR_SECRET_KEY, { expiresIn: 30 * 24 * 60 * 60 * 1000 });

        res.cookie('vd_token', token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds,
            path: '/',
        });

        res.status(200).json({
            success: true,
            message: 'User registered and password set successfully',
            token,
        });

    } catch (error) {
        console.error('Error in /set-password:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// vendor signup email verification
vendorRouter.post('/verify-email-otp', (req, res) => {
    const { email, otp } = req.body;

    // Simple validation for OTP
    if (String(otp) === String(otpStore[email])) {
        return res.status(200).json({
            message: 'Email OTP verified successfully.',
            verified: true,
        });
    } else {
        return res.status(400).json({
            message: 'Invalid Email OTP.',
            verified: false,
        });
    }
});

// vendor signup phone verification
vendorRouter.post('/verify-phone-otp', (req, res) => {
    const { phone, otp } = req.body;

    // Simple validation for OTP
    if (String(otp) === String(otpStore[phone])) {
        return res.status(200).json({
            message: 'Phone OTP verified successfully.',
            verified: true,
        });
    } else {
        return res.status(400).json({
            message: 'Invalid Phone OTP.',
            verified: false,
        });
    }
});

// Function to generate a random 4-digit OTP
const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

// Send OTP to email
const sendEmailOtp = async (email) => {
    const otp = generateOtp();

    otpStore[email] = otp;
    const mailOptions = {
        from: 'pabishek61001@gmail.com',  // Your email address
        to: email,                     // Recipient's email address
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    try {
        // await transporter.sendMail(mailOptions);
        console.log(`OTP sent to email: ${email, otp}`);
        return otp;  // Return the OTP for later verification
    } catch (error) {
        console.error('Error sending email OTP:', error);
        throw error;
    }
};

// Send OTP to phone (using Twilio SMS service)
const sendPhoneOtp = async (phone) => {
    const otp = generateOtp();
    otpStore[phone] = otp;

    try {
        // const message = await client.messages.create({
        //     from: whatsappNumber,
        //     to: `+${phone}`,
        //     body: `Your OTP is: ${otp}. Please use this to verify your account.`,
        // });
        console.log(`OTP sent to phone: ${phone},${otp}`);
        return otp;  // Return the OTP for later verification
    } catch (error) {
        console.error('Error sending phone OTP:', error);
        throw error;
    }
};

// vendor login send OTP (email or phone)
vendorRouter.post('/send-otp', async (req, res) => {
    const { type, email, phone } = req.body;

    try {
        let otp;

        if (type === 'email' && email) {
            // If email is provided, check if the user already exists by email
            let user = await vendor.findOne({ email: email });

            if (user) {
                return res.status(404).json({ message: 'Email already registered' });
            }

            // Send OTP for email
            otp = await sendEmailOtp(email);
            return res.status(200).json({ message: 'Email OTP sent', otp });

        } else if (type === 'phone' && phone) {
            // If phone is provided, check if the user already exists by phone
            let user = await vendor.findOne({ phone: phone });

            if (user) {
                return res.status(404).json({ message: 'Phone number already registered' });
            }

            // Send OTP for phone
            otp = await sendPhoneOtp(phone);
            return res.status(200).json({ message: 'Phone OTP sent', otp });

        } else {
            return res.status(400).json({ message: 'Invalid request, type or phone/email missing' });
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: 'Error sending OTP', error });
    }
});

// vendor verify send OTP (email or phone)
vendorRouter.post('/vendor-login', async (req, res) => {
    const { email, phone, password } = req.body;

    // Check if email/phone and password are provided
    if (!password || (!email && !phone)) {
        return res.status(400).json({ success: false, message: 'Missing email/phone or password' });
    }

    try {
        let user;

        if (email) {
            // Search by email
            user = await vendor.findOne({ email });
        } else if (phone) {
            // Search by phone
            user = await vendor.findOne({ phone });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare the hashed password with the provided password (async operation)
        const isMatch = bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // If password matches, generate a JWT token
        const tokenPayload = {
            email: user.email,
            phone: user.phone,
            // vendorId: user.vendorId, // You can include additional user info like vendorId
        };

        const token = jwt.sign(tokenPayload, process.env.VENDOR_SECRET_KEY, { expiresIn: 30 * 24 * 60 * 60 * 1000 });

        res.cookie('vd_token', token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
        });

        // Send the token to the frontend
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token, // Send the token to the frontend
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET images for a specific vendor using email
vendorRouter.get('/fetch/:email/images', vendorAuth, async (req, res) => {
    const { email } = req.params;

    try {
        const services_from = await RequestedService.find({
            email: email,
            isApproved: true
        });

        const db = mongoose.connection.db;

        const services = await Promise.all(
            services_from.map(async (service) => {
                const { category, linkedServiceId } = service;

                try {
                    const collection = db.collection(category);
                    const linkedService = await collection.findOne({
                        _id: new mongoose.Types.ObjectId(linkedServiceId)
                    });

                    return linkedService;

                } catch (err) {
                    return null;
                }
            })
        );

        res.json({ success: true, services: services });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// vendorRouter.post('/update-images',  async (req, res) => {
//     try {
//         const { category, categoryId } = req.body;
//         let { images } = req.body;
//         const newFiles = req.files || [];  // Ensure it's at least an empty array


//         if (!category || !categoryId || !images) {
//             return res.status(400).json({ error: 'category, categoryId, and images are required.' });
//         }

//         if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//             return res.status(400).json({ error: 'Invalid categoryId.' });
//         }

//         // Check if collection exists
//         const collections = await mongoose.connection.db.listCollections().toArray();
//         if (!collections.some(c => c.name === category)) {
//             return res.status(404).json({ error: `Collection '${category}' does not exist.` });
//         }

//         const folderMap = JSON.parse(req.body.folderMap || '[]');

//         const formattedImages = {};

//         // Step 1: add existing URLs from folderMap
//         folderMap.forEach(item => {
//             const folder = item.folderName;
//             if (!formattedImages[folder]) formattedImages[folder] = [];

//             if (item.fileUrl) {
//                 // Existing image URL
//                 formattedImages[folder].push(item.fileUrl);
//             }
//         });

//         // Step 2: upload new files & get URLs (you must implement upload logic)
//         for (const file of newFiles) {
//             const mapEntry = folderMap.find(fm => fm.fileName === file.originalname);
//             if (!mapEntry) continue;

//             const folder = mapEntry.folderName;

//             const uploadedUrl = await uploadToS3OrCDN(file); // You must define this
//             if (!formattedImages[folder]) formattedImages[folder] = [];
//             formattedImages[folder].push(uploadedUrl);
//         }


//         console.log(formattedImages);

//         const collection = mongoose.connection.db.collection(category);

//         // Convert categoryId to ObjectId first
//         const objectId = new mongoose.Types.ObjectId(categoryId);

//         // Find the document by _id
//         const doc = await collection.findOne({ _id: objectId });
//         console.log('Found doc:', doc._id);

//         const updatedDoc = await collection.findOneAndUpdate(
//             { _id: objectId },
//             { $set: { images: formattedImages } },
//             { returnDocument: 'after', returnOriginal: false } // OR just remove this when using native
//         );

//         if (!updatedDoc) {
//             return res.status(404).json({ error: 'Document not found with provided categoryId.' });
//         }


//         return res.json({ message: `${category} images updated successfully.`, updatedDoc: updatedDoc.value });

//     } catch (error) {
//         console.error('Error updating images:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

vendorRouter.post('/update-images', vendorAuth, async (req, res) => {
    try {
        const { category, categoryId, images } = req.body;

        if (!category || !categoryId || !images) {
            return res.status(400).json({ error: 'category, categoryId, and images are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: 'Invalid categoryId.' });
        }

        const collections = await mongoose.connection.db.listCollections().toArray();
        if (!collections.some(c => c.name === category)) {
            return res.status(404).json({ error: `Collection '${category}' does not exist.` });
        }

        const objectId = new mongoose.Types.ObjectId(categoryId);
        const collection = mongoose.connection.db.collection(category);

        const updatedDoc = await collection.findOneAndUpdate(
            { _id: objectId },
            { $set: { images } }, // Use directly what frontend sent
            { returnDocument: 'after' }
        );

        if (!updatedDoc) {
            return res.status(404).json({ error: 'Document not found with provided categoryId.' });
        }

        return res.json({ message: 'Images updated successfully.' });
    } catch (error) {
        console.error('Error updating images:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

vendorRouter.post("/delete-folder", vendorAuth, async (req, res) => {
    try {
        const { category, categoryId, folderName } = req.body;

        if (!category || !categoryId || !folderName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const objectId = new mongoose.Types.ObjectId(categoryId);
        const collection = mongoose.connection.db.collection(category);

        const doc = await collection.findOne({ _id: objectId });

        if (!doc) {
            return res.status(404).json({ error: "Document not found" });
        }

        // Remove the folder from the `images` field
        if (doc.images && doc.images[folderName]) {

            await collection.updateOne(
                { _id: objectId },
                { $unset: { [`images.${folderName}`]: "" } }
            );
            // await doc.save();
            return res.status(200).json({ message: "Folder deleted successfully" });
        } else {
            return res.status(404).json({ error: "Folder not found in document" });
        }
    } catch (err) {
        console.error("Delete Folder Error:", err);
        return res.status(500).json({ error: "Server error while deleting folder" });
    }
});





export default vendorRouter;
