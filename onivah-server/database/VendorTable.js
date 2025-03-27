import mongoose from "mongoose";
// Define the Vendor Schema
const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    vendorId: {
        type: Number,
        required: true,
        unique: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Vendor model
const VendorsTable = mongoose.model('VendorsTable', vendorSchema);

export default VendorsTable;