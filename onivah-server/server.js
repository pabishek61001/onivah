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


dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);

app.options('*', cors());  // Preflight for all routes

// Middleware to parse JSON bodies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// GoogleRouter
app.use("/auth", authRouter);
app.use("/vendor", vendorRouter);
app.use("/admin", adminRouter);

app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

  })
);

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided." }); // Unauthorized
  }

  jwt.verify(token, "secretKey", async (err, user) => {
    if (err) {
      console.log(err);

      return res.status(403).json({ error: "Forbidden: Invalid token/Expired." }); // Forbidden

    }

    // console.log("User authenticated:", user); // Log the decoded user object

    try {
      // Fetch user data from MongoDB
      const userData = await userTable.findOne({
        $or: [{ email: user.loginInput }, { phone: user.loginInput }],
      }).lean();
      console.log(userData);

      if (!userData) {
        return res.status(404).json({ error: "User not found." }); // User not found
      }
      req.user = { ...user, ...userData }; // Combine JWT data and database data
      next(); // Proceed to the next middleware or route handler
    } catch (dbError) {

      res.status(500).json({ error: "Internal server error." }); // Internal server error
    }
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



// store otp
let otpStore = {};
// WhatsApp sending function

const accountSid = 'AC93a660151416ae6a93f897f268970391';
const authToken = '0abec704d8ae563a487552bfec46dd6a';
const whatsappNumber = "whatsapp:+14155238886"; //14173612159 Twilio WhatsApp sandbox number

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
      to: `whatsapp:+${phone}`,
      body: `Your OTP is: ${otp}. Please use this to verify your account.`,
    });
    console.log(`OTP sent to phone: ${phone}`);
    return { success: true, message: `OTP sent to phone: ${phone}` };
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Error sending SMS');
  }
}

// Helper function to send Email
function sendEmail(email, otp) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: 'pabishek61001@gmail.com',
      to: email,
      subject: 'OTP for your login',
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return reject(new Error('Error sending email'));
      }
      console.log('Email sent:', info.response);
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

// Helper function to handle OTP sending
async function handleOTPSending(req, res, isSignup) {
  const { phone, email, userType } = req.body;
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

// Login OTP 
app.post('/login/send-otp', (req, res) => handleOTPSending(req, res, false));

// Signup OTP 
app.post('/signup/send-otp', (req, res) => handleOTPSending(req, res, true));

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
          const token = jwt.sign({ loginInput, userType: storedOtpData.userType }, "secretKey", {
            expiresIn: '2d' // Token validity
          });

          return res.json({ success: true, message: "User registered successfully", token });
        } else {
          // Generate JWT token for login
          const token = jwt.sign({ loginInput, userType: storedOtpData.userType }, "secretKey", {
            expiresIn: '2d' // Token validity
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

  // console.log(req.user); // Logs the user data for debugging
  res.status(200).json({ user: req.user }); // Send the user data as JSON response
});


// save profile
app.post('/profile_save', async (req, res) => {
  try {
    const { firstname, lastname, email, phone, country, state, city, zipcode, userId } = req.body;

    // Log the incoming data for debugging
    console.log(firstname, lastname, email, phone, country, state, city, zipcode, userId);

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
app.post("/venue-submission", upload.array("images", 5), async (req, res) => {

  // Helper function to format category string
  const formatCategory = (category) => {
    return category
      .split("_") // Split by underscores
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" "); // Join with spaces
  };

  try {
    let { fullName, email, message, category, ...additionalFields } = req.body;


    // // Format category
    // if (category) {
    //   category = formatCategory(category);
    // }

    // Handle image uploads (if any)
    const images = req.files?.map((file) => ({
      filename: file.originalname,
      mimetype: file.mimetype,
      data: file.buffer.toString("base64"), // Convert to Base64 for easy storage
    }));

    // Create new document
    const newRequest = new RequestedService({
      fullName,
      email,
      message,
      category,
      additionalFields,
      // images, // Store images
    });

    // Save to database
    await newRequest.save();

    res.status(200).json({ message: "Form submitted successfully!", data: newRequest });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ message: "Failed to submit form.", error });
  }
});




//  SECRET - GoYD0RlpxBUMf8NUTo7CokuQvoyHIwkT
// SID - SKd87f2f4ead4f65284d93027e54cc8592







// Port setup
const port = process.env.PORT || 4000; // Logical OR instead of bitwise OR
server.listen(port, () => {
  console.log("Node.js is running on port", port);
});

