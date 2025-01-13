import mongoose from "mongoose";

// Define Jewelry schema
const jewelrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number },  // Optional field
    description: { type: String, required: true },
    jewelry_id: { type: String, required: true },  // For jewelry, it can be like "jewelry_001"
    price: { type: Number, required: true },
    imageUrls: { type: [String], required: true }
});

const Jewelry = mongoose.model("Jewelry", jewelrySchema);

export default Jewelry;
