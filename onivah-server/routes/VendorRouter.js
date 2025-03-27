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
        console.log(otpStore);

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

// Password setup API
vendorRouter.post('/set-password', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Mock user creation (you would typically use a database here)
    const userExists = users.find((user) => user.email === email);

    if (userExists) {
        return res
            .status(400)
            .json({ success: false, message: 'Password already set for this email' });
    }

    users.push({ email, password }); // Save the email and password (hashed in real cases)

    res.status(200).json({ success: true, message: 'Password successfully set' });
});





// new login

// Endpoint to verify email OTP
vendorRouter.post('/verify-email-otp', (req, res) => {
    const { email, otp } = req.body;
    console.log(email, otp);
    console.log(otpStore);
    // Simple validation for OTP
    if (String(otp) === String(otpStore[email])) {
        console.log(`OTP verified for email: ${email}`);
        return res.status(200).json({
            message: 'Email OTP verified successfully.',
            verified: true,
        });
    } else {
        console.log('Invalid Email OTP');
        return res.status(400).json({
            message: 'Invalid Email OTP.',
            verified: false,
        });
    }
});

// Endpoint to verify phone OTP
vendorRouter.post('/verify-phone-otp', (req, res) => {
    const { phone, otp } = req.body;

    // Simple validation for OTP
    if (String(otp) === String(otpStore[phone])) {
        console.log(`OTP verified for phone: ${phone}`);
        return res.status(200).json({
            message: 'Phone OTP verified successfully.',
            verified: true,
        });
    } else {
        console.log('Invalid Phone OTP');
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
        // await twilioClient.messages.create({
        //     body: `Your OTP code is: ${otp}`,
        //     to: phone,         // Recipient's phone number
        //     from: '+1XXXXXXXXXX', // Your Twilio phone number
        // });
        console.log(`OTP sent to phone: ${phone},${otp}`);
        return otp;  // Return the OTP for later verification
    } catch (error) {
        console.error('Error sending phone OTP:', error);
        throw error;
    }
};

// Endpoint to send OTP (email or phone)
vendorRouter.post('/send-otp', async (req, res) => {
    const { type, email, phone } = req.body;

    try {
        let otp;

        if (type === 'email' && email) {
            otp = await sendEmailOtp(email);
            return res.status(200).json({ message: 'Email OTP sent', otp });  // Send OTP back for verification
        } else if (type === 'phone' && phone) {
            otp = await sendPhoneOtp(phone);
            return res.status(200).json({ message: 'Phone OTP sent', otp });  // Send OTP back for verification
        } else {
            return res.status(400).json({ message: 'Invalid request' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error });
    }
});



export default vendorRouter;
