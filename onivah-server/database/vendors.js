import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid'; // install with `npm install uuid`

// Define the schema
const userSchema = new mongoose.Schema({
    vendorId: {
        type: String,
        unique: true,
        default: uuidv4 // Automatically generate a UUID when a vendor is created
    },
    name: { type: String },
    email: { type: String, unique: true },
    phone: { type: Number, unique: true },
    password: { type: String },
    loginMethod: { type: String },
    entry_Time: { type: Date, default: Date.now }
});

// Create the model for the user collection
const vendor = mongoose.model('vendor', userSchema);

export default vendor;
