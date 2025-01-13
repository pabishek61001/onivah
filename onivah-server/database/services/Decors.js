import mongoose from "mongoose";

// Define Decors schema
const decorsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number },  // Optional field
    description: { type: String, required: true },
    decors_id: { type: String, required: true },  // For decors, it can be like "decors_001"
    price: { type: Number, required: true },
    imageUrls: { type: [String], required: true }
});

const Decors = mongoose.model("Decors", decorsSchema);

export default Decors;
