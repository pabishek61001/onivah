import express from "express";
import nodemailer from "nodemailer"
import vendor from "../database/vendors.js";
import crypto from 'crypto';
import jwt from "jsonwebtoken";



const vendorRouter = express.Router();

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

vendorRouter.get("/test", (req, res) => {
    res.json("test")
})

// login send otp
vendorRouter.post('/login/send-otp', async (req, res) => {

    const { phone, email, userType } = req.body;
    const userKey = phone || email;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    try {
        // Check if user exists based on userType
        let user;
        if (userType === 'phone') {
            user = await vendor.findOne({ phone }); // Assuming you're using a User model
        } else if (userType === 'email') {
            user = await vendor.findOne({ email });
        } else if (userType === 'google') {
            user = await vendor.findOne({ google });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid userType' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'New to our website? Kindly sign up.' });
        }

        // Store OTP with timestamp
        otpStore[userKey] = {
            otp,
            userType,
            email,
            phone,
            createdAt: Date.now()
        };
        console.log(otpStore);

        if (userType === 'phone') {
            console.log(`OTP ${otp} sent to phone: ${phone}`);
            // Implement SMS API logic here (e.g., Twilio)
            return res.json({ success: true, message: `OTP sent to phone: ${phone}` });
        } else if (userType === 'email') {
            console.log(`OTP ${otp} sent to email: ${email}`);

            const mailOptions = {
                from: 'pabishek61001@gmail.com', // Sender address
                to: email, // Recipient address
                subject: 'OTP for your login',
                text: `Your OTP code is ${otp}. It is valid for 5 minutes.`, // Email body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ success: false, message: 'Error sending email' });
                }
                console.log('Email sent:', info.response);
                return res.status(200).json({ success: true, message: `OTP sent to email: ${email}` });
            });


        }
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// sign up send otp
const verificationTokens = {}; // In-memory store for verification tokens
const vendorSecret = 'vendor_secret'; // Replace with an environment variable

vendorRouter.post('/signup/send-otp', async (req, res) => {

    const { phone, email, userType } = req.body;
    const userKey = phone || email;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    try {

        // Store OTP with timestamp
        otpStore[userKey] = {
            otp,
            userType,
            email,
            phone,
            createdAt: Date.now()
        };
        console.log(otpStore, "lhlh");

        if (userType === 'phone') {
            console.log(`OTP ${otp} sent to phone: ${phone}`);
            // Implement SMS API logic here (e.g., Twilio)
            return res.json({ success: true, message: `OTP sent to phone: ${phone}` });
        }
        else if (userType === 'email') {
            console.log(`OTP ${otp} sent to email: ${email}`);

            try {
                // Create the JWT token
                const verificationToken = jwt.sign(
                    { email },
                    vendorSecret,
                    { expiresIn: '1h' } // Token expires in 1 hour
                );

                setTimeout(() => {
                    delete verificationTokens[email];
                    console.log(`Token for email ${email} deleted after 10 minutes.`);
                }, 600000); // 600,000 ms = 10 minutes

                // Create the verification link
                const verificationLink = `http://localhost:3001/vendor/verify/${verificationToken}`;

                // Send email with the verification link
                const mailOptions = {
                    from: 'pabishek61001@gmail.com',
                    to: email,
                    subject: 'Email Verification for Your Account',
                    text: `Click the link to verify your account: ${verificationLink}`,
                };

                await transporter.sendMail(mailOptions);

                return res.json({ success: true, message: 'Verification link sent successfully.' });
            } catch (error) {
                console.error('Error sending verification email:', error);
                return res.status(500).json({ success: false, message: 'Error sending verification link.' });
            }


        }
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

vendorRouter.get('/signup/verify/:token', (req, res) => {
    const { token } = req.params;

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, vendorSecret);
        const { email } = decoded;

        console.log(`Token verified for email: ${email}`);

        // Delete the token from the in-memory store after successful verification
        delete verificationTokens[email];

        // Send a JSON response indicating success
        return res.status(200).json({
            success: true,
            message: 'Email successfully verified. Please proceed to set your password.',
            redirectTo: '/vendor/password_setup', // Provide the next action or page
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
            redirectTo: '/vendor-login', // URL to redirect if invalid
        });
    }
});

// login verify otp
vendorRouter.post('/login/verify-otp', (req, res) => {
    const { loginInput, otp } = req.body;
    const storedOtpData = otpStore[loginInput];

    if (storedOtpData && storedOtpData.otp === parseInt(otp)) {
        const timeElapsed = Date.now() - storedOtpData.createdAt;
        if (timeElapsed < 5 * 60 * 1000) { // OTP valid for 5 mins
            // Generate JWT token
            const token = jwt.sign({ loginInput, userType: storedOtpData.userType }, "secretKey", {
                expiresIn: '1h' // Token validity
            });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "OTP expired" });
        }
    } else {
        res.json({ success: false, message: "Invalid OTP" });
    }
});

export default vendorRouter;
