import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import connectDB from "./database/mongodbConfig.js";
import TopPicks from "./database/topPicks.js"
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import userTable from "./database/userTable.js";
import ContactForm from './database/contactForm.js'
import vendorRouter from "./routes/VendorRouter.js";
import twilio from 'twilio'; // Use ES6 import
import adminRouter from "./adminController/adminRouter.js";
import RequestedService from "./database/requestedService.js";
import multer from "multer";
import Stripe from "stripe";
import AdminTable from "./database/adminTable.js";
import bcrypt from "bcryptjs";
import StripePayment from "./routes/StripePayment.js";
import Razorpay from "razorpay";
import path from "path";
import fs from "fs";
import s3Router from "./routes/s3Router.js";
import cookieParser from "cookie-parser";
dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);


const allowedOrigins = [
  "http://localhost:3000",        // Dev
  "http://localhost:3001",        // Dev
  "https://onivah-backend.onrender.com" // Dev 
];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.set('trust proxy', 1);

app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use('/uploads', express.static('uploads'));

// GoogleRouter
app.use("/auth", authRouter);
app.use("/vendor", vendorRouter);
app.use("/admin", adminRouter);
app.use("/api/s3", s3Router);

// app.use(
//   cors({
//     credentials: true,
//     origin: "*",
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   })
// );


app.set('trust proxy', 1);


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Storage config (optional — adjust as needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// POST route for form submission
app.post('/venue-submission', upload.single('file'), async (req, res) => {
  try {
    // Access the Aadhar file
    const aadharFile = req.file || null;

    // Access other form data from the body
    const formFields = req.body;

    // Parse the customFields back to an array
    let customFields = [];
    if (formFields.customFields) {
      try {
        const fieldsArray = Array.isArray(formFields.customFields)
          ? formFields.customFields
          : [formFields.customFields];

        fieldsArray.forEach((item) => {
          const parsed = JSON.parse(item); // Each item is a JSON string
          customFields.push(...parsed); // Merge all items into one array
        });
      } catch (error) {
        console.error("Error parsing customFields:", error);
        return res.status(400).json({ message: "Invalid customFields format." });
      }
    }


    // Parse the customFields back to an array
    let whyus = [];
    if (formFields.generatedWhyUs) {
      console.log(formFields.generatedWhyUs);
      try {
        whyus = JSON.parse(formFields.generatedWhyUs);
      } catch (error) {
        console.error('Error parsing customFields:', error);
        return res.status(400).json({ message: 'Invalid customFields format.' });
      }
    }


    let customPricing = [];
    if (formFields.customPricing) {
      try {
        customPricing = JSON.parse(formFields.customPricing);
      } catch (error) {
        console.error('Error parsing customPricing:', error);
        return res.status(400).json({ message: 'Invalid customPricing format.' });
      }
    }

    let groupedUrls = {};

    // If groupedUrls is a string, parse it, else use as-is
    if (formFields.groupedUrls) {
      if (typeof formFields.groupedUrls === 'string') {
        try {
          groupedUrls = JSON.parse(formFields.groupedUrls);
        } catch (error) {
          console.error('Error parsing groupedUrls:', error);
          return res.status(400).json({ message: 'Invalid groupedUrls format.' });
        }
      } else if (typeof formFields.groupedUrls === 'object') {
        groupedUrls = formFields.groupedUrls;
      } else {
        groupedUrls = {};
      }
    }

    // Convert groupedUrls to images format (folder => [url, url, ...])
    const formattedImages = {};
    for (const folder in groupedUrls) {
      formattedImages[folder] = groupedUrls[folder].map(img => img.url);
    }

    const { fullName, email, category, ...restFields } = formFields;

    // File metadata for Aadhar
    const fileMeta = aadharFile
      ? {
        originalName: aadharFile.originalname,  // The name user uploaded
        storedName: aadharFile.filename,        // The unique name saved on disk
        mimeType: aadharFile.mimetype,
        size: aadharFile.size,
      }
      : null;



    // Save data to database
    const savedRequest = await RequestedService.create({
      fullName,
      email,
      category,
      additionalFields: {
        ...restFields,
        customPricing: customPricing,
        customFields: customFields,
      },
      images: formattedImages,
      file: fileMeta,
    });

    // Send success response
    res.status(200).json({
      message: 'Form submitted successfully!',
      data: savedRequest,
    });
  } catch (err) {
    console.error('❌ Submission Error:', err);
    res.status(500).json({ message: 'Failed to submit form.' });
  }
});



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

const stripe = Stripe('sk_test_51R7ZVB2cyus2IVSREDXhkPWEUlzxqDDVZBdv23HhmXX6XaXu8OBlD5dXyNgDzX0uUSCh3VC71yOX1cnrRQTwnfU200y10j9Kld');


const authenticateToken = (req, res, next) => {
  // const authHeader = req.headers['authorization'];
  const token = req.cookies?.token;

  if (!token) {
    // Clear cookie if no token found
    res.clearCookie('token', {
      httpOnly: true,
      secure: false, // Set true if using HTTPS
      sameSite: 'Lax',
      path: '/', // important to match the cookie path
    });
    return res.status(401).json({ error: "Unauthorized: Token not provided." }); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
    if (err) {
      // Clear cookie if no token found
      res.clearCookie('token', {
        httpOnly: true,
        secure: false, // Set true if using HTTPS
        sameSite: 'Lax',
        path: '/', // important to match the cookie path
      });
      return res.status(403).json({ error: "Token Expired/ Invalid! Log In." }); // Forbidden
    }

    try {
      // Fetch user data from MongoDB
      const userData = await userTable.findOne({
        $or: [{ email: user.loginInput }, { phone: user.loginInput }],
      }).lean();

      if (!userData) {
        // Clear cookie if no token found
        res.clearCookie('token', {
          httpOnly: true,
          secure: false, // Set true if using HTTPS
          sameSite: 'Lax',
          path: '/', // important to match the cookie path
        });
        return res.status(404).json({ error: "User not found." }); // User not found
      }
      req.user = { ...user, ...userData }; // Combine JWT data and database data
      next(); // Proceed to the next middleware or route handler
    } catch (dbError) {
      // Clear cookie if no token found
      res.clearCookie('token', {
        httpOnly: true,
        secure: false, // Set true if using HTTPS
        sameSite: 'Lax',
        path: '/', // important to match the cookie path
      });
      res.status(500).json({ error: "Internal server error." }); // Internal server error
    }
  });
};






