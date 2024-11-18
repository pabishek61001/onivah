import express from "express";
import mysql from "mysql";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import connectDB from "./database/mongodbConfig.js";
import TopPicks from "./database/topPicks.js"
import AllVenues from "./database/venues.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import userTable from "./database/userTable.js";

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);

// Middleware to parse JSON bodies
app.use(express.json());

// GoogleRouter
app.use("/auth", authRouter);

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

// Set up Nodemailer transporter
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

// MongoDB connection
connectDB();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (!token) return res.sendStatus(401); // Unauthorized if no token

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user; // Attach user data to request
    next(); // Proceed to the next middleware or route handler
  });
};

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Backend connected successfully");
});


// landing top picks
app.get('/landing/toppicks', async (req, res) => {
  try {
    const top_Picks = await TopPicks.find({}, 'name price ratings imageUrls venue_id location');
    const formattedTopPicks = top_Picks.map(venue => ({
      _id: venue._id,
      name: venue.name,
      price: venue.price,
      ratings: venue.ratings,
      venue_id: venue.venue_id,
      location: venue.location,
      imageUrl: venue.imageUrls[0],  // Send the first image URL as the thumbnail
    }));
    // console.log(formattedTopPicks);
    res.status(200).json({ top_picks: formattedTopPicks });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching top picks' });
  }
});

// Endpoint to get details of a single venue
app.get('/venue/:venueid', async (req, res) => {
  console.log(req.params.venueid);
  try {
    const venue = await AllVenues.find({ venue_id: req.params.venueid });
    if (venue) {
      res.status(200).json(venue);
    } else {
      res.status(404).json({ error: 'Venue not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching venue details' });
  }
});

// search 
app.get('/header/search', async (req, res) => {
  // Extract query parameters from the request
  const { location, datesChoosed, category } = req.query;

  // Check if all parameters are missing
  if (!location && !datesChoosed && !category) {
    return res.status(400).json({
      message: "Please provide at least one of the following: location, date, or category."
    });
  }

  try {
    const venue = await AllVenues.find({ location: location });
    if (venue) {
      console.log(venue);
      res.status(200).json(venue);
    } else {
      res.status(404).json({ error: 'Venue not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error fetching venue details' });
  }

  // Log received parameters for debugging
  console.log('Location:', location);
  console.log('DatesChoosed:', datesChoosed);
  console.log('Category:', category);

});

// store otp
let otpStore = {};

// send otp
app.post('/login/send-otp', async (req, res) => {
  const { phone, email, userType } = req.body;
  const userKey = phone || email;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

  try {
    // Check if user exists based on userType
    let user;
    if (userType === 'phone') {
      user = await userTable.findOne({ phone }); // Assuming you're using a User model
    } else if (userType === 'email') {
      user = await userTable.findOne({ email });
    } else if (userType === 'google') {
      user = await userTable.findOne({ google });
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
        return res.json({ success: true, message: `OTP sent to email: ${email}` });
      });

      return res.json({ success: true, message: `OTP sent to email: ${email}` });

    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// verify otp
app.post('/login/verify-otp', (req, res) => {
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


app.get('/protected-route', authenticateToken, async (req, res) => {
  res.json({ user }); // Send back the user data  
});


// Port setup
const port = process.env.PORT || 4000; // Logical OR instead of bitwise OR
server.listen(port, () => {
  console.log("Node.js is running on port", port);
});
