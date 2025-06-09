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
import { log } from "console";
import mongoose from "mongoose";
import connectDB from "../database/mongodbConfig.js";
import ApprovalLog from "../database/ApprovalLog.js";


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

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) {
        return res.status(403).json({ success: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ success: false, message: "Invalid token" });
        req.userName = decoded.userName;
        next();
    });
};

adminRouter.get('/admin-protected', verifyToken, async (req, res) => {
    try {
        const admin = await AdminTable.findOne(req.userName).select('-userPassword');
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

        res.status(200).json({ success: true, data: { message: "Welcome, Admin!", admin } });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
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
        const requestedServices = await RequestedService.find({ isApproved: false, declined: false });
        res.status(200).json(requestedServices);
    } catch (error) {
        console.error('Error fetching requested services:', error);
        res.status(500).json({ message: 'Failed to fetch data.' });
    }
});

// Route to get service details (including stored file info)
adminRouter.get('/get-file/:id', async (req, res) => {
    try {
        const service = await RequestedService.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${service.file.storedName}`;


        res.status(200).json({
            service,
            fileUrl,
        });
    } catch (err) {
        console.error('❌ Error fetching service:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Fetch only approved services
adminRouter.get('/approved-services', async (req, res) => {
    try {
        const approvedServices = await RequestedService.find({ isApproved: true });

        res.status(200).json(approvedServices);
    } catch (error) {
        console.error('Error fetching approved services:', error);
        res.status(500).json({ message: 'Failed to fetch data.' });
    }
});

// Fetch only approved services
adminRouter.get('/declined-services', async (req, res) => {
    try {
        const declinedServices = await RequestedService.find({ declined: true });

        res.status(200).json(declinedServices);
    } catch (error) {
        console.error('Error fetching approved services:', error);
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

// fetch admin card details
adminRouter.get("/fetch/dashboard-details", async (req, res) => {
    try {
        // Fetch all requested services
        const services = await RequestedService.find();
        // Initialize categorized data
        const categorizedData = {
            approved: { count: 0, services: [] },
            pending: { count: 0, services: [] },
            declined: { count: 0, services: [] },
            categories: [],
        };

        // Category-wise count map
        const categoryMap = new Map();

        services.forEach(service => {
            // Categorize based on status
            if (service.isApproved) {
                categorizedData.approved.count++;
                categorizedData.approved.services.push(service);
            } else if (service.declined) {
                categorizedData.declined.count++;
                categorizedData.declined.services.push(service);
            } else {
                categorizedData.pending.count++;
                categorizedData.pending.services.push(service);
            }

            // Update category count
            if (service.category) {
                categoryMap.set(service.category, (categoryMap.get(service.category) || 0) + 1);
            }
        });

        // Convert categoryMap to array
        categorizedData.categories = Array.from(categoryMap, ([name, count]) => ({ name, count }));

        res.status(200).json(categorizedData);
    } catch (error) {
        console.error("Error fetching requested services:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// adminRouter.post("/approve-service/:id", async (req, res) => {

//     // Function to get the model dynamically
//     const getCategoryModel = (categoryName) => {
//         const modelName = categoryName; // Convert spaces to underscores for the model name

//         if (mongoose.models[modelName]) {
//             return mongoose.models[modelName]; // Return existing model if already created
//         }

//         const serviceSchema = new mongoose.Schema({
//             fullName: String,
//             email: String,
//             category: String,
//             additionalFields: Object,
//             images: [String],
//         }, { collection: categoryName }); // Collection name remains the same

//         return mongoose.model(modelName, serviceSchema, categoryName); // Use modified model name
//     };

//     try {
//         const { id } = req.params;

//         // Fetch the requested service
//         const requestedService = await RequestedService.findById(id);
//         if (!requestedService) {
//             return res.status(404).json({ message: "Requested service not found" });
//         }

//         let { fullName, email, category, additionalFields, images } = requestedService;

//         // Get or create a separate collection for the category
//         const ServiceModel = getCategoryModel(category);

//         // Create a new service document
//         const newService = new ServiceModel({
//             fullName,
//             email,
//             category,
//             additionalFields,
//             images,
//         });

//         // Save the service to the specific category collection
//         await newService.save();

//         // Update requested service with isApproved and linkedServiceId
//         await RequestedService.findByIdAndUpdate(id, {
//             isApproved: true,
//             linkedServiceId: newService._id,
//         });

//         // Log the approval
//         const approvalLog = new ApprovalLog({
//             adminId: '6773d90316e366deccafd417', // Assuming the admin's ID is available in req.user (from authentication middleware)
//             approved: [
//                 {
//                     serviceName: additionalFields.businessName,
//                     serviceId: requestedService._id,
//                 },
//             ],
//         });

//         // Save the approval log
//         await approvalLog.save();

//         res.status(200).json({ message: `Service approved and added to ${category} collection` });
//     } catch (error) {
//         console.error("Error approving service:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });


adminRouter.post("/approve-service/:id", async (req, res) => {
    const getCategoryModel = (categoryName) => {
        const modelName = categoryName;

        if (mongoose.models[modelName]) {
            return mongoose.models[modelName];
        }

        const serviceSchema = new mongoose.Schema({
            fullName: String,
            email: String,
            category: String,
            additionalFields: { type: mongoose.Schema.Types.Mixed, default: {} },
            images: {
                type: Map,
                of: [String],
                default: {},
            },
        }, { collection: categoryName });

        return mongoose.model(modelName, serviceSchema, categoryName);
    };

    try {
        const { id } = req.params;
        console.log(id);

        const requestedService = await RequestedService.findById(id);
        if (!requestedService) {
            return res.status(404).json({ message: "Requested service not found" });
        }

        const { fullName, email, phone, category, additionalFields, images, file } = requestedService;

        // Split additionalFields
        const {
            lastName,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
            pincode,
            gstNumber,
            aadharNumber,
            businessName,
            ...otherFields // Catch any extras
        } = additionalFields;


        const ServiceModel = getCategoryModel(category);

        const newService = new ServiceModel({
            fullName,
            email,
            category,
            additionalFields: { ...otherFields, businessName },
            images,
        });

        await newService.save();

        await RequestedService.findByIdAndUpdate(id, {
            isApproved: true,
            linkedServiceId: newService._id,
        });

        // Create a new business object
        const newBusiness = {
            category,
            businessName,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
            pincode,
            gstNumber,
            aadharNumber,
            images,
            file, // Include the file object
            linkedServiceId: newService._id,
        };


        const vendorId = Math.floor(Date.now() / 1000);

        // Update the vendor with the new business details
        await VendorsTable.findOneAndUpdate(
            { email, phone }, // Match the vendor by email and phone
            {
                $set: {
                    name: fullName,
                    // email,
                    // phone,
                },
                $push: { businesses: newBusiness }, // Add new business to the vendor's businesses array
                $setOnInsert: { vendorId }, // Only set vendorId if new vendor
            },
            { upsert: true, new: true } // Create a new vendor if not found, otherwise return the updated one
        );

        const approvalLog = new ApprovalLog({
            adminId: '6773d90316e366deccafd417', // Replace with actual admin ID
            approved: [
                {
                    serviceName: businessName,
                    serviceId: requestedService._id,
                },
            ],
        });

        await approvalLog.save();


        res.status(200).json({
            message: `Service approved and added to ${category} collection, vendor registered with a new business.`,
        });

    } catch (error) {
        console.log("Error approving service:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});





// populate admin approved logs
const fetchApprovalLogs = async () => {
    try {
        const logs = await ApprovalLog.find({})
            .populate("adminId", "userName") // Only populate admin's userName
            .populate("approved.serviceId", "fullName email category additionalFields")
            .populate("declined.serviceId", "fullName email category declineReason");
        return logs;
    } catch (error) {
        console.error("❌ Error fetching approval logs:", error);
        throw error;
    }
};

// services count
async function requestCounts() {
    try {
        const requestCount = await RequestedService.countDocuments();
        console.log("Total requested services:", requestCount);
    } catch (error) {
        console.error("Error counting requested services:", error);
    }
}

// delete services
async function deleteTodaysRequestedServices() {
    try {
        // Get today's date
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth(); // Month is 0-based (0 = January, 1 = February, etc.)
        const currentDate = today.getDate();

        // Create a date object for the start of today (midnight)
        const startOfDay = new Date(currentYear, currentMonth, currentDate);

        // Create a date object for the start of the next day (midnight)
        const startOfNextDay = new Date(currentYear, currentMonth, currentDate + 1);

        // Delete the services created today
        const deletedServices = await RequestedService.deleteMany({
            createdAt: { $gte: startOfDay, $lt: startOfNextDay },
        });

        console.log(`Deleted ${deletedServices.deletedCount} requested services created today.`);
    } catch (error) {
        console.error("Error deleting today's requested services:", error);
    }
}
// deleteTodaysRequestedServices()

// Decline a requested service
adminRouter.put("/decline-service/:id", async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    try {
        const service = await RequestedService.findById(id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Update service as declined
        service.declined = true;
        service.declineReason = reason;
        await service.save();

        res.status(200).json({ message: "Service request declined successfully." });
    } catch (error) {
        console.error("Error declining service request:", error);
        res.status(500).json({ message: "Failed to decline request." });
    }
});

// const getCollections = async () => {
//     try {
//         await connectDB(); // Ensure the DB is connected
//         const collections = await mongoose.connection.db.listCollections().toArray();
//         console.log("All Collections in MongoDB:", collections.map(col => col.name));
//     } catch (error) {
//         console.error("Error fetching collections:", error);
//     }
// };

// getCollections();

// const getPartyHallCollection = async () => {
//     try {
//         await connectDB(); // Ensure the DB is connected
//         const partyHallCollection = mongoose.connection.db.collection('convention_center');
//         const documents = await partyHallCollection.find().toArray();
//         console.log("Documents in party_hall collection:", documents);
//     } catch (error) {
//         console.error("Error fetching documents from party_hall:", error);
//     }
// };

// getPartyHallCollection();


// DELETE service by category and ID
adminRouter.delete("/delete-service/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const requestedService = await RequestedService.findById(id);
        if (!requestedService) {
            return res.status(404).json({ message: "Requested service not found" });
        }

        const { category, linkedServiceId } = requestedService;

        const getCategoryModel = (categoryName) => {
            const modelName = categoryName;
            if (mongoose.models[modelName]) {
                return mongoose.models[modelName];
            }

            const serviceSchema = new mongoose.Schema({
                fullName: String,
                email: String,
                category: String,
                additionalFields: Object,
                images: [String],
            }, { collection: categoryName });

            return mongoose.model(modelName, serviceSchema, categoryName);
        };

        const ServiceModel = getCategoryModel(category);

        if (linkedServiceId) {
            await ServiceModel.findByIdAndDelete(linkedServiceId);
        }

        await RequestedService.findByIdAndDelete(id);

        res.status(200).json({ message: "Service deleted from both collections" });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});








export default adminRouter;
