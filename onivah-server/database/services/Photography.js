import mongoose from "mongoose";

// Define Photography schema
const photographySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number },  // Optional field
    description: { type: String, required: true },
    photography_id: { type: String, required: true },  // For photography, it can be like "photography_001"
    price: { type: Number, required: true },
    imageUrls: { type: [String], required: true }
});

const Photography = mongoose.model("Photography", photographySchema);

export default Photography;
