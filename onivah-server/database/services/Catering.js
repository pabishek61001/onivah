import mongoose from "mongoose";

// Define Catering schema
const cateringSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number },  // Optional field
    description: { type: String, required: true },
    catering_id: { type: String, required: true },  // For catering, it can be like "catering_001"
    price: { type: Number, required: true },
    imageUrls: { type: [String], required: true }
});

const Catering = mongoose.model("Catering", cateringSchema);

export default Catering;
