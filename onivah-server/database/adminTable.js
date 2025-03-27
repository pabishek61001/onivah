import mongoose from "mongoose";

// Define the schema for the Admin
const adminSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userPassword: { type: String, required: true },
});

// Create a model for the Admin schema
const AdminTable = mongoose.model('AdminTable', adminSchema);


export default AdminTable;