// Test route
app.get("/", (req, res) => {
  res.status(200).send("Backend connected successfully");
});

// Login Endpoint (to check the credentials)
app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await AdminTable.findOne({ userName: username });

    if (!admin) {
      return res.status(400).send({ success: false, message: 'Admin not found.' });
    }

    const isMatch = await bcrypt.compare(password, admin.userPassword);

    if (isMatch) {

      // Generate JWT token using uniqueId and userPhone
      const token = jwt.sign(
        { username: username },
        process.env.JWT_SECRET_KEY,
      );

      // Set token in HttpOnly cookie
      // res.cookie('token', token, {
      //   httpOnly: true,
      //   secure: false, // Set to true if using HTTPS
      //   sameSite: 'Lax',
      //   maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
      // });

      res.status(200).send({ success: true, token: token, message: 'Login successful!' });
    } else {
      res.status(400).send({ success: false, message: 'Invalid password.' });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: 'Error during login.' });
  }
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
    res.status(200).json({ top_picks: formattedTopPicks });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching top picks' });
  }
});

// Endpoint to get details of a single venue
app.get('/venue/:venueid', async (req, res) => {
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

// Route to fetch services dynamically
app.get("/services/:category", async (req, res) => {
  try {
    let { category } = req.params;

    // Fetch documents directly from the collection
    const services = await mongoose.connection.db.collection(category).find().toArray();

    if (!services.length) {
      return res.status(404).json({ message: `No services found in ${category}` });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/category/:category/:serviceId", async (req, res) => {
  try {
    const { category, serviceId } = req.params;

    // Get the corresponding collection dynamically
    const service = await mongoose.connection
      .collection(category)
      .findOne({ _id: new mongoose.Types.ObjectId(serviceId) });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// search 
// app.get('/header/search', async (req, res) => {
//   const { location, datesChoosed, category } = req.query; // Expect query parameters

//   try {
//     // If category is missing, return a normal response instead of 400 error
//     if (!category) {
//       return res.status(200).json({ success: false, message: "Category is required", service: [] });
//     }

//     // Fetch all documents from the specified category collection
//     const services = await mongoose.connection.db.collection(category).find().toArray();

//     // Filter venues based on availableLocations
//     const service = services.filter(service =>
//       service.additionalFields?.availableLocations?.includes(location)
//     );

//     if (!service.length) {
//       return res.status(200).json({ success: false, message: 'No venues available in the specified location or category', service: [] });
//     }

//     // Return matched venues
//     res.status(200).json({ success: true, service });

//   } catch (err) {
//     console.error('Error fetching venue details:', err);
//     res.status(500).json({ success: false, message: 'Error fetching venue details' });
//   }
// });

app.get('/header/search', async (req, res) => {
  const { location, datesChoosed, category } = req.query; // Expect query parameters

  try {
    // If category is missing but location is present, return a response asking for category
    if (!category) {
      return res.status(200).json({ success: false, message: "Category is required", service: [] });
    }

    // Fetch all documents from the specified category collection
    const services = await mongoose.connection.db.collection(category).find().toArray();

    // If location is missing, return all services under the specified category
    if (!location) {
      return res.status(200).json({ success: true, service: services });
    }

    // Filter venues based on availableLocations if both category and location exist
    const filteredServices = services.filter(service =>
      service.additionalFields?.availableLocations?.includes(location)
    );

    if (!filteredServices.length) {
      return res.status(200).json({ success: false, message: 'No venues available in the specified location', service: [] });
    }

    // Return matched venues
    res.status(200).json({ success: true, service: filteredServices });

  } catch (err) {
    console.error('Error fetching venue details:', err);
    res.status(500).json({ success: false, message: 'Error fetching venue details' });
  }
});

// Search API (Fetch collections dynamically)
app.get("/list/services", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const results = [];

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;

      // Match collection name with query
      if (collectionName.toLowerCase().includes(query.toLowerCase())) {
        const count = await db.collection(collectionName).countDocuments();
        results.push({ _id: collectionName, count });
      }
    }
    res.json(results);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// store otp
let otpStore = {};
// WhatsApp sending function

const accountSid = 'AC93a660151416ae6a93f897f268970391';
const authToken = 'c1f6b8926ed0cc0ffbb9a23e603b281a';
const whatsappNumber = "+14067977741"; //14155238886  //sms -14067977741 Twilio WhatsApp sandbox number

const client = twilio(accountSid, authToken);

function generateOnivahId() {
  const randomString = Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 6).toUpperCase();
  return `onivah_${randomString}`;
}

// Helper function to send SMS
async function sendSMS(phone, otp) {
  try {
    const message = await client.messages.create({
      from: whatsappNumber,
      to: `+${phone}`,
      body: `Your OTP is: ${otp}. Please use this to verify your account.`,
    });
    console.log(`OTP sent to phone: ${phone}`);
    return { success: true, message: `OTP sent to phone: ${phone}` };
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Error sending SMS');
  }
}
// sendSMS(919543445782, 1234);

// Helper function to send Email
function sendEmail(email, otp) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: 'pabishek61001@gmail.com',
      to: email,
      subject: 'Your One-Time Password (OTP) - Onivah',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <div style="background-color: #6d4d94; color: white; padding: 15px; border-radius: 5px; text-align: center;">
            <h2>Welcome to Onivah 🎉</h2>
            <p>Your one-stop destination for Wedding Halls, Party Venues & Photography</p>
          </div>
          <div style="margin-top: 20px;">
            <p>Dear Customer,</p>
            <p>Thank you for choosing <strong>Onivah</strong> for your special occasion. To continue your login process, please use the OTP below:</p>
            <div style="font-size: 24px; font-weight: bold; color: #6d4d94; margin: 20px 0;">
              ${otp}
            </div>
            <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
          </div>
          <hr style="margin: 30px 0;">
          <div style="font-size: 14px; color: #666;">
            <p>Need help planning your event? Explore our curated venues and photography packages designed to make your celebrations unforgettable.</p>
            <ul>
              <li>🎊 Wedding & Party Halls with Instant Booking</li>
              <li>📸 Professional Photographers for Every Occasion</li>
              <li>🎁 Exclusive Deals for Early Bookings</li>
            </ul>
            <p>Visit us at <a href="http://localhost:3001" style="color: #6d4d94; text-decoration: none;">Onivah</a></p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return reject(new Error('Error sending email'));
      }
      console.log('Email sent:', email + ':' + otp);
      resolve({ success: true, message: `OTP sent to email: ${email}` });
    });
  });
}


