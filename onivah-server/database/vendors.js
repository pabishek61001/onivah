import mongoose from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema({
    name: { type: String, },  // User's name (required)
    email: { type: String, unique: true },  // User's email (required and unique)
    phone: { type: Number, unique: true },  // Phone number
    password: { type: String, },  // User's password
    loginMethod: { type: String },  // Login method (Google, Facebook, etc.)
    entry_Time: { type: Date, default: Date.now }  // Auto-generated entry time
});

// Create the model for the user collection
const vendor = mongoose.model('vendor', userSchema);

export default vendor;
