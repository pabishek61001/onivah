import mongoose from "mongoose";

// Define Wedding Attire schema
const weddingAttireSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number },  // Optional field
    description: { type: String, required: true },
    weddingAttire_id: { type: String, required: true },  // For wedding attire, it can be like "wedding_attire_001"
    price: { type: Number, required: true },
    imageUrls: { type: [String], required: true }
});

const WeddingAttire = mongoose.model("WeddingAttire", weddingAttireSchema);

export default WeddingAttire;