// Helper function to generate OTP and store it
function generateAndStoreOTP(userKey, userType, phone, email) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[userKey] = {
    otp,
    userType,
    email,
    phone,
    createdAt: Date.now(),
  };

  // Set a timeout to delete the OTP after 10 minutes
  setTimeout(() => {
    if (otpStore[userKey] && otpStore[userKey].otp === otp) {
      delete otpStore[userKey];
      console.log(`OTP for ${userKey} has been deleted.`);
    }
  }, 10 * 60 * 1000); // 10 minutes in milliseconds

  return otp;
}

function verifyOTP(userKey, enteredOtp) {
  // Check if OTP exists for the userKey
  if (!otpStore[userKey]) {
    return { success: false, message: "OTP not found or expired." };
  }

  const storedOtpData = otpStore[userKey];
  const currentTime = Date.now();

  // Check if the OTP has expired (more than 10 minutes)
  if (currentTime - storedOtpData.createdAt > 10 * 60 * 1000) {
    // OTP has expired
    delete otpStore[userKey];  // Clean up expired OTP
    return { success: false, message: "OTP has expired." };
  }

  // Check if the entered OTP matches the stored OTP
  if (storedOtpData.otp !== parseInt(enteredOtp)) {
    return { success: false, message: "Invalid OTP." };
  }

  // OTP is valid
  return { success: true, message: "OTP verified successfully." };
}


