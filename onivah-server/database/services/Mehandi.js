import mongoose from "mongoose";

// Define Mehandi schema
const mehandiSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number },  // Optional field
    description: { type: String, required: true },
    mehandi_id: { type: String, required: true },  // For mehandi, it can be like "mehandi_001"
    price: { type: Number, required: true },
    imageUrls: { type: [String], required: true }
});

const Mehandi = mongoose.model("Mehandi", mehandiSchema);

export default Mehandi;