// Helper function to handle OTP sending
async function handleOTPSending(req, res, isSignup) {
  const { phone, email, userType } = req.body;

  console.log(phone, email, userType);
  const userKey = phone || email;

  if (!userKey || !userType) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const user = await userTable.findOne(userType === 'phone' ? { phone } : { email });

    if (isSignup && user) {
      return res.status(400).json({ success: false, message: `The ${userType} already registered? Kindly Login.` });
    }

    if (!isSignup && !user) {
      return res.status(404).json({ success: false, message: 'New to our website? Kindly sign up.' });
    }

    const otp = generateAndStoreOTP(userKey, userType, phone, email);

    const result =
      userType === 'phone'
        ? await sendSMS(phone, otp)
        : await sendEmail(email, otp);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Helper function to handle OTP sending
async function profileOtpSending(req, res) {
  const { phone } = req.body;
  const userKey = phone;

  if (!userKey) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const user = await userTable.findOne({ phone: phone });  // Use findOne instead of find
    if (user) {  // If a user is found
      return res.status(400).json({ success: false, message: `The ${userKey} number is already in use.` });
    }

    const otp = generateAndStoreOTP(phone, 'Phone', phone);
    const result = await sendSMS(phone, otp);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


// Login OTP 
app.post('/login/send-otp', (req, res) => handleOTPSending(req, res, false));

// Signup OTP 
app.post('/signup/send-otp', (req, res) => handleOTPSending(req, res, true));

app.post('/profile/send-otp', (req, res) => profileOtpSending(req, res));

// profile verify OTP
app.post("/profile/verify-otp", async (req, res) => {
  const { otp, phone, userId } = req.body;  // OTP, phone, and userId received from the frontend

  if (!otp || !phone || !userId) {
    return res.status(400).json({ success: false, message: "Missing OTP, phone, or userId." });
  }

  // Verify OTP first
  const verificationResult = verifyOTP(phone, otp);
  if (!verificationResult.success) {
    return res.status(400).json(verificationResult);  // Return error if OTP is invalid
  }

  try {
    // Update the user's phone number using the userId
    const updatedUser = await userTable.findOneAndUpdate(
      { _id: userId },  // Find the user by userId
      { $set: { phone: phone } },  // Update the phone number
      { new: true }  // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.json({ success: true, message: "Phone number updated successfully." });

  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// verify otp
app.post('/login/verify-otp', async (req, res) => {
  const { loginInput, otp, signUp } = req.body;
  const storedOtpData = otpStore[loginInput];

  if (storedOtpData && storedOtpData.otp === parseInt(otp)) {
    const timeElapsed = Date.now() - storedOtpData.createdAt;
    if (timeElapsed < 5 * 60 * 1000) { // OTP valid for 5 mins
      try {
        // Handle signup logic
        if (signUp) {
          // Check if user already exists
          const existingUser = await userTable.findOne(
            storedOtpData.userType === 'phone' ? { phone: loginInput } : { email: loginInput }
          );

          if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists. Please log in." });
          }
          const unique_Id = generateOnivahId()
          // Add user to the database
          const newUser = new userTable({
            userId: `onivah_${unique_Id}`,
            [storedOtpData.userType === 'phone' ? 'phone' : 'email']: loginInput,
            entry_Time: new Date(),
          });

          await newUser.save();

          // Generate JWT token for new user
          const token = jwt.sign({ loginInput, userType: storedOtpData.userType }, process.env.JWT_SECRET_KEY, {
            expiresIn: 30 * 24 * 60 * 60 * 1000 // Token validity
          });

          // Set token in HttpOnly cookie
          res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,// 30 days in milliseconds,
            path: '/', // important to match the cookie path
          });

          return res.json({ success: true, message: "User registered successfully", token });
        } else {
          // Generate JWT token for login
          const token = jwt.sign({ loginInput, userType: storedOtpData.userType }, process.env.JWT_SECRET_KEY, {
            expiresIn: 30 * 24 * 60 * 60 * 1000 // Token validity
          });

          // Set token in HttpOnly cookie
          res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,// 30 days in milliseconds,
            path: '/', // important to match the cookie path
          });

          return res.json({ success: true, token });
        }
      } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
    } else {
      return res.json({ success: false, message: "OTP expired" });
    }
  } else {
    return res.json({ success: false, message: "Invalid OTP" });
  }
});


// user protected route
app.get('/protected-route', authenticateToken, async (req, res) => {
  if (!req.user) {
    return res.status(500).json({ error: 'User data not available' });
  }

  res.status(200).json({ user: req.user }); // Send the user data as JSON response
});


// save profile
app.post('/profile_save', async (req, res) => {
  try {
    const { firstname, lastname, email, phone, country, state, city, zipcode, userId } = req.body;


    // Find the user by userId
    const user = await userTable.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile details
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.phone = phone;
    user.country = country;
    user.state = state;
    user.city = city;
    user.zipcode = zipcode;

    // Save the updated user document
    await user.save();

    // Respond with success message
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error saving profile', error: error.message });
  }
});

// user send contact form 
app.post('/user/contact', async (req, res) => {
  const { fullName, email, phoneNumber, eventDate, eventType, message } = req.body;

  try {
    // Create a new contact document
    const newContact = new ContactForm({
      fullName,
      email,
      phoneNumber,
      eventDate,
      eventType,
      message,
    });

    // Save to the database
    await newContact.save();
    res.status(200).json({ message: 'Contact information submitted successfully!' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Something went wrong, please try again.' });
  }
});

// venue request submission
// app.post("/venue-submission", upload.any(), async (req, res) => {


//   try {
//     let { fullName, email, message, category, ...additionalFields } = req.body;

//     // Handle image uploads (if any)
//     const images = req.files?.map((file) => ({
//       filename: file.originalname,
//       mimetype: file.mimetype,
//       data: file.buffer.toString("base64"), // Convert to Base64 for easy storage
//     }));

//     // Create new document
//     const newRequest = new RequestedService({
//       fullName,
//       email,
//       message,
//       category,
//       additionalFields,
//       // images, // Store images
//     });

//     // Save to database
//     await newRequest.save();

//     res.status(200).json({ message: "Form submitted successfully!" });
//   } catch (error) {
//     console.error("Error saving form data:", error);
//     res.status(500).json({ message: "Failed to submit form.", error });
//   }
// });

// app.post('/venue-submission', uploadFile.single('file'), async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       message,
//       category,
//       ...additionalFields
//     } = req.body;

//     // If there is a single file (e.g., Aadhar card)
//     const file = req.file
//       ? {
//         filename: req.file.filename,
//         mimeType: req.file.mimetype,
//         size: req.file.size
//       }
//       : null;

//     // Save the data to the database
//     const newRequest = new RequestedService({
//       fullName,
//       email,
//       message,
//       category,
//       additionalFields,
//       file, // Store the single file (Aadhar card)
//     });

//     await newRequest.save();

//     console.log(newRequest);

//     res.status(200).json({ message: "Form submitted successfully!" });
//   } catch (error) {
//     console.error("Error saving form data:", error);
//     res.status(500).json({ message: "Failed to submit form.", error });
//   }
// });




// Fetch data by email or phone
app.get("/get/vendor-dashboard/services", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Step 1: Fetch requested services (category + linkedServiceId)
    const requestedServices = await RequestedService.find({ email, isApproved: true }).select("category linkedServiceId -_id");

    const db = mongoose.connection.db;

    // Optional: Get existing collection names to avoid querying non-existent ones
    const collectionsList = await db.listCollections().toArray();
    const existingCollections = collectionsList.map(col => col.name);

    // Step 2: Map through services and fetch the actual businessName from the linked collection
    const formattedServices = await Promise.all(
      requestedServices.map(async ({ category, linkedServiceId }) => {
        try {
          // Ensure the collection exists
          if (!existingCollections.includes(category)) {
            return { category, businessName: "N/A (collection not found)" };
          }

          // Use native MongoDB collection access
          const doc = await db
            .collection(category)
            .findOne({ _id: new mongoose.Types.ObjectId(linkedServiceId) }, { projection: { "additionalFields.businessName": 1 } });

          return {
            category,
            businessName: doc?.additionalFields?.businessName || "N/A",
          };
        } catch (err) {
          console.error(`Error accessing collection ${category}:`, err.message);
          return {
            category,
            businessName: "N/A (error)",
          };
        }
      })
    );

    res.status(200).json(formattedServices);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.get("/get/vendor-dashboard/services", async (req, res) => {
//   try {
//     const { email } = req.query;

//     if (!email) {
//       return res.status(400).json({ error: "Email is required." });
//     }

//     const query = { email };

//     // Fetch only the "category" field
//     const services = await RequestedService.find(query)
//       .select("category additionalFields -_id"); // Fetch entire additionalFields object

//     // Extract businessName from additionalFields
//     const formattedServices = services.map(service => ({
//       category: service.category,
//       businessName: service.additionalFields?.businessName || "N/A", // Handle missing business name
//     }));

//     res.status(200).json(formattedServices);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.put("/update-category-dates", async (req, res) => {
  try {
    const { category, businessName, dates, email } = req.body;

    if (!category || !businessName || !email || !dates || typeof dates !== "object") {

      return res.status(400).json({ error: "Invalid request data." });
    }

    // Get the collection dynamically
    const db = mongoose.connection.db;
    const categoryCollection = db.collection(category);

    // Find the document
    const existingCategory = await categoryCollection.findOne({
      "additionalFields.businessName": businessName,
      email: email
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Get existing dates
    let existingDates = existingCategory.dates || { booked: [], waiting: [], available: [] };

    // Function to remove date from all categories before adding to a new one
    const removeFromAllCategories = (date) => {
      existingDates.booked = existingDates.booked.filter(d => d !== date);
      existingDates.waiting = existingDates.waiting.filter(d => d !== date);
      existingDates.available = existingDates.available.filter(d => d !== date);
    };

    // Update dates
    Object.keys(dates).forEach(status => {
      dates[status].forEach(date => {
        removeFromAllCategories(date); // Remove from previous category
        existingDates[status].push(date); // Add to the correct category
      });
    });

    // Remove duplicates
    existingDates.booked = [...new Set(existingDates.booked)];
    existingDates.waiting = [...new Set(existingDates.waiting)];
    existingDates.available = [...new Set(existingDates.available)];

    // Update the document
    const updatedCategory = await categoryCollection.findOneAndUpdate(
      { "additionalFields.businessName": businessName, email: email },
      { $set: { dates: existingDates } }, // Save the cleaned-up dates
      { returnDocument: "after" }
    );

    res.status(200).json({ message: "Dates updated successfully", updatedCategory });

  } catch (error) {
    console.error("Error updating category dates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-category-dates", async (req, res) => {
  try {
    const { category, businessName, email } = req.query;

    if (!category || !businessName || !email) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    // Get the collection dynamically
    const db = mongoose.connection.db;
    const categoryCollection = db.collection(category);

    // Find the document with businessName and email
    const categoryData = await categoryCollection.findOne({
      "additionalFields.businessName": businessName,
      email: email
    });

    if (!categoryData) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Extract dates categorized as booked, waiting, available
    const { dates = { booked: [], waiting: [], available: [] } } = categoryData;

    res.status(200).json(dates);

  } catch (error) {
    console.error("Error fetching category dates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Create Stripe Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["Google Pay"],
      // automatic_payment_methods: { enabled: true },
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "Sample Product" },
          unit_amount: 1000, // $10
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: "http://localhost:3001/success",
      cancel_url: "http://localhost:3001/cancel",
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency,
      receipt: "receipt#1",
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
});

app.post("/capture-payment", async (req, res) => {
  const { payment_id, amount } = req.body;

  try {
    // 1. Fetch payment details using the ID
    const payment = await razorpay.payments.fetch(payment_id);

    // 2. Check if already captured
    if (payment.status === "captured") {

      return res.json({ success: true, message: "Payment already captured", payment });
    }

    // 3. Capture if not yet captured
    const response = await razorpay.payments.capture(payment_id, amount * 100, "INR");


    res.json({ success: true, captured: true, response });

  } catch (err) {
    console.error("PAYMENT CAPTURE ERROR:", err);
    res.status(500).json({ error: "Payment capture failed", details: err });
  }
});






//  SECRET - GoYD0RlpxBUMf8NUTo7CokuQvoyHIwkT
// SID - SKd87f2f4ead4f65284d93027e54cc8592



// Accept a Mongoose model instead of collection name
async function emptyCollectionAndGetCount(Model) {
  const result = await Model.deleteMany({});
  console.log(`Deleted ${result.deletedCount} documents from '${Model.collection.collectionName}'`);
  return result.deletedCount;
}

// await emptyCollectionAndGetCount(RequestedService);




// Port setup
const port = process.env.PORT || 4000; // Logical OR instead of bitwise OR
server.listen(port, () => {
  console.log("Node.js is running on port", port);
});